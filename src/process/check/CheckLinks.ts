import { Process } from "@cmtv/processes";
import { Db } from "sqlean";

import { DbProject } from "src/entity/project/db";

export class Link
{

}

export class CheckLinks extends Process
{
    projectIds: string[];

    constructor()
    {
        super();

        this.projectIds = Db.Select.All({
            table: 'project',
            columns: ['projectId'],
            pluck: true
        });
    }

    processName = () => 'Проверка ссылок';

    process()
    {
        this.projectIds.forEach(projectId =>
        {
            let dbProject: DbProject = Db.Select.Get({
                table: 'project',
                columns: ['title', 'main', 'links', 'blocks'],
                where: ['@projectId', '=', projectId]
            });

            ['main', 'blocks'].forEach(position =>
            {
                if (!dbProject[position]) return;

                let regexp = /\[(.+?)\]\((.+?)\)/g;
                let matches = Array.from(dbProject[position].matchAll(regexp));

                matches.forEach(match =>
                {
                    //let link = new Link(match[1], match[2]);

                });
            });
        });
    }

    isLinkAlive(projectId: string, link: string)
    {
        if (link.startsWith('http'))
        {

        }

        if (link.startsWith('p:'))
            return this.projectIds.includes(link.substring(3));

        //if ()
    }

    static logDeadLink(projectId: string, title: string, position: string, link: string)
    {

    }
}