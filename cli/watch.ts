import chalk from "chalk";
import { BuildConfig } from "src/BuildConfig";
import { UtilDataProject } from "src/entity/project/data";
import { argsToConfig, build, showBanner, showFlags, showMessages } from "src/scripts/build";
import { IO } from "src/util/IO";

let args = process.argv.slice(2);
let buildConfig = new BuildConfig;

argsToConfig(buildConfig, args);

if (!buildConfig.projects)
    buildConfig.projects = UtilDataProject.getFeaturedIds().slice(0, 5);

showBanner();
showFlags(buildConfig);
showMessages(buildConfig);

console.log('\n' + chalk.bgCyanBright.black(' ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ... '));
console.log();

IO.watch(['data', 'site'], { ignored: 'data/db/data.db', awaitWriteFinish: true }, (e) =>
{
    console.log(chalk.bgMagentaBright.black(' ===== ПЕРЕСБОРКА ===== '));
    build(buildConfig);
});