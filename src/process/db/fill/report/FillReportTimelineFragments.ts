import { Process } from "@cmtv/processes";
import { Db } from "sqlean";

import { DbTimelineFragment, Edge } from "src/entity/timelineFragment/db";

type GoalDates = {
    [goalId: number]: string[]
}

type GoalFragments = {
    [goalId: number]: string[]
}

export class FillReportTimelineFragments extends Process
{
    processName = () => 'Добавление промежутков для хронокарты';

    process()
    {
        let fragmentId = Db.Select.Get({
            table:      'timeline_fragment',
            columns:    ['count(*)'],
            pluck:      true
        }) + 1;

        let projectIds = Db.Select.All({
            table:      'project',
            columns:    ['project_id'],
            pluck:      true
        });

        if (!projectIds) return;
        
        projectIds.forEach(projectId =>
        {
            let projectFragments: DbTimelineFragment[] = [];
            let goalFragments = this.getGoalFragments(this.getGoalDates(projectId));

            Object.keys(goalFragments).forEach(goalId =>
            {
                let strFragments = goalFragments[goalId];
                if (!strFragments) return;

                strFragments.forEach(strFragment =>
                {
                    let edges = Edge.getEdges(strFragment);

                    edges.forEach(edge =>
                    {
                        let fragment = new DbTimelineFragment;
                            fragment.timelineFragmentId = fragmentId++;
                            fragment.projectId = projectId;
                            fragment.goalId = +goalId;
                            fragment.type = 'report';
                            
                            fragment.start =    edge.start;
                            fragment.end =      edge.end;
                            fragment.year =     edge.year;

                        projectFragments.push(fragment);
                    });
                });
            });

            Db.Transaction(() => projectFragments.forEach(fragment =>
            {
                //console.log(fragment.projectId);
                //console.log(fragment.start);
                fragment.save()
            }));
        });
    }

    private getGoalDates(projectId: string): GoalDates
    {
        let goalDates: GoalDates = {};

        let timeData: { date: string, goals: string }[] = Db.Select.All({
            table:      'report_time',
            columns:    ['date', 'goals'],
            where:      ['@projectId', '=', projectId],
            order:      { date: 'ASC' }
        });

        let checkData: { date: string, goalId: number}[] = Db.Select.All({
            table:      'report_check',
            columns:    ['date', 'goalId'],
            where:      ['@projectId', '=', projectId],
            order:      { date: 'ASC' }
        });

        if (timeData)
            timeData.forEach(timeDataItem =>
            {
                let date = timeDataItem.date;
                let goalIds: number[] = timeDataItem.goals ? JSON.parse(timeDataItem.goals) : [0];

                goalIds.forEach(goalId =>
                {
                    if (!goalDates[goalId]) goalDates[goalId] = [];
                    if (!goalDates[goalId].includes(date)) goalDates[goalId].push(date);
                });
            });

        if (checkData)
            checkData.forEach(checkDataItem =>
            {
                let date =      checkDataItem.date;
                let goalId =    checkDataItem.goalId;

                if (!goalDates[goalId]) goalDates[goalId] = [];
                if (!goalDates[goalId].includes(date)) goalDates[goalId].push(date);
            });

        return goalDates;
    }

    private getGoalFragments(goalDates: GoalDates): GoalFragments
    {
        let goalFragments: GoalFragments = {};

        Object.keys(goalDates).forEach(goalId =>
        {
            let fragment = [];
            let dates =     goalDates[goalId as any as number];
            let pushReady = false;

            for (let i = 0; i < dates.length; i++)
            {
                let currDate = dates[i];
                let nextDate = dates[i + 1];

                if (!fragment[0]) fragment[0] = currDate;

                if (nextDate)
                {
                    let tomorrow = new Date(currDate);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    if ((new Date(nextDate)).getTime() === tomorrow.getTime())
                        fragment[1] = nextDate;
                    else pushReady = true;
                }
                else pushReady = true;

                if (pushReady)
                {
                    if (!goalFragments[goalId])
                        goalFragments[goalId] = [];
                
                    goalFragments[goalId].push(fragment[0] + (fragment.length > 1 ? '-' + fragment[1] : ''));

                    fragment = [];
                    pushReady = false;
                }
            }
        });

        return goalFragments;
    }
}