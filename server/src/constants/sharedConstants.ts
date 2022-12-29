export const FRAME_RATE = 50;
export const COUNT_DOWN = 1100;

export const PLAYER_STATUS = {
  spectating: 'spectating',
  joined: 'joined',
  ready: 'ready',
} as const;

export const GAME_STATUS = {
  waiting: 'waiting',
  running: 'running',
  countDown: 'count-down',
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
  playerStatus: 'player-status',
} as const;
