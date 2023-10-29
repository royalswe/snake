export const EVENT = {
    open: 'open',
    chat: 'chat',
    error: 'error',
    roomStatus: 'room-status',
    gameState: 'game-state',
    gameStatus: 'game-status',
    gameOver: 'gameOver',
    joinGame: 'join-game',
    joinRoom: 'join-room',
    movement: 'movement',
    playerReady: 'player-ready'
} as const;

export const LOBBY_EVENT = {
    updateRooms: 'update-rooms',
    error: 'error',
    chat: 'chat',
} as const;