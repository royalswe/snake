<script lang="ts">
	import { connect, send } from '$lib/ws';
	import { onMount } from 'svelte';

	onMount(async () => {
		//connect('ws://localhost:3100/room');
		connect(
			(window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
				location.hostname +
				':3100/looby',
			'lobby'
		);
	});
	let gameCode: string;
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Svelte snake app" />
	<!-- TODO: remove bootstrap -->
	<link
		rel="stylesheet"
		href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
		integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
		crossorigin="anonymous"
	/>
</svelte:head>

<section class="vh-100">
	<div class="container h-100">
		<div id="initialScreen" class="h-100">
			<div class="d-flex flex-column align-items-center justify-content-center h-100">
				<h1>Multiplayer Snake</h1>
				<a href="/game" class="btn btn-success"> Create New Game </a>
				<div>OR</div>
				<div class="form-group">
					<input type="text" bind:value={gameCode} placeholder="enter game code" />
				</div>
				<a href="game/{gameCode}" class="btn btn-success"> Join Game </a>
			</div>
		</div>
	</div>
</section>
