export function makeid() {
	let len = 6;
	let chars = 'abcdefghjkmnopqrstxz0123456789';
	let id = '';
	while (len--) {
		id += chars[(Math.random() * chars.length) | 0];
	}
	return id;
}

export const isEveryStatusSame = (set, status) => [...set].every((obj) => obj.status === status);

export const velocity = {
	ArrowLeft: { x: -1, y: 0 },
	ArrowDown: { x: 0, y: 1 },
	ArrowRight: { x: 1, y: 0 },
	ArrowUp: { x: 0, y: -1 }
};
