export const FRAME_RATE = 50;
export const GRID_WIDTH = 46;
export const GRID_HEIGHT = 30;
export const COUNT_DOWN = 1100;

export const GAME_STATUS = Object.freeze({
	waiting: 'waiting',
	running: 'running',
	countDown: 'count-down'
});

export const PLAYER_STATUS = Object.freeze({
	spectating: 'spectating',
	joined: 'joined',
	ready: 'ready',
	lost: 'lost'
});

export const TYPE = Object.freeze({
	chatMessage: 'chat-message',
	gameStatus: 'game-status',
	joinGame: 'join-game',
	joinRoom: 'join-room',
	movement: 'movement',
	playerReady: 'player-ready',
	playerStatus: 'player-status',
	resetGame: 'reset-game'
});

export const START_POSITION = Object.freeze({
	1: { x: 3, y: 3 },
	2: { x: GRID_WIDTH - 3, y: GRID_HEIGHT - 3 },
	3: { x: 3, y: GRID_HEIGHT - 3 },
	4: { x: GRID_WIDTH - 3, y: 3 }
});

export const VELOCITY = Object.freeze({
	1: { x: 1, y: 0 },
	2: { x: -1, y: 0 },
	3: { x: 1, y: 0 },
	4: { x: -1, y: 0 }
});

export const COLOR = Object.freeze({
	1: 'red',
	2: 'blue',
	3: 'green',
	4: 'yellow'
});

// module.exports = {
// 	GAME_STATUS: Object.freeze(GAME_STATUS),
// 	PLAYER_STATUS: Object.freeze(PLAYER_STATUS),
// 	TYPE: Object.freeze(TYPE),
// 	START_POSITION: Object.freeze(START_POSITION),
// 	VELOCITY: Object.freeze(VELOCITY),
// 	COLOR: Object.freeze(COLOR)
// };
