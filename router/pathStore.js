import { writable } from "svelte/store"

function createStore() {
	const path = typeof window === "undefined" ? "/" : window.location.pathname

	const store = writable({
		key: Date.now(),
		path,
	})

	if (typeof window !== "undefined") {
		window.addEventListener("popstate", () => {
			store.set({
				key: Date.now(),
				path: window.location.pathname,
			})
		})
	}
	return store
}

export default createStore()
