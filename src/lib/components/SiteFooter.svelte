<footer>
	<div class="footer-inner">
		<p class="copyright">© 2026 Vancity Dev · J. Goodwin</p>
		<p class="acknowledgement">
			Built by hand on the unceded territories of the xʷməθkʷəy̓əm, Sḵwx̱wú7mesh, and səlilwətaɬ
			Nations.
		</p>
		<p class="version">v.04 / May 2026</p>
	</div>
</footer>

<style>
	footer {
		background: var(--accent);
		padding: 2rem 2.5rem;
	}

	.footer-inner {
		max-width: 960px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.copyright {
		font-family: var(--mono);
		font-size: 0.68rem;
		color: rgba(244,241,234,0.6);
		letter-spacing: 0.04em;
	}

	.acknowledgement {
		font-size: 0.7rem;
		color: rgba(244,241,234,0.4);
		max-width: 480px;
		line-height: 1.5;
		text-align: center;
	}

	.version {
		font-family: var(--mono);
		font-size: 0.62rem;
		color: rgba(244,241,234,0.3);
		letter-spacing: 0.06em;
	}

	@media (max-width: 640px) {
		.footer-inner { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
		.acknowledgement { text-align: left; }
		footer { padding: 2rem 1.25rem; }
	}
</style>
