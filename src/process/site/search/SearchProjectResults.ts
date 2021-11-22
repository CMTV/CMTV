import { Db } from "sqlean";

import { DbProject } from "src/entity/project/db";
import { ProjectIcon, ProjectType } from "src/entity/project/global";
import { Status } from "src/entity/status/Status";
import { IO } from "src/util/IO";
import { SearchProcess } from "./SearchProcess";

export class SearchProjectResults extends SearchProcess
{
    processName = () => 'Построение списка проектов для результатов поиска';

    process()
    {
        let projects: SearchProjects = {};

        Object.keys(this.projectIdMap).forEach(projectId =>
        {
            let dbProject: DbProject = Db.Select.Get({
                table:      'project',
                columns:    ['title', 'desc', 'type', 'status', 'featured'],
                where:      ['@projectId', '=', projectId]
            });

            let searchProject = new SearchProject;
                searchProject.id =          projectId;
                searchProject.icon =        new ProjectIcon(projectId);
                searchProject.title =       dbProject.title;
                searchProject.desc =        dbProject.desc;
                searchProject.type =        dbProject.type as any;
                searchProject.featured =    dbProject.featured;
                searchProject.status =  JSON.parse(dbProject.status as any).type;

            let projectTags = Db.Select.All({
                table:      'project_tag',
                columns:    ['tagId'],
                where:      ['@projectId', '=', projectId],
                order:      { displayOrder: 'ASC' },
                pluck:      true
            });

            searchProject.tagIds = projectTags ? projectTags.map(tagId => this.tagIdMap[tagId]) : null;

            projects[this.projectIdMap[projectId]] = searchProject;
        });

        // console.log(projects);
        //IO.writeFile('dist/site/search/results.json', JSON.stringify(projects));
        
        IO.writeFile('dist/site/search/results.json.lz', SearchProcess.compress(projects));
    }
}

export class SearchProjects
{
    [projectNumId: number]: SearchProject
}

export class SearchProject
{
    id:         string;
    icon:       ProjectIcon;
    title:      string;
    desc:       string;
    type:       ProjectType;
    featured:   boolean;
    status:     Status;
    tagIds:     number[];
}