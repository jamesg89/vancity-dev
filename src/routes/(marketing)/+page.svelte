<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import ConsultModal from '$lib/components/ConsultModal.svelte';

	let modalOpen = $state(false);

	function openModal() {
		modalOpen = true;
	}
</script>

<HeroSection />
<WorkSection />
<PricingSection onBookConsult={openModal} />
<AboutSection />
<ContactSection onBookConsult={openModal} />
<ConsultModal bind:open={modalOpen} />
