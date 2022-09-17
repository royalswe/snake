function Client() {
    console.log('Client created');
}

Client.prototype.send = function (message) {
    this.socket.send(message);
}