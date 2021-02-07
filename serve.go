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

	// http.Handle("/", http.FileServer(http.Dir("public/build")))

	fs := http.FileServer(http.Dir("public/build"))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if path.Ext(r.URL.Path) == "" {
			r.URL.Path += ".html"
		}
		fs.ServeHTTP(w, r)
	})

	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	// // Redirect *.html to *:
	// 	// if path.Ext(r.URL.Path) == ".html" {
	// 	// 	url := r.URL
	// 	// 	url.Path = url.Path[:len(url.Path)-len(".html")]
	// 	// 	http.Redirect(w, r, url.String(), 200)
	// 	// 	return
	// 	// }
	// 	// // Serve * (no .html) as *.html:
	// 	if path.Ext(r.URL.Path) == "" {
	// 		http.ServeFile(w, r, r.URL.Path+".html")
	// 		return
	// 	}
	// 	fmt.Println(r.URL.Path)
	// 	http.ServeFile(w, r, path.Join(elem ...string).URL.Path)
	// })

	// TODO: Serve public but negate build.
	check(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
