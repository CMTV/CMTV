import { Page, PageOgImg } from "./Page";
import { ViewMyInfoFact, ViewMyInfoSocialItem } from "src/entity/me/view";
import { ViewCounter } from "src/entity/counter/view";
import { ViewTimeChart } from "src/entity/timeChart/view";

export class PageIndex extends Page
{
    pageName = 'index';
    dest = () => 'index.html';

    maxAge: number;
    age: number;

    facts:  ViewMyInfoFact[];
    about:  string;
    social: ViewMyInfoSocialItem[];

    years:  string[];

    counters: ViewCounter[];

    tagChart: ViewTimeChart;

    constructor()
    {
        super();

        this.seo.title = 'Петр Радько';
        this.seo.isFullTitle = true;

        // Вырезать кусок из абзаца обо мне.
        this.seo.desc = 'Информация обо мне, ссылки на социальные сети, статистика по проектам, целям и счетчикам, распределение времени по направлениям.';

        this.ogImg = new PageOgImg('index');
    }
}