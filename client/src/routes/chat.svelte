<script lang="ts">
	import { chat } from '$lib/stores/chat';
	import { send } from '$lib/ws';
	import { LOBBY_EVENT } from '$server/constants/events';
	let message = '';

	const sendChat = () => {
		if (message) {
			send(LOBBY_EVENT.chat, { msg: message });
			message = '';
		}
	};

	// A helper function to format the datetime in a readable format
	function formatDate(datetime: string) {
		const date = new Date(datetime);
		return date.toLocaleTimeString('default', {
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}
</script>

<ul class="chat-messages flex flex-col overflow-y-auto">
	{#each $chat as chat (chat.datetime)}
		<li class="{chat.sender === 'me' ? 'self-end' : 'self-start'} mb-2">
			<div class="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
				<div
					class="inline-block py-1 px-3 rounded-lg shadow {chat.sender === 'me'
						? 'bg-blue-100'
						: 'bg-gray-100'}"
				>
					<p class="text-xs md:text-sm text-gray-800 break-words">{chat.message}</p>
					<div class="flex items-center justify-between text-xs text-gray-500 mt-1">
						<span
							class="{chat.sender === 'me'
								? 'font-semibold text-blue-600'
								: 'font-semibold text-gray-700'} mr-2">{chat.sender}</span
						>
						<!-- Make the sender name bold and colored when it's 'me', and grey otherwise -->
						<span class="text-gray-400">{formatDate(chat.datetime)}</span>
						<!-- Make the date less prominent with a lighter color -->
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>

<span class="chat-footer">
	<input
		type="text"
		bind:value={message}
		class="chat-input"
		placeholder="Type your message here"
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				sendChat();
			}
		}}
	/>

	<button
		class="chat-submit"
		on:click={() => {
			sendChat();
		}}
		>Send
	</button>
</span>
