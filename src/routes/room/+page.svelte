<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { connect, state, send } from '$lib/ws';
	import Snake from './snake.svelte';
	import Board from './board.svelte';

	type SnakeBody = {
		x: number;
		y: number;
	};

	let message: string;

	onMount(async () => {
		connect('ws://localhost:3100/room');
	});

	function startGame() {
		send({
			type: 'start-game'
		});
	}

	async function onSendMessage() {
		if (message.length > 0) {
			send({
				type: 'chat-message',
				message
			});
			message = '';
		}
	}

	let direction: string = 'right';
	let velocity = { x: 1, y: 0 };
	let snakeTiles = [] as SnakeBody[];

	$: score = snakeTiles.length - 3;

	function isCollide(a: SnakeBody, b: SnakeBody) {
		return !(a.y < b.y || a.y > b.y || a.x < b.x || a.x > b.x);
	}

	function resetGame() {
		direction = 'down';
		snakeTiles = [
			{
				x: 10,
				y: 1
			},
			{
				x: 11,
				y: 1
			},
			{
				x: 12,
				y: 1
			}
		];
	}

	function getSnakeDirection(key: string) {
		if (key === 'ArrowUp' && direction !== 'down') {
			return 'up';
		} else if (key === 'ArrowDown' && direction !== 'up') {
			return 'down';
		} else if (key === 'ArrowLeft' && direction !== 'right') {
			return 'left';
		} else if (key === 'ArrowRight' && direction !== 'left') {
			return 'right';
		}
		return false;
	}

	function onKeyDown(e: KeyboardEvent) {
		const newDirection = getSnakeDirection(e.code);
		if (newDirection) {
			direction = newDirection;
		}
	}

	function isGameover(): boolean {
		const snakeBodiesNoHead = snakeTiles.slice(1);
		const snakeCollisions = snakeBodiesNoHead.filter((sb) => isCollide(sb, snakeTiles[0]));

		if (snakeCollisions.length > 0) {
			return true;
		}

		// check if snake is out of bounds
		const { y, x } = snakeTiles[0];
		if (y >= 22 || y < 1 || x < 1 || x >= 22) {
			return true;
		}
		return false;
	}

	resetGame();

	// // Accurate loop
	function intervalTimer(callback, interval = 500) {
		let counter = 1;
		let timeoutId;
		const startTime = Date.now();

		function main() {
			const nowTime = Date.now();
			const nextTime = startTime + counter * interval;
			timeoutId = setTimeout(main, interval - (nowTime - nextTime));

			counter += 1;
			callback();
		}

		timeoutId = setTimeout(main, interval);

		return () => {
			clearTimeout(timeoutId);
		};
	}

	// run loop
	const cancelTimer = intervalTimer(() => {
		if (isGameover() === false) {
			// game logic
			let { x, y } = snakeTiles[0];

			if (direction === 'up') {
				y -= 1;
			} else if (direction === 'down') {
				y += 1;
			} else if (direction === 'left') {
				x -= 1;
			} else if (direction === 'right') {
				x += 1;
			}

			const newHead = { x, y };
			snakeTiles = [newHead, ...snakeTiles];

			snakeTiles = [...snakeTiles, snakeTiles[snakeTiles.length - 1]];
		} else {
			cancelTimer();
			resetGame();
		}
	}, 1000);
</script>

<h1>Snake</h1>
<main>
	<Board>
		<Snake {direction} {snakeTiles} />
	</Board>
</main>
<h2>Score: {score}</h2>

<input type="text" bind:value={message} />
<button on:click={startGame}>Start</button>
<button on:click={onSendMessage}> Send Message </button>

{#each $state.messages as message}
	<p>{message}</p>
{/each}
<svelte:window on:keydown={onKeyDown} />

<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		background-color: #3384a9;
	}
	h2,
	h1 {
		text-align: center;
		width: 100%;
	}
</style>
