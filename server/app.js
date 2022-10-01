import uWebSockets from 'uWebSockets.js';
import Client from './client.js';
import Session from './session.js';
import { FRAME_RATE, GRID_SIZE } from './constants.js';
import { makeid } from './utils.js';

const decoder = new TextDecoder('utf-8');
const port = process.env.PORT || 3100;

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

		console.log('deviation', nowTime - nextTime);

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
		throw new Error(`room ${roomName} already exists`)
	}

	const session = new Session(roomName);
	sessions.set(roomName, session);

	return session;
}

function getSession(roomName) {
	return sessions.get(roomName)
}

const uws = uWebSockets
	.App()
	.ws('/*', {
		idleTimeout: 32,
		maxBackpressure: 1024,
		maxPayloadLength: 512,

		upgrade: (res, req, context) => {
			console.log('An Http connection wants to become WebSocket, URL: ' + req.getUrl() + '!');

			/* This immediately calls open handler, you must not use res after this call */
			// if url is /room, then upgrade to WebSocket
			res.upgrade(
				{
					url: req.getUrl()
				},
				/* Spell these correctly */
				req.getHeader('sec-websocket-key'),
				req.getHeader('sec-websocket-protocol'),
				req.getHeader('sec-websocket-extensions'),
				context
			);
		},
		open: (ws) => {
			console.log('A WebSocket connected with URL: ' + ws.url);
			ws.client = new Client(ws);
			//ws.client.gameState =

			
			ws.client.send(JSON.stringify({ type: 'init', message: 'Welcome to the snake game!' }));
		},
		message: (ws, message, isBinary) => {
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
					console.log(resetGameState);
					ws.client.gameState = { ...resetGameState };
					console.log(ws.client.gameState);
					break;
				}
				case 'join-room:': {
					ws.subscribe(clientMsg.msg); // subscribe to the room name
					break;
				}
				case 'game-status:': {
					break;
				}
				case 'join-game': {
					const session = getSession(clientMsg.msg) || createSession(ws.client, clientMsg.msg);
					if (!session.join(ws.client)) {
						return; // Could not join game session
					}
					serverMsg = {
						type: 'joined-game'
					}
					break;
				}
				case 'start-game': {
					
					serverMsg = {
						type: 'start-game'
					};

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

			uws.publish('roomname', JSON.stringify(serverMsg), isBinary, true); // to all
		},
		close: (ws, code, msg) => {
			console.log('WebSocket closed');
		}
	})
	.listen(port, (token) => {
		token
			? console.log(`Listening to uws ${port}`)
			: console.log(`Failed to listen uws port ${port}`);
	});

const resetGameState = Object.freeze({
	pos: {
		x: 3,
		y: 10
	},
	vel: {
		x: 1,
		y: 0
	},
	snake: [
		{ x: 1, y: 10 },
		{ x: 2, y: 10 },
		{ x: 3, y: 10 }
	],
	gridsize: GRID_SIZE
});

function objectchanger(obj, att, val) {
	obj[att] = val;
}
