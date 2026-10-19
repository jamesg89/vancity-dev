<script lang="ts">
  import { resolve } from '$app/paths';
  import { industries } from '$lib/templates';
  import { areaWarnings, type ProspectFormErrors } from '$lib/prospects/validate';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  // A failed submit comes back with the raw values and per-field errors. Success redirects to
  // the list, so this page never renders one.
  const values = $derived(form?.values);
  const errors = $derived<ProspectFormErrors>(form?.errors ?? {});

  // Live copies of the two fields the warning compares. They shadow the inputs rather than
  // control them, so the form still posts exactly what was typed.
  // null means "untouched", so a returned form's values are used until the owner edits.
  let cityInput = $state<string | null>(null);
  let areasInput = $state<string | null>(null);
  const warnings = $derived(
    areaWarnings(cityInput ?? values?.city ?? '', areasInput ?? values?.nearbyAreas ?? '')
  );
</script>

<svelte:head>
  <title>New prospect · Admin</title>
</svelte:head>

<header class="page-head">
  <h1>New prospect</h1>
  <p class="lede">
    The site goes live at its own address as soon as you create it, ready to send.
  </p>
</header>

<form method="POST" novalidate>
  {#if errors.form}
    <p class="form-error" role="alert">{errors.form}</p>
  {/if}

  <div class="field">
    <label for="companyName">Company name</label>
    <input
      id="companyName"
      name="companyName"
      type="text"
      autocomplete="off"
      autocapitalize="words"
      spellcheck="false"
      value={values?.companyName ?? ''}
      aria-invalid={errors.companyName ? 'true' : undefined}
      aria-describedby={errors.companyName ? 'companyName-error' : undefined}
    />
    {#if errors.companyName}<p class="error" id="companyName-error">{errors.companyName}</p>{/if}
  </div>

  <div class="field">
    <label for="industry">Industry</label>
    <select
      id="industry"
      name="industry"
      aria-invalid={errors.industry ? 'true' : undefined}
      aria-describedby={errors.industry ? 'industry-error' : undefined}
    >
      {#each Object.entries(industries) as [key, { label }] (key)}
        <option value={key} selected={(values?.industry ?? 'plumbing') === key}>{label}</option>
      {/each}
    </select>
    {#if errors.industry}<p class="error" id="industry-error">{errors.industry}</p>{/if}
  </div>

  <div class="pair">
    <div class="field">
      <label for="city">City</label>
      <input
        id="city"
        name="city"
        type="text"
        autocomplete="off"
        autocapitalize="words"
        value={values?.city ?? ''}
        oninput={(e) => (cityInput = e.currentTarget.value)}
        aria-invalid={errors.city ? 'true' : undefined}
        aria-describedby={errors.city ? 'city-error' : undefined}
      />
      {#if errors.city}<p class="error" id="city-error">{errors.city}</p>{/if}
    </div>

    <div class="field">
      <label for="region">State or province</label>
      <input
        id="region"
        name="region"
        type="text"
        autocomplete="off"
        autocapitalize="characters"
        value={values?.region ?? ''}
        aria-invalid={errors.region ? 'true' : undefined}
        aria-describedby={errors.region ? 'region-error' : undefined}
      />
      {#if errors.region}<p class="error" id="region-error">{errors.region}</p>{/if}
    </div>
  </div>

  <div class="field">
    <label for="phone">Phone</label>
    <input
      id="phone"
      name="phone"
      type="tel"
      inputmode="tel"
      autocomplete="off"
      value={values?.phone ?? ''}
      aria-invalid={errors.phone ? 'true' : undefined}
      aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
    />
    {#if errors.phone}
      <p class="error" id="phone-error">{errors.phone}</p>
    {:else}
      <p class="hint" id="phone-hint">The call button on their site dials this number.</p>
    {/if}
  </div>

  <div class="field">
    <label for="nearbyAreas">Nearby areas</label>
    <textarea
      id="nearbyAreas"
      name="nearbyAreas"
      rows="3"
      autocapitalize="words"
      oninput={(e) => (areasInput = e.currentTarget.value)}
      aria-invalid={errors.nearbyAreas ? 'true' : undefined}
      aria-describedby={errors.nearbyAreas ? 'nearbyAreas-error' : 'nearbyAreas-hint'}>{values?.nearbyAreas ?? ''}</textarea>
    {#if errors.nearbyAreas}
      <p class="error" id="nearbyAreas-error">{errors.nearbyAreas}</p>
    {:else}
      <p class="hint" id="nearbyAreas-hint">Optional. Separate towns with commas or new lines.</p>
    {/if}
    {#each warnings as warning (warning)}
      <p class="warning" role="status">{warning}</p>
    {/each}
  </div>

  <div class="actions">
    <button class="btn" type="submit">Create prospect</button>
    <a class="cancel" href={resolve('/admin/prospects')}>Cancel</a>
  </div>
</form>

<style>
  .page-head {
    margin-bottom: 1.75rem;
  }
  h1 {
    font-family: var(--serif);
    font-weight: 400;
    font-size: clamp(2rem, 7vw, 2.75rem);
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0;
  }
  .lede {
    margin: 0.5rem 0 0;
    max-width: 46ch;
    font-size: 0.95rem;
    color: var(--ink-soft);
  }

  form {
    display: grid;
    gap: 1.25rem;
    max-width: 34rem;
  }
  .field {
    display: grid;
    gap: 0.35rem;
  }
  .pair {
    display: grid;
    gap: 1.25rem;
  }
  label {
    font-weight: 600;
    font-size: 0.9rem;
  }
  input,
  select,
  textarea {
    font-family: inherit;
    /* 16px exactly: anything smaller makes iOS Safari zoom the page on focus. */
    font-size: 1rem;
    min-height: 2.9rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--bg);
    color: var(--ink);
    transition: border-color 0.15s;
  }
  textarea {
    line-height: 1.5;
    resize: vertical;
  }
  input:hover,
  select:hover,
  textarea:hover {
    border-color: color-mix(in oklab, var(--ink) 30%, transparent);
  }
  input[aria-invalid='true'],
  textarea[aria-invalid='true'],
  select[aria-invalid='true'] {
    border-color: var(--danger);
  }
  .hint {
    margin: 0;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .error {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--danger);
  }
  .form-error {
    margin: 0;
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--danger);
    border-radius: 0 6px 6px 0;
    background: color-mix(in oklab, var(--danger) 7%, var(--bg));
    color: var(--danger);
    font-size: 0.9rem;
  }
  .warning {
    margin: 0;
    font-size: 0.85rem;
    color: var(--ink-soft);
    border-left: 3px solid var(--warm);
    padding-left: 0.6rem;
  }

  .actions {
    display: grid;
    gap: 0.75rem;
    justify-items: center;
    margin-top: 0.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--line);
  }
  .actions .btn {
    width: 100%;
    justify-content: center;
    /* Matches the New prospect button on the list, so the two read as one control. */
    padding: 0.85rem 1.5rem;
    border: none;
  }
  .cancel {
    font-size: 0.9rem;
    color: var(--ink-soft);
    padding: 0.5rem;
  }
  .cancel:hover {
    color: var(--ink);
  }

  @media (min-width: 48rem) {
    .pair {
      grid-template-columns: 1fr 10rem;
    }
    .actions {
      grid-auto-flow: column;
      justify-content: start;
      justify-items: start;
      align-items: center;
      gap: 1.25rem;
    }
    .actions .btn {
      width: auto;
    }
  }
</style>
