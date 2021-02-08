package env

import (
	_ "embed"
	"os"
	"testing"

	"github.com/zaydek/svetlana/pkg/expect"
)

type Test struct {
	got  string
	want string
}

func TestVersion(t *testing.T) {
	text := `
+---------------------------+
| SVELTE           | v3.0.0 |
| SVETLANA_VERSION | v0.0.1 |
+---------------------------+
`

	SetEnvVars(text)

	tests := []Test{
		{got: os.Getenv("SVELTE"), want: "v3.0.0"},
		{got: os.Getenv("SVETLANA_VERSION"), want: "v0.0.1"},
	}
	for _, test := range tests {
		expect.DeepEqual(t, test.got, test.want)
	}
}

func TestLatest(t *testing.T) {
	text := `
+---------------------------+
| SVELTE           | latest |
| SVETLANA_VERSION | latest |
+---------------------------+
`

	SetEnvVars(text)

	tests := []Test{
		{got: os.Getenv("SVELTE"), want: "latest"},
		{got: os.Getenv("SVETLANA_VERSION"), want: "latest"},
	}
	for _, test := range tests {
		expect.DeepEqual(t, test.got, test.want)
	}
}
