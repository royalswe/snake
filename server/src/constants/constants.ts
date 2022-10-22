export const FRAME_RATE = 50;
export const GRID_WIDTH = 46;
export const GRID_HEIGHT = 30;
export const COUNT_DOWN = 1100;

export const PLAYER_STATUS = {
  spectating: "spectating",
  joined: "joined",
  ready: "ready",
  lost: "lost",
} as const;

export const GAME_STATUS = {
  waiting: "waiting",
  running: "running",
  countDown: "count-down",
} as const;

export const TYPE = {
  chatMessage: "chat-message",
  gameStatus: "game-status",
  joinGame: "join-game",
  joinRoom: "join-room",
  movement: "movement",
  playerReady: "player-ready",
  playerStatus: "player-status",
  resetGame: "reset-game",
} as const;

export const START_POSITION = {
  1: { x: 3, y: 3 },
  2: { x: GRID_WIDTH - 3, y: GRID_HEIGHT - 3 },
  3: { x: 3, y: GRID_HEIGHT - 3 },
  4: { x: GRID_WIDTH - 3, y: 3 },
} as const;

export const VELOCITY = {
  1: { x: 1, y: 0 },
  2: { x: -1, y: 0 },
  3: { x: 1, y: 0 },
  4: { x: -1, y: 0 },
} as const;

export const COLOR = {
  1: "red",
  2: "blue",
  3: "green",
  4: "yellow",
} as const;
