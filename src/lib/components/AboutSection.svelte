<script>
	import headshot from '$lib/assets/James Goodwin 2023-03-22 Headshot.jpg';
</script>

<section id="about" class="about">
	<div class="container">
		<div class="sec-head reveal">
			<div class="sec-num">— 03 / About</div>
			<div>
				<h2 class="sec-title">A studio of <em>one</em>.</h2>
			</div>
		</div>

		<div class="about-grid">
			<div class="about-copy reveal">
				<p>
					I&rsquo;m <em>James Goodwin</em> — a Vancouver-based web developer who builds custom
					websites for small businesses, makers, and independent teams across BC.
				</p>
				<p>
					I work directly with you. No agency layers, no offshore handoffs, no project managers
					translating between us. The person designing your site is the person writing the code,
					fixing the bugs, and picking up the phone three years from now.
				</p>
				<p>
					I&rsquo;ve been hand-coding the web since 2014. I think a good website should feel like
					the place it represents — quiet, specific, and built to last longer than a trend.
				</p>

				<div class="about-meta">
					<div>
						<div class="k">Based</div>
						<div class="v">East Vancouver, BC</div>
					</div>
					<div>
						<div class="k">Working since</div>
						<div class="v">2014 · independent &rsquo;19</div>
					</div>
					<div>
						<div class="k">Stack</div>
						<div class="v">Astro · Next · Stripe · Sanity</div>
					</div>
					<div>
						<div class="k">Capacity</div>
						<div class="v">2&ndash;3 projects per quarter</div>
					</div>
				</div>
			</div>

			<div class="about-portrait reveal" style="--rd: 200ms">
				<img src={headshot} alt="James Goodwin" class="portrait-img" />
			</div>
		</div>
	</div>
</section>

<style>
	.about {
		background: var(--bg);
		padding-bottom: 140px;
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 60px;
		align-items: start;
	}

	@media (max-width: 900px) {
		.about-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}
	}

	.about-copy p {
		font-family: var(--serif);
		font-weight: 350;
		font-size: clamp(20px, 2vw, 26px);
		line-height: 1.45;
		letter-spacing: -0.005em;
		color: var(--ink);
		margin: 0 0 22px;
	}

	.about-copy p em {
		font-style: italic;
		color: var(--accent);
	}

	.about-meta {
		margin-top: 30px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 22px;
		font-size: 13.5px;
	}

	.k {
		font-family: var(--mono);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
		margin-bottom: 4px;
	}

	.v {
		font-family: var(--serif);
		font-size: 18px;
	}

	.about-portrait {
		position: sticky;
		top: 110px;
		aspect-ratio: 4/5;
		width: 100%;
		border-radius: 4px;
		overflow: hidden;
		background: var(--paper);
	}

	.portrait-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}
</style>
