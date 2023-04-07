describe('WebSocket server', () => {
    let socket;

    beforeAll((done) => {
        socket = new WebSocket('ws://localhost:8080');

        socket.addEventListener('open', () => {
            done();
        });
    });

    afterAll(() => {
        socket.close();
    });

    test('should receive message from server', (done) => {
        const message = 'Hello, server!';

        socket.addEventListener('message', (event) => {
            expect(event.data).toBe(message);
            done();
        });

        socket.send(message);
    });

    test('should receive multiple messages from server', (done) => {
        const messages = ['Message 1', 'Message 2', 'Message 3'];
        let receivedMessages = [];

        socket.addEventListener('message', (event) => {
            receivedMessages.push(event.data);
            if (receivedMessages.length === messages.length) {
                expect(receivedMessages.sort()).toEqual(messages.sort());
                done();
            }
        });

        messages.forEach((message) => {
            socket.send(message);
        });
    });
});