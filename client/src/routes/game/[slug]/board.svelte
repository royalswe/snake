<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import type { GameState } from '$models/gameState';
	import { onMount } from 'svelte';
	import { COLOURS } from '$lib/constants';
	import { state } from '$lib/stores/state';
	import { board } from '$lib/stores/board';

	export let parentWidth: number;
	export let parentHeight: number;
	let width: number;
	let height: number;
	let grid: any;

	let canvas: HTMLCanvasElement;
	let ctx: any;
	$: (height || width) && drawCanvas();
	$: (height = $state.board.height), (width = $state.board.width);
	const delay = (func: Function, delay: number) => {
		let timer: any;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(() => func(), delay);
		};
	};

	function calculateAspectRatioFit() {
		const ratio = Math.min(parentWidth / width, parentHeight / height);
		console.log(parentWidth,width, parentHeight,height);
		
		return { width: width * ratio, height: height * ratio };
	}

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

		// let { boardWidth, boardHeight } = getContext(BOARD);
		// console.log(boardWidth, boardHeight);

		// setTimeout(() => {
		// 	drawCanvas();
		// });

		window.addEventListener('resize', delay(drawCanvas, 100));
		return () => {
			window.removeEventListener('resize', delay(drawCanvas, 100));
		};
	});

	function drawCanvas() {
		grid = calculateAspectRatioFit();

		const w = grid.width;
		const h = grid.height;
		const step = (w + h) / (width + height);

		ctx.canvas.width = w;
		ctx.canvas.height = h;

		ctx.fillStyle = COLOURS.BG;
		ctx.fillRect(0, 0, w, h);

		for (let x = 0; x <= w; x += step) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, h);
		}
		for (let y = 0; y <= h; y += step) {
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
		}
		ctx.stroke();
	}

	function drawPlayer(state: GameState) {
		const w = grid.width;
		const h = grid.height;
		const size = (w + h) / (state.grid.x + state.grid.y);

		const snake = state.snake;

		for (let i = 0; i < snake.length; i++) {
			const cell = snake[i];
			ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);

			//ctx.beginPath();
			//ctx.fillStyle = '#ccc';
			//drawBorder(cell.x * size, cell.y * size, size, size);
			//ctx.fillStyle = state.color;

			ctx.fillRect(cell.x * size, cell.y * size, size, size);
			//ctx.stroke();
		}
	}

	// function drawBorder(xPos, yPos, w, h, thickness = 1) {
	// 	ctx.fillStyle = '#000';
	// 	ctx.fillRect(xPos - thickness, yPos - thickness, w + thickness * 2, h + thickness * 2);
	// }
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		border: 1px solid blue;
		/* object-fit: contain; */
		/* aspect-ratio: 5/3;  */
		/* height: 100%; */
	}
</style>
