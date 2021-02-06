package main

import (
	"fmt"
	"net/http"
	"os"
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

	http.Handle("/", http.FileServer(http.Dir("public/build")))
	check(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
