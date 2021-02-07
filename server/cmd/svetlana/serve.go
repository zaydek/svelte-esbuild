package main

import (
	"fmt"
	"net/http"
	"os"
	"path"
	"strconv"
	"time"
)

func check(err error) {
	if err == nil {
		// No-op
		return
	}
	panic(err)
}

func main() {
	port := 8000
	if envport, _ := strconv.Atoi(os.Getenv("PORT")); envport != 0 {
		port = envport
	}

	go func() {
		time.Sleep(100 * time.Millisecond)
		fmt.Printf("✅ http://localhost:%d\n", port)
	}()

	fs := http.FileServer(http.Dir("build"))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if path.Ext(r.URL.Path) == "" {
			r.URL.Path += ".html"
		}
		fs.ServeHTTP(w, r)
	})
	check(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
