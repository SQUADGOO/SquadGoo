# Stripe wallet top-up + match-fee escrow — design

**Date:** 2026-06-08
**Status:** Approved (design) — awaiting client input on currency unit before implementation finalises
**Phase:** 3 (payments / wallet), Sub-project 1 of 2
**Owner:** mobile + mobile-app backend API (us); reuses admin-team finance models

## Summary

Integrate Stripe **directly in the React Native app** (`@stripe/stripe-react-native`,
PaymentSheet) so recruiters can top up their wallet, and wire the match-fee **escrow**
(hold → deduct → release) into the existing manual job/offer flow. Backend support is
built under `/api/mobile-app`. Web/admin Stripe work (if any) does not cover the mobile
app, which is where recruiters act, so the SDK lives in the app.

This is **Sub-project 1**: recruiter top-up + match-fee escrow only (Stripe Payments +
webhooks, **no Connect**). **Sub-project 2** (jobseeker wage payouts via Stripe Connect)
is a separate spec, built afterwards.

## Background — what already exists

Admin-team built finance primitives we **reuse** (so balances reconcile across
web/mobile/admin) and must **not** modify:

- `models/WalletTransaction.js` — types `deposit | withdrawal | match_fee | refund |
  chargeback | payout | adjustment | credit | debit`; balance is **derived** by summing
  completed transactions (no stored balance field); has `txId`, `appUserId`, `amount`,
  `currency` (AUD), `status` (pending/completed/failed/reversed), `relatedOfferId`, `meta`.
- `models/EscrowLedger.js` — `offerId`, `heldAmount`, `releasedAmount`, `status`
  (`holding | released | refunded`), `meta`. Built but **not yet wired** to the mobile
  offer flow.
- `AppUser` already has `stripeCustomerId` (empty default), `walletHolds`, `walletFrozen`,
  `walletBankAccounts`.
- `services/appUserWalletService.js` — admin-side wallet ops (do **not** modify).

Phase-3 integration points already marked in `routes/mobileJobs.js`:
- Offer **send** (`POST /offers`) computes `matchFeeSc` via `effectiveRatesService`
  (`resolveMatchFeeSc`) — currently **calculation only**, stored in `offer.meta`.
- **Accept** has the comment: `// NOTE (Phase 3): real escrow hold + match-fee
  WalletTransaction would be created here`.
- Mobile top-up/withdraw screens are `501` stubs.

No Stripe SDK is currently a dependency anywhere.

## Locked decisions

1. **Scope (this sub-project):** recruiter wallet top-up + match-fee escrow. No jobseeker
   payouts / Connect (that is Sub-project 2).
2. **Money rule:** **HOLD** the pre-calculated match fee on offer **send** (with a
   balance gate) → **DEDUCT** on jobseeker **accept** → **RELEASE** on
   decline/expire/withdraw.
3. **Hold granularity:** **per offer sent.** Each send checks `available ≥ 1 fee` and
   places one hold. Active holds = number of pending offers. No upfront N-staff reservation.
4. **Ownership:** we build it, mobile-first. Stripe SDK in the RN app; supporting endpoints
   under `/api/mobile-app`. Reuse admin `WalletTransaction`/`EscrowLedger` models; do not
   modify the admin wallet service.
5. **Top-up UI:** Stripe **PaymentSheet** (`@stripe/stripe-react-native`) — cards +
   Apple/Google Pay + 3DS handled by Stripe; lowest PCI scope; least code.
6. **Mobile Stripe structure:** **hook-first.** One `StripeProvider` at app root; reusable
   `usePaymentSheet()` / `useWalletTopup()` hooks; optional thin `<TopUpButton>` wrapper.
   Future Stripe features (Connect, saved cards) become sibling hooks.

## Money model (currency-agnostic)

Amounts are integers in a single "unit." Whether a unit is an **AUD cent** or an **SG coin**
(bought at a configured rate) is **awaiting client** and only affects display/conversion math
— the architecture is identical either way.

Balance is **derived** (admin pattern):

- **Total balance** = Σ completed credit txs − Σ completed debit txs.
- **Available balance** = Total balance − Σ active holds (`EscrowLedger` rows with
  `status: holding` belonging to this recruiter).

> Computing a recruiter's held total: query `EscrowLedger` (status `holding`) for the
> recruiter's offers. To make this a direct query, store `recruiterId` in `EscrowLedger.meta`
> (or add an indexed field) when creating the hold.

Lifecycle:

| Event | EscrowLedger | WalletTransaction | Effect on balances |
|---|---|---|---|
| **Top-up succeeds** (Stripe webhook) | — | create `deposit`, completed, `meta.paymentIntentId` | total ↑, available ↑ |
| **Offer sent** | create `{offerId, heldAmount=fee, status: holding}` | — | available ↓ (reserved, not spent) |
| **Jobseeker accepts** | set `status: released`, `releasedAmount=heldAmount` | create `match_fee`, completed, `relatedOfferId` | total ↓ (charged); available unchanged |
| **Decline / expire / withdraw** | set `status: refunded` | — | available ↑ (reservation returned) |

**Correctness property:** at accept, the reserved amount converts from held to spent, so
available is unchanged (it was set aside at send). At release, no money moved — the hold
simply disappears.

**Insufficient funds:** the send handler checks `available ≥ fee` **server-side**; if not,
it returns `INSUFFICIENT_FUNDS` and the app prompts a top-up. Never trust the client.

## Top-up flow (PaymentSheet; webhook is authoritative)

1. Recruiter picks an amount → app calls `POST /wallet/topup/intent`.
2. Backend ensures a Stripe **Customer** exists (creates + saves `AppUser.stripeCustomerId`
   if missing), creates a **PaymentIntent** (amount, AUD) + ephemeral key, returns
   `{ paymentIntentClientSecret, ephemeralKey, customerId, publishableKey }`.
3. App: `initPaymentSheet` then `presentPaymentSheet`. Stripe handles card / Apple Pay /
   Google Pay / 3DS.
4. Stripe → `POST /wallet/stripe/webhook`. Backend verifies the signature, dedupes on event
   id, and on `payment_intent.succeeded` creates the `deposit` `WalletTransaction`
   (completed). **Credit happens on the webhook, not on the client result.**
5. App refetches `GET /wallet` (React Query invalidation) and shows the new balance.

**Idempotency:** unique `paymentIntentId` on the `deposit` tx + event-id dedupe → no
double-credit on webhook replay. `payment_intent.payment_failed` → no credit (optionally
record a failed tx).

## API surface (new, under `/api/mobile-app`)

- `GET /wallet` — total + available balance, active holds, recent transactions.
- `POST /wallet/topup/intent` — body `{ amount }` → PaymentSheet params (see above).
- `POST /wallet/stripe/webhook` — Stripe events; mounted with `express.raw` **before** the
  JSON body parser for this path (signature needs the raw body).
- Escrow is **not** new endpoints — it is wired into the existing `POST /offers`, accept, and
  decline/withdraw handlers in `routes/mobileJobs.js`.
- **Withdrawal is out of scope** for this sub-project (pending client decision).

New backend module: `routes/mobileWallet.js` + a thin `services/mobileWalletService.js`
(intent creation, webhook handling, balance read, escrow helpers `hold/deduct/release`).
Add the `stripe` npm package.

## Mobile structure & screens

- `StripeProvider` at the app root (publishable key from backend/config, not hardcoded).
- `src/api/wallet/wallet.api.js` + `wallet.query.js` (two-layer convention):
  `useWallet()`, `useTopupIntent()`.
- `src/hooks/usePaymentSheet.js` (generic) → `useWalletTopup()` (wraps intent +
  init/present + result handling + cache invalidation + toast).
- **Top-up screen** (currently `501` stub) → real flow via `useWalletTopup()`.
- **Balance display** → `useWallet()` (available vs total + holds).
- **Offer-send** (`SendManualOfferModal` / send path): on `INSUFFICIENT_FUNDS`, show a
  "top up to continue" prompt routing to the top-up screen.
- Frozen-UI rules apply: wire, don't redesign. Map backend↔screen naming in `wallet.api.js`.

New dependencies: `@stripe/stripe-react-native` (mobile), `stripe` (backend) — both required.

## Error handling

- PaymentSheet result is 3-way: **success** (refresh), **canceled** (silent no-op, via
  Stripe `error.code === 'Canceled'`), **failed** (toast).
- Credit only via webhook; if it lags the client result, show "processing" and let the
  balance land on the next refetch (invalidate + brief poll).
- `INSUFFICIENT_FUNDS` on send → top-up prompt. `walletFrozen` → block top-up + send with a
  clear message. Network/axios errors normalized in the api layer → toast (per
  `mobile/CLAUDE.md`). Mutations surface `onError`; screens `try/catch` around `mutateAsync`.

## Security & idempotency

- Webhook signature verification (`STRIPE_WEBHOOK_SECRET`); event-id dedupe; unique
  `paymentIntentId` on `deposit`; idempotency key on PaymentIntent creation.
- All gate/balance checks server-side; amounts validated as positive integers within
  min/max; mobile only sees the **publishable** key, never the secret.
- Escrow guarded against double-hold (one ledger row per offer), double-deduct
  (`holding → released` once), double-release.

## Config / secrets

- Backend env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`,
  currency. **Test-mode keys first.** Webhook registered in the Stripe dashboard; Stripe CLI
  `stripe listen` for local.
- Mobile fetches the publishable key from the backend.

## Testing

- Backend `node --test`: escrow math (hold/deduct/release + available-balance), webhook
  handler (signed test events + idempotency replay), intent creation (Stripe mocked). Stripe
  test mode + test cards.
- Mobile (no test harness in repo): lint + manual on simulator with Stripe test cards.
- E2e smoke: top up → balance ↑ → send offers (holds) → accept (deduct) → decline (release)
  → assert available/total math.

## Open items (awaiting client)

- **Currency unit + rate:** real AUD vs SG coins, and the conversion rate. (Asked
  2026-06-08.) Architecture-agnostic; affects display/conversion only.
- **Minimum top-up** amount.
- **Withdrawal** of unused balance — in or out of scope.

## Out of scope (this sub-project)

- Jobseeker wage payouts / Stripe **Connect** → Sub-project 2 (separate spec).
- Withdrawal of wallet balance (pending client).
- Apple Pay / Google Pay merchant configuration (available via PaymentSheet; a follow-up
  toggle once Apple merchant id / Google Pay are set up).
- Modifying the admin wallet service or admin-panel finance UI.
