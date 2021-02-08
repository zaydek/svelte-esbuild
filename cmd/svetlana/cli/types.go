package cli

type StartCommand struct {
	Cached   bool `json:"cached"`
	Prettier bool `json:"prettier"`
	Port     int  `json:"port"`
}

type BuildCommand struct {
	Cached   bool `json:"cached"`
	Prettier bool `json:"prettier"`
}

type ServeCommand struct {
	Port int `json:"port"`
}
