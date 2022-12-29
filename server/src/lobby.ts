import { WebSocket } from 'uWebSockets.js';
import { sessions } from './games';

const decoder = new TextDecoder('utf-8');

export const lobby = (ws: WebSocket, message: BufferSource, isBinary: boolean) => {	
	ws.subscribe('lobby'); // subscribe to the room name
	const clientMsg = JSON.parse(decoder.decode(message));
	ws.send(clientMsg, isBinary, true); // sender only
};
