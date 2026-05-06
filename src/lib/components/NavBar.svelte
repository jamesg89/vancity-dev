<nav>
	<a href="/" class="logo">
		<span class="logo-vancity">Vancity</span><span class="logo-dev">Dev</span>
	</a>

	<ul class="nav-links">
		<li><a href="#work">Work</a></li>
		<li><a href="#pricing">Pricing</a></li>
		<li><a href="#about">About</a></li>
		<li><a href="#contact">Contact</a></li>
	</ul>

	<a href="#contact" class="booking-pill">Booking projects · Q3</a>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.1rem 2.5rem;
		background: var(--bg);
		border-bottom: 1px solid var(--line);
	}

	.logo {
		font-family: var(--serif);
		font-style: italic;
		font-weight: 500;
		font-size: 1.15rem;
		letter-spacing: -0.01em;
	}

	.logo-vancity { color: var(--ink); }
	.logo-dev { color: var(--accent); }

	.nav-links {
		display: flex;
		gap: 2rem;
		list-style: none;
	}

	.nav-links a {
		font-family: var(--sans);
		font-size: 0.875rem;
		color: var(--ink-soft);
		transition: color 0.15s;
	}

	.nav-links a:hover { color: var(--ink); }

	.booking-pill {
		font-family: var(--mono);
		font-size: 0.75rem;
		background: var(--ink);
		color: var(--bg);
		padding: 0.45rem 1rem;
		border-radius: 9999px;
		letter-spacing: 0.01em;
		transition: background 0.15s;
	}

	.booking-pill:hover { background: var(--accent); }

	@media (max-width: 640px) {
		.nav-links { display: none; }
		nav { padding: 1rem 1.25rem; }
	}
</style>
