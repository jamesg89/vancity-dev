<script lang="ts">
  import CopyButton from '../../CopyButton.svelte';
  import { industries } from '$lib/templates';
  import type { ProspectFormErrors } from '$lib/prospects/validate';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  // A failed submit comes back with the raw values and per-field errors; a successful one has
  // neither, so the form renders empty beside the new link.
  const values = $derived(form?.values);
  const errors = $derived<ProspectFormErrors>(form?.errors ?? {});
  const created = $derived(form?.success ? form : undefined);
</script>

<header class="bar">
  <h1>New prospect</h1>
  <nav><a href="/admin/prospects">All prospects</a></nav>
</header>

{#if created}
  <section class="done" aria-label="Prospect created">
    <p>Created {created.companyName}. Share this link:</p>
    <p class="url"><code data-testid="share-url">{created.url}</code></p>
    <CopyButton text={created.url} />
  </section>
{/if}

<form method="POST" novalidate>
  {#if errors.form}
    <p class="error" role="alert">{errors.form}</p>
  {/if}

  <div class="field">
    <label for="companyName">Company name</label>
    <input
      id="companyName"
      name="companyName"
      type="text"
      autocomplete="off"
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

  <div class="field">
    <label for="city">City</label>
    <input
      id="city"
      name="city"
      type="text"
      autocomplete="off"
      value={values?.city ?? ''}
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
      value={values?.region ?? ''}
      aria-invalid={errors.region ? 'true' : undefined}
      aria-describedby={errors.region ? 'region-error' : undefined}
    />
    {#if errors.region}<p class="error" id="region-error">{errors.region}</p>{/if}
  </div>

  <div class="field">
    <label for="phone">Phone</label>
    <input
      id="phone"
      name="phone"
      type="tel"
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
      aria-invalid={errors.nearbyAreas ? 'true' : undefined}
      aria-describedby={errors.nearbyAreas ? 'nearbyAreas-error' : 'nearbyAreas-hint'}>{values?.nearbyAreas ?? ''}</textarea>
    {#if errors.nearbyAreas}
      <p class="error" id="nearbyAreas-error">{errors.nearbyAreas}</p>
    {:else}
      <p class="hint" id="nearbyAreas-hint">Optional. Separate towns with commas or new lines.</p>
    {/if}
  </div>

  <button class="btn" type="submit">Create prospect</button>
</form>

<style>
  .bar {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  h1 {
    font-family: var(--serif);
    margin: 0;
  }
  form {
    display: grid;
    gap: 1rem;
    max-width: 32rem;
  }
  .field {
    display: grid;
    gap: 0.3rem;
  }
  label {
    font-weight: 600;
    font-size: 0.9rem;
  }
  input,
  select,
  textarea {
    font: inherit;
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--paper);
    color: var(--ink);
  }
  input[aria-invalid='true'],
  textarea[aria-invalid='true'],
  select[aria-invalid='true'] {
    border-color: #9b2c2c;
  }
  .hint {
    margin: 0;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .error {
    margin: 0;
    font-size: 0.9rem;
    color: #9b2c2c;
  }
  .done {
    max-width: 32rem;
    margin-bottom: 2rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--accent);
    border-radius: 8px;
    background: var(--paper);
  }
  .url {
    margin: 0.25rem 0 0.75rem;
  }
  code {
    font-family: var(--mono);
    word-break: break-all;
  }
  button.btn {
    justify-self: start;
    border: none;
    cursor: pointer;
  }
</style>
