<script lang="ts">
  import { resolve } from '$app/paths';

  let { children }: { children: import('svelte').Snippet } = $props();
</script>

<svelte:head>
  <title>Admin</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="admin-root">
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href={resolve('/admin')}>Vancity <span>Admin</span></a>
      <a class="away" href={resolve('/')}>Live site</a>
    </div>
  </header>

  <main class="admin-main">
    {@render children()}
  </main>
</div>

<style>
  .admin-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--sans);
    cursor: auto;
  }

  :global(.admin-root *) {
    cursor: inherit;
  }

  :global(.admin-root a),
  :global(.admin-root button) {
    cursor: pointer;
  }

  /* Admin is a tool, not a page to scroll: the bar stays put so the way out is always there. */
  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: color-mix(in oklab, var(--bg) 95%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }

  .topbar-inner,
  .admin-main {
    max-width: 64rem;
    margin: 0 auto;
    padding-left: max(1.25rem, env(safe-area-inset-left));
    padding-right: max(1.25rem, env(safe-area-inset-right));
  }

  .topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 3.25rem;
  }

  .brand {
    font-family: var(--serif);
    font-size: 1.15rem;
    letter-spacing: -0.02em;
  }

  .brand span {
    font-family: var(--sans);
    font-size: 0.85rem;
    letter-spacing: 0;
    color: var(--ink-soft);
  }

  .away {
    font-size: 0.85rem;
    color: var(--ink-soft);
  }

  .away:hover {
    color: var(--accent);
  }

  .admin-main {
    padding-top: 1.75rem;
    padding-bottom: calc(3rem + env(safe-area-inset-bottom));
  }

  @media (min-width: 760px) {
    .topbar-inner,
    .admin-main {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .admin-main {
      padding-top: 2.5rem;
    }
  }

  /* A visible keyboard path through every control in the area. */
  :global(.admin-root a:focus-visible),
  :global(.admin-root button:focus-visible),
  :global(.admin-root input:focus-visible),
  :global(.admin-root select:focus-visible),
  :global(.admin-root textarea:focus-visible) {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
</style>
