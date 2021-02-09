<script>
	import { Link } from "../router"
	import { onMount } from "svelte"

	let counter = 0

	onMount(() => {
		const id = setInterval(() => {
			counter++
		}, 1e3)
		return () => clearInterval(id)
	})
</script>

<svelte:head>
	<title>Hello, world! (/)</title>
	<meta type="description" content="Hello, world!" />
</svelte:head>

<nav>
	<Link path="/">page /</Link><br />
	<Link path="/nested/">page /nested/</Link><br />
</nav>

<h1 on:click={() => alert("hahahaha")}>
	Hello, world! (/)
	<h1>Hello, world! (/)</h1>
</h1>

<div>{counter}</div>

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

<style>
	h1 {
		cursor: pointer;
	}
</style>
