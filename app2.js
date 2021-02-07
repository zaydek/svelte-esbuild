require("svelte/register")({
	generate: "ssr",
	hydratable: true,
})

const App = require("./App.svelte").default
console.log(App.render({ who: "you" }))
