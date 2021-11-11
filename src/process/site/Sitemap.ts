import { Process } from "@cmtv/processes";

import { Global } from "src/Global";
import { IO } from "src/util/IO";

class Sitemap extends Global
{
    urls: string[];

    reset()
    {
        this.urls = [];
    }
}

export const SITEMAP = new Sitemap;

export class WriteSitemap extends Process
{
    processName = () => 'Запись карты сайта';

    process()
    {
        let urls = '';

        SITEMAP.urls.forEach((url, i) =>
        {
            if (i !== 0) urls += '\n    ';
            urls += `<url><loc>${url}</loc></url>`;
        });

        let sitemapTemplate = IO.readFile('site/_root/_sitemap.xml');

        IO.writeFile('dist/sitemap.xml', sitemapTemplate.replace('{{ links }}', urls));
    }
}