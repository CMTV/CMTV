export class Config
{
    url = 'https://radkopeter.ru';

    buildTime: number;
    devMode: boolean;

    constructor()
    {
        this.buildTime = Date.now();
    }

    getUrl()
    {
        return this.devMode ? 'http://localhost:3000' : this.url;
    }
}

//
//
//

export let CONFIG = new Config;
export function SET_CONFIG(config: Config) { CONFIG = config; };