import { Db } from "sqlean";

import { YearsProcess } from "../life/YearsProcess";
import { UtilDataReport } from "src/entity/report/data";
import { DbTimeReport } from "src/entity/report/db";
import { DbGoal } from "src/entity/goal/db";
import { UtilDate } from "src/util/Date";
import { BUILD_CONFIG } from "src/BuildConfig";

export class FillTimeReports extends YearsProcess
{
    processName = () => 'Добавление временных промежутков';

    process()
    {
        let dbTimeReports: DbTimeReport[] = [];
        let reportId = 1;

        this.years.forEach(year =>
        {
            let yearReports = UtilDataReport.getYearReports(year);

            if (!yearReports) return;

            Object.keys(yearReports).forEach(date =>
            {
                let rawReport = yearReports[date];
                if (!rawReport.time) return;

                this.stage = `Обработка даты: ${date}`;

                rawReport.time.forEach(rawTimeReport =>
                {
                    if (!BUILD_CONFIG.projectAllowed(rawTimeReport.project))
                        return;

                    let dbTimeReport = new DbTimeReport;
                        dbTimeReport.reportId =     reportId++;
                        dbTimeReport.date =         date;
                        dbTimeReport.duration =     UtilDate.toHours(rawTimeReport.duration);
                        dbTimeReport.projectId =    rawTimeReport.project;
                        dbTimeReport.goals =        this.getGoalIds(rawTimeReport.project, rawTimeReport.goals);
                        dbTimeReport.tags =         this.getTags(dbTimeReport.goals, rawTimeReport.tags);
                    
                    dbTimeReports.push(dbTimeReport);
                });
            });
        });

        Db.Transaction(() => dbTimeReports.forEach(report => report.save()));
    }

    private getGoalIds(projectId: string, strGoals: string[] | string): number[]
    {
        if (!projectId || !strGoals) return null;

        let ids = [];

        if (typeof strGoals === 'string')
            strGoals = [strGoals];

        strGoals.forEach(strGoal =>
        {
            ids.push(
                DbGoal.getGoalIdByName(projectId, strGoal)
            );
        });

        return ids;
    }

    private getTags(goalIds: number[], tagIds: string[]): string[]
    {
        if (!goalIds  && !tagIds) return null;

        let tags = [];

        if (tagIds)
            tags = tags.concat(tagIds);
        
        if (goalIds)
            goalIds.forEach(goalId =>
            {
                let goalTags = Db.Select.Get({
                    table:      'goal',
                    columns:    ['tags'],
                    where:      ['@goalId', '=', goalId],
                    pluck:      true
                });

                if (goalTags)
                    tags = tags.concat(JSON.parse(goalTags));
            });

        return this.resolveTags(tags);
    }

    private resolveTags(tags: string[]): string[]
    {
        let resultTags = [];
        let removeTags = [];

        tags.forEach(tag =>
        {
            tag = tag.trim();

            let isRemoveTag = tag.charAt(0) === '!';
            let tagId = (isRemoveTag ? tag.substring(1) : tag);

            if (isRemoveTag && !removeTags.includes(tagId))
            {
                removeTags.push(tagId);
                return;
            }

            if (!resultTags.includes(tagId)) resultTags.push(tagId);
        });

        removeTags.forEach(removeTag =>
        {
            if (resultTags.includes(removeTag))
                resultTags.splice(resultTags.indexOf(removeTag), 1);
        });

        return resultTags;
    }
}