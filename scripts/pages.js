const esbuild = require("esbuild")
const helpers = require("./scripts/helpers")
const prettier = require("prettier")
const sveltePlugin = require("./scripts/svelte-plugin.js")

let configs = {}

// renderAsComponent renders a component from a page-based route.
async function renderAsComponent(runtime, page_based_route) {
	const result = await esbuild.build({
		bundle: true,
		define: {
			__DEV__: process.env.__DEV__,
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: [page_based_route.src_path],
		format: "cjs",
		outfile: `${runtime.dir_config.cache_dir}/${helpers.no_ext(page_based_route.src_path)}.esbuild.js`,
		plugins: [
			sveltePlugin({
				generate: "ssr",
			}),
			...configs.svetlana.plugins,
		],
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
	const component = require(`./${runtime.dir_config.cache_dir}/${helpers.no_ext(page_based_route.src_path)}.esbuild.js`).default
	return component.render()
}

// renderAsPage renders a page from a rendered component.
//
// prettier-ignore
async function renderAsPage(runtime, component) {
	const head = component.head
		.replace(/></g, ">\n\t\t<")
		.replace(/\/>/g, " />")

	const body = `<noscript>You need to enable JavaScript to run this app.</noscript>
		<div id="app">
${component.html}
		</div>
		<script src="/app.js"></script>`

	let page = runtime.base_page
		.replace("%head%", head)
		.replace("%page%", body)

	if (runtime.command.prettier) {
		page = prettier.format(page, {
			...configs.prettier,
			parser: "html",
		})
	}
	return page
}

// TODO: Change API to service-based architecture and or add support for
// incremental recompilation.
async function run(runtime) {
	configs = await helpers.load_user_configs()

	const chain = []
	for (const each of runtime.page_based_router) {
		const p = new Promise(async resolve => {
			const component = await renderAsComponent(runtime, each)
			const page = await renderAsPage(runtime, component)
			resolve({ ...each, page })
		})
		chain.push(p)
	}

	const arr = await Promise.all(chain)
	const map = arr.reduce((acc, each) => {
		acc[each.path] = each
		return acc
	}, {})

	console.log(
		JSON.stringify({
			data: map,
			errors: [],
			warnings: [],
		}),
	)
}
