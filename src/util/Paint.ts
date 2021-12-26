import { createCanvas, loadImage, NodeCanvasRenderingContext2D, registerFont } from "canvas";
import { IO } from "./IO";

const W = 1200;
const H = 627;

const iconSize = 130;
const iconPadding = 20;
const iconRectSize = iconSize + iconPadding;

const fontMax = 100;
const fontMin = 70;

registerFont('site/fonts/OpenSans-Bold.ttf', { family: 'Open Sans' });

//
//
//

export function paint(text: string, dest: string)
{
    let canvas = createCanvas(W, H);
    let ctx = canvas.getContext('2d');

    loadImage('site/graphics/og-images/_template.png').then(img =>
    {
        ctx.drawImage(img, 0, 0);

        drawText(ctx, text, false);
        
        IO.writeFile(dest, canvas.toBuffer('image/jpeg'));
    });
}

export function paintProject(iconPath: string, projectTitle: string, dest: string)
{
    let canvas = createCanvas(W, H);
    let ctx = canvas.getContext('2d');

    let templateImg =   loadImage('site/graphics/og-images/_template.png');
    let projectImg =    loadImage(iconPath);

    Promise.all([templateImg, projectImg]).then(images =>
    {
        ctx.drawImage(images[0], 0, 0);

        let x = drawText(ctx, projectTitle, true);

        ctx.fillStyle = '#fff';
        roundRect(ctx, x, (H - iconRectSize) / 2, iconRectSize, iconRectSize, 10, true, false);
        ctx.drawImage(images[1], x + iconPadding / 2, (H - iconRectSize + iconPadding) / 2, iconSize, iconSize);

        IO.writeFile(dest, canvas.toBuffer('image/jpeg'));
    });
}

//
//
//

function drawText(ctx: NodeCanvasRenderingContext2D, text: string, isProject: boolean)
{
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';

    let gap = 50;
    let maxWidth = W - 2 * gap - (isProject ? iconRectSize + 2 * gap : 0);

    let textData = getFitTextData(ctx, [text], maxWidth);

    let outText =   textData.text;
    let fontSize =  textData.fontSize;
    let tWidth =    textData.measure.width;
    let tHeight =   textData.measure.actualBoundingBoxAscent + textData.measure.actualBoundingBoxDescent;

    let x;

    if (!isProject) x = (W - tWidth) / 2;
    else x = (W - tWidth + gap + iconRectSize) / 2;

    ctx.font = fontSize + 'px "Open Sans"';
    ctx.fillText(outText, x, (H - tHeight) / 2 - 25 /* Магическая корректировка */ );

    return x - gap - iconRectSize;
}

function getFitTextData(ctx: NodeCanvasRenderingContext2D, lines: string[], maxWidth: number)
{
    let text = lines.join('\n');
    let fontSize = fontMax;

    while (fontSize >= fontMin)
    {
        ctx.font = fontSize + 'px "Open Sans"';
        
        let measure = ctx.measureText(text);

        if (measure.width <= maxWidth)
            return { text: text, fontSize: fontSize, measure: measure }
        
        fontSize--;
    }

    let maxLineI;

    for (let i = 0; i < lines.length; i++)
    {
        if (ctx.measureText(lines[i]).width <= maxWidth)
            continue;

        maxLineI = i;
        break; 
    }

    let newLines = [...lines];

    let words = newLines[maxLineI].split(' ');
    let lastWord = words.pop();

    newLines[maxLineI] = words.join(' ');

    if (newLines.length === maxLineI + 1)
        newLines.push(lastWord);
    else
        newLines[maxLineI + 1] = lastWord + ' ' + newLines[maxLineI + 1];

    return getFitTextData(ctx, newLines, maxWidth);
}

/** @see https://stackoverflow.com/a/3368118/3050341 */
function roundRect(ctx, x, y, width, height, radius, fill = undefined, stroke = undefined)
{
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}