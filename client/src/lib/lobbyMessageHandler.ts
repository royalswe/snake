import { LOBBY_EVENT as EVENT } from '$server/constants/events';
import { chat } from '$lib/stores/chat';
import { rooms } from '$lib/stores/rooms';
import { clients } from '$lib/stores/onlineClients';


export function lobbyMessageHandler(msg: any) {
    switch (msg.type) {
        case EVENT.updateRooms:
            rooms.set(msg.msg);
            break;
        case EVENT.updateClients:
            clients.set(msg.msg);
            break;
        case EVENT.chat:
            chat.add({ sender: msg.clientId, message: msg.msg, datetime: msg.datetime });
            break;
        case EVENT.updateChat:
            const everyMessage = JSON.parse(msg.msg);
            // set each object in msg.msg to chat
            for (const ms of everyMessage) {
                chat.add(JSON.parse(ms));
            }
            break;
        case EVENT.error:
            console.log('lobbyerror', msg);
            break;
        default:
            console.log('unknown emit from server', msg);
            break;
    }
}