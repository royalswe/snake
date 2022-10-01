<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import Board from './board.svelte';

	const canvasWidth: number = 600;
	const canvasHeight: number = 600;
	const GRID_SIZE = 20;

	function onKeyDown(e: KeyboardEvent) {
		console.log(e.code);
		send({ type: 'movement', msg: e.code });
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
