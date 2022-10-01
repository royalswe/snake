import { writable } from 'svelte/store';

type GameState = 'waiting' | 'joined' | 'playing';

type Item = {
	id: string;
	content: string;
};

type State = {
	items: Array<Item>;
	messages: Array<string>;
	gameState: GameState
	error?: string;
};

const _state = writable<State>({
	items: [],
	messages: [],
	gameState: 'waiting'
});

export const state = {
	subscribe: _state.subscribe,
	update: _state.update,
	set: _state.set,
	setState: (value: GameState) => state.update((s) => ({ ...s, gameState: value }))
}

