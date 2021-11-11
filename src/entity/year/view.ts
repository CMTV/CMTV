import { Db } from "sqlean";

import { UtilDate } from "src/util/Date";
import { ViewCounter } from "../counter/view";
import { UtilDataProject } from "../project/data";
import { DbProject } from "../project/db";
import { DataYearResult, UtilDataYear } from "./data";

export class ViewYearResult
{
    type:   'project' | 'other';
    link:   string;
    icon:   string;
    title:  string;
    desc:   string;

    constructor(dataResult: DataYearResult)
    {
        this.type = dataResult.project ? 'project' : 'other';

        if (dataResult.project)
        {
            this.link =     `/projects/${dataResult.project}`;
            this.icon =     `/projects/${dataResult.project}/icon.${UtilDataProject.getIconExt(dataResult.project)}`;
            this.title =    dataResult.title || DbProject.getById(dataResult.project, ['title']).title;
        }
        else
        {
            this.icon = dataResult.icon;
            this.title = dataResult.title;
        }

        this.desc = dataResult.desc;
    }
}

export class ViewYearPreview
{
    year:       string;
    time:       string;
    counters:   ViewCounter[];
    projects:   ViewYearKeyProject[];
}

export class ViewYearKeyProject
{
    id:     string;
    icon:   string;
    title:  string;

    constructor(projectId: string)
    {
        this.id =       projectId;
        this.icon =     `/projects/${projectId}/icon.` + UtilDataProject.getIconExt(projectId);
        this.title =    DbProject.getById(projectId, ['title']).title;
    }

    // Static

    static getAll(year: string)
    {
        let results = UtilDataYear.getResults(year);

        if (!results) return null;

        let projects = [];

        results.forEach(dataResult =>
        {
            if (!dataResult.project) return;
            projects.push(new ViewYearKeyProject(dataResult.project));
        });

        return projects.length > 0 ? projects : null;
    }
}

export class UtilViewYear
{
    static getYearTime(year: string)
    {
        let hours = Db.Select.Get({
            table:      'report_time',
            columns:    ['sum(duration)'],
            where:      ['@date', 'LIKE', year + '%'],
            pluck:      true
        });

        return UtilDate.getFancyTime(hours);
    }
}