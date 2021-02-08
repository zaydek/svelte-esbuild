const esbuild = require("esbuild")
const fs = require("fs/promises")
const path = require("path")
const prettier = require("prettier")

const svelte = require("./svelte-plugin.js")

const userSvetlanaConfig = {}
const userPrettierConfig = {}

function name(src) {
	return path.basename(src).slice(0, -path.extname(src).length)
}

// renderComponentFromPageBasedRoute renders a component from a page-based route.
async function renderComponentFromPageBasedRoute(runtime, page_based_route) {
	const result = await esbuild.build({
		bundle: true,
		define: {
			__DEV__: process.env.__DEV__,
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: [page_based_route.src_path],
		format: "cjs",
		outfile: `${runtime.dir_config.cache_dir}/pages/${name(src)}.esbuild.js`,
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

	const component = require(`./${runtime.dir_config.cache_dir}/pages/${name(src)}.esbuild.js`).default
	return component.render()
}

// renderPageFromComponent renders a page from a rendered component.
async function renderPageFromComponent(runtime, component) {
	// prettier-ignore
	let page = runtime.base_html
		.replace("%head%",
			component.head
				.replace(/></g, ">\n\t\t<")
				.replace(/\/>/g, " />"),
		)
		.replace("%page%", `
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="app">${component.html}</div>
<script src="/app.js"></script>
		`)

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
		const p = new Promise(async () => {
			const component = await renderComponentFromPageBasedRoute(runtime, each)
			return await renderPageFromComponent(runtime, component)
		})
		chain.push(p)
	}
	const arr = await Promise.all(chain)
	const map = arr.reduce((acc, each) => {
		acc[each] = each
		return acc
	}, {})
	return map
}

run({
	dir_config: {
		assetDir: "public",
		pagesDir: "pages",
		cacheDir: "__cache__",
		buildDir: "build",
	},
	base_html: `<!DOCTYPE html>
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
	page_based_router: [
		{ src_path: "pages/index.html", dst_path: "build/index.html", path: "/", component: "PageIndex" },
		{ src_path: "pages/hello.html", dst_path: "build/hello.html", path: "/hello", component: "PageHello" },
	],
})
