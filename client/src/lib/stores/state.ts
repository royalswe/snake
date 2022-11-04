import { writable } from 'svelte/store';

type GameStatus = 'waiting' | 'running' | 'count-down';
type PlayeStatus = 'spectating' | 'joined' | 'ready' | 'running';

type Board = { width: number, height: number };

type State = {
	board: Board
	messages: Array<string>;
	gameStatus: GameStatus;
	playerStatus: PlayeStatus;
	error?: string;
};

const _state = writable<State>({
	board: {} as Board,
	messages: [],
	gameStatus: 'waiting',
	playerStatus: 'spectating'
});

export const state = {
	subscribe: _state.subscribe,
	update: _state.update,
	set: _state.set,
	setGameStatus: (value: GameStatus) => _state.update((s) => ({ ...s, gameStatus: value })),
	setPlayerStatus: (value: PlayeStatus) => _state.update((s) => ({ ...s, playerStatus: value })),
	setCounter: value => _state.update(self => {
		self.playerStatus = value
		return self  //!\\ this is important! Don't forget it
	})
};
