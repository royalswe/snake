<script lang="ts">
	import Snake from './snake.svelte';
	import { connect, send } from '$lib/ws';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { state } from '$lib/stores/state';
	import { PLAYER_STATUS } from './constants';

	const roomName = $page.data.roomName;
	const params = $page.data;

	//let gameState = $state.gameState;

	// $: $state.gameState && drawStatus();

	// function drawStatus() {
	// 	console.log('new status: ' + $state.gameState);
	// }

	function develop() {
		console.log('develop', $state.gameState);

		if ($state.playerState === PLAYER_STATUS.spectating) {
			send({
				type: 'join-game',
				msg: roomName
			});
		} else if ($state.playerState === PLAYER_STATUS.joined) {
			send({
				type: 'player-ready'
			});
		}
	}

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
			params
		);
	});
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Svelte snake app" />
	<!-- <link
		rel="stylesheet"
		href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
		integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
		crossorigin="anonymous"
	/> -->
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<section on:click={develop}>
	<div class="container">
		<h1>Your game code is: <span id="gameCodeDisplay" />{roomName}</h1>
		GameState: {$state.gameState} / PlayerState {$state.playerState}
		<div id="chat-container">
			{#if $state.playerState === 'spectating'}
				<!-- TODO: only show when game not full -->
				<button on:click={joinGame}>Join game</button>
			{:else if $state.playerState === 'joined'}
				<button on:click={ready}>Ready</button>
			{/if}
		</div>
		<Snake />
	</div>
</section>

<style>
	* {
		box-sizing: border-box;
	}
	section {
		position: relative;
		height: 100vh;
		width: 100vw;
		background-color: black;
		overflow: hidden;
	}
	.container {
		position: relative;
		height: 100%;
		width: 100%;
		background-color: rgb(180, 180, 180);
	}

	#chat-container {
		width: 20%;
		height: 90%;
		background-color: aquamarine;
		float: left;
	}
</style>
