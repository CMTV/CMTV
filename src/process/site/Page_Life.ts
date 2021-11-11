import { Process } from "@cmtv/processes";
import { ViewCounter } from "src/entity/counter/view";

import { UtilDataYear } from "src/entity/year/data";
import { UtilViewYear, ViewYearKeyProject, ViewYearPreview } from "src/entity/year/view";

import { PageLife } from "src/page/PageLife";

export class Page_Life extends Process
{
    processName = () => 'Сборка страницы со списком годов';

    process()
    {
        let page = new PageLife;
        let years = UtilDataYear.getYears();

        page.years = years.map(year =>
        {
            this.stage = 'Обработка года ' + year;

            let yearPreview = new ViewYearPreview;
                yearPreview.year = year;
                yearPreview.time = UtilViewYear.getYearTime(year);
                yearPreview.counters = ViewCounter.getAll(year);
                yearPreview.projects = ViewYearKeyProject.getAll(year);

            return yearPreview;
        });

        page.compile();
    }
}