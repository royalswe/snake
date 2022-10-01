<script lang="ts">
	import Game from './snake.svelte';
	import { connect, send } from '$lib/ws';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let roomName = $page.params.slug;

	function joinGame() {
		send({
			type: 'join-game',
			msg: roomName
		});
	}

	onMount(async () => {
		//connect('ws://localhost:3100/room');
		connect(
			(window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
				location.hostname +
				'/room:3100',
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

{roomName}

<section class="vh-100">
	<div class="container h-100">
		<div id="gameScreen" class="h-100">
			<div class="d-flex flex-column align-items-center justify-content-center h-100">
				<h1>Your game code is: <span id="gameCodeDisplay" /></h1>

				<Game />
			</div>
		</div>
		<button on:click={joinGame}>Join game</button>
	</div>
</section>

<style>
	/* #gameScreen {
		display: none;
	} */
</style>
