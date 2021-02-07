package main

import (
	_ "embed"
	"os"
	"strings"

	"github.com/zaydek/svetlana/server/cmd/svetlana"
)

func init() {
	//go:embed version.txt
	var v string
	os.Setenv("SVETLANA_VERSION", strings.TrimSpace(v))
}

func main() {
	svetlana.Run()
}
