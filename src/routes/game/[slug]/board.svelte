<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { COLOURS, GRID_SIZE } from './constants';
	import type { GameState, Cell } from '$lib/types';
	import { board } from '$lib/stores/board';

	console.log('gamestate:', $board);

	export let width = 600;
	export let height = 600;

	let canvas: HTMLCanvasElement;
	let ctx: any;

	onMount(() => {
		board.subscribe((states: any) => {
			if (!states) {
				return;
			}
			requestAnimationFrame(() => {
				states.forEach((state: GameState) => {
					drawPlayer(state);
				});
			});
		});
		ctx = canvas.getContext('2d');
		ctx.fillStyle = COLOURS.BG;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		drawCanvas();
		//drawCanvas(gameState);
	});

	function drawCanvas() {
		ctx.fillStyle = COLOURS.BG;
		ctx.fillRect(0, 0, width, height);
	}

	function drawPlayer(state: GameState) {
		const size = width / state.gridSize;

		const snake = state.snake;
		ctx.fillStyle = state.color;

		for (let i = 0; i < snake.length; i++) {
			const cell = snake[i];
			ctx.fillRect(cell.x * size, cell.y * size, size, size);
		}
	}
</script>

<canvas bind:this={canvas} {width} {height} />
