package svetlana

import (
	"text/template"

	"github.com/evanw/esbuild/pkg/api"
)

type Cmd uint8

const (
	CmdStart Cmd = iota
	CmdBuild
	CmdServe
)

type PageBasedRoute struct {
	SrcPath   string `json:"src_path"`  // pages/path/to/component.js
	DstPath   string `json:"dst_path"`  // build/path/to/component.html
	Path      string `json:"path"`      // path/to/component
	Component string `json:"component"` // Component
}

type DirectoryConfiguration struct {
	AssetDirectory string
	PagesDirectory string
	CacheDirectory string
	BuildDirectory string
}

type Runtime struct {
	// Unexported
	tmpl     *template.Template
	errors   []api.Message
	warnings []api.Message

	// Exported
	Command          interface{}
	DirConfiguration DirectoryConfiguration
	PageBasedRouter  []PageBasedRoute
}
