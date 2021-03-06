import pug from "pug";
import * as esbuild from "esbuild";
import sass from "sass";

import { BUILD_CONFIG } from "src/BuildConfig";
import { IO } from "./IO";

export class Layout
{
    static render(src: string, view: any)
    {
        let baseDir = IO.normalize('site/_layout');
        let srcPath = IO.normalize(`${baseDir}/${src}`);

        let pugOptions: pug.Options =
        {
            filename:   srcPath,
            basedir:    baseDir,
            cache:      !BUILD_CONFIG.devMode
        }

        return pug.renderFile(srcPath, {...pugOptions, ...view});
    }

    static compile(src: string, view: any, dest: string)
    {
        let html =      this.render(src, view);
        let destPath =  IO.normalize('dist/' + dest);

        IO.writeFile(destPath, html);

        if (BUILD_CONFIG.devMode)
            IO.writeFile(destPath + '.json', JSON.stringify(view, null, 4));
    }
}

export class Script
{
    static build(src: string, dest: string)
    {
        let srcPath =   IO.normalize('site/_scripts/' + src);
        let destPath =  IO.normalize('dist/site/scripts/' + dest);

        esbuild.buildSync({
            entryPoints:    [srcPath],
            outfile:        destPath,
            sourcemap:      BUILD_CONFIG.devMode,
            minify:         !BUILD_CONFIG.devMode,
            charset:        'utf8',
            bundle:         true
        });
    }
}

export class Style
{
    static build(src: string, dest: string)
    {
        let srcPath =   IO.normalize('site/_styles/' + src);
        let destPath =  IO.normalize('dist/site/styles/' + dest);

        let cssObj = sass.renderSync({
            file:           srcPath,
            outFile:        destPath,
            outputStyle:    BUILD_CONFIG.devMode ? 'expanded' : 'compressed',
            sourceMap:      BUILD_CONFIG.devMode,
            includePaths:   ['site/_styles']
        });

        IO.writeFile(destPath, cssObj.css);

        if (BUILD_CONFIG.devMode)
            IO.writeFile(destPath + '.map', cssObj.map);
    }
}