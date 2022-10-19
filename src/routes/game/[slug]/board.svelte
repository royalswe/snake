<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { COLOURS, GRID_SIZE } from './constants';
	import type { GameState, Cell } from '$lib/types';
	import { board } from '$lib/stores/board';

	let canvasWidth: number;
	let canvasHeight: number;
	$: quadrat = Math.min(canvasWidth, canvasHeight);

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

		setTimeout(() => {
			drawCanvas();
		});

		window.addEventListener('resize', drawCanvas);
	});

	function drawCanvas() {
		ctx.fillStyle = COLOURS.BG;
		ctx.fillRect(0, 0, quadrat, quadrat);
	}

	function drawPlayer(state: GameState) {
		const size = quadrat / state.gridSize;
		const snake = state.snake;
		ctx.fillStyle = state.color;

		for (let i = 0; i < snake.length; i++) {
			const cell = snake[i];
			//ctx.beginPath();
			//ctx.fillStyle = '#ccc';
			//drawBorder(cell.x * size, cell.y * size, size, size);
			//ctx.fillStyle = state.color;

			ctx.fillRect(cell.x * size, cell.y * size, size, size);
			//ctx.stroke();
		}
	}

	function drawBorder(xPos, yPos, width, height, thickness = 1) {
		ctx.fillStyle = '#000';
		ctx.fillRect(xPos - thickness, yPos - thickness, width + thickness * 2, height + thickness * 2);
	}
</script>

<canvas
	bind:this={canvas}
	width={canvasWidth}
	height={canvasHeight}
	bind:offsetWidth={canvasWidth}
	bind:offsetHeight={canvasHeight}
/>

<style>
	canvas {
		border: 1px solid blue;
		object-fit: contain;
		aspect-ratio: 1;
		height: 100%;
		overflow: visible;
	}
</style>
