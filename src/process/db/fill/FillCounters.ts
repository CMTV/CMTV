import { Process } from "@cmtv/processes";
import { Db } from "sqlean";

import { DataCounters } from "src/entity/counter/data";
import { DbCounter } from "src/entity/counter/db";
import { IO } from "src/util/IO";

export class FillCounters extends Process
{
    processName = () => 'Добавление счетчиков';

    process()
    {
        let dbCounters: DbCounter[] = [];
        let rawCounters = JSON.parse(IO.readFile('data/counters.json')) as DataCounters;

        Object.keys(rawCounters).forEach((counterId, i) =>
        {
            let rawCounter = rawCounters[counterId];

            let dbCounter = new DbCounter;
                dbCounter.counterId =     counterId;
                dbCounter.icon =          rawCounter.icon;
                dbCounter.title =         rawCounter.title;
                dbCounter.displayOrder =  i + 1;

            dbCounters.push(dbCounter);
        });

        Db.Transaction(() => dbCounters.forEach(counter => counter.save()));
    }
}