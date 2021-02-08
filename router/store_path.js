import { writable } from "svelte/store"

function getCurrentPath() {
	if (typeof window === "undefined") {
		return "/"
	}
	// return window.location.pathname === "/" ? "*" :
	// 	window.location.pathname
	return window.location.pathname
}

export default writable(getCurrentPath())
