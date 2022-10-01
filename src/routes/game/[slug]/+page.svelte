<script lang="ts">
	import Game from './snake.svelte';
	import { connect, send } from '$lib/ws';
	import { page } from '$app/stores';

	let gameCode: string;

	function newGame() {
		send({
			type: 'start-game'
		});
	}

	function joinGame() {
		send({
			type: 'join-game',
			msg: gameCode
		});
	}
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

{$page.params.slug}

<section class="vh-100">
	<div class="container h-100">
		<div id="gameScreen" class="h-100">
			<div class="d-flex flex-column align-items-center justify-content-center h-100">
				<h1>Your game code is: <span id="gameCodeDisplay" /></h1>

				<Game />
			</div>
		</div>
	</div>
</section>

<style>
	/* #gameScreen {
		display: none;
	} */
</style>
