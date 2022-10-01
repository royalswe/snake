// Import the function which initializes a new mutable store.
import { board } from '$lib/stores/board';
import { state } from '$lib/stores/state';

// We also want to connect to websockets.  Svelte does
// server-side rendering _really well_ out of the box, so
// we will export a function that can be called by our root
// component after mounting to connnect
let ws: WebSocket;
export const connect = (socketURL: string) => {
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
		console.log('Connected with ping pong long!');
	});

	ws.addEventListener('message', (message: any) => {
		const data = JSON.parse(message.data);
		console.log(data);
		console.log(data.type);
		switch (data.type) {
			case 'chat-message':
				state.update((state) => ({ ...state, messages: [data.message].concat(state.messages) }));
				break;
			case 'game-state':
				board.set(data.message);
				break;
			case 'game-over':
				alert('game over');
				break;
			case 'game-status':
				state.update((s) => ({ ...s, gameState: data.message }));
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