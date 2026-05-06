<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	let { children } = $props();
</script>

<NavBar />
<main>
	{@render children()}
</main>
<SiteFooter />
