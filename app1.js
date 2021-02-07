require("svelte/register")({
	generate: "dom",
	hydratable: true,
})

const App = require("./App.svelte").default
console.log(App.render({ who: "you" }))
