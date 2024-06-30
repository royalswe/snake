import type { UrlParams } from '$models/urlParams';
import { useState } from '$lib/stores/state.svelte';
import { EVENT } from '$server/constants/events';
import { gameMessageHandler } from './gameMessageHandler';
import { lobbyMessageHandler } from './lobbyMessageHandler';

const states = useState();
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
	const context = socketURL.split('/').pop();

	if (!ws) {
		// Store an error in our state.  The function will be
		// called with the current state;  this only adds the
		// error.
		states.error = 'Unable to connect';
		return;
	}
	ws.binaryType = 'arraybuffer';

	ws.addEventListener('open', () => {
		if (params) {
			console.log('Connected! lets join ' + params.room);
			send(EVENT.joinRoom, { params });
		}
	});

	ws.addEventListener('message', ({ data }) => {
		const msg = data instanceof ArrayBuffer ? JSON.parse(decoder.decode(data)) : JSON.parse(data);

		if (context === 'lobby') {
			lobbyMessageHandler(msg);
		} else if (context === 'room') {
			gameMessageHandler(msg);
		}
	});

	ws.addEventListener('close', (message) => {
		console.log('Disconnected:', message);
		//state.update((state) => ({ ...state, error: message }));
	});

	ws.addEventListener('error', (err) => {
		console.log('websocket error:', err);
		states.error = 'Server encountered an error';
	});
};

export const send = (type: string, message: Record<string, unknown>): void => {
	if (!ws || ws.readyState !== WebSocket.OPEN) {
		console.error('WebSocket is not open.');
		return;
	}
	message = Object.assign({ type }, message);
	ws.send(JSON.stringify(message));
};
