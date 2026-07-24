import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync(new URL('../index.php', import.meta.url), 'utf8');
const analyticsContract = JSON.parse(
    fs.readFileSync(
        new URL('../contracts/analytics-events.json', import.meta.url),
        'utf8',
    ),
);

test('simulator-facing registration contract remains intact', () => {
    // Arrange
    const requiredFragments = [
        'id="registration-form"',
        'action="api/submit.php"',
        'method="post"',
        'name="name"',
        'name="phone"',
        'name="email"',
        '<script src="api/visit.php" defer></script>',
        'pricing-section',
        'program-module',
        'program-list',
    ];

    // Act
    const missingFragments = requiredFragments.filter(
        (fragment) => !html.includes(fragment),
    );

    // Assert
    assert.deepEqual(missingFragments, []);
});

test('pricing CTAs expose three stable analytics plan identifiers', () => {
    // Arrange
    const expectedPlans = ['advanced', 'basic', 'corporate'];

    // Act
    const plans = [...html.matchAll(
        /class="btn btn-register" data-plan-id="([a-z]+)"/g,
    )]
        .map((match) => match[1])
        .sort();

    // Assert
    assert.deepEqual(plans, expectedPlans);
});

test('contact form is masked for replay tooling', () => {
    // Arrange
    const formTag = html.match(/<form[^>]+id="registration-form"[^>]*>/)?.[0];
    const protectedFields = [...html.matchAll(
        /<input class="ym-disable-keys"[^>]+name="(name|phone|email)"/g,
    )].map((match) => match[1]).sort();

    // Act
    const hasYandexMask = formTag?.includes('ym-disable-keys');
    const hasAmplitudeMask = formTag?.includes('data-amp-mask');

    // Assert
    assert.equal(hasYandexMask, true);
    assert.equal(hasAmplitudeMask, true);
    assert.deepEqual(protectedFields, ['email', 'name', 'phone']);
});

test('dynamic form messages keep the Yandex content mask in every state', () => {
    // Arrange
    const source = fs.readFileSync(
        new URL('../js/main.js', import.meta.url),
        'utf8',
    );

    // Act
    const classAssignments = [...source.matchAll(
        /message\.className = '([^']+)'/g,
    )].map((match) => match[1]);

    // Assert
    assert.equal(classAssignments.length, 3);
    classAssignments.forEach((className) => {
        assert.match(className, /\bym-hide-content\b/);
    });
});

test('candidate experiment marker matches the executable analytics contract', () => {
    // Arrange
    const experimentMarker = html.match(
        /<meta name="naition-experiment-id" content="([^"]+)">/,
    )?.[1];
    const siteVersion = html.match(
        /<meta name="naition-site-version" content="([^"]+)">/,
    )?.[1];

    // Act
    const markers = {
        contractExperimentId: analyticsContract.experimentId,
        experimentMarker,
        siteVersion,
    };

    // Assert
    assert.deepEqual(markers, {
        contractExperimentId: 'rank1-free-full-course-20260724',
        experimentMarker: 'rank1-free-full-course-20260724',
        siteVersion: 'free-full-course-v1-20260724',
    });
});

test('free Basic offer is explicit and internally consistent', () => {
    // Arrange
    const basicCard = html.match(
        /<article class="pricing-card featured">([\s\S]*?)<\/article>/,
    )?.[1] || '';

    // Act
    const offer = {
        heading: basicCard.includes('<h3>Бесплатный полный курс</h3>'),
        price: basicCard.includes('<div class="price">0 ₽ <span>за весь курс</span></div>'),
        cta: basicCard.includes(
            'data-plan-id="basic" data-price="0 ₽ за полный курс"',
        ),
        paidPrice: basicCard.includes('4 900 ₽'),
    };

    // Assert
    assert.deepEqual(offer, {
        heading: true,
        price: true,
        cta: true,
        paidPrice: false,
    });
});
