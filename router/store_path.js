import { writable } from "svelte/store"

// function getWindowPath() {
// 	if (typeof window === undefined) {
// 		return "/"
// 	}
// 	return window.location.pathname === "/" ? "*" : window.location.pathname
// }

// FIXME
export default writable("/")
