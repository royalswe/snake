<script lang="ts">
	import Board from './board.svelte';
	import { send } from '$lib/ws';
	import { state } from '$lib/stores/state';
	import CountDown from './countDown.svelte';

	let w, h;

	function onKeyDown(e: KeyboardEvent) {
		var availableKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
		if (availableKeys.indexOf(e.code) != -1) {
			send({ type: 'movement', msg: e.code });
		}
	}
</script>

<div class="game-container" bind:offsetWidth={w} bind:offsetHeight={h}>
	{#if $state.gameStatus === 'count-down'}
		<CountDown />
	{/if}
	<Board parentWidth={w} parentHeight={h} />
</div>

<svelte:window on:keydown={onKeyDown} />

<style>
	.game-container {
		height: 100%;
		width: 100%;
	}
</style>
