'use strict';
const $ = id => document.getElementById(id),
    KEY = 'ca-snapshot-v2',
    LEGACY_KEY = 'ca-snapshot-v1';
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

function requestText(c) {
    if (c.synthetic) return tr('SYNTHETIC EXAMPLE — DO NOT SEND\n', 'MFANO WA KUBUNI — USITUME\n') + tr('Please clarify which payment-document count applies to the same applicant and period. This example has no real institution.', 'Tafadhali fafanua idadi ya hati za malipo kwa mwombaji na kipindi kimoja. Mfano huu hauna taasisi halisi.');
    return tr('Hello Directorate of Immigration Services,\n\nI am checking first-passport preparation for an adult Kenyan citizen by birth. Your requirements page mentions two payment invoices; the eCitizen page mentions three application receipts. Do these refer to the same document? Which documents and quantities apply now, and is there a current official notice confirming this? Please also confirm applicability to my intended office.\n\nSources:\n', 'Habari Idara ya Uhamiaji,\n\nNinakagua maandalizi ya pasipoti ya kwanza kwa raia mzima wa Kenya kwa kuzaliwa. Ukurasa wa mahitaji unataja ankara mbili za malipo; ukurasa wa eCitizen unataja risiti tatu za maombi. Je, hizi ni hati ileile? Ni hati zipi na idadi gani zinahitajika sasa? Je, kuna taarifa rasmi ya sasa inayothibitisha hili? Tafadhali thibitisha pia matumizi katika ofisi ninayokusudia.\n\nVyanzo:\n') + c.sources.map(s => s.url).join('\n') + tr('\n\nThank you.', '\n\nAsante.')
}

Object.assign(words.en, {
    'headline': 'Prepare before you travel.',
    'intro-copy': 'Know what to prepare, what to clarify and what changed.',
    'intro-note': 'No account. No document uploads.\nYour progress stays on this device.',
    'coverage-label': 'PILOT SCOPE',
    'act-label': 'BEFORE YOU TRAVEL',
    'action-heading': 'Your preparation plan',
    'partial-note': 'Partial checklist from compared statements. Confirm the full requirements with the institution.',
    'save': 'Save plan offline',
    'download': 'Download plan',
    'ask-label': 'CLARIFY BEFORE LEAVING',
    'ask-heading': 'Questions to resolve',
    'nav-prepare': '01 Prepare',
    'nav-clarify': '02 Clarify',
    'nav-changes': '03 Review changes',
    'nav-evidence': '04 Inspect sources',
    'changes-heading': 'What changed in your plan?',
    'change-explanation': 'Changed steps reopen for review. Unchanged progress stays checked.',
    'demo-label': 'Try a fictional requirement update',
    'demo-description': 'A separate training example shows how one changed requirement reopens. Official evidence and your saved plan stay separate.',
    'demo-start': 'Start fictional demo',
    'demo-update': 'Apply fictional update',
    'demo-exit': 'Exit demo',
    'scope-limit': 'This does not confirm local office applicability. Ask the institution about your intended office.'
});
Object.assign(words.sw, {
    'headline': 'Jiandae kabla ya safari.',
    'intro-copy': 'Jua cha kuandaa, cha kufafanua na kilichobadilika.',
    'intro-note': 'Hakuna akaunti wala kupakia nyaraka.\nMaendeleo yako yanabaki kwenye kifaa hiki.',
    'coverage-label': 'WIGO WA JARIBIO',
    'act-label': 'KABLA YA SAFARI',
    'action-heading': 'Mpango wako wa maandalizi',
    'partial-note': 'Orodha hii ni sehemu ya taarifa zilizolinganishwa. Thibitisha mahitaji yote na taasisi.',
    'save': 'Hifadhi mpango bila intaneti',
    'download': 'Pakua mpango',
    'ask-label': 'FAFANUA KABLA YA KUONDOKA',
    'ask-heading': 'Maswali ya kufafanua',
    'nav-prepare': '01 Jiandae',
    'nav-clarify': '02 Fafanua',
    'nav-changes': '03 Kagua mabadiliko',
    'nav-evidence': '04 Kagua vyanzo',
    'changes-heading': 'Nini kimebadilika kwenye mpango?',
    'change-explanation': 'Hatua zilizobadilika zinahitaji ukaguzi tena. Alama za hatua zisizobadilika zinabaki.',
    'demo-label': 'Jaribu mabadiliko ya hitaji la kubuni',
    'demo-description': 'Mfano tofauti unaonyesha hitaji lililobadilika. Ushahidi rasmi na mpango uliohifadhiwa vinabaki tofauti.',
    'demo-start': 'Anza mfano wa kubuni',
    'demo-update': 'Tumia mabadiliko ya mfano',
    'demo-exit': 'Funga mfano',
    'scope-limit': 'Hii haithibitishi matumizi katika ofisi yako. Uliza taasisi kuhusu ofisi unayokusudia.'
});
let catalog = null,
    lang = 'en',
    caseId = 'observed',
    checks = {},
    snapshot = null,
    offline = false;
