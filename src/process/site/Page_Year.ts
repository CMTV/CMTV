import { Process } from "@cmtv/processes";

import { UtilViewCounterItem, ViewCounter } from "src/entity/counter/view";
import { ViewTimeChart } from "src/entity/timeChart/view";
import { ViewTimeline } from "src/entity/timelineFragment/view";
import { UtilDataYear } from "src/entity/year/data";
import { ViewYearResult } from "src/entity/year/view";
import { PageOgImg } from "src/page/Page";
import { PageYear } from "src/page/PageYear";

export class Page_Year extends Process
{
    processName = () => 'Сборка страниц отдельных годов';

    process()
    {
        let years = UtilDataYear.getYears();

        years.forEach(year =>
        {
            let page = new PageYear;
                page.year = year;

                page.seo.title = year;
                page.seo.desc = `Основные итоги, проекты, хронокарта и распределение времени за ${year} год.`;

                page.ogImg = new PageOgImg(page.pageName, year + ' год');

                let dataResults = UtilDataYear.getResults(year);
                if (dataResults)
                    page.results = dataResults.map(dataResult => new ViewYearResult(dataResult));

                page.counters = ViewCounter.getAll(year);
                if (page.counters)
                {
                    page.counterData = [];
                    page.counters.forEach(counter =>
                    {
                        let counterData = UtilViewCounterItem.getCounterDataForYear(counter.counterId, year);
                        if (counterData)
                            page.counterData.push(counterData);
                    });
                }

                page.timeline = ViewTimeline.forYear(year);
                page.tagChart = ViewTimeChart.forYear(year);

            page.compile();
        });
    }
}