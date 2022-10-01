function Client(socket, id = Math.random().toString(16).slice(2)) {
	this.socket = socket;
	this.id = id;
	this.nr = 0;
	this.snakeBody = null;
	this.session = null;

	this.gameState = {
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
		gridsize: 20
	};
}

Client.prototype = {
	send: function (message) {
		this.socket.send(message);
	}
};

export default Client;
