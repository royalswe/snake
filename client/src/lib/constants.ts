// key for Svelte context
export const BOARD = {
	boardWidth: 50,
	boardHeight: 50
};

export const PAYER_COLORS = {
	red: null,
	blue: null,
	green: null,
	yellow: null
} as const;

// Shared constants bellow

export const PLAYER_STATUS = {
	spectating: 'spectating',
	joined: 'joined',
	ready: 'ready'
} as const;

export const GAME_STATUS = {
	waiting: 'waiting',
	running: 'running',
	countDown: 'count-down'
} as const;

export const EVENT = {
	chat: 'chat',
	error: 'error',
	gameState: 'game-state',
	gameStatus: 'game-status',
	gameOver: 'gameOver',
	joinGame: 'join-game',
	joinRoom: 'join-room',
	movement: 'movement',
	playerReady: 'player-ready',
	playerStatus: 'player-status'
} as const;
