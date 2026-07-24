export class RegistrationRequestError extends Error {
    constructor(message, failureType, responseStatus = null) {
        super(message);
        this.name = 'RegistrationRequestError';
        this.failureType = failureType;
        this.responseStatus = responseStatus;
    }
}

async function readJson(response, failureType) {
    try {
        return await response.json();
    } catch {
        throw new RegistrationRequestError(
            'Сервер вернул некорректный ответ.',
            failureType,
            response.status,
        );
    }
}

export async function submitRegistrationRequest({
    action,
    formData,
    fetchImpl,
}) {
    let response;
    try {
        response = await fetchImpl(action, {
            method: 'POST',
            body: formData,
        });
    } catch {
        throw new RegistrationRequestError(
            'Не удалось отправить заявку.',
            'network',
        );
    }

    if (!response.ok) {
        let message = 'Не удалось отправить заявку.';

        try {
            const data = await response.json();
            if (typeof data?.error === 'string' && data.error.length > 0) {
                message = data.error;
            }
        } catch {
            // The HTTP status remains the primary classification.
        }

        throw new RegistrationRequestError(
            message,
            'http',
            response.status,
        );
    }

    const data = await readJson(response, 'invalid_json');
    if (!data?.ok) {
        throw new RegistrationRequestError(
            typeof data?.error === 'string' && data.error.length > 0
                ? data.error
                : 'Не удалось отправить заявку.',
            'application',
            response.status,
        );
    }

    return {
        responseStatus: response.status,
    };
}
