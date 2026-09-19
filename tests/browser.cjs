const {
    chromium
} = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');
const {
    spawn
} = require('node:child_process');
const server = spawn(process.env.PYTHON || 'python', ['app.py'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore'
});
process.on('exit', () => server.kill());
(async () => {
    await fs.mkdir(process.env.QA_OUTPUT || 'build', {
        recursive: true
    });
    const out = process.env.QA_OUTPUT || 'build';
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
            height: 900
        },
        acceptDownloads: true
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8000');
    await page.waitForSelector('#check-birth_certificate');
    assert.equal(await page.locator('#result-title').innerText(), 'Clarification needed');
    assert.equal(await page.locator('#agree-count').innerText(), '2');
    await page.screenshot({
        path: path.join(out, 'desktop.png'),
        fullPage: true
    });
    await page.locator('#source-grid').screenshot({
        path: path.join(out, 'source-pair.png')
    });
    await page.locator('#check-birth_certificate').check();
    await page.locator('#save').click();
    await page.waitForFunction(() => localStorage.getItem('ca-snapshot-v1'));
    await ctx.setOffline(true);
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    assert(await page.locator('#check-birth_certificate').isChecked());
    assert((await page.locator('#network').innerText()).includes('Offline'));
    await ctx.setOffline(false);
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    await page.locator('#case').selectOption('different-scope');
    assert.equal(await page.locator('#result-title').innerText(), 'Different situations');
    assert.equal(await page.locator('#checklist input').count(), 0);
    await page.locator('#case').selectOption('different-period');
    assert.equal(await page.locator('#result-title').innerText(), 'Different effective periods');
    await page.locator('#case').selectOption('missing');
    assert.equal(await page.locator('#result-title').innerText(), 'Incomplete evidence');
    await page.locator('#case').selectOption('same-term');
    assert.equal(await page.locator('#result-title').innerText(), 'Potential conflict');
    await page.locator('.resolution summary').click();
    await page.locator('#resolve').click();
    assert.equal(await page.locator('#result-title').innerText(), 'Matching statements');
    assert(await page.locator('#save').isDisabled());
    assert(!(await page.locator('#check-payment_documents').isChecked()));
    await page.locator('#reset').click();
    await page.locator('#case').selectOption('observed');
    assert(await page.locator('#resolve').isDisabled());
    assert((await page.locator('#draft').inputValue()).includes('Do these refer to the same document?'));
    await page.locator('#language').selectOption('sw');
    assert.equal(await page.locator('html').getAttribute('lang'), 'sw');
    assert(await page.locator('#translation').isVisible());
    await page.setViewportSize({
        width: 390,
        height: 844
    });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({
        path: path.join(out, 'mobile.png'),
        fullPage: true
    });
    await page.locator('#language').selectOption('en');
    const wait = page.waitForEvent('download');
    await page.locator('#download').click();
    const download = await wait;
    await download.saveAs(path.join(out, 'action-pack.txt'));
    // A new reviewed catalog version invalidates saved checkbox state.
    await page.route('**/api/catalog', async route => {
        const res = await route.fetch();
        const d = await res.json();
        d.version = 'test-update';
        await route.fulfill({
            json: d
        })
    });
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    assert(!(await page.locator('#check-birth_certificate').isChecked()));
    assert(await page.locator('#refresh-note').isVisible());
    await page.locator('#clear').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('ca-snapshot-v1')), null);
    assert.deepEqual(errors, []);
    await ctx.close();
    await browser.close();
    server.kill();
    console.log('PASS: evidence classes, offline reload, draft, resolution isolation, mobile/Swahili, download, version invalidation and deletion.');
})().catch(e => {
    console.error(e);
    server.kill();
    process.exit(1)
});
