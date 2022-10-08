// Import the function which initializes a new mutable store.
import { board } from '$lib/stores/board';
import { state } from '$lib/stores/state';

// We also want to connect to websockets.  Svelte does
// server-side rendering _really well_ out of the box, so
// we will export a function that can be called by our root
// component after mounting to connnect
let ws: WebSocket;
export const connect = (socketURL: string, roomName: string) => {
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
		console.log('Connected! lets join ' + roomName);
		ws.send(JSON.stringify({ type: 'join-room', msg: roomName }));
	});

	ws.addEventListener('message', (message: any) => {
		const data = JSON.parse(message.data);
		console.log(data);

		switch (data.type) {
			case 'game-state':
				board.set(data.msg);
				break;
			case 'player-status':
				state.setPlayerState(data.msg);
				break;
			case 'game-status':
				state.setGameState(data.msg);
				break;
			case 'game-started':
				break;
			case 'chat-message':
				state.update((state) => ({ ...state, messages: [data.msg].concat(state.messages) }));
				break;
			default:
				state.update((state) => ({ ...state, items: [data].concat(state.items) }));
				break;
		}
	});

	ws.addEventListener('close', (_message: any) => {
		console.log('Disconnected!');
	});

	ws.addEventListener('error', (err: any) => {
		console.log(err);
	});
};

export const send = (message: unknown) => {
	// Send the message to the server.
	ws.send(JSON.stringify(message));
};
