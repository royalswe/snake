<header>
	<img src="./images/snake-pixel.256.png" class="logo ml-5" alt="snake logo" />
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/lobby">Lobby</a></li>
			<li />
			<li><a href="#">Instructions</a></li>
		</ul>
	</nav>

	<a class="btn btn1" href="https://mongot.com/login">Log In</a>
	<a class="btn btn1" href="https://mongot.com/register">Sign Up</a>
</header>
<slot />

<style lang="postcss">
	:root {
		--color-secondary-500: #48789b;
		--color-error-500: 213 126 120;
	}

	:global([data-theme='royal']) {
		background-color: #48789b;
	}

	header {
		width: 100%;
		height: 15vh;
		margin: auto;
		display: flex;
		align-items: center;
	}
	.logo {
		width: 80px;
		margin-top: 10px;
		cursor: pointer;
	}
	nav {
		flex: 1;
	}
	nav ul li {
		display: inline-block;
		list-style: none;
		margin: 0 15px;
	}
	nav ul li a {
		text-decoration: none;
		color: #fff;
		font-family: 'Poppins', sans-serif;
		text-transform: uppercase;
		font-size: 15px;
		font-weight: 600;
	}
	.btn1 {
		text-transform: uppercase;
		background: linear-gradient(to bottom, #378de5 3%, #48789b 100%);
		border-radius: 30px;
		border: 1px solid #5e97d1;
		cursor: pointer;
		color: #fff;
		font-family: 'Poppins', sans-serif;
		font-size: 17px;
		font-weight: 700;
		padding: 12px 20px;
		margin: 10px;
		text-decoration: none;
		box-shadow: 1px 4px 12px rgba(94, 28, 68, 0.15);
		text-shadow: 0px 1px 0px #528ecc;
	}
	#btn2 {
		text-transform: uppercase;
		background: linear-gradient(to bottom, #cbcbcb 2%, #fff 100%);
		border-radius: 30px;
		border: 1px solid #cbcbcb;
		cursor: pointer;
		color: #5e97d1;
		font-family: 'Poppins', sans-serif;
		font-size: 17px;
		font-weight: 700;
		padding: 12px 20px;
		margin: 10px;
		text-decoration: none;
		box-shadow: 1px 4px 12px rgba(94, 28, 68, 0.15);
		text-shadow: 0px 1px 0px #cbcbcb;
	}
	.btn:hover {
		box-shadow: 3px 8px 22px rgba(94, 28, 68, 0.15);
		transform: scale(1.1);
		transition: 0.2s ease-in-out;
	}
</style>
