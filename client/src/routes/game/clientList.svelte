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

	let players = $state(PLAYER_COLORS);

	let seats = $derived.by(() => {
		// remove clientIds from seats if they are not in the client list, and add them if they are
		outer: for (const color of Object.keys(players)) {
			for (let i = 0; i < states.clients.length; i++) {
				const client = states.clients[i];
				if (client.color === color) {
					players[color] = { id: client.clientId, status: client.clientStatus };
					continue outer;
				} else if (i === states.clients.length - 1) {
					players[color] = null;
				}
			}
		}
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

<p>your player name: {states.you}</p>

<div class="client-list p-1">
	<ul>
		{#each Object.keys(seats) as color, i}
			<!-- random number -->
			<li class="my-1" class:ready={seats[color]?.status === PLAYER_STATUS.ready}>
				<!-- <li class="my-1 {seats[color] && seats[color].status === PLAYER_STATUS.ready ? 'ready' : ''}"> -->
				<!-- set ready class if $state.playerStatus is ready -->
				<i class="circle {color}"></i>
				{#if seats[color]}
					{#if states.you === seats[color]?.id && states.playerStatus === PLAYER_STATUS.joined}
						<button
							disabled={states.gameStatus === 'running'}
							class="bg-blue-800 hover:bg-blue-900 text-white px-4 rounded"
							onclick={once(preventDefault(ready))}
							>Click when ready!
						</button>
					{/if}
					{seats[color]?.id}
				{:else if states.playerStatus === PLAYER_STATUS.spectating}
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded"
						onclick={once(preventDefault(() => takeSeat(color)))}
						>Take seat
					</button>
				{/if}
			</li>
		{/each}
		<hr />

		{#each states.clients as client}
			{#if !client.color}
				<p>{client.clientId}</p>
			{/if}
		{/each}
	</ul>
</div>

<style lang="postcss">
	.client-list {
		background-color: beige;
		border: 1px solid gray;
		color: #000;

		& .ready .circle {
			&::after {
				content: '\2713';
				transform: translate(10%, -11%);
				display: block;
				font-size: 13px;
				font-weight: 900;
				color: #0cec13;
			}
		}

		& .circle {
			border-radius: 100%;
			display: inline-block;
			width: 15px;
			height: 15px;
			font-size: 15px;
			vertical-align: middle;
			margin-bottom: 2px;
			margin-right: 10px;
		}

		& i.red {
			background-color: red;
		}
		& i.blue {
			background-color: blue;
		}
		& i.green {
			background-color: green;
		}
		& i.yellow {
			background-color: yellow;
		}
	}
</style>
