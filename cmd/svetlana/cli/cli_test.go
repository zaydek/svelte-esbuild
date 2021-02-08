package cli

import (
	"testing"

	"github.com/zaydek/svetlana/pkg/expect"
)

func TestStart(t *testing.T) {
	var cmd StartCommand

	cmd = parseStartArguments()
	expect.DeepEqual(t, cmd, StartCommand{
		Cached:   false,
		Prettier: false,
		Port:     8000,
	})

	cmd = parseStartArguments("--cached")
	expect.DeepEqual(t, cmd, StartCommand{
		Cached:   true,
		Prettier: false,
		Port:     8000,
	})

	cmd = parseStartArguments("--prettier")
	expect.DeepEqual(t, cmd, StartCommand{
		Cached:   false,
		Prettier: true,
		Port:     8000,
	})

	cmd = parseStartArguments("--port=8080")
	expect.DeepEqual(t, cmd, StartCommand{
		Cached:   false,
		Prettier: false,
		Port:     8080,
	})

	cmd = parseStartArguments("--cached", "--prettier", "--port=8080")
	expect.DeepEqual(t, cmd, StartCommand{
		Cached:   true,
		Prettier: true,
		Port:     8080,
	})
}

func TestBuild(t *testing.T) {
	var cmd BuildCommand

	cmd = parseBuildArguments()
	expect.DeepEqual(t, cmd, BuildCommand{
		Cached:   false,
		Prettier: false,
	})

	cmd = parseBuildArguments("--cached")
	expect.DeepEqual(t, cmd, BuildCommand{
		Cached:   true,
		Prettier: false,
	})

	cmd = parseBuildArguments("--prettier")
	expect.DeepEqual(t, cmd, BuildCommand{
		Cached:   false,
		Prettier: true,
	})

	cmd = parseBuildArguments("--cached", "--prettier")
	expect.DeepEqual(t, cmd, BuildCommand{
		Cached:   true,
		Prettier: true,
	})
}

func TestServe(t *testing.T) {
	var cmd ServeCommand

	cmd = parseServeArguments()
	expect.DeepEqual(t, cmd, ServeCommand{Port: 8000})

	cmd = parseServeArguments("--port=8080")
	expect.DeepEqual(t, cmd, ServeCommand{Port: 8080})
}
