<main>
	<div class="ml-10 text">
		<h1>blip.se<br /> <span>Snake</span></h1>
		<p>This game is in early beta but you can try it out.</p>
		<p>
			Snake is a multiplayer game where you must slither and survive as long as possible. Challenge
			your friends and try to be the last man standing in the arena. Can you fill the entire board?
		</p>
	</div>
	<div class="ml-10 buttons">
		<button
			class="btn3"
			type="button"
			on:click={() =>
				window.open('/game?room=quick&board=46:30', '_blank', 'width=1200,height=1000')}
			>Quick game</button
		>
	</div>
	<div class="snake">
		<img src="images/snake-green.png" alt="snake arena" />
	</div>
</main>

<style>
	main {
		position: relative;
		display: flex;
		width: 100%;
		align-items: flex-start;
		justify-content: space-between;
		flex-direction: column;
		gap: 2em;
	}
	main .text {
		position: relative;
		max-width: 600px;
	}
	main .text h1 {
		font-family: 'Poppins', sans-serif;
		text-transform: uppercase;
		font-weight: 800;
		margin-top: 80px;
		line-height: 1.5em;
		letter-spacing: 0.1em;
		font-size: 40px;
		color: #fff;
	}
	main .text h1 span {
		font-size: 50px;
	}
	main .text p {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: 0.1em;
		margin-top: 40px;
		color: #e7e3e3;
	}
	.btn3 {
		background: linear-gradient(to bottom, #cbcbcb 2%, #fff 100%);
		padding: 15px 30px;
		border: none;
		outline: none;
		text-transform: uppercase;
		color: #1b1b1b;
		font-size: 1em;
		font-weight: 700;
		border-radius: 30px;
		box-shadow: 1px 4px 12px rgba(94, 28, 68, 0.15);
	}
	.snake {
		display: flex;
		height: 100%;
		position: absolute;
		width: 565px;
		margin-top: 80px;
		right: 0;
	}
</style>
