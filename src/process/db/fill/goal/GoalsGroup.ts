import { ProcessGroup } from "@cmtv/processes";
import { UtilDataProject } from "src/entity/project/data";

import { FillGoals } from "./FillGoals";

export class GoalsGroup extends ProcessGroup
{
    groupName = () => 'Цели';

    processes()
    {
        let projectIds = UtilDataProject.getIds();

        return [
            new FillGoals(projectIds)
        ];
    }
}