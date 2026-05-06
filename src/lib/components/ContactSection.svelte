<section id="contact" class="contact">
	<div class="container">
		<h2 class="contact-h reveal">
			Let&rsquo;s build<br />
			something <em>good</em><span class="at">.</span>
		</h2>

		<div class="contact-grid">
			<div class="contact-col reveal">
				<h4>Start a project</h4>
				<a href="mailto:hello@vancitydev.ca">hello@vancitydev.ca</a>
				<a href="tel:+16045550199">+1 (604) 555-0199</a>
				<p class="note">
					Most replies within one business day. I&rsquo;ll usually suggest a 30-min video call to
					scope the work.
				</p>
			</div>
			<div class="contact-col reveal" style="--rd: 100ms">
				<h4>Studio</h4>
				<p>East Vancouver</p>
				<p>British Columbia</p>
				<p>49.2827° N, 123.1207° W</p>
			</div>
			<div class="contact-col reveal" style="--rd: 200ms">
				<h4>Elsewhere</h4>
				<a href="https://www.are.na" target="_blank" rel="noopener">Are.na</a>
				<a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
				<a href="https://read.cv" target="_blank" rel="noopener">Read.cv</a>
				<a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
			</div>
			<div class="contact-col reveal" style="--rd: 300ms">
				<h4>Now</h4>
				<p>Booking projects starting Q3 2026.</p>
				<p>One Pro slot remaining this quarter.</p>
			</div>
		</div>

		<div class="contact-foot">
			<span>© 2026 Vancity Dev · J. Goodwin</span>
			<span
				>Built by hand on the unceded territories of the xʷməθkʷəy̓əm, Sḵwx̱wú7mesh, and
				səlilwətaɬ Nations.</span
			>
			<span>v.04 / May 2026</span>
		</div>
	</div>
</section>

<style>
	.contact {
		background: var(--ink);
		color: var(--bg);
		padding: 120px 36px 36px;
	}

	@media (max-width: 720px) {
		.contact {
			padding: 90px 22px 30px;
		}
	}

	.contact-h {
		font-family: var(--serif);
		font-weight: 300;
		font-size: clamp(48px, 8vw, 132px);
		letter-spacing: -0.035em;
		line-height: 0.95;
		margin: 0;
	}

	.contact-h em {
		font-style: italic;
		color: var(--warm);
	}

	.contact-h .at {
		display: inline-block;
		transition: transform 0.4s cubic-bezier(0.3, 0.7, 0.4, 1);
	}

	.contact-h:hover .at {
		transform: rotate(20deg);
	}

	.contact-grid {
		margin-top: 80px;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 40px;
		padding-bottom: 60px;
		border-bottom: 0.5px solid rgba(255, 255, 255, 0.14);
	}

	@media (max-width: 820px) {
		.contact-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.contact-col h4 {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.5);
		margin: 0 0 14px;
		font-weight: 500;
	}

	.contact-col a,
	.contact-col p {
		display: block;
		margin: 0 0 6px;
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.85);
	}

	.contact-col a:hover {
		color: var(--warm);
	}

	.note {
		margin-top: 14px !important;
		color: rgba(255, 255, 255, 0.55) !important;
		font-size: 13.5px !important;
	}

	.contact-foot {
		margin-top: 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
		font-family: var(--mono);
		font-size: 11px;
		color: rgba(255, 255, 255, 0.45);
		letter-spacing: 0.06em;
	}
</style>
