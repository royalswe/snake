<script lang="ts">
	import Board from './board.svelte';
	import { send } from '$lib/ws';
	import { useState } from '$lib/stores/state.svelte';
	import CountDown from './countDown.svelte';
	import { EVENT } from '$server/constants/events';
	import { GAME_STATUS, PLAYER_STATUS } from '$server/constants/status';

	const states = useState();
	let w, h;
	$: snakeDirection = states.velocity;

	const onKeyDown = (e: KeyboardEvent): void => {
		const availableKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
		if (availableKeys.indexOf(e.code) != -1 && PLAYER_STATUS.ready) {
			// prevent moving in the opposite direction
			if (
				(e.code === 'ArrowDown' && snakeDirection === 'ArrowUp') ||
				(e.code === 'ArrowUp' && snakeDirection === 'ArrowDown') ||
				(e.code === 'ArrowLeft' && snakeDirection === 'ArrowRight') ||
				(e.code === 'ArrowRight' && snakeDirection === 'ArrowLeft')
			) {
				return;
			}
			snakeDirection = e.code;
			send(EVENT.movement, { key: e.code });
		}
	};
</script>

<div class="h-full" bind:offsetWidth={w} bind:offsetHeight={h}>
	{#if states.gameStatus === GAME_STATUS.countDown}
		<CountDown />
	{/if}
	<Board parentWidth={w} parentHeight={h} />
</div>

<svelte:window onkeydown={onKeyDown} />
