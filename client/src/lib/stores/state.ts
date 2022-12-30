import { writable } from 'svelte/store';

type GameStatus = 'waiting' | 'running' | 'count-down';
type PlayeStatus = 'spectating' | 'joined' | 'ready' | 'running';

interface Board {
	width: number;
	height: number;
}
interface Client {
	clientId: string;
	clientStatus: string;
	color: string;
}

type State = {
	you?: string;
	board: Board;
	gameStatus: GameStatus;
	playerStatus: PlayeStatus;
	clients: Client[];
	error?: string;
};

const _state = writable<State>({
	board: {} as Board,
	gameStatus: 'waiting',
	playerStatus: 'spectating',
	clients: []
});

export const state = {
	subscribe: _state.subscribe,
	update: _state.update,
	set: (key: string, value: unknown) => _state.update((self) => ({ ...self, [key]: value })),
	setGameStatus: (value: GameStatus) => _state.update((s) => ({ ...s, gameStatus: value })),
	setPlayerStatus: (value: PlayeStatus) => _state.update((s) => ({ ...s, playerStatus: value }))
};
