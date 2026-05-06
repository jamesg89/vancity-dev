<script lang="ts">
	const projects = [
		{ name: 'Coastline Coffee Roasters', year: '2025', tags: ['E-commerce', 'Headless'], hue: 18 },
		{ name: 'Mount Seymour Trail Co.', year: '2025', tags: ['Branding', 'Marketing site'], hue: 150 },
		{ name: 'Granville Island Studio', year: '2024', tags: ['Portfolio', 'CMS'], hue: 200 },
		{ name: 'False Creek Architecture', year: '2024', tags: ['Custom build', 'API'], hue: 35 },
		{ name: 'Kitsilano Wellness Co-op', year: '2024', tags: ['Booking', 'Stripe'], hue: 95 },
		{ name: 'Howe Sound Outfitters', year: '2023', tags: ['E-commerce', 'Custom CMS'], hue: 220 }
	];

	type Project = (typeof projects)[0];

	let hovered: Project | null = $state(null);
	let previewX = $state(0);
	let previewY = $state(0);

	function onMouseMove(e: MouseEvent) {
		previewX = e.clientX;
		previewY = e.clientY;
	}
</script>

<section id="work" class="work">
	<div class="container">
		<div class="sec-head reveal">
			<div class="sec-num">— 01 / Work</div>
			<div>
				<h2 class="sec-title">Selected <em>projects</em>.</h2>
				<p class="sec-kicker">
					A small slice of recent work — independent shops, local makers, and a few ambitious teams.
					Every site below was hand-built, start to finish.
				</p>
			</div>
		</div>

		<div class="work-list">
			{#each projects as project, idx}
				<a
					href={`#work-${idx}`}
					class="work-item reveal"
					onmouseenter={() => (hovered = project)}
					onmouseleave={() => (hovered = null)}
					onmousemove={onMouseMove}
				>
					<div class="num">{String(idx + 1).padStart(2, '0')}</div>
					<div class="name">{project.name}</div>
					<div class="tags">{project.tags.join(' · ')}</div>
					<div class="year">{project.year}</div>
					<svg class="arrow" width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path
							d="M3 13 L13 3 M6 3 H13 V10"
							stroke="currentColor"
							stroke-width="1.4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			{/each}
		</div>
	</div>
</section>

{#if hovered}
	<div
		class="work-preview"
		class:visible={!!hovered}
		style="left: {previewX}px; top: {previewY}px;"
	>
		<div
			class="frame"
			style="background: linear-gradient(135deg, oklch(60% .12 {hovered.hue}) 0%, oklch(35% .14 {hovered.hue + 30}) 100%);"
		>
			<div class="frame-border"></div>
			<div class="frame-title">{hovered.name}</div>
			<div class="frame-meta">{hovered.tags.join(' · ')} · {hovered.year}</div>
			<div class="frame-icon">
				<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M3 13 L13 3 M6 3 H13 V10"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
	</div>
{/if}

<style>
	.work {
		background: var(--bg);
		padding-bottom: 140px;
	}

	.work-list {
		border-top: 0.5px solid var(--line);
	}

	.work-item {
		display: grid;
		grid-template-columns: 60px 1fr 200px 140px 24px;
		gap: 30px;
		align-items: center;
		padding: 28px 0;
		border-bottom: 0.5px solid var(--line);
		position: relative;
		transition: padding 0.25s;
	}

	.work-item:hover {
		padding-left: 22px;
		padding-right: 22px;
	}

	.num {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--ink-soft);
	}

	.name {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(28px, 4vw, 46px);
		letter-spacing: -0.02em;
		line-height: 1.05;
	}

	.tags {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ink-soft);
	}

	.year {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--ink-soft);
		text-align: right;
	}

	.arrow {
		transition: transform 0.25s;
		color: var(--ink-soft);
	}

	.work-item:hover .arrow {
		transform: translate(4px, -4px);
		color: var(--ink);
	}

	/* cursor-following preview */
	.work-preview {
		position: fixed;
		width: 360px;
		height: 240px;
		pointer-events: none;
		z-index: 50;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.92);
		transition:
			opacity 0.2s,
			transform 0.25s cubic-bezier(0.3, 0.7, 0.4, 1);
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
	}

	.work-preview.visible {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.frame {
		position: absolute;
		inset: 0;
	}

	.frame-border {
		position: absolute;
		inset: 16px;
		border: 0.5px solid rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.frame-title {
		position: absolute;
		left: 28px;
		top: 24px;
		right: 28px;
		font-family: var(--serif);
		font-weight: 400;
		font-size: 28px;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.frame-meta {
		position: absolute;
		left: 28px;
		bottom: 24px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.7);
		text-transform: uppercase;
	}

	.frame-icon {
		position: absolute;
		right: 28px;
		bottom: 24px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.18);
		display: grid;
		place-items: center;
		color: #fff;
	}

	@media (max-width: 900px) {
		.work-item {
			grid-template-columns: 40px 1fr 24px;
		}
		.tags,
		.year {
			display: none;
		}
		.work-preview {
			display: none;
		}
	}
</style>
