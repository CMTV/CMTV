import * as readline from 'readline';

import chalk from "chalk";

import { Global } from "src/Global";
import { paint, paintProject } from "src/util/Paint";

class OgImg extends Global
{
    list: { id: string, text: string, icon?: string }[];

    reset()
    {
        this.list = [];   
    }
}

export const OGIMG = new OgImg;

export async function paintOgImages()
{
    if (!OGIMG.list.length) return;
    
    for (let i = 0, len = OGIMG.list.length; i < len; i++)
    {
        let imgData = OGIMG.list[i];
        
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(chalk.bgWhite.black(' Отрисовка Open Graph изображений ') + ' ' + `${i+1} / ${len}`);

        if (!imgData.text) continue;

        await new Promise<void>(resolve => {
            let dest = `dist/site/graphics/og-images/${imgData.id}.jpeg`;

            if (imgData.icon) paintProject(imgData.icon, imgData.text, dest);
            else paint(imgData.text, dest);

            if (i === len - 1) process.exit(0);

            resolve();
        });
    }
}