<script>
	import { Link } from "../router"
</script>

<svelte:head>
	<title>Hello, world! (/nested/)</title>
	<meta type="description" content="Hello, world!" />
</svelte:head>
<nav>
	<Link path="/">page /</Link><br />
	<Link path="/nested/">page /nested/</Link><br />
</nav>

{#await import("../page_components/Hello.svelte").then(module => module.default)}
	Loading...
{:then Component}
	<Component />
{/await}

<h1 on:click={() => alert("ohohohohoh")}>Hello, world! (/)</h1>

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
