import { Db } from "sqlean";

import { ProjectsProcess } from "./ProjectsProcess";
import { UtilDataProject } from "src/entity/project/data";
import { DbProjectTag } from "src/entity/project/db";
import { DbTag } from "src/entity/tag/db";

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
                let isImportant = rawTag[0] === '!';
                let role = null;

                if (isImportant)
                {
                    rawTag = rawTag.slice(1);

                    role = DbTag.getById(rawTag, ['type']).type;
                    if (role === 'other')
                        role = null;
                }

                let isOld = rawTag.slice(-1) === '*';
                if (isOld) rawTag = rawTag.slice(0, -1);

                let tag = new DbProjectTag;
                    tag.projectId = projectId;
                    tag.tagId =     rawTag;
                    tag.role =      role;
                    tag.old =       isOld;
                    tag.displayOrder = displayOrder++;

                tags.push(tag);
            });
        });

        Db.Transaction(() => tags.forEach(tag => tag.save()));
    }
}