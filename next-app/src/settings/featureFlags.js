/**
 * Feature flags for Infinitum Website
 * 
 * These flags are controlled via environment variables.
 * To enable pre-registration mode, set in .env:
 *   NEXT_PUBLIC_PRE_REGISTRATION_ENABLED=true
 */

// Pre-registration mode toggle
// When true: Disables login, register, and event registration
// Shows pre-registration form instead
export const isPreRegistrationEnabled =
    process.env.NEXT_PUBLIC_PRE_REGISTRATION_ENABLED === 'true';

// Accommodation mode toggle
// When true: Shows "Accommodation Full" message
// When false: Shows Accommodation Registration Form
export const IS_ACCOMMODATION_CLOSED = true;

// Pre-registration UI messaging
export const preRegistrationConfig = {
    message: "Registrations opening soon! Pre-register now to get notified.",
    buttonText: "Pre-Register",
    successMessage: "You're on the list! We'll notify you when registrations open.",
};
