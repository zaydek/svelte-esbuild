const esbuild = require("esbuild")
const fs = require("fs/promises")
const path = require("path")
const prettier = require("prettier")

const svelte = require("./svelte-plugin.js")

const userSvetlanaConfig = { plugins: [] }
const userPrettierConfig = {}

function no_ext(src) {
	return src.slice(0, -path.extname(src).length)
}

// renderComponentFromPageBasedRoute renders a component from a page-based route.
async function renderComponentFromPageBasedRoute(runtime, page_based_route) {
	// TODO: Change to a service-based architecture and or add incremental
	// recompilation?
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

// renderPageFromComponent renders a page from a rendered component.
async function renderPageFromComponent(runtime, component) {
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
		const p = new Promise(async (resolve, reject) => {
			const component = await renderComponentFromPageBasedRoute(runtime, each)
			const page = await renderPageFromComponent(runtime, component)
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

run({
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
