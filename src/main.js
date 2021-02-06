import App from "./pages/hello-world.svelte"

export default new App({
	hydrate: true,
	target: document.getElementById("root"),
})
