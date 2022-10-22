import { writable } from 'svelte/store';

type GameState = 'waiting' | 'running' | 'count-down';
type PlayeState = 'spectating' | 'joined' | 'ready' | 'running';

type Item = {
	id: string;
	content: string;
};

type State = {
	items: Array<Item>;
	messages: Array<string>;
	gameState: GameState;
	playerState: PlayeState;
	error?: string;
};

const _state = writable<State>({
	items: [],
	messages: [],
	gameState: 'waiting',
	playerState: 'spectating'
});

export const state = {
	subscribe: _state.subscribe,
	update: _state.update,
	set: _state.set,
	setGameState: (value: GameState) => state.update((s) => ({ ...s, gameState: value })),
	setPlayerState: (value: PlayeState) => state.update((s) => ({ ...s, playerState: value }))
};
