import { board } from '$lib/stores/board';
import { state } from '$lib/stores/state';
import { chat } from '$lib/stores/chat';
import { PLAYER_STATUS } from '$lib/constants';
import { EVENT } from '$lib/constants';

let ws: WebSocket;
/**
 * Create a websocket connection
 * @param {string} socketURL
 * @param params
 * @returns
 */
export const connect = (socketURL: string, params?: Record<string, unknown>) => {
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

		if (params) {
			console.log('Connected! lets join ' + params.room);
			ws.send(JSON.stringify({ type: EVENT.joinRoom, params }));
		}
	});

	ws.addEventListener('message', (message) => {
		const data = JSON.parse(message.data);

		switch (data.type) {
			case EVENT.gameState:
				board.set(data.msg);
				break;
			case EVENT.joinGame:
				state.setPlayerStatus(data.msg);
				// TODO: rendundant
				state.update((self) => ({ ...self, clients: data.clients })); // update status of clients in room
				break;
			case EVENT.gameStatus:
				state.setGameStatus(data.msg);
				break;
			case EVENT.joinRoom:
				if (data.clientId === data.you) {
					state.set('you', data.you);
					state.update((state) => ({
						...state,
						board: { width: data.width, height: data.height } // save the canvas measures
					}));
				} else {
					chat.add({ message: data.clientId + ' joined the room' });
				}
				state.update((self) => ({ ...self, clients: data.clients })); // update status of clients in room
				break;
			case EVENT.chat:
				chat.add(data.msg);
				break;
			case EVENT.playerReady:
				state.setPlayerStatus(data.msg); // TODO: update all clients instead
				break;
			case EVENT.gameOver:
				state.setPlayerStatus(PLAYER_STATUS.joined);
				console.log('winner is:', data.msg?.gamestate?.color);
				break;
			case EVENT.error:
				state.update((state) => ({ ...state, error: data.msg }));
				break;
			default:
				console.log('unknown emit from server', data);
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
