import { Column, Entity, PrimaryKey, Table } from "sqlean";

import { UtilDate } from "src/util/Date";

@Table('timeline_fragment')
export class DbTimelineFragment extends Entity
{
    @PrimaryKey
    @Column
    timelineFragmentId: number;

    @Column
    projectId: string;

    @Column
    goalId: number;

    @Column
    type: string;

    @Column
    year: number;

    @Column
    start: string;

    @Column
    end: string;
}

export class Edge
{
    year:   number;
    start:  string;
    end:    string;

    constructor(start: string, end: string = null)
    {
        this.year =     UtilDate.getYear(start);
        this.start =    start;
        this.end =      end;
    }

    static getEdges(strFragment: string): Edge[]
    {
        let start, end;
        let arrFragment = strFragment.split('-').map(date => UtilDate.toStrDate(date));

        start = arrFragment[0];

        if (arrFragment.length === 1)
            return [new Edge(start)];

        end = arrFragment[1];
        
        let startYear = UtilDate.getYear(start);
        let yearDiff =  UtilDate.getYear(end) - startYear;

        if (yearDiff === 0) return [new Edge(start, end)];
    
        let edges = [];

        for (let i = 0; i <= yearDiff; i++)
        {
            if (i === 0)
            {
                edges.push(new Edge(start, startYear + '.12.31'));
                continue;
            }

            let currentYear = startYear + i;

            if (i === yearDiff)
                edges.push(new Edge(currentYear + '.01.1', (end === currentYear + '.01.1') ? null : end));
            else
                edges.push(new Edge(currentYear + '.01.1', currentYear + '.12.31'));
        }

        return edges;
    }
}