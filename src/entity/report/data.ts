import YAML from 'yaml';

import { IO } from "src/util/IO";
import { UtilDate } from "src/util/Date";

export class DataReports
{
    [dayMonth: string]: DataReport
}

export class DataReport
{
    time:       DataTimeReport[];
    checks:     string[];
    counters:   DataCounterReport[];
    events:     DataEventReport[];
}

//
//
//

export class DataTimeReport
{
    duration:   number;
    project:    string;
    goals:      string[];
    tags:       string[];
}

//
//
//

export class DataCounterReport
{
    counter:    string;
    value:      number;
    project:    string;
    desc:       string;
}

//
//
//

export class DataEventReport
{
    title:  string;
    desc:   string;
}

//
//
//

export class UtilDataReport
{
    static getYearReports(year: string)
    {
        let reportPath = (extension: string) => `data/life/${year}/report.${extension}`;
        let rawReports: DataReports;

        if (IO.exists(reportPath('yml')))
            rawReports = YAML.parse(IO.readFile(reportPath('yml')));
        else if (IO.exists(reportPath('json')))
            rawReports = JSON.parse(IO.readFile(reportPath('json')));
        else
            return null;

        let yearReports: { [date: string]: DataReport } = {};

        Object.keys(rawReports).forEach(dayMonth =>
        {
            let date = UtilDate.toStrDate(dayMonth + '.' + year);
            yearReports[date] = rawReports[dayMonth];
        });

        return yearReports;
    }
}