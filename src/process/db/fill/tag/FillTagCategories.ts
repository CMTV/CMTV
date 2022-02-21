import { Process } from "@cmtv/processes";
import { glob } from "glob";
import { Db } from "sqlean";
import YAML from 'yaml';

import { IO } from "src/util/IO";
import { DataTagCategory } from "src/entity/tag/data";
import { DbTag, DbTagCategory } from "src/entity/tag/db";

export class FillTagCategories extends Process
{
    processName = () => 'Добавление категорий тегов';

    process()
    {
        let tagCategories: DbTagCategory[] = [];
        let tags: DbTag[] = [];

        glob.sync('data/tags/other/*').forEach(categoryFile =>
        {
            let dataCategory: DataTagCategory = YAML.parse(IO.readFile(categoryFile));
            
            let filenameArr = categoryFile.split('/').pop().split('-');
            let displayOrder = +filenameArr.shift();
            let catId = filenameArr.shift();

            let dbTagCategory = new DbTagCategory;
                dbTagCategory.tagCategoryId = catId;
                dbTagCategory.title = dataCategory.categoryTitle;
                dbTagCategory.displayOrder = displayOrder;

            tagCategories.push(dbTagCategory);

            Object.keys(dataCategory.tags).forEach(tagId =>
            {
                let dataTag = dataCategory.tags[tagId] ?? {};
                
                let dbTag = new DbTag;
                    dbTag.tagId =   tagId;
                    dbTag.type =    'other';
                    dbTag.title =   dataTag.title;
                    dbTag.desc =    dataTag.desc;
                    dbTag.tagCategoryId = dbTagCategory.tagCategoryId;

                tags.push(dbTag);
            });
        });

        Db.Transaction(() =>
        {
            tagCategories.forEach(category => category.save());
            tags.forEach(tag => tag.save());
        });
    }
}