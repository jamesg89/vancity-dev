<script lang="ts">
  import DefenseSite from '$lib/templates/defense/DefenseSite.svelte';
  import { harbourDefaults } from '$lib/templates/defense/defaults';
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<DefenseSite content={harbourDefaults} />
