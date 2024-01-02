import { Db } from "sqlean";

import { BUILD_CONFIG } from "src/BuildConfig";
import { ProjectsProcess } from "./ProjectsProcess";
import { DbProjectRelation } from "src/entity/project/db";
import { DataProjectRelation, UtilDataProject } from "src/entity/project/data";

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

            Object.keys(config.related).forEach((relatedId, i) =>
            {
                if (!BUILD_CONFIG.projectAllowed(relatedId))
                    return;

                if (typeof config.related[relatedId] === 'string')
                {
                    let relation = new DbProjectRelation;
                        relation.projectId = projectId;
                        relation.relatedId = relatedId;
                        relation.type = 'relation';
                        relation.reason = config.related[relatedId];
                        relation.displayOrder = i;

                    relations.push(relation);
                    return;
                }

                let dataRelation: DataProjectRelation = config.related[relatedId];
                    dataRelation.relatedId = relatedId;
                    dataRelation.type = dataRelation.type ?? 'relation';

                relations.push(this.createDbRelation(projectId, i, dataRelation));

                if (dataRelation.inverse)
                {
                    let inverseDataRelation = {...dataRelation};
                        inverseDataRelation.relatedId = projectId;
                        inverseDataRelation.type = inverseDataRelation.type !== 'relation' ? inverseDataRelation.type === 'dependency' ? 'dependent' : 'dependency' : inverseDataRelation.type;

                    relations.push(this.createDbRelation(relatedId, 1000, inverseDataRelation));
                }
            });
        });

        Db.Transaction(() => relations.forEach(relation => relation.save()));
    }

    createDbRelation(projectId: string, order: number, dataRelation: DataProjectRelation)
    {
        let dbRelation = new DbProjectRelation;
            dbRelation.projectId =      projectId;
            dbRelation.relatedId =      dataRelation.relatedId;
            dbRelation.reason =         dataRelation.reason;
            dbRelation.displayOrder =   order;
            dbRelation.type =           dataRelation.type;

        return dbRelation;
    }
}