const {
    chromium
} = require('playwright'), assert = require('node:assert/strict'), path = require('node:path'), fs = require('node:fs/promises'), {
    spawn
} = require('node:child_process');
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
    const out = path.resolve(process.env.QA_OUTPUT || 'build');
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
                height: 900
            },
            acceptDownloads: true
        }),
        page = await ctx.newPage(),
        errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8000');
    await page.waitForSelector('#check-birth_certificate');
    assert.equal(await page.locator('#result-title').innerText(), 'Clarification needed');
    assert(await page.locator('#check-birth_certificate').isDisabled());
    await page.locator('#scope-confirm').check();
    await page.locator('#check-birth_certificate').check();
    await page.locator('#check-national_id').check();
    await page.screenshot({
        path: path.join(out, 'desktop.png'),
        fullPage: true
    });
    await page.locator('.action-grid').screenshot({
        path: path.join(out, 'preparation.png')
    });
    await page.locator('#source-grid').screenshot({
        path: path.join(out, 'sources.png')
    });
    await page.locator('#save').click();
    await page.waitForFunction(() => localStorage.getItem('ca-snapshot-v2'));
    await ctx.setOffline(true);
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    assert(await page.locator('#check-birth_certificate').isChecked());
    assert((await page.locator('#network').innerText()).includes('Offline'));
    await ctx.setOffline(false);
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    for (const [id, title] of [
            ['different-scope', 'Different situations'],
            ['different-period', 'Different effective periods'],
            ['missing', 'Incomplete evidence'],
            ['same-term', 'Potential conflict']
        ]) {
        await page.locator('#case').selectOption(id);
        assert.equal(await page.locator('#result-title').innerText(), title);
    }
    await page.locator('#case').selectOption('observed');
    const realBefore = await page.evaluate(() => localStorage.getItem('ca-snapshot-v2'));
    await page.locator('.resolution summary').click();
    await page.locator('#demo-start').click();
    for (const key of ['birth_certificate', 'national_id', 'payment_documents']) await page.locator('#check-' + key).check();
    await page.locator('#demo-update').click();
    assert(await page.locator('#check-birth_certificate').isChecked());
    assert(await page.locator('#check-national_id').isChecked());
    assert(!(await page.locator('#check-payment_documents').isChecked()));
    assert.equal(await page.locator('.change-item').count(), 1);
    assert(await page.locator('#save').isDisabled());
    await page.locator('.action-grid').screenshot({
        path: path.join(out, 'demo-plan.png')
    });
    await page.locator('#changes').screenshot({
        path: path.join(out, 'changes.png')
    });
    const fictionalDownload = page.waitForEvent('download');
    await page.locator('#download').click();
    assert((await fictionalDownload).suggestedFilename().startsWith('FICTIONAL'));
    assert.equal(await page.evaluate(() => localStorage.getItem('ca-snapshot-v2')), realBefore);
    await page.locator('#demo-exit').click();
    assert(await page.locator('#check-birth_certificate').isChecked());
    await page.route('**/api/catalog', async route => {
        const res = await route.fetch(),
            d = await res.json();
        d.version = 'browser-check-date';
        d.cases.forEach(c => c.sources.forEach(s => s.checked_at = '2026-09-20'));
        await route.fulfill({
            json: d
        });
    });
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    assert(await page.locator('#check-birth_certificate').isChecked());
    assert(await page.locator('#check-national_id').isChecked());
    await page.unroute('**/api/catalog');
    await page.route('**/api/catalog', async route => {
        const res = await route.fetch(),
            d = await res.json();
        d.version = 'browser-rule-change';
        const c = d.cases.find(c => c.id === 'observed');
        c.comparison.rows.find(r => r.key === 'national_id').left.text.en = 'TEST: revised identity-document preparation.';
        await route.fulfill({
            json: d
        });
    });
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    assert(await page.locator('#check-birth_certificate').isChecked());
    assert(!(await page.locator('#check-national_id').isChecked()));
    assert.equal(await page.locator('.change-item').count(), 1);
    await page.locator('#save').click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('ca-snapshot-v2')).catalog.version === 'browser-rule-change');
    await ctx.setOffline(true);
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    assert(await page.locator('#check-birth_certificate').isChecked());
    assert(!(await page.locator('#check-national_id').isChecked()));
    assert.equal(await page.locator('.change-item').count(), 1);
    await ctx.setOffline(false);
    await page.unroute('**/api/catalog');
    await page.locator('#language').selectOption('sw');
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
    await (await wait).saveAs(path.join(out, 'action-pack.txt'));
    await page.locator('#clear').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('ca-snapshot-v2')), null);
    assert.equal(await page.evaluate(() => localStorage.getItem('ca-snapshot-v1')), null);
    // Legacy v1 snapshots preserve justified ticks and migrate only on explicit save.
    await page.evaluate(async () => {
        const oldCatalog = await (await fetch('/api/catalog')).json();
        localStorage.setItem('ca-snapshot-v1', JSON.stringify({catalog:oldCatalog, caseId:'observed',lang:'en',checks:{'observed:birth_certificate':true},savedAt:new Date().toISOString()}));
    });
    await page.reload();
    await page.waitForSelector('#check-birth_certificate');
    assert(await page.locator('#check-birth_certificate').isChecked());
    assert(await page.locator('#check-birth_certificate').isDisabled());
    await page.locator('#scope-confirm').check();
    await page.locator('#save').click();
    await page.waitForFunction(() => localStorage.getItem('ca-snapshot-v2'));
    assert.equal(await page.evaluate(() => localStorage.getItem('ca-snapshot-v1')), null);
    assert.deepEqual(errors, []);
    await ctx.close();
    await browser.close();
    server.kill();
    console.log('PASS: scope, comparisons, offline, selective updates, date-only updates, fixture isolation, saved explanations, export, mobile/Swahili and deletion.');
})().catch(e => {
    console.error(e);
    server.kill();
    process.exit(1);
});
