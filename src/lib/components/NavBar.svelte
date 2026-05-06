<script lang="ts">
	import { onMount } from 'svelte';

	let scrolled = $state(false);
	let menuOpen = $state(false);

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 30;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function close() {
		menuOpen = false;
	}
</script>

<nav class:scrolled>
	<a href="#top" class="brand" onclick={close}>
		<span class="brand-mark">
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
				<path
					d="M4 22 L11 10 L16 18 L21 12 L28 22"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<circle cx="22.5" cy="8.5" r="2.2" fill="currentColor" />
			</svg>
		</span>
		Vancity<em>Dev</em>
	</a>

	<div class="nav-links">
		<a href="#work">Work</a>
		<a href="#pricing">Pricing</a>
		<a href="#about">About</a>
		<a href="#contact">Contact</a>
	</div>

	<a href="#contact" class="nav-cta">
		<span class="dot"></span>
		Booking projects · Q3
	</a>

	<button
		class="menu-btn"
		data-open={menuOpen ? '1' : '0'}
		onclick={() => (menuOpen = !menuOpen)}
		aria-label="Menu"
	>
		<span></span><span></span><span></span>
	</button>
</nav>

<div class="mobile-sheet" data-open={menuOpen ? '1' : '0'}>
	<div>
		<a href="#work" onclick={close}>Work <span>01</span></a>
		<a href="#pricing" onclick={close}>Pricing <span>02</span></a>
		<a href="#about" onclick={close}>About <span>03</span></a>
		<a href="#contact" onclick={close}>Contact <span>04</span></a>
	</div>
	<div class="mobile-coords">49.2827° N, 123.1207° W &nbsp;·&nbsp; Vancouver, BC</div>
</div>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 22px 36px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition:
			backdrop-filter 0.3s,
			background 0.3s,
			padding 0.25s;
	}

	nav.scrolled {
		backdrop-filter: blur(14px) saturate(140%);
		-webkit-backdrop-filter: blur(14px) saturate(140%);
		background: color-mix(in oklab, var(--bg) 72%, transparent);
		padding: 14px 36px;
		border-bottom: 0.5px solid var(--line);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--serif);
		font-weight: 500;
		font-size: 22px;
		letter-spacing: -0.01em;
	}

	.brand-mark {
		width: 26px;
		height: 26px;
		flex: 0 0 auto;
		display: grid;
		place-items: center;
	}

	.brand-mark svg {
		width: 100%;
		height: 100%;
	}

	.brand em {
		font-style: italic;
		color: var(--accent);
	}

	.nav-links {
		display: flex;
		gap: 34px;
		align-items: center;
		font-size: 13.5px;
		letter-spacing: 0.01em;
	}

	.nav-links a {
		color: var(--ink-soft);
		position: relative;
		padding: 4px 0;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: var(--ink);
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 100%;
		bottom: -2px;
		height: 1px;
		background: currentColor;
		transition: right 0.25s cubic-bezier(0.3, 0.7, 0.4, 1);
	}

	.nav-links a:hover::after {
		right: 0;
	}

	.nav-cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 9px 16px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--bg);
		font-size: 13px;
		font-weight: 500;
		transition:
			transform 0.2s,
			background 0.2s;
	}

	.nav-cta:hover {
		transform: translateY(-1px);
		background: var(--accent);
	}

	.nav-cta .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #69c97a;
		box-shadow: 0 0 0 3px color-mix(in oklab, #69c97a 35%, transparent);
		animation: pulse 2.4s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	.menu-btn {
		display: none;
		appearance: none;
		border: 0;
		background: transparent;
		width: 40px;
		height: 40px;
		padding: 0;
		cursor: pointer;
	}

	.menu-btn span {
		display: block;
		width: 22px;
		height: 1.5px;
		background: var(--ink);
		margin: 5px auto;
		transition:
			transform 0.25s,
			opacity 0.25s;
	}

	.menu-btn[data-open='1'] span:nth-child(1) {
		transform: translateY(6.5px) rotate(45deg);
	}

	.menu-btn[data-open='1'] span:nth-child(2) {
		opacity: 0;
	}

	.menu-btn[data-open='1'] span:nth-child(3) {
		transform: translateY(-6.5px) rotate(-45deg);
	}

	.mobile-sheet {
		position: fixed;
		inset: 0;
		z-index: 95;
		background: var(--bg);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 96px 36px 36px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
	}

	.mobile-sheet[data-open='1'] {
		opacity: 1;
		pointer-events: auto;
	}

	.mobile-sheet a {
		font-family: var(--serif);
		font-size: 42px;
		font-weight: 400;
		padding: 14px 0;
		border-bottom: 0.5px solid var(--line);
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.mobile-sheet a span {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--ink-soft);
	}

	.mobile-coords {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--ink-soft);
		letter-spacing: 0.08em;
	}

	@media (max-width: 820px) {
		nav {
			padding: 18px 22px;
		}
		nav.scrolled {
			padding: 12px 22px;
		}
		.nav-links,
		.nav-cta {
			display: none;
		}
		.menu-btn {
			display: block;
		}
	}
</style>
