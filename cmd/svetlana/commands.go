package svetlana

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path"
	"time"

	"github.com/zaydek/svetlana/pkg/loggers"
)

func (r Runtime) Start() {}

func (r Runtime) Build() {
	srcbstr, err := ioutil.ReadFile("services/pages.js")
	must(err)

	runbstr, err := json.MarshalIndent(r, "", "\t")
	must(err)

	cmd := exec.Command("node")
	stdinPipe, err := cmd.StdinPipe()
	must(err)

	go func() {
		defer stdinPipe.Close()
		stdinPipe.Write(srcbstr)
		stdinPipe.Write([]byte("\n"))
		stdinPipe.Write([]byte("run("))
		stdinPipe.Write(runbstr)
		stdinPipe.Write([]byte(")"))
		stdinPipe.Write([]byte("\n")) // EOF
	}()

	out, err := cmd.CombinedOutput()
	if err != nil {
		panic(string(out))
	}

	var m map[string]interface{}
	must(json.Unmarshal(out, &m))
	fmt.Print(m["data"].(map[string]interface{})["/"])
	fmt.Print(m["data"].(map[string]interface{})["/nested/"])
}

func (r Runtime) Serve() {
	if _, err := os.Stat(r.DirConfiguration.BuildDirectory); os.IsNotExist(err) {
		loggers.ErrorAndEnd("It looks like you’re trying to run `svetlana serve` but you haven’t run `svetlana build` yet. " +
			"Try `svetlana build && svetlana serve`.")
	}

	go func() {
		time.Sleep(100 * time.Millisecond)
		loggers.OK(fmt.Sprintf("http://localhost:%s", r.getPort()))
	}()

	// http.Handle("/", http.FileServer(http.Dir(r.DirConfiguration.BuildDirectory)))
	fs := http.FileServer(http.Dir(r.DirConfiguration.BuildDirectory))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if path.Ext(r.URL.Path) == "" {
			r.URL.Path += ".html"
		}
		fs.ServeHTTP(w, r)
	})
	must(http.ListenAndServe(":"+r.getPort(), nil))
}
