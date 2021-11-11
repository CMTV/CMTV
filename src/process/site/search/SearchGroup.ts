import { ProcessGroup } from "@cmtv/processes";
import { Db } from "sqlean";

import { ProjectIdMap, TagIdMap } from "./SearchProcess";
import { SearchProjectIndex } from "./SearchProjectIndex";
import { SearchProjectResults } from "./SearchProjectResults";
import { SearchTagIndex } from "./SearchTagIndex";

export class SearchGroup extends ProcessGroup
{
    groupName = () => 'Поисковая система';

    processes()
    {
        let projectIds = Db.Select.All({
            table:      'project',
            columns:    ['projectId'],
            order:      { displayOrder: 'ASC' },
            pluck:      true
        });

        let tagIds = Db.Select.All({
            table:      'tag',
            columns:    ['tagId'],
            pluck:      true
        });

        let projectIdMap: ProjectIdMap = {};
        let tagIdMap: TagIdMap = {};

        projectIds.forEach((projectId, i) => projectIdMap[projectId] = i);
        tagIds.forEach((tagId, i) => tagIdMap[tagId] = i);

        return [
            new SearchTagIndex(projectIdMap, tagIdMap),
            new SearchProjectIndex(projectIdMap),
            new SearchProjectResults(projectIdMap, tagIdMap)
        ];
    }
}