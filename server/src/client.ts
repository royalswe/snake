import type { WebSocket } from 'uWebSockets.js';
import type { GameState } from './models/gameState';
import type Session from './session';
import uws from "./uws";
import { COLOR, VELOCITY } from "./constants/constants";
import { PLAYER_STATUS } from './constants/sharedConstants';
import { startPosition } from './helpers/utils';

export default class Client {
  ws: WebSocket;
  id: string;
  color!: string;
  room!: string;
  session!: Session;
  status: string;
  gameState!: GameState;

  constructor(ws: WebSocket, id: string) {
    this.ws = ws;
    this.id = id;
    this.status = PLAYER_STATUS.spectating;
  }

  setGamestate() {
    const width = this.session.width;
    const height = this.session.height;

    this.gameState = {
      color: this.color,
      pos: startPosition(width, height, this.color),
      vel: VELOCITY[Object.keys(VELOCITY)[COLOR[this.color]]],
      directionQueue: [],
      snake: [],
      grid: { x: width, y: height },
    };
  }
  /**
   * Send to local client only
   */
  send(type: string, message: Record<string, unknown>, isBinary = true, compress = true) {
    message = { type, ...message };
    const ok = this.ws.send(JSON.stringify(message), isBinary, compress);
    if (!ok) {
      console.error("problem sending client msg from " + this.room);
    }
  }
  /**
   * Send to all clients in the same session except local user
   */
  broadcast(type: string, message: Record<string, unknown>, isBinary = true, compress = true) {
    message = { type, clientId: this.id, ...message };
    this.ws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all except the sender
  }
  /**
   * Send to all clients in room
   */
  roomEmit(type: string, message: Record<string, unknown>, isBinary = true, compress = true) {
    message = { type, clientId: this.id, ...message };
    uws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all
  }
}