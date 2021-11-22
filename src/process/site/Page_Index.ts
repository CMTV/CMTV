import { Process } from "@cmtv/processes";

import { IO } from "src/util/IO";
import { PageIndex } from "src/page/PageIndex";
import { DataMyInfo } from "src/entity/me/data";
import { ViewMyInfoFact, ViewMyInfoSocialItem } from "src/entity/me/view";
import { UtilMisc } from "src/util/Misc";
import { ViewCounter } from "src/entity/counter/view";
import { ViewTimeChart } from "src/entity/timeChart/view";
import { Translator } from "src/translator/Translator";
import { NON_EMPTY_YEARS } from "./Page_Life";

export class Page_Index extends Process
{
    processName = () => 'Сборка главной страницы';

    process()
    {
        let page = new PageIndex;

        page.maxAge = 100;

        // !!! ЗАМЕНИТЬ КОНКРЕТНЫМ ВОЗРАСТОМ ДЛЯ ОСТАНОВКИ ПРОГРЕССА !!!
        page.age = new Date( Date.now() - (new Date("1998.04.22").getTime()) ).getUTCFullYear() - 1970;

        let dataInfo: DataMyInfo = JSON.parse(IO.readFile('data/me/info.json'));
        page.social = ViewMyInfoSocialItem.fromDataInfo(dataInfo);

        let ageFact = new ViewMyInfoFact;
            ageFact.id =    'age';
            ageFact.label = 'Возраст';
            ageFact.data =  page.age;
            ageFact.data += ' ' + UtilMisc.pluralTitle(+ageFact.data, ['год', 'года', 'лет']);

        page.facts = ViewMyInfoFact.fromDataInfo(dataInfo);
        page.facts.splice(0, 0, ageFact);

        page.about = Translator.renderAll(IO.readFile('data/me/about.md'));

        page.years = NON_EMPTY_YEARS;

        page.counters = ViewCounter.getAll();

        let projectCounter = ViewCounter.getProjectCounter();
        page.counters.splice(0, 0, projectCounter);

        page.tagChart = ViewTimeChart.forIndex();

        page.compile();
    }
}