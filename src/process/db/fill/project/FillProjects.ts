import { Db } from "sqlean";

import { UtilDataProject } from "src/entity/project/data";
import { UtilDate } from "src/util/Date";
import { IO } from "src/util/IO";
import { ProjectsProcess } from "./ProjectsProcess";
import { DbProject } from "src/entity/project/db";
import { ProjectBlock } from "src/entity/project/global";

export class FillProjects extends ProjectsProcess
{
    private displayOrderI: number;

    processName = () => 'Добавление проектов';

    process()
    {
        let projects: DbProject[] = [];

        this.displayOrderI = this.featuredIds.length;

        this.projectIds.forEach(projectId =>
        {
            let dataProject = UtilDataProject.getDataProject(projectId);
            let project = new DbProject;
                
                project.projectId = projectId;
                
                project.title =     dataProject.title.replace(/( |^)\"(.+?)\"( |$)/gm, '$1«$2»$3');
                project.desc =      dataProject.desc;
                project.type =      dataProject.type;
                project.status =    dataProject.status;

                project.start =     UtilDate.toStrDate(dataProject.start);
                project.end =       UtilDate.toStrDate(dataProject.end);

                if (dataProject.date)
                    project.start = project.end = UtilDate.toStrDate(dataProject.date);

                project.facts =     dataProject.facts;
                project.action =    dataProject.action;
                project.links =     dataProject.links;

                project.main =      this.getMain(projectId);
                project.blocks =    this.getBlocks(projectId);
                project.extra =     dataProject.extra;

                project.featured =  this.featuredIds.includes(projectId);

                project.displayOrder = this.getDisplayOrder(projectId);

            projects.push(project);
        });

        Db.Transaction(() => projects.forEach(project => project.save()));
    }

    private getDisplayOrder(projectId: string)
    {
        let i = this.featuredIds.indexOf(projectId);
        return (i === -1 ? this.displayOrderI++ : i);
    }

    private getMain(projectId: string)
    {
        let mainFile = UtilDataProject.getPathTo(projectId, 'main.md');
        
        if (!IO.exists(mainFile))
            return null;

        return IO.readFile(mainFile);
    }

    private getBlocks(projectId: string)
    {
        let blocksFile = UtilDataProject.getPathTo(projectId, 'blocks.md');
        
        if (!IO.exists(blocksFile))
            return null;

        let blocksMd = IO.readFile(blocksFile);
        let blocks: ProjectBlock[] = [];

        blocksMd = blocksMd.replace(/^# (\(.*\)|)(.+?)$/gm, (match, scope, title) =>
        {
            let block = new ProjectBlock;
                block.scope = scope.slice(1, -1).trim() || null;
                block.title = title.trim();

            blocks.push(block);

            return '###';
        });

        let contentArr = blocksMd.split(/^###$/gm);
            contentArr.shift();
        
        blocks.forEach((block, i) => block.content = contentArr[i].trim());

        return blocks;
    }
}