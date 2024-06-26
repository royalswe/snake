<script lang="ts">
	import { connect, send } from '$lib/ws';
	import { onMount } from 'svelte';
	import { useRooms } from '$lib/stores/rooms.svelte';
	import { useOnlineClients } from '$lib/stores/onlineClients.svelte';
	import Chat from '../../chat.svelte';

	const rooms = useRooms();
	const clients = useOnlineClients();

	onMount(() => {
		connect(
			'wss://' +
				location.hostname +
				(location.hostname === 'localhost' ? ':5300' : '') +
				'/api/lobby'
		);
	});

	let boardWidth = '46';
	let boardHeight = '30';

	let showModal = false;

	// prettier-ignore
	function generateRoomName() {
		const adjectives = ["Doctor", "Cool", "Drunken", "Bloody", "Lame", "Rough", "Happy", "Sad", "Crazy", "Bitter", "Silent", "Dark", "Lingering", "Shy", "Psycho", "Mad", "Insane"];
		const animals = ["Wolf", "Blackhand", "Liama", "Thunder", "Christ", "Sloth", "Troll", "Grinch", "Beast", "Admiral", "Warrior", "General", "Dragonfly", "Stormrage"];
		let name: string;
		do {
			const randomNumber1 = Math.floor(Math.random() * adjectives.length);
			const randomNumber2 = Math.floor(Math.random() * animals.length);
			name = adjectives[randomNumber1] + "-" + animals[randomNumber2];
		}
		while (rooms.list?.some((room) => room.name === name));

		return name;
	}

	function createGame() {
		const roomName = generateRoomName();
		const url = `/game?room=${roomName}&board=${boardWidth}:${boardHeight}`;
		window.open(url, '_blank', 'width=1200,height=1000');
		showModal = false;
	}

	function joinGame(roomName: string) {
		const url = `/game?room=${roomName}`;
		window.open(url, '_blank', 'width=1200,height=1000');
	}
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Snake lobby" />
	<!-- TODO: remove bootstrap -->
</svelte:head>

<div class="flex flex-col sm:flex-row h-screen text-gray-200">
	<!-- Game Rooms -->
	<div class="flex-1 p-6 bg-c-blue-600">
		<h1 class="text-4xl font-bold mb-6">Game Lobby</h1>
		<button
			type="button"
			class="btn my-2 bg-green-700 hover:bg-green-800"
			onclick={() => (showModal = true)}
			>Create New Room
		</button>
		<!-- Create Room Modal -->
		{#if showModal}
			<div
				class="fixed z-10 inset-0 overflow-y-auto"
				aria-labelledby="modal-title"
				role="dialog"
				aria-modal="true"
			>
				<div
					class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
				>
					<div
						class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
						aria-hidden="true"
					></div>
					<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
						>​</span
					>
					<div
						class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
					>
						<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-gray-700">
							<h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Create a Game Room</h3>
							<div class="mb-4">
								<label for="boardWidth" class="block text-sm font-medium">Board Width</label>
								<input
									type="number"
									name="boardWidth"
									id="boardWidth"
									placeholder={boardWidth}
									bind:value={boardWidth}
									class="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
							<div>
								<label for="boardHeight" class="block text-sm font-medium">Board Height</label>
								<input
									type="number"
									name="boardHeight"
									id="boardHeight"
									placeholder={boardHeight}
									bind:value={boardHeight}
									class="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<button type="button" class="btn bg-blue-700 hover:bg-blue-800" onclick={createGame}
								>Create</button
							>
							<button
								type="button"
								class="btn bg-red-500 hover:bg-red-600 ml-2 mr-2"
								onclick={() => (showModal = false)}>Cancel</button
							>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Rooms Table -->
		<div class="mb-6 bg-gray-900 p-4 rounded border border-gray-700">
			<h2 class="text-2xl font-bold mb-4">Available Rooms</h2>
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="border-b border-gray-700">
						<th>Room Name</th>
						<th>Players</th>
						<th>Status</th>
						<th>Ranking</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#if rooms.list?.length < 1}
						<tr>
							<td colspan="5" class="text-center">No rooms available!</td>
						</tr>
						<tr>
							<td colspan="5" class="text-center">
								<button
									type="button"
									class="btn my-2 bg-green-700 hover:bg-green-800"
									onclick={() => (showModal = true)}
									>Create New Room
								</button>
							</td>
						</tr>
					{/if}
					{#each rooms.list as room}
						<tr class="hover:bg-gray-800">
							<td>{room.name}</td>
							<td>{room.clientIds}</td>
							<td>{room.status}</td>
							<td>No</td>
							<td>
								<button
									type="button"
									onclick={() => joinGame(room.name)}
									class="bg-blue-700 text-gray-200 py-1 px-2 rounded hover:bg-blue-800">Join</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- About the Lobby -->
		<div class="bg-gray-900 p-4 rounded border border-gray-700">
			<h2 class="text-2xl font-bold mb-4">About the Lobby</h2>
			<p>
				This is a space where players can gather, chat, and create or join existing game rooms. Have
				fun and play fair!
			</p>
		</div>
	</div>
	<!-- Chat Sidebar -->
	<div class="sm:w-1/4 w-full bg-gray-900 p-4 border-r border-gray-700 lobby-chat-container">
		<h2 class="text-2xl font-bold mb-4">Chat</h2>
		<Chat>
			<span slot="date" class="text-gray-500" let:datetime>{datetime}</span>
			<span slot="sender" class="text-orange-500 mr-1" let:sender>{sender}:</span>
		</Chat>
		<!-- Online Players -->
		<div class="mt-6">
			<h3 class="text-xl font-bold mb-4">Online Players</h3>
			<ul>
				{#each clients.list as client}
					<li>{client}</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style lang="postcss">
	.btn {
		@apply py-2 px-4 rounded text-gray-200;
	}
	td,
	th {
		@apply py-2 px-4;
	}

	:global(.lobby-chat-container .chat-messages ul) {
		@apply h-72 mb-4 border border-gray-700 p-2 rounded;
	}

	:global(.lobby-chat-container .chat-input) {
		@apply w-full p-2 rounded border border-gray-700 bg-gray-800 placeholder-gray-500;
	}

	:global(.lobby-chat-container .chat-submit) {
		@apply w-full bg-blue-700 text-gray-200 py-1 px-2 my-1 rounded;
	}
</style>
