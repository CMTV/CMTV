import chalk from "chalk";
import { Db } from "sqlean";

// Процессы
import { CreateFromScheme } from "src/process/db/CreateFromScheme";
import { FillCounters } from "src/process/db/fill/FillCounters";
import { FillTags } from "src/process/db/fill/FillTags";
import { ProjectsGroup } from "src/process/db/fill/project/ProjectsGroup";
import { GoalsGroup } from "src/process/db/fill/goal/GoalsGroup";
import { ReportGroup } from "src/process/db/fill/report/ReportsGroup";

console.log('\n' + chalk.bold.magenta('Начат процесс заполнения базы данных!'));

(new CreateFromScheme).run();

Db.Open('data/db/data.db');

(new FillTags).run();
(new FillCounters).run();

(new ProjectsGroup).run();
(new GoalsGroup).run();

(new ReportGroup).run();

console.log('\n' + chalk.magenta('База данных заполнена!'));