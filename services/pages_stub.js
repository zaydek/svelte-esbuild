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
