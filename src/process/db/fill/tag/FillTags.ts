import { Process } from "@cmtv/processes";
import { Db } from "sqlean";
import { parse as jsoncParse } from "comment-json";

import { IO } from "src/util/IO";
import { DbTag } from "src/entity/tag/db";
import { DataTags } from "src/entity/tag/data";

export class FillTags extends Process
{
    processName = () => 'Добавление тегов';

    process()
    {
        let tags: DbTag[] = [];

        let tagTypeFileMap = 
        {
            'actions':  'action',
            'areas':    'area',
            'forms':    'form'
        };

        Object.keys(tagTypeFileMap).forEach(file =>
        {
            let path = `data/tags/${file}.jsonc`;
            let rawTags = jsoncParse(IO.readFile(path)) as DataTags;

            Object.keys(rawTags).forEach(tagId =>
            {
                let rawTag = rawTags[tagId];
                               
                let tag = new DbTag;
                    tag.tagId = tagId;
                    tag.type =  tagTypeFileMap[file];
                    tag.title = rawTag.title;
                    tag.desc =  rawTag.desc;

                tags.push(tag);
            });
        });

        Db.Transaction(() => tags.forEach(tag => tag.save()));
    }
}