<script lang="ts">
	import { chat } from '$lib/stores/chat';
	import { send } from '$lib/ws';
	import { LOBBY_EVENT } from '$server/constants/events';
	import { onMount } from 'svelte';
	let message = '';
	let chatContainer: HTMLElement;

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
	function formatDate(datetime: string) {
		const date = new Date(datetime);
		return date.toLocaleTimeString('sv-se', {
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}
</script>

<div class="chat-messages flex flex-col">
	<ul class="overflow-y-auto" bind:this={chatContainer}>
		{#each $chat as chat}
			<li class="mb-1 text-xs">
				{#if chat.datetime}
					<slot name="date" datetime={formatDate(chat.datetime)} />
				{/if}
				{#if chat.sender}
					<slot name="sender" sender={chat.sender} />
				{/if}
				<slot name="message" message={chat.message}>
					<i class="md:text-sm text-white">
						{chat.message}
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
</div>
