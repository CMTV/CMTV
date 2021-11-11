import { ViewYearPreview } from "src/entity/year/view";
import { Page } from "./Page";

export class PageLife extends Page
{
    pageName = 'life';
    dest = () => `life/index.html`;

    years: ViewYearPreview[];

    constructor()
    {
        super();

        this.seo.title = 'Жизнь';
        this.seo.desc = 'Вся моя жизнь в виде списка годов с итогами, достижениями и основными проектами.';
    }
}