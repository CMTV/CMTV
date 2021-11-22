import { Process } from "@cmtv/processes";
import { Db } from "sqlean";

import { BUILD_CONFIG } from "src/BuildConfig";
import { DbProject } from "src/entity/project/db";
import { ProjectIcon, ProjectType } from "src/entity/project/global";
import { ViewListProject, ViewProjectType } from "src/entity/project/view";
import { DbTag } from "src/entity/tag/db";
import { PageProjects } from "src/page/PageProjects";

export class Page_Projects extends Process
{
    processName = () => 'Сборка страницы проектов';

    process()
    {
        let page = new PageProjects;

        let tagMap = {};

        let tags: DbTag[] = Db.Select.All({
            table: 'tag',
            columns: ['tagId', 'type', 'desc']
        });

        tags.forEach(tag =>
        {
            if (!tagMap[tag.type]) tagMap[tag.type] = [];
            tagMap[tag.type].push({ id: tag.tagId, desc: tag.desc });
        });

        page.tagMap = tagMap;
        
        let batchSize = 20;

        page.initialList = this.getInitialList(batchSize)
        page.isInitialEnd = page.initialList.length === Db.Select.Get({ table: 'project', columns: ['count(*)'], pluck: true });

        page.compile();
    }

    private getInitialList(max: number): ViewListProject[]
    {
        let list: ViewListProject[] = [];

        let dbProjects: DbProject[] = Db.Select.All({
            table:      'project',
            columns:    ['projectId', 'title', 'desc', 'type', 'status', 'featured'],
            order:      { displayOrder: 'ASC' },
            limit:      max
        });

        if (!dbProjects) return [];

        dbProjects.forEach(dbProject =>
        {
            if (!BUILD_CONFIG.projectAllowed(dbProject.projectId))
                return;

            let listProject = new ViewListProject;
                listProject.id =        dbProject.projectId;
                listProject.title =     dbProject.title;
                listProject.desc =      dbProject.desc;
                listProject.featured =  dbProject.featured;
                listProject.type =      new ViewProjectType(dbProject.type as ProjectType);
                listProject.icon =      new ProjectIcon(dbProject.projectId);
                listProject.status =    JSON.parse(dbProject.status as any).type;

            let projectTags: string[] = Db.Select.All({
                table:      'project_tag',
                columns:    ['tagId'],
                where:      ['@projectId', '=', dbProject.projectId],
                order:      { displayOrder: 'ASC' },
                pluck:      true,
                limit:      5
            });

            listProject.tags = projectTags;

            list.push(listProject);
        });

        return list;
    }
}