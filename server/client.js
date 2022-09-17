function Client(socket, id = Math.random().toString(16).slice(2)) {
    console.log('Client created');
    console.log(socket);
    this.socket = socket;
    this.id = id;
    this.snakeBody = null;
}

Client.prototype.send = function (message) {
    this.socket.send(message);
}

export default Client;