unsolved problems

- cache folder
- build folder
- html template
- server-side hydration
- client-side bundle
- whitespace (prettier)
- esbuild + svelte
- esbuild plugin architecture (use esbuild / js as the main process, requires esbuild as a dev dependency if we do this)
- serve command
- watch command - we basically know how to do this in theory and since svelte is a compiler, error messaging should be
  even easier
- router (App5)
- page props (defer 0.2) (supportable with context="module")
- dynamic routes (defer 0.2) (supportable with context="module")
- layout components -- instead of wrapping routes children wrap routes; this can also work for nested layout componetns

* layout reset? (so we use an array that recursively renders itself, where resets is basically an override)
* do we want to support csr routes? definitely not for 0.1
* markdown?
