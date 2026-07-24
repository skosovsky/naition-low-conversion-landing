import * as amplitude from '@amplitude/analytics-browser';
import analyticsContract from '../contracts/analytics-events.json';
import {createAnalyticsDispatcher} from './analytics.js';
import {
    RegistrationRequestError,
    submitRegistrationRequest,
} from './registration.js';

const AMPLITUDE_INITIALIZED_KEY = '__naitionAmplitudeInitialized';
const SITE_VERSION = document
    .querySelector('meta[name="naition-site-version"]')
    ?.getAttribute('content') || 'unknown';

function initializeAmplitude() {
    if (typeof window === 'undefined' || window[AMPLITUDE_INITIALIZED_KEY]) {
        return;
    }

    window[AMPLITUDE_INITIALIZED_KEY] = true;
    amplitude.init('663d1cc85176e9b1f2c6e4204bcb23d5', {
        autocapture: false,
        fetchRemoteConfig: false,
        trackingOptions: {
            ipAddress: false,
        },
    });
}

initializeAmplitude();

document.addEventListener('DOMContentLoaded', () => {
    const registrationSection = document.getElementById('registration');
    const form = document.getElementById('registration-form');
    const message = document.getElementById('form-message');
    const selectionMessage = document.getElementById('registration-selection');
    const registerButtons = document.querySelectorAll('.btn-register');
    const trackEvent = createAnalyticsDispatcher({
        contract: analyticsContract,
        siteVersion: SITE_VERSION,
        amplitudeClient: amplitude,
        windowObject: window,
    });
    let selectedPlan = 'not_selected';
    let formOpenedTracked = false;

    trackEvent('landing_viewed');

    registerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const pricingCard = button.closest('.pricing-card');
            const planName = pricingCard?.querySelector('h3')?.textContent?.trim() || 'Unknown';
            const planPrice = button.dataset.price || 'стоимость уточняется';
            selectedPlan = button.dataset.planId || 'unknown';

            trackEvent('pricing_plan_selected', {
                selected_plan: selectedPlan,
            });

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
                selectionMessage.textContent = `${planName} · ${planPrice} · 15 августа. Оставьте контакты: на этом шаге оплаты нет, мы сначала подтвердим место и детали участия.`;
                selectionMessage.classList.add('has-selection');
            }

            registrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (!form) {
        return;
    }

    form.addEventListener('focusin', () => {
        if (formOpenedTracked) {
            return;
        }

        formOpenedTracked = true;
        trackEvent('registration_form_opened', {
            form_surface: 'registration',
            selected_plan: selectedPlan,
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);

        trackEvent('registration_attempted', {
            form_surface: 'registration',
            selected_plan: selectedPlan,
        });

        if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = true;
        }

        if (message) {
            message.textContent = '';
            message.className = 'form-message ym-hide-content';
        }

        try {
            const {responseStatus} = await submitRegistrationRequest({
                action: form.action,
                formData,
                fetchImpl: fetch,
            });

            if (message) {
                message.textContent = 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
                message.className = 'form-message ym-hide-content success';
            }

            trackEvent('registration_completed', {
                form_surface: 'registration',
                selected_plan: selectedPlan,
                response_status: responseStatus,
            });
            form.reset();
        } catch (error) {
            const failureType = error instanceof RegistrationRequestError
                ? error.failureType
                : 'unknown';
            const responseStatus = error instanceof RegistrationRequestError
                ? error.responseStatus
                : null;

            trackEvent('registration_failed', {
                form_surface: 'registration',
                selected_plan: selectedPlan,
                failure_type: failureType,
                response_status: responseStatus,
            });

            if (message) {
                message.textContent = error instanceof Error ? error.message : 'Не удалось отправить заявку.';
                message.className = 'form-message ym-hide-content error';
            }
        } finally {
            if (submitButton instanceof HTMLButtonElement) {
                submitButton.disabled = false;
            }
        }
    });
});
