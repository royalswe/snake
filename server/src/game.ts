import type { UrlParams } from './models/urlParams';
import type { WebSocket } from 'uWebSockets.js';

import Client from "./client";
import Session from "./session";
import Emitter from './emitter';
import { getLobbyRooms, isEveryPlayerReady } from "./helpers/utils";
import { VELOCITY, FRAME_RATE } from './constants/constants';
import { EVENT, LOBBY_EVENT } from './constants/events';
import {
  GAME_STATUS,
  PLAYER_STATUS,
} from "./constants/status";

const decoder = new TextDecoder("utf-8");
export const sessions = new Map<string, Session>();

export default new (class Game {

  public open(ws: WebSocket): void {
    const username = ws.user?.username || 'guest-' + Math.random().toString(36).substring(2, 6);

    ws.client = new Client(username);
    ws.emitter = new Emitter(ws, username);
    ws.emitter.send(EVENT.open, { msg: username });
    ws.emitter.broadcast(EVENT.chat, { message: username + ' joined the room' });
  }

  public listen(ws: WebSocket, message: BufferSource, _isBinary: boolean): void {
    const client: Client = ws.client;
    const clientMsg: any = JSON.parse(decoder.decode(message));

    switch (clientMsg.type) {
      case EVENT.joinRoom: {
        const params = clientMsg.params;
        const roomName: string = params.room;

        if (!roomName) {
          throw Error("There is no room name");
        }

        // update rooms in lobby
        ws.emitter.lobby(LOBBY_EVENT.updateRooms, { msg: getLobbyRooms(sessions) });

        ws.emitter.room = roomName;
        ws.subscribe(roomName); // subscribe to the room name

        const session = this.getSession(roomName) || this.createSession(params);
        if (session.join(client) === false) {
          throw Error("Could not join game session"); // Could not join game session
        }
        ws.emitter.send(EVENT.joinRoom, { width: session.width, height: session.height });

        ws.emitter.roomEmit(EVENT.roomStatus, {
          clients: this.updateClientList(roomName)
        });
        break;
      }

      case EVENT.joinGame: {
        // TODO: check if possible to join
        client.color = clientMsg.color;
        client.setGamestate();
        client.status = PLAYER_STATUS.joined;

        if (client.session.status === GAME_STATUS.countDown) {
          // cancel timeout on client

          client.session.timer = null;

          // send game status to all clients
          client.session.status = GAME_STATUS.waiting;
          ws.emitter.roomEmit(EVENT.gameStatus, { gameStatus: GAME_STATUS.waiting });
          // change client status to joined if there status is ready
          client.session.clients.forEach((client) => {
            if (client.status === PLAYER_STATUS.ready) {
              // change client status to joined
              client.status = PLAYER_STATUS.joined;
              ws.emitter.send(EVENT.playerReady, { playerStatus: PLAYER_STATUS.joined });
            }
          });
        }

        ws.emitter.send(EVENT.joinGame, { playerStatus: PLAYER_STATUS.joined });
        ws.emitter.roomEmit(EVENT.roomStatus, {
          clients: this.updateClientList(client.session.room)
        });
        break;
      }

      case EVENT.playerReady: {
        const session: Session = client.session;
        if (!session) {
          throw Error("can not be ready if not joined session");
        }

        if (session.status === GAME_STATUS.running || client.status !== PLAYER_STATUS.joined) {
          throw Error("game already started or you have not join the game"); // if game is allready started or player clicked ready when not joined
        }

        client.status = PLAYER_STATUS.ready;
        ws.emitter.send(EVENT.playerReady, { playerStatus: client.status });
        ws.emitter.roomEmit(EVENT.roomStatus, {
          clients: this.updateClientList(client.session.room)
        });

        if (isEveryPlayerReady(session.clients)) {
          // change game status to count down
          session.status = GAME_STATUS.countDown;
          ws.emitter.roomEmit(EVENT.gameStatus, { gameStatus: GAME_STATUS.countDown });
          // start count down
          session
            .countDown().then((gameStatus): void => {
              // store playing clients
              session.playingClients = [...session.clients].filter((v) => v.status === PLAYER_STATUS.ready);

              ws.emitter.roomEmit(EVENT.gameStatus, { gameStatus });
              const cancelTimer = session.gameIntervall(() => {
                const winner = session.snakeGrow();

                if (winner) {
                  cancelTimer();
                  session.status = GAME_STATUS.waiting;
                  // client.send(EVENT.joinGame, { playerStatus: PLAYER_STATUS.joined });
                  ws.emitter.roomEmit(EVENT.gameOver, { winner: winner, clients: this.updateClientList(client.session.room) });
                  // reset snakes
                  session.playingClients.forEach(client => client.setGamestate());
                } else {
                  ws.emitter.roomEmit(EVENT.gameState, {
                    data: [...session.playingClients].map((v) => v.gameState),
                  });
                }
              }, 10000 / FRAME_RATE);
            })
            .catch((error: Error) => console.error(error));
        }
        break;
      }
      case EVENT.movement: {
        if (client.status === PLAYER_STATUS.ready) {
          client.gameState.directionQueue.push(VELOCITY[clientMsg.key]);
        }
        break;
      }

      case EVENT.chat: {
        clientMsg.datetime = new Date().toLocaleString();
        ws.emitter.roomEmit(EVENT.chat, clientMsg);
        break;
      }
    }

  };

  private createSession(params: UrlParams): Session {
    this.validateUrlParameters(params);

    const { room } = params;
    if (!room) throw Error(`Room don't have any name`);

    if (sessions.has(room)) {
      throw Error(`room ${room} already exists`);
    }

    const session = new Session(params);
    sessions.set(room, session);

    return session;
  }

  updateClientList(room: string) {
    const session = this.getSession(room);
    if (!session) {
      return null;
    }
    const clients = [...session.clients].map((client: any) => ({ clientId: client.id, clientStatus: client.status, color: client.color }));
    return clients;
  }

  getSession(roomName: string) {
    const session = sessions.get(roomName);
    if (!session) {
      return false;
    }
    return session;
  }

  validateUrlParameters(params: UrlParams): void {
    const { room, width, height } = params;
    if (!room || !width || !height) {
      throw Error('Parameters "room and board" must be set');
    }
    if (!Number.isInteger(width) && !Number.isInteger(height)) {
      if (width < 10 && height < 10) {
        throw Error('Board parameter must be at least 10:10');
      }
      throw Error('Board parameter must be a integer');
    }
  }

  close(ws: WebSocket) {
    try {
      if (ws.client) {
        ws.client.session.leave(ws.client);
      }

      ws.emitter.roomEmit(EVENT.roomStatus, {
        clients: this.updateClientList(ws.client.session.room)
      });

    } catch (error) {
      console.error('remove client from session failed');
      console.error(error);
    }
  }

})();
