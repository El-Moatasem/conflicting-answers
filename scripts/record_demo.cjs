/* Records the actual local app. Fictional updates use the visible demo controls. */
const {
    chromium
} = require('playwright'), fs = require('node:fs/promises'), path = require('node:path'), {
    spawn
} = require('node:child_process');
const out = path.resolve(process.env.DEMO_OUTPUT || 'artifacts');
const server = spawn(process.env.PYTHON || 'python', ['app.py'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
    env: {
        ...process.env,
        DATABASE_URL: '',
        PORT: '8000'
    }
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
    const started = Date.now(),
        page = await ctx.newPage(),
        captions = [];
    await page.goto('http://127.0.0.1:8000');
    await page.waitForSelector('#check-birth_certificate');
    async function scene(text, action) {
        const start = (Date.now() - started) / 1000;
        if (action) await action();
        captions.push({
            start,
            end: start + 11.8,
            text
        });
        await page.waitForTimeout(Math.max(100, 12000 - (Date.now() - started - start * 1000)));
    }
    await scene('Conflicting Answers now includes Before You Travel.\nA preparation plan connects official evidence to a clear next step.');
    await scene('Confirm the supported applicant situation, then prepare matching items.\nThis is a partial checklist, not confirmation that you are ready to travel.', async () => {
        await page.locator('#scope-confirm').check();
        await page.locator('#check-birth_certificate').check();
        await page.locator('#check-national_id').check();
        await page.locator('.action-grid').scrollIntoViewIfNeeded();
    });
    await scene('Two official pages use different terms: invoices and receipts.\nThe app shows source dates and asks for clarification, without choosing a winner.', async () => {
        await page.locator('#source-grid').scrollIntoViewIfNeeded();
    });
    await scene('The unresolved question becomes a precise clarification request.\nBoth source links are included. The user decides whether to send it.', async () => {
        await page.locator('.action-grid').scrollIntoViewIfNeeded();
    });
    await scene('Save explicitly, then reopen the dated plan with networking disabled.\nPrepared items survive offline; the live sources cannot be rechecked.', async () => {
        await page.locator('#save').click();
        await page.waitForFunction(() => localStorage.getItem('ca-snapshot-v2'));
        await ctx.setOffline(true);
        await page.reload();
        await page.waitForSelector('#check-birth_certificate');
        await page.locator('.action-grid').scrollIntoViewIfNeeded();
    });
    await scene('After reconnecting, a separate fictional example demonstrates a change.\nIts invented requirements cannot overwrite the saved real plan.', async () => {
        await ctx.setOffline(false);
        await page.reload();
        await page.waitForSelector('#check-birth_certificate');
        await page.locator('.resolution summary').click();
        await page.locator('#demo-start').click();
        await page.locator('.action-grid').scrollIntoViewIfNeeded();
    });
    await scene('FICTIONAL EXAMPLE: all three preparation steps are marked complete.\nThe receipt requirement currently asks for two copies.', async () => {
        for (const key of ['birth_certificate', 'national_id', 'payment_documents']) await page.locator('#check-' + key).check();
        await page.locator('.action-grid').scrollIntoViewIfNeeded();
    });
    await scene('FICTIONAL UPDATE: the receipt count changes from two copies to three.\nOnly the changed step reopens. The two unchanged steps remain checked.', async () => {
        await page.locator('#demo-update').click();
        await page.locator('.action-grid').scrollIntoViewIfNeeded();
    });
    await scene('The change explanation shows the previous and current instructions.\nThe same comparison logic handles reviewed catalog updates after reconnecting.', async () => {
        await page.locator('#changes').scrollIntoViewIfNeeded();
    });
    await scene('Exit the fictional demo to return to the preserved real plan.\nDownload a text copy or print it for use away from the screen.', async () => {
        await page.locator('#demo-exit').click();
        await page.locator('#download').click();
        await page.locator('.action-grid').scrollIntoViewIfNeeded();
    });
    await scene('English and draft Swahili support the pilot journey.\nThe translation is visibly labeled as needing independent review.', async () => {
        await page.locator('#language').selectOption('sw');
        await page.evaluate(() => scrollTo(0, 0));
    });
    await scene('No identity documents are uploaded; saved progress can be cleared.\nNext steps are local user validation, source review and verified deployment.', async () => {
        await page.locator('#language').selectOption('en');
        await page.locator('#clear').click();
        await page.evaluate(() => scrollTo(0, 0));
    });
    const video = page.video();
    await ctx.close();
    await video.saveAs(path.join(out, 'demo-raw.webm'));
    await browser.close();
    server.kill();
    const stamp = s => {
        const ms = Math.round(s * 1000);
        return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;
    };
    await fs.writeFile(path.join(out, 'demo-captions.srt'), captions.map((c, i) => `${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n'));
    await fs.writeFile(path.join(out, 'scenes.json'), JSON.stringify(captions, null, 2));
    console.log('Recorded actual app demo:', out);
})().catch(e => {
    console.error(e);
    server.kill();
    process.exit(1);
});
