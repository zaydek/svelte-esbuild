package svetlana

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	p "path"

	"github.com/evanw/esbuild/pkg/api"
	"github.com/zaydek/svetlana/pkg/loggers"
	"github.com/zaydek/svetlana/pkg/perm"
	"github.com/zaydek/svetlana/pkg/run"
)

// renderedPagesMap describes a map of rendered pages.
type renderedPagesMap map[string]struct {
	*PageBasedRoute
	Page string `json:"page"`
}

type pagesResponse struct {
	Errors   []api.Message    `json:"errors"`
	Warnings []api.Message    `json:"warnings"`
	Data     renderedPagesMap `json:"data"`
}

func renderPages(runtime Runtime) (pagesResponse, error) {
	bstr, err := ioutil.ReadFile("scripts/pages.js")
	if err != nil {
		return pagesResponse{}, err
	}

	rstr, err := json.MarshalIndent(runtime, "", "\t")
	if err != nil {
		return pagesResponse{}, err
	}

	var buf bytes.Buffer
	buf.Write(bstr)
	buf.Write([]byte("\n"))
	buf.Write([]byte("run("))
	buf.Write(rstr)
	buf.Write([]byte(")"))
	buf.Write([]byte("\n")) // EOF

	stdout, err := run.Cmd(buf.Bytes(), "node")
	if err != nil {
		return pagesResponse{}, err
	}

	var response pagesResponse
	if err := json.Unmarshal(stdout, &response); err != nil {
		return pagesResponse{}, err
	}

	// TODO
	if len(response.Errors) > 0 {
		return pagesResponse{}, errors.New(response.Errors[0].Text)
	} else if len(response.Warnings) > 0 {
		return pagesResponse{}, errors.New(response.Warnings[0].Text)
	}
	return response, nil
}

func renderAppToDisk(runtime Runtime) error {
	bstr, err := ioutil.ReadFile("scripts/app.js")
	if err != nil {
		return err
	}

	rstr, err := json.MarshalIndent(runtime, "", "\t")
	if err != nil {
		return err
	}

	var buf bytes.Buffer
	buf.Write(bstr)
	buf.Write([]byte("\n"))
	buf.Write([]byte("run("))
	buf.Write(rstr)
	buf.Write([]byte(")"))
	buf.Write([]byte("\n")) // EOF

	if _, err := run.Cmd(buf.Bytes(), "node"); err != nil {
		return err
	}
	return nil
}

func (r Runtime) Build() {
	must(copyAssetDirToBuildDir(r.DirConfiguration))

	pages, err := renderPages(r)
	must(err)

	for _, each := range pages.Data {
		if dir := p.Dir(each.DstPath); dir != "." {
			if err := os.MkdirAll(dir, perm.Directory); err != nil {
				loggers.ErrorAndEnd("An unexpected error occurred.\n\n" +
					err.Error())
			}
		}
		if err := ioutil.WriteFile(each.DstPath, []byte(each.Page), perm.File); err != nil {
			loggers.ErrorAndEnd("An unexpected error occurred.\n\n" +
				err.Error())
		}
	}

	must(renderAppToDisk(r))
}
