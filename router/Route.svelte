<script>
	import pathStore from "./pathStore.js"

	export let path = ""
</script>

<!-- TODO: Right now we don’t have a <Router> because every route is responsible
for conditionally rendering its slot based on pathStore. Another architecture
would be to use a <Router> where every <Route> is registered using
<script context="module">. The advantage of this apporach is that that only the
router needs to think whereas <Route> is otherwise idempotent. The disadvantage
of this approach is that we need a <Router> component which is slightly
annoying. -->
{#if $pathStore.path === path}
	{#each [$pathStore] as each (each.key)}
		<slot />
	{/each}
{/if}
