<script lang="ts">
	import { connect, send } from '$lib/ws';
	import { onMount } from 'svelte';

	onMount(async () => {
		connect(
			'wss://' +
				location.hostname +
				(location.hostname === 'localhost' ? ':5300' : '') +
				'/api/lobby'
		);
	});
	let gameCode: string;
	let boardWidth: string;
	let boardHeight: string;
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Svelte snake app" />
	<!-- TODO: remove bootstrap -->
</svelte:head>

<main class="flex mt-3 flex-col items-center w-full">
	<h1 class="text-white">Snake lobby</h1>
	<h2 class="m-2 text-white">Create a new room</h2>
	<div class=" flex mt-3 flex-col items-center">
		<span class="relative w-full">
			<input type="text" name="room" required bind:value={gameCode} />
			<label for="room">Room name</label>
		</span>
		<div class="flex w-full">
			<span class="relative md:w-1/2 mr-1">
				<input type="text" name="width" required bind:value={boardWidth} />
				<label for="width">Board width</label>
			</span>
			<span class="relative md:w-1/2 ml-1">
				<input type="text" name="height" required bind:value={boardHeight} />
				<label for="height">Board height</label>
			</span>
		</div>
		<a
			href="/game?room={gameCode}&board={boardWidth}:{boardHeight}"
			class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
		>
			Join Game
		</a>
	</div>
</main>

<style>
	label {
		transform: translateY(50%);
		transition: all 0.2s ease-in-out;
		position: absolute;
		top: 5%;
		left: 1em;
		background: none;
		color: #b3b3b3;
		font-weight: normal;
		cursor: text;
		pointer-events: none;
		font-family: sans-serif;
	}

	input {
		display: block;
		border-radius: 3px;
		transition: border-color;
		box-sizing: border-box;
		background-color: white;
		border-radius: 3px;
		border: 1px solid #ddd;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
		font-family: sans-serif;
		font-size: 1em;
		margin-right: 0;
		margin-bottom: 0.75em;
		padding: 0.5em 0.5em;
		padding: 0.75em;
		width: 100%;
	}

	input:focus ~ label,
	input:valid ~ label {
		top: -30%;
		font-size: 0.8em;
		padding: 0 0.3em;
		background: #f9f9f9;
	}
</style>
