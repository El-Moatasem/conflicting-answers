'use strict';
const $ = id => document.getElementById(id),
    KEY = 'ca-snapshot-v1';
const words = {
    en: {
        'pilot-label': 'KENYA PASSPORT PILOT',
        'headline': 'Two sources.\nOne clear next step.',
        'intro-copy': 'See where instructions agree, where they differ, and what needs clarification.',
        'intro-note': 'No account.\nNo personal documents.\nNo automatic verdict.',
        'case-label': 'Choose a comparison',
        'coverage-label': 'COVERAGE',
        'finding-label': 'COMPARISON RESULT',
        'agree-label': 'matching statements',
        'sources-heading': 'Inspect the evidence',
        'findings-heading': 'Compare each statement',
        'curated-label': 'Curated evidence · no live scraping',
        'th-topic': 'Topic',
        'th-status': 'Finding',
        'act-label': 'YOUR NEXT STEP',
        'action-heading': 'Prepare what is consistent',
        'partial-note': 'These are matching statements, not a complete application checklist.',
        'save': 'Save for offline use',
        'download': 'Download action pack',
        'print': 'Print',
        'clear': 'Clear saved data',
        'ask-label': 'ASK THE INSTITUTION',
        'ask-heading': 'A precise clarification request',
        'draft-note': 'Review this draft. Nothing is sent automatically.',
        'copy': 'Copy request',
        'contact': 'Contact the Directorate ↗',
        'resolution-label': 'How a reviewed clarification changes the plan',
        'resolution-desc': 'The synthetic count example can preview a fictional clarification. Real disagreements require evidence from the responsible institution.',
        'resolve': 'Preview clarification (fixture only)',
        'reset': 'Reset preview',
        'footer-left': 'Independent prototype · Transparency & Accountability',
        'footer-right': 'Source dates are visible. Unknowns stay unresolved.'
    },
    sw: {
        'pilot-label': 'JARIBIO LA PASIPOTI YA KENYA',
        'headline': 'Vyanzo viwili.\nHatua moja iliyo wazi.',
        'intro-copy': 'Angalia maelekezo yanayolingana, yanayotofautiana na yanayohitaji ufafanuzi.',
        'intro-note': 'Hakuna akaunti.\nHakuna nyaraka binafsi.\nHakuna uamuzi wa moja kwa moja.',
        'case-label': 'Chagua ulinganisho',
        'coverage-label': 'WIGO',
        'finding-label': 'MATOKEO YA ULINGANISHO',
        'agree-label': 'taarifa zinazolingana',
        'sources-heading': 'Kagua ushahidi',
        'findings-heading': 'Linganisha kila taarifa',
        'curated-label': 'Ushahidi uliochaguliwa · hakuna ukusanyaji wa moja kwa moja',
        'th-topic': 'Mada',
        'th-status': 'Matokeo',
        'act-label': 'HATUA YAKO INAYOFUATA',
        'action-heading': 'Andaa yanayolingana',
        'partial-note': 'Hizi ni taarifa zinazolingana, si orodha kamili ya maombi.',
        'save': 'Hifadhi kwa matumizi bila intaneti',
        'download': 'Pakua mwongozo wa hatua',
        'print': 'Chapisha',
        'clear': 'Futa taarifa zilizohifadhiwa',
        'ask-label': 'ULIZA TAASISI',
        'ask-heading': 'Ombi mahususi la ufafanuzi',
        'draft-note': 'Kagua rasimu hii. Hakuna kinachotumwa kiotomatiki.',
        'copy': 'Nakili ombi',
        'contact': 'Wasiliana na Idara ↗',
        'resolution-label': 'Jinsi ufafanuzi uliokaguliwa unavyobadili mpango',
        'resolution-desc': 'Mfano wa idadi unaweza kuonyesha ufafanuzi wa kubuni. Tofauti halisi zinahitaji ushahidi kutoka taasisi inayohusika.',
        'resolve': 'Onyesha ufafanuzi (mfano tu)',
        'reset': 'Rudisha mfano',
        'footer-left': 'Mfano huru · Uwazi na Uwajibikaji',
        'footer-right': 'Tarehe za vyanzo zinaonekana. Yasiyojulikana yanabaki bila jibu.'
    }
};
const labels = {
    agreement: ['Matching statements', 'Taarifa zinazolingana'],
    terminology_review: ['Clarification needed', 'Ufafanuzi unahitajika'],
    potential_conflict: ['Potential conflict', 'Tofauti inayowezekana'],
    missing_statement: ['Not stated in both', 'Haijatajwa katika vyote'],
    incomplete_evidence: ['Incomplete evidence', 'Ushahidi haujakamilika'],
    different_scope: ['Different situations', 'Hali tofauti'],
    different_period: ['Different effective periods', 'Vipindi tofauti vya matumizi'],
    insufficient_context: ['More context needed', 'Muktadha zaidi unahitajika']
};
const topics = {
    payment_documents: ['Payment documents', 'Hati za malipo'],
    birth_certificate: ['Birth certificate', 'Cheti cha kuzaliwa'],
    national_id: ['National identity card', 'Kitambulisho cha taifa']
};
const descriptions = {
    terminology_review: ['“Invoice” and “receipt” may mean different documents. The count difference needs institutional clarification; it is not a confirmed contradiction.', '“Ankara” na “risiti” huenda ni hati tofauti. Tofauti ya idadi inahitaji ufafanuzi wa taasisi; si mgongano uliothibitishwa.'],
    potential_conflict: ['Comparable statements give different values. Inspect the evidence and ask the institution; the app does not select a winner.', 'Taarifa zinazolinganishwa zina thamani tofauti. Kagua ushahidi na ulize taasisi; programu haichagui jibu sahihi.'],
    agreement: ['The selected statements match. Agreement does not prove that the sources are current or that this is a complete checklist.', 'Taarifa zilizochaguliwa zinalingana. Hii haithibitishi usasa wa vyanzo au ukamilifu wa orodha.'],
    incomplete_evidence: ['One source omits a statement. Absence is not evidence that a requirement does not apply.', 'Chanzo kimoja hakitaji taarifa. Kutotajwa hakumaanishi kuwa hitaji halitumiki.'],
    different_scope: ['These sources concern different locations or applicant situations. Their values are not compared as contradictions.', 'Vyanzo hivi vinahusu maeneo au hali tofauti za waombaji. Thamani zake hazilinganishwi kama migongano.'],
    different_period: ['The stated effective periods do not overlap. This may be a change over time, not a simultaneous contradiction.', 'Vipindi vilivyotajwa haviingiliani. Huenda ni mabadiliko ya wakati, si mgongano wa wakati mmoja.'],
    insufficient_context: ['The evidence lacks the context needed for a fair comparison.', 'Ushahidi hauna muktadha unaohitajika kwa ulinganisho sahihi.']
};
let catalog = null,
    lang = 'en',
    caseId = 'observed',
    checks = {},
    snapshot = null,
    offline = false,
    resolved = false,
    refresh = false;
