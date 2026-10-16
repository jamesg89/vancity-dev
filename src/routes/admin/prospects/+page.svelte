<script lang="ts">
  import { enhance } from '$app/forms';
  import CopyButton from '../CopyButton.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<header class="bar">
  <h1>Prospects</h1>
  <nav>
    <a href="/admin">Admin</a>
    <a class="btn" href="/admin/prospects/new">New prospect</a>
  </nav>
</header>

{#if form && 'message' in form && form.message}
  <p class="error" role="alert">{form.message}</p>
{/if}

{#if data.prospects.length === 0}
  <p>No prospects yet. <a href="/admin/prospects/new">Create the first one.</a></p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Company</th>
        <th>City</th>
        <th>Created</th>
        <th>Link</th>
        <th><span class="sr">Archive</span></th>
      </tr>
    </thead>
    <tbody>
      {#each data.prospects as p (p.slug)}
        <tr class:archived={p.archived}>
          <td>
            {p.companyName}
            {#if p.archived}<span class="tag">Archived</span>{/if}
          </td>
          <td>{p.city}</td>
          <td>{p.created}</td>
          <td>
            <div class="link">
              <code data-testid="share-url">{p.url}</code>
              <CopyButton text={p.url} />
            </div>
          </td>
          <td>
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
  nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }
  th,
  td {
    text-align: left;
    padding: 0.6rem 0.75rem;
    border-bottom: 1px solid var(--line);
    vertical-align: middle;
  }
  th {
    font-family: var(--mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ink-soft);
  }
  .link {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  code {
    font-family: var(--mono);
    font-size: 0.85rem;
  }
  tr.archived td {
    color: var(--ink-soft);
  }
  .tag {
    margin-left: 0.4rem;
    font-size: 0.7rem;
    font-family: var(--mono);
    text-transform: uppercase;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
  }
  .toggle {
    font: inherit;
    font-size: 0.85rem;
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: transparent;
    color: var(--ink);
  }
  .error {
    color: #9b2c2c;
    margin-bottom: 1rem;
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
</style>
