<script>
	import { chat } from '$lib/stores/chat';

	let message = '';
</script>

<ul class="p-1 h-full bg-black">
	{#each $chat as chat}
		<li>{chat.message}</li>
	{/each}
</ul>

<span>
	<input
		bind:value={message}
		placeholder="Type your message here"
		on:keydown|preventDefault={(e) => {
			if (e.key === 'Enter') {
				//	chat.send(message);
				message = '';
			}
		}}
	/>

	<button
		on:click={() => {
			//	chat.send(message);
			message = '';
		}}
		>Send
	</button>
</span>

<style lang="postcss">
	ul {
		overflow-y: scroll;
	}
	/** button is square and input takes rest of the width*/
	input,
	button {
		/** make input and button align horizontally*/
		display: inline-block;
		height: 2rem;
	}
	input {
		width: calc(100% - 2.5rem);
	}
	button {
		width: 2.2rem;
	}
</style>
