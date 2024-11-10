<script lang="ts">
	import { useState } from '$lib/stores/state.svelte';
	import { send } from '$lib/ws';
	import { EVENT } from '$server/constants/events';
	import { PLAYER_STATUS } from '$server/constants/status';
	import { PLAYER_COLORS } from '$lib/constants';

	const states = useState();

	const ready = () => {
		if (states.gameStatus !== 'running') {
			send(EVENT.playerReady, {});
		}
	};

	const takeSeat = (color: string) => send(EVENT.joinGame, { color });

	let seats = $derived.by(() => {
		// Update players when clients change
		const colorKeys = Object.keys(PLAYER_COLORS);
		const players = { ...PLAYER_COLORS };

		// First reset all seats
		colorKeys.forEach((color) => {
			players[color] = null;
		});

		// Then assign players to their seats
		states.clients.forEach((client) => {
			if (client.color) {
				players[client.color] = {
					id: client.clientId,
					status: client.clientStatus
				};
			}
		});

		return players;
	});

	function once(fn: any) {
		return function (event: any) {
			if (fn) fn.call(this, event);
			fn = null;
		};
	}

	function preventDefault(fn: any) {
		return function (event: any) {
			event.preventDefault();
			fn.call(this, event);
		};
	}
</script>

<div class="client-list p-1">
	<h3 class="font-bold mb-2">Players</h3>
	<ul>
		{#each Object.entries(seats) as [color, player]}
			<li class="my-1" class:ready={player?.status === PLAYER_STATUS.ready}>
				<i class="circle {color}"></i>
				{#if player}
					<span>{player.id}</span>
					{#if states.you === player.id && player.status === PLAYER_STATUS.joined}
						<button
							disabled={states.gameStatus === 'running'}
							class="bg-blue-800 hover:bg-blue-900 text-white px-4 rounded ml-2"
							onclick={once(preventDefault(ready))}
							>Click when ready!
						</button>
					{/if}
				{:else if states.playerStatus === PLAYER_STATUS.spectating}
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded"
						onclick={once(preventDefault(() => takeSeat(color)))}
						>Take seat
					</button>
				{/if}
			</li>
		{/each}
	</ul>

	<h3 class="font-bold mt-4 mb-2">Spectators</h3>
	<ul>
		{#each states.clients.filter((client) => !client.color) as spectator}
			<li class="my-1">
				<span>{spectator.clientId}</span>
				{#if spectator.clientId === states.you}
					<span class="ml-2">(You)</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style lang="postcss">
	.client-list {
		background-color: beige;
		border: 1px solid gray;
		color: #000;
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.circle {
		border-radius: 100%;
		display: inline-block;
		width: 15px;
		height: 15px;
		vertical-align: middle;
		margin-right: 10px;
	}

	.ready .circle::after {
		content: '✓';
		display: block;
		font-size: 13px;
		font-weight: 900;
		color: #0cec13;
		transform: translate(3px, -2px);
	}

	.red {
		background-color: red;
	}
	.blue {
		background-color: blue;
	}
	.green {
		background-color: green;
	}
	.yellow {
		background-color: yellow;
	}
</style>
