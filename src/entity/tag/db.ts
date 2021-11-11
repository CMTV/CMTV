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
}