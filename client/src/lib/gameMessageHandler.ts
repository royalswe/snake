import { EVENT } from '$server/constants/events';
import { BOARD } from './constants';
import { useSnakes } from '$lib/stores/snakes.svelte';
import { useState, type Client } from '$lib/stores/state.svelte';
import { useChat } from '$lib/stores/chat.svelte';
import { GAME_STATUS } from '$server/constants/status';

const states = useState();
const snakes = useSnakes();
const chat = useChat();

export function gameMessageHandler(msg: any) {
    switch (msg.type) {
        case EVENT.gameState:
            snakes.state = msg.data;
            break;
        case EVENT.open:
            states.you = msg.msg;
            chat.add({ message: 'Welcome to the snake game!' });
            break;
        case EVENT.joinGame:
            states.playerStatus = msg.playerStatus;
            break;
        case EVENT.gameStatus:
            states.gameStatus = msg.gameStatus;
            break;
        case EVENT.joinRoom:
            BOARD.height = msg.height;
            BOARD.width = msg.width;
            break;
        case EVENT.roomStatus:
            states.clients = msg.clients;
            break;
        case EVENT.chat:
            chat.add({ sender: msg.clientId, message: msg.msg, datetime: msg.datetime });
            break;
        case EVENT.playerReady:
            states.playerStatus = msg.playerStatus;
            break;
        case EVENT.gameOver:
            const matchingPlayer = msg.clients.find((p: Client) => p.clientId === states.you);
            if (matchingPlayer) {
                states.playerStatus = matchingPlayer.clientStatus;
            }
            states.gameStatus = GAME_STATUS.waiting;
            chat.add({ message: msg.winner });
            states.clients = msg.clients;
            break;
        case EVENT.error:
            states.error = msg.msg;
            break;
        default:
            console.log('unknown emit from server', msg);
            break;
    }
}