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
        contractExperimentId: 'rank1-fear-to-rehearsal-iter7-20260724',
        experimentMarker: 'rank1-fear-to-rehearsal-iter7-20260724',
        siteVersion: 'fear-to-rehearsal-v1-iter7-20260724',
    });
});

test('hero and first section expose the audience-to-outcome hierarchy', () => {
    // Arrange
    const heroCopy = [
        'Первая помощь в первые минуты: дома, на работе и в дороге',
        'За один день вы руками отработаете четыре действия: оценить сознание и дыхание, вызвать помощь, начать сердечно-лёгочную реанимацию и остановить опасное кровотечение. Каждый алгоритм проходит под контролем инструктора.',
    ];
    const firstSectionCopy = [
        'Что вы сможете сделать до приезда медиков',
        'Дома, на работе или в дороге вы будете знать, с чего начать и какие действия безопасно выполнить до приезда помощи.',
        'Дома: проверить сознание и дыхание',
        'Оценить безопасность, вызвать помощь и начать СЛР, если человек не дышит.',
        'На работе: остановить сильное кровотечение',
        'Наложить давящую повязку или турникет и распознать признаки шока.',
        'В дороге: помочь при травме или ожоге',
        'Зафиксировать конечность, охладить ожог и понять, когда пострадавшего нельзя перемещать.',
        'На практике: собрать действия в цельный сценарий',
        'Отработать алгоритм на манекене, получить обратную связь и сохранить памятку.',
    ];
    const normalize = (value) => value.replace(/\s+/g, ' ').trim();
    const hero = normalize(
        html.match(/<header class="hero">([\s\S]*?)<\/header>/)?.[1] || '',
    );
    const firstSection = normalize(
        html.match(/<main>\s*(<section class="section">[\s\S]*?<\/section>)/)?.[1] || '',
    );
    const decisionSurfaces = normalize([
        html.match(/<section class="section pricing-section"[\s\S]*?<\/section>/)?.[0] || '',
        html.match(/<section class="section registration-section"[\s\S]*?<\/section>/)?.[0] || '',
    ].join(' '));

    // Act
    const heroOccurrences = heroCopy.map(
        (copy) => hero.split(copy).length - 1,
    );
    const firstSectionOccurrences = firstSectionCopy.map(
        (copy) => firstSection.split(copy).length - 1,
    );
    const leakedCopy = [...heroCopy, ...firstSectionCopy].filter(
        (copy) => decisionSurfaces.includes(copy),
    );
    const featureCards = firstSection.match(/class="feature-card"/g) || [];

    // Assert
    assert.deepEqual(heroOccurrences, [1, 1]);
    assert.deepEqual(firstSectionOccurrences, Array(10).fill(1));
    assert.equal(featureCards.length, 4);
    assert.deepEqual(leakedCopy, []);
});

test('hero makes the mastery path explicit without adding another interaction', () => {
    // Arrange
    const bridge = html.match(
        /<section class="hero-practice-loop"[\s\S]*?<\/section>/,
    )?.[0] || '';
    const expectedSteps = [
        ['Разобрать', 'Коротко пройти порядок действий и расставить приоритеты.'],
        ['Увидеть', 'Посмотреть демонстрацию алгоритма целиком перед практикой.'],
        ['Повторить', 'Выполнить действия на манекене и в паре.'],
        ['Собрать сценарий', 'Пройти последовательность целиком и получить индивидуальную обратную связь.'],
    ];

    // Act
    const listItems = bridge.match(/<li>/g) || [];
    const missingSteps = expectedSteps.filter(
        ([label, detail]) => !bridge.includes(label) || !bridge.includes(detail),
    );
    const interactiveDescendants = bridge.match(
        /<(?:a|button|input|select|textarea)\b/g,
    ) || [];
    const protectedSelectors = [
        'btn-register',
        'pricing-section',
        'program-module',
        'program-list',
    ].filter((selector) => bridge.includes(selector));

    // Assert
    assert.match(bridge, /aria-labelledby="practice-loop-title"/);
    assert.match(bridge, /<ol class="practice-loop-steps">/);
    assert.equal(listItems.length, 4);
    assert.deepEqual(missingSteps, []);
    assert.deepEqual(interactiveDescendants, []);
    assert.deepEqual(protectedSelectors, []);
    assert.match(
        html,
        /Страх крови, ответственности или растерянности можно спокойно обсудить\s+на разборе кейсов до итоговой практики\./,
    );
});

