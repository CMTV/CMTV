import { Db } from "sqlean";

import { ProjectsProcess } from "./ProjectsProcess";
import { DbProjectRelation } from "src/entity/project/db";
import { UtilDataProject } from "src/entity/project/data";

export class FillProjectRelations extends ProjectsProcess
{
    processName = () => 'Добавление связей между проектами';

    process()
    {
        let relations: DbProjectRelation[] = [];

        this.projectIds.forEach(projectId =>
        {
            let config = UtilDataProject.getDataProject(projectId);
            if (!config.related) return;

            Object.keys(config.related).forEach(relatedId =>
            {
                let relation = new DbProjectRelation;
                    relation.projectId =    projectId;
                    relation.relatedId =    relatedId;
                    relation.reason =       config.related[relatedId];

                relations.push(relation);
            });
        });

        Db.Transaction(() => relations.forEach(relation => relation.save()));
    }
}