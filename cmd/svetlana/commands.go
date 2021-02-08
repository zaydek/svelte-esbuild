package svetlana

import (
	"fmt"
	"net/http"
	"os"
	"path"
	"time"

	"github.com/zaydek/svetlana/pkg/loggers"
)

func (r Runtime) Start() {}
func (r Runtime) Build() {}

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