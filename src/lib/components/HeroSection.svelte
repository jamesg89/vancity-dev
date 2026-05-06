<script lang="ts">
	import { onMount } from 'svelte';

	const SWAPS = ['fast', 'honest', 'bespoke', 'yours'];
	let swapIdx = $state(0);

	onMount(() => {
		const t = setInterval(() => {
			swapIdx = (swapIdx + 1) % SWAPS.length;
		}, 2400);
		return () => clearInterval(t);
	});
</script>

<section class="hero" id="top">
	<div class="container">
		<div class="hero-eyebrow reveal">
			<span class="pin"></span>
			Vancouver, BC · est. 2019
		</div>
		<h1 class="hero-h1 reveal" style="--rd: 100ms">
			Bespoke websites,<br />
			<em>handcrafted</em> &amp; <span class="swap">{SWAPS[swapIdx]}</span>.
		</h1>
		<p class="hero-sub reveal" style="--rd: 240ms">
			I&rsquo;m James — a one-person studio building custom, fast, honestly-priced websites for
			businesses across the Lower Mainland. No templates. No bloated builders. Just careful code,
			considered design.
		</p>
		<div class="hero-meta reveal" style="--rd: 340ms">
			<a href="#pricing" class="btn">
				See pricing
				<svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M3 13 L13 3 M6 3 H13 V10"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</a>
			<a href="#work" class="btn ghost">Recent work</a>
			<div class="hero-coords">
				<b>49.2827° N</b>&nbsp; 123.1207° W
			</div>
		</div>
	</div>

	<div class="container">
		<div class="horizon reveal" style="--rd: 500ms">
			<div class="sun"></div>
			<svg class="mtn mtn-1" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
				<path
					d="M0 200 L0 130 L120 70 L240 110 L380 50 L520 90 L680 30 L820 80 L960 40 L1120 90 L1280 60 L1440 110 L1440 200 Z"
					fill="var(--accent2)"
				/>
			</svg>
			<svg class="mtn mtn-2" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
				<path
					d="M0 220 L0 140 L100 100 L220 130 L340 70 L460 120 L600 60 L740 100 L880 50 L1020 110 L1180 80 L1320 130 L1440 90 L1440 220 Z"
					fill="color-mix(in oklab, var(--accent) 75%, var(--accent2) 25%)"
				/>
			</svg>
			<svg class="mtn mtn-3" viewBox="0 0 1440 240" preserveAspectRatio="none" aria-hidden="true">
				<path
					d="M0 240 L0 170 L80 130 L200 160 L320 100 L460 150 L600 110 L760 160 L900 120 L1080 170 L1240 130 L1380 180 L1440 150 L1440 240 Z"
					fill="var(--accent)"
				/>
			</svg>
			<div class="reflection"></div>
		</div>

		<div class="marquee">
			<div class="marquee-track">
				{#each [0, 1] as _}
					<span>Hand-coded since 2019 <i></i></span>
					<span>Lighthouse 95+ on every build <i></i></span>
					<span>Local · Vancouver, BC <i></i></span>
					<span>No page builders. No bloat. <i></i></span>
					<span>Three proposals. Five edits. <i></i></span>
					<span>Fixed pricing. No surprises. <i></i></span>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		padding: 140px 36px 0;
		overflow: hidden;
	}

	.container {
		max-width: 1320px;
		margin: 0 auto;
	}

	.hero-eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--mono);
		font-size: 11.5px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-soft);
	}

	.hero-eyebrow .pin {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--warm);
		box-shadow: 0 0 0 4px color-mix(in oklab, var(--warm) 18%, transparent);
		flex-shrink: 0;
	}

	.hero-h1 {
		font-family: var(--serif);
		font-weight: 350;
		font-size: clamp(56px, 9.2vw, 156px);
		line-height: 0.95;
		letter-spacing: -0.035em;
		margin: 18px 0 0;
		color: var(--ink);
		max-width: 1200px;
	}

	.hero-h1 em {
		font-style: italic;
		color: var(--accent);
		font-weight: 350;
		font-variation-settings: 'SOFT' 100;
	}

	.swap {
		display: inline-block;
	}

	.hero-sub {
		margin-top: 28px;
		font-size: clamp(15px, 1.3vw, 18px);
		line-height: 1.5;
		max-width: 540px;
		color: var(--ink-soft);
	}

	.hero-meta {
		margin-top: 40px;
		display: flex;
		align-items: center;
		gap: 28px;
		flex-wrap: wrap;
		padding-bottom: 60px;
	}

	.hero-coords {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--ink-soft);
		letter-spacing: 0.06em;
	}

	.hero-coords b {
		color: var(--ink);
		font-weight: 500;
	}

	/* horizon scene */
	.horizon {
		position: relative;
		margin-top: 0;
		height: clamp(280px, 38vh, 460px);
		width: 100%;
		overflow: hidden;
		isolation: isolate;
	}

	.horizon::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			color-mix(in oklab, var(--accent2) 50%, var(--bg)) 0%,
			color-mix(in oklab, var(--accent2) 25%, var(--bg)) 35%,
			var(--bg) 100%
		);
		z-index: 0;
	}

	.sun {
		position: absolute;
		left: 50%;
		top: 32%;
		width: clamp(160px, 22vw, 280px);
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(
			circle at 50% 50%,
			color-mix(in oklab, var(--warm) 95%, white) 0%,
			var(--warm) 60%,
			color-mix(in oklab, var(--warm) 60%, transparent) 100%
		);
		transform: translate(-50%, -50%);
		filter: blur(0.3px);
		box-shadow: 0 0 120px color-mix(in oklab, var(--warm) 40%, transparent);
		z-index: 1;
		animation: sun-rise 18s ease-in-out infinite alternate;
	}

	@keyframes sun-rise {
		0% {
			transform: translate(-50%, -45%);
		}
		100% {
			transform: translate(-50%, -55%);
		}
	}

	.mtn {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		display: block;
	}

	.mtn-1 {
		z-index: 2;
		opacity: 0.55;
	}

	.mtn-2 {
		z-index: 3;
		opacity: 0.8;
	}

	.mtn-3 {
		z-index: 4;
		opacity: 1;
	}

	.reflection {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 28%;
		z-index: 5;
		background: linear-gradient(
			180deg,
			transparent 0%,
			color-mix(in oklab, var(--accent) 60%, var(--bg)) 60%,
			color-mix(in oklab, var(--accent) 80%, var(--ink)) 100%
		);
		mask-image: linear-gradient(180deg, transparent 0, black 30%, black 100%);
	}

	.reflection::after {
		content: '';
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			180deg,
			transparent 0 3px,
			color-mix(in oklab, var(--bg) 30%, transparent) 3px 4px
		);
		mix-blend-mode: overlay;
		animation: water 6s linear infinite;
	}

	@keyframes water {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 0 8px;
		}
	}

	/* marquee */
	.marquee {
		padding: 28px 0;
		border-top: 0.5px solid var(--line);
		border-bottom: 0.5px solid var(--line);
		overflow: hidden;
		font-family: var(--mono);
		font-size: 12.5px;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--ink-soft);
		mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
	}

	.marquee-track {
		display: flex;
		gap: 60px;
		animation: marquee 38s linear infinite;
		width: max-content;
	}

	.marquee-track span {
		display: inline-flex;
		align-items: center;
		gap: 18px;
		white-space: nowrap;
	}

	.marquee-track i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--warm);
		display: inline-block;
		font-style: normal;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
		.sun {
			animation: none;
		}
	}

	@media (max-width: 720px) {
		.hero {
			padding: 100px 22px 0;
		}
	}
</style>
