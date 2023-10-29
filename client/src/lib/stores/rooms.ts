import { writable } from 'svelte/store';

type Rooms = {
	name: string;
	status: string,
	clientIds: string[];
};

const _message = writable<Rooms[]>([]);

export const rooms = {
	subscribe: _message.subscribe,
	update: _message.update,
	set: _message.set,
	add: (value: Rooms) => _message.update((self) => [...self, value])
};
