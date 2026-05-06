<section class="hero">
	<p class="eyebrow">VANCOUVER, BC · EST. 2019</p>

	<h1>
		<span class="upright">Bespoke websites,</span>
		<span class="italic">handcrafted &amp; yours.</span>
	</h1>

	<p class="body-copy">
		I'm James — a one-person studio building custom, fast, honestly-priced websites for businesses
		across the Lower Mainland. No templates. No bloated builders. Just careful code, considered
		design.
	</p>

	<div class="ctas">
		<a href="#pricing" class="cta-primary" aria-label="See pricing options">See pricing →</a>
		<a href="#work" class="cta-secondary" aria-label="See recent work">Recent work</a>
	</div>

	<p class="geo">49.2827° N &nbsp;&nbsp; 123.1207° W</p>
</section>

<style>
	.hero {
		padding: 10rem 2.5rem 4rem;
		max-width: 900px;
	}

	.eyebrow {
		font-family: var(--mono);
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
		margin-bottom: 1.5rem;
		text-transform: uppercase;
	}

	h1 {
		font-family: var(--serif);
		font-size: clamp(3.5rem, 8vw, 6.5rem);
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--ink);
		margin-bottom: 1.75rem;
		font-weight: 400;
	}

	.upright { display: block; font-style: normal; }
	.italic { display: block; font-style: italic; }

	.body-copy {
		font-size: 1.05rem;
		color: var(--ink-soft);
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 2.5rem;
	}

	.ctas {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		margin-bottom: 3rem;
	}

	.cta-primary {
		background: var(--warm);
		color: #fff;
		font-family: var(--sans);
		font-size: 0.9rem;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		transition: background 0.15s;
	}

	.cta-primary:hover {
		background: color-mix(in oklab, var(--warm) 85%, black);
	}

	.cta-secondary {
		font-family: var(--sans);
		font-size: 0.9rem;
		color: var(--ink);
		border-bottom: 1px solid var(--line);
		padding-bottom: 1px;
		transition: color 0.15s;
	}

	.cta-secondary:hover { color: var(--accent); }

	.geo {
		font-family: var(--mono);
		font-size: 0.7rem;
		color: var(--ink-soft);
		letter-spacing: 0.05em;
		opacity: 0.6;
	}

	@media (max-width: 640px) {
		.hero { padding: 7rem 1.25rem 3rem; }
	}
</style>
