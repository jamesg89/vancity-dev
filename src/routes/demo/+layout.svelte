<script lang="ts">
  import type { LayoutData } from './$types';
  import DemoBanner from '$lib/components/DemoBanner.svelte';

  let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

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
  }
</style>
