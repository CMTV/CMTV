import { Process } from "@cmtv/processes";
import { Db } from "sqlean";

import { DbTag } from "src/entity/tag/db";
import { PageProjects } from "src/page/PageProjects";

export class Page_Projects extends Process
{
    processName = () => 'Сборка страницы проектов';

    process()
    {
        let page = new PageProjects;

        let tagMap = {};

        let tags: DbTag[] = Db.Select.All({
            table: 'tag',
            columns: ['tagId', 'type', 'desc']
        });

        tags.forEach(tag =>
        {
            if (!tagMap[tag.type]) tagMap[tag.type] = [];
            tagMap[tag.type].push({ id: tag.tagId, desc: tag.desc });
        });

        page.tagMap = tagMap;

        page.compile();
    }
}