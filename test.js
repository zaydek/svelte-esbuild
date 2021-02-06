// https://esbuild.github.io/plugins/#svelte-plugin
let sveltePlugin = (options = {}) => ({
	name: "svelte",
	setup(build) {
		let svelte = require("svelte/compiler")
		let path = require("path")
		let fs = require("fs")

		build.onLoad({ filter: /\.svelte$/ }, async args => {
			let convertMessage = ({ message, start, end }) => {
				let location
				if (start && end) {
					let lineText = source.split(/\r\n|\r|\n/g)[start.line - 1]
					let lineEnd = start.line === end.line ? end.column : lineText.length
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

			let source = await fs.promises.readFile(args.path, "utf8")
			let filename = path.relative(process.cwd(), args.path)

			try {
				let { js, warnings } = svelte.compile(source, {
					...options,
					filename,
				})
				let contents = js.code + `//# sourceMappingURL=` + js.map.toUrl()
				return { contents, warnings: warnings.map(convertMessage) }
			} catch (e) {
				return { errors: [convertMessage(e)] }
			}
		})
	},
})

require("esbuild")
	.build({
		entryPoints: ["src/main.js"],
		bundle: true,
		outfile: "main.out.js",
		plugins: [
			sveltePlugin({
				generate: "dom",
				hydratable: true,
			}),
		],
	})
	.catch(() => process.exit(1))
