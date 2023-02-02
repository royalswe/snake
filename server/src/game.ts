import type { UrlParams } from './models/urlParams';
import Client from "./client";
import Session from "./session";
import { isEveryPlayerReady } from "./helpers/utils";
import { WebSocket } from 'uWebSockets.js';
import { VELOCITY } from './constants/constants';
import { EVENT } from './constants/sharedConstants';
import {
  FRAME_RATE,
  GAME_STATUS,
  PLAYER_STATUS,
} from "./constants/sharedConstants";

const decoder = new TextDecoder("utf-8");
export const sessions = new Map();

export default new (class Game {

  public open(ws: WebSocket): void {
    const username = ws?.user?.username || 'guest-' + Math.random().toString(36).substring(2, 6);
    ws.client = new Client(ws, username);
    ws.client.send(EVENT.open, { msg: username });
    ws.client.broadcast(EVENT.chat, { message: username + ' joined the room' });
  }

  public listen(ws: WebSocket, message: BufferSource, _isBinary: boolean): void {
    const client: Client = ws.client;

    const clientMsg = JSON.parse(decoder.decode(message));

    switch (clientMsg.type) {
      case EVENT.joinRoom: {
        const params = clientMsg.params;
        const roomName = params.room;

        client.room = roomName;
        ws.subscribe(roomName); // subscribe to the room name

        const session = this.getSession(roomName) || this.createSession(params);
        if (session.join(client) === false) {
          throw Error("Could not join game session"); // Could not join game session
        }
        client.send(EVENT.joinRoom, { width: session.width, height: session.height });

        client.roomEmit(EVENT.roomStatus, {
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
          client.session.timer.refresh();
        }
        client.send(EVENT.joinGame, { playerStatus: PLAYER_STATUS.joined });
        client.roomEmit(EVENT.roomStatus, {
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
        client.send(EVENT.playerReady, { playerStatus: client.status },
        );

        if (isEveryPlayerReady(session.clients)) {
          client.roomEmit(EVENT.gameStatus, { gameStatus: GAME_STATUS.countDown });
          // start count down
          session
            .countDown().then((gameStatus): void => {
              // store playing clients
              session.playingClients = [...session.clients].filter((v) => v.status === PLAYER_STATUS.ready);

              client.roomEmit(EVENT.gameStatus, { gameStatus });
              const cancelTimer = session.gameIntervall(() => {
                const winner = session.snakeGrow();

                if (winner) {
                  cancelTimer();
                  session.status = GAME_STATUS.waiting;

                  // client.send(EVENT.joinGame, { playerStatus: PLAYER_STATUS.joined });
                  client.roomEmit(EVENT.gameOver, { winner: winner, clients: this.updateClientList(client.session.room) });
                  // reset snakes
                  session.playingClients.forEach(client => client.setGamestate());
                } else {
                  client.roomEmit(EVENT.gameState, {
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
          client.gameState.vel = VELOCITY[clientMsg.key];
        }
        break;
      }

      case EVENT.chat: {
        client.roomEmit(EVENT.chat, {
          msg: clientMsg.message,
        });
        break;
      }
    }

  };

  private createSession(params: UrlParams): Session {
    this.validateUrlParameters(params);

    const { room } = params;
    if (sessions.has(room)) {
      throw new Error(`room ${room} already exists`);
    }

    const session = new Session(params);
    sessions.set(room, session);
    return session;
  }

  private updateClientList(room: string): object[] {
    const session = this.getSession(room);
    const clients = [...session.clients].map((client: any) => ({ clientId: client.id, clientStatus: client.status, color: client.color }));
    return clients;
  }

  public getSession(roomName: string): Session {
    return sessions.get(roomName);
  }

  public validateUrlParameters(params: UrlParams): void {
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

  public close(ws: WebSocket) {
    try {
      if (ws.client) {
        ws.client.session.leave(ws.client);
      }
    } catch (error) {
      console.error('remove client from session failed');
      console.error('session output: ' + ws.client);
    }
  }

  /* Here we echo the message back, using compression if available */
  //let ok = ws.send(message, isBinary, true); // sender only
  //ws.publish('home/sensors/temperature', message, isBinary, true); // to all except the sender
  //uws.publish(ws.client.room, JSON.stringify(serverMsg), isBinary, true); // to all


})();
