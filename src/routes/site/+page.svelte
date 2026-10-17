<script lang="ts">
  import PlumbingSite from '$lib/templates/plumbing/PlumbingSite.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
  <!-- Neutral icon: no Vancity mark, and no /favicon.ico request that the catch-all would answer with the page. -->
  <link rel="icon" href="data:," />
</svelte:head>

{#if data.industry === 'plumbing'}
  <PlumbingSite content={data.content} />
{/if}
