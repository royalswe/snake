<script lang="ts">
	import { state } from '$lib/stores/state';

	const clearErrors = () => {
		$state.error = undefined;
	};
</script>

<div class="overlay">
	<div class="popup">
		<h2>Ouch...</h2>
		<button class="close" on:click={clearErrors}>&times;</button>
		<div class="content text-gray-900">
			{$state.error}
		</div>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		transition: opacity 500ms;
	}

	.popup {
		margin: 70px auto;
		padding: 20px;
		background: #fff;
		border-radius: 5px;
		width: 30%;
		position: relative;
		transition: all 5s ease-in-out;
	}

	.popup h2 {
		margin-top: 0;
		color: #333;
		font-family: Tahoma, Arial, sans-serif;
	}
	.popup .close {
		position: absolute;
		top: 5px;
		right: 30px;
		transition: all 200ms;
		font-size: 30px;
		font-weight: bold;
		text-decoration: none;
		color: #333;
	}
	.popup .close:hover {
		color: #06d85f;
	}
	.popup .content {
		max-height: 30%;
		overflow: auto;
	}

	@media screen and (max-width: 700px) {
		.popup {
			width: 70%;
		}
	}
</style>
