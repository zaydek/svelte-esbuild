const esbuild = require("esbuild")
const fs = require("fs/promises")
const path = require("path")

const sveltePlugin = require("./svelte-plugin.js")

// TODO: Extract to a share function; getUserConfigs.
const userSvetlanaConfig = { plugins: [] }

async function run(runtime) {
	try {
		userSvetlanaConfig = require(path.join(process.cwd(), "svetlana.config.js"))
	} catch {}

	// __cache__/App.svelte
	const appstr = `<script>
	import { Route } from "../router"

	${runtime.page_based_router.map(each => `import ${each.component} from "../${each.src_path}"`).join("\n\t")}
</script>

${runtime.page_based_router
	.map(
		each => `<Route path="${each.path}">
	<${each.component} />
</Route>
`,
	)
	.join("\n")}`
	fs.writeFile(`${runtime.dir_config.cache_dir}/App.svelte`, appstr)

	// __cache__/main.js
	const mainstr = `import App from "./App.svelte"

export default new App({
	hydrate: true,
	target: document.getElementById("app"),
})
`
	fs.writeFile(`${runtime.dir_config.cache_dir}/main.js`, mainstr)

	const result = await esbuild.build({
		bundle: true,
		define: {
			__DEV__: process.env.__DEV__,
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: [`${runtime.dir_config.cache_dir}/main.js`],
		minify: process.env.NODE_ENV === "production",
		outfile: `${runtime.dir_config.build_dir}/app.js`,
		plugins: [
			sveltePlugin({
				generate: "dom",
				hydratable: true,
			}),
			...userSvetlanaConfig.plugins,
		],
		sourcemap: true,
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

	console.log(
		JSON.stringify({
			data: {},
			errors: [],
			warnings: [],
		}),
	)
}

run({
	command: {
		/* TODO */
	},
	dir_config: {
		asset_dir: "public",
		pages_dir: "pages",
		cache_dir: "__cache__",
		build_dir: "build",
	},
	base_page: `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%head%
	</head>
	<body>
		%page%
	</body>
</html>
`,
	// prettier-ignore
	page_based_router: [
		{ src_path: "pages/index.svelte", dst_path: "build/index.html", path: "/", component: "PageIndex" },
		{ src_path: "pages/nested/index.svelte", dst_path: "build/nested/index.html", path: "/nested/", component: "PageIndexIndex" },
	],
})
