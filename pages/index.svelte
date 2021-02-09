<script>
	import { onMount } from "svelte"

	let Component

	onMount(async () => {
		Component = (await import("../page_components/Hello.svelte")).default
	})
</script>

<h1 on:click={() => alert("ohohohohoh")}>Hello, world! (/)</h1>

<svelte:component this={Component} />
