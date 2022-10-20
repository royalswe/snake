<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import Board from './board.svelte';
	import { send } from '$lib/ws';
	import { state } from '$lib/stores/state';
	import CountDown from './countDown.svelte';

	const canvasWidth: number = 600;
	const canvasHeight: number = 600;
	let w, h;

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

<div class="game-container" bind:offsetWidth={w} bind:offsetHeight={h}>
	{#if $state.gameState === 'count-down'}
		<CountDown />
	{/if}
	<Board parentWidth={w} parentHeight={h} />
</div>

<svelte:window on:keydown={onKeyDown} />
<button on:click={resetGame}>reset</button>

<style>
	.game-container {
		position: relative;
		width: 80%;
		height: 80%;
		background-color: aqua;
		float: right;
	}
</style>
