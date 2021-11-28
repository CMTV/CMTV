import chalk from "chalk";
import { DB, Db } from "sqlean";

// Процессы
import { CreateFromScheme } from "src/process/db/CreateFromScheme";
import { FillCounters } from "src/process/db/fill/FillCounters";
import { FillTags } from "src/process/db/fill/tag/FillTags";
import { ProjectsGroup } from "src/process/db/fill/project/ProjectsGroup";
import { GoalsGroup } from "src/process/db/fill/goal/GoalsGroup";
import { ReportGroup } from "src/process/db/fill/report/ReportsGroup";
import { FillTagCategories } from "src/process/db/fill/tag/FillTagCategories";

export function filldb()
{
    console.log('\n' + chalk.bold.magenta('Начат процесс заполнения базы данных!'));

    (new CreateFromScheme).run();

    if (!DB._db)
        Db.Open('data/db/data.db');

    (new FillTagCategories).run();
    (new FillTags).run();
    (new FillCounters).run();
    
    (new ProjectsGroup).run();
    (new GoalsGroup).run();
    
    (new ReportGroup).run();

    console.log('\n' + chalk.magenta('База данных заполнена!'));
}