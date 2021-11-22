import { Page } from "./Page";
import { ViewProjectDateData, ViewProjectGoalData, ViewProjectRelated, ViewProjectTags, ViewProjectType } from "src/entity/project/view";
import { ProjectAction, ProjectBlock, ProjectFact, ProjectIcon, ProjectLink } from "src/entity/project/global";
import { ViewTimeChart } from "src/entity/timeChart/view";
import { ViewTimeline } from "src/entity/timelineFragment/view";
import { Status } from "src/entity/status/Status";

export class PageProject extends Page
{
    pageName = 'project';
    hasScript = true;
    
    id:         string;
    title:      string;
    desc:       string;
    icon:       ProjectIcon;

    status:     Status;
    featured:   boolean;

    type:       ViewProjectType;
    tags:       ViewProjectTags;

    facts:      ProjectFact[];
    action:     ProjectAction;

    main:       string;

    links:      ProjectLink[];

    start:      string;
    end:        string;

    goalData:   ViewProjectGoalData;
    dateData:   ViewProjectDateData;

    timeline:   ViewTimeline;

    tagChart:   ViewTimeChart;
    related:    ViewProjectRelated[];
    blocks:     ProjectBlock[];

    dest = () => `projects/${this.id}/index.html`;
}