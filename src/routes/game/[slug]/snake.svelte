<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { connect, send } from '$lib/ws';
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

	onMount(async () => {
		//connect('ws://localhost:3100/room');
		connect(
			(window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
				location.hostname +
				'/room:3100'
		);
	});
</script>

<Board width={canvasWidth} height={canvasHeight} />

<svelte:window on:keydown={onKeyDown} />
<button on:click={resetGame}>reset</button>
