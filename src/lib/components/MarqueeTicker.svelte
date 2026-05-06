<div class="ticker-wrap">
	<div class="ticker-track">
		<span class="ticker-content">
			HAND-CODED SINCE 2019 &nbsp;·&nbsp; LIGHTHOUSE 95+ ON EVERY BUILD &nbsp;·&nbsp; LOCAL ·
			VANCOUVER, BC &nbsp;·&nbsp; NO PAGE BUILDERS. NO BLOAT. &nbsp;·&nbsp; THREE PROPOSALS. FIVE
			EDITS. &nbsp;·&nbsp; FIXED PRICING. NO SURPRISES. &nbsp;&nbsp;&nbsp;
		</span>
	</div>
</div>

<style>
	.ticker-wrap {
		width: 100%;
		overflow: hidden;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		padding: 0.6rem 0;
		background: var(--paper);
	}

	.ticker-track {
		display: flex;
		width: max-content;
		animation: scroll 40s linear infinite;
	}

	.ticker-content {
		font-family: var(--mono);
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		color: var(--ink-soft);
		white-space: nowrap;
		padding-right: 4rem;
	}

	@keyframes scroll {
		from { transform: translateX(0); }
		to { transform: translateX(-100%); }
	}

	@media (prefers-reduced-motion: reduce) {
		.ticker-track { animation: none; }
	}
</style>
