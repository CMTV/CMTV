import { ProcessGroup } from "@cmtv/processes";

import { UtilDataYear } from "src/entity/year/data";

// Процессы
import { FillTimeReports } from "./FillTimeReports";
import { FillCheckReports } from "./FillCheckReports";
import { FillEventReports } from "./FillEventReports";
import { FillCounterReports } from "./FillCounterReports";
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