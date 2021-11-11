import { Db } from "sqlean";

import { IO } from "src/util/IO";
import { SearchProcess } from "./SearchProcess";

export class SearchTagIndex extends SearchProcess
{
    processName = () => 'Построение поискового индекса тегов';
    
    process()
    {
        let tagIndex = new TagIndex;

        Object.keys(this.tagIdMap).forEach(tagId =>
        {
            let projectsWithTag = Db.Select.All({
                table:      'project_tag',
                columns:    ['projectId'],
                where:      ['@tagId', '=', tagId],
                pluck:      true
            });

            tagIndex[tagId] = projectsWithTag.map(projectId => this.projectIdMap[projectId]);
        });

        //console.log(tagIndex);
        //IO.writeFile('dist/site/search/tagIndex.json', JSON.stringify(tagIndex));

        IO.writeFile('dist/site/search/tagIndex.json.lz', SearchProcess.compress(tagIndex));
    }
}

export class TagIndex
{
    // ID тега -> числовые идентификаторы проектов с этим тегом
    [tagId: string]: number[];
}