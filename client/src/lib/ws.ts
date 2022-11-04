import { board } from '$lib/stores/board';
import { state } from '$lib/stores/state';
import { PLAYER_STATUS } from './constants';
import { Event } from '$enums/event'

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
		console.log('open :)');

		if (params) {
			console.log('Connected! lets join ' + params.room);
			ws.send(JSON.stringify({ type: 'join-room', params }));
		}
	});

	ws.addEventListener('message', (message) => {
		const data = JSON.parse(message.data);
		console.log(data);

		switch (data.type) {
			case Event.gameState:
				board.set(data.msg);
				break;
			case Event.playerStatus:
				state.setPlayerStatus(data.msg);
				break;
			case Event.gameStatus:
				state.setGameStatus(data.msg);
				break;
			case Event.joinRoom:
				state.update((state) => ({ ...state, board: { width: data.width, height: data.height } }));
				break;
			case Event.chatMessage:
				state.update((state) => ({ ...state, messages: [data.msg].concat(state.messages) }));
				break;
			case Event.gameOver:
				//state.setGameStatus(GAME_STATUS.waiting);
				state.setCounter(PLAYER_STATUS.joined);
				//state.playerStatus = 'hej'
				console.log('winner is:', data.msg?.gamestate?.color);
				break;
			case Event.error:
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
