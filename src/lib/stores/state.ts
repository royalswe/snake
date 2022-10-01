import { writable } from 'svelte/store';

type Item = {
	id: string;
	content: string;
};

type State = {
	items: Array<Item>;
	messages: Array<string>;
	gameState: string;
	error?: string;
};

export const state = writable<State>({
	items: [],
	messages: [],
	gameState: 'waiting'
});
