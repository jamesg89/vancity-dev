<section id="pricing" class="pricing-section">
	<p class="section-label">— 02 / Pricing</p>
	<h2>Honest, fixed pricing.</h2>
	<p class="section-intro">
		Two ways to work together. Standard covers most marketing sites and small shops. Pro is for when
		you need custom logic, integrations, or a real backend.
	</p>

	<div class="plans">
		<div class="plan plan-a">
			<p class="plan-label">PLAN A · MOST PROJECTS</p>
			<h3>Standard Custom</h3>
			<div class="price">
				<span class="price-amount">$1,200</span>
				<span class="price-cadence">one-time</span>
			</div>
			<ul class="features">
				{#each planAFeatures as f}<li>✓ {f}</li>{/each}
			</ul>
			<div class="hosting">
				<p class="hosting-label">ONGOING HOSTING · PICK ONE</p>
				<div class="hosting-options">
					<div><strong>$25 / mo</strong><span>Simple hosting — manage yourself</span></div>
					<div><strong>$150 / mo</strong><span>Complete management — email, forms, support, security</span></div>
				</div>
			</div>
			<a href="#contact" class="plan-cta plan-cta-light">Start a project →</a>
		</div>

		<div class="plan plan-b">
			<div class="plan-b-header">
				<p class="plan-label">PLAN B · ADVANCED BUILDS</p>
				<span class="badge">MOST POPULAR</span>
			</div>
			<h3>Pro Custom</h3>
			<div class="price">
				<span class="price-amount">$3,000</span>
				<span class="price-modifier">++</span>
				<span class="price-cadence">from — scope dependent</span>
			</div>
			<ul class="features">
				{#each planBFeatures as f}<li>✓ {f}</li>{/each}
			</ul>
			<div class="hosting">
				<p class="hosting-label">ONGOING HOSTING · PICK ONE</p>
				<div class="hosting-options">
					<div><strong>$25 / mo</strong><span>Simple hosting — manage yourself</span></div>
					<div><strong>$150 / mo</strong><span>Complete management — email, forms, support, security</span></div>
				</div>
			</div>
			<a href="#contact" class="plan-cta plan-cta-dark">Book a free consult →</a>
		</div>
	</div>

	<p class="fine-print">// All prices in CAD. GST extra. 50% deposit, 50% on launch.</p>
	<a href="#contact" class="soft-cta">Not sure which? — tell me about your project →</a>
</section>

<script lang="ts">
	const planAFeatures = [
		'Fully custom, cutting-edge tech website',
		'Bespoke design process, three written proposals',
		'Five rounds of design edits, no surprises',
		'Hand-coded — no bloated page builders',
		'Performance budget: sub-1.5s LCP, 95+ Lighthouse',
		'Accessibility (WCAG AA) baked in',
		'Mobile-first responsive, every breakpoint',
		'On-page SEO + sitemap + structured data'
	];

	const planBFeatures = [
		'Everything in Standard Custom',
		'Custom API + database integrations',
		'Headless CMS or admin dashboard',
		'Booking, payments, member areas',
		'Third-party platform connections',
		'Free 30-min scoping consultation'
	];
</script>

<style>
	.pricing-section {
		padding: 6rem 2.5rem;
		background: var(--paper);
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
		margin-bottom: 1rem;
		max-width: 960px;
		margin-left: auto;
		margin-right: auto;
	}

	h2 {
		font-family: var(--serif);
		font-size: clamp(2.2rem, 4vw, 3.5rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 1.25rem;
		max-width: 960px;
		margin-left: auto;
		margin-right: auto;
	}

	.section-intro {
		font-size: 1rem;
		color: var(--ink-soft);
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 3rem;
		margin-left: auto;
		margin-right: auto;
	}

	.plans {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		max-width: 960px;
		margin: 0 auto 2rem;
	}

	.plan { border-radius: 12px; padding: 2.5rem; }
	.plan-a { background: var(--bg); border: 1px solid var(--line); }
	.plan-b { background: var(--accent); color: #fff; }

	.plan-label {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		opacity: 0.6;
		margin-bottom: 0.75rem;
	}

	.plan-b-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.plan-b-header .plan-label { margin-bottom: 0; }

	.badge {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		background: var(--warm);
		color: #fff;
		padding: 0.25rem 0.6rem;
		border-radius: 9999px;
	}

	h3 {
		font-family: var(--serif);
		font-size: 2rem;
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.plan-b h3 { font-style: italic; }

	.price {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		margin-bottom: 1.75rem;
	}

	.price-amount {
		font-family: var(--serif);
		font-size: 2.5rem;
		font-weight: 300;
		letter-spacing: -0.03em;
	}

	.price-modifier {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--warm);
	}

	.price-cadence {
		font-family: var(--mono);
		font-size: 0.68rem;
		opacity: 0.55;
	}

	.features {
		list-style: none;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.features li { font-size: 0.875rem; line-height: 1.4; opacity: 0.85; }
	.plan-a .features li { color: var(--ink-soft); }

	.hosting {
		margin-bottom: 2rem;
		border-top: 1px solid var(--line);
		padding-top: 1.25rem;
	}

	.plan-b .hosting { border-top-color: rgba(255,255,255,0.15); }

	.hosting-label {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		opacity: 0.5;
		margin-bottom: 0.75rem;
	}

	.hosting-options { display: flex; flex-direction: column; gap: 0.5rem; }

	.hosting-options div { display: flex; gap: 0.75rem; align-items: baseline; }
	.hosting-options strong { font-family: var(--mono); font-size: 0.75rem; white-space: nowrap; }
	.hosting-options span { font-size: 0.78rem; opacity: 0.6; }

	.plan-cta {
		display: inline-flex;
		align-items: center;
		font-family: var(--sans);
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		transition: background 0.15s;
	}

	.plan-cta-light { background: var(--ink); color: var(--bg); }
	.plan-cta-light:hover { background: var(--accent); }
	.plan-cta-dark { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.25); }
	.plan-cta-dark:hover { background: rgba(255,255,255,0.25); }

	.fine-print {
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--ink-soft);
		opacity: 0.5;
		text-align: center;
		max-width: 960px;
		margin: 0 auto 1rem;
	}

	.soft-cta {
		display: block;
		text-align: center;
		font-size: 0.875rem;
		color: var(--ink-soft);
		border-bottom: 1px solid var(--line);
		width: max-content;
		margin: 0 auto;
		padding-bottom: 1px;
	}

	.soft-cta:hover { color: var(--ink); }

	@media (max-width: 768px) {
		.plans { grid-template-columns: 1fr; }
		.pricing-section { padding: 4rem 1.25rem; }
	}
</style>
