const MAX_STRING_LENGTH = 80;

function sanitizeValue(value) {
    if (typeof value === 'string') {
        return value.slice(0, MAX_STRING_LENGTH);
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    return undefined;
}

export function sanitizeEventProperties(allowedProperties, properties) {
    const allowed = new Set(allowedProperties);
    const sanitized = {};

    Object.entries(properties).forEach(([key, value]) => {
        if (!allowed.has(key)) {
            return;
        }

        const sanitizedValue = sanitizeValue(value);
        if (sanitizedValue !== undefined) {
            sanitized[key] = sanitizedValue;
        }
    });

    return sanitized;
}

function safeCall(callback) {
    try {
        callback();
    } catch {
        // Analytics must never break the registration flow.
    }
}

export function createAnalyticsDispatcher({
    contract,
    siteVersion,
    amplitudeClient,
    windowObject,
}) {
    const commonProperties = {
        analytics_schema_version: contract.schemaVersion,
        experiment_id: contract.experimentId,
        site_version: siteVersion,
    };

    return function trackLogicalEvent(logicalEvent, eventProperties = {}) {
        const definition = contract.events[logicalEvent];
        if (!definition) {
            return false;
        }

        const properties = sanitizeEventProperties(
            contract.allowedProperties,
            {
                ...commonProperties,
                ...eventProperties,
            },
        );

        if (logicalEvent === 'pricing_plan_selected') {
            properties.content_type = 'pricing_plan';
            properties.item_id = properties.selected_plan;
        }

        safeCall(() => {
            amplitudeClient.track(definition.providers.amplitude, properties);
        });

        if (typeof windowObject.gtag === 'function') {
            safeCall(() => {
                windowObject.gtag('event', definition.providers.ga4, properties);
            });
        }

        if (typeof windowObject.ym === 'function') {
            safeCall(() => {
                windowObject.ym(
                    110921681,
                    'reachGoal',
                    definition.providers.yandex,
                    properties,
                );
            });
        }

        return true;
    };
}
