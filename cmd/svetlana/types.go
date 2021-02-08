package svetlana

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
	AssetDirectory string `json:"asset_directory"`
	PagesDirectory string `json:"pages_directory"`
	CacheDirectory string `json:"cache_directory"`
	BuildDirectory string `json:"build_directory"`
}

type Runtime struct {
	// // Unexported
	// errors   []api.Message
	// warnings []api.Message

	Command          interface{}            `json:"command"`
	DirConfiguration DirectoryConfiguration `json:"dir_config"`
	BaseHTML         string                 `json:"base_html"`
	PageBasedRouter  []PageBasedRoute       `json:"page_based_router"`
}
