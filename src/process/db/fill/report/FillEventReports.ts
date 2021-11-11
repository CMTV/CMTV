import { Db } from "sqlean";

import { YearsProcess } from "../life/YearsProcess";
import { DbEventReport } from "src/entity/report/db";
import { UtilDataReport } from "src/entity/report/data";

export class FillEventReports extends YearsProcess
{
    processName = () => 'Добавление значимых событий';

    process()
    {
        let dbEventReports: DbEventReport[] = [];
        let reportId = 1;

        this.years.forEach(year =>
        {
            let yearReports = UtilDataReport.getYearReports(year);

            if (!yearReports) return;

            Object.keys(yearReports).forEach(date =>
            {
                let rawReport = yearReports[date];
                if (!rawReport.events) return;

                this.stage = `Обработка даты: ${date}`;

                rawReport.events.forEach(rawEventReport =>
                {
                    let dbEventReport = new DbEventReport;
                        dbEventReport.reportId =  reportId++;
                        dbEventReport.date =      date;
                        dbEventReport.title =     rawEventReport.title;
                        dbEventReport.desc =      rawEventReport.desc;
                    
                    dbEventReports.push(dbEventReport);
                });
            });
        });

        Db.Transaction(() => dbEventReports.forEach(report => report.save()));
    }
}