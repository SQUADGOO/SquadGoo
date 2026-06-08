// Stripe publishable key (NON-secret — safe to ship in the app).
// Set this to your Stripe TEST publishable key (pk_test_...) to enable in-app top-up.
// Mirror of how src/api/apiClient.js holds a hand-set LOCAL_HOST.
// The backend also returns this from GET /wallet, but StripeProvider needs it at mount.
export const STRIPE_PUBLISHABLE_KEY = '';
