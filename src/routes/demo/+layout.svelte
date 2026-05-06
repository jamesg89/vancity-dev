<script lang="ts">
  import type { LayoutData } from './$types';
  import DemoBanner from '$lib/components/DemoBanner.svelte';

  let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<svelte:head>
  {#if data.demo && data.variant}
    <title>{data.demo.clientName} — {data.demo.tagline}</title>
  {/if}
</svelte:head>

{#if data.demo && data.variant}
  <div class="demo-root" style={data.cssVars}>
    <DemoBanner demo={data.demo} variant={data.variant} />
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}

<style>
  .demo-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    cursor: auto;
  }

  :global(.demo-root *) {
    cursor: inherit;
  }

  :global(.demo-root a),
  :global(.demo-root button),
  :global(.demo-root [role="button"]),
  :global(.demo-root input),
  :global(.demo-root select),
  :global(.demo-root textarea) {
    cursor: pointer;
  }

  :global(.demo-root input),
  :global(.demo-root textarea) {
    cursor: text;
  }
</style>
