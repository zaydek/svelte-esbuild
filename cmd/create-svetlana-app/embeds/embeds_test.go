package embeds

import (
	"bytes"
	"testing"

	"github.com/zaydek/svetlana/pkg/expect"
)

const want = `{
	"name": "app-name",
	"scripts": {
		"start": "svetlana start",
		"build": "svetlana build",
		"serve": "svetlana serve"
	},
	"dependencies": {
    "esbuild": "^0.8.42",
    "prettier": "^2.2.1",
    "svelte": "^3.32.1",
    "svetlana": "^1.33.7"
	}
}
`

func TestJavaScriptTemplate(t *testing.T) {
	dot := PkgDot{
		AppName:         "app-name",
		SvetlanaVersion: "1.33.7",
	}
	var buf bytes.Buffer
	if err := JSPkgTemplate.Execute(&buf, dot); err != nil {
		t.Fatal(err)
	}
	expect.DeepEqual(t, buf.String(), want)
}
