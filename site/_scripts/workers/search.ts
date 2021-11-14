import type { WorkerRequest, WorkerSearchRequest } from "../pages/projects";
import type { SearchProjects } from "../../../src/process/site/search/SearchProjectResults"
import type { TagIndex } from "../../../src/process/site/search/SearchTagIndex";

importScripts(
    '/site/vendor/lzutf8/lzutf8.min.js',
    '/site/vendor/lunr/lunr.min.js',
    '/site/vendor/lunr/lunr-stemmer.min.js',
    '/site/vendor/lunr/lunr-ru.min.js',
    '/site/vendor/lunr/lunr-multi.min.js'
);

declare var LZUTF8, lunr;

//
//
//

export class WorkerResponse
{    
    id: number;
    resultHTML: string;
}

class LastSearch
{
    /** Минимальное количество возвращаемых за раз результатов поиска */
    static batchSize = 20;

    ids: number[];
    currentI: number;
    isEnd: boolean;

    reInit(numProjectIds: number[])
    {
        this.ids = numProjectIds;
        this.currentI = 0;
    }

    more()
    {
        let remains = this.ids.length - this.currentI;
        let toReturn = [];

        if (remains <= 0)
            return toReturn;

        if (remains < (LastSearch.batchSize * 3/2))
            toReturn = this.ids.slice(this.currentI);
        else
            toReturn = this.ids.slice(this.currentI, this.currentI + LastSearch.batchSize);

        this.currentI += LastSearch.batchSize;
        this.isEnd = this.currentI >= this.ids.length;

        return toReturn;
    }
}

//
//
//

class SearchData
{
    private ready = false;
    pendingCallback: any;

    tagIndex: TagIndex;
    projectIndex;
    results: SearchProjects;

    projectNumIds: number[];
    tagNumStrIds: string[];

    constructor()
    {
        let toFetch = [
            'tagIndex.json.lz',
            'projectIndex.json.lz',
            'results.json.lz'
        ];

        let promises = toFetch.map(filename =>
        {
            let url = '/site/search/' + filename;
            return fetch(url).then(response => response.text());
        });

        Promise.all(promises).then(results =>
        {
            this.tagIndex = this.decompress(results[0]);
            this.tagNumStrIds = Object.keys(this.tagIndex);

            lunr.multiLanguage('en', 'ru');
            this.projectIndex = lunr.Index.load(this.decompress(results[1]));

            this.results = this.decompress(results[2]);
            this.projectNumIds = Object.keys(this.results).map(id => +id);

            this.ready = true;

            if (this.pendingCallback)
                this.pendingCallback();

            lastSearch.ids = searchData.projectNumIds;
            lastSearch.currentI = Math.min(LastSearch.batchSize, lastSearch.ids.length);
        });
    }

    private decompress(compressed: string)
    {
        return JSON.parse(LZUTF8.decompress(compressed, { inputEncoding: 'BinaryString' }));
    }

    whenReady(callback)
    {
        if (this.ready)
        {
            callback();
            return;
        }

        this.pendingCallback = callback;
    }

    search(text: string, tags: string[]): number[]
    {
        let ids: number[] = [];
        let allowedIds = this.projectNumIds;

        tags.forEach(tagId =>
        {
            allowedIds = allowedIds.filter(id => this.tagIndex[tagId].includes(id));
        });

        let lunrResults;

        if (text && text.length > 0)
        {
            let lurnQuery = text.split(' ').map(term => term + '~1 ' + term + '*').join(' ');
            lunrResults = this.projectIndex.search(lurnQuery);
        }
        else
            lunrResults = this.projectIndex.search('');

        lunrResults.forEach(lunrResult =>
        {
            let idCandidate = +lunrResult.ref;

            if (allowedIds.includes(idCandidate))
                ids.push(idCandidate);
        });

        return ids;
    }

    getHtmlProjectById(projectNumId: number): string
    {
        let resultProject = this.results[projectNumId];
        let link = '/projects/' + resultProject.id;
        let icon = '/projects/' + resultProject.id + '/icon.' + resultProject.iconExt;
        let tags = resultProject.tagIds ? resultProject.tagIds.map(tagNumId => this.tagNumStrIds[tagNumId]).slice(0, 5) : [];

        let typeLabel = '';
        switch (resultProject.type)
        {
            case 'in': typeLabel = 'Потребитель'; break;
            case 'out': typeLabel = 'Производитель'; break;
            case 'mix': typeLabel = 'Производитель и потребитель'; break;
        }

        let html = `
            <div class="searchResult">
                <a class="icon" href="${link}">
                    <img src="${icon}" loading="lazy">
                </a>
                
                <div class="infoBlock">
                    <div class="arrows">
                        <div class="bgArrow"></div>
                        <div class="borderArrow"></div>
                    </div>

                    <div class="statusBg status--${resultProject.status}"></div>

                    <header>
                        <a class="icon" href="${link}"><img src="${icon}" loading="lazy"></a>
                        <a class="title" href="${link}">${resultProject.title}</a>
                    </header>

                    <div class="desc">${resultProject.desc}</div>

                    <footer>
                        <img class="type" title="${typeLabel}" src="/site/graphics/${resultProject.type}.svg">
                        ${ tags.length > 0 ? `<i class="fa-solid fa-hashtag"></i>` + tags.map(tagId => `<div class="tag">${tagId}</div>`).join('') : ''}
                    </footer>
                </div>
            </div>
        `;

        return html.trim();
    }
}

//
//
//

let worker = (self as any as Worker);
let searchData = new SearchData;
let lastSearch = new LastSearch;

onmessage = (e) =>
{
    let request: WorkerRequest = e.data;

    // console.log(request); /* Remove */

    searchData.whenReady(() =>
    {
        if (request.type === 'search')
        {
            let searchRequest = request as WorkerSearchRequest;
            lastSearch.reInit(searchData.search(searchRequest.text, searchRequest.tags));
        }

        let batchIds = lastSearch.more();

        let response = new WorkerResponse;
            response.id = request.id;
            response.resultHTML = batchIds.map(id => searchData.getHtmlProjectById(id)).join('');

        if (response.resultHTML !== '' && lastSearch.isEnd)
            response.resultHTML = '!' + response.resultHTML;

        //setTimeout(() => { worker.postMessage(response); }, 500); 
        worker.postMessage(response);
    });
}