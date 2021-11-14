import { ViewListProject } from "src/entity/project/view";
import { Page, PageOgImg } from "./Page";

export class PageProjects extends Page
{
    pageName = 'projects';
    hasScript = true;
    
    dest = () => 'projects/index.html';
    
    tagMap: { [tagType: string]: string[] };

    isInitialEnd: boolean;
    initialList: ViewListProject[];

    constructor()
    {
        super();

        this.seo.title = 'Проекты';
        this.seo.desc = 'Список всех проектов, которыми я занимался за свою жизнь. Удобная поисковая система по названию или по тегам.';
    }
}