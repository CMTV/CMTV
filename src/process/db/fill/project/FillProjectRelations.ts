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

                switch (dataRelation.type)
                {
                    case 'dependent':
                    case 'dependency':
                    case 'relation-both':
                        let directRelation = new DbProjectRelation;
                        let inverseRelation = new DbProjectRelation;

                        directRelation.projectId = projectId;
                        inverseRelation.projectId = relatedId;

                        directRelation.relatedId = relatedId;
                        inverseRelation.relatedId = projectId;

                        directRelation.reason = inverseRelation.reason = dataRelation.reason;
                        directRelation.displayOrder = inverseRelation.displayOrder = i;

                        directRelation.type = dataRelation.type === 'relation-both' ? 'relation' : dataRelation.type;
                        inverseRelation.type = dataRelation.type === 'relation-both' ? 'relation' : dataRelation.type === 'dependent' ? 'dependency' : 'dependent';
                        
                        relations.push(directRelation);
                        relations.push(inverseRelation);
                        break;
                    
                    case 'relation':
                        let relation = new DbProjectRelation;
                            relation.projectId =    projectId;
                            relation.relatedId =    relatedId;
                            relation.type =         dataRelation.type;
                            relation.reason =       dataRelation.reason;

                        relations.push(relation);
                        break;
                }
            });
        });

        Db.Transaction(() => relations.forEach(relation => relation.save()));
    }
}