let scopeConfirmations = {},
    changeLog = [],
    refresh = false,
    demo = null,
    dirty = false;
try {
    const raw = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY));
    if (raw?.catalog?.cases?.length && raw.catalog.cases.every(c => c.sources?.length === 2 && c.comparison?.rows)) {
        snapshot = raw;
        catalog = raw.catalog;
        lang = raw.lang === 'sw' ? 'sw' : 'en';
        caseId = catalog.cases.some(c => c.id === raw.caseId) ? raw.caseId : 'observed';
        checks = Preparation.reconcile(raw.catalog, raw.catalog, raw.checks || {}).checks;
        scopeConfirmations = raw.scopeConfirmations || {};
        changeLog = Array.isArray(raw.changeLog) ? raw.changeLog : [];
    }
} catch {
    /* Invalid saved data is ignored; online evidence is required. */ }

function txt(pair) {
    return pair?.[lang === 'sw' ? 1 : 0] || '';
}

function tr(en, sw) {
    return lang === 'sw' ? sw : en;
}

function set(id, s) {
    if ($(id)) $(id).textContent = s;
}

function localized(obj) {
    return obj?.[lang] || obj?.en || '';
}

function topic(key) {
    return txt(topics[key] || [key, key]);
}

function current() {
    return demo ? demo.case : catalog.cases.find(c => c.id === caseId) || catalog.cases[0];
}

function activeChecks() {
    return demo ? demo.checks : checks;
}

function activeChanges() {
    return (demo ? demo.changes : changeLog).filter(x => x.id.startsWith(current().id + ':'));
}

function scopeOK() {
    const c = current();
    return demo ? demo.scopeConfirmed : scopeConfirmations[c.id] === Preparation.scopeKey(c);
}

function el(tag, text, className) {
    const e = document.createElement(tag);
    if (text !== undefined) e.textContent = text;
    if (className) e.className = className;
    return e;
}

