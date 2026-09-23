// Exports single knight drawings from the film as transparent PNGs (logo, favicon, 404).
import puppeteer from 'puppeteer-core';
import {writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const out = process.argv[2] || '../public';
const b = await puppeteer.launch({executablePath: process.env.CHROME, headless: true});
const p = await b.newPage();
await p.goto(pathToFileURL(path.resolve('knights-move.html')).href + '?bare=1&ar=1:1&w=1080');
await p.waitForFunction('window.__ready||window.__error');
const shots = await p.evaluate(() => {
    const grab = (id, P, blink = false) => {
        const s = knightSprite({id, P, blink});
        return s.toDataURL('image/png');
    };
    return {
        rest: grab('rest', REST),
        look: grab('look', LOOK),
        blink: grab('rest-blink', REST, true),
        crouch: grab('R-crouch-18', key(18, KEYS(REST), easeInOutSine))
    };
});
for (const [k, v] of Object.entries(shots)) writeFileSync(path.join(out, `knight-${k}.png`), Buffer.from(v.split(',')[1], 'base64'));
await b.close();
