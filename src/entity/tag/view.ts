import { DbTag } from "./db";

export class ViewTag
{
    id:     string;
    title:  string;
    desc:   string;

    getTitle = () => this.title || this.id;

    constructor(tag: DbTag|string)
    {
        if (typeof tag === 'string')
            tag = DbTag.getById(tag);

        this.id =       tag.tagId;
        this.title =    tag.title;
        this.desc =     tag.desc;
    }
}