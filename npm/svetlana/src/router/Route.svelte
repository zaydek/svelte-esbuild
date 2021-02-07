<script>
	import store_path from "./store_path.js"

	export let path = ""
</script>

{#if $store_path === path}
	<slot />
{/if}
