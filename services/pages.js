const esbuild = require("esbuild")
const fs = require("fs/promises")
const path = require("path")
const prettier = require("prettier")

// TODO: Change to process.cwd?
const svelte = require("./services/svelte-plugin.js")
const { no_ext } = require("./services/helpers")

const userSvetlanaConfig = { plugins: [] }
const userPrettierConfig = {}

// renderComponent renders a component from a page-based route.
//
// TODO: Add support for incremental recompilation.
async function renderComponent(runtime, page_based_route) {
	const result = await esbuild.build({
		bundle: true,
		define: {
			__DEV__: process.env.__DEV__,
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: [page_based_route.src_path],
		format: "cjs",
		outfile: `${runtime.dir_config.cache_dir}/${no_ext(page_based_route.src_path)}.esbuild.js`,
		plugins: [
			svelte({
				generate: "ssr",
			}),
			...userSvetlanaConfig.plugins,
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
	const component = require(`./${runtime.dir_config.cache_dir}/${no_ext(page_based_route.src_path)}.esbuild.js`).default
	return component.render()
}

// renderPage renders a page from a rendered component.
async function renderPage(runtime, component) {
	// prettier-ignore
	const head = component.head
		.replace(/></g, ">\n\t\t<")
		.replace(/\/>/g, " />")

	const body = `
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="app">${component.html}</div>
<script src="/app.js"></script>
`

	// prettier-ignore
	let page = runtime.base_page
		.replace("%head%", head)
		.replace("%page%", body)

	// if (runtime.command.prettier && userPrettierConfig !== undefined) {
	if (userPrettierConfig !== undefined) {
		page = prettier.format(page, {
			...userPrettierConfig,
			parser: "html",
		})
	}
	return page
}

async function run(runtime) {
	try {
		userSvetlanaConfig = require(path.join(process.cwd(), "svetlana.config.js"))

		const prettierrc = await fs.readFile(".prettierrc")
		userPrettierConfig = JSON.parse(prettierrc)
	} catch {}

	const chain = []
	for (const each of runtime.page_based_router) {
		const p = new Promise(async resolve => {
			const component = await renderComponent(runtime, each)
			const page = await renderPage(runtime, component)
			resolve({ ...each, page })
		})
		chain.push(p)
	}

	const arr = await Promise.all(chain)
	const map = arr.reduce((acc, each) => {
		acc[each.path] = each.page
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
