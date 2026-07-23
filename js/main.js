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
    const form = document.getElementById('registration-form');
    const message = document.getElementById('form-message');
    const registerButtons = document.querySelectorAll('.btn-register');
    const registrationPanel = document.querySelector('.registration-panel');
    const registrationTitle = document.getElementById('registration-title');
    const selectedPlanSummary = document.getElementById('selected-plan-summary');
    const pricingCards = document.querySelectorAll('.pricing-card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let formStarted = false;
    let highlightTimer;

    registerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const pricingCard = button.closest('.pricing-card');
            const planName = button.dataset.plan
                || pricingCard?.querySelector('h3')?.textContent?.trim()
                || 'Unknown';
            const planPrice = button.dataset.price || '';

            trackEvent('Pricing Plan Selected', { plan: planName });

            pricingCards.forEach((card) => {
                card.classList.toggle('is-selected', card === pricingCard);
            });

            if (selectedPlanSummary) {
                selectedPlanSummary.textContent = `Вы выбрали: ${planName}${planPrice ? ` · ${planPrice}` : ''}`;
                selectedPlanSummary.hidden = false;
            }

            trackEvent('Registration Form Viewed After Plan', { plan: planName });

            if (!(registrationPanel instanceof HTMLElement)) {
                return;
            }

            registrationPanel.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start',
            });
            registrationPanel.classList.add('is-highlighted');
            window.clearTimeout(highlightTimer);
            highlightTimer = window.setTimeout(() => {
                registrationPanel.classList.remove('is-highlighted');
            }, reduceMotion ? 0 : 1200);

            window.requestAnimationFrame(() => {
                registrationTitle?.focus({ preventScroll: true });
            });
        });
    });

    if (!form) {
        return;
    }

    const trackFormStart = (event) => {
        if (formStarted || !event.isTrusted) {
            return;
        }

        formStarted = true;
        trackEvent('Registration Form Started');
    };

    form.addEventListener('input', trackFormStart);
    form.addEventListener('change', trackFormStart);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        let responseStatus = null;
        const submitButtonText = submitButton?.textContent || 'Отправить заявку';

        trackEvent('Registration Form Submitted');
        form.setAttribute('aria-busy', 'true');

        if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправляем…';
        }

        if (message) {
            message.textContent = '';
            message.className = 'form-message';
            message.removeAttribute('role');
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
                message.setAttribute('role', 'status');
            }

            trackEvent('Registration Completed');
            form.reset();
            formStarted = false;
            pricingCards.forEach((card) => card.classList.remove('is-selected'));
            if (selectedPlanSummary) {
                selectedPlanSummary.hidden = true;
                selectedPlanSummary.textContent = '';
            }
        } catch (error) {
            trackEvent('Registration Failed', {
                failure_type: responseStatus === null ? 'network' : 'server',
                response_status: responseStatus,
            });

            if (message) {
                message.textContent = error instanceof Error ? error.message : 'Не удалось отправить заявку.';
                message.className = 'form-message error';
                message.setAttribute('role', 'alert');
            }
        } finally {
            form.removeAttribute('aria-busy');
            if (submitButton instanceof HTMLButtonElement) {
                submitButton.disabled = false;
                submitButton.textContent = submitButtonText;
            }
        }
    });
});
