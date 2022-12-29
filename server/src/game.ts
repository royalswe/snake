import type { UrlParams } from './models/urlParams';
import Client from "./client";
import Session from "./session";
import { isEveryStatusSame } from "./helpers/utils";
import { WebSocket } from 'uWebSockets.js';
import { VELOCITY } from './constants/constants'
import { EVENT } from './constants/sharedConstants'
import {
  FRAME_RATE,
  GAME_STATUS,
  PLAYER_STATUS,
} from "./constants/sharedConstants";

const decoder = new TextDecoder("utf-8");
export const sessions = new Map();



export default new (class Game {
 public listen(ws: WebSocket, message: BufferSource, isBinary: boolean) :void {

  const clientMsg = JSON.parse(decoder.decode(message));

  switch (clientMsg.type) {
    case EVENT.joinRoom: {
      const params = clientMsg.params;
      const roomName = params.room;

      ws.client = new Client(ws, roomName);
      ws.subscribe(roomName); // subscribe to the room name

      const session = this.getSession(roomName) || this.createSession(params);
      if (session.join(ws.client) === false) {
        throw Error("Could not join game session"); // Could not join game session
      }
      // send playerId, status, id
      console.log(session.clients);
      
      ws.client.send({ type: EVENT.joinRoom, width: session.width, height: session.height, clients: session.clients }, isBinary);
      ws.client.broadcast({type: EVENT.chat, msg: `${ws.client.id} joined the room`}, isBinary)
      break;
    }

    case EVENT.joinGame: {
      ws.client.setGamestate();
      ws.client.status = PLAYER_STATUS.joined
      if (ws.client.session.status === GAME_STATUS.countDown) {
        // cancel timeout on client
        ws.client.session.timer.refresh()
      }
      ws.client.roomEmit({
        type: EVENT.playerStatus,
        msg: PLAYER_STATUS.joined,
      }, isBinary);
      break;
    }

    case EVENT.playerReady: {
      const session = ws.client.session;
      if (!session) {
        throw Error("can not be ready if not joined session");
      }
      if (session.status === GAME_STATUS.running || ws.client.status !== PLAYER_STATUS.joined) {
        throw Error("game already started or you have not join the game"); // if game is allready started or player clicked ready when not joined
      }
      ws.client.status = PLAYER_STATUS.ready;
      ws.client.roomEmit(
        { type: EVENT.playerStatus, msg: ws.client.status },
        isBinary
      );

      console.log('checka status');
      
      console.log(isEveryStatusSame(session.clients, PLAYER_STATUS.ready));
      
      if (isEveryStatusSame(session.clients, PLAYER_STATUS.ready)) {
        ws.client.roomEmit({
          type: EVENT.gameStatus,
          msg: GAME_STATUS.countDown,
        }, isBinary);
        // start count down
        session
          .countDown().then((value: object) => {

            ws.client.roomEmit(value, isBinary);
            const cancelTimer = session.gameIntervall(() => {
              const winner = session.snakeGrow();

              if (winner) {
              console.log(winner);

                ws.client.roomEmit({ type: EVENT.gameOver, msg: winner.gameState }, isBinary);
                cancelTimer();
                // reset snakes
                [...session.clients].forEach(client => {
                  const startPosition = client.gameState.snake[0];
                  client.gameState.snake = [];
                  client.gameState.pos = startPosition                  
                });


              } else {
                ws.client.roomEmit({
                  type: "game-state",
                  msg: [...session.clients].map((v) => v.gameState),
                }, isBinary);
              }
            }, 10000 / FRAME_RATE);
          })
          .catch((error: Error) => console.error(error));
      }
      break;
    }
    case EVENT.movement: {
      ws.client.gameState.vel = VELOCITY[clientMsg.msg];
      break;
    }

    case EVENT.chat: {
      ws.client.roomEmit({
        type: "chat-message",
        msg: clientMsg.message,
      }, isBinary);
      break;
    }
   }
   
  };

   private createSession(params: UrlParams) {
    this.validateUrlParameters(params);
  
    const { room } = params
    if (sessions.has(room)) {
      throw new Error(`room ${room} already exists`);
    }
  
    const session = new Session(params);
    sessions.set(room, session);
    return session;
  }
  
  public getSession(roomName: string) {
    return sessions.get(roomName);
  }
  
  public validateUrlParameters(params: UrlParams): void {
    const { room, width, height } = params;
    if (!room || !width || !height) {
      throw Error('Parameters "room and board" must be set')
    }
    if (!Number.isInteger(width) && !Number.isInteger(height)) {
      if (width < 10 && height < 10) {
        throw Error('Board parameter must be at least 10:10')
      }
      throw Error('Board parameter must be a integer');
    }
  }

  
  public open(ws: WebSocket) {
    ws.send(
      JSON.stringify({ type: EVENT.chat, msg: 'Welcome to the snake game!' })
    );
  }

  /* Here we echo the message back, using compression if available */
  //let ok = ws.send(message, isBinary, true); // sender only
  //ws.publish('home/sensors/temperature', message, isBinary, true); // to all except the sender
  //uws.publish(ws.client.room, JSON.stringify(serverMsg), isBinary, true); // to all
 
  
})();
