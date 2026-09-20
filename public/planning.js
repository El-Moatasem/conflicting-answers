/* Pure preparation logic shared by the browser and Node tests. No personal data. */
(function(root) {
    'use strict';

    function canonical(value) {
        if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
        if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
        return JSON.stringify(value ?? null);
    }

    function requirements(c) {
        return (c.comparison?.rows || []).map(row => ({
            id: c.id + ':' + row.key,
            key: row.key,
            status: row.status,
            text: row.left?.text || row.right?.text || {
                en: row.key,
                sw: row.key
            },
            evidence: c.sources.map((s, index) => ({
                sourceId: s.id,
                publisher: s.publisher,
                url: s.url || null,
                section: s.section || null,
                scope: s.scope,
                scopeNote: s.scope_note,
                validFrom: s.valid_from || null,
                validTo: s.valid_to || null,
                claim: index === 0 ? row.left : row.right
            })),
            // Retrieval/check dates, catalog versions and source ordering do not define a rule.
            fingerprint: canonical({
                status: row.status,
                synthetic: !!c.synthetic,
                sources: c.sources.map((s, index) => ({
                    id: s.id,
                    publisher: s.publisher,
                    url: s.url || null,
                    section: s.section || null,
                    scope: s.scope,
                    scopeNote: s.scope_note,
                    validFrom: s.valid_from || null,
                    validTo: s.valid_to || null,
                    claim: index === 0 ? row.left : row.right
                })).sort((a, b) => String(a.id).localeCompare(String(b.id)))
            })
        }));
    }

    function catalogRequirements(catalog) {
        return (catalog?.cases || []).flatMap(requirements);
    }

    function reconcile(previous, current, checks) {
        const old = new Map(catalogRequirements(previous).map(r => [r.id, r]));
        const next = catalogRequirements(current),
            nextIds = new Set(next.map(r => r.id));
        const kept = {},
            changes = [];
        for (const r of next) {
            const before = old.get(r.id);
            if (before && before.fingerprint === r.fingerprint) {
                if (r.status === 'agreement' && checks[r.id] === true) kept[r.id] = true;
            } else if (previous) {
                changes.push({
                    id: r.id,
                    key: r.key,
                    kind: before ? 'changed' : 'added',
                    before: before || null,
                    after: r
                });
            }
        }
        for (const r of old.values())
            if (!nextIds.has(r.id)) changes.push({
                id: r.id,
                key: r.key,
                kind: 'removed',
                before: r,
                after: null
            });
        return {
            checks: kept,
            changes
        };
    }

    function scopeKey(c) {
        return canonical({
            synthetic: !!c.synthetic,
            scopes: c.sources.map(s => ({
                id: s.id,
                scope: s.scope,
                scopeNote: s.scope_note
            })).sort((a, b) => String(a.id).localeCompare(String(b.id)))
        });
    }

    function makeDemo(stage) {
        const claims = {
            birth_certificate: {
                term: 'birth_certificate',
                value: 'original_and_copy',
                text: {
                    en: 'Original birth certificate plus a copy.',
                    sw: 'Cheti halisi cha kuzaliwa pamoja na nakala.'
                }
            },
            national_id: {
                term: 'national_id',
                value: 'original_and_copy',
                text: {
                    en: 'Original national identity card plus a copy.',
                    sw: 'Kitambulisho halisi cha taifa pamoja na nakala.'
                }
            },
            payment_documents: {
                term: 'sample_receipt',
                value: stage === 2 ? 3 : 2,
                text: {
                    en: stage === 2 ? 'Three copies of the fictional receipt.' : 'Two copies of the fictional receipt.',
                    sw: stage === 2 ? 'Nakala tatu za risiti ya mfano.' : 'Nakala mbili za risiti ya mfano.'
                }
            }
        };
        const sources = ['A', 'B'].map(id => ({
            id: 'demo-' + id,
            publisher: 'Fictional office ' + id,
            url: null,
            checked_at: '2026-09-20',
            valid_from: null,
            valid_to: null,
            scope: {
                service: 'demo_service',
                jurisdiction: 'FICTIONAL',
                applicant: 'demo_adult'
            },
            scope_note: {
                en: 'Fictional training example. No real institution or requirement.',
                sw: 'Mfano wa mafunzo. Hakuna taasisi au hitaji halisi.'
            },
            claims: JSON.parse(JSON.stringify(claims)),
            short_quote: stage === 2 ? 'Three fictional receipt copies' : 'Two fictional receipt copies'
        }));
        return {
            id: 'travel-demo',
            synthetic: true,
            title: {
                en: 'Fictional visit: requirement update',
                sw: 'Ziara ya mfano: hitaji limebadilika'
            },
            sources,
            comparison: {
                status: 'agreement',
                rows: Object.entries(claims).map(([key, v]) => ({
                    key,
                    left: v,
                    right: v,
                    status: 'agreement'
                })),
                cautions: ['effective_date_unknown']
            }
        };
    }
    const api = {
        canonical,
        requirements,
        reconcile,
        scopeKey,
        makeDemo
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.Preparation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
