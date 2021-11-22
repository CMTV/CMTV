import { Db } from "sqlean";
import { AND } from "sqlean/dist/query/Where";

import { DbCounter } from "src/entity/counter/db";
import { UtilDate } from "src/util/Date";
import { DbGoal } from "../goal/db";
import { DbProject } from "../project/db";
import { ProjectIcon } from "../project/global";
import { DbCounterReport, DbEventReport } from "../report/db";

export class ViewCounter
{
    counterId:  string;
    icon:       string;
    title:      string;
    value:      string;

    // Static

    static getProjectCounter()
    {
        let projectCount = Db.Select.Get({
            table:      'project',
            columns:    ['count(*)'],
            pluck:      true
        });

        if (!projectCount) return null;

        let counter = new ViewCounter;
            counter.counterId = 'project';
            counter.icon = 'fa-solid fa-clone';
            counter.title = 'Проекты';
            counter.value = projectCount;

        return counter;
    }

    static getEventCounter(year: string = null)
    {
        let selectData = {
            table:      'report_event',
            columns:    ['count(*)'],
            pluck:      true
        }

        if (year)
            selectData['where'] = ['@date', 'LIKE', year + '%'];

        let eventCount = Db.Select.Get(selectData);

        if (!eventCount) return null;

        let counter = new ViewCounter;
            counter.counterId = 'event';
            counter.icon =      'fa-solid fa-masks-theater';
            counter.title =     'События';
            counter.value =     eventCount;

        return counter;
    }

    static getGoalCounter(year: string = null)
    {
        let where = [];
            where.push(['@status', '=', 'done']);
            where.push(['@counted', '=', 1]);
        
        if (year)
            where.push(['@end', 'LIKE', year + '%']);

        let doneGoals = Db.Select.Get({
            table:      'goal',
            columns:    ['count(*)'],
            where:      AND(...where),
            pluck:      true
        });

        if (!doneGoals) return null;

        let counter = new ViewCounter;
            counter.counterId = 'goal';
            counter.icon =      'fa-solid fa-crosshairs';
            counter.title =     'Завершенные цели';
            counter.value =     doneGoals;
        
        return counter;
    }

    static getById(counterId: string, year: string = null)
    {
        let dbCounter = DbCounter.getById(counterId);

        let where = [];
            where.push(['@counterId', '=', counterId]);

        if (year)
            where.push(['@date', 'LIKE', year + '%']);

        let value = Db.Select.Get({
            table:      'report_counter',
            columns:    ['sum(value)'],
            where:      AND(...where),
            pluck:      true
        });

        if (!dbCounter || !value) return null;

        let counter = new ViewCounter;
            counter.counterId = counterId;
            counter.icon =      dbCounter.icon;
            counter.title =     dbCounter.title;
            counter.value =     value;

        return counter;
    }

    static getAll(year: string = null)
    {
        let counters = [];

        let goalCounter = this.getGoalCounter(year);
        if (goalCounter)
            counters.push(goalCounter);

        DbCounter.getIds().forEach(counterId =>
        {
            let counter = this.getById(counterId, year);
            if (counter)
                counters.push(counter);
        });

        let eventCounter = this.getEventCounter(year);
        if (eventCounter)
            counters.push(eventCounter);

        return counters.length > 0 ? counters : null;
    }
}

//#region Содержимое счетчиков

export class ViewDefaultCounterItem
{
    count:      string;
    project:    string;
    icon:       ProjectIcon;
    title:      string;
    link:       string;
    date:       string;

    static fromDbDefault(dbDefault: DbCounterReport)
    {
        let item = new ViewDefaultCounterItem;
            item.date =     UtilDate.getDayMonth(dbDefault.date);
            item.count =    '+' + dbDefault.value;

            if (dbDefault.projectId)
            {
                item.project =  dbDefault.projectId;
                item.icon =     new ProjectIcon(dbDefault.projectId);
                item.title =    DbProject.getById(item.project, ['title']).title;
                item.link =     `/projects/${item.project}`;
            }
            else item.title =   dbDefault.desc;

        return item;
    }
}

export class ViewEventCounterItem
{
    date:   string;
    title:  string;
    desc:   string;

    static fromDbEvent(dbEvent: DbEventReport)
    {
        let item = new ViewEventCounterItem;
            item.date =     UtilDate.getDayMonth(dbEvent.date);
            item.title =    dbEvent.title;
            item.desc =     dbEvent.desc;
        
        return item;
    }
}

export class ViewGoalCounterItem
{
    project:    string;
    icon:       ProjectIcon;
    title:      string;
    goals:      GoalCounterSubItem[];

    static fromDbGoals(dbGoals: DbGoal[])
    {
        let projectGoalsMap = {};

        dbGoals.forEach(dbGoal => {
            if (!projectGoalsMap[dbGoal.projectId])
                projectGoalsMap[dbGoal.projectId] = [];

            let goalSubItem = new GoalCounterSubItem;
                goalSubItem.date =      UtilDate.getDayMonth(dbGoal.end);
                goalSubItem.title =     dbGoal.title;
                goalSubItem.progress =  JSON.parse(dbGoal.progress as any as string);

            projectGoalsMap[dbGoal.projectId].push(goalSubItem);
        });

        let projectItems: ViewGoalCounterItem[] = [];

        Object.keys(projectGoalsMap).forEach(projectId =>
        {
            let projectItem = new ViewGoalCounterItem;
                projectItem.project =   projectId;
                projectItem.icon =      new ProjectIcon(projectId);
                projectItem.title =     DbProject.getById(projectId, ['title']).title;
                projectItem.goals =     projectGoalsMap[projectId];
            
            projectItems.push(projectItem);
        });

        return projectItems;
    }
}

class GoalCounterSubItem
{
    date: string;
    title: string;
    progress: { label: string; width: number }
}

export class UtilViewCounterItem
{
    static getCounterDataForYear(counterId: string, year: string)
    {
        if ('goal' === counterId)
        {
            let dbGoals = Db.Select.All({
                table:      'goal',
                columns:    ['projectId', 'title', 'end', 'progress'],
                where:      AND(['@counted', '=', 1], ['@status', '=', 'done'], ['@end', 'LIKE', year + '%']),
                order:      { end: 'DESC' }
            });

            if (!dbGoals) return null;

            return ViewGoalCounterItem.fromDbGoals(dbGoals);
        }

        if ('event' === counterId)
        {
            let dbEvents = Db.Select.All({
                table:      'report_event',
                columns:    ['date', 'title', 'desc'],
                where:      ['@date', 'LIKE', year + '%'],
                order:      { date: 'DESC' }
            });

            if (!dbEvents) return null;

            let events: ViewEventCounterItem[] = dbEvents.map(dbEvent => ViewEventCounterItem.fromDbEvent(dbEvent));

            return events;
        }

        let dbDefaults = Db.Select.All({
            table:      'report_counter',
            columns:    ['date', 'value', 'projectId', 'desc'],
            where:      AND(['@counterId', '=', counterId], ['@date', 'LIKE', year + '%']),
            order:      { date: 'DESC' }
        });

        if (!dbDefaults) return null;

        let defaults: ViewDefaultCounterItem[] = dbDefaults.map(dbDefault => ViewDefaultCounterItem.fromDbDefault(dbDefault));

        return defaults;
    }
}

//#endregion