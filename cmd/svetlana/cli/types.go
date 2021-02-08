package cli

type StartCommand struct {
	Cached   bool
	Prettier bool
	Port     int
}

type BuildCommand struct {
	Cached   bool
	Prettier bool
}

type ServeCommand struct {
	Port int
}
