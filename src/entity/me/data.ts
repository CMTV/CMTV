export class DataMyInfo
{
    facts:  DataMyInfoFacts;
    social: DataMyInfoSocial;
}

export class DataMyInfoFacts
{
    [factId: string]:
    {
        label:  string;
        data:   number|string;
    }
}

export class DataMyInfoSocial
{
    [socialId: string]:
    {
        label:  string;
        icon:   string;
        link:   string;
    }
}