import { Column, Db, Entity, PrimaryKey, Table } from "sqlean";

@Table('counter')
export class DbCounter extends Entity
{
    @PrimaryKey
    @Column
    counterId: string;

    @Column
    icon: string;

    @Column
    title: string;

    @Column
    displayOrder: number;

    // Static

    static getIds(): string[]
    {
        let ids = Db.Select.All({
            table:      'counter',
            columns:    ['counterId'],
            order:      { displayOrder: 'ASC' },
            pluck:      true
        });

        return ids || [];
    }
}