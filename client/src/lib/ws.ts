import { board } from '$lib/stores/board';
import { state } from '$lib/stores/state';
import { chat } from '$lib/stores/chat';
import { EVENT, GAME_STATUS, PLAYER_STATUS } from '$lib/constants';
import type { UrlParams } from '$models/urlParams';

const decoder = new TextDecoder("utf-8");
let ws: WebSocket;
/**
 * Create a websocket connection
 * @param {string} socketURL
 * @param params
 * @returns
 */
export const connect = (socketURL: string, params?: UrlParams) => {
	ws = new WebSocket(socketURL);
	if (!ws) {
		// Store an error in our state.  The function will be
		// called with the current state;  this only adds the
		// error.
		state.update((s) => ({ ...s, error: 'Unable to connect' }));
		return;
	}
	ws.binaryType = 'arraybuffer';

	ws.addEventListener('open', () => {
		if (params) {
			console.log('Connected! lets join ' + params.room);
			send(EVENT.joinRoom, { params });
		}
	});
	ws.binaryType = "arraybuffer";

	ws.addEventListener('message', ({ data }) => {
		const msg = data instanceof ArrayBuffer ? JSON.parse(decoder.decode(data)) : JSON.parse(data);
		console.log(msg);

		switch (msg.type) {
			case EVENT.gameState:
				board.set(msg.data);
				break;
			case EVENT.open:
				state.update((state) => ({ ...state, you: msg.msg }));
				chat.add({ message: 'Welcome to the snake game!' });
				break;
			case EVENT.joinGame:
				state.setPlayerStatus(msg.playerStatus);
				break;
			case EVENT.gameStatus:
				state.setGameStatus(msg.gameStatus);
				break;
			case EVENT.joinRoom:
				state.update((state) => ({
					...state,
					board: { width: msg.width, height: msg.height } // save the canvas measures
				}));
				break;
			case EVENT.roomStatus:
				state.update((self) => ({ ...self, clients: msg.clients })); // update status of clients in room
				break;
			case EVENT.chat:
				chat.add(msg.msg);
				break;
			case EVENT.playerReady:
				state.setPlayerStatus(msg.playerStatus);
				break;
			case EVENT.gameOver:
				state.update((state) => ({ ...state, playerStatus: state.playerStatus === PLAYER_STATUS.ready ? PLAYER_STATUS.joined : PLAYER_STATUS.spectating }));
				state.setGameStatus(GAME_STATUS.waiting);
				chat.add({ message: msg.winner });
				state.update((self) => ({ ...self, clients: msg.clients })); // update status of clients in room
				break;
			case EVENT.error:
				state.update((state) => ({ ...state, error: msg.msg }));
				break;
			default:
				console.log('unknown emit from server', msg);
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

export const send = (type: string, message: Record<string, unknown>): void => {
	message = Object.assign({ type }, message);
	// Send the message to the server.
	ws.send(JSON.stringify(message));
};