import { CONFIG } from "src/Config";
import { UtilDataProject } from "src/entity/project/data";
import { SITEMAP } from "src/process/site/Sitemap";
import { paint, paintProject } from "src/util/Paint";
import * as pre from "src/util/preprocessor";

export abstract class Page
{
    abstract pageName;
    abstract dest(): string;

    //#region Code

    hasStyle = true;
    hasScript = false;

    compile()
    {
        if (!this.ogImg && this.seo)
            this.ogImg = new PageOgImg(this.pageName, this.seo.title);

        SITEMAP.urls.push(CONFIG.getUrl() + '/' + this.dest().replace('/index.html', ''));
        pre.Layout.compile(`pages/${this.pageName}.pug`, this, this.dest());
    }

    //#endregion

    //#region View

    config =    CONFIG;
    seo =       new PageSEO;
    ogImg: PageOgImg;

    canonical = () => (CONFIG.getUrl() + '/' + this.dest()).replace('index.html', '');
    bodyClass = () => this.pageName;

    //#endregion
}

export class PageSEO
{
    title:          string;
    isFullTitle:    boolean;

    desc:           string;
    keywords:       string;

    getTitle()
    {
        let title = this.title;

        if (!this.isFullTitle)
            title += ' — Петр Радько';
        
        return title;
    }

    getKeywords()
    {
        let defaultKeywords = [
            'Петр Радько',
            'CMTV'
        ];

        return defaultKeywords.concat(this.keywords || []);
    }
}

export class PageOgImg
{
    id:         string;
    title:      string;
    iconPath:   string;
    url:        string;

    constructor(id: string, title: string = null, projectId: string = null)
    {
        this.id =       id;
        this.title =    title;

        if (projectId)
            this.iconPath = 'data/projects/list/' + projectId + '/icon.' + UtilDataProject.getIconExt(projectId);

        if (!CONFIG.devMode && title)
        {
            let dest = 'dist/site/graphics/og-images/' + this.id + '.jpeg';

            if (!projectId)
                paint(title, dest);
            else
                paintProject(this.iconPath, title, dest);
        }

        this.url = CONFIG.getUrl() + '/' + 'site/graphics/og-images/' + this.id + '.jpeg';
    }
}