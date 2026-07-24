import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
    createAnalyticsDispatcher,
    sanitizeEventProperties,
} from '../js/analytics.js';

const contract = JSON.parse(
    fs.readFileSync(new URL('../contracts/analytics-events.json', import.meta.url)),
);

test('registration_completed maps to the three canonical provider events', () => {
    // Arrange
    const completed = contract.events.registration_completed;

    // Act
    const providerEvents = completed.providers;

    // Assert
    assert.deepEqual(providerEvents, {
        ga4: 'generate_lead',
        yandex: 'registration_completed',
        amplitude: 'Registration Completed',
    });
});

test('property sanitization drops PII and unsupported values', () => {
    // Arrange
    const properties = {
        selected_plan: 'basic',
        response_status: 200,
        email: 'person@example.test',
        phone: '+70000000000',
        nested: {unsafe: true},
    };

    // Act
    const sanitized = sanitizeEventProperties(
        contract.allowedProperties,
        properties,
    );

    // Assert
    assert.deepEqual(sanitized, {
        selected_plan: 'basic',
        response_status: 200,
    });
});

test('dispatcher emits one success event per provider with shared version context', () => {
    // Arrange
    const calls = [];
    const track = createAnalyticsDispatcher({
        contract,
        siteVersion: 'candidate-test',
        amplitudeClient: {
            track: (eventName, properties) => {
                calls.push(['amplitude', eventName, properties]);
            },
        },
        windowObject: {
            gtag: (command, eventName, properties) => {
                calls.push(['ga4', command, eventName, properties]);
            },
            ym: (counterId, command, eventName, properties) => {
                calls.push(['yandex', counterId, command, eventName, properties]);
            },
        },
    });

    // Act
    const emitted = track('registration_completed', {
        form_surface: 'registration',
        selected_plan: 'advanced',
        email: 'must-not-leak@example.test',
    });

    // Assert
    assert.equal(emitted, true);
    assert.equal(calls.length, 3);
    assert.equal(calls[0][1], 'Registration Completed');
    assert.equal(calls[1][2], 'generate_lead');
    assert.equal(calls[2][3], 'registration_completed');
    calls.forEach((call) => {
        const properties = call.at(-1);
        assert.equal(properties.analytics_schema_version, '2.0.0');
        assert.equal(
            properties.experiment_id,
            'rank1-audience-outcome-20260724',
        );
        assert.equal(properties.site_version, 'candidate-test');
        assert.equal(properties.email, undefined);
    });
});

test('every logical event has complete provider mappings and allowed required properties', () => {
    // Arrange
    const allowed = new Set(contract.allowedProperties);

    // Act
    const events = Object.entries(contract.events);

    // Assert
    assert.ok(events.length >= 6);
    events.forEach(([logicalName, definition]) => {
        assert.match(logicalName, /^[a-z][a-z0-9_]*$/);
        assert.deepEqual(
            Object.keys(definition.providers).sort(),
            ['amplitude', 'ga4', 'yandex'],
        );
        definition.requiredProperties.forEach((property) => {
            assert.ok(allowed.has(property), `${logicalName}.${property}`);
        });
    });
});

test('one broken provider does not block the other providers', () => {
    // Arrange
    const calls = [];
    const track = createAnalyticsDispatcher({
        contract,
        siteVersion: 'candidate-test',
        amplitudeClient: {
            track: () => {
                throw new Error('provider unavailable');
            },
        },
        windowObject: {
            gtag: () => {
                calls.push('ga4');
            },
            ym: () => {
                calls.push('yandex');
            },
        },
    });

    // Act
    const emitted = track('landing_viewed');

    // Assert
    assert.equal(emitted, true);
    assert.deepEqual(calls, ['ga4', 'yandex']);
});
