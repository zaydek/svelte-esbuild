<script>
	import { Link } from "../../router"
	import { onMount } from "svelte"

	let Component

	onMount(async () => {
		Component = (await import("../../page_components/Hello.svelte")).default
	})
</script>

<svelte:head>
	<title>Hello, world! (/nested/)</title>
	<meta type="description" content="Hello, world!" />
</svelte:head>

<nav>
	<Link path="/">page /</Link><br />
	<Link path="/nested/">page /nested/</Link><br />
</nav>

<h1 on:click={() => alert("ohasdasdasdohoh")}>Hello, world! (/)</h1>

<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>
<div>Hello, world!</div>

<svelte:component this={Component} />
