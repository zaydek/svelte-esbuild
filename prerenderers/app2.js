const esbuild = require("esbuild")
const fs = require("fs/promises")
const helpers = require("./helpers.js")
const sveltePlugin = require("./svelte-plugin.js")

let configs = {}

async function run(runtime) {
	const t = Date.now()

	configs = await helpers.load_user_configs()

	// __cache__/App.svelte
	const out1 = `<script>
	import { Route } from "./router"

	${runtime.page_based_router.map(each => `import ${each.component} from "./${each.src_path}"`).join("\n\t")}
</script>

${runtime.page_based_router
	.map(
		each => `<Route path="${each.path}">
	<${each.component} />
</Route>
`,
	)
	.join("\n")}`
	fs.writeFile(`App.svelte`, out1)

	// __cache__/main.js
	const out2 = `import App from "./App.svelte"

export default new App({
	hydrate: true,
	target: document.getElementById("app"),
})
`
	fs.writeFile(`app.js`, out2)

	const result = await esbuild.build({
		bundle: true,
		// define: {
		// 	__DEV__: process.env.__DEV__,
		// 	NODE_ENV: process.env.NODE_ENV,
		// },
		entryPoints: [`app.js`],
		format: "esm",
		// minify: process.env.NODE_ENV === "production",
		// minify: true,
		// outfile: `${runtime.dir_config.build_dir}/app.js`,
		outdir: runtime.dir_config.build_dir,
		plugins: [
			sveltePlugin({
				generate: "dom",
				hydratable: true,
			}),
			// ...configs.svetlana.plugins,
		],
		splitting: true,
		// sourcemap: runtime.command.source_map,
	})
	if ((result.errors && result.errors.length > 0) || (result.warnings && result.warnings.length > 0)) {
		console.log(
			JSON.stringify({
				data: {},
				errors: result.errors,
				warnings: result.errors,
			}),
		)
		process.kill(1)
	}

	fs.unlink(`App.svelte`)
	fs.unlink(`app.js`)

	console.log(
		JSON.stringify({
			data: {},
			errors: [],
			warnings: [],
		}),
	)

	console.log(Date.now() - t)
}

run({
	command: {
		cached: false,
		prettier: true,
		source_map: true,
	},
	dir_config: {
		asset_dir: "public",
		pages_dir: "pages",
		cache_dir: "__cache__",
		build_dir: "build",
	},
	base_page: '\u003c!DOCTYPE html\u003e\n\u003chtml lang="en"\u003e\n\t\u003chead\u003e\n\t\t\u003cmeta charset="utf-8" /\u003e\n\t\t\u003cmeta name="viewport" content="width=device-width, initial-scale=1" /\u003e\n\t\t%head%\n\t\u003c/head\u003e\n\t\u003cbody\u003e\n\t\t%page%\n\t\u003c/body\u003e\n\u003c/html\u003e\n',
	page_based_router: [
		{
			src_path: "pages/index.svelte",
			dst_path: "build/index.html",
			path: "/",
			component: "PageIndex",
		},
		{
			src_path: "pages/nested/index.svelte",
			dst_path: "build/nested/index.html",
			path: "/nested/",
			component: "PageNestedIndex",
		},
	],
})
