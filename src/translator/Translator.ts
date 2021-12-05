import sizeOf from "image-size";

//
//
//

const mdIt = require('markdown-it')({
    html:           true,
    subscript:      false,
    superscript:    false,
    typographer:    true,
    quotes:         '«»""'
});

mdIt.use(require('markdown-it-attrs'), {
    leftDelimiter: '{:'
});

//
//
//

export class Translator
{
    static extra;

    static renderAll(str: string, extra = null): string
    {
        if (!str) return str;

        this.extra = extra;        

        str = this.renderProjectLinks(str);
        
        str = Image.renderGalleries(str, extra);
        str = Image.renderSingles(str, extra);

        str = this.renderMd(str);

        return str;
    }

    //

    static renderProjectLinks(str: string): string
    {
        let regexp = /\[(.*)\]\(p:(.+?)\)/gm;

        return str.replace(regexp, (match, label, projectId) =>
        {
            return `[${label}](/projects/${projectId}){:target="_blank"}`;
        });
    }

    static renderMd(str: string): string
    {
        return mdIt.render(str);
    }
}

//#region Image
//
//

class Image
{
    static imgRegexp = /!\[(.*)\]\((.+)\)(?:{:(.*)}|)/gm;
    static galleryRegexp = /^<gallery>$[\s\S]+?^<\/gallery>$/gm;

    static renderSingles(str: string, extra = null): string
    {
        return str.replace(this.imgRegexp, (match, alt, src) =>
        {
            if (!extra?.projectId)
                return match;

            let imgHtml = this.getImgHtml(match).replace('<img', '<img loading="lazy"');
            let size = this.getSize(`data/projects/list/${extra.projectId}/` + src);
            let sizeHtml = size ? `data-pswp-single data-pswp-width="${size.width}" data-pswp-height="${size.height}"` : '';

            return `<p><a href="${src}" target="_blank" ${sizeHtml}>${imgHtml}</a></p>`;
        });
    }

    static renderGalleries(str: string, extra = null): string
    {
        return str.replace(this.galleryRegexp, match =>
        {
            let images = match.split('\n');
                images.pop();
                images.shift();
            
            let imagesHtml = images.map(image =>
            {
                return image.replace(this.imgRegexp, (match, alt, src) =>
                {
                    if (!extra?.projectId)
                        return match;
    
                    let imgHtml = this.getImgHtml(match).replace('<img', '<img loading="lazy"');
                    let size = this.getSize(`data/projects/list/${extra.projectId}/` + src);
                    let sizeHtml = size ? `data-pswp-width="${size.width}" data-pswp-height="${size.height}"` : '';
        
                    return `<a href="${src}" target="_blank" ${sizeHtml}><div class="hoverOverlay"><i class="fa-solid fa-eye"></i></div>${imgHtml}</a>`;
                });
            });

            return `<div data-pswp-gallery>${imagesHtml.join('')}</div>`;
        });
    }

    static getImgHtml(str: string): string
    {
        let html = Translator.renderMd(str);
            html = html.replace('<p>', '').replace('</p>', '');

        return html;
    }

    static getSize(src: string): { width: number, height: number }
    {
        let size;

        try
        {
            let imgData = sizeOf(src);

            size = {};
            size.width = imgData.width;
            size.height = imgData.height;
        }
        catch {}

        return size;
    }
}

//
//
//#endregion