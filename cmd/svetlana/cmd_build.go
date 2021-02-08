package svetlana

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"os/exec"
	p "path"

	"github.com/evanw/esbuild/pkg/api"
	"github.com/zaydek/svetlana/pkg/loggers"
	"github.com/zaydek/svetlana/pkg/perm"
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

// TODO: Add better support for stdout, stderr.
func renderPages(runtime Runtime) (pagesResponse, error) {
	bstr, err := ioutil.ReadFile("scripts/pages.js")
	if err != nil {
		return pagesResponse{}, err
	}

	rstr, err := json.MarshalIndent(runtime, "", "\t")
	if err != nil {
		return pagesResponse{}, err
	}

	cmd := exec.Command("node")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return pagesResponse{}, err
	}

	go func() {
		defer stdin.Close()
		stdin.Write(bstr)
		stdin.Write([]byte("\n"))
		stdin.Write([]byte("run("))
		stdin.Write(rstr)
		stdin.Write([]byte(")"))
		stdin.Write([]byte("\n")) // EOF
	}()

	out, err := cmd.CombinedOutput()
	if err != nil {
		// TODO
		if len(out) > 0 {
			return pagesResponse{}, errors.New(string(out))
		}
		return pagesResponse{}, err
	}

	var response pagesResponse
	if err := json.Unmarshal(out, &response); err != nil {
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

func (r Runtime) Build() {
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
}
