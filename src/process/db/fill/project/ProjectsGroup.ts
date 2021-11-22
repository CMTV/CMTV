import { ProcessGroup } from "@cmtv/processes"

import { UtilDataProject } from "src/entity/project/data";

// Процессы
import { FillProjects } from "./FillProjects";
import { FillProjectTags } from "./FillProjectTags";
import { FillProjectRelations } from "./FillProjectRelations";

export class ProjectsGroup extends ProcessGroup
{
    groupName = () => 'Проекты';
    
    processes()
    {
        let projectIds =    UtilDataProject.getIds();
        let featuredIds =   UtilDataProject.getFeaturedIds();

        return [
            new FillProjects(projectIds, featuredIds),
            new FillProjectTags(projectIds),
            new FillProjectRelations(projectIds),
        ];
    }
}