<script lang="ts">
	const stdFeatures = [
		'Fully custom, cutting-edge tech website',
		'Bespoke design process, three written proposals',
		'Five rounds of design edits, no surprises',
		'Hand-coded — no bloated page builders',
		'Performance budget: sub-1.5s LCP, 95+ Lighthouse',
		'Accessibility (WCAG AA) baked in',
		'Mobile-first responsive, every breakpoint',
		'On-page SEO + sitemap + structured data'
	];

	const proExtras = [
		'Everything in Standard Custom',
		'Custom API + database integrations',
		'Headless CMS or admin dashboard',
		'Booking, payments, member areas',
		'Third-party platform connections',
		'Free 30-min scoping consultation'
	];
</script>

<section id="pricing" class="pricing">
	<div class="container">
		<div class="sec-head reveal">
			<div class="sec-num">— 02 / Pricing</div>
			<div>
				<h2 class="sec-title">Honest, <em>fixed</em> pricing.</h2>
				<p class="sec-kicker">
					Two ways to work together. Standard covers most marketing sites and small shops. Pro is for
					when you need custom logic, integrations, or a real backend.
				</p>
			</div>
		</div>

		<div class="pricing-grid">
			<!-- Plan A -->
			<div class="price-card">
				<div class="price-eyebrow">Plan A · most projects</div>
				<h3 class="price-name">Standard <em>Custom</em></h3>
				<div class="price-amt">
					<span class="num">$1,200</span>
					<span class="unit">one-time</span>
				</div>
				<hr class="price-sep" />
				<div class="price-feat">
					{#each stdFeatures as f}
						<div class="row">
							<svg class="check" viewBox="0 0 18 18" fill="none" aria-hidden="true">
								<path
									d="M3.5 9.5 L7.5 13.5 L14.5 5"
									stroke="currentColor"
									stroke-width="1.6"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span>{f}</span>
						</div>
					{/each}
				</div>
				<div class="price-hosting">
					<div class="h">Ongoing hosting · pick one</div>
					<div class="opts">
						<div class="opt">
							<b>$25 / mo</b>
							<span class="lbl">Simple hosting — manage yourself</span>
						</div>
						<div class="opt">
							<b>$150 / mo</b>
							<span class="lbl">Complete management — email, forms, support, security</span>
						</div>
					</div>
				</div>
				<div class="price-cta">
					<a href="#contact" class="btn">
						Start a project
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path
								d="M3 13 L13 3 M6 3 H13 V10"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</a>
				</div>
			</div>

			<!-- Plan B (featured) -->
			<div class="price-card featured">
				<div class="price-tag">Most popular</div>
				<div class="price-eyebrow">Plan B · advanced builds</div>
				<h3 class="price-name">Pro <em>Custom</em></h3>
				<div class="price-amt">
					<span class="num">$3,000</span>
					<span class="plus">++</span>
					<span class="unit">from — scope dependent</span>
				</div>
				<hr class="price-sep" />
				<div class="price-feat">
					{#each proExtras as f}
						<div class="row">
							<svg class="check" viewBox="0 0 18 18" fill="none" aria-hidden="true">
								<path
									d="M3.5 9.5 L7.5 13.5 L14.5 5"
									stroke="currentColor"
									stroke-width="1.6"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span>{f}</span>
						</div>
					{/each}
				</div>
				<div class="price-hosting">
					<div class="h">Ongoing hosting · pick one</div>
					<div class="opts">
						<div class="opt">
							<b>$25 / mo</b>
							<span class="lbl">Simple hosting — manage yourself</span>
						</div>
						<div class="opt">
							<b>$150 / mo</b>
							<span class="lbl">Complete management — email, forms, support, security</span>
						</div>
					</div>
				</div>
				<div class="price-cta">
					<a href="#contact" class="btn">
						Book a free consult
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path
								d="M3 13 L13 3 M6 3 H13 V10"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>

		<div class="price-foot reveal">
			<span>// All prices in CAD. GST extra. 50% deposit, 50% on launch.</span>
			<span
				>Not sure which? — <a href="#contact" class="soft-link">tell me about your project</a></span
			>
		</div>
	</div>
</section>

<style>
	.pricing {
		background: var(--paper);
		padding-bottom: 140px;
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-top: 20px;
	}

	@media (max-width: 900px) {
		.pricing-grid {
			grid-template-columns: 1fr;
		}
	}

	.price-card {
		background: var(--bg);
		border-radius: 4px;
		padding: 44px 40px 36px;
		position: relative;
		box-shadow: 0 1px 0 var(--line);
		display: flex;
		flex-direction: column;
		min-height: 620px;
	}

	.price-card.featured {
		background: var(--ink);
		color: var(--bg);
	}

	.price-tag {
		position: absolute;
		top: 24px;
		right: 24px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 5px 10px;
		border-radius: 999px;
		background: var(--warm);
		color: var(--bg);
	}

	.price-eyebrow {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-soft);
	}

	.featured .price-eyebrow {
		color: rgba(255, 255, 255, 0.55);
	}

	.price-name {
		font-family: var(--serif);
		font-weight: 350;
		font-size: clamp(36px, 4.4vw, 56px);
		letter-spacing: -0.025em;
		line-height: 1;
		margin: 12px 0 0;
	}

	.price-name em {
		font-style: italic;
		color: var(--accent);
	}

	.featured .price-name em {
		color: var(--warm);
	}

	.price-amt {
		margin-top: 32px;
		display: flex;
		align-items: baseline;
		gap: 10px;
	}

	.price-amt .num {
		font-family: var(--serif);
		font-weight: 350;
		font-size: 72px;
		letter-spacing: -0.03em;
		line-height: 1;
	}

	.price-amt .plus {
		font-family: var(--serif);
		font-size: 38px;
		line-height: 1;
		color: var(--warm);
	}

	.price-amt .unit {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--ink-soft);
		margin-left: 4px;
	}

	.featured .price-amt .unit {
		color: rgba(255, 255, 255, 0.55);
	}

	.price-sep {
		margin: 28px 0;
		border: 0;
		border-top: 0.5px solid var(--line);
	}

	.featured .price-sep {
		border-color: rgba(255, 255, 255, 0.18);
	}

	.price-feat {
		display: flex;
		flex-direction: column;
		gap: 14px;
		flex: 1;
	}

	.price-feat .row {
		display: grid;
		grid-template-columns: 18px 1fr;
		gap: 12px;
		align-items: flex-start;
		font-size: 14.5px;
		line-height: 1.45;
	}

	.check {
		width: 18px;
		height: 18px;
		flex: 0 0 18px;
		color: var(--accent);
		margin-top: 2px;
	}

	.featured .check {
		color: var(--warm);
	}

	.price-hosting {
		margin-top: 20px;
		padding: 18px;
		border: 0.5px solid var(--line);
		border-radius: 4px;
		font-size: 13px;
		line-height: 1.5;
	}

	.featured .price-hosting {
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.12);
	}

	.price-hosting .h {
		font-family: var(--mono);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
		margin-bottom: 10px;
	}

	.featured .price-hosting .h {
		color: rgba(255, 255, 255, 0.55);
	}

	.opts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.opt {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.opt b {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 18px;
	}

	.opt .lbl {
		font-size: 12px;
		color: var(--ink-soft);
	}

	.featured .opt .lbl {
		color: rgba(255, 255, 255, 0.55);
	}

	.price-cta {
		margin-top: 28px;
	}

	.featured .btn {
		background: var(--bg);
		color: var(--ink);
	}

	.featured .btn:hover {
		background: var(--warm);
		color: var(--bg);
	}

	.price-foot {
		margin-top: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 30px;
		flex-wrap: wrap;
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.06em;
		color: var(--ink-soft);
	}

	.soft-link {
		color: var(--ink);
		text-decoration: underline;
	}
</style>
