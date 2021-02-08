import store_path from "./store_path.js"

export default function open(path, { scrollX, scrollY } = { scrollX: 0, scrollY: 0 }) {
	scrollX = scrollX || 0
	scrollY = scrollY || 0

	store_path.set(path)
	window.history.pushState({}, "", path)
	window.scrollTo(scrollX, scrollY)
}
