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
  colorId!: number;
  room: string;
  session!: Session;
  status: string;
  gameState!: GameState

  constructor(ws: WebSocket, room: string, id = Math.random().toString(16).slice(2)) {
    this.ws = ws;
    this.id = id;
    this.room = room;
    this.status = PLAYER_STATUS.spectating;
  }

  setGamestate() {
    // TODO: countPlayer wont work in real world
    // const countPlayers: number = [...this.session.clients].filter(
    //   (v) => v.status !== PLAYER_STATUS.spectating
    // ).length;
    const width = this.session.width;
    const height = this.session.height;
		const color = COLOR[this.colorId];
    
    this.gameState = {
      color: color,
      pos: startPosition(width, height, this.colorId),
      vel: VELOCITY[Object.keys(VELOCITY)[this.colorId]],
      snake: [],
      grid: { x: width, y: height },
    };
  }
  /**
   * Send to local client only
   */
  send(message: Record<string, any>, isBinary = true, compress = true) {
    const ok = this.ws.send(JSON.stringify(message), isBinary, compress);
    if (!ok) {
      console.error("problem sending client msg from " + this.room);
    }
  }
  /**
   * Send to all clients in the same session except local user
   */
  broadcast(message: Record<string, any>, isBinary = true, compress = true) {
    message.clientId = this.id;
    this.ws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all except the sender
  }
  /**
   * Send to all clients in room
   */
  roomEmit(message: Record<string, any>, isBinary = true, compress = true) {
    message.clientId = this.id;
    uws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all
  }
}