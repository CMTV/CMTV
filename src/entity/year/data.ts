import { glob } from "glob";
import { BUILD_CONFIG } from "src/BuildConfig";
import { IO } from "src/util/IO";

export class DataYearResult
{
    project:    string;
    icon:       string;
    title:      string;
    desc:       string;
}

export class UtilDataYear
{
    static getYears(): string[]
    {
        let minYear = 2010;
        let maxYear = 2100;
        let nowYear = new Date().getFullYear();

        if (nowYear + 5 <= 2100)
            maxYear = nowYear + 5;

        let years = [];

        for (let i = maxYear; i >= minYear; i--)
            years.push(''+i);

        // return glob.sync('data/life/*').map(path => path.split('/').pop()).sort((a, b) => +b - +a);

        return years;
    }

    static getResults(year: string): DataYearResult[]
    {
        let file = `data/life/${year}/results.json`;

        if (!IO.exists(file))
            return null;

        let results = JSON.parse(IO.readFile(file));
        results = results.filter(result => !result.project || BUILD_CONFIG.projectAllowed(result.project));

        return results;
    }
}