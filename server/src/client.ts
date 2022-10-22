import type { WebSocket } from 'uWebSockets.js';
import uws from "./uws";
import { GRID_HEIGHT, GRID_WIDTH, PLAYER_STATUS } from "./constants/constants";
import type { GameState } from './types/gameState';

export default class Client {
  ws: WebSocket;
  id: string;
  room: any;
  session: any;
  status: string;
  gameState: GameState

  constructor(ws: WebSocket, id = Math.random().toString(16).slice(2)) {
    this.ws = ws;
    this.id = id;
    this.room = null;
    this.session = null;
    this.status = PLAYER_STATUS.joined;

    this.gameState = {
      color: "grey",
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      snake: [],
      grid: { x: GRID_WIDTH, y: GRID_HEIGHT },
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