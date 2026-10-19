<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import CopyButton from '../CopyButton.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const created = $derived(data.prospects.find((p) => p.slug === data.created));

  const live = $derived(data.prospects.filter((p) => !p.archived).length);
  const archived = $derived(data.prospects.length - live);
  const summary = $derived(
    archived === 0
      ? `${live} ${live === 1 ? 'site' : 'sites'}`
      : `${live} live, ${archived} archived`
  );
</script>

<svelte:head>
  <title>Prospects · Admin</title>
</svelte:head>

<header class="page-head">
  <div class="titles">
    <h1>Prospects</h1>
    {#if data.prospects.length > 0}
      <p class="summary">{summary}</p>
    {/if}
  </div>
  <!-- With no prospects the empty state below carries this action, so it is not offered twice. -->
  {#if data.prospects.length > 0}
    <a class="btn" href={resolve('/admin/prospects/new')}>New prospect</a>
  {/if}
</header>

{#if created}
  <section class="created" aria-label="Prospect created">
    <h2>{created.companyName} is live</h2>
    <p>Send this link to the owner.</p>
    <code class="url" data-testid="created-url">{created.url}</code>
    <CopyButton text={created.url} tone="solid" />
  </section>
{/if}

{#if form && 'message' in form && form.message}
  <p class="error" role="alert">{form.message}</p>
{/if}

{#if data.prospects.length === 0}
  <div class="empty">
    <p>No prospects yet.</p>
    <p class="empty-note">
      Build a demo site for a business and the link to share it shows up here.
    </p>
    <a class="btn" href={resolve('/admin/prospects/new')}>New prospect</a>
  </div>
{:else}
  <!--
    Each row is a card on a phone and a ledger line on a desktop, which means changing the
    table's display. Browsers drop table semantics when display changes, so the roles are
    written out to keep the rows reachable as rows either way.
  -->
  <!-- svelte-ignore a11y_no_redundant_roles -->
  <table role="table">
    <!-- svelte-ignore a11y_no_redundant_roles -->
    <thead role="rowgroup">
      <!-- svelte-ignore a11y_no_redundant_roles -->
      <tr role="row">
        <th role="columnheader" class="c-name">Company</th>
        <th role="columnheader" class="c-city">City</th>
        <th role="columnheader" class="c-created">Created</th>
        <th role="columnheader" class="c-link">Link</th>
        <th role="columnheader" class="c-actions"><span class="sr">Actions</span></th>
      </tr>
    </thead>
    <!-- svelte-ignore a11y_no_redundant_roles -->
    <tbody role="rowgroup">
      {#each data.prospects as p (p.slug)}
        <!-- svelte-ignore a11y_no_redundant_roles -->
        <tr role="row" class:archived={p.archived} class:highlight={p.slug === created?.slug}>
          <td role="cell" class="c-name">
            <span class="company">{p.companyName}</span>
            {#if p.archived}<span class="tag">Archived</span>{/if}
          </td>
          <td role="cell" class="c-city">{p.city}</td>
          <td role="cell" class="c-created">{p.created}</td>
          <td role="cell" class="c-link">
            <code class="url" data-testid="share-url">{p.url}</code>
          </td>
          <td role="cell" class="c-actions">
            <CopyButton text={p.url} />
            <form method="POST" action="?/archive" use:enhance>
              <input type="hidden" name="slug" value={p.slug} />
              <input type="hidden" name="archived" value={p.archived ? '0' : '1'} />
              <button type="submit" class="toggle">{p.archived ? 'Unarchive' : 'Archive'}</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  /* ── page head ──────────────────────────────────────────────────────── */
  .page-head {
    display: grid;
    gap: 1rem;
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
  .summary {
    margin: 0.35rem 0 0;
    font-size: 0.9rem;
    color: var(--ink-soft);
  }
  .page-head .btn {
    justify-content: center;
    width: 100%;
    /* Lighter than the marketing pill: primary here, but not shouting over the heading. */
    padding: 0.85rem 1.5rem;
  }

  /* ── the just-created prospect ──────────────────────────────────────── */
  .created {
    display: grid;
    justify-items: start;
    gap: 0.5rem;
    max-width: 34rem;
    margin-bottom: 1.75rem;
    padding: 1.25rem;
    border: 1px solid var(--accent);
    border-radius: 10px;
    background: color-mix(in oklab, var(--accent) 6%, var(--bg));
  }
  .created h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }
  .created p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--ink-soft);
  }
  .created .url {
    margin: 0.25rem 0 0.5rem;
  }

  /* ── the share link, the thing this page exists to hand over ────────── */
  .url {
    display: block;
    width: 100%;
    font-family: var(--mono);
    font-size: 0.8rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
    padding: 0.5rem 0.65rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: color-mix(in oklab, var(--ink) 4%, var(--bg));
  }

  /* ── empty state ────────────────────────────────────────────────────── */
  .empty {
    padding: 2rem 1.25rem;
    border: 1px dashed var(--line);
    border-radius: 10px;
    text-align: center;
  }
  .empty p {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
  }
  .empty .empty-note {
    margin: 0.4rem auto 1rem;
    max-width: 34ch;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--ink-soft);
  }
  .empty .btn {
    padding: 0.85rem 1.5rem;
  }

  /* ── the list: cards on a phone, ledger lines on a desktop ──────────── */
  table {
    display: block;
    width: 100%;
  }
  thead {
    display: none;
  }
  tbody {
    display: grid;
    gap: 0.75rem;
  }
  tr {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'name name'
      'city created'
      'link link'
      'actions actions';
    gap: 0.2rem 0.75rem;
    align-items: center;
    padding: 0.9rem 1rem;
    border: 1px solid var(--line);
    /* The left edge carries the row's state, so it reads before any label does. */
    border-left: 3px solid var(--accent);
    border-radius: 10px;
    background: color-mix(in oklab, var(--paper) 60%, var(--bg));
  }
  td,
  th {
    padding: 0;
    border: 0;
    text-align: left;
    min-width: 0;
  }
  th {
    font-family: var(--sans);
  }
  .c-name {
    grid-area: name;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .company {
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.3;
  }
  .c-city {
    grid-area: city;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .c-created {
    grid-area: created;
    justify-self: end;
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--ink-soft);
  }
  .c-link {
    grid-area: link;
    margin-top: 0.6rem;
  }
  .c-actions {
    grid-area: actions;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* Wraps so the copy button's manual fallback (a message and a full-width input, shown
       where the clipboard API is missing) has somewhere to go. */
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  .created :global(.copy) {
    width: 100%;
  }

  tr.archived {
    background: var(--bg);
    border-left-style: dashed;
    border-left-color: var(--line);
  }
  tr.archived .company,
  tr.archived .c-city {
    color: var(--ink-soft);
  }
  tr.highlight {
    border-color: var(--accent);
    background: color-mix(in oklab, var(--accent) 7%, var(--paper));
  }

  .tag {
    font-size: 0.7rem;
    letter-spacing: 0.01em;
    color: var(--ink-soft);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
  }

  .toggle {
    font: inherit;
    font-size: 0.85rem;
    min-height: 2.5rem;
    padding: 0 0.85rem;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: var(--ink-soft);
  }
  .toggle:hover {
    border-color: var(--line);
    color: var(--ink);
  }

  .error {
    margin: 0 0 1.25rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--danger);
    border-radius: 0 6px 6px 0;
    background: color-mix(in oklab, var(--danger) 7%, var(--bg));
    color: var(--danger);
    font-size: 0.9rem;
  }

  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (min-width: 48rem) {
    .page-head {
      grid-template-columns: 1fr auto;
      align-items: end;
      margin-bottom: 2.25rem;
    }
    .page-head .btn {
      width: auto;
    }

    /* Same grid, one row per prospect, so the head and the body share column edges. */
    thead {
      display: block;
    }
    tbody {
      gap: 0;
    }
    tr {
      /* The actions track is fixed, not auto: the head row holds no buttons, and an auto
         track would size itself differently there and knock the columns out of line. */
      grid-template-columns: minmax(0, 1.3fr) 0.6fr 0.55fr minmax(0, 1.9fr) 12rem;
      grid-template-areas: 'name city created link actions';
      gap: 1rem;
      padding: 0.9rem 0.5rem;
      border: 0;
      border-bottom: 1px solid var(--line);
      border-radius: 0;
      background: none;
    }
    th {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--ink-soft);
    }
    .company {
      font-size: 0.95rem;
    }
    .c-city,
    .c-created {
      font-size: 0.85rem;
    }
    .c-created {
      justify-self: start;
    }
    .c-link,
    .c-actions {
      margin-top: 0;
    }
    .c-actions {
      justify-content: flex-end;
      gap: 0.25rem;
    }
    /* The hairline rows already separate the links, so the inset box comes off here. */
    .c-link .url {
      padding: 0;
      border: 0;
      background: none;
    }

    /* No card edge to carry the state here, so the tag and the muted text do it. */
    tr.archived {
      background: none;
    }
    tr.highlight {
      background: color-mix(in oklab, var(--accent) 7%, transparent);
    }
  }
</style>
