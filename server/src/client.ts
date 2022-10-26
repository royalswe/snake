import type { WebSocket } from 'uWebSockets.js';
import type { GameState } from './models/gameState';
import type Session from './session';
import uws from "./uws";
import { COLOR, PLAYER_STATUS, VELOCITY } from "./constants/constants";
import { startPosition } from './helpers/utils';

export default class Client {
  ws: WebSocket;
  id: string;
  room: string;
  session!: Session;
  status: string;
  gameState!: GameState

  constructor(ws: WebSocket, room: string, id = Math.random().toString(16).slice(2)) {
    this.ws = ws;
    this.id = id;
    this.room = room;
    this.session;
    this.status = PLAYER_STATUS.spectating;
    this.gameState;
  }

  setGamestate() {
    const countPlayers: number = [...this.session.clients].filter(
      (v) => v.status !== PLAYER_STATUS.spectating
    ).length;
    const width = this.session.width;
    const height = this.session.height;
    // console.log([...this.session.clients]);

    this.gameState = {
      color: COLOR[countPlayers],
      pos: startPosition(width, height, countPlayers),
      vel: VELOCITY[Object.keys(VELOCITY)[countPlayers]],
      snake: [],
      grid: { x: width, y: height },
    };
  }
  /**
   * Send to local client only
   */
  send(message: object, isBinary = true, compress = true) {
    const ok = this.ws.send(JSON.stringify(message), isBinary, compress);
    if (!ok) {
      console.error("problem sending client msg from " + this.room);
    }
  }
  /**
   * Send to all clients in the same session except local user
   */
  broadcast(message: object, isBinary = true, compress = true) {
    this.ws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all except the sender
  }
  /**
   * Send to all clients in room
   */
  roomEmit(message: object, isBinary = true, compress = true) {
    uws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all
  }
}