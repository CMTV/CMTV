import { Status } from "../status/Status";

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

export class ProjectShowcaseItem
{
    src:    string;
    width:  number;
    height: number;
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