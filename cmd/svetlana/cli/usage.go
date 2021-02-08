package cli

import (
	"strings"

	"github.com/zaydek/svetlana/pkg/term"
)

var usageOnly = strings.TrimSpace(`
svetlana start  Starts the dev server
svetlana build  Builds the production-ready build (SSG)
svetlana serve  Serves the production-ready build
`)

var usage = `
  ` + term.Bold("Usage:") + `

    svetlana start     Starts the dev server
    svetlana build     Builds the production-ready build (SSG)
    svetlana serve     Serves the production-ready build

  ` + term.Bold("svetlana start") + `

    Starts the dev server

      --cached         Use cached resources (default false)
      --prettier       Format HTML (default false)
      --port=<number>  Port number (default 8000)

  ` + term.Bold("svetlana build") + `

    Builds the production-ready build (SSG)

      --cached         Use cached resources (default false)
      --prettier       Format HTML (default false)

  ` + term.Bold("svetlana serve") + `

    Serves the production-ready build

      --port=<number>  Port number (default 8000)

  ` + term.Bold("Repository:") + `

    ` + term.Underline("https://github.com/zaydek/svetlana") + `
`
