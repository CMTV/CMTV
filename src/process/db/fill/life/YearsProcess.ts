import { Process } from "@cmtv/processes";

export abstract class YearsProcess extends Process
{
    years: string[];

    constructor(years: string[])
    {
        super();
        this.years = years;
    }
}