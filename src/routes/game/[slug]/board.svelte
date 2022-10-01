<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { COLOURS } from './constants';
	import type { GameState, Cell } from '$lib/types';
	import { board } from '$lib/stores/board';

	console.log('gamestate:', $board);

	export let width: number;
	export let height: number;

	let canvas: HTMLCanvasElement;
	let ctx: any;

	onMount(() => {
		board.subscribe((val: any) => {
			console.log('val', val);
			if (!val) {
				return;
			}
			requestAnimationFrame(() => drawCanvas(val));
		});
		ctx = canvas.getContext('2d');
		ctx.fillStyle = COLOURS.BG;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//drawCanvas(gameState);
	});

	function drawCanvas(state: GameState) {
		ctx.fillStyle = COLOURS.BG;
		ctx.fillRect(0, 0, width, height);

		const gridsize = state.gridsize;
		const size = width / gridsize;

		drawPlayer(state, size);
	}

	function drawPlayer(state: GameState, size: number) {
		const snake = state.snake;

		ctx.fillStyle = COLOURS.SNAKE;

		for (let i = 0; i < snake.length; i++) {
			const cell = snake[i];
			ctx.fillRect(cell.x * size, cell.y * size, size, size);
		}
	}
</script>

<canvas bind:this={canvas} {width} {height} />
