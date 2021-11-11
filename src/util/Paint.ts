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
    let gap = 50;
    let maxWidth = W - 2 * gap - (isProject ? iconRectSize + 2 * gap : 0);

    let outText;
    let fontSize;

    let tWidth;
    let tHeight;

    let words = text.split(' ');
    
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';

    loop:
    for (let lines = 1; lines <= words.length; lines++)
    {
        outText = chunkify(words, lines).map(arr => arr.join(' ')).join('\n');

        fontSize = fontMax;
        while (fontSize > fontMin)
        {
            ctx.font = fontSize + 'px "Open Sans"';

            let measure = ctx.measureText(outText);

            tWidth = measure.width;
            tHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;

            if (measure.width <= maxWidth)
                break loop;

            fontSize--;
        }
    }

    let x;

    if (!isProject) x = (W - tWidth) / 2;
    else x = (W - tWidth + gap + iconRectSize) / 2;

    ctx.fillText(outText, x, (H - tHeight) / 2 - 30 /* Магическая корректировка */ );

    return x - gap - iconRectSize;
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

/** @see https://stackoverflow.com/a/8189268/3050341 */
function chunkify(a, n, balanced = true) {
    
    if (n < 2)
        return [a];

    var len = a.length,
            out = [],
            i = 0,
            size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));

    }

    return out;
}