import { Db } from "sqlean";

import { YearsProcess } from "../life/YearsProcess";
import { UtilDataReport } from "src/entity/report/data";
import { DbCounterReport } from "src/entity/report/db";

export class FillCounterReports extends YearsProcess
{
    processName = () => 'Добавление значений счетчиков';

    process()
    {
        let dbCounterReports: DbCounterReport[] = [];
        let reportId = 1;

        this.years.forEach(year =>
        {
            let yearReports = UtilDataReport.getYearReports(year);

            if (!yearReports) return;

            Object.keys(yearReports).forEach(date =>
            {
                let rawReport = yearReports[date];
                if (!rawReport.counters) return;

                this.stage = `Обработка даты: ${date}`;
                
                rawReport.counters.forEach(rawCounterReport =>
                {
                    let dbCounterReport = new DbCounterReport;
                        dbCounterReport.reportId =    reportId++;
                        dbCounterReport.date =        date;
                        dbCounterReport.counterId =   rawCounterReport.counter;
                        dbCounterReport.value =       rawCounterReport.value || 1;
                        dbCounterReport.projectId =   rawCounterReport.project;
                        dbCounterReport.desc =        rawCounterReport.desc;
                    
                    dbCounterReports.push(dbCounterReport);
                });
            });
        });

        Db.Transaction(() => dbCounterReports.forEach(report => report.save()));
    }
}