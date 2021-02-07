<script>
	import open from "./open.js"

	export let path = ""
	export let scrollX = 0
	export let scrollY = 0

	$: locallyScoped = !path.includes("://")
</script>

<a
	href={path}
	target={locallyScoped ? undefined : "_blank"}
	rel={locallyScoped ? undefined : "noreferrer noopener"}
	on:click={locallyScoped
		? e => {
				e.preventDefault()
				open(path, { scrollX, scrollY })
		  }
		: undefined}
	{...$$props}
>
	<slot />
</a>
