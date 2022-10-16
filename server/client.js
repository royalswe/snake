import uws from './uws.js';
import { GRID_SIZE } from './helpers/constants.js';

function Client(ws, id = Math.random().toString(16).slice(2)) {
	this.ws = ws;
	this.id = id;
	this.room = null;
	this.session = null;
	this.status = 'joined';

	this.gameState = {
		color: 'grey',
		pos: {},
		vel: {
			x: 1,
			y: 0
		},
		snake: [],
		gridSize: GRID_SIZE
	};
}

Client.prototype = {
	/**
	 * Send to local client only
	 */
	send: function (message, isBinary = true, compress = true) {
		console.log(message);
		const ok = this.ws.send(JSON.stringify(message), isBinary, compress);
		console.log(ok);
		if (!ok) {
			console.error('problem sending client msg from ' + this.room);
		}
	},
	/**
	 * Send to all clients in the same session except local user
	 */
	broadcast: function (message, isBinary = true, compress = true) {
		this.ws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all except the sender
	},
	/**
	 * Send to all clients in room
	 */
	roomEmit: function (message, isBinary = true, compress = true) {
		uws.publish(this.room, JSON.stringify(message), isBinary, compress); // to all
	}
};

export default Client;
