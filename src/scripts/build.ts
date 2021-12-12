import chalk from "chalk";

import { BuildConfig, SET_BUILD_CONFIG } from "src/BuildConfig";
import { Config, SET_CONFIG } from "src/Config";
import { IO } from "src/util/IO";
import { filldb } from "./filldb";
import { makeSite } from "./makeSite";

export function build(buildConfig: BuildConfig)
{
    let beginTime = Date.now();

    //#region BUILD ZONE
    //
    //

    SET_BUILD_CONFIG(buildConfig);

    let config = new Config;
        config.devMode = buildConfig.devMode;
    
    SET_CONFIG(config);

    //

    if (buildConfig.buildDb)
        filldb();

    if (buildConfig.buildSite)
        makeSite();

    //
    //
    //#endregion

    let endTime = Date.now();

    console.log('\n' + chalk.bgGreen.black(' Сборка завершена! ') + ' ' + chalk.gray((endTime - beginTime) + 'ms'));
    console.log();

    return;
}

//
//
//

export function argsToConfig(buildConfig: BuildConfig, args: string[])
{
    enum ArgFlag
    {
        Db =    '--db',
        Site =  '--site',
        Dev =   '--dev',
        Whole = '--whole'
    }

    buildConfig.devMode = args.includes(ArgFlag.Dev);
    buildConfig.whole = args.includes(ArgFlag.Whole);

    buildConfig.buildDb =   args.includes(ArgFlag.Db);
    buildConfig.buildSite = args.includes(ArgFlag.Site);

    if (!buildConfig.buildDb && !buildConfig.buildSite)
        buildConfig.buildDb = buildConfig.buildSite = true;

    //
    // Проекты для сборки: Все, Конкретные?
    //

    let projectIds = args.filter(arg => !Object.keys(ArgFlag).map(k => ArgFlag[k]).includes(arg));
    buildConfig.projects = projectIds.length > 0 ? projectIds : null;
}

export function showBanner()
{
    console.log();
    let art = IO.readFile('site/_layout/includes/art.html').split('\n').slice(3, -3).join('\n');
    console.log(art);
}

export function showFlags(buildConfig: BuildConfig)
{
    let str = '\n';
    
    let boolSymbol = (boolVal: boolean) => boolVal ? '✔️' : '❌';
    let flagStr = (label: string, boolVal: boolean) => chalk.bgWhiteBright.black(` ${label} ${boolSymbol(boolVal)} `) + ' ';

    str += flagStr('db',    buildConfig.buildDb);
    str += flagStr('site',  buildConfig.buildSite);
    str += flagStr('dev',   buildConfig.devMode);
    str += flagStr('whole', buildConfig.makeWholeSite());

    console.log(str);
}

export function showMessages(buildConfig: BuildConfig)
{
    if (buildConfig.devMode)
        console.log('\n' + chalk.bgYellow.black(' РЕЖИМ РАЗРАБОТЧИКА! '));

    if (buildConfig.projects)
        console.log('\n' + chalk.bgYellow.black(' ПРОЕКТЫ ') + ' ' + chalk.yellow(buildConfig.projects.join(chalk.gray(', '))));
}