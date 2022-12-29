<script lang="ts">
	import { state } from '$lib/stores/state';


	const clearErrors = () => {
		$state.error = undefined;
	};
</script>

<div class="popup">
	<span class="close-popup">X</span>
	<div class="pophead">Please choose a color to play with</div>
	<div class="popbody">
		<ul>
			<div class="player-check">
				<input id="red_player" type="checkbox" /> <label id="red" for="red_player" />
			</div>
			<div class="player-check">
				<input id="blue_player" type="checkbox" /> <label id="blue" for="blue_player" />
			</div>
			<div class="player-check">
				<input id="orange_player" type="checkbox" /> <label id="orange" for="orange_player" />
			</div>
			<div class="player-check">
				<input id="green_player" type="checkbox" /> <label id="green" for="green_player" />
			</div>
			<div class="player-check">
				<input id="purple_player" type="checkbox" /> <label id="purple" for="purple_player" />
			</div>
			<div class="player-check">
				<input id="black_player" type="checkbox" /> <label id="black" for="black_player" />
			</div>
		</ul>
	</div>
</div>

<div class="overlay">
	<div class="popup">
		<h2>Ouch...</h2>
		<a href="/#" class="close" on:click={clearErrors}>&times;</a>
		<div class="content">
			Hej HEj
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
		top: 20px;
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



	.popup {
    height: 150px;
    width: 500px;
    border-radius: 5px;
    left: -moz-calc(50% - 250px);
    left: -webkit-calc(50% - 250px);
    left: calc(50% - 250px);
    top: -moz-calc(50% - 115px);
    top: -webkit-calc(50% - 115px);
    top: calc(50% - 115px);
    background: #fbfbfb;
}

.player-check label {
    display: block;
    width: 85%;
    height: 85%;
    border-radius: 50%;
    cursor: pointer;
    top: 2px;
    left: 1px;
    background: #333;
    -webkit-box-shadow: inset 0 1px 3px rgb(0 0 0 / 50%);
    -moz-box-shadow: inset 0 1px 3px rgba(0,0,0,.5);
    box-shadow: inset 0 1px 3px rgb(0 0 0 / 50%);
}

.player-check {
    position: relative;
    float: left;
    margin: 8px 10px 10px;
    width: 10%;
    height: 0;
    padding: 5% 0;
    background: #ddd;
    -webkit-box-shadow: 0 1px 3px rgb(0 0 0 / 50%);
    -moz-box-shadow: 0 1px 3px rgba(0,0,0,.5);
    box-shadow: 0 1px 3px rgb(0 0 0 / 50%);
}
</style>
