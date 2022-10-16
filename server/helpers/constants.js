export const FRAME_RATE = 10;
export const GRID_SIZE = 40;
export const COUNT_DOWN = 5100;

export const GAME_STATUS = Object.freeze({
	waiting: 'waiting',
	running: 'running',
	countDown: 'count-down'
});

export const PLAYER_STATUS = Object.freeze({
	spectating: 'spectating',
	joined: 'joined',
	ready: 'ready',
	running: 'running'
});

export const TYPE = Object.freeze({
	movement: 'movement',
	resetGame: 'reset-game',
	joinRoom: 'join-room',
	playerReady: 'player-ready',
	joinGame: 'join-game',
	chatMessage: 'chat-message'
});

export const START_POSITION = Object.freeze({
	1: { x: 3, y: 3 },
	2: { x: 37, y: 37 },
	3: { x: 3, y: 37 },
	4: { x: 37, y: 3 }
});

export const COLOR = Object.freeze({
	1: 'red',
	2: 'blue',
	3: 'green',
	4: 'yellow'
});
