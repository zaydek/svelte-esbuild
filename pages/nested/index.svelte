<script>
	import { Link } from "../../router"
</script>

<svelte:head>
	<title>Hello, world! (/nested/)</title>
	<meta type="description" content="Hello, world!" />
</svelte:head>

<nav>
	<Link path="/">page /</Link><br />
	<Link path="/nested/">page /nested/</Link><br />
</nav>

<h1 on:click={() => alert("ohohohohoh")}>Hello, world! (/nested/)</h1>
