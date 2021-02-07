package main

import (
	_ "embed"
	"os"
	"strings"

	create_svetlana_app "github.com/zaydek/svetlana/cmd/create-svetlana-app"
)

func init() {
	//go:embed version.txt
	var v string
	os.Setenv("SVETLANA_VERSION", strings.TrimSpace(v))
}

func main() {
	create_svetlana_app.Run()
}
