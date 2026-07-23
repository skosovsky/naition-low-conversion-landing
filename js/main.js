import * as amplitude from '@amplitude/unified';

const AMPLITUDE_INITIALIZED_KEY = '__naitionAmplitudeInitialized';

function initializeAmplitude() {
    if (typeof window === 'undefined' || window[AMPLITUDE_INITIALIZED_KEY]) {
        return;
    }

    window[AMPLITUDE_INITIALIZED_KEY] = true;
    amplitude.initAll('663d1cc85176e9b1f2c6e4204bcb23d5', {
        analytics: { autocapture: true },
        sessionReplay: { sampleRate: 1 },
    });
}

function trackEvent(eventName, eventProperties) {
    if (typeof window === 'undefined' || !window[AMPLITUDE_INITIALIZED_KEY]) {
        return;
    }

    amplitude.track(eventName, eventProperties);
}

initializeAmplitude();

document.addEventListener('DOMContentLoaded', () => {
    const registrationSection = document.getElementById('registration');
    const form = document.getElementById('registration-form');
    const message = document.getElementById('form-message');
    const selectionMessage = document.getElementById('registration-selection');
    const registerButtons = document.querySelectorAll('.btn-register');

    registerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const pricingCard = button.closest('.pricing-card');
            const planName = pricingCard?.querySelector('h3')?.textContent?.trim() || 'Unknown';

            trackEvent('Pricing Plan Selected', { plan: planName });

            if (!registrationSection) {
                return;
            }

            registerButtons.forEach((registerButton) => {
                registerButton.setAttribute('aria-pressed', 'false');
                registerButton.closest('.pricing-card')?.classList.remove('is-selected');
            });
            button.setAttribute('aria-pressed', 'true');
            pricingCard?.classList.add('is-selected');

            if (selectionMessage && planName !== 'Unknown') {
                selectionMessage.textContent = `Вы выбрали тариф «${planName}». Оставьте контакты — подтвердим место и детали участия.`;
                selectionMessage.classList.add('has-selection');
            }

            registrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (!form) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        let responseStatus = null;

        trackEvent('Registration Form Submitted');

        if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = true;
        }

        if (message) {
            message.textContent = '';
            message.className = 'form-message';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
            });
            responseStatus = response.status;

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Не удалось отправить заявку.');
            }

            if (message) {
                message.textContent = 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
                message.className = 'form-message success';
            }

            trackEvent('Registration Completed');
            form.reset();
        } catch (error) {
            trackEvent('Registration Failed', {
                failure_type: responseStatus === null ? 'network' : 'server',
                response_status: responseStatus,
            });

            if (message) {
                message.textContent = error instanceof Error ? error.message : 'Не удалось отправить заявку.';
                message.className = 'form-message error';
            }
        } finally {
            if (submitButton instanceof HTMLButtonElement) {
                submitButton.disabled = false;
            }
        }
    });
});
