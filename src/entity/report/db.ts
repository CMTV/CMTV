import { Column, Db, Entity, PrimaryKey, Table } from "sqlean";
import { AND } from "sqlean/dist/query/Where";

@Table('report_time')
export class DbTimeReport extends Entity
{
    @PrimaryKey
    @Column
    reportId: number;

    @Column
    date: string;

    @Column
    duration: number;

    @Column
    projectId: string;

    @Column
    goals: number[];

    @Column
    tags: string[];

    // Static

    static getYearHours(year: string)
    {
        let hours = Db.Select.Get({
            table:      'report_time',
            columns:    ['sum(duration)'],
            where:      ['@date', 'LIKE', year + '%'],
            pluck:      true
        });

        return hours ? Math.ceil(hours) : 0;
    }
}

//
//
//

@Table('report_check')
export class DbCheckReport extends Entity
{
    @PrimaryKey
    @Column
    reportId: number;

    @Column
    date: string;

    @Column
    projectId: string;

    @Column
    goalId: number;
}

//
//
//

@Table('report_counter')
export class DbCounterReport extends Entity
{
    @PrimaryKey
    @Column
    reportId: number;

    @Column
    date: string;

    @Column
    counterId: string;

    @Column
    value: number;

    @Column
    projectId: string;

    @Column
    desc: string;
}

//
//
//

@Table('report_event')
export class DbEventReport extends Entity
{
    @PrimaryKey
    @Column
    reportId: number;

    @Column
    date: string;

    @Column
    title: string;

    @Column
    desc: string;
}