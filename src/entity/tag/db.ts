import { Column, Entity, PrimaryKey, Table } from "sqlean";

@Table('tag')
export class DbTag extends Entity
{
    @PrimaryKey
    @Column
    tagId: string;

    @Column
    type: string;

    @Column
    title: string;

    @Column
    desc: string;

    @Column
    tagCategoryId: string;
}

@Table('tag_category')
export class DbTagCategory extends Entity
{
    @PrimaryKey
    @Column
    tagCategoryId: string;

    @Column
    title: string;

    @Column
    displayOrder: number;
}