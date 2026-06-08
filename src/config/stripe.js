// Stripe publishable key (NON-secret — safe to ship in the app).
// Now sourced from the central config (.env STRIPE_PUBLISHABLE_KEY, with fallback).
// Kept as a thin re-export so existing `@/config/stripe` imports keep working.
export {STRIPE_PK as STRIPE_PUBLISHABLE_KEY} from './appConfig';
