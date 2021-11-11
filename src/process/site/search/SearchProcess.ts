import { Process } from "@cmtv/processes";

export abstract class SearchProcess extends Process
{
    static lzutf8 = require('site/vendor/lzutf8/lzutf8.min.js');

    projectIdMap: ProjectIdMap;
    tagIdMap: TagIdMap;

    constructor(projectIdMap: ProjectIdMap, tagIdMap: TagIdMap = null)
    {
        super();
        this.projectIdMap = projectIdMap;
        this.tagIdMap = tagIdMap;
    }

    static compress(data)
    {
        let compressed = JSON.stringify(data);
            compressed = this.lzutf8.compress(compressed, { outputEncoding: 'BinaryString' });

        return compressed;
    }
}

export class ProjectIdMap
{
    [projectId: string]: number
}

export class TagIdMap
{
    [tagId: string]: number
}