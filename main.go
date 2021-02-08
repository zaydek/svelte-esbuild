package main

import (
	"fmt"
	"io/ioutil"
	"os/exec"
)

func main() {
	bstr, err := ioutil.ReadFile("services/pages.js")
	if err != nil {
		panic(err)
	}

	cmd := exec.Command("node")
	// cmd.Dir = "services"

	stdinPipe, err := cmd.StdinPipe()
	if err != nil {
		panic(err)
	}

	go func() {
		defer stdinPipe.Close()
		stdinPipe.Write(bstr)
	}()

	out, err := cmd.CombinedOutput()
	if err != nil {
		panic(string(out))
	}
	fmt.Println(string(out))
}
