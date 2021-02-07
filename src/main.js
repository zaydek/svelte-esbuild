import PageAvocado from "./pages/avocado.svelte"
import PageHello from "./pages/hello.svelte"
import PageImHungry from "./pages/im-hungry.svelte"
import PagePage from "./pages/page.svelte"
import PageWhatsNew from "./pages/whats-new.svelte"

function App(options) {
	switch (window.location.pathname) {
		case "/whats-new":
			return new PageWhatsNew(options)
		case "/page":
			return new PagePage(options)
		case "/im-hungry":
			return new PageImHungry(options)
		case "/hello":
			return new PageHello(options)
		case "/avocado":
			return new PageAvocado(options)
	}
	throw new Error(`bad path; path=${window.location.pathname}`)
}

export default new App({
	hydrate: true,
	target: document.getElementById("app"),
})
