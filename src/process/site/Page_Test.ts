import { Process } from "@cmtv/processes";

import { PageTest as Page } from "src/view/page/PageTest";

export class Page_Test extends Process
{
    processName = () => 'Сборка тестовой страницы';

    process()
    {
        let page = new Page;
        page.compile();
    }
}