<script lang="ts">
  let { children }: { children: import('svelte').Snippet } = $props();
</script>

<svelte:head>
  <title>Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin-root">
  {@render children()}
</div>

<style>
  .admin-root {
    min-height: 100vh;
    padding: 2rem 1.5rem;
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
</style>
