<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		// reveal on scroll
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add('in');
				});
			},
			{ threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
		);
		document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

		// custom cursor
		const dot = document.getElementById('cursor-dot');
		const ring = document.getElementById('cursor-ring');
		if (!dot || !ring) return () => io.disconnect();

		let mx = window.innerWidth / 2;
		let my = window.innerHeight / 2;
		let rx = mx;
		let ry = my;
		let raf: number;

		const onMove = (e: MouseEvent) => {
			mx = e.clientX;
			my = e.clientY;
			dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
		};
		const tick = () => {
			rx += (mx - rx) * 0.18;
			ry += (my - ry) * 0.18;
			ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
			raf = requestAnimationFrame(tick);
		};
		const onOver = (e: MouseEvent) => {
			const t = (e.target as Element).closest('a,button,.work-item,.price-card');
			document.body.classList.toggle('cursor-hot', !!t);
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseover', onOver);
		raf = requestAnimationFrame(tick);

		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseover', onOver);
		};
	});
</script>

<div class="cursor-ring" id="cursor-ring"></div>
<div class="cursor-dot" id="cursor-dot"></div>
<NavBar />
<main>
	{@render children()}
</main>
