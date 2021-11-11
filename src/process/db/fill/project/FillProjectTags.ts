import { Db } from "sqlean";

import { ProjectsProcess } from "./ProjectsProcess";
import { UtilDataProject } from "src/entity/project/data";
import { DbProjectTag } from "src/entity/project/db";

export class FillProjectTags extends ProjectsProcess
{
    processName = () => 'Добавление тегов проектов';

    process()
    {
        let tags: DbProjectTag[] = [];
        let displayOrder = 1;

        this.projectIds.forEach(projectId =>
        {
            let config = UtilDataProject.getDataProject(projectId);
            if (!config.tags) return;

            config.tags.forEach(rawTag =>
            {
                let tagArr = rawTag.split(':');

                let tag = new DbProjectTag;
                    tag.projectId = projectId;
                    tag.tagId =     tagArr.pop();
                    tag.role =      tagArr.pop();
                    tag.displayOrder = displayOrder++;

                tags.push(tag);
            });
        });

        Db.Transaction(() => tags.forEach(tag => tag.save()));
    }
}