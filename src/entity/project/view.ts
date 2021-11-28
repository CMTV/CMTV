import { Db } from "sqlean";

import { BUILD_CONFIG } from "src/BuildConfig";
import { UtilDate } from "src/util/Date";
import { ViewProjectGoal } from "../goal/view";
import { Status } from "../status/Status";
import { ViewTag } from "../tag/view";
import { DbProject, DbProjectTag } from "./db";
import { ProjectIcon, ProjectType, UtilProject } from "./global";

export class ViewListProject
{
    id:         string;
    title:      string;
    desc:       string;
    type:       ViewProjectType;
    icon:       ProjectIcon;
    status:     string;
    featured:   boolean;
    tags:       string[];
}

//
//
//

export class ViewProjectType
{
    type:   ProjectType;
    label:  string;
    icon:   string;

    constructor(type: ProjectType)
    {
        this.type =     type;
        this.label =    UtilProject.getProjectTypeLabel(type);
        this.icon =     UtilProject.getProjectTypeIcon(type);       
    }
}

//
//
//

export class ViewProjectTags
{
    area:   ViewTag;
    action: ViewTag;
    form:   ViewTag;
    
    other:  ViewTag[];

    constructor(projectId: string)
    {
        let projectTags: DbProjectTag[] = Db.Select.All({
            table:      'project_tag',
            columns:    ['tagId', 'role', 'old'],
            where:      ['@projectId', '=', projectId],
            order:      { displayOrder: 'ASC' }
        });

        if (!projectTags) return;

        projectTags.forEach(projectTag =>
        {
            let tag = new ViewTag(projectTag.tagId, projectTag.old);

            switch (projectTag.role)
            {
                case 'area':    this.area = tag; break;
                case 'action':  this.action = tag; break;
                case 'form':    this.form = tag; break;

                default:
                    this.other = this.other || [];
                    this.other.push(tag);
            }
        });
    }
}

//
//
//

export class ViewProjectRelated
{
    id:     string;
    title:  string;
    icon:   ProjectIcon;
    reason: string;

    constructor(relatedId: string, reason: string)
    {
        this.id =       relatedId;
        this.title =    DbProject.getById(relatedId, ['title']).title;
        this.icon =     new ProjectIcon(relatedId);
        this.reason =   reason;
    }
    
    static getAllFor(projectId: string)
    {
        let dbRelated = Db.Select.All({
            table:      'project_relation',
            columns:    ['relatedId', 'reason'],
            where:      ['@projectId', '=', projectId]
        });

        if (!dbRelated) return null;

        dbRelated = dbRelated.filter(item => BUILD_CONFIG.projectAllowed(item.relatedId));

        return dbRelated.map(dbItem => new ViewProjectRelated(dbItem.relatedId, dbItem.reason));
    }
}

//
//
//

//#region Goals + Date block
//
//

class GoalChart
{
    total:      number;
    fracs:      GoalChartFrac[];
    separators: number[];

    constructor(totalGoals, statusCounters: StatusCounter[])
    {
        this.total = totalGoals;

        let fracs: GoalChartFrac[] =    [];
        let separators: number[] =      [];

        if (statusCounters)
        {
            let start = 0, end;

            statusCounters.forEach(counter =>
            {
                let chartFrac = new GoalChartFrac;
                    chartFrac.status = counter.status;
                
                end = start + (counter.count * 100 / this.total);

                    chartFrac.start =   start;
                    chartFrac.end =     end;

                start = end;

                fracs.push(chartFrac);
                separators.push(chartFrac.end * 3.6);
            });

            if (statusCounters.length <= 1)
                separators = [];
        }
        else
        {
            let frac = new GoalChartFrac;
                frac.status = Status.Todo;
                frac.start = 0;
                frac.end = 100;
        
            fracs.push(frac);
        }

        this.fracs = fracs;
        this.separators = separators;
    }
}

class GoalChartFrac
{
    status:     string;
    start:      number;
    end:        number;
}

class StatusCounter
{
    count: number;
    status: string;
    tooltip: string;

    constructor(count: number, status: string)
    {
        this.count = count;
        this.status = status;
        this.tooltip = ViewProjectGoal.getStatusLabel(status as any);
    }
}

export class ViewProjectGoalData
{
    goals:          ViewProjectGoal[];
    total:          number;
    statusCounters: StatusCounter[];
    chart:          GoalChart;

    static forProject(projectId: string)
    {
        let goalData = new ViewProjectGoalData;
            goalData.goals = ViewProjectGoal.getAllForProject(projectId);
            goalData.total = (goalData.goals ? goalData.goals.length : 0);

        let statusCounters = [];
        
        if (goalData.goals)
        {
            Object.values(Status).reverse().forEach(status =>
            {
                let count = goalData.goals.filter(goal => goal.status === status).length;

                if (count > 0)
                    statusCounters.push(new StatusCounter(count, status));
            });
        }

        goalData.statusCounters = statusCounters.length > 0 ? statusCounters : null;
        goalData.chart = new GoalChart(goalData.total, goalData.statusCounters);

        return goalData;
    }
}

export class ViewProjectDateData
{
    single: boolean;
    start:  string;
    end:    string;

    static fromDbProject(dbProject: DbProject)
    {
        if (!dbProject.start && !dbProject.end) return null;

        let dateData = new ViewProjectDateData;
            dateData.single =   dbProject.start === dbProject.end;
            dateData.start =    UtilDate.getFancyDate(dbProject.start);
            dateData.end =      UtilDate.getFancyDate(dbProject.end);

        return dateData;
    }
}

//
//
//#endregion