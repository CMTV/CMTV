import { Toggler } from "../global/toggler";
import type { WorkerResponse } from "../workers/search";

//#region Worker
//
//

export enum WorkerRequestType
{
    /** Выполнить новый поиск */
    Search = 'search',

    /** Запросить больше результатов предыдущего поиска */
    More = 'more'
}

export abstract class WorkerRequest
{
    /** Нужно для определения актуальности ответа от воркера */
    id: number;
    type: WorkerRequestType;
}

export class WorkerSearchRequest extends WorkerRequest
{
    type = WorkerRequestType.Search;
    text: string;
    tags: string[];
}

export class WorkerMoreRequest extends WorkerRequest
{
    type = WorkerRequestType.More;
}

class SearchWorker
{
    private RID = 0;
    private worker: Worker;

    constructor(callback: (resultHTML: string) => void)
    {
        this.worker = new Worker('/site/scripts/workers/search.js');
        this.worker.addEventListener('message', e =>
        {
            let response: WorkerResponse = e.data;
            
            if (response.id !== this.RID)
                return;

            callback(response.resultHTML);
        });
    }

    requestSearch(searchText: string, searchTags: string[])
    {
        let request = new WorkerSearchRequest;
            request.id = ++this.RID;
            request.text = searchText;
            request.tags = searchTags;
        
        this.worker.postMessage(request);
    }

    requestMore()
    {
        let request = new WorkerMoreRequest;
            request.id = ++this.RID;
        
        this.worker.postMessage(request);
    }
}

//
//
//#endregion

//#region Search Block
//
//

class Search
{
    filterTags:     string[];
    tagMap:         { [tagId: string]: Element };

    value:          string;

    root:           Element;
    input:          HTMLInputElement;
    filterBtn:      Element;
    filterPane:     Element;
    filterEmpty:    Element;
    selectPane:     Element;

    onSearchUpdate: (text: string, tags: string[]) => void;

    constructor()
    {
        this.root = document.querySelector('main > .search');
        
        this.input =        this.root.querySelector('.main > input');

        this.filterBtn =    this.root.querySelector('.filterBtn');
        this.filterPane =   this.root.querySelector('.filter');
        this.filterEmpty =  this.filterPane.querySelector('.emptyFilter');

        this.selectPane =   this.root.querySelector('.tags');

        //

        let inputTimeout;
        let inputPrevious;
        this.input.addEventListener('input', () =>
        {
            clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() =>
            {
                this.value = this.input.value.trim();

                if (this.value !== inputPrevious)
                    this.triggerSearchUpdate();

                inputPrevious = this.value;
            }, 200);
        });

        //

        this.filterTags = [];

        this.filterBtn.addEventListener('click', () =>
        {
            if (!this.root.classList.contains('_selectTags'))
                this.root.classList.add('_filterTags', '_selectTags');
            else
            {
                this.root.classList.remove('_selectTags');
                if (this.filterPane.children.length === 1)
                    this.root.classList.remove('_filterTags');
            }
        });

        //

        this.tagMap = {};

        this.selectPane.querySelectorAll('.tag[data-id]').forEach(tag =>
        {
            let tagId = tag.getAttribute('data-id');
            this.tagMap[tagId] = tag;

            tag.addEventListener('click', () =>
            {
                this.updateFilterTags(tagId, !tag.classList.contains('_selected') ? 'add' : 'remove');
            });
        });

