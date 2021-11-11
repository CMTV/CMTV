import { Process } from "@cmtv/processes";

export abstract class ProjectsProcess extends Process
{
    projectIds:     string[];
    featuredIds:    string[];

    constructor(projectIds: string[], featuredIds: string[] = null)
    {
        super();
        this.projectIds =   projectIds;
        this.featuredIds =  featuredIds;
    }
}