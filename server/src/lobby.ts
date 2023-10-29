import type { WebSocket } from 'uWebSockets.js';

import { sessions } from './game';
import Emitter from './emitter';
import { LOBBY_EVENT as EVENT } from './constants/events';
import { getLobbyRooms } from './helpers/utils';

const decoder = new TextDecoder('utf-8');

export default new (class Lobby {
  public open(ws: WebSocket) {
    const username = ws?.user?.username || 'guest-' + Math.random().toString(36).substring(2, 6);
    ws.emitter = new Emitter(ws, username);
    ws.subscribe('lobby'); // subscribe to the room name
    ws.emitter.send(EVENT.updateRooms, { msg: getLobbyRooms(sessions) });
  }
  public listen(ws: WebSocket, message: BufferSource, isBinary: boolean) {
    const clientMsg: any = JSON.parse(decoder.decode(message));
    ws.emitter.send(clientMsg, isBinary, true); // sender only
  }



  // close(ws: WebSocket) {
  //   try {
  //     if (ws.client) {
  //       ws.client.session.leave(ws.client);
  //     }

  //     ws.client.roomEmit(EVENT.roomStatus, {
  //       clients: this.updateClientList(ws.client.room)
  //     });

  //   } catch (error) {
  //     console.error('remove client from session failed');
  //     console.error(error);
  //   }
  // }

  // export function Lobby(ws: WebSocket, message: BufferSource, isBinary: boolean) {
  //   ws.subscribe('lobby'); // subscribe to the room name
  //   const clientMsg = JSON.parse(decoder.decode(message));
  //   ws.send(clientMsg, isBinary, true); // sender only
  // }

  // Lobby.prototype.clientsPlaying = function() {
  //   console.log('size', sessions.size);
  //   // ws.send(JSON.stringify({ type: 'clientsPlaying', msg: sessions }));
  // };
})();

function stringifyWithoutCircularRefs(obj: any) {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        // If we're revisiting an object we've seen before, skip it
        return;
      }
      seen.add(value);
    }
    return value;
  });
}