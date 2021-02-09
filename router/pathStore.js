import { writable } from "svelte/store"

export function removeHTML(path) {
	if (path.length > ".html".length && path.slice(-5) === ".html") {
		path = path.slice(0, -5)
	}
	return path
}

function createStore() {
	const store = writable({
		key: Date.now(),
		path: typeof window === "undefined" ? "/" : removeHTML(window.location.pathname),
	})
	if (typeof window !== "undefined") {
		window.addEventListener("popstate", () => {
			store.set({
				key: Date.now(),
				path: removeHTML(window.location.pathname),
			})
		})
	}
	return store
}

export default createStore()
