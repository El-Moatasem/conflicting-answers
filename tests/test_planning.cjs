const {
    test
} = require('node:test'), assert = require('node:assert/strict'), P = require('../public/planning.js');
const old = () => ({
        version: 'one',
        cases: [P.makeDemo(1)]
    }),
    all = {
        'travel-demo:birth_certificate': true,
        'travel-demo:national_id': true,
        'travel-demo:payment_documents': true
    };
test('unchanged evidence preserves completion', () => assert.deepEqual(P.reconcile(old(), old(), all).checks, all));
test('changed requirement reopens only its own step', () => {
    const r = P.reconcile(old(), {
        cases: [P.makeDemo(2)]
    }, all);
    assert.equal(r.changes.length, 1);
    assert.equal(r.changes[0].key, 'payment_documents');
    assert.equal(r.checks['travel-demo:payment_documents'], undefined);
    assert.equal(r.checks['travel-demo:national_id'], true);
    assert.equal(r.checks['travel-demo:birth_certificate'], true);
});
test('retrieval date and catalog version preserve progress', () => {
    const n = old();
    n.version = 'two';
    n.cases[0].sources.forEach(s => s.checked_at = '2026-09-21');
    assert.deepEqual(P.reconcile(old(), n, all), {
        checks: all,
        changes: []
    });
});
test('wording changes reopen the affected step', () => {
    const n = old();
    n.cases[0].comparison.rows[0].left.text.en = 'Revised wording';
    assert.equal(P.reconcile(old(), n, all).checks['travel-demo:birth_certificate'], undefined);
});
test('scope changes reopen all affected steps', () => {
    const n = old();
    n.cases[0].sources[0].scope.applicant = 'different';
    assert.deepEqual(P.reconcile(old(), n, all).checks, {});
    assert.notEqual(P.scopeKey(n.cases[0]), P.scopeKey(old().cases[0]));
});
test('effective date changes reopen affected evidence', () => {
    const n = old();
    n.cases[0].sources[0].valid_from = '2026-09-20';
    assert.equal(P.reconcile(old(), n, all).changes.length, 3);
});
test('a conflict cannot retain completion', () => {
    const n = old();
    n.cases[0].comparison.rows[0].status = 'potential_conflict';
    assert.equal(P.reconcile(old(), n, all).checks['travel-demo:birth_certificate'], undefined);
});
test('added requirements are unchecked', () => {
    const p = old();
    p.cases[0].comparison.rows.pop();
    const r = P.reconcile(p, old(), all);
    assert.equal(r.changes[0].kind, 'added');
    assert.equal(r.checks['travel-demo:payment_documents'], undefined);
});
test('removed requirements lose completion', () => {
    const n = old();
    n.cases[0].comparison.rows.pop();
    const r = P.reconcile(old(), n, all);
    assert.equal(r.changes[0].kind, 'removed');
    assert.equal(r.checks['travel-demo:payment_documents'], undefined);
});
test('incomparable rows clear inapplicable progress', () => {
    const n = old();
    n.cases[0].comparison = {
        status: 'different_scope',
        rows: []
    };
    assert.deepEqual(P.reconcile(old(), n, all).checks, {});
});
test('canonicalization ignores property order', () => assert.equal(P.canonical({
    b: 1,
    a: 2
}), P.canonical({
    a: 2,
    b: 1
})));
test('source order does not invalidate progress', () => {
    const n = old();
    n.cases[0].sources.reverse();
    n.cases[0].comparison.rows.forEach(r => {
        [r.left, r.right] = [r.right, r.left]
    });
    assert.deepEqual(P.reconcile(old(), n, all).checks, all);
});
test('fixtures have independent copies', () => {
    const a = P.makeDemo(1),
        b = P.makeDemo(1);
    a.sources[0].claims.payment_documents.value = 99;
    assert.equal(b.sources[0].claims.payment_documents.value, 2);
});
test('only boolean true records completion', () => assert.deepEqual(P.reconcile(old(), old(), {
    'travel-demo:birth_certificate': 'true',
    'travel-demo:national_id': false
}).checks, {}));
