import chalk from "chalk";
import { Db, DB } from "sqlean";

import { IO } from "src/util/IO";

export class UtilDb
{
    static requestDb()
    {
        if (!DB._db)
        {
            if (!IO.exists('data/db/data.db'))
                throw new Error(chalk.bgRedBright.black(' БАЗА ДАННЫХ ОТСУТСТВУЕТ! '));

            Db.Open('data/db/data.db');
        }
    }
}