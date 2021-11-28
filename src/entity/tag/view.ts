import { Db } from "sqlean";
import { DbTag, DbTagCategory } from "./db";

export class ViewTag
{
    id:     string;
    title:  string;
    desc:   string;
    old:    boolean;

    getTitle = () => this.title || this.id;

    constructor(tag: DbTag|string, isOld: boolean = false)
    {
        this.old = isOld || undefined;

        if (typeof tag === 'string')
            tag = DbTag.getById(tag);

        this.id =       tag.tagId;
        this.title =    tag.title;
        this.desc =     tag.desc;
    }
}

export class ViewSearchTag
{
    id: string;
    desc: string;

    constructor(tag: DbTag | string)
    {
        if (typeof tag === 'string')
            tag = DbTag.getById(tag);

        this.id =   tag.tagId;
        this.desc = tag.desc;
    }
}

export class ViewTagCategory
{
    id:     string;
    title:  string;
    tags:   ViewSearchTag[];

    static getFromDb(): ViewTagCategory[]
    {
        let dbCategories: DbTagCategory[] = Db.Select.All({
            table:      'tag_category',
            columns:    ['tagCategoryId', 'title'],
            order:      { displayOrder: 'ASC' }
        });

        if (!dbCategories) return null;

        let categories = [];

        dbCategories.forEach(dbCategory =>
        {
            let category = new ViewTagCategory;
                category.id =       dbCategory.tagCategoryId;
                category.title =    dbCategory.title;

            let dbTagIds = Db.Select.All({
                table:      'tag',
                columns:    ['tagId'],
                where:      ['@tagCategoryId', '=', category.id],
                pluck:      true
            });

            if (dbTagIds)
                category.tags = dbTagIds.map(tagId => new ViewTag(tagId));

            categories.push(category);
        });

        return categories;
    }
}

export class ViewTagMap
{
    area:   ViewSearchTag[];
    action: ViewSearchTag[];
    form:   ViewSearchTag[];
    other:  ViewTagCategory[];

    static getFromDb()
    {
        let tagMap = new ViewTagMap;

        let tagIds = Db.Select.All({
            table:      'tag',
            columns:    ['tagId'],
            where:      ['@type', '!=', 'other'],
            pluck:      true
        });

        if (tagIds)
            tagIds.map(tagId => DbTag.getById(tagId)).map(dbTag =>
            {
                if (!tagMap[dbTag.type])
                    tagMap[dbTag.type] = [];
                
                tagMap[dbTag.type].push(new ViewSearchTag(dbTag));
            });

        tagMap.other = ViewTagCategory.getFromDb();

        return tagMap;
    }
}