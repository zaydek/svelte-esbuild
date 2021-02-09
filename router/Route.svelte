<script>
	import { onMount } from "svelte"

	import pathStore from "./pathStore.js"

	export let path = ""

	onMount(() => {
		console.log($pathStore.path, path)
	})
</script>

<!--

TODO: Right now we don’t have a <Router> because every route is responsible for
conditionally rendering its slot based on pathStore.

The reason we need a <Router> component is because right now we have no
mechanism for forwarding to /404, since we have no way to fallback.

-->
{#if $pathStore.path === path}
	<slot />
{/if}
