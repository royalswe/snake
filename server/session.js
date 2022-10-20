import { PLAYER_STATUS, COUNT_DOWN, GRID_WIDTH, GRID_HEIGHT } from './helpers/constants.js';
import { isEveryStatusSame } from './helpers/utils.js';

function Session(room) {
	this.room = room;
	this.clients = new Set();
	this.status = 'waiting';
	this.timer = null;
}

Session.prototype = {
	// A
	// B
	// C

	countDown: function (duration = COUNT_DOWN) {
		clearTimeout(this.timer);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (!isEveryStatusSame(this.clients, PLAYER_STATUS.ready)) {
					return reject;
				}
				resolve({
					type: 'game-status',
					msg: PLAYER_STATUS.running
				});
			}, duration);
		});
	},

	gameIntervall: function (callback, interval = 500) {
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
	},
	// const countdown = (finnish) => {
	// 	this.timer = setTimeout(() => {
	// 		return finnish();
	// 	}, duration);
	// };

	//countdown(async () => {
	// this.timer = null;
	// console.log('start the game');
	// const msg = {
	// 	type: 'game-state',
	// 	msg: PLAYER_STATUS.running
	// };
	// this.timer = await setTimeout(() => {
	// 	callback(msg);
	// }, duration);

	//});

	// D
	// E
	// F
	// G

	gameLoop: function () {
		//this.clients.forEach((client) => {
		//((const client = this.clients.keys().next().value;
		for (const client of this.clients) {
			const state = client.gameState;
			if (client.status !== PLAYER_STATUS.ready && !state) {
				console.log(client.status, 'is game over');
				return;
			}

			state.pos.y += state.vel.y;
			state.pos.x += state.vel.x;

			for (const c of this.clients) {
				if (isCollide({ y: state.pos.y, x: state.pos.x }, c.gameState)) {
					client.status = PLAYER_STATUS.lost;
					//console.log(this.clients);
					const winner = [...this.clients].filter((v) => v.status === PLAYER_STATUS.ready);
					if (winner.length <= 1) {
						console.log('winner is', winner);
						return true;
					}
				}
			}

			// snage grow
			state.snake.push({ ...state.pos });
		}
	},
	// H
	// I
	// J
	join: function (client) {
		for (const c of this.clients) {
			if (c.id === client.id) {
				return false; // client exist already
			}
		}
		this.clients.add(client);
		client.session = this; // easy to acces session from client
	},
	// K
	// L
	leave: function (client) {
		if (client.session !== this) {
			throw new Error('client do not exist in session');
		}
		this.clients.delete(client);
		console.log('client delete', client);
	}
	// M
	// N
	// O
	// P
	// Q
	// R

	// S
	// T
	// U
	// V
	// X
	// Z
};

function isCollide({ x, y }, stateB) {
	// console.log(id, idB, x, stateB.pos.x, y, stateB.pos.y);
	// if (id !== idB && x === stateB.pos.x && y === stateB.pos.y) {
	// 	console.log('hits head');
	// 	return true; // head hits head
	// }
	if (stateB.snake.some((o) => o.x === x && o.y === y)) {
		return true; // snake hits snake
	}
	// snake hits wall
	return x >= GRID_WIDTH || y >= GRID_HEIGHT || x < 0 || y < 0;
}

export default Session;
