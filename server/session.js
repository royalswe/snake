import { GRID_SIZE } from './constants.js';

function Session(room) {
	this.id = room;
	this.clients = new Set();
	this.status = 'waiting';
}

Session.prototype = {
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
	}
};

export default Session;
