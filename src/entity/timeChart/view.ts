import { Db } from "sqlean";
import { UtilDate } from "src/util/Date";
import { DbTimeReport } from "../report/db";
import { DbTag } from "../tag/db";
import { ViewTag } from "../tag/view";

export class ViewTimeChart
{
    area:   ViewTimeChartFrac[];
    action: ViewTimeChartFrac[];
    form:   ViewTimeChartFrac[];

    static forProject(projectId: string)
    {
        let reportIds = Db.Select.All({
            table:      'report_time',
            columns:    ['reportId'],
            where:      ['@projectId', '=', projectId],
            pluck:      true
        });

        return this.fromReports(reportIds);
    }

    static forYear(year: string)
    {
        let reportIds = Db.Select.All({
            table:      'report_time',
            columns:    ['reportId'],
            where:      ['@date', 'LIKE', year + '%'],
            pluck:      true
        });

        return this.fromReports(reportIds);
    }

    static forIndex()
    {
        let reportIds = Db.Select.All({
            table:      'report_time',
            columns:    ['reportId'],
            pluck:      true
        });

        return this.fromReports(reportIds);
    }

    static fromReports(reportIds: number[])
    {
        let chart = new ViewTimeChart;

        if (!reportIds) return null;

        let reports = reportIds.map(reportId => DbTimeReport.getById(reportId));
        let chartTags = ChartTag.fromReports(reports);

        ['area', 'action', 'form'].forEach(tagCategory =>
        {
            let categoryTags = chartTags.filter(tag => tag.type === tagCategory);
            let fracs = ViewTimeChartFrac.fromChartTags(categoryTags);

            chart[tagCategory] = (fracs.length > 0 ? fracs : null);
        });

        if (!chart.area && !chart.action && !chart.form) return null;

        return chart;
    }
}

export class ViewTimeChartFrac
{
    class:      string;
    label:      string;
    tooltip:    string;

    hours:      number;
    width:      number;

    setHours(hours: number, max: number)
    {
        this.hours = parseFloat(hours.toFixed(2));
        this.width = parseFloat((hours * 100 / max).toFixed(2));
    }

    // Static

    static fromChartTags(tags: ChartTag[], maxFracs = 8): ViewTimeChartFrac[]
    {
        tags = tags.sort((a, b) => b.duration - a.duration);

        let max = 0;
        tags.forEach(tag => max += tag.duration);

        let fracs: ViewTimeChartFrac[] = [];
        let otherDesc = '';
        let otherDuration = 0;

        tags.forEach((tag, i) =>
        {
            if (i < maxFracs)
            {
                let frac = new ViewTimeChartFrac;
                    frac.class =    tag.id;
                    frac.label =    tag.title;
                    frac.tooltip =  UtilDate.getFancyTime(tag.duration) || '~0';
                    frac.setHours(tag.duration, max);
                
                fracs.push(frac);
            }
            else
            {
                otherDesc += tag.title + '; ';
                otherDuration += tag.duration;
            }
        });

        if (tags.length > maxFracs)
        {
            let otherFrac = new ViewTimeChartFrac;
                otherFrac.class =   'other';
                otherFrac.label =   'Другое';
                otherFrac.tooltip = otherDesc.trim() + '&#13;' + (UtilDate.getFancyTime(otherDuration) || '~0');
                otherFrac.setHours(otherDuration, max);

            fracs.push(otherFrac);
        }

        return fracs;
    }
}

class ChartTag
{
    id:         string;
    title:      string;
    type:       string;
    duration:   number;

    constructor(tagId: string, duration: number)
    {
        let dbTag = DbTag.getById(tagId);

        this.id =       dbTag.tagId;
        this.title =    (new ViewTag(dbTag)).getTitle();
        this.type =     dbTag.type;
        this.duration = duration;
    }

    // Static

    static fromReports(reports: DbTimeReport[]): ChartTag[]
    {
        let idChartTagMap = {};

        reports.forEach(report =>
        {
            if (!report.tags) return;

            report.tags.forEach(tagId =>
            {
                if (!idChartTagMap[tagId])
                    idChartTagMap[tagId] = new ChartTag(tagId, report.duration);
                else
                    idChartTagMap[tagId].duration += report.duration;
            });
        });

        return Object.values(idChartTagMap);
    }
}