<script lang="ts">
	import type { UrlParams } from '$models/urlParams';
	import Snake from './snake.svelte';
	import ErrorModule from '$lib/errorModule.svelte';
	import { connect } from '$lib/ws';
	import { onMount } from 'svelte';
	import { state } from '$lib/stores/state';
	import Chat from './chat.svelte';
	import ClientList from './clientList.svelte';
	import './room.postcss';

	$: roomName = '';

	onMount(async () => {
		// Get room name and board size from url
		const url = new URLSearchParams(window.location.search);

		roomName = url.get('room') as string;
		const board = url.get('board');
		const paramns: UrlParams = { room: roomName };
		if (board) {
			paramns.width = +board?.split(':')[0];
			paramns.height = +board?.split(':')[1];
		}

		connect(
			'wss://' +
				location.hostname +
				(location.hostname === 'localhost' ? ':5300' : '') +
				'/api/room',
			paramns
		);
	});
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Svelte snake app" />
</svelte:head>

<div class="wrapper">
	<header>
		<!-- snake img with title aside-->
		<div class="flex-inline h-full">
			<img src="/images/snake-pixel.256.png" width="100" alt="snake logo" />
			<div class="mx-2 flex flex-col justify-evenly h-full">
				<h4>Room name: {roomName}</h4>
				<h4>GameState: {$state.gameStatus} / PlayerState: {$state.playerStatus}</h4>
			</div>
		</div>
	</header>

	<sidebar>
		<div class="flex flex-col h-full p-1 gap-1">
			<ClientList />
			<Chat />
		</div>
	</sidebar>
	<main class="p-1">
		<Snake />
	</main>

	{#if $state.error}
		<ErrorModule errorMsg={$state.error} />
	{/if}
</div>
