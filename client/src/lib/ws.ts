import { board } from '$lib/stores/board';
import { state } from '$lib/stores/state';
import { TYPE } from './constants';

let ws: WebSocket;
/**
 * Create a websocket connection
 * @param {string} socketURL 
 * @param params 
 * @returns 
 */
export const connect = (socketURL: string, params: Record<string, unknown>) => {
	console.log('url: ' + socketURL);

	ws = new WebSocket(socketURL);
	if (!ws) {
		// Store an error in our state.  The function will be
		// called with the current state;  this only adds the
		// error.
		state.update((s) => ({ ...s, error: 'Unable to connect' }));
		return;
	}

	ws.addEventListener('open', () => {
		// TODO: Set up ping/pong, etc.
		console.log('Connected! lets join ' + params.room);
		ws.send(JSON.stringify({ type: 'join-room', params }));
	});

	ws.addEventListener('message', (message) => {
		const data = JSON.parse(message.data);
		console.log(data);

		switch (data.type) {
			case TYPE.gameState:
				board.set(data.msg);
				break;
			case TYPE.playerStatus:
				state.setPlayerStatus(data.msg);
				break;
			case TYPE.gameStatus:
				state.setGameStatus(data.msg);
				break;
			case TYPE.joinRoom:
				state.update((state) => ({ ...state, board: { width: data.width, height: data.height } }));
				break;
			case TYPE.chatMessage:
				state.update((state) => ({ ...state, messages: [data.msg].concat(state.messages) }));
				break;
			case TYPE.error:
				state.update((state) => ({ ...state, error: data.msg }));
				break
			default:
				console.log('unknown emit from server');
				break;
		}
	});

	ws.addEventListener('close', (message) => {
		console.log('Disconnected:', message);
		//state.update((state) => ({ ...state, error: message }));
	});

	ws.addEventListener('error', (err) => {
		console.log('websocket error:', err);
	});
};

export const send = (message: unknown) => {
	// Send the message to the server.
	ws.send(JSON.stringify(message));
};
