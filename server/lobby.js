const decoder = new TextDecoder('utf-8');

export const lobby = (ws, message, isBinary) => {
	ws.subscribe('lobby'); // subscribe to the room name
	const clientMsg = JSON.parse(decoder.decode(message));
	ws.send(message, isBinary, true); // sender only
};
