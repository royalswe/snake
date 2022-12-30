<script lang="ts">
	import { state } from '$lib/stores/state';
	import { send } from '$lib/ws';
	import { EVENT } from '$lib/constants';
	import { PAYER_COLORS } from '$lib/constants';

	const ready = () => {
		send({
			type: EVENT.playerReady
		});
	};

	function takeSeat(color: string) {
		const colorId = Object.keys(PAYER_COLORS).indexOf(color);

		send({
			type: EVENT.joinGame,
			colorId
		});
	}
	const seatTaken = (color: string, client: string) => (seats[color] = client);

	const seats: any = PAYER_COLORS;
</script>

your player name: {$state.you}

<div class="client-list">
	<ul>
		{#each Object.keys(PAYER_COLORS) as color}
			<li>
				<i class="circle {color}" />
				{#if seats[color]}
					{seats[color]}
					{#if $state.you === seats[color]}
						<button value="1" on:click|once={ready}>Click when ready!</button>
					{/if}
				{:else}
					<button on:click|once={() => takeSeat(color)}>Take seat</button>
				{/if}
			</li>
		{/each}

		{#each $state.clients as client}
			{#if client.color}
				{seatTaken(client.color, client.clientId)}
			{:else}
				<li>{client.clientId}</li>
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
