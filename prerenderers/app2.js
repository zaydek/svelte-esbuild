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
	fs.writeFile(`${runtime.dir_config.cache_dir}/App.svelte`, out1)

	// __cache__/main.js
	const out2 = `import App from "./App.svelte"

export default new App({
	hydrate: true,
	target: document.getElementById("app"),
})
`
	fs.writeFile(`${runtime.dir_config.cache_dir}/main.js`, out2)

	const result = await esbuild.build({
		bundle: true,
		// define: {
		// 	__DEV__: process.env.__DEV__,
		// 	NODE_ENV: process.env.NODE_ENV,
		// },
		entryPoints: [`${runtime.dir_config.cache_dir}/main.js`],
		format: "esm",
		// minify: process.env.NODE_ENV === "production",
		// outfile: `${runtime.dir_config.build_dir}/app.js`,
		outdir: runtime.dir_config.build_dir,
		plugins: [
			sveltePlugin({
				generate: "dom",
				// hydratable: true,
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
			src_path: "pages/ghasdhasd.svelte",
			dst_path: "build/ghasdhasd.html",
			path: "/ghasdhasd",
			component: "PageGhasdhasd",
		},
		{
			src_path: "pages/ghasdhasdhasd.svelte",
			dst_path: "build/ghasdhasdhasd.html",
			path: "/ghasdhasdhasd",
			component: "PageGhasdhasdhasd",
		},
		{
			src_path: "pages/haha-copy-2.svelte",
			dst_path: "build/haha-copy-2.html",
			path: "/haha-copy-2",
			component: "PageHahaCopy2",
		},
		{
			src_path: "pages/haha.svelte",
			dst_path: "build/haha.html",
			path: "/haha",
			component: "PageHaha",
		},
		{
			src_path: "pages/hahe-2.svelte",
			dst_path: "build/hahe-2.html",
			path: "/hahe-2",
			component: "PageHahe2",
		},
		{
			src_path: "pages/hahe-3.svelte",
			dst_path: "build/hahe-3.html",
			path: "/hahe-3",
			component: "PageHahe3",
		},
		{
			src_path: "pages/hahe-4.svelte",
			dst_path: "build/hahe-4.html",
			path: "/hahe-4",
			component: "PageHahe4",
		},
		{
			src_path: "pages/hahe-5.svelte",
			dst_path: "build/hahe-5.html",
			path: "/hahe-5",
			component: "PageHahe5",
		},
		{
			src_path: "pages/hahe-6.svelte",
			dst_path: "build/hahe-6.html",
			path: "/hahe-6",
			component: "PageHahe6",
		},
		{
			src_path: "pages/hahe-7.svelte",
			dst_path: "build/hahe-7.html",
			path: "/hahe-7",
			component: "PageHahe7",
		},
		{
			src_path: "pages/hahe.svelte",
			dst_path: "build/hahe.html",
			path: "/hahe",
			component: "PageHahe",
		},
		{
			src_path: "pages/hasd.svelte",
			dst_path: "build/hasd.html",
			path: "/hasd",
			component: "PageHasd",
		},
		{
			src_path: "pages/hasdas.svelte",
			dst_path: "build/hasdas.html",
			path: "/hasdas",
			component: "PageHasdas",
		},
		{
			src_path: "pages/hello.svelte",
			dst_path: "build/hello.html",
			path: "/hello",
			component: "PageHello",
		},
		{
			src_path: "pages/index.svelte",
			dst_path: "build/index.html",
			path: "/",
			component: "PageIndex",
		},
		{
			src_path: "pages/jashdashdasd.svelte",
			dst_path: "build/jashdashdasd.html",
			path: "/jashdashdasd",
			component: "PageJashdashdasd",
		},
		{
			src_path: "pages/lol.svelte",
			dst_path: "build/lol.html",
			path: "/lol",
			component: "PageLol",
		},
		{
			src_path: "pages/nested/index.svelte",
			dst_path: "build/nested/index.html",
			path: "/nested/",
			component: "PageNestedIndex",
		},
		{
			src_path: "pages/world.svelte",
			dst_path: "build/world.html",
			path: "/world",
			component: "PageWorld",
		},
	],
})
