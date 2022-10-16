<script lang="ts">
	import Game from './snake.svelte';
	import { connect, send } from '$lib/ws';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { state } from '$lib/stores/state';
	import CountDown from './countDown.svelte';

	const roomName = $page.params.slug;
	//let gameState = $state.gameState;

	// $: $state.gameState && drawStatus();

	// function drawStatus() {
	// 	console.log('new status: ' + $state.gameState);
	// }

	function joinGame() {
		send({
			type: 'join-game',
			msg: roomName
		});
	}

	function ready() {
		send({
			type: 'player-ready'
		});
	}

	onMount(async () => {
		//connect('ws://localhost:3100/room');
		connect(
			(window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
				location.hostname +
				':3100/room',
			roomName
		);
	});
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Svelte snake app" />
	<link
		rel="stylesheet"
		href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
		integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
		crossorigin="anonymous"
	/>
</svelte:head>

<section class="vh-100">
	<div class="container h-100">
		<div id="gameScreen" class="h-100">
			<div class="d-flex flex-column align-items-center justify-content-center h-100">
				<h1>Your game code is: <span id="gameCodeDisplay" />{roomName}</h1>
				GameState: {$state.gameState} / PlayerState {$state.playerState}
				{#if $state.gameState === 'count-down'}
					<CountDown />
				{/if}

				<Game />
			</div>
		</div>
		<div id="btns">
			{#if $state.playerState === 'spectating'}
				<!-- TODO: only show when game not full -->
				<button on:click={joinGame}>Join game</button>
			{:else if $state.playerState === 'joined'}
				<button on:click={ready}>Ready</button>
			{/if}
		</div>
	</div>
</section>

<style>
	#btns {
		position: absolute;
		top: 0;
		left: 0;
	}
	/* #gameScreen {
		display: none;
	} */
</style>
