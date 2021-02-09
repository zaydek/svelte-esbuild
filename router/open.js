import pathStore, { removeHTML } from "./pathStore.js"

export default function open(path, scrollTo = [0, 0]) {
	path = removeHTML(path)

	pathStore.set({
		key: Date.now(),
		path,
	})

	// Dedupe pushState:
	let route = () => window.history.pushState({}, "", path)
	if (window.location.pathname === path) {
		route = () => window.history.replaceState({}, "", path)
	}
	route()
	window.scrollTo(scrollTo[0], scrollTo[1])
}