function renderPlan(c) {
    const rows = Preparation.requirements(c),
        agreed = rows.filter(r => r.status === 'agreement'),
        selected = activeChecks();
    const done = agreed.filter(r => selected[r.id]).length;
    set('plan-progress', `${done} / ${agreed.length} ` + tr('matching steps prepared', 'hatua zinazolingana zimeandaliwa'));
    set('readiness-note', tr('Your ticks record preparation only. They do not confirm eligibility, complete requirements or permission to travel.', 'Alama zinaonyesha maandalizi pekee. Hazithibitishi ustahiki, mahitaji kamili au ruhusa ya safari.'));
    $('checklist').replaceChildren();
    for (const r of agreed) {
        const box = el('div', undefined, 'plan-item'),
            label = el('label', undefined, 'check'),
            input = el('input');
        input.type = 'checkbox';
        input.id = 'check-' + r.key;
        input.checked = !!selected[r.id];
        input.disabled = !scopeOK();
        input.addEventListener('change', () => {
            selected[r.id] = input.checked;
            dirty = true;
            renderPlan(c);
            set('save-status', demo ? tr('Fictional progress only. It is not saved.', 'Maendeleo ya mfano pekee. Hayajahifadhiwa.') : tr('Progress changed. Save again to keep it.', 'Maendeleo yamebadilika. Hifadhi tena.'));
        });
        label.append(input, document.createTextNode(localized(r.text)));
        box.append(label);
        const evidence = el('div', undefined, 'plan-evidence');
        c.sources.forEach((s, i) => {
            if (s.url) {
                const a = el('a', tr('Source ', 'Chanzo ') + (i ? 'B' : 'A'));
                a.href = s.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                evidence.append(a);
            }
        });
        evidence.append(document.createTextNode(tr('Checked: ', 'Iliangaliwa: ') + c.sources.map(s => s.checked_at || '?').join(' / ')));
        box.append(evidence);
        $('checklist').append(box);
    }
    $('scope-action').hidden = !!agreed.length;
    set('scope-action', tr('Confirm the correct situation and current source. This comparison offers no matching preparation steps.', 'Thibitisha hali sahihi na chanzo cha sasa. Hakuna hatua zinazolingana katika ulinganisho huu.'));
    const unresolved = rows.filter(r => r.status !== 'agreement');
    $('unresolved').replaceChildren();
    if (unresolved.length)
        for (const r of unresolved) {
            const box = el('div', undefined, 'question');
            box.append(el('strong', topic(r.key)), el('p', txt(labels[r.status])), el('a', tr('Inspect both sources', 'Kagua vyanzo vyote viwili')));
            box.lastChild.href = '#evidence';
            $('unresolved').append(box);
        }
    else $('unresolved').append(el('p', tr('No differing statements in this comparison. Still confirm full requirements and office applicability.', 'Hakuna taarifa zinazotofautiana hapa. Bado thibitisha mahitaji yote na matumizi katika ofisi.')));
    $('draft').value = requestText(c);
    $('contact').hidden = !!c.synthetic;
    $('save').disabled = !!demo;
}

function renderChanges() {
    const changes = activeChanges();
    $('change-list').replaceChildren();
    set('change-count', changes.length ? `${changes.length} ` + tr('item(s) to review', 'vipengele vya kukagua') : '');
    if (!changes.length) {
        $('change-list').append(el('p', snapshot ? tr('No requirement changes recorded for this plan. A newer check date alone does not reopen a step.', 'Hakuna mabadiliko ya mahitaji katika mpango huu. Tarehe mpya ya ukaguzi pekee haifungui hatua tena.') : tr('Save a plan to compare it with a future reviewed catalog. You can try the fictional update below.', 'Hifadhi mpango ili ulinganishe na katalogi iliyokaguliwa baadaye. Unaweza kujaribu mfano hapa chini.'), 'empty'));
        return;
    }
    for (const change of changes) {
        const box = el('article', undefined, 'change-item');
        box.dataset.requirement = change.id;
        box.append(el('h3', topic(change.key) + ' · ' + ({
            changed: tr('Changed', 'Imebadilika'),
            added: tr('Added', 'Imeongezwa'),
            removed: tr('No longer in this comparison', 'Haipo tena katika ulinganisho')
        } [change.kind])));
        if (change.before) box.append(el('p', tr('Before: ', 'Awali: ') + localized(change.before.text)));
        if (change.after) box.append(el('p', tr('Now: ', 'Sasa: ') + localized(change.after.text), 'after'));
        box.append(el('p', change.kind === 'removed' ? tr('A removed comparison item is not proof the institution removed its requirement. Confirm before acting.', 'Kuondolewa hapa hakuthibitishi kwamba taasisi imeondoa hitaji. Thibitisha.') : tr('Review the wording, evidence and applicability. Changed or new steps are unchecked until you prepare them again.', 'Kagua maelezo, ushahidi na matumizi. Hatua mpya au zilizobadilika hazijawekewa alama hadi uziandae tena.')));
        if (change.before && change.after && localized(change.before.text) === localized(change.after.text)) box.append(el('p', tr('The wording is unchanged, but supporting evidence, scope, effective dates or comparison status changed.', 'Maelezo hayajabadilika lakini ushahidi, wigo, tarehe za matumizi au matokeo yamebadilika.')));
        $('change-list').append(box);
    }
}

function render() {
    document.documentElement.lang = lang;
    $('language').value = lang;
    for (const [id, s] of Object.entries(words[lang])) set(id, s);
    set('network', offline ? tr('Offline · saved snapshot', 'Bila intaneti · nakala iliyohifadhiwa') : tr('Online · dated evidence', 'Mtandaoni · ushahidi wenye tarehe'));
    if (!catalog) return;
    $('loading').hidden = true;
    $('content').hidden = false;
    const select = $('case');
    select.replaceChildren();
    for (const c of catalog.cases) {
        const o = el('option', localized(c.title));
        o.value = c.id;
        select.append(o);
    }
    if (demo) {
        const o = el('option', localized(demo.case.title));
        o.value = 'travel-demo';
        select.append(o);
    }
    select.value = demo ? 'travel-demo' : caseId;
    const c = current(),
        r = c.comparison;
    set('coverage', demo ? tr('Fictional training example only. No real service or office.', 'Mfano wa mafunzo pekee. Hakuna huduma au ofisi halisi.') : localized(catalog.coverage));
    $('fixture').hidden = !c.synthetic;
    set('fixture', tr('FICTIONAL DEMONSTRATION — invented requirements. Not official guidance.', 'MFANO WA KUBUNI — mahitaji ya kubuni. Si mwongozo rasmi.'));
    $('translation').hidden = lang !== 'sw';
    set('translation', 'Tafsiri ya Kiswahili ni rasimu ya AI. Ukaguzi huru bado unahitajika.');
    $('refresh-note').hidden = !refresh || !!demo;
    set('refresh-note', tr('Catalog refreshed. Only changed requirements reopen; unchanged preparation is kept. Save again after reviewing.', 'Katalogi imesasishwa. Mahitaji yaliyobadilika pekee yanafunguliwa tena. Maandalizi yasiyobadilika yanabaki. Kagua na uhifadhi tena.'));
    set('scope-confirm-text', c.synthetic ? tr('I understand this is a fictional example.', 'Ninaelewa huu ni mfano wa kubuni.') : tr('I am preparing a first passport as an adult Kenyan citizen by birth.', 'Ninaandaa pasipoti ya kwanza kama raia mzima wa Kenya kwa kuzaliwa.'));
    $('scope-confirm').checked = scopeOK();
    set('finding-label', demo ? tr('FICTIONAL COMPARISON', 'ULINGANISHO WA KUBUNI') : words[lang]['finding-label']);
    set('result-title', txt(labels[r.status]));
    set('result-description', txt(descriptions[r.status]));
    set('agree-count', r.rows.filter(x => x.status === 'agreement').length);
    const cautions = [];
    if (r.cautions?.includes('effective_date_unknown')) cautions.push(tr('Effective dates are unknown. A recent source check does not establish which rule applies.', 'Tarehe za kuanza matumizi hazijulikani. Ukaguzi wa hivi karibuni hauthibitishi kanuni inayotumika.'));
    if (c.sources.some(s => {
            const age = (Date.now() - Date.parse(s.checked_at + 'T00:00:00Z')) / 86400000;
            return !Number.isFinite(age) || age < 0 || age > 30;
        })) cautions.push(tr('Source review is overdue or its date is invalid. Recheck before acting.', 'Ukaguzi wa chanzo umechelewa au tarehe si sahihi. Kagua tena.'));
    if (offline) cautions.push(tr('Offline: source links and currency cannot be rechecked until you reconnect.', 'Bila intaneti: vyanzo na usasa haviwezi kukaguliwa hadi uunganishe tena.'));
    set('cautions', cautions.join(' '));
    set('checked-label', tr('Source checks: ', 'Ukaguzi wa vyanzo: ') + c.sources.map(s => s.checked_at).join(' / '));
    renderPlan(c);
    renderChanges();
    renderEvidence(c);
    set('save-status', demo ? tr('Fictional preview. Saving is disabled; your real plan stays separate.', 'Mfano wa kubuni. Kuhifadhi kumezimwa; mpango wako halisi unabaki tofauti.') : dirty ? tr('Unsaved progress. Save again to keep it.', 'Maendeleo hayajahifadhiwa. Hifadhi tena.') : snapshot ? tr('Saved on this device: ', 'Imehifadhiwa kwenye kifaa hiki: ') + new Date(snapshot.savedAt).toLocaleString() : tr('Nothing saved. Saving is optional on shared devices.', 'Hakuna kilichohifadhiwa. Kuhifadhi ni hiari kwenye vifaa vya pamoja.'));
    $('demo-start').disabled = !!demo;
    $('demo-update').disabled = !demo || demo.stage === 2;
    $('demo-exit').disabled = !demo;
    set('demo-status', demo ? (demo.stage === 1 ? tr('FICTIONAL: tick the three steps, then apply the update. Nothing is published.', 'MFANO: weka alama kwenye hatua tatu kisha tumia mabadiliko. Hakuna kinachochapishwa.') : tr('FICTIONAL UPDATE: receipt copies changed from two to three. Only that step reopened. Unchanged ticks remain.', 'MABADILIKO YA MFANO: nakala za risiti zimebadilika kutoka mbili hadi tatu. Hatua hiyo pekee imefunguliwa tena.')) : '');
}

function renderEvidence(c) {
    const r = c.comparison;
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

}
async function load() {
    const ac = new AbortController(),
        timer = setTimeout(() => ac.abort(), 6000);
    try {
        const response = await fetch('/api/catalog', {
            cache: 'no-store',
            signal: ac.signal
        });
        if (!response.ok) throw Error();
        const next = await response.json();
        if (!next.cases?.length || next.cases.some(c => c.sources?.length !== 2 || !c.comparison?.rows)) throw Error();
        const previous = catalog,
            result = Preparation.reconcile(previous, next, checks);
        checks = result.checks;
        if (previous && (result.changes.length || previous.version !== next.version)) {
            refresh = true;
            dirty = true;
            const log = new Map(changeLog.map(c => [c.id, c]));
            for (const change of result.changes) log.set(change.id, change);
            changeLog = [...log.values()];
        }
        for (const c of next.cases)
            if (scopeConfirmations[c.id] !== Preparation.scopeKey(c)) delete scopeConfirmations[c.id];
        catalog = next;
        if (!next.cases.some(c => c.id === caseId)) caseId = next.cases[0].id;
        offline = false;
        $('error').hidden = true;
    } catch {
        offline = true;
        if (!catalog) {
            $('loading').hidden = true;
            $('error').hidden = false;
            set('error', tr('The catalog could not load. Reconnect and reload. No plan is available without evidence.', 'Katalogi haikupatikana. Unganisha tena na upakie. Hakuna mpango bila ushahidi.'));
        }
    } finally {
        clearTimeout(timer);
        render();
    }
}
$('language').addEventListener('change', () => {
    lang = $('language').value;
    render();
});
$('case').addEventListener('change', () => {
    const selected = $('case').value;
    if (selected === 'travel-demo') return;
    demo = null;
    caseId = selected;
    render();
});
$('scope-confirm').addEventListener('change', () => {
    const c = current();
    if (demo) demo.scopeConfirmed = $('scope-confirm').checked;
    else if ($('scope-confirm').checked) scopeConfirmations[c.id] = Preparation.scopeKey(c);
    else delete scopeConfirmations[c.id];
    dirty = true;
    render();
});
$('save').addEventListener('click', async () => {
    if (demo) return;
    try {
        await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
        snapshot = {
            schema: 2,
            catalog,
            caseId,
            lang,
            checks: {
                ...checks
            },
            scopeConfirmations: {
                ...scopeConfirmations
            },
            changeLog,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(KEY, JSON.stringify(snapshot));
        localStorage.removeItem(LEGACY_KEY);
        dirty = false;
        refresh = false;
        render();
        set('save-status', tr('Saved. Reopen offline; save again after changing your progress.', 'Imehifadhiwa. Fungua bila intaneti; hifadhi tena ukibadili maendeleo.'));
    } catch {
        set('save-status', tr('Offline saving unavailable. Download the plan instead.', 'Kuhifadhi hakupatikani. Pakua mpango.'));
    }
});

function actionPack() {
    const c = current(),
        selected = activeChecks();
    const parts = ['Conflicting Answers — Before You Travel', c.synthetic ? 'FICTIONAL EXAMPLE — NOT OFFICIAL GUIDANCE' : 'Independent prototype — clarify before acting', localized(c.title), scopeOK() ? tr('Situation acknowledged by user. Office applicability still needs confirmation.', 'Hali imethibitishwa na mtumiaji. Matumizi katika ofisi bado yanahitaji uthibitisho.') : tr('Situation not yet acknowledged. Check applicability before using this plan.', 'Hali bado haijathibitishwa. Kagua matumizi kabla ya kutumia mpango.'), txt(labels[c.comparison.status]), $('cautions').textContent, '', words[lang]['partial-note']];
    for (const r of Preparation.requirements(c)) parts.push((r.status === 'agreement' ? `[${selected[r.id]?'x':' '}] ` : tr('[CLARIFY] ', '[FAFANUA] ')) + localized(r.text) + ' — ' + txt(labels[r.status]));
    parts.push('', words[lang]['changes-heading']);
    for (const x of activeChanges()) parts.push(topic(x.key) + ': ' + x.kind + '\n' + tr('Before: ', 'Awali: ') + localized(x.before?.text) + '\n' + tr('Now: ', 'Sasa: ') + localized(x.after?.text));
    parts.push('', tr('SOURCE EVIDENCE', 'USHAHIDI WA VYANZO'));
    for (const s of c.sources) parts.push(s.publisher + '\n' + (s.url || 'Fictional source') + '\nChecked: ' + s.checked_at + '; effective: ' + (s.valid_from || 'unknown') + (s.valid_to ? ' to ' + s.valid_to : '') + '\n' + localized(s.scope_note));
    for (const r of c.comparison.rows) parts.push(topic(r.key) + '\nA: ' + (localized(r.left?.text) || 'Not stated') + '\nB: ' + (localized(r.right?.text) || 'Not stated'));
    parts.push('', requestText(c), lang === 'sw' ? 'Swahili: AI draft, independent review pending' : '');
    return parts.join('\n');
}
$('download').addEventListener('click', () => {
    const blob = new Blob([actionPack()], {
            type: 'text/plain;charset=utf-8'
        }),
        url = URL.createObjectURL(blob),
        a = el('a');
    a.href = url;
    a.download = (current().synthetic ? 'FICTIONAL-' : '') + 'before-you-travel.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('print').addEventListener('click', () => window.print());
$('copy').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText($('draft').value);
        set('copy-status', tr('Copied. Review before sending.', 'Imenakiliwa. Kagua kabla ya kutuma.'));
    } catch {
        $('draft').select();
        set('copy-status', tr('Select and copy the request manually.', 'Chagua na unakili ombi mwenyewe.'));
    }
});
$('clear').addEventListener('click', async () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
    snapshot = null;
    checks = {};
    scopeConfirmations = {};
    changeLog = [];
    demo = null;
    dirty = false;
    refresh = false;
    try {
        for (const k of await caches.keys())
            if (k.startsWith('ca-')) await caches.delete(k);
        for (const r of await navigator.serviceWorker.getRegistrations())
            if (r.active?.scriptURL === location.origin + '/sw.js') await r.unregister();
    } catch {}
    render();
    set('save-status', tr('Saved data cleared. Downloads and browser history remain outside this deletion.', 'Taarifa zilizohifadhiwa zimefutwa. Faili zilizopakuliwa na historia ya kivinjari hazijafutwa.'));
});
$('demo-start').addEventListener('click', () => {
    demo = {
        case: Preparation.makeDemo(1),
        checks: {},
        changes: [],
        stage: 1,
        scopeConfirmed: true
    };
    render();
    $('prepare').scrollIntoView();
});
$('demo-update').addEventListener('click', () => {
    if (!demo || demo.stage === 2) return;
    const next = Preparation.makeDemo(2),
        result = Preparation.reconcile({
            cases: [demo.case]
        }, {
            cases: [next]
        }, demo.checks);
    demo = {
        ...demo,
        case: next,
        stage: 2,
        checks: result.checks,
        changes: result.changes
    };
    render();
    $('prepare').scrollIntoView();
});
$('demo-exit').addEventListener('click', () => {
    demo = null;
    render();
    $('prepare').scrollIntoView();
});
window.addEventListener('offline', () => {
    offline = true;
    render();
});
window.addEventListener('online', () => load());
render();
load();