try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s?.catalog?.cases?.length) {
        snapshot = s;
        catalog = s.catalog;
        lang = s.lang === 'sw' ? 'sw' : 'en';
        caseId = s.caseId || 'observed';
        checks = s.checks || {}
    }
} catch {}

function txt(pair) {
    return pair[lang === 'sw' ? 1 : 0]
}

function tr(en, sw) {
    return lang === 'sw' ? sw : en
}

function set(id, s) {
    $(id).textContent = s
}

function current() {
    const base = catalog.cases.find(c => c.id === caseId) || catalog.cases[0];
    const c = structuredClone(base);
    if (resolved && c.id === 'same-term') {
        const r = c.comparison.rows.find(r => r.key === 'payment_documents');
        r.right = structuredClone(r.left);
        r.status = 'agreement';
        c.sources[1].claims.payment_documents = structuredClone(c.sources[0].claims.payment_documents);
        c.comparison.status = 'agreement'
    }
    return c
}

function requestText(c) {
    if (c.synthetic) return tr('SYNTHETIC EXAMPLE — DO NOT SEND\n', 'MFANO WA KUBUNI — USITUME\n') + tr('Please clarify which payment-document count applies to the same applicant and period. This example has no real institution.', 'Tafadhali fafanua idadi ya hati za malipo kwa mwombaji na kipindi kimoja. Mfano huu hauna taasisi halisi.');
    return tr('Hello Directorate of Immigration Services,\n\nI am checking first-passport preparation for an adult Kenyan citizen by birth. Your requirements page mentions two payment invoices; the eCitizen page mentions three application receipts. Do these refer to the same document? Which documents and quantities apply now, and is there a current official notice confirming this? Please also confirm applicability to my intended office.\n\nSources:\n', 'Habari Idara ya Uhamiaji,\n\nNinakagua maandalizi ya pasipoti ya kwanza kwa raia mzima wa Kenya kwa kuzaliwa. Ukurasa wa mahitaji unataja ankara mbili za malipo; ukurasa wa eCitizen unataja risiti tatu za maombi. Je, hizi ni hati ileile? Ni hati zipi na idadi gani zinahitajika sasa? Je, kuna taarifa rasmi ya sasa inayothibitisha hili? Tafadhali thibitisha pia matumizi katika ofisi ninayokusudia.\n\nVyanzo:\n') + c.sources.map(s => s.url).join('\n') + tr('\n\nThank you.', '\n\nAsante.')
}

