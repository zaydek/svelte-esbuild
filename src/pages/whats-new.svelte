<script>
	import Hello from "../components/Hello.svelte"
	import Nav from "../components/Nav.svelte"

	let title = "What’s new?"
</script>

<!-- prettier-ignore -->
<svelte:head>
	<title>{title}</title>
	<meta name="title" content="Meta Tags — Preview, Edit and Generate" />
	<meta name="description" content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!" />
</svelte:head>

<Nav />
<Hello />
<h2>{title}</h2>
