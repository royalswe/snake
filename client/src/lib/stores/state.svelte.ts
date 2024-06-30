type GameStatus = 'waiting' | 'running' | 'count-down';
type PlayeStatus = 'spectating' | 'joined' | 'ready' | 'running';

export interface Client {
	clientId: string;
	clientStatus: string;
	color: string;
}

let gameStatus = $state<GameStatus>('waiting');
let playerStatus = $state<PlayeStatus>('spectating');
let clients = $state<Client[]>([]);
let you = $state('');
let velocity = $state('');
let error = $state<string | undefined>('');

export function useState() {
	return {
		get gameStatus() { return gameStatus; },
		set gameStatus(value) { gameStatus = value; },
		get playerStatus() { return playerStatus; },
		set playerStatus(value) { playerStatus = value; },
		get clients() { return clients; },
		set clients(value) { clients = value; },
		get you() { return you; },
		set you(value) { you = value; },
		get velocity() { return velocity; },
		set velocity(value) { velocity = value; },
		get error() { return error; },
		set error(value) { error = value; },
	};
}