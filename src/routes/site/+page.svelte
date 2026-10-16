<script lang="ts">
  import PlumbingSite from '$lib/templates/plumbing/PlumbingSite.svelte';

  let { data } = $props();
</script>

{#if data.industry === 'plumbing'}
  <PlumbingSite content={data.content} />
{/if}
