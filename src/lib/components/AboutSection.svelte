<section id="about" class="about-section">
	<div class="about-inner">
		<div class="about-text">
			<p class="section-label">— 03 / About</p>
			<h2>A studio of one.</h2>

			<p>
				I'm James Goodwin — a Vancouver-based web developer who builds custom websites for small
				businesses, makers, and independent teams across BC.
			</p>
			<p>
				I work directly with you. No agency layers, no offshore handoffs, no project managers
				translating between us. The person designing your site is the person writing the code, fixing
				the bugs, and picking up the phone three years from now.
			</p>
			<p>
				I've been hand-coding the web since 2014. I think a good website should feel like the place
				it represents — quiet, specific, and built to last longer than a trend.
			</p>

			<dl class="stats">
				{#each stats as stat}
					<div class="stat">
						<dt>{stat.label}</dt>
						<dd>{stat.value}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="portrait-placeholder" aria-hidden="true">
			<span>[ portrait · 4:5 ]</span>
		</div>
	</div>
</section>

<script lang="ts">
	const stats = [
		{ label: 'BASED', value: 'East Vancouver, BC' },
		{ label: 'WORKING SINCE', value: "2014 · independent '19" },
		{ label: 'STACK', value: 'Astro · Next · Stripe · Sanity' },
		{ label: 'CAPACITY', value: '2–3 projects per quarter' }
	];
</script>

<style>
	.about-section {
		padding: 6rem 2.5rem;
		max-width: 960px;
		margin: 0 auto;
	}

	.about-inner {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 5rem;
		align-items: start;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
		margin-bottom: 1rem;
	}

	h2 {
		font-family: var(--serif);
		font-size: clamp(2.2rem, 4vw, 3.5rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 2rem;
	}

	.about-text p {
		font-size: 1rem;
		color: var(--ink-soft);
		line-height: 1.75;
		margin-bottom: 1.25rem;
		max-width: 520px;
	}

	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-top: 2.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--line);
	}

	.stat dt {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		color: var(--ink-soft);
		opacity: 0.6;
		margin-bottom: 0.35rem;
	}

	.stat dd { font-family: var(--serif); font-size: 1rem; font-weight: 400; }

	.portrait-placeholder {
		aspect-ratio: 4/5;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.portrait-placeholder span {
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--ink-soft);
		opacity: 0.4;
	}

	@media (max-width: 768px) {
		.about-inner { grid-template-columns: 1fr; gap: 2.5rem; }
		.portrait-placeholder { max-width: 280px; order: -1; }
		.about-section { padding: 4rem 1.25rem; }
	}
</style>
