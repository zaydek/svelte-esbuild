const esbuild = require("esbuild")
const fs = require("fs/promises")
const path = require("path")
const prettier = require("prettier")
const util = require("util")

const prettierrc = require("./helpers/prettierrc.js")
const sveltePlugin = require("./helpers/svelte-plugin.js")

const exec = util.promisify(require("child_process").exec)

// "path/to/name.ext" -> "name"
function name(src) {
	return path.basename(src).slice(0, -path.extname(src).length)
}

// generate_html generates HTML from a src path.
async function generate_html(src) {
	const result = await esbuild.build({
		bundle: true,
		define: {
			__DEV__: process.env.NODE_ENV !== "production",
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: [src],
		format: "cjs", // Must use "cjs" here
		minify: false, // No need; this is an intermediary build step
		outfile: `__cache__/pages/${name(src)}.esbuild.js`,
		plugins: [
			sveltePlugin({
				generate: "ssr",
			}),
		],
		sourcemap: false, // No need; this is an intermediary build step
	})
	if (result.errors && result.errors.length > 0) {
		console.error(result.errors)
	}
	if (result.warnings && result.warnings.length > 0) {
		console.warn(result.warnings)
	}
	const Component = require(`./__cache__/pages/${name(src)}.esbuild.js`).default
	return Component.render()
}

// TODO: If not prettier, use.
// function clean(head) {
// 	return head
// 		.replace(/></g, ">\n\t\t<")
// 		.replace(/\/>/g, " />")
// }

// write_page_html writes a page from an HTML template and a src path. Pages are
// written to build/*.html.
async function write_page_html(tmpl, src) {
	const rendered = await generate_html(src)

	// prettier-ignore
	let html = tmpl
		.replace("%head%", rendered.head)
		.replace("%page%", `
			<div id="app">
				${rendered.html}
			</div>
			<script src="/app.js"></script>
		`)

	// TODO: This may or may not work for <pre> use cases.
	html = prettier.format(html, {
		...prettierrc,
		parser: "html",
	})

	await fs.mkdir("build", { recursive: true })
	await fs.writeFile(`build/${name(src)}.html`, html)
}

// write_svelte_js writes build/app.js.
async function write_svelte_js() {
	const result = await esbuild.build({
		bundle: true,
		define: {
			__DEV__: process.env.NODE_ENV !== "production",
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: ["src/main.js"],
		minify: process.env.NODE_ENV === "production",
		outfile: "build/app.js",
		plugins: [
			sveltePlugin({
				generate: "dom",
				hydratable: true,
			}),
		],
		sourcemap: true,
	})
	if (result.errors && result.errors.length > 0) {
		console.error(result.errors)
	}
	if (result.warnings && result.warnings.length > 0) {
		console.warn(result.warnings)
	}
}

async function copyPublicToBuild() {
	await fs.rmdir("build", { recursive: true })
	await exec("cp -r public build")
	await fs.unlink("build/index.html")
}

async function run() {
	const tmpl = (await fs.readFile("public/index.html")).toString()

	await copyPublicToBuild()

	const chain = []
	for (const each of await fs.readdir("src/pages")) {
		chain.push(
			new Promise(async () => {
				await write_page_html(tmpl, path.join("src/pages", each))
			}),
		)
	}
	chain.push(
		new Promise(async () => {
			await write_svelte_js()
		}),
	)

	await Promise.all(chain)
}

run()
