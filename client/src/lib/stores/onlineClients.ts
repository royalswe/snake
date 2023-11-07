import { writable } from 'svelte/store';

const _clients = writable<string[]>([]);

export const clients = {
	subscribe: _clients.subscribe,
	set: _clients.set,
};
