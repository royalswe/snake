import { writable } from 'svelte/store';

type GameStatus = 'waiting' | 'running' | 'count-down';
type PlayeStatus = 'spectating' | 'joined' | 'ready' | 'running';

interface Board {
	width: number;
	height: number;
}
export interface Client {
	clientId: string;
	clientStatus: string;
	color: string;
}

interface State {
	you?: string;
	board: Board;
	gameStatus: GameStatus;
	playerStatus: PlayeStatus;
	clients: Client[];
	error?: string;
};

const _state = writable<State>({
	board: { width: 0, height: 0 },
	gameStatus: 'waiting',
	playerStatus: 'spectating',
	clients: []
});

export const state = {
	subscribe: _state.subscribe,
	update: _state.update,
	set: (key: string, value: unknown) => _state.update((self) => ({ ...self, [key]: value })),
	setGameStatus: (value: GameStatus) => _state.update((self) => ({ ...self, gameStatus: value })),
	setPlayerStatus: (value: PlayeStatus) => _state.update((self) => ({ ...self, playerStatus: value }))
};