test('candidate removes unsupported authority precision without adding proof claims', () => {
    // Arrange
    const unsupportedClaims = [
        'Добросовестный помощник',
        'закон защищает вас от необоснованных претензий',
        'Алексей Кравцов',
        'Марина Соколова',
        'Дмитрий Новиков',
        'Более 8 000 выездов',
        'более 1 200 слушателей',
        'European Resuscitation Council',
        'ERC First Aid Provider',
        'региональной команды инструкторов РКК',
    ];
    const sourceBoundedFacts = [
        'Порядок действий до приезда медиков',
        'Оценить обстановку',
        'Передать пострадавшего медикам',
        'Как проходит практика',
        'Короткий разбор',
        'Демонстрация',
        'Практика руками',
    ];

    // Act
    const survivingUnsupportedClaims = unsupportedClaims.filter(
        (claim) => html.includes(claim),
    );
    const missingSourceBoundedFacts = sourceBoundedFacts.filter(
        (fact) => !html.includes(fact),
    );

    // Assert
    assert.deepEqual(survivingUnsupportedClaims, []);
    assert.deepEqual(missingSourceBoundedFacts, []);
});

test('registration presents the real form before supporting content without synthetic focus', () => {
    // Arrange
    const source = fs.readFileSync(
        new URL('../js/main.js', import.meta.url),
        'utf8',
    );
    const styles = fs.readFileSync(
        new URL('../css/style.css', import.meta.url),
        'utf8',
    );
    const registration = html.slice(
        html.indexOf('<section class="section registration-section"'),
        html.indexOf('</main>'),
    );

    // Act
    const actionAt = registration.indexOf('class="registration-action"');
    const supportAt = registration.indexOf('class="registration-support"');
    const formAt = registration.indexOf('id="registration-form"');
    const valueContractAt = registration.indexOf('class="registration-value-contract"');
    const rewardAt = registration.indexOf('id="registration-reward"');
    const formCount = (registration.match(/id="registration-form"/g) || []).length;
    const forbiddenFocusManipulation = [
        /\bautofocus\b/,
        /\.focus\s*\(/,
        /dispatchEvent\s*\(/,
        /requestSubmit\s*\(/,
        /\.submit\s*\(/,
    ].filter((pattern) => pattern.test(source) || pattern.test(registration));

    // Assert
    assert.equal(formCount, 1);
    assert.ok(actionAt > -1);
    assert.ok(actionAt < formAt);
    assert.ok(formAt < supportAt);
    assert.ok(supportAt < valueContractAt);
    assert.ok(valueContractAt < rewardAt);
    assert.match(styles, /\.registration-transaction-layout\s*\{/);
    assert.match(styles, /grid-template-columns:\s*minmax\(0,\s*1\.15fr\)/);
    assert.deepEqual(forbiddenFocusManipulation, []);
});

test('reciprocal value is concrete and delivered only by the success path', () => {
    // Arrange
    const source = fs.readFileSync(
        new URL('../js/main.js', import.meta.url),
        'utf8',
    );
    const asset = fs.readFileSync(
        new URL('../downloads/first-aid-practice-card.html', import.meta.url),
        'utf8',
    );

    // Act
    const submitConfirmedAt = source.indexOf('await submitRegistrationRequest');
    const rewardRevealedAt = source.indexOf('registrationReward.hidden = false');
    const completedTrackedAt = source.indexOf("trackEvent('registration_completed'");

    // Assert
    assert.match(html, /id="registration-reward"[^>]+hidden/);
    assert.match(html, /href="downloads\/first-aid-practice-card\.html"/);
    assert.ok(asset.length > 2000);
    assert.match(asset, /Карта практики первой помощи/);
    assert.match(asset, /не является медицинской инструкцией/i);
    assert.ok(submitConfirmedAt > -1);
    assert.ok(rewardRevealedAt > submitConfirmedAt);
    assert.ok(completedTrackedAt > rewardRevealedAt);
    assert.equal(
        source.slice(source.indexOf('} catch (error)')).includes(
            'registrationReward.hidden = false',
        ),
        false,
    );
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
