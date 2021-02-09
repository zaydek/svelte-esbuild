import { writable } from "svelte/store"

function canon(path) {
	if (path.slice(-5) === ".html") {
		path = path.slice(0, -5)
	}
	return path
}

function createStore() {
	const store = writable({
		key: Date.now(),
		path: typeof window === "undefined" ? "/" : canon(window.location.pathname),
	})
	if (typeof window !== "undefined") {
		window.addEventListener("popstate", () => {
			store.set({
				key: Date.now(),
				path: canon(window.location.pathname),
			})
		})
	}
	return store
}

export default createStore()
