<script lang="ts">
	import { state } from '$lib/stores/state';
	import { send } from '$lib/ws';
	import { EVENT, PLAYER_STATUS } from '$lib/constants';
	import { PLAYER_COLORS } from '$lib/constants';

	const ready = () => send(EVENT.playerReady, {});
	const takeSeat = (color: string) => send(EVENT.joinGame, { color });
	const seats: any = PLAYER_COLORS;

	$: $state.clients, renderClientList();

	const renderClientList = () => {
		// remove clientIds from seats if they are not in the client list, and add them if they are
		outer: for (const color of Object.keys(seats)) {
			for (const client of $state.clients) {
				if (client.color === color) {
					seats[color] = client.clientId;
					continue outer;
				}
			}
			seats[color] = null;
		}
	};
</script>

your player name: {$state.you}
<br />

<div class="client-list">
	<ul>
		{#each Object.keys(seats) as color}
			<li>
				<i class="circle {color}" />
				{#if seats[color]}
					{#if $state.you === seats[color] && $state.playerStatus === PLAYER_STATUS.joined}
						<button on:click|once={ready}>Click when ready!</button>
					{/if}
					{seats[color]}
				{:else if $state.playerStatus === PLAYER_STATUS.spectating}
					<button on:click|once={() => takeSeat(color)}>Take seat</button>
				{/if}
			</li>
		{/each}
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
