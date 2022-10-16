<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import Board from './board.svelte';
	import { send } from '$lib/ws';

	const canvasWidth: number = 600;
	const canvasHeight: number = 600;

	function onKeyDown(e: KeyboardEvent) {
		var availableKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
		if (availableKeys.indexOf(e.code) != -1) {
			send({ type: 'movement', msg: e.code });
		}
	}

	function resetGame() {
		send({
			type: 'reset-game'
		});
	}
</script>

<Board width={canvasWidth} height={canvasHeight} />

<svelte:window on:keydown={onKeyDown} />
<button on:click={resetGame}>reset</button>
