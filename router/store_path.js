import { writable } from "svelte/store"

// prettier-ignore
function getCurrentPath() {
	if (typeof window === "undefined") {
		return "/"
	}
	// return window.location.pathname === "/" ? "*" :
	// 	window.location.pathname
	return window.location.pathname
}

// export default writable(typeof window === "undefined" ? "/" : window.location.pathname)
export default writable(getCurrentPath())
