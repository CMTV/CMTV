import chalk from "chalk";

import { BUILD_CONFIG } from "src/BuildConfig";

// Процессы
import { Page_Project } from "src/process/site/Page_Project";
import { Page_Life } from "src/process/site/Page_Life";
import { SiteBase } from "src/process/site/SiteBase";
import { Page_Year } from "src/process/site/Page_Year";
import { SITEMAP, WriteSitemap } from "src/process/site/Sitemap";
import { Page_Index } from "src/process/site/Page_Index";
import { Page_Projects } from "src/process/site/Page_Projects";
import { SearchGroup } from "src/process/site/search/SearchGroup";
import { UtilDb } from "src/util/Db";
import { ACTION_PRESET } from "src/process/data/ActionPreset";

export function makeSite()
{
    console.log('\n' + chalk.bold.magenta(`Запуск ${BUILD_CONFIG.devMode ? 'dev-' : ''}сборки сайта!`));
    
    UtilDb.requestDb();

    SITEMAP.reset();

    (new SiteBase).run();

    if (!BUILD_CONFIG.makeWholeSite())
    {
        (new Page_Project).run();
        console.log('\n' + chalk.magenta('Сборка сайта завершена!'));
        return;
    }

    (new Page_Projects).run();
    (new Page_Project).run();

    (new Page_Life).run();
    (new Page_Year).run();

    (new Page_Index).run();

    //(new Page_Test).run();

    (new SearchGroup).run();

    if (!BUILD_CONFIG.devMode)
        (new WriteSitemap).run();

    console.log('\n' + chalk.magenta('Сборка сайта завершена!'));
}