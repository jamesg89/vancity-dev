<script lang="ts">
	import { enhance } from '$app/forms';

	let { open = $bindable(false) }: { open: boolean } = $props();

	let dialog: HTMLDialogElement | undefined = $state();
	let timing = $state('This week');
	let submitted = $state(false);
	let submitting = $state(false);
	let errorMsg = $state('');

	const timings = ['This week', 'This weekend', 'Next week', 'Next month', 'No rush'];

	$effect(() => {
		if (!dialog) return;
		if (open) {
			if (!dialog.open) dialog.showModal();
		} else {
			if (dialog.open) dialog.close();
		}
	});

	function close() {
		open = false;
		submitted = false;
		errorMsg = '';
		submitting = false;
	}
</script>

<dialog
	bind:this={dialog}
	onclose={close}
	onclick={(e) => { if (e.target === dialog) close(); }}
	class="consult-dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
>
	<div class="consult-inner">
		{#if submitted}
			<div class="success">
				<div class="success-check">
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
						<path d="M4 11.5 L9 16.5 L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<h3 class="success-title">Request sent.</h3>
				<p class="success-sub">I'll be in touch within one business day.</p>
				<button class="btn" onclick={close}>Close</button>
			</div>
		{:else}
			<button class="close-btn" onclick={close} aria-label="Close modal">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>

			<div class="modal-head">
				<div class="modal-eyebrow">— Consult Request</div>
				<h3 class="modal-title" id="modal-title">Book a <em>Consult</em></h3>
			</div>

			<form
				method="POST"
				action="/?/bookConsult"
				use:enhance={() => {
					submitting = true;
					errorMsg = '';
					return async ({ result }) => {
						submitting = false;
						if (result.type === 'success') {
							submitted = true;
						} else {
							errorMsg = 'Something went wrong. Please email james@vancity.dev directly.';
						}
					};
				}}
			>
				<div class="field">
					<label for="consult-name">Name</label>
					<input id="consult-name" name="name" type="text" required placeholder="Your name" />
				</div>

				<div class="field">
					<label for="consult-email">Email</label>
					<input id="consult-email" name="email" type="email" required placeholder="you@example.com" />
				</div>

				<fieldset class="field field-set">
					<legend class="field-legend">Best time to contact you?</legend>
					<div class="timing-chips">
						{#each timings as t}
							<label class="chip" class:selected={timing === t}>
								<input type="radio" name="timing" value={t} bind:group={timing} />
								{t}
							</label>
						{/each}
					</div>
				</fieldset>

				<div class="field">
					<label for="consult-desc">Project <span class="optional">(optional)</span></label>
					<input id="consult-desc" name="description" type="text" placeholder="One line about your project" />
				</div>

				{#if errorMsg}
					<p class="error-msg">{errorMsg}</p>
				{/if}

				<div class="submit-area">
					<button type="submit" class="btn" disabled={submitting}>
						{submitting ? 'Sending…' : 'Book a Consult'}
						{#if !submitting}
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<path d="M3 13 L13 3 M6 3 H13 V10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</dialog>

<style>
	.consult-dialog {
		background: var(--bg);
		color: var(--ink);
		border: 0.5px solid var(--line);
		border-radius: 4px;
		padding: 0;
		width: min(520px, 94vw);
		max-height: 90dvh;
		overflow-y: auto;
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
	}

	.consult-dialog::backdrop {
		background: rgba(0, 0, 0, 0.48);
		backdrop-filter: blur(4px);
	}

	.consult-inner {
		padding: 48px 52px;
		position: relative;
	}

	@media (max-width: 600px) {
		.consult-inner {
			padding: 36px 24px;
		}
	}

	.close-btn {
		position: absolute;
		top: 18px;
		right: 18px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 0.5px solid var(--line);
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--ink-soft);
		transition: background 0.15s, color 0.15s;
	}

	.close-btn:hover {
		background: var(--paper);
		color: var(--ink);
	}

	.modal-eyebrow {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-soft);
		margin-bottom: 8px;
	}

	.modal-title {
		font-family: var(--serif);
		font-weight: 350;
		font-size: clamp(30px, 5vw, 44px);
		letter-spacing: -0.025em;
		line-height: 1;
		margin: 0 0 36px;
	}

	.modal-title em {
		font-style: italic;
		color: var(--accent);
	}

	.field {
		margin-bottom: 22px;
	}

	.field-set {
		border: none;
		padding: 0;
		min-width: 0;
	}

	.field label,
	.field-legend {
		display: block;
		font-family: var(--mono);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
		margin-bottom: 8px;
	}

	.optional {
		text-transform: none;
		letter-spacing: 0;
		font-size: 10px;
		opacity: 0.7;
	}

	.field input[type='text'],
	.field input[type='email'] {
		width: 100%;
		border: 0.5px solid var(--line);
		border-radius: 2px;
		padding: 12px 14px;
		font-family: var(--serif);
		font-size: 16px;
		background: var(--bg);
		color: var(--ink);
		outline: none;
		transition: border-color 0.15s;
		box-sizing: border-box;
	}

	.field input:focus {
		border-color: var(--ink);
	}

	.timing-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		padding: 8px 16px;
		border: 0.5px solid var(--line);
		border-radius: 999px;
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
		color: var(--ink);
		background: transparent;
		user-select: none;
	}

	.chip:hover {
		border-color: var(--ink);
	}

	.chip.selected {
		background: var(--ink);
		color: var(--bg);
		border-color: var(--ink);
	}

	.chip input[type='radio'] {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.error-msg {
		font-family: var(--mono);
		font-size: 12px;
		color: #c0392b;
		margin: 0 0 16px;
	}

	.submit-area {
		margin-top: 28px;
	}

	.submit-area .btn {
		width: 100%;
		justify-content: center;
	}

	.submit-area .btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	/* Success state */
	.success {
		text-align: center;
		padding: 16px 0 8px;
	}

	.success-check {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--bg);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 24px;
	}

	.success-title {
		font-family: var(--serif);
		font-weight: 350;
		font-size: 36px;
		letter-spacing: -0.02em;
		margin: 0 0 10px;
	}

	.success-sub {
		font-size: 15px;
		color: var(--ink-soft);
		margin: 0 0 32px;
	}
</style>
