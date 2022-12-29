<script lang="ts">
	import { state } from '$lib/stores/state';
	import { send } from '$lib/ws';
	import { EVENT } from '$lib/constants';

	const ready = () => {
		send({
			type: EVENT.playerReady
		});
	};

	function takeSeat() {
		send({
			type: EVENT.joinGame,
			msg: 'roomName'
		});
	}
</script>

{#if $state.playerStatus === 'spectating'}
	<!-- TODO: only show when game not full -->
	<button on:click={takeSeat}>Join game</button>
{:else if $state.playerStatus === 'joined'}
	<button on:click={ready}>Ready</button>
{/if}

<div class="client-list">
	<ul>
		<li><span class="circle" /><button class="" on:click={takeSeat}>Take seat</button></li>
		<li><span class="circle" /><button class="" on:click={takeSeat}>Take seat</button></li>
		<li><span class="circle" /><button class="" on:click={takeSeat}>Take seat</button></li>
		<li><span class="circle" /><button class="" on:click={takeSeat}>Take seat</button></li>
	</ul>
</div>

<style>
	.client-list {
		background-color: beige;
		border: 1px solid gray;
	}

	.circle {
		border-radius: 100%;
		background-color: #ff5252;
		display: inline-block;
		width: 15px;
		height: 15px;
		font-size: 15px;
		vertical-align: middle;
		margin-bottom: 2px;
		margin-right: 10px;
	}
</style>
