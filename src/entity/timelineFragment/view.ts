import { Db } from "sqlean";

import { DbGoal } from "src/entity/goal/db";
import { DbTimelineFragment } from "src/entity/timelineFragment/db";
import { UtilDate } from "src/util/Date";
import { DbProject } from "../project/db";
import { ProjectIcon } from "../project/global";

export class ViewTimeline
{
    groupRows: GroupRow[];

    static forProject(projectId: string)
    {
        let yearGroups = Fragment.forProject(projectId);
        if (!yearGroups) return null;

        let groupRows: GroupRow[] = [];

        Object.keys(yearGroups).forEach(year =>
        {
            let yearFragments = yearGroups[year];
            
            let groupRow = new GroupRow;
                groupRow.type = 'year';
                groupRow.data = year;
                groupRow.rows = Row.fragmentsToRows(yearFragments);
            
            groupRows.push(groupRow);
        });

        let timeline = new ViewTimeline;
            timeline.groupRows = groupRows;
        
        return timeline;
    }

    static forYear(year: string)
    {
        let projectGroups = Fragment.forYear(year);
        if (!projectGroups) return null;

        let groupRows: GroupRow[] = [];

        Object.keys(projectGroups).forEach(project =>
        {
            let projectFragments = projectGroups[project];

            let data = {};
                data['link'] =  `/projects/${project}`;
                data['icon'] =  new ProjectIcon(project);
                data['title'] = DbProject.getById(project, ['title']).title;

            let groupRow = new GroupRow;
                groupRow.type = 'project';
                groupRow.data = data;
                groupRow.rows = Row.fragmentsToRows(projectFragments);

            groupRows.push(groupRow);
        });

        let timeline = new ViewTimeline;
            timeline.groupRows = groupRows;
        
        return timeline;
    }
}

export class GroupRow
{
    type: 'year' | 'project';
    data: any;
    rows: Row[];
}

export class Row
{
    fragments: Fragment[];

    static fragmentGapFrac = 1;

    static fragmentsToRows(fragments: Fragment[]): Row[]
    {
        fragments = fragments.sort((a, b) => a.left - b.left);
    
        let rows: Row[] = [];

        fragments.forEach(fragment =>
        {
            let pushed = false;

            for (let i = 0; i < rows.length; i++)
            {
                let row = rows[i];

                if (row.fragments.length === 0)
                {
                    pushed = true;
                    row.fragments.push(fragment);
                    break;
                }

                let lastFragment = row.fragments[row.fragments.length - 1];

                if (fragment.goalNum === lastFragment.goalNum)
                {
                    pushed = true;
                    fragment.showGoalNum = false;
                    row.fragments.push(fragment);
                    break;
                }

                if (fragment.left >= lastFragment.left + lastFragment.width + Row.fragmentGapFrac)
                {
                    pushed = true;

                    if (fragment.goalNum === lastFragment.goalNum)
                        fragment.showGoalNum = false;

                    row.fragments.push(fragment);
                    break;
                }
            }

            if (!pushed)
            {
                let newRow = new Row;
                    newRow.fragments = [fragment];
                
                rows.push(newRow);
            }
        });

        return rows;
    }
}

export class Fragment
{
    goalNum:        string;
    status:         string;
    type:           string;
    label:          string;

    single:         boolean;
    left:           number;
    width:          number;

    showGoalNum:    boolean = true;

    setPosition(start: string, end: string)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    {
        if (!end || (start === end))
            this.single = true;
        
        let totalDays = UtilDate.getDaysInYear(start);
        
        this.left = (UtilDate.getDayInYear(start) / totalDays) * 100;
        
        if (end)
            this.width = ((UtilDate.getDayInYear(end) / totalDays) * 100) - this.left;
    }

    //
    //
    //

    static fromDbFragment(dbFragment: DbTimelineFragment)
    {
        let dbGoal = DbGoal.getById(dbFragment.goalId);
        let fragment = new Fragment;

            fragment.goalNum =  dbGoal ? '' + dbGoal.orderNumber : '?';
            fragment.status =   dbGoal ? dbGoal.status : JSON.parse(Db.Select.Get({ table: 'project', columns: ['status'], where: ['@projectId', '=', dbFragment.projectId], pluck: true })).type;
            fragment.type =     dbFragment.type;
            fragment.label =    UtilDate.toStrDate(dbFragment.start, false) + (dbFragment.end ? ' - ' + UtilDate.toStrDate(dbFragment.end, false) : '') + '&#13;' + (dbGoal ? dbGoal.title : 'Неизвестно');

            fragment.setPosition(dbFragment.start, dbFragment.end);
        
        return fragment;
    }

    static forProject(projectId: string)
    {
        let fragmentIds = Db.Select.All({
            table:      'timeline_fragment',
            columns:    ['timelineFragmentId'],
            where:      ['@projectId', '=', projectId],
            order:      { start: 'ASC' },
            pluck:      true
        });

        if (!fragmentIds) return null;

        let yearGroups = {};

        fragmentIds.map(fragmentId => DbTimelineFragment.getById(fragmentId)).forEach(dbFragment =>
        {
            let fragment = this.fromDbFragment(dbFragment);
            let year = dbFragment.year;

            if (!yearGroups[year])
                yearGroups[year] = [];
            
            yearGroups[year].push(fragment);
        });

        return yearGroups;
    }

    static forYear(year: string)
    {
        let fragmentIds = Db.Select.All({
            table:      'timeline_fragment',
            columns:    ['timelineFragmentId'],
            where:      ['@start', 'LIKE', year + '%'],
            order:      { start: 'DESC' },
            pluck:      true
        });

        if (!fragmentIds) return null;

        let projectGroups = {};

        fragmentIds.map(fragmentId => DbTimelineFragment.getById(fragmentId)).forEach(dbFragment =>
        {
            let fragment = this.fromDbFragment(dbFragment);
            let projectId = dbFragment.projectId;

            if (!projectGroups[projectId])
                projectGroups[projectId] = [];

            projectGroups[projectId].push(fragment);
        });

        return projectGroups;
    }
}