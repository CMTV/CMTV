import { Db } from "sqlean";
import { UtilDataProject } from "src/entity/project/data";

import { DbProject } from "src/entity/project/db";
import { IO } from "src/util/IO";
import { SearchProcess } from "./SearchProcess";

const lunr =    require('site/vendor/lunr/lunr.min.js');
                require('site/vendor/lunr/lunr-stemmer.min.js')(lunr);
                require('site/vendor/lunr/lunr-ru.min.js')(lunr);
                require('site/vendor/lunr/lunr-multi.min.js')(lunr);

export class SearchProjectIndex extends SearchProcess
{
    processName = () => 'Построение поискового индекса проектов';

    process()
    {
        let index = new Index;
        let featuredIds = UtilDataProject.getFeaturedIds();

        Object.keys(this.projectIdMap).forEach(projectId =>
        {
            let dbProject: DbProject = Db.Select.Get({
                table:      'project',
                columns:    ['title', 'desc'],
                where:      ['@projectId', '=', projectId]
            });

            let indexItem = new IndexItem;
                indexItem.ref =     this.projectIdMap[projectId];
                indexItem.title =   dbProject.title;
                indexItem.desc =    dbProject.desc;

            let featuredIndex = featuredIds.indexOf(projectId);
            indexItem.featuredPos = (featuredIndex === -1) ? 1 : 10 + featuredIndex;

            index.items.push(indexItem);
        });

        let lunrIndex = index.createLunrIndex();

        // console.log(lunrIndex);
        // IO.writeFile('dist/site/search/projectIndex.json', JSON.stringify(lunrIndex));

        IO.writeFile('dist/site/search/projectIndex.json.lz', SearchProcess.compress(lunrIndex));
    }
}

class IndexItem
{
    ref:            number;
    title:          string;
    desc:           string;
    featuredPos:    number;
}

class Index
{
    items: IndexItem[];

    constructor()
    {
        this.items = [];
    }

    createLunrIndex()
    {
        let that = this;

        return lunr(function ()
        {
            this.use(lunr.multiLanguage('en', 'ru'));

            this.ref('ref');
            this.field('title', { boost: 10 });
            this.field('desc');

            that.items.forEach(item => this.add(item, { boost: item.featuredPos }));
        });
    }
}