<script lang="ts">
	import Board from './board.svelte';
	import { send } from '$lib/ws';
	import { useState } from '$lib/stores/state.svelte';
	import CountDown from './countDown.svelte';
	import { EVENT } from '$server/constants/events';
	import { GAME_STATUS, PLAYER_STATUS } from '$server/constants/status';

	const states = useState();
	let w, h;

	const onKeyDown = (e: KeyboardEvent): void => {
		const availableKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
		if (availableKeys.indexOf(e.code) != -1 && PLAYER_STATUS.ready) {
			// prevent moving in the opposite direction
			if (
				(e.code === 'ArrowDown' && states.velocity === 'ArrowUp') ||
				(e.code === 'ArrowUp' && states.velocity === 'ArrowDown') ||
				(e.code === 'ArrowLeft' && states.velocity === 'ArrowRight') ||
				(e.code === 'ArrowRight' && states.velocity === 'ArrowLeft')
			) {
				return;
			}
			states.velocity = e.code;
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
