import { GRID_SIZE, PLAYER_STATUS } from './helpers/constants.js';
import { isEveryStatusSame } from './helpers/utils.js';

function Session(room) {
	this.id = room;
	this.clients = new Set();
	this.status = 'waiting';
	this.timer = null;
}

Session.prototype = {
	// A
	// B
	// C

	countDown: function (duration = 3000) {
		clearTimeout(this.timer);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (isEveryStatusSame(this.clients, PLAYER_STATUS.ready)) {
					reject;
				}
				resolve({
					type: 'game-status',
					msg: PLAYER_STATUS.running
				});
			}, duration);
		});
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
	},
	// D
	// E
	// F
	// G
	getUpdatedVelocity: function (keyCode) {
		switch (keyCode) {
			case 'ArrowLeft': {
				// left
				return { x: -1, y: 0 };
			}
			case 'ArrowDown': {
				// down
				return { x: 0, y: 1 };
			}
			case 'ArrowRight': {
				// right
				return { x: 1, y: 0 };
			}
			case 'ArrowUp': {
				// up
				return { x: 0, y: -1 };
			}
		}
	},

	gameLoop: function (state) {
		if (!state) {
			return;
		}

		const playerOne = state;
		playerOne.pos.y += playerOne.vel.y;
		playerOne.pos.x += playerOne.vel.x;

		// check if hit any walls or snake
		if (
			playerOne.pos.x < 0 ||
			playerOne.pos.x > GRID_SIZE ||
			playerOne.pos.y < 0 ||
			playerOne.pos.y > GRID_SIZE
		) {
			console.log('hit the wall');
			return 2;
		}

		// snage grow
		playerOne.snake.push({ ...playerOne.pos });
		// playerOne.pos.y += playerOne.vel.y;
		// playerOne.pos.x += playerOne.vel.x;
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
		console.log('client delete', client);
		this.clients.delete(client);
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

export default Session;
