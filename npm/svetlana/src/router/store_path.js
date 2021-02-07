import { writable } from "svelte/store"

function resolvePath() {
	if (window.location.pathname === "/") {
		return "*"
	}
	return window.location.pathname
}

export default writable(resolvePath())
