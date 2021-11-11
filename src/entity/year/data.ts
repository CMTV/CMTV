import { glob } from "glob";
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
        return glob.sync('data/life/*').map(path => path.split('/').pop()).sort((a, b) => +b - +a);
    }

    static getResults(year: string): DataYearResult[]
    {
        let file = `data/life/${year}/results.json`;

        if (!IO.exists(file))
            return null;

        return JSON.parse(IO.readFile(file));
    }
}