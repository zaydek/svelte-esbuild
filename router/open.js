import pathStore from "./pathStore.js"

export default function open(path, { scrollX, scrollY } = { scrollX: 0, scrollY: 0 }) {
	pathStore.set(path)

	// Dedupe pushState:
	if (window.location.pathname === path) {
		// No-op
		return
	}
	window.history.pushState({}, "", path)
	window.scrollTo(scrollX, scrollY)
}
