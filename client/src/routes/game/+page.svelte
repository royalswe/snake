<script lang="ts">
	import type { UrlParams } from '$models/urlParams';
	import Snake from './snake.svelte';
	import ErrorModule from '$lib/errorModule.svelte';
	import { connect } from '$lib/ws';
	import { onMount } from 'svelte';
	import { state } from '$lib/stores/state';
	import Chat from '../chat.svelte';
	import ClientList from './clientList.svelte';

	$: roomName = '';

	onMount(async () => {
		// Get room name and board size from url
		const url = new URLSearchParams(window.location.search);

		roomName = url.get('room') as string;
		const board = url.get('board');
		const params: UrlParams = { room: roomName };
		if (board) {
			params.width = +board?.split(':')[0];
			params.height = +board?.split(':')[1];
		}

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
	<style src="./room.postcss"></style>
</svelte:head>

<div class="wrapper">
	<header>
		<!-- snake img with title aside-->
		<div class="inline-flex items-center h-full">
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
			<div class="h-full overflow-hidden game-chat">
				<Chat>
					<span slot="sender" class="text-orange-500 mr-1" let:sender>{sender}:</span>
				</Chat>
			</div>
		</div>
	</sidebar>
	<main class="p-1">
		<Snake />
	</main>

	{#if $state.error}
		<ErrorModule />
	{/if}
</div>

<style global lang="postcss">
	.game-chat {
		.chat-messages {
			ul {
				@apply p-1 h-full bg-black;
			}
			@apply h-full;
		}

		.chat-input {
			@apply mr-1 px-2 py-2 w-full rounded-md text-black;
		}

		.chat-submit {
			@apply px-4 py-2 bg-blue-500 text-white rounded-md;
		}
		.chat-footer {
			display: flex;
		}
	}
</style>
