import { writable } from 'svelte/store';

type State = {
	messages: Array<string>;
};

const _message = writable<State>({
	messages: []
});

export const chat = {
	subscribe: _message.subscribe,
	update: _message.update,
	set: _message.set,
};
