<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	let countdown = 5;
	let timer: any;
	$: {
		if (countdown === 0) {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		}
	}
	onMount(() => {
		timer = setInterval(() => {
			countdown -= 1;
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<span>{countdown}</span>

<style>
	span {
		font-size: 100px;
		position: absolute;
		color: #85ba51;
	}
</style>
