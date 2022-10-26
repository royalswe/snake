// key for Svelte context
export const BOARD = {
	boardWidth: 50,
	boardHeight: 50
};

export const PLAYER_STATUS = {
	spectating: 'spectating',
	joined: 'joined',
	ready: 'ready',
	lost: 'lost'
} as const;

// colours
export const COLOURS = {
	BG: 'purple',
	SNAKE: 'green',
	FOOD: 'orange'
} as const;

export const TYPE = {
	chatMessage: "chat-message",
	error: "error",
	gameState: "game-state",
	gameStatus: "game-status",
	joinGame: "join-game",
	joinRoom: "join-room",
	movement: "movement",
	playerReady: "player-ready",
	playerStatus: "player-status",
} as const;