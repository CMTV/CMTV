import { Db } from "sqlean";

import { IO } from "src/util/IO";
import { UtilDate } from "src/util/Date";
import { DataGoalProgress, DataGoals } from "src/entity/goal/data";
import { DbGoal } from "src/entity/goal/db";
import { UtilDataProject } from "src/entity/project/data";
import { DbTimelineFragment, Edge } from "src/entity/timelineFragment/db";

import { ProjectsProcess } from "../project/ProjectsProcess";
import { GoalProgress } from "src/entity/goal/global";

export class FillGoals extends ProjectsProcess
{
    processName = () => 'Добавление целей';

    process()
    {
        let dbGoals: DbGoal[] = [];
        let dbFragments: DbTimelineFragment[] = [];
        
        let goalId = 1;
        let fragmentId = 1;

        this.projectIds.forEach(projectId =>
        {
            let pathToGoals = UtilDataProject.getPathTo(projectId, 'goals.json');

            if (!IO.exists(pathToGoals))
                return;
            
            let rawGoals = JSON.parse(IO.readFile(pathToGoals)) as DataGoals;

            Object.keys(rawGoals).forEach((goalName, i) =>
            {
                let rawGoal = rawGoals[goalName];

                let dbGoal = new DbGoal;
                    dbGoal.goalId =         goalId++;
                    dbGoal.projectId =      projectId;
                    dbGoal.orderNumber =    i + 1;
                    dbGoal.name =           goalName;
                    dbGoal.title =          rawGoal.title;
                    dbGoal.status =         rawGoal.status;
                    dbGoal.counted =        (typeof rawGoal.counted === 'boolean' ? !!rawGoal.counted : true);
                    dbGoal.progress =       GoalProgress.fromDataProgress(rawGoal.progress);
                    dbGoal.tags =           rawGoal.tags;

                dbGoal.start =  UtilDate.toStrDate(rawGoal.start);
                dbGoal.end =    UtilDate.toStrDate(rawGoal.end);

                if (rawGoal.date)
                    dbGoal.start = dbGoal.end = UtilDate.toStrDate(rawGoal.date);

                dbGoals.push(dbGoal);

                if (rawGoal.plan)
                    rawGoal.plan.forEach(strFragment =>
                    {
                        Edge.getEdges(strFragment).forEach(edge =>
                        {
                            let dbFragment = new DbTimelineFragment;
                                dbFragment.timelineFragmentId = fragmentId++;
                                dbFragment.projectId =          projectId;
                                dbFragment.goalId =             dbGoal.goalId;
                                dbFragment.type =               'wire';

                                dbFragment.start =              edge.start;
                                dbFragment.end =                edge.end;
                                dbFragment.year =               edge.year;
                            
                            dbFragments.push(dbFragment);
                        });
                    });
            });
        });

        Db.Transaction(() =>
        {
            dbGoals.forEach(dbGoal => dbGoal.save());
            dbFragments.forEach(dbFragment => dbFragment.save());
        });
    }
}