export function makeid() {
	let len = 6;
	let chars = 'abcdefghjkmnopqrstxz0123456789';
	let id = '';
	while (len--) {
		id += chars[(Math.random() * chars.length) | 0];
	}
	return id;
}
