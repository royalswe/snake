<script lang="ts">
	import Snake from './snake.svelte';
	import ErrorModule from '$lib/errorModule.svelte';
	import { connect, send } from '$lib/ws';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { state } from '$lib/stores/state';
	import { chat } from '$lib/stores/chat';
	import ClientList from './clientList.svelte';

	const roomName = $page.data.room;
	const params = $page.data;

	onMount(async () => {
		connect(
			'wss://' +
				location.hostname +
				(location.hostname === 'localhost' ? ':5300' : '') +
				'/api/room',
			params
		);
	});
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Svelte snake app" />
</svelte:head>

<div class="wrapper">
	<header>
		<h1>Your game code is: <span id="gameCodeDisplay" />{roomName}</h1>
		GameState: {$state.gameStatus} / PlayerState {$state.playerStatus}
	</header>

	<sidebar>
		<ClientList />
		<h4>Chat</h4>
		<ul>
			{#each $chat as chat}
				<li>{chat.message}</li>
			{/each}
		</ul>
	</sidebar>
	<main>
		<Snake />
	</main>

	{#if $state.error}
		<ErrorModule errorMsg={$state.error} />
	{/if}
</div>

<style lang="postcss">
	.wrapper {
		height: 100vh;
		display: grid;
		grid-template:
			'header header'
			'sidebar main' minmax(auto, calc(100vh - 75px)) / 350px auto;

		@media (width < 600px) {
			grid-template:
				'header'
				'main' 1fr
				'sidebar';
		}
	}
	header {
		grid-area: header;
		color: antiquewhite;
		background-color: blue;
	}
	sidebar {
		grid-area: sidebar;
		background-color: orange;
	}
	main {
		grid-area: main;
		background-color: grey;
		border: solid yellow 3px;
		overflow: hidden;
		min-height: 100px;
	}
</style>
