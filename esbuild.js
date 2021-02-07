const fs = require("fs")
const path = require("path")
const prettier = require("prettier")

// https://michelelarson.com/prettier-config
const prettierrc = {
	printWidth: 9999,
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: false,
	trailingComma: "all",
	bracketSpacing: true,
	jsxBracketSameLine: false,
	arrowParens: "avoid",
	proseWrap: "always",
}

// https://esbuild.github.io/plugins/#svelte-plugin
let sveltePlugin = (options = {}) => ({
	name: "svelte",
	setup(build) {
		const svelte = require("svelte/compiler")
		const path = require("path")
		const fs = require("fs")

		build.onLoad({ filter: /\.svelte$/ }, async args => {
			const convert_svelte_message_to_esbuild = ({ message, start, end }) => {
				let location
				if (start && end) {
					const lineText = source.split(/\r\n|\r|\n/g)[start.line - 1]
					const lineEnd = start.line === end.line ? end.column : lineText.length
					location = {
						file: filename,
						line: start.line,
						column: start.column,
						length: lineEnd - start.column,
						lineText,
					}
				}
				return { text: message, location }
			}

			// See https://github.com/sveltejs/svelte/issues/189.
			const source = await fs.promises.readFile(args.path, "utf8")
			const filename = path.relative(process.cwd(), args.path)

			try {
				let { js, warnings } = svelte.compile(source, {
					...options,
					filename,
				})
				let contents = js.code + `//# sourceMappingURL=` + js.map.toUrl()
				return { contents, warnings: warnings.map(convert_svelte_message_to_esbuild) }
			} catch (e) {
				return { errors: [convert_svelte_message_to_esbuild(e)] }
			}
		})
	},
})

function name(src) {
	return path.basename(src).slice(0, -path.extname(src).length)
}

// generate_html generates HTML from a src path. This is an intermediary step
// for write_page_html.
async function generate_html(src) {
	const result = await require("esbuild").build({
		bundle: true,
		define: {
			__DEV__: process.env.NODE_ENV !== "production",
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: [src],
		format: "cjs", // Must use "cjs" here
		minify: false, // No need; this is an intermediary build step
		outfile: `__cache__/${name(src)}.esbuild.js`,
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
	const Component = require(`./__cache__/${name(src)}.esbuild.js`).default
	return Component.render()
}

// // prettier-ignore
// function clean(str) {
// 	return str
// 		.replace(/></g, ">\n\t\t<")
// 		.replace(/\/>/g, " />")
// }

// write_page_html writes a page from an HTML template and a src path. Pages are
// written to public/build/*.html.
async function write_page_html(tmpl, src) {
	const rendered = await generate_html(src)

	// prettier-ignore
	let html = tmpl
		.replace("%head%", rendered.head)
		.replace("%page%", `
			<div id="root">
				${rendered.html}
			</div>
			<script src="/app.js"></script>
		`)

	// TODO: Add guard here.
	// TODO: This may or may not work for <pre> use cases.
	html = prettier.format(html, {
		...prettierrc,
		parser: "html",
	})

	await fs.promises.mkdir("public/build", { recursive: true })
	await fs.promises.writeFile(`public/build/${name(src)}.html`, html)
}

// write_app_js writes public/build/app.js.
async function write_app_js() {
	const result = await require("esbuild").build({
		bundle: true,
		define: {
			__DEV__: process.env.NODE_ENV !== "production",
			NODE_ENV: process.env.NODE_ENV,
		},
		entryPoints: ["src/main.js"],
		minify: process.env.NODE_ENV === "production", // Inverse to __DEV__
		outfile: "public/build/app.js",
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

async function run() {
	const tmpl = (await fs.promises.readFile("public/index.html")).toString()

	await fs.promises.rmdir("public/build", { recursive: true })
	const list = await fs.promises.readdir("src/pages")
	for (const each of list) {
		await write_page_html(tmpl, path.join("src/pages", each))
	}
	await write_app_js()
}

run()
