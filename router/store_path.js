import { onDestroy, onMount } from "svelte"
import { writable } from "svelte/store"

function getCurrentPath() {
	if (typeof window === "undefined") {
		return "/"
	}
	// return window.location.pathname === "/" ? "*" :
	// 	window.location.pathname
	return window.location.pathname
}

if (typeof window !== "undefined") {
	window.addEventListener("popstate", () => {
		store.set(window.location.pathname)
	})
}

const store = writable(getCurrentPath())
export default store
