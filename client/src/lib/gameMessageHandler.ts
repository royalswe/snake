import { EVENT } from '$server/constants/events';
import { board } from '$lib/stores/board';
import { state, type Client } from '$lib/stores/state';
import { chat } from '$lib/stores/chat';
import { GAME_STATUS } from '$server/constants/status';

export function gameMessageHandler(msg: any) {
    switch (msg.type) {
        case EVENT.gameState:
            board.set(msg.data);
            break;
        case EVENT.open:
            state.update((currentState) => ({ ...currentState, you: msg.msg }));
            chat.add({ message: 'Welcome to the snake game!' });
            break;
        case EVENT.joinGame:
            state.setPlayerStatus(msg.playerStatus);
            break;
        case EVENT.gameStatus:
            state.setGameStatus(msg.gameStatus);
            break;
        case EVENT.joinRoom:
            state.update((currentState) => ({
                ...currentState,
                board: { width: msg.width, height: msg.height } // save the canvas measures
            }));
            break;
        case EVENT.roomStatus:
            state.update((self) => ({ ...self, clients: msg.clients })); // update status of clients in room
            break;
        case EVENT.chat:
            chat.add({ sender: msg.clientId, message: msg.msg, datetime: msg.datetime });
            break;
        case EVENT.playerReady:
            state.setPlayerStatus(msg.playerStatus);
            //state.update((state) => ({ ...state, velocity: msg.velocity })); // is this needed?
            break;
        case EVENT.gameOver:
            state.update((currentState) => {
                const matchingPlayer = msg.clients.find((p: Client) => p.clientId === currentState.you);
                if (matchingPlayer) {
                    return {
                        ...currentState,
                        playerStatus: matchingPlayer.clientStatus
                    };
                }
                return currentState;
            });
            state.setGameStatus(GAME_STATUS.waiting);
            chat.add({ message: msg.winner });
            state.update((self) => ({ ...self, clients: msg.clients })); // update status of clients in room
            break;
        case EVENT.error:
            state.update((currentState) => ({ ...currentState, error: msg.msg }));
            break;
        default:
            console.log('unknown emit from server', msg);
            break;
    }
}