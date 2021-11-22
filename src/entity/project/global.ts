import { glob } from "glob";

import { Status } from "../status/Status";
import { UtilDataProject } from "./data";

export enum ProjectType
{
    In = 'in',
    Out = 'out',
    Mix = 'mix'
}

export class ProjectStatus
{
    type:       Status;
    label:      string;
    tooltip?:   string;
}

export class ProjectFact
{
    id:     string;
    label:  string;
    data:   string;
}

export class ProjectAction
{
    text:   string;
    link:   string;
    colors: string[];
    icon?:  string;
}

export class ProjectLink
{
    icon: string;
    text: string;
    link: string;
}

export class ProjectBlock
{
    scope:      string;
    title:      string;
    content:    string;
}

export class ProjectExtra
{
    timeFact?: boolean;

    static getDefault()
    {
        let extra = new ProjectExtra;
            extra.timeFact = true;
        
        return extra;
    }
}

export class ProjectIcon
{
    url:        string;
    dataPath:   string;
    invertible: boolean;

    constructor(projectId: string)
    {
        let globResult = glob.sync(UtilDataProject.getPathTo(projectId, 'icon*'));

        if (globResult.length === 0)
        {
            this.invertible = true;
            this.dataPath = 'site/graphics/no-icon.svg';
            this.url = '/' + this.dataPath;

            return;
        }

        let iconFilename = globResult[0].split('/').pop();
        let parts = iconFilename.split('.');

        parts.pop();
        this.invertible = parts.pop() === 'i';

        this.dataPath = `data/projects/list/${projectId}/${iconFilename}`;
        this.url = `/projects/${projectId}/${iconFilename}`;
    }
}

//
//
//

export class UtilProject
{
    static getProjectTypeIcon(type: ProjectType)
    {
        return `/site/graphics/${type}.svg`;
    }

    static getProjectTypeLabel(type: ProjectType)
    {
        switch (type)
        {
            case ProjectType.In:   return 'Потребитель';
            case ProjectType.Out:  return 'Производитель';
            case ProjectType.Mix:  return 'Производитель и потребитель';
        }
    }

    static getStatusLabel(status: Status)
    {
        switch (status)
        {
            case Status.Todo:   return 'В планах';
            case Status.Do:     return 'Ведется работа';
            case Status.Pause:  return 'Работа приостановлена';
            case Status.Fail:   return 'Проект закрыт';
            case Status.Done:   return 'Проект завершен';
        }
    }
}