import { writable } from "svelte/store"

function createStore() {
	const path = typeof window === "undefined" ? "/" : window.location.pathname

	const store = writable(path)
	if (typeof window !== "undefined") {
		window.addEventListener("popstate", () => {
			store.set(window.location.pathname)
		})
	}
	return store
}

export default createStore()
