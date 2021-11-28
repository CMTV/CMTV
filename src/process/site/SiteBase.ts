import { Process, ProcessGroup } from "@cmtv/processes";
import { glob } from "glob";

import * as pre from "src/util/preprocessor";
import { IO } from "src/util/IO";
import { BUILD_CONFIG } from "src/BuildConfig";

export class SiteBase extends ProcessGroup
{
    groupName = () => 'База сайта';

    processes()
    {
        return [
            new ResetDist,
            new MoveSiteFiles,

            new Scripts,
            new Styles
        ]
    }
}

//
//
//

class ResetDist extends Process
{
    processName = () => `Очистка папки 'dist'`;

    process()
    {
        IO.clearDir('dist');
    }
}

class MoveSiteFiles extends Process
{
    processName = () => 'Перемещение неизменяемых файлов сайта';

    process()
    {
        let ignorePatterns = ['_*/**', '**/_*'];
        
        let siteFiles = glob.sync(
            'site/**/*',
            {
                ignore: ignorePatterns.map(pattern => 'site/' + pattern),
                nodir: true
            }
        );

        let rootFiles = glob.sync(
            'site/_root/**/*',
            {
                ignore: ignorePatterns.map(pattern => 'site/_root/' + pattern),
                nodir: true
            }
        );

        //

        siteFiles.forEach(siteFile => IO.copyFile(siteFile, 'dist/' + siteFile));
        rootFiles.forEach(rootFile => IO.copyFile(rootFile, 'dist/' + rootFile.replace('site/_root/', '')));

        // Перемещение иконки сайта в корневую директорию

        IO.copyFile('site/graphics/favicon/favicon.ico', 'dist/favicon.ico');
    }
}

class Scripts extends Process
{
    processName = () => 'Скрипты';

    process()
    {
        this.buildGlobalScripts();
        this.buildPageScripts();
        this.buildWorkers();
    }

    buildGlobalScripts()
    {
        this.stage = 'Глобальные скрипты';
        pre.Script.build('global/global.ts', 'global.js');
    }

    buildPageScripts()
    {
        glob.sync('site/_scripts/pages/*').forEach(pageScriptFile =>
        {
            let pageName = pageScriptFile.split('/').pop().replace('.ts', '');

            if (!BUILD_CONFIG.makeWholeSite() && pageName !== 'project')
                return;

            this.stage = 'Скрипты страницы ' + pageName;

            pageScriptFile = pageScriptFile.replace('site/_scripts', '');
            pre.Script.build(pageScriptFile, pageName + '.js');
        });
    }

    buildWorkers()
    {
        glob.sync('site/_scripts/workers/*.ts').forEach(worker =>
        {
            worker = worker.replace('site/_scripts', '');
            pre.Script.build(worker, worker.replace('.ts', '.js'));
        });
    }
}

class Styles extends Process
{
    processName = () => 'Стили';

    process()
    {
        this.buildGlobalStyles();
        this.buildPagesStyles();
    }

    buildGlobalStyles()
    {
        this.stage = 'Глобальные стили';
        pre.Style.build('global/global.scss', 'global.css');
    }

    buildPagesStyles()
    {
        glob.sync('site/_styles/pages/*').forEach(pageStyleFile =>
        {
            let pageName = pageStyleFile.split('/').pop().replace('.scss', '');

            if (!BUILD_CONFIG.makeWholeSite() && pageName !== 'project')
                return;

            this.stage = 'Стиль страницы ' + pageName;

            pageStyleFile = pageStyleFile.replace('site/_styles/', '');
            pre.Style.build(pageStyleFile, pageName + '.css');
        });
    }
}