<script lang="ts">
  import PlumbingSite from '$lib/templates/plumbing/PlumbingSite.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if data.industry === 'plumbing'}
  <PlumbingSite content={data.content} />
{/if}
