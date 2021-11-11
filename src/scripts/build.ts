import chalk from "chalk";
import { Db } from "sqlean";

import { Config, SET_CONFIG } from "src/Config";

// Процессы
import { Page_Project } from "src/process/site/Page_Project";
import { Page_Life } from "src/process/site/Page_Life";
import { SiteBase } from "src/process/site/SiteBase";
import { Page_Year } from "src/process/site/Page_Year";
import { SITEMAP, WriteSitemap } from "src/process/site/Sitemap";
import { Page_Index } from "src/process/site/Page_Index";
import { Page_Projects } from "src/process/site/Page_Projects";
import { SearchGroup } from "src/process/site/search/SearchGroup";

Db.Open('data/db/data.db');

export function build(devMode = false)
{
    let config = new Config;
        config.devMode = devMode;

    SET_CONFIG(config);

    SITEMAP.reset();

    console.log('\n' + chalk.bold.magenta(`Запуск ${devMode ? 'dev-' : ''}сборки сайта!`));

    (new SiteBase).run();

    (new Page_Index).run();

    (new Page_Projects).run();
    (new Page_Project).run();

    (new Page_Life).run();
    (new Page_Year).run();

    //(new Page_Test).run();

    (new SearchGroup).run();

    if (!devMode)
        (new WriteSitemap).run();

    console.log('\n' + chalk.magenta('Сборка завершена!'));
}

if (process.argv[2] === '--do')
    build();