import { Page } from "./Page";
import { ViewYearResult } from "src/entity/year/view";
import { ViewCounter } from "src/entity/counter/view";
import { ViewTimeChart } from "src/entity/timeChart/view";
import { ViewTimeline } from "src/entity/timelineFragment/view";

export class PageYear extends Page
{
    pageName = 'year';
    hasScript = true;

    year:           string;
    results:        ViewYearResult[];

    counters:       ViewCounter[];
    counterData:    any[];

    timeline:       ViewTimeline;
    tagChart:       ViewTimeChart;

    dest = () => `life/${this.year}/index.html`;
}