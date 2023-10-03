<script lang="ts">
	import { state } from '$lib/stores/state';
	import { send } from '$lib/ws';
	import { EVENT, PLAYER_STATUS } from '$lib/constants';
	import { PLAYER_COLORS } from '$lib/constants';

	const ready = () => {
		if ($state.gameStatus !== 'running') {
			send(EVENT.playerReady, {});
		}
	};
	const takeSeat = (color: string) => send(EVENT.joinGame, { color });
	const seats = PLAYER_COLORS;

	$: $state.clients, renderClientList();

	const renderClientList = () => {
		// remove clientIds from seats if they are not in the client list, and add them if they are
		outer: for (const color of Object.keys(seats)) {
			for (const client of $state.clients) {
				if (client.color === color) {
					seats[color] = { id: client.clientId, status: client.clientStatus };
					continue outer;
				}
			}
			seats[color] = null;
		}
	};
</script>

<p>your player name: {$state.you}</p>

<div class="client-list p-1">
	<ul>
		{#each Object.keys(seats) as color}
			<!-- random number -->

			<li class="my-1" class:ready={seats[color]?.status === PLAYER_STATUS.ready}>
				<!-- <li class="my-1 {seats[color] && seats[color].status === PLAYER_STATUS.ready ? 'ready' : ''}"> -->
				<!-- set ready class if $state.playerStatus is ready -->
				<i class="circle {color}" />
				{#if seats[color]}
					{#if $state.you === seats[color]?.id && $state.playerStatus === PLAYER_STATUS.joined}
						<button
							disabled={$state.gameStatus === 'running'}
							class="bg-blue-800 hover:bg-blue-900 text-white px-4 rounded"
							on:click|once={ready}
							>Click when ready!
						</button>
					{/if}
					{seats[color]?.id}
				{:else if $state.playerStatus === PLAYER_STATUS.spectating}
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded"
						on:click|once={() => takeSeat(color)}
						>Take seat
					</button>
				{/if}
			</li>
		{/each}
		<hr />

		{#each $state.clients as client}
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
