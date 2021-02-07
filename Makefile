SVETLANA_VERSION = $(shell cat version.txt)

################################################################################

bin-create-svetlana-app:
	go build -o=create-svetlana-app entry_create-svetlana-app.go && mv create-svetlana-app /usr/local/bin
	go build -o=create-sv-app entry_create-svetlana-app.go && mv create-sv-app /usr/local/bin

bin-svetlana:
	go build -o=svetlana entry_svetlana.go && mv svetlana /usr/local/bin
	go build -o=sv entry_svetlana.go && mv sv /usr/local/bin

bin:
	make -j2 \
		bin-create-svetlana-app \
		bin-svetlana

################################################################################

test-create-svetlana-app:
	go test ./cmd/create_SVETLANA_app/...

test-svetlana:
	go test ./cmd/svetlana/...

test-pkg:
	go test ./pkg/...

test:
	go test ./...

################################################################################

build-create-svetlana-app:
	GOOS=darwin  GOARCH=amd64 go build "-ldflags=-s -w" -o=npm/create-svetlana-app/bin/darwin-64 entry_create-svetlana-app.go
	GOOS=linux   GOARCH=amd64 go build "-ldflags=-s -w" -o=npm/create-svetlana-app/bin/linux-64 entry_create-svetlana-app.go
	GOOS=windows GOARCH=amd64 go build "-ldflags=-s -w" -o=npm/create-svetlana-app/bin/windows-64.exe entry_create-svetlana-app.go
	touch npm/create-svetlana-app/bin/create-svetlana-app

build-svetlana:
	GOOS=darwin  GOARCH=amd64 go build "-ldflags=-s -w" -o=npm/svetlana/bin/darwin-64 entry_svetlana.go
	GOOS=linux   GOARCH=amd64 go build "-ldflags=-s -w" -o=npm/svetlana/bin/linux-64 entry_svetlana.go
	GOOS=windows GOARCH=amd64 go build "-ldflags=-s -w" -o=npm/svetlana/bin/windows-64.exe entry_svetlana.go
	touch npm/svetlana/bin/svetlana

build:
	make -j2 \
		build-create-svetlana-app \
		build-svetlana \

################################################################################

version:
	cd npm/create-svetlana-app && npm version "$(SVETLANA_VERSION)" --allow-same-version
	cd npm/svetlana && npm version "$(SVETLANA_VERSION)" --allow-same-version

################################################################################

release-dry-run:
	cd npm/create-svetlana-app && npm publish --dry-run
	cd npm/svetlana && npm publish --dry-run

release:
	cd npm/create-svetlana-app && npm publish
	cd npm/svetlana && npm publish

################################################################################

clean:
	rm -rf npm/create-svetlana-app/bin npm/create-svetlana-app/dist
	rm -rf npm/svetlana/bin npm/svetlana/dist
