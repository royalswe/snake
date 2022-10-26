import type Client from '../client';

export function makeid() {
	let len = 6;
	let chars = 'abcdefghjkmnopqrstxz0123456789';
	let id = '';
	while (len--) {
		id += chars[(Math.random() * chars.length) | 0];
	}
	return id;
}

export const isEveryStatusSame = (set: Set<Client>, status: string) => [...set].every((obj) => obj.status === status);

export function startPosition(width: number, height: number, key: number) {
	const map = {
		0: { x: 3, y: 3 },
		1: { x: width - 3, y: height - 3 },
		2: { x: 3, y: height - 3 },
		3: { x: width - 3, y: 3 },
	}

	return map[key] || console.error(key + ' is not valid key for start position');

};