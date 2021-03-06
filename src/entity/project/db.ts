import { Column, Entity, PrimaryKey, Table } from "sqlean";

import { ProjectAction, ProjectBlock, ProjectExtra, ProjectFact, ProjectLink, ProjectStatus } from "./global";

@Table('project')
export class DbProject extends Entity
{
    @PrimaryKey
    @Column
    projectId: string;

    @Column
    title: string;

    @Column
    desc: string;

    @Column
    type: string;

    @Column
    status: ProjectStatus;

    @Column
    main: string;

    @Column
    facts: ProjectFact[];

    @Column
    action: ProjectAction;

    @Column
    links: ProjectLink[];

    @Column
    blocks: ProjectBlock[];

    @Column
    start: string;

    @Column
    end: string;

    @Column
    extra: ProjectExtra;

    @Column
    featured: boolean;

    @Column
    displayOrder: number;
    
    // Static

    static getTitle(projectId: string)
    {
        return this.getById(projectId, ['title']).title;
    }
}

//
//
//

@Table('project_relation')
export class DbProjectRelation extends Entity
{
    @PrimaryKey
    @Column
    projectId: string;

    @PrimaryKey
    @Column
    relatedId: string;

    @Column
    type: string;

    @Column
    reason: string;

    @Column
    displayOrder: number;
}

//
//
//

@Table('project_tag')
export class DbProjectTag extends Entity
{
    @PrimaryKey
    @Column
    projectId: string;

    @PrimaryKey
    @Column
    tagId: string;

    @Column
    role: string;

    @Column
    old: boolean;

    @Column
    displayOrder: number;
}