<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import type { GameState } from '$models/gameState';
	import { onMount } from 'svelte';
	import { useState } from '$lib/stores/state.svelte';
	import { useSnakes } from '$lib/stores/snakes.svelte';
	import { GAME_STATUS } from '$server/constants/status';
	import { BOARD } from '$lib/constants';

	let { parentWidth, parentHeight } = $props();

	const states = useState();
	const snakes = useSnakes();
	let board = $state(BOARD);
	let grid: any;
	let canvas: HTMLCanvasElement;
	let ctx: any;

	const delay = (func: Function, delay: number) => {
		let timer: any;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(() => func(), delay);
		};
	};

	function calculateAspectRatioFit() {
		const ratio = Math.min(
			(parentWidth as number) / board.width,
			(parentHeight as number) / board.height
		);
		return { width: board.width * ratio, height: board.height * ratio };
	}

	onMount(() => {
		setTimeout(() => {
			drawCanvas();
		}, 100);
	});
	$effect(() => {
		if (states.gameStatus === GAME_STATUS.countDown) {
			drawCanvas();
		}
	});
	$effect(() => {
		//requestAnimationFrame(() => {
		snakes.state?.forEach((state: GameState) => {
			drawPlayer(state);
		});
		//});
		ctx = canvas.getContext('2d');

		window.addEventListener('resize', delay(drawCanvas, 100));

		return () => {
			window.removeEventListener('resize', delay(drawCanvas, 100));
		};
	});

	function drawCanvas() {
		grid = calculateAspectRatioFit();

		const w = grid.width;
		const h = grid.height;

		// set the canvas width and height
		ctx.canvas.width = w;
		ctx.canvas.height = h;

		ctx.beginPath();
		ctx.fillStyle = '#1F2A39';
		ctx.rect(0, 0, w, h);
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = '#263445';
		for (let column = 0; column < board.width; column++) {
			for (let row = 0; row < board.height; row++) {
				if ((row % 2 === 0 && column % 2 === 1) || (row % 2 === 1 && column % 2 === 0)) {
					ctx.rect(
						(column * w) / board.width,
						(row * h) / board.height,
						w / board.width,
						h / board.height
					);
				}
			}
		}
		ctx.fill();
	}

	function drawPlayer(state: GameState) {
		const w = grid.width;
		const h = grid.height;
		let size = (w + h) / (state.grid.x + state.grid.y);

		const snake = state.snake;
		ctx.fillStyle = state.color; //'#' + Math.floor(Math.random() * 16777215).toString(16);

		for (let i = 0; i < snake.length; i++) {
			const cell = snake[i];

			ctx.beginPath();
			ctx.arc(cell.x * size + size / 2, cell.y * size + size / 2, size / 2 - 0.5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000000';
			ctx.stroke();
		}
	}
</script>

<canvas bind:this={canvas}></canvas>
