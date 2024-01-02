import glob from "glob";
import YAML from "yaml";

import { IO } from "src/util/IO";
import { BUILD_CONFIG } from "src/BuildConfig";
import { ProjectAction, ProjectExtra, ProjectFact, ProjectLink, ProjectStatus, ProjectType } from "./global";
import { DataGoals } from "../goal/data";

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
    related?:   DataProjectRelation[];
    extra?:     ProjectExtra;
}

export class DataProjectRelation
{
    relatedId:  string;
    type:       string;
    reason?:    string;
    inverse?:   boolean;
}

//
//
//

export class UtilDataProject
{
    static getIds(): string[]
    {
        let projectIds = glob.sync('data/projects/list/*/project.@(json|yml)').map(projectPath =>
        {
            let arr = projectPath.split('/');
            arr.pop(); // Пропускаем файл `project.json`

            return arr.pop();
        });

        projectIds = projectIds.filter(projectId => BUILD_CONFIG.projectAllowed(projectId));

        return projectIds;
    }

    static getFeaturedIds(): string[]
    {
        return JSON.parse(IO.readFile('data/projects/featured.json'));
    }

    static getFilesToMove(projectId: string): string[]
    {
        let ignorePatterns = [
            'project.@(json|yml)',
            'goals.@(json|yml)',
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
        let projectPath = (extension: string) => this.getPathTo(projectId, 'project.' + extension);

        if (IO.exists(projectPath('yml')))
            return YAML.parse(IO.readFile(projectPath('yml')));
        
        return JSON.parse(IO.readFile(projectPath('json')));
    }

    static getDataGoals(projectId: string): DataGoals
    {
        let goalsPath = (extension: string) => this.getPathTo(projectId, 'goals.' + extension);

        if (IO.exists(goalsPath('yml')))
            return YAML.parse(IO.readFile(goalsPath('yml')));

        if (IO.exists(goalsPath('json')))
            return JSON.parse(IO.readFile(goalsPath('json')));

        return null;
    }
}