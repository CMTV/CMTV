export class DataTags
{
    [tagId: string]: {
        title?: string;
        desc?:  string;
    }
}

export class DataTagCategory
{
    categoryTitle: string;
    tags: DataTags;
}