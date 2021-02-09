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

	<Link path="/ghasdhasd">ghasdhasd</Link><br />
	<Link path="/ghasdhasdhasd">ghasdhasdhasd</Link><br />
	<Link path="/haha">haha</Link><br />
	<Link path="/hahe">hahe</Link><br />
	<Link path="/hasd">hasd</Link><br />
	<Link path="/hasdas">hasdas</Link><br />
	<Link path="/hello">hello</Link><br />
	<Link path="/index">index</Link><br />
	<Link path="/jashdashdasd">jashdashdasd</Link><br />
	<Link path="/lol">lol</Link><br />
	<Link path="/world">world</Link><br />
</nav>

<h1 on:click={() => alert("hahahaha")}>
	Hello, world! asdasdasdasd (/)
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
