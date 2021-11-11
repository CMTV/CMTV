import glob from "glob";

import { IO } from "src/util/IO";
import { ProjectAction, ProjectExtra, ProjectFact, ProjectLink, ProjectStatus, ProjectType } from "./global";

/**
 * Базовая файловая структура проекта.
 * При необходимости можно добавлять свои папки и файлы.
 * 
 * project_dir/
 * ├─ project.json
 * ├─ icon.*
 * ├─ main.md
 * ├─ goals.json
 * ├─ blocks.md
 * ├─ showcase/
 * │  ├─ img-1.*
 * │  ├─ img-2.*
 * │  ├─ ...
 */

export class DataProject
{
    title:      string;
    desc:       string;
    type:       ProjectType;
    status:     ProjectStatus;

    date?:      string;
    start?:     string;
    end?:       string;

    facts?:     ProjectFact[];
    action?:    ProjectAction;
    links?:     ProjectLink[];
    tags?:      string[];
    related?:   DataProjectRelated[];
    extra?:     ProjectExtra;
}

export class DataProjectRelated
{
    project:    string;
    reason:     string;
}

//
//
//

export class UtilDataProject
{
    static getIds(): string[]
    {
        return glob.sync('data/projects/list/*').map(path => path.split('/').pop());
    }

    static getFeaturedIds(): string[]
    {
        return JSON.parse(IO.readFile('data/projects/featured.json'));
    }

    static getFilesToMove(projectId: string): string[]
    {
        let ignorePatterns = [
            'project.json',
            'goals.json',
            'main.md',
            'blocks.md'
        ];

        let projectDir = this.getPathTo(projectId, '');

        return glob.sync(
            projectDir + '**/*',
            {
                nodir: true,
                ignore: Object.values(ignorePatterns).map(file => projectDir + file)
            }
        );
    }

    static getPathTo(projectId: string, relPath: string): string
    {
        return `data/projects/list/${projectId}/` + relPath;
    }

    static getDataProject(projectId: string): DataProject
    {
        return JSON.parse(IO.readFile(this.getPathTo(projectId, 'project.json')));
    }

    static getIconExt(projectId: string)
    {
        return glob.sync(this.getPathTo(projectId, 'icon.*'))[0].split('.').pop();
    }
}