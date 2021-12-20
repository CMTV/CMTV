import chalk from "chalk";
import { CheckLinks } from "src/process/check/CheckLinks";
import { UtilDb } from "src/util/Db";

export function check()
{
    console.log('\n' + chalk.bold.magenta('Запуск проверки данных сайта!'));

    let beginTime = Date.now();
    
    //#region CHECK ZONE
    //
    //

    UtilDb.requestDb();

    // Проверка ссылок
    (new CheckLinks).run();

    //
    //
    //#endregion

    let endTime = Date.now();

    console.log('\n' + chalk.bgGreen.black(' Проверка завершена! ') + ' ' + chalk.gray((endTime - beginTime) + 'ms'));
    console.log();
}