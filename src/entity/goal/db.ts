import { Column, Db, Entity, PrimaryKey, Table } from "sqlean";
import { AND } from "sqlean/dist/query/Where";

import { GoalProgress } from "./global";

@Table('goal')
export class DbGoal extends Entity
{
    //#region Columns

    @PrimaryKey
    @Column
    goalId: number;
    
    @Column
    projectId: string;

    @Column
    name: string;

    @Column
    orderNumber: number;

    @Column
    title: string;

    @Column
    status: string;

    @Column
    counted: boolean;

    @Column
    start: string;

    @Column
    end: string;

    @Column
    progress: GoalProgress;

    @Column
    tags: string[];

    //#endregion

    // Static

    static getGoalIdByName(projectId: string, goalName: string): number
    {
        return Db.Select.Get({
            table: 'goal',
            columns: ['goalId'],
            where: AND(['@projectId', '=', projectId], ['@name', '=', goalName]),
            pluck: true
        });
    }
}