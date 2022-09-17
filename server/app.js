import uWebSockets from 'uWebSockets.js';
import Client from './client.js';

const decoder = new TextDecoder('utf-8');
const port = process.env.PORT || 3100;

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

const uws = uWebSockets.App()
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
			ws.client.snakeBody = [
				{
					x:10,
					y:1
				},
				{
					x:11,
					y:1
				},
				{
					x:12,
					y:1
				}
			];
			ws.subscribe('roomname');
			ws.client.send(JSON.stringify({type: 'init', message: 'Welcome to the snake game!'}));
		},
		message: (ws, message, isBinary) => {
			console.log('start here -----------------------------------------------------');
			/* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
			console.log(
				isBinary ? 'Binary message received: ' + message : 'Text message received: ' + message
			);

			const clientMsg = JSON.parse(decoder.decode(message));
			let serverMsg = {};

			switch (clientMsg.type) {
				case 'start-game': {
					serverMsg = {
						type: 'start-game',
					}

				// run loop
				const cancelTimer = intervalTimer(() => {
					if (isGameover() === false) {
						// game logic
						let { x, y } = snakeTiles[0];

						if (direction === 'up') {
							y -= 1;
						} else if (direction === 'down') {
							y += 1;
						} else if (direction === 'left') {
							x -= 1;
						} else if (direction === 'right') {
							x += 1;
						}

						const newHead = { x, y };
						snakeTiles = [newHead, ...snakeTiles];

						snakeTiles = [...snakeTiles, snakeTiles[snakeTiles.length - 1]];
					} else {
						cancelTimer();
						resetGame();
					}
				}, 1000);

					break;
				}
				case 'chat-message': {
					serverMsg = {
						type: 'chat-message',
						message: clientMsg.message
					}
					break;
				}
			}

			
			/* Here we echo the message back, using compression if available */
			//let ok = ws.send(message, isBinary, true); // sender only
			//ws.publish('home/sensors/temperature', message, isBinary, true); // to all except the sender
			
            uws.publish('roomname', JSON.stringify(serverMsg), isBinary, true); // to all

			console.log('end here -----------------------------------------------------');
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
