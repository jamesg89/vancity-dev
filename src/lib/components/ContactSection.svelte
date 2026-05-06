<section id="contact" class="contact-section">
	<div class="contact-inner">
		<div class="contact-main">
			<p class="section-label">START A PROJECT</p>
			<h2>Let's build<br />something good.</h2>

			<div class="contact-details">
				<a href="mailto:hello@vancitydev.ca" class="contact-link" aria-label="Send us an email">hello@vancitydev.ca</a>
				<a href="tel:+16045550199" class="contact-link">+1 (604) 555-0199</a>
			</div>

			<p class="contact-note">
				Most replies within one business day. I'll usually suggest a 30-min video call to scope the
				work.
			</p>
		</div>

		<div class="contact-meta">
			<div class="meta-block">
				<p class="meta-label">STUDIO</p>
				<p>East Vancouver</p>
				<p>British Columbia</p>
				<p class="geo">49.2827° N, 123.1207° W</p>
			</div>

			<div class="meta-block">
				<p class="meta-label">ELSEWHERE</p>
				<ul class="social-links">
					<li><a href="https://www.are.na" target="_blank" rel="noopener">Are.na</a></li>
					<li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
					<li><a href="https://read.cv" target="_blank" rel="noopener">Read.cv</a></li>
					<li><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
				</ul>
			</div>

			<div class="meta-block now-block">
				<p class="meta-label">NOW</p>
				<p>Booking projects starting Q3 2026.</p>
				<p>One Pro slot remaining this quarter.</p>
			</div>
		</div>
	</div>
</section>

<style>
	.contact-section {
		padding: 6rem 2.5rem;
		background: var(--ink);
		color: var(--bg);
	}

	.contact-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 5rem;
		max-width: 960px;
		margin: 0 auto;
		align-items: start;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		opacity: 0.45;
		margin-bottom: 1rem;
	}

	h2 {
		font-family: var(--serif);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		line-height: 1.1;
		margin-bottom: 2rem;
	}

	.contact-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.contact-link {
		font-family: var(--sans);
		font-size: 1.05rem;
		color: var(--bg);
		border-bottom: 1px solid rgba(244,241,234,0.2);
		width: max-content;
		padding-bottom: 2px;
		transition: border-color 0.15s;
	}

	.contact-link:hover { border-color: var(--warm); color: var(--warm); }

	.contact-note { font-size: 0.875rem; opacity: 0.5; line-height: 1.6; max-width: 360px; }

	.contact-meta { display: flex; flex-direction: column; gap: 2.5rem; padding-top: 0.5rem; }

	.meta-label {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		opacity: 0.4;
		margin-bottom: 0.6rem;
	}

	.meta-block p { font-size: 0.9rem; opacity: 0.7; line-height: 1.6; }

	.geo {
		font-family: var(--mono) !important;
		font-size: 0.65rem !important;
		opacity: 0.35 !important;
		margin-top: 0.25rem;
	}

	.social-links { list-style: none; display: flex; flex-direction: column; gap: 0.35rem; }
	.social-links a { font-size: 0.9rem; opacity: 0.7; transition: opacity 0.15s; }
	.social-links a:hover { opacity: 1; }
	.now-block p { opacity: 0.7; }

	@media (max-width: 768px) {
		.contact-inner { grid-template-columns: 1fr; gap: 3rem; }
		.contact-section { padding: 4rem 1.25rem; }
	}
</style>
