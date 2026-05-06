<section id="work" class="work-section">
	<p class="section-label">— 01 / Work</p>
	<h2>Selected projects.</h2>
	<p class="section-intro">
		A small slice of recent work — independent shops, local makers, and a few ambitious teams. Every
		site below was hand-built, start to finish.
	</p>

	<ol class="project-list">
		{#each projects as project, i}
			<li class="project-row">
				<span class="project-num">0{i + 1}</span>
				<span class="project-name">{project.name}</span>
				<span class="project-tags">{project.tags}</span>
				<span class="project-year">{project.year}</span>
			</li>
		{/each}
	</ol>
</section>

<script lang="ts">
	const projects = [
		{ name: 'Coastline Coffee Roasters', tags: 'E-COMMERCE · HEADLESS', year: '2025' },
		{ name: 'Mount Seymour Trail Co.', tags: 'BRANDING · MARKETING SITE', year: '2025' },
		{ name: 'Granville Island Studio', tags: 'PORTFOLIO · CMS', year: '2024' },
		{ name: 'False Creek Architecture', tags: 'CUSTOM BUILD · API', year: '2024' },
		{ name: 'Kitsilano Wellness Co-op', tags: 'BOOKING · STRIPE', year: '2024' },
		{ name: 'Howe Sound Outfitters', tags: 'E-COMMERCE · CUSTOM CMS', year: '2023' }
	];
</script>

<style>
	.work-section {
		padding: 6rem 2.5rem;
		max-width: 960px;
		margin: 0 auto;
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
		margin-bottom: 1.25rem;
	}

	.section-intro {
		font-size: 1rem;
		color: var(--ink-soft);
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 3rem;
	}

	.project-list {
		list-style: none;
		border-top: 1px solid var(--line);
	}

	.project-row {
		display: grid;
		grid-template-columns: 2rem 1fr auto auto;
		align-items: baseline;
		gap: 1.5rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--line);
		transition: background 0.15s;
	}

	.project-row:hover { background: var(--paper); }

	.project-num {
		font-family: var(--mono);
		font-size: 0.68rem;
		color: var(--ink-soft);
	}

	.project-name {
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 400;
		letter-spacing: -0.01em;
	}

	.project-tags {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
	}

	.project-year {
		font-family: var(--mono);
		font-size: 0.68rem;
		color: var(--ink-soft);
		opacity: 0.6;
	}

	@media (max-width: 640px) {
		.work-section { padding: 4rem 1.25rem; }
		.project-row {
			grid-template-columns: 2rem 1fr;
			grid-template-rows: auto auto;
			gap: 0.25rem 1rem;
		}
		.project-tags, .project-year { grid-column: 2; }
	}
</style>
