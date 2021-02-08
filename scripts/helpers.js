const path = require("path")

function no_ext(src) {
	const ext = path.extname(src)
	if (ext === "") {
		return src
	}
	return src.slice(0, -ext.length)
}

module.exports = { no_ext }
