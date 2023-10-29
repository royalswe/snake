import { LOBBY_EVENT as EVENT } from '$server/constants/events';
import { chat } from '$lib/stores/chat';
import { rooms } from '$lib/stores/rooms';


export function lobbyMessageHandler(msg: any) {
    switch (msg.type) {
        case EVENT.updateRooms:
            rooms.set(msg.msg);
            break;
        case EVENT.chat:
            chat.add(msg.msg);
            break;
        case EVENT.error:
            console.log('lobbyerror');

            break;
        default:
            console.log('unknown emit from server', msg);
            break;
    }
}