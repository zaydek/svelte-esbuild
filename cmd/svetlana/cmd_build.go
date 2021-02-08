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

type pages map[string]struct {
	*PageBasedRoute
	Page string `json:"page"`
}

type srvResponse struct {
	Errors   []api.Message          `json:"errors"`
	Warnings []api.Message          `json:"warnings"`
	Data     map[string]interface{} `json:"data"`
}

type srvPagesResponse struct {
	Errors   []api.Message `json:"errors"`
	Warnings []api.Message `json:"warnings"`
	Data     pages         `json:"data"`
}

func renderPages(runtime Runtime) (srvPagesResponse, error) {
	bstr, err := ioutil.ReadFile("scripts/pages.js")
	if err != nil {
		return srvPagesResponse{}, err
	}

	rstr, err := json.MarshalIndent(runtime, "", "\t")
	if err != nil {
		return srvPagesResponse{}, err
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
		return srvPagesResponse{}, err
	}

	var response srvPagesResponse
	if err := json.Unmarshal(stdout, &response); err != nil {
		return srvPagesResponse{}, err
	}

	// TODO
	if len(response.Errors) > 0 {
		return srvPagesResponse{}, errors.New(response.Errors[0].Text)
	} else if len(response.Warnings) > 0 {
		return srvPagesResponse{}, errors.New(response.Warnings[0].Text)
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

	stdout, err := run.Cmd(buf.Bytes(), "node")
	if err != nil {
		return err
	}

	var response srvResponse
	if err := json.Unmarshal(stdout, &response); err != nil {
		return err
	}

	// TODO
	if len(response.Errors) > 0 {
		return errors.New(response.Errors[0].Text)
	} else if len(response.Warnings) > 0 {
		return errors.New(response.Warnings[0].Text)
	}
	return nil
}

func (r Runtime) Build() {
	if err := copyAssetDirToBuildDir(r.DirConfiguration); err != nil {
		loggers.ErrorAndEnd("An unexpected error occurred.\n\n" +
			err.Error())
	}

	pages, err := renderPages(r)
	if err != nil {
		loggers.ErrorAndEnd("An unexpected error occurred.\n\n" +
			err.Error())
	}

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

	if err := renderAppToDisk(r); err != nil {
		loggers.ErrorAndEnd("An unexpected error occurred.\n\n" +
			err.Error())
	}
}
