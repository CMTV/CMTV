import { Db } from "sqlean";

import { UtilDataProject } from "src/entity/project/data";
import { DbProject } from "src/entity/project/db";
import { ProjectType } from "src/entity/project/global";
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
                columns:    ['title', 'desc', 'type', 'status'],
                where:      ['@projectId', '=', projectId]
            });

            let searchProject = new SearchProject;
                searchProject.id =      projectId;
                searchProject.iconExt = UtilDataProject.getIconExt(projectId);
                searchProject.title =   dbProject.title;
                searchProject.desc =    dbProject.desc;
                searchProject.type =    dbProject.type as any;
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
    iconExt:    string;
    title:      string;
    desc:       string;
    type:       ProjectType;
    status:     Status;
    tagIds:     number[];
}