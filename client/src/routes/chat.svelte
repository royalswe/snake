<script lang="ts">
	import { useChat } from '$lib/stores/chat.svelte';
	import { send } from '$lib/ws';
	import { LOBBY_EVENT } from '$server/constants/events';
	import { onMount } from 'svelte';
	let message = '';
	let chatContainer: HTMLElement;
	const chat = useChat();

	const sendChat = () => {
		if (message) {
			send(LOBBY_EVENT.chat, { msg: message });
			message = '';
		}
	};

	onMount(() => {
		// Scroll to the bottom of the chat container when new messages are added
		const observer = new MutationObserver(() => {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		});
		observer.observe(chatContainer, { childList: true });
	});

	// A helper function to format the datetime in a readable format
	function formatDate(dateString: string) {
		// Split the date and time parts
		const [datePart, timePart] = dateString.split(', ');
		// Split the date into day, month
		const [day, month] = datePart.split('/');
		// Split the time and ignore seconds
		const [hours, minutes] = timePart.split(':');

		return `${month}/${day} ${hours}:${minutes}`;
	}
</script>

<div class="chat-messages flex flex-col">
	<ul class="overflow-y-auto" bind:this={chatContainer}>
		{#each chat.messages as message}
			<li class="mb-1 text-xs">
				{#if message.datetime}
					<slot name="date" datetime={formatDate(message.datetime)} />
				{/if}
				{#if message.sender}
					<slot name="sender" sender={message.sender} />
				{/if}
				<slot name="message" message={message.message}>
					<i class="md:text-sm text-white">
						{message.message}
					</i>
				</slot>
			</li>
		{/each}
	</ul>

	<span class="chat-footer">
		<input
			type="text"
			bind:value={message}
			class="chat-input"
			placeholder="Type your message here"
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					sendChat();
				}
			}}
		/>

		<button
			class="chat-submit"
			onclick={() => {
				sendChat();
			}}
			>Send
		</button>
	</span>
</div>