function render() {
    document.documentElement.lang = lang;
    $('language').value = lang;
    for (const [id, t] of Object.entries(words[lang])) set(id, t);
    set('network', offline ? tr('Offline · saved snapshot', 'Bila intaneti · nakala iliyohifadhiwa') : tr('Online · dated evidence', 'Mtandaoni · ushahidi wenye tarehe'));
    if (!catalog) return;
    $('content').hidden = false;
    $('loading').hidden = true;
    const select = $('case');
    select.replaceChildren();
    for (const c of catalog.cases) {
        const o = document.createElement('option');
        o.value = c.id;
        o.textContent = c.title[lang];
        select.append(o)
    }
    select.value = caseId;
    const c = current(),
        r = c.comparison;
    set('coverage', catalog.coverage[lang]);
    $('fixture').hidden = !c.synthetic;
    set('fixture', tr('SYNTHETIC TEST CASE — invented documents and rules. Not official guidance.', 'MFANO WA MAJARIBIO — hati na kanuni za kubuni. Si mwongozo rasmi.') + (resolved ? tr(' A fictional clarification is being previewed.', ' Ufafanuzi wa kubuni unaonyeshwa.') : ''));
    $('translation').hidden = lang !== 'sw';
    set('translation', 'Tafsiri ya Kiswahili ni rasimu ya AI. Ukaguzi huru bado unahitajika.');
    $('refresh-note').hidden = !refresh;
    set('refresh-note', tr('The catalog changed since your saved copy. Saved ticks were cleared; review the evidence and save again.', 'Katalogi imebadilika tangu nakala yako iliyohifadhiwa. Alama zimeondolewa; kagua na uhifadhi tena.'));
    set('result-title', txt(labels[r.status]));
    set('result-description', txt(descriptions[r.status]));
    set('agree-count', r.rows.filter(x => x.status === 'agreement').length);
    const cautions = [];
    if (r.cautions?.includes('effective_date_unknown')) cautions.push(tr('Effective dates are unknown. A newer fetch does not establish which rule applies.', 'Tarehe za kuanza matumizi hazijulikani. Kuangalia baadaye hakuthibitishi kanuni inayotumika.'));
    const expired = c.sources.some(s => {
        const age = (Date.now() - Date.parse(s.checked_at + 'T00:00:00Z')) / 86400000;
        return age < 0 || age > 30
    });
    if (expired) cautions.push(tr('Source review is overdue. Recheck before acting.', 'Ukaguzi wa chanzo umepitwa na wakati. Kagua tena kabla ya hatua.'));
    if (offline) cautions.push(tr('Offline: links and freshness cannot be rechecked until you reconnect.', 'Bila intaneti: viungo na usasa haviwezi kukaguliwa hadi uunganishe tena.'));
    set('cautions', cautions.join(' '));
    set('checked-label', tr('Source checks: ', 'Ukaguzi wa vyanzo: ') + c.sources.map(s => s.checked_at).join(' / '));
    $('source-grid').replaceChildren();
    c.sources.forEach((s, i) => {
        const box = document.createElement('article');
        box.className = 'source';
        const k = document.createElement('span');
        k.className = 'source-letter';
        k.textContent = tr('SOURCE ', 'CHANZO ') + (i ? 'B' : 'A');
        const title = document.createElement('h3');
        title.textContent = s.publisher;
        const quote = document.createElement('blockquote');
        quote.textContent = s.short_quote || s.claims.payment_documents?.text[lang] || tr('Payment documents not stated', 'Hati za malipo hazijatajwa');
        const meta = document.createElement('p');
        meta.textContent = tr('Checked: ', 'Iliangaliwa: ') + s.checked_at + ' · ' + tr('Effective: ', 'Matumizi: ') + (s.valid_from || tr('not stated', 'haijatajwa')) + (s.valid_to ? ' — ' + s.valid_to : '');
        const scope = document.createElement('p');
        scope.textContent = s.scope_note[lang];
        box.append(k, title, quote, meta, scope);
        if (s.url) {
            const a = document.createElement('a');
            a.href = s.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = tr('Open original source ↗', 'Fungua chanzo halisi ↗');
            box.append(a)
        }
        $('source-grid').append(box)
    });
    $('findings').replaceChildren();
    for (const row of r.rows) {
        const el = document.createElement('div');
        el.className = 'finding-row' + (row.status === 'agreement' ? '' : ' review');
        const topic = document.createElement('strong');
        topic.textContent = txt(topics[row.key] || [row.key, row.key]);
        el.append(topic);
        for (const side of ['left', 'right']) {
            const d = document.createElement('div');
            const m = document.createElement('span');
            m.className = 'mobile-label';
            m.textContent = (side === 'left' ? 'A' : 'B') + ': ';
            d.append(m, document.createTextNode(row[side]?.text[lang] || tr('Not stated', 'Haijatajwa')));
            el.append(d)
        }
        const status = document.createElement('div');
        status.className = 'status';
        status.textContent = txt(labels[row.status]);
        el.append(status);
        $('findings').append(el)
    }
    if (!r.rows.length) {
        const p = document.createElement('p');
        p.className = 'warning';
        p.textContent = txt(descriptions[r.status]);
        $('findings').append(p)
    }
    $('checklist').replaceChildren();
    const agreed = r.rows.filter(x => x.status === 'agreement');
    for (const row of agreed) {
        const label = document.createElement('label');
        label.className = 'check';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'check-' + row.key;
        const key = c.id + ':' + row.key;
        input.checked = !!checks[key];
        input.addEventListener('change', () => {
            checks[key] = input.checked;
            set('save-status', tr('Progress changed. Save again to keep it on this device.', 'Maendeleo yamebadilika. Hifadhi tena ili yabaki kwenye kifaa hiki.'))
        });
        label.append(input, document.createTextNode(row.left.text[lang]));
        $('checklist').append(label)
    }
    $('scope-action').hidden = !!agreed.length;
    set('scope-action', tr('First confirm the correct scope and current source. No matching steps can be offered from this comparison.', 'Kwanza thibitisha wigo sahihi na chanzo cha sasa. Hakuna hatua zinazolingana kutoka ulinganisho huu.'));
    $('draft').value = requestText(c);
    $('contact').hidden = c.synthetic;
    $('resolve').disabled = c.id !== 'same-term' || resolved;
    $('reset').disabled = !resolved;
    $('save').disabled = resolved;
    set('save-status', snapshot ? tr('Saved locally: ', 'Imehifadhiwa hapa: ') + new Date(snapshot.savedAt).toLocaleString() : tr('Nothing saved. Saving is optional on shared devices.', 'Hakuna kilichohifadhiwa. Kuhifadhi ni hiari kwenye vifaa vya pamoja.'));
    set('resolution-status', resolved ? tr('SIMULATED: the second source now matches. The newly available step is unchecked. This preview cannot be saved as reviewed evidence.', 'MFANO: chanzo cha pili sasa kinalingana. Hatua mpya haijawekewa alama. Mfano huu hauwezi kuhifadhiwa kama ushahidi uliokaguliwa.') : '');
}
async function load() {
    const ac = new AbortController(),
        timeout = setTimeout(() => ac.abort(), 6000);
    try {
        const res = await fetch('/api/catalog', {
            cache: 'no-store',
            signal: ac.signal
        });
        if (!res.ok) throw Error();
        const d = await res.json();
        if (!d.cases?.length) throw Error();
        if (snapshot && snapshot.catalog.version !== d.version) {
            checks = {};
            refresh = true
        }
        catalog = d;
        offline = false;
        $('error').hidden = true;
    } catch {
        offline = true;
        if (!snapshot) {
            $('loading').hidden = true;
            $('error').hidden = false;
            set('error', tr('The catalog could not load. Reconnect and reload. No comparison is available without evidence.', 'Katalogi haikupatikana. Unganisha tena na upakie. Hakuna ulinganisho bila ushahidi.'))
        }
    } finally {
        clearTimeout(timeout);
        render()
    }
}
$('language').addEventListener('change', () => {
    lang = $('language').value;
    render()
});
$('case').addEventListener('change', () => {
    caseId = $('case').value;
    resolved = false;
    render()
});
$('save').addEventListener('click', async () => {
    try {
        if (resolved) return;
        await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
        snapshot = {
            catalog,
            caseId,
            lang,
            checks: {
                ...checks
            },
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(KEY, JSON.stringify(snapshot));
        render();
        set('save-status', tr('Saved. Reopen offline; save again after changing your progress.', 'Imehifadhiwa. Fungua bila intaneti; hifadhi tena ukibadili maendeleo.'))
    } catch {
        set('save-status', tr('Offline saving unavailable. Download the action pack instead.', 'Kuhifadhi hakupatikani. Pakua mwongozo wa hatua.'))
    }
});

function actionPack() {
    const c = current();
    return ['Conflicting Answers', c.synthetic ? 'SYNTHETIC FIXTURE — NOT OFFICIAL GUIDANCE' : 'Independent prototype — clarify before acting', c.title[lang], txt(labels[c.comparison.status]), txt(descriptions[c.comparison.status]), $('cautions').textContent, '', ...c.sources.map((s, i) => `${i?'B':'A'}: ${s.publisher}\n${s.url||'Synthetic fixture'}\nChecked: ${s.checked_at}; effective: ${s.valid_from||'unknown'}\n${s.scope_note[lang]}`), '', ...c.comparison.rows.map(r => `${txt(topics[r.key])}\nA: ${r.left?.text[lang]||'Not stated'}\nB: ${r.right?.text[lang]||'Not stated'}\n${txt(labels[r.status])}`), '', words[lang]['partial-note'], ...c.comparison.rows.filter(r => r.status === 'agreement').map(r => `[${checks[c.id+':'+r.key]?'x':' '}] ${r.left.text[lang]}`), '', requestText(c), lang === 'sw' ? 'Swahili: AI draft, independent review pending' : '', resolved ? 'SIMULATED CLARIFICATION PREVIEW — NOT REVIEWED EVIDENCE' : ''].join('\n')
}
$('download').addEventListener('click', () => {
    const blob = new Blob([actionPack()], {
            type: 'text/plain;charset=utf-8'
        }),
        url = URL.createObjectURL(blob),
        a = document.createElement('a');
    a.href = url;
    a.download = (current().synthetic ? 'SYNTHETIC-' : '') + 'conflicting-answers.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000)
});
$('print').addEventListener('click', () => window.print());
$('copy').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText($('draft').value);
        set('copy-status', tr('Copied. Review before sending.', 'Imenakiliwa. Kagua kabla ya kutuma.'))
    } catch {
        $('draft').select();
        set('copy-status', tr('Select and copy the request manually.', 'Chagua na unakili ombi mwenyewe.'))
    }
});
$('clear').addEventListener('click', async () => {
    localStorage.removeItem(KEY);
    snapshot = null;
    checks = {};
    resolved = false;
    refresh = false;
    try {
        for (const k of await caches.keys())
            if (k.startsWith('ca-')) await caches.delete(k);
        for (const r of await navigator.serviceWorker.getRegistrations())
            if (r.active?.scriptURL === location.origin + '/sw.js') await r.unregister()
    } catch {}
    render();
    set('save-status', tr('Saved data cleared. Downloaded files and browser history are not deleted.', 'Taarifa zilizohifadhiwa zimefutwa. Faili zilizopakuliwa na historia ya kivinjari hazijafutwa.'))
});
$('resolve').addEventListener('click', () => {
    if (caseId !== 'same-term') return;
    resolved = true;
    delete checks[caseId + ':payment_documents'];
    render();
    $('result-title').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
});
$('reset').addEventListener('click', () => {
    resolved = false;
    render()
});
window.addEventListener('offline', () => {
    offline = true;
    render()
});
window.addEventListener('online', () => {
    resolved = false;
    load()
});
render();
load();
