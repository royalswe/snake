<main class="relative flex flex-col items-start justify-between gap-10 w-full">
	<div class="ml-20 text max-w-md">
		<h1
			class="text-4xl font-extrabold text-white uppercase leading-snug tracking-wider mt-20 mb-10"
		>
			blip.se<br />
			<span class="text-5xl">Snake</span>
		</h1>
		<p class="text-lg font-bold text-gray-100 mt-10 tracking-wider">
			This game is under development but you can try it out as is.
		</p>
		<p class="text-lg font-semibold text-gray-300 tracking-wider">
			Snake is a multiplayer game where the goal is to survive as long as possible. Challenge your
			friends and try to be the last man standing in the arena. Can you fill the entire board?
		</p>
	</div>
	<div class="ml-20 flex flex-col sm:flex-row gap-4">
		<button
			class="px-7 py-4 bg-slate-100 hover:bg-slate-300 active:bg-slate-400 text-lg font-bold text-black uppercase rounded-full shadow-md"
			type="button"
			onclick={() =>
				window.open('/game?room=quick&board=46:30', '_blank', 'width=1200,height=1000')}
			>Quick game
		</button>
		<a
			href="/lobby"
			class="px-7 py-4 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-lg font-bold text-white uppercase rounded-full shadow-md"
			>Go to lobby</a
		>
	</div>
</main>
