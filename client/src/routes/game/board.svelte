<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import type { GameState } from '$models/gameState';
	import { createEventDispatcher, onMount } from 'svelte';
	import { state } from '$lib/stores/state';
	import { board } from '$lib/stores/board';
	import { GAME_STATUS } from '$server/constants/status';

	export let parentWidth: number;
	export let parentHeight: number;
	let width: number;
	let height: number;
	let grid: any;

	let canvas: HTMLCanvasElement;
	let ctx: any;

	const dispatch = createEventDispatcher();

	$: $state.gameStatus === GAME_STATUS.countDown && drawCanvas();
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
		return { width: width * ratio, height: height * ratio };
	}

	onMount(() => {
		board.subscribe((states: any) => {
			if (!states) {
				return console.log('no state on canvas loop');
			}
			//requestAnimationFrame(() => {
			states.forEach((state: GameState) => {
				drawPlayer(state);
			});
			//});
		});
		ctx = canvas.getContext('2d');

		window.addEventListener('resize', delay(drawCanvas, 100));
		return () => {
			window.removeEventListener('resize', delay(drawCanvas, 100));
		};
	});

	function drawCanvas() {
		grid = calculateAspectRatioFit();
		dispatch('canvasRezise', grid);

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
		for (let column = 0; column < width; column++) {
			for (let row = 0; row < height; row++) {
				if ((row % 2 === 0 && column % 2 === 1) || (row % 2 === 1 && column % 2 === 0)) {
					ctx.rect((column * w) / width, (row * h) / height, w / width, h / height);
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

<canvas bind:this={canvas} />
