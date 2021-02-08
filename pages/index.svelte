<script>
	import { Link } from "../router"
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

<style>
	h1 {
		cursor: pointer;
	}
</style>