        //
    }

    updateFilterTags(tagId: string, action: 'add' | 'remove')
    {
        if (action === 'add')
            if (this.filterTags.includes(tagId))
                return;
        
        if (action === 'remove')
            if (!this.filterTags.includes(tagId))
                return;

        //

        if (action === 'add')
        {
            let filterTag = document.createElement('div');
                filterTag.classList.add('filterTag');
                filterTag.setAttribute('data-id', tagId);
                filterTag.innerHTML = tagId;
                filterTag.addEventListener('click', () => this.updateFilterTags(tagId, 'remove'));
            
            this.filterTags.push(tagId);
            this.filterPane.appendChild(filterTag);
        }

        if (action === 'remove')
        {
            this.filterTags = this.filterTags.filter(value => value !== tagId);
            this.filterPane.querySelector(`[data-id="${tagId}"]`).remove();
        }

        this.tagMap[tagId].classList.toggle('_selected', action === 'add');

        //

        this.triggerSearchUpdate();

        //

        if (this.filterTags.length === 0)
        {
            this.filterPane.querySelectorAll(':not(.emptyFilter)').forEach(filterTag => filterTag.remove());
            this.filterEmpty.removeAttribute('style');

            if (!this.root.classList.contains('_selectTags'))
                this.root.classList.remove('_filterTags');
        }
        else
            this.filterEmpty.setAttribute('style', 'display: none');
    }
    
    triggerSearchUpdate()
    {
        this.onSearchUpdate(this.value, this.filterTags);
    }
}

// Переключение типов тегов
window.addEventListener('load', () =>
{
    let togglers: Toggler[] = [];

    document.querySelectorAll('main > .search > .tags > .tagTypes > .tagType').forEach(tagTypeElem =>
    {
        let tagType = tagTypeElem.getAttribute('data-type');
        let tagList = document.querySelector(`main > .search > .tags > .tagLists > .tagList[data-type="${tagType}"]`);

        let toggler = new Toggler(tagTypeElem, tagList);
            toggler.clickCallback = () =>
            {
                togglers.forEach(toggler => toggler.setState(false));
                return true;
            };

        togglers.push(toggler);
    });
});

//
//
//#endregion

class SearchResults
{
    searching:      Element;
    searchFailed:   Element;
    results:        Element;

    constructor()
    {
        this.searching = document.querySelector('main > .searching');
        this.searchFailed = document.querySelector('main > .searchFailed');
        this.results = document.querySelector('main > .searchResults');
    }

    toggleLoading(loading: boolean)
    {
        this.searching.classList.toggle('_showing', loading);
    }

    toggleFailed(failed: boolean)
    {
        this.searchFailed.classList.toggle('_showing', failed);
    }

    clearResults()
    {
        this.results.innerHTML = '';
    }

    addResult(htmlResult: string)
    {
        this.results.innerHTML += htmlResult;

        if (htmlResult && htmlResult.length > 0)
            this.shouldLoadMore();
    }

    shouldLoadMore()
    {
        return (document.documentElement.scrollTop + window.innerHeight) / document.documentElement.scrollHeight >= 0.8;
    }
}

window.addEventListener('load', () =>
{
    let loadingMore = false;
    let isEnd = false;

    let search = new Search;
    let searchResults = new SearchResults;

    document.addEventListener('scroll', maybeLoadMore);

    let searchWorker = new SearchWorker(htmlResult => {
        
        loadingMore = false;
        searchResults.toggleLoading(false);

        isEnd = htmlResult.charAt(0) === '!';

        if (htmlResult !== '')
        {
            if (isEnd)
                htmlResult = htmlResult.substring(1);

            searchResults.addResult(htmlResult);

            if (!isEnd)
                maybeLoadMore();
        }
        else
        {
            if (searchResults.results.innerHTML === '')
                searchResults.toggleFailed(true);
        }
    });

    // Запускаем пустой поиск для начальных результатов
    searchWorker.requestSearch('', []);

    search.onSearchUpdate = (text, tags) =>
    {
        searchResults.toggleFailed(false);
        searchResults.toggleLoading(true);

        searchResults.clearResults();
        searchWorker.requestSearch(text, tags);
    };

    function maybeLoadMore()
    {
        if (!isEnd && !loadingMore && searchResults.shouldLoadMore())
        {
            loadingMore = true;
            searchResults.toggleLoading(true);
            searchWorker.requestMore();
        }
    }
});