import { DataMyInfo } from "./data";

export class ViewMyInfoFact
{
    id:     string;
    label:  string;
    data:   any;

    static fromDataInfo(dataInfo: DataMyInfo): ViewMyInfoFact[]
    {
        if (!dataInfo.facts) return null;

        let facts = [];

        Object.keys(dataInfo.facts).forEach(id =>
        {
            let dataFact = dataInfo.facts[id];

            let fact = new ViewMyInfoFact;
                fact.id =       id;
                fact.label =    dataFact.label;
                fact.data =     dataFact.data;

            facts.push(fact);
        });

        return facts;
    }
}

export class ViewMyInfoSocialItem
{
    label:  string;
    icon:   string;
    link:   string;

    static fromDataInfo(dataInfo: DataMyInfo): ViewMyInfoSocialItem[]
    {
        if (!dataInfo.social) return null;

        let items = [];

        Object.keys(dataInfo.social).forEach(id =>
        {
            let dataItem = dataInfo.social[id];

            let item = new ViewMyInfoSocialItem;
                item.label =    dataItem.label;
                item.icon =     dataItem.icon;
                item.link =     dataItem.link;

            items.push(item);
        });

        return items;
    }
}