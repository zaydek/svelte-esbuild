package create_retro_app

import (
	"bytes"
	"fmt"
	"io"
	"io/fs"
	"io/ioutil"
	"os"
	p "path"

	"github.com/zaydek/retro/cmd/create_retro_app/embeds"
	"github.com/zaydek/retro/pkg/loggers"
	"github.com/zaydek/retro/pkg/perm"
	"github.com/zaydek/retro/pkg/term"
)

func (cmd Command) CreateRetroApp() {
	if cmd.Directory != "." {
		if info, err := os.Stat(cmd.Directory); !os.IsNotExist(err) {
			var typ string
			if !info.IsDir() {
				typ = "file"
			} else {
				typ = "directory"
			}
			loggers.ErrorAndEnd(fmt.Sprintf("Aborted. "+
				"A %s named `%[2]s` already exists. "+
				"Here’s what you can do:\n\n"+
				"- create-retro-app %[2]s\n\n"+
				"Or\n\n"+
				"- rm -r %[2]s && create-retro-app %[2]s",
				typ, cmd.Directory))
		}
		if err := os.MkdirAll(cmd.Directory, perm.Directory); err != nil {
			loggers.ErrorAndEnd("Aborted.\n\n" +
				err.Error())
		}
		if err := os.Chdir(cmd.Directory); err != nil {
			loggers.ErrorAndEnd("Aborted.\n\n" +
				err.Error())
		}
		defer os.Chdir("..")
	}

	fsys := embeds.JavaScriptFS
	if cmd.Template == "typescript" {
		fsys = embeds.TypeScriptFS
	}

	var paths []string
	if err := fs.WalkDir(fsys, ".", func(path string, dirEntry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !dirEntry.IsDir() {
			paths = append(paths, path)
		}
		return nil
	}); err != nil {
		loggers.ErrorAndEnd("Aborted.\n\n" +
			err.Error())
	}

	var badPaths []string
	for _, each := range paths {
		if _, err := os.Stat(each); !os.IsNotExist(err) {
			badPaths = append(badPaths, each)
		}
	}

	if len(badPaths) > 0 {
		var badPathsStr string
		for x, each := range badPaths {
			var sep string
			if x > 0 {
				sep = "\n"
			}
			badPathsStr += sep + "- " + term.Bold(each)
		}
		loggers.ErrorAndEnd("Aborted. " +
			"These paths must be removed or renamed. " +
			"Use `rm -r [paths]` to remove them or `mv [src] [dst]` to rename them.\n\n" +
			badPathsStr)
	}

	for _, each := range paths {
		if dir := p.Dir(each); dir != "." {
			if err := os.MkdirAll(dir, perm.Directory); err != nil {
				loggers.ErrorAndEnd("Aborted.\n\n" +
					err.Error())
			}
		}
		src, err := fsys.Open(each)
		if err != nil {
			loggers.ErrorAndEnd("Aborted.\n\n" +
				err.Error())
		}
		dst, err := os.Create(each)
		if err != nil {
			loggers.ErrorAndEnd("Aborted.\n\n" +
				err.Error())
		}
		if _, err := io.Copy(dst, src); err != nil {
			loggers.ErrorAndEnd("Aborted.\n\n" +
				err.Error())
		}
		src.Close()
		dst.Close()
	}

	appName := cmd.Directory
	if cmd.Directory == "." {
		cwd, _ := os.Getwd()
		appName = p.Base(cwd)
	}

	tmpl := embeds.JavaScriptPackageTemplate
	if cmd.Template == "typescript" {
		tmpl = embeds.TypeScriptPackageTemplate
	}

	dot := embeds.PackageDot{
		AppName:      appName,
		RetroVersion: os.Getenv("RETRO_VERSION"),
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, dot); err != nil {
		loggers.ErrorAndEnd("An unexpected error occurred.\n\n" +
			err.Error())
	}

	if err := ioutil.WriteFile("package.json", buf.Bytes(), perm.File); err != nil {
		loggers.ErrorAndEnd("An unexpected error occurred.\n\n" +
			err.Error())
	}

	if cmd.Directory == "." {
		loggers.OK(fmt.Sprintf(successFormat, appName))
	} else {
		loggers.OK(fmt.Sprintf(successDirectoryFormat, appName))
	}
}
