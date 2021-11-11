import { Db } from "sqlean";

import { UtilDate } from "src/util/Date";
import { UtilMisc } from "src/util/Misc";
import { DbTimeReport } from "../report/db";
import { Status } from "../status/Status";
import { DbGoal } from "./db";
import { GoalProgress } from "./global";

export class ViewProjectGoal
{
    orderNum:   number;
    title:      string;
    status:     Status;
    progress:   GoalProgress;

    single:     boolean;
    start:      string;
    end:        string;

    time:       string;
    checks:     string;

    // Static

    static getStatusLabel(status: Status)
    {
        switch (status)
        {
            case Status.Todo:   return 'Запланировано';
            case Status.Do:     return 'В процессе';
            case Status.Pause:  return 'Приостановлено';
            case Status.Fail:   return 'Провалено';
            case Status.Done:   return 'Выполнено';
        }
    }

    static getAllForProject(projectId: string)
    {
        let goalIds = Db.Select.All({
            table:      'goal',
            columns:    ['goalId'],
            where:      ['@projectId', '=', projectId],
            order:      { orderNumber: 'ASC' },
            pluck:      true
        });

        if (!goalIds) return null;

        let dbGoals = goalIds.map(goalId => DbGoal.getById(goalId));
        let goals: ViewProjectGoal[] = [];

        dbGoals.forEach(dbGoal =>
        {
            let goal = new ViewProjectGoal;
                goal.orderNum = dbGoal.orderNumber;
                goal.title =    dbGoal.title;
                goal.status =   dbGoal.status as any;
                goal.progress = dbGoal.progress;

                goal.single =   dbGoal.start === dbGoal.end;
                goal.start =    UtilDate.toStrDate(dbGoal.start, false);
                goal.end =      UtilDate.toStrDate(dbGoal.end, false);

                goal.time =     this.getTime(dbGoal.projectId, dbGoal.goalId);
                goal.checks =   this.getChecks(dbGoal.goalId);

            goals.push(goal);
        });

        return goals;
    }

    static getTime(projectId: string, goalId: number)
    {
        let reportIds = Db.Select.All({
            table:      'report_time',
            columns:    ['reportId'],
            where:      ['@projectId', '=', projectId],
            pluck:      true
        });

        if (!reportIds) return null;

        let hours = 0;
        let reports = reportIds.map(reportId => DbTimeReport.getById(reportId, ['duration', 'goals']));

        reports.forEach(report =>
        {
            if (report.goals)
                if (report.goals.includes(goalId))
                    hours += report.duration;
        });

        return UtilDate.getFancyTime(hours);
    }

    static getChecks(goalId: number)
    {
        let count = Db.Select.Get({
            table:      'report_check',
            columns:    ['count(*)'],
            where:      ['@goalId', '=', goalId],
            pluck:      true
        });

        if (!count) return null;

        return count + ' ' + UtilMisc.pluralTitle(count, ['день', 'дня', 'дней']);
    }
}