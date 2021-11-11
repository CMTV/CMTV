import { Page } from "./Page";

export class PageTest extends Page
{
    pageName = 'test';
    dest = () => 'test/index.html';

    constructor()
    {
        super();

        this.seo.title = 'Тест';
        this.seo.desc = 'Тестовая страница для всяких тестов.'
    }
}