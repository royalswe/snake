<script lang="ts">
	import { connect, send } from '$lib/ws';
	import { onMount } from 'svelte';
	import { rooms } from '$lib/stores/rooms';

	onMount(async () => {
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
		while ($rooms.some((room) => room.name === name));

		return name;
	}

	function createGame() {
		const roomName = generateRoomName();
		const url = `/game?room=${roomName}&board=${boardWidth}:${boardHeight}`;
		window.open(url, '_blank', 'width=1200,height=1000');
	}

	let chatMessages = [
		{ sender: 'Alice', message: 'Hi there!' },
		{ sender: 'Bob', message: 'Hello! Anyone up for a game?' }
	];

	let onlinePlayers = ['Alice', 'Bob', 'Charlie'];
</script>

<svelte:head>
	<title>Snake</title>
	<meta name="description" content="Svelte snake app" />
	<!-- TODO: remove bootstrap -->
</svelte:head>

<div class="flex h-screen text-gray-200">
	<!-- Chat Sidebar -->
	<div class="w-1/4 bg-gray-900 p-4 border-r border-gray-700">
		<h2 class="text-2xl font-bold mb-4">Chat</h2>
		<div
			class="chat-messages bg-secondary h-64 overflow-y-scroll mb-4 border border-gray-700 p-4 rounded"
		>
			{#each chatMessages as chat}
				<p><strong>{chat.sender}:</strong> {chat.message}</p>
			{/each}
		</div>
		<input
			type="text"
			class="w-full p-2 rounded border border-gray-700 bg-gray-800 placeholder-gray-500"
			placeholder="Type your message..."
		/>
		<button class="w-full mt-2 bg-blue-700 text-gray-200 py-2 rounded hover:bg-blue-800"
			>Send</button
		>

		<!-- Online Players -->
		<div class="mt-6">
			<h3 class="text-xl font-bold mb-4">Online Players</h3>
			<ul>
				{#each onlinePlayers as player}
					<li>{player}</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Game Rooms -->
	<div class="flex-1 p-6 bg-c-blue-600">
		<h1 class="text-4xl font-bold mb-6">Game Lobby</h1>
		<button class="btn bg-green-700 hover:bg-green-800" on:click={() => (showModal = true)}
			>Create New Room</button
		>
		<a href="/game?room=sara&amp;board=46:30" class="btn3">Quick game</a>

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
					/>
					<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
						>&#8203;</span
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
							<button type="button" class="btn bg-blue-700 hover:bg-blue-800" on:click={createGame}
								>Create</button
							>
							<button
								type="button"
								class="btn bg-red-500 hover:bg-red-600 ml-2"
								on:click={() => (showModal = false)}>Cancel</button
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
					{#each $rooms as room}
						<tr class="hover:bg-gray-800">
							<td>{room.name}</td>
							<td>{room.clientIds}</td>
							<td>{room.status}</td>
							<td>No</td>
							<td>
								<a
									href="/game?room={room.name}"
									class="bg-blue-700 text-gray-200 py-1 px-2 rounded hover:bg-blue-800">Join</a
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
</div>

<style lang="postcss">
	.btn {
		@apply py-2 px-4 rounded text-gray-200;
	}
	td,
	th {
		@apply py-2 px-4;
	}
</style>
