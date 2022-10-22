import Client from "./client";
import Session from "./session";

import {
  COLOR,
  FRAME_RATE,
  GAME_STATUS,
  PLAYER_STATUS,
  TYPE,
  START_POSITION,
  VELOCITY,
} from "./constants/constants";
import { isEveryStatusSame, velocity } from "./helpers/utils";
import { WebSocket } from 'uWebSockets.js';

const decoder = new TextDecoder("utf-8");
const sessions = new Map();

function createSession(roomName: string) {
  if (sessions.has(roomName)) {
    throw new Error(`room ${roomName} already exists`);
  }
  const session = new Session(roomName);
  sessions.set(roomName, session);
  return session;
}

function getSession(roomName: string) {
  return sessions.get(roomName);
}

function setStartPosition(client: Client) {
  const countPlayers: number = [...client.session.clients].map(
    (v) => v.gameStatus !== PLAYER_STATUS.spectating
  ).length;

  client.gameState.pos = START_POSITION[countPlayers];
  client.gameState.color = COLOR[countPlayers];
  client.gameState.vel = VELOCITY[countPlayers];
}

export const game = (ws: WebSocket, message: BufferSource, isBinary: boolean) => {
  /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well  */

  const clientMsg = JSON.parse(decoder.decode(message));

  switch (clientMsg.type) {
    case TYPE.movement: {
      ws.client.gameState.vel = velocity[clientMsg.msg];
      break;
    }
    case TYPE.resetGame: {
      //objectchanger(ws.client.gamestate, 'snake', { x: 1, y: 10 });
      //ws.client.gameState = { ...resetGameState };
      break;
    }
    case TYPE.joinRoom: {
      const params = clientMsg.params;
      const roomName = params.roomName;

      ws.client = new Client(ws);
      ws.subscribe(roomName); // subscribe to the room name
      ws.client.room = roomName;
      const session = getSession(roomName) || createSession(roomName);
      if (session.join(ws.client) === false) {
        return console.error("Could not join game session"); // Could not join game session
      }
      //ws.client.send({ type: TYPE.joinRoom, msg: ws.client.gameState.grid }, isBinary) ;
      break;
    }
    case TYPE.playerReady: {
      const session = ws.client.session;
      if (!session) {
        return console.error("can not be status ready if not joined session");
      }
      if (
        session.status === GAME_STATUS.running ||
        ws.client.status !== PLAYER_STATUS.joined
      ) {
        return console.error("game already started"); // if game is allready started or player clicked ready when not joined
      }
      ws.client.status = PLAYER_STATUS.ready;
      ws.client.send(
        { type: TYPE.playerStatus, msg: ws.client.status },
        isBinary
      );

      if (isEveryStatusSame(session.clients, PLAYER_STATUS.ready)) {
        ws.client.roomEmit(
          {
            type: "game-status",
            msg: GAME_STATUS.countDown,
          },
          isBinary
        );
        // start count down
        session
          .countDown()
          .then((value: object) => {
            ws.client.roomEmit(value, isBinary);
            const cancelTimer = session.gameIntervall(() => {
              const winner = session.snakeGrow();

              if (winner) {
                ws.client.roomEmit({ type: "game-over" }, isBinary);
                cancelTimer();
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

    case TYPE.joinGame: {
      setStartPosition(ws.client);
      ws.client.send(
        {
          type: TYPE.playerStatus,
          msg: PLAYER_STATUS.joined,
        },
        isBinary
      );
      break;
    }
    case TYPE.chatMessage: {
      ws.client.roomEmit(
        {
          type: "chat-message",
          msg: clientMsg.message,
        },
        isBinary
      );
      break;
    }
  }

  /* Here we echo the message back, using compression if available */
  //let ok = ws.send(message, isBinary, true); // sender only
  //ws.publish('home/sensors/temperature', message, isBinary, true); // to all except the sender
  //uws.publish(ws.client.room, JSON.stringify(serverMsg), isBinary, true); // to all
};

export const close = (ws: WebSocket, _code: any, _msg: any) => {
  console.log("WebSocket closed");
  try {
    ws.client.session.leave(ws.client);
  } catch (error) {
    console.error("remove client from session failed");
    console.error("session output: " + sessions);
  }
};
