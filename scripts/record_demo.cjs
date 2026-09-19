const {
    chromium
} = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const {
    spawn
} = require('node:child_process');
const out = path.resolve(process.env.DEMO_OUTPUT || 'artifacts');
const server = spawn(process.env.PYTHON || 'python', ['app.py'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore'
});
process.on('exit', () => server.kill());
(async () => {
    await fs.mkdir(out, {
        recursive: true
    });
    await new Promise(r => setTimeout(r, 1000));
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.CHROME_PATH ? {
            executablePath: process.env.CHROME_PATH
        } : {}),
        args: ['--no-sandbox']
    });
    const ctx = await browser.newContext({
        viewport: {
            width: 1280,
            height: 800
        },
        recordVideo: {
            dir: out,
            size: {
                width: 1280,
                height: 800
            }
        }
    });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:8000');
    await page.waitForSelector('#check-birth_certificate');
    const start = Date.now(),
        captions = [];
    async function scene(text, action) {
        const at = (Date.now() - start) / 1000;
        if (action) await action();
        captions.push({
            start: at,
            end: at + 11.8,
            text
        });
        await page.waitForTimeout(Math.max(100, 12000 - (Date.now() - start - at * 1000)))
    }
    await scene('Conflicting Answers compares public-service instructions.\nThe Kenya passport pilot uses two dated official source pages.');
    await scene('One page says two payment invoices; another says three receipts.\nDifferent terms and unknown effective dates require clarification.', async () => {
        await page.locator('#source-grid').scrollIntoViewIfNeeded()
    });
    await scene('Matching statements stay separate from uncertain evidence.\nA missing statement is not automatically a contradiction.', async () => {
        await page.locator('#findings').scrollIntoViewIfNeeded()
    });
    await scene('The app drafts a precise question with both source links.\nUsers review it. Nothing is sent automatically.', async () => {
        await page.locator('#draft').scrollIntoViewIfNeeded()
    });
    await scene('SYNTHETIC FIXTURE: different locations are not comparable.\nThe engine also distinguishes non-overlapping effective periods.', async () => {
        await page.locator('#case').selectOption('different-scope');
        await page.locator('#result-title').scrollIntoViewIfNeeded()
    });
    await scene('SYNTHETIC FIXTURE: the same document has different counts.\nThis is a potential conflict, never an automatic verdict.', async () => {
        await page.locator('#case').selectOption('same-term');
        await page.locator('#result-title').scrollIntoViewIfNeeded()
    });
    await scene('FICTIONAL CLARIFICATION: matching evidence adds a preparation step.\nThis preview cannot be saved as reviewed official evidence.', async () => {
        await page.locator('.resolution summary').click();
        await page.locator('#resolve').click();
        await page.waitForTimeout(500)
    });
    await scene('The journey also works in draft Swahili.\nIndependent translation review remains necessary.', async () => {
        await page.locator('#reset').click();
        await page.locator('#case').selectOption('observed');
        await page.locator('#language').selectOption('sw');
        await page.locator('#translation').scrollIntoViewIfNeeded()
    });
    await scene('NETWORK DISABLED: the saved comparison reopens offline.\nIt retains its source dates and cannot reverify the live pages.', async () => {
        await page.locator('#language').selectOption('en');
        await page.locator('#check-birth_certificate').check();
        await page.locator('#save').click();
        await page.waitForFunction(() => localStorage.getItem('ca-snapshot-v1'));
        await ctx.setOffline(true);
        await page.reload();
        await page.waitForSelector('#check-birth_certificate');
        await page.evaluate(() => scrollTo(0, 0))
    });
    await scene('Clear saved data on shared devices. No personal documents are uploaded.\nAI-assisted idea origin requires organizer eligibility clarification.', async () => {
        await ctx.setOffline(false);
        await page.reload();
        await page.waitForSelector('#check-birth_certificate');
        await page.locator('#clear').click();
        await page.evaluate(() => scrollTo(0, 0))
    });
    const video = page.video();
    await ctx.close();
    await video.saveAs(path.join(out, 'demo-raw.webm'));
    await browser.close();
    server.kill();

    function stamp(s) {
        const ms = Math.round(s * 1000);
        return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`
    }
    await fs.writeFile(path.join(out, 'demo-captions.srt'), captions.map((c, i) => `${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n'));
    console.log('Demo recorded:', out);
})().catch(e => {
    console.error(e);
    server.kill();
    process.exit(1)
});
