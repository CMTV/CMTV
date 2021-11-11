import { Process } from "@cmtv/processes";
import { Db } from "sqlean";

import { IO } from "src/util/IO";
import { PageProject } from "src/page/PageProject";
import { UtilDataProject } from "src/entity/project/data";
import { DbProject } from "src/entity/project/db";
import { ViewProjectDateData, ViewProjectGoalData, ViewProjectRelated, ViewProjectTags, ViewProjectType } from "src/entity/project/view";
import { ProjectExtra, ProjectFact, ProjectStatus, ProjectType, UtilProject } from "src/entity/project/global";
import { UtilDate } from "src/util/Date";
import { ViewTimeChart } from "src/entity/timeChart/view";
import { ViewTimeline } from "src/entity/timelineFragment/view";
import { PageOgImg } from "src/page/Page";
import { Translator } from "src/translator/Translator";

export class Page_Project extends Process
{
    processName = () => 'Сборка страниц отдельных проектов';

    process()
    {
        let projectIds = Db.Select.All({
            table:      'project',
            columns:    ['projectId'],
            pluck:      true
        });

        projectIds.forEach(projectId =>
        {
            this.stage = `Сборка страницы '${projectId}'`;

            let dbProject = DbProject.getById(projectId);

            if (!dbProject.extra)
                dbProject.extra = ProjectExtra.getDefault();

            let page = new PageProject;

                page.id =       projectId;
                page.title =    dbProject.title;
                page.desc =     dbProject.desc;
                page.icon =     `/projects/${projectId}/icon.` + UtilDataProject.getIconExt(projectId);

                page.type =     new ViewProjectType(dbProject.type as ProjectType);
                page.tags =     new ViewProjectTags(projectId);

                page.facts =    dbProject.facts || [];
                page.facts.splice(0, 0, this.getStatusFact(dbProject.status));

                if (dbProject.extra.timeFact)
                {
                    let timeFact = this.getTimeFact(projectId);
                    if (timeFact)
                        page.facts.splice(1, 0, timeFact);
                }

                page.action =   dbProject.action;
                page.showcase = dbProject.showcase;

                page.main =     Translator.renderAll(dbProject.main, { projectId: projectId });

                page.links =    dbProject.links;

                page.start =    UtilDate.getFancyDate(dbProject.start);
                page.end =      UtilDate.getFancyDate(dbProject.end);

                page.goalData = ViewProjectGoalData.forProject(projectId);
                page.dateData = ViewProjectDateData.fromDbProject(dbProject);

                page.timeline = ViewTimeline.forProject(projectId);

                page.tagChart = ViewTimeChart.forProject(projectId);
                page.related =  ViewProjectRelated.getAllFor(projectId);

                page.blocks =   dbProject.blocks;

                if (page.blocks)
                    page.blocks.forEach(block => block.content = Translator.renderAll(block.content, { projectId: projectId }));

            page.seo.title = page.title;
            page.seo.desc = page.desc;

            page.ogImg = new PageOgImg('project-' + projectId, dbProject.title, projectId);

            this.moveProjectFiles(projectId);

            page.compile();
        });
    }

    private moveProjectFiles(projectId: string)
    {
        UtilDataProject.getFilesToMove(projectId).forEach(dataFile =>
        {
            IO.copyFile(dataFile, `dist/projects/` + dataFile.split('/').slice(3).join('/'));
        });
    }

    private getStatusFact(pStatus: ProjectStatus)
    {
        let statusFact = new ProjectFact;
            statusFact.id = 'status';
            statusFact.label = 'Статус';
            statusFact.data = `
                <div title="${UtilProject.getStatusLabel(pStatus.type)}" class="statusCircle statusCircle--${pStatus.type}"></div> <div ${pStatus.tooltip ? `title="${pStatus.tooltip}"` : ''}>${pStatus.label}</div>
            `.trim();

        return statusFact;
    }

    private getTimeFact(projectId: string)
    {
        let hours = Db.Select.Get({
            table:      'report_time',
            columns:    ['sum(duration)'],
            where:      ['@projectId', '=', projectId],
            pluck:      true
        });

        hours = hours || 0;

        let time = UtilDate.getFancyTime(hours);
        if (!time) return null;

        let timeFact = new ProjectFact;
            timeFact.id =      'time';
            timeFact.label =   'Время';
            timeFact.data =    time;

        return timeFact;
    }
}