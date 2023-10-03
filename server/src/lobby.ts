import { prototype } from 'events';
import { WebSocket } from 'uWebSockets.js';
import { sessions } from './game';

const decoder = new TextDecoder('utf-8');

export default new (class Lobby {
  public listen(ws: WebSocket, message: BufferSource, isBinary: boolean) {
    ws.subscribe('lobby'); // subscribe to the room name
    const clientMsg: any = JSON.parse(decoder.decode(message));
    ws.send(clientMsg, isBinary, true); // sender only
  }

  public open(ws: WebSocket) {
    console.log('size', sessions.size);
    ws.send(JSON.stringify({ type: 'clientsPlaying', msg: sessions }));
  }
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
