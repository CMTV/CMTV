import { Db } from "sqlean";
import { BUILD_CONFIG } from "src/BuildConfig";

import { DbGoal } from "src/entity/goal/db";
import { UtilDataReport } from "src/entity/report/data";
import { DbCheckReport } from "src/entity/report/db";
import { YearsProcess } from "../life/YearsProcess";

export class FillCheckReports extends YearsProcess
{
    processName = () => 'Добавление дневных отметок по целям';

    process()
    {
        let dbCheckReports: DbCheckReport[] = [];
        let reportId = 1;

        this.years.forEach(year =>
        {
            let yearReports = UtilDataReport.getYearReports(year);

            if (!yearReports) return;

            Object.keys(yearReports).forEach(date =>
            {
                let rawReport = yearReports[date];
                if (!rawReport.checks) return;

                this.stage = `Обработка даты: ${date}`;

                rawReport.checks.forEach(rawCheckReport =>
                {
                    let arr = rawCheckReport.split(':').map(item => item.trim());
                    let projectId = arr[0];
                    let goalId = arr[1];

                    if (!BUILD_CONFIG.projectAllowed(projectId))
                        return;

                    let dbCheckReport = new DbCheckReport;
                        dbCheckReport.reportId =    reportId++;
                        dbCheckReport.date =        date;
                        dbCheckReport.projectId =   projectId;
                        dbCheckReport.goalId =      DbGoal.getGoalIdByName(projectId, goalId);
                    
                    dbCheckReports.push(dbCheckReport);
                });
            });
        });

        Db.Transaction(() => dbCheckReports.forEach(report => report.save()));
    }
}