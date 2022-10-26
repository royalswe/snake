export const FRAME_RATE = 50;
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
  error: "error",
  gameState: "game-state",
  gameStatus: "game-status",
  gameOver: "gameOver",
  joinGame: "join-game",
  joinRoom: "join-room",
  movement: "movement",
  playerReady: "player-ready",
  playerStatus: "player-status",
} as const;

// export const VELOCITY = {
//   1: { x: 1, y: 0 },
//   2: { x: -1, y: 0 },
//   3: { x: 1, y: 0 },
//   4: { x: -1, y: 0 },
// } as const;

export const VELOCITY = {
  ArrowRight: { x: 1, y: 0 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }
} as const;


export const COLOR = {
  0: "red",
  1: "blue",
  2: "green",
  3: "yellow",
} as const;
