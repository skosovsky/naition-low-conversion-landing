import assert from 'node:assert/strict';
import test from 'node:test';

import {
    RegistrationRequestError,
    submitRegistrationRequest,
} from '../js/registration.js';

function response({ok, status, data, jsonError}) {
    return {
        ok,
        status,
        json: async () => {
            if (jsonError) {
                throw jsonError;
            }
            return data;
        },
    };
}

const request = (fetchImpl) => submitRegistrationRequest({
    action: 'api/submit.php',
    formData: new Map(),
    fetchImpl,
});

test('successful backend response confirms the registration', async () => {
    // Arrange
    const fetchImpl = async () => response({
        ok: true,
        status: 200,
        data: {ok: true},
    });

    // Act
    const result = await request(fetchImpl);

    // Assert
    assert.deepEqual(result, {responseStatus: 200});
});

test('non-JSON 502 remains an HTTP failure', async () => {
    // Arrange
    const fetchImpl = async () => response({
        ok: false,
        status: 502,
        jsonError: new SyntaxError('not JSON'),
    });

    // Act
    const error = await request(fetchImpl).catch((caught) => caught);

    // Assert
    assert.ok(error instanceof RegistrationRequestError);
    assert.equal(error.failureType, 'http');
    assert.equal(error.responseStatus, 502);
});

test('invalid JSON on a successful response has its own failure type', async () => {
    // Arrange
    const fetchImpl = async () => response({
        ok: true,
        status: 200,
        jsonError: new SyntaxError('not JSON'),
    });

    // Act
    const error = await request(fetchImpl).catch((caught) => caught);

    // Assert
    assert.equal(error.failureType, 'invalid_json');
    assert.equal(error.responseStatus, 200);
});

test('data.ok=false is an application failure', async () => {
    // Arrange
    const fetchImpl = async () => response({
        ok: true,
        status: 200,
        data: {ok: false, error: 'Rejected'},
    });

    // Act
    const error = await request(fetchImpl).catch((caught) => caught);

    // Assert
    assert.equal(error.failureType, 'application');
    assert.equal(error.responseStatus, 200);
});

test('transport rejection is a network failure', async () => {
    // Arrange
    const fetchImpl = async () => {
        throw new TypeError('offline');
    };

    // Act
    const error = await request(fetchImpl).catch((caught) => caught);

    // Assert
    assert.equal(error.failureType, 'network');
    assert.equal(error.responseStatus, null);
});
