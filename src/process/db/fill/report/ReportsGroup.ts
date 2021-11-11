import { ProcessGroup } from "@cmtv/processes";

import { FillCounterReports } from "./FillCounterReports";
import { FillEventReports } from "./FillEventReports";
import { FillTimeReports } from "./FillTimeReports";
import { UtilDataYear } from "src/entity/year/data";
import { FillCheckReports } from "./FillCheckReports";
import { FillReportTimelineFragments } from "./FillReportTimelineFragments";

export class ReportGroup extends ProcessGroup
{
    groupName = () => 'Отчеты';

    processes()
    {
        let years = UtilDataYear.getYears();

        return [
            new FillTimeReports(years),
            new FillCheckReports(years),
            new FillEventReports(years),
            new FillCounterReports(years),
            new FillReportTimelineFragments
        ];
    }
}