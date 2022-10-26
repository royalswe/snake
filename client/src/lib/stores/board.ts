import { writable } from 'svelte/store';

const boardStore = () => {
	const { set, update, subscribe } = writable(0);

	return {
		subscribe,
		update,
		set,
		// add: () => update((val) => val++),
		// reset: () => set(0)
	};
};

export const board = boardStore();
