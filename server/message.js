import Client from './client.js';
import Session from './session.js';
import uws from './uws.js';
import { FRAME_RATE, GAME_STATUS, PLAYER_STATUS } from './helpers/constants.js';
import { isEveryStatusSame } from './helpers/utils.js';

const decoder = new TextDecoder('utf-8');
const sessions = new Map();

// Accurate loop
function intervalTimer(callback, interval = 500) {
	let counter = 1;
	let timeoutId;
	const startTime = Date.now();

	function main() {
		const nowTime = Date.now();
		const nextTime = startTime + counter * interval;
		timeoutId = setTimeout(main, interval - (nowTime - nextTime));

		counter += 1;
		callback();
	}

	timeoutId = setTimeout(main, interval);

	return () => {
		clearTimeout(timeoutId);
	};
}

function startGameIntervall(client) {
	const intervalId = setInterval(() => {
		const winner = Session.gameLoop(client.gameState);
		if (!winner) {
			client.send(JSON.stringify({ type: 'game-state', message: client.gameState }));
		} else {
			client.send(JSON.stringify({ type: 'game-over' }));
			clearInterval(intervalId);
		}
	}, 1000 / FRAME_RATE);
}

function createSession(roomName) {
	if (sessions.has(roomName)) {
		throw new Error(`room ${roomName} already exists`);
	}
	const session = new Session(roomName);
	sessions.set(roomName, session);
	return session;
}

function getSession(roomName) {
	return sessions.get(roomName);
}

export const message = (ws, message, isBinary) => {
	/* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */

	const clientMsg = JSON.parse(decoder.decode(message));
	let serverMsg = {};

	switch (clientMsg.type) {
		case 'movement': {
			const velocity = Session.getUpdatedVelocity(clientMsg.msg);
			if (velocity) {
				ws.client.gameState.vel = velocity;
			}

			break;
		}
		case 'reset-game': {
			//objectchanger(ws.client.gamestate, 'snake', { x: 1, y: 10 });
			//ws.client.gameState = { ...resetGameState };
			break;
		}
		case 'join-room': {
			ws.client = new Client(ws);
			ws.subscribe(clientMsg.msg); // subscribe to the room name
			ws.client.room = clientMsg.msg;
			break;
		}
		case 'player-ready': {
			const session = ws.client.session;
			if (session.status === GAME_STATUS.running || ws.client.status !== PLAYER_STATUS.joined) {
				return console.log('game already started'); // if game is allready started or player clicked ready when not joined
			}
			ws.client.status = PLAYER_STATUS.ready;

			if (isEveryStatusSame(session.clients, PLAYER_STATUS.ready)) {
				serverMsg = {
					type: 'game-status',
					msg: GAME_STATUS.countDown
				};
				// start count down
				session
					.countDown()
					.then((value) => {
						uws.publish(ws.client.room, JSON.stringify(value), isBinary, true); // to all
					})
					.catch((error) => console.log(error));
			}
			break;
		}

		case 'join-game': {
			const roomName = clientMsg.msg;
			const session = getSession(roomName) || createSession(roomName);
			if (session.join(ws.client) === false) {
				return console.log('Could not join game session'); // Could not join game session
			}

			serverMsg = {
				type: 'player-status',
				msg: PLAYER_STATUS.joined
			};
			break;
		}
		case 'start-game': {
			serverMsg.type = 'start-game';

			startGameIntervall(ws.client);
			// // run 	loop
			// const cancelTimer = intervalTimer(() => {
			// 	if (isGameover() === false) {
			// 		// game logic
			// 	} else {
			// 		cancelTimer();
			// 	}
			// }, 1000);

			break;
		}
		case 'chat-message': {
			serverMsg = {
				type: 'chat-message',
				msg: clientMsg.message
			};
			break;
		}
	}

	/* Here we echo the message back, using compression if available */
	//let ok = ws.send(message, isBinary, true); // sender only
	//ws.publish('home/sensors/temperature', message, isBinary, true); // to all except the sender
	console.log(serverMsg);

	uws.publish(ws.client.room, JSON.stringify(serverMsg), isBinary, true); // to all
};

export const close = (ws, code, msg) => {
	console.log('WebSocket closed');
	try {
		//ws.client.session.leave(ws.client);
	} catch (error) {
		console.error('remove client from session failed');
		console.log('session output: ' + sessions);
	}
};
