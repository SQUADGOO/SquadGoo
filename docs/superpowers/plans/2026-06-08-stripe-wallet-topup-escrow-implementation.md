# Stripe Wallet Top-up + Match-fee Escrow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let recruiters top up their wallet (coins) via the Stripe SDK in-app, and enforce match-fee escrow (hold on offer-send → deduct on accept → release on decline/expire/withdraw) on the manual job/offer flow.

**Architecture:** Mobile uses `@stripe/stripe-react-native` PaymentSheet behind reusable hooks. The backend adds a `mobileWallet` router + `mobileWalletService` under `/api/mobile-app`, reusing the admin team's `WalletTransaction` + `EscrowLedger` models (balance is derived from completed transactions; holds are EscrowLedger rows). Stripe credits the wallet only via a signed webhook. Escrow is wired into the existing `routes/mobileJobs.js` handlers.

**Tech Stack:** Node/Express/Mongoose + `stripe`; React Native + `@stripe/stripe-react-native` + TanStack Query + Redux.

**Spec:** `mobile/docs/superpowers/specs/2026-06-08-stripe-wallet-topup-escrow-design.md`

---

## Conventions for this plan (READ FIRST)

- **Wallet unit = "coins"** (matches the frozen UI). Amounts are integers. `COINS_PER_AUD` is a single config constant (value pending client; default `10` — i.e. A$1 = 10 coins — until confirmed). The match fee is already computed in the wallet unit (`matchFeeSc`).
- **Commit workflow (user preference):** do **NOT** commit. Each task ends by **staging** changes (`git add`) so the user can review the diff. The user tests, then commits to a NEW branch. "Step: Stage" replaces the usual "Step: Commit".
- **Two backend repos/branches:** backend = `squadgoo-admin-panel-backend` (branch `feature/job-offers-manual-loop`); mobile = `mobile` (branch `feature/job-offers-manual-loop`).
- **Reuse, don't modify, admin code:** use `WalletTransaction`/`EscrowLedger` models; do NOT edit `services/appUserWalletService.js`.
- **Prerequisites for live runs (not for coding/unit tests):** backend `.env` needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY` (test mode). Mobile fetches the publishable key from the backend.
- **PayID deposit + WithdrawCoins screens are OUT OF SCOPE** (PayID is not a Stripe rail; withdrawal pending client). Leave them as-is.

---

## File Structure

**Backend (`squadgoo-admin-panel-backend`):**
- Create `config/stripeConfig.js` — reads env, exposes `getStripe()`, keys, `currency`, `COINS_PER_AUD`.
- Create `services/mobileWalletService.js` — `getWalletSnapshot`, `availableBalance`, `holdForOffer`, `deductForOffer`, `releaseForOffer`, `createTopupIntent`, `handleStripeEvent`.
- Create `services/mobileWalletService.test.js` — unit tests (Stripe mocked).
- Create `routes/mobileWallet.js` — `GET /wallet`, `POST /wallet/topup/intent`, `POST /wallet/stripe/webhook`.
- Modify `routes/mobileApp.js` — mount `mobileWallet`; ensure webhook raw body.
- Modify `routes/mobileJobs.js` — gate+hold on send; deduct on accept; release on decline/withdraw/expire.
- Modify `package.json` — add `stripe`.

**Mobile (`mobile`):**
- Modify `package.json` — add `@stripe/stripe-react-native`.
- Modify `App.tsx` — wrap with `StripeProvider`.
- Create `src/api/wallet/wallet.api.js` + `src/api/wallet/wallet.query.js`.
- Create `src/hooks/usePaymentSheet.js` (with `useWalletTopup`).
- Modify `src/screens/main/wallet/PurchaseCoins.jsx` — wire to `useWalletTopup`.
- Modify `src/screens/main/Recruiter/Wallet.jsx` + `src/components/wallet/WalletBalanceComponent.jsx` — show server balance via `useWallet`.
- Modify `src/screens/main/wallet/EscrowHolds.jsx` — show holds from `useWallet`.
- Modify `src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx` — handle `INSUFFICIENT_FUNDS`.

---

# PHASE 1 — BACKEND (wallet + escrow + Stripe)

### Task 1: Stripe config module + dependency

**Files:**
- Create: `squadgoo-admin-panel-backend/config/stripeConfig.js`
- Modify: `squadgoo-admin-panel-backend/package.json` (add `stripe`)

- [ ] **Step 1: Add the dependency**

Run: `cd squadgoo-admin-panel-backend && yarn add stripe` (or `npm i stripe` if the repo uses npm — check which lockfile is tracked).
Expected: `stripe` appears in `dependencies`.

- [ ] **Step 2: Create the config module**

```js
// config/stripeConfig.js
const Stripe = require("stripe");

const COINS_PER_AUD = Number(process.env.COINS_PER_AUD || 10); // pending client confirmation
const currency = String(process.env.WALLET_CURRENCY || "aud").toLowerCase();

let _stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  if (!_stripe) _stripe = Stripe(key);
  return _stripe;
}

// coins -> smallest AUD unit (cents) for charging Stripe
function coinsToAudCents(coins) {
  return Math.round((Number(coins) / COINS_PER_AUD) * 100);
}
// AUD cents actually paid -> coins credited
function audCentsToCoins(cents) {
  return Math.round((Number(cents) / 100) * COINS_PER_AUD);
}

module.exports = {
  getStripe,
  currency,
  COINS_PER_AUD,
  coinsToAudCents,
  audCentsToCoins,
  publishableKey: () => process.env.STRIPE_PUBLISHABLE_KEY || "",
  webhookSecret: () => process.env.STRIPE_WEBHOOK_SECRET || "",
};
```

- [ ] **Step 3: Verify it loads**

Run: `cd squadgoo-admin-panel-backend && node -e "const c=require('./config/stripeConfig'); console.log(c.COINS_PER_AUD, c.coinsToAudCents(50), c.audCentsToCoins(500))"`
Expected: `10 500 50` (50 coins = 500 AUD cents = A$5.00; A$5.00 → 50 coins).

- [ ] **Step 4: Stage**

```bash
git add config/stripeConfig.js package.json yarn.lock
```

---

### Task 2: Balance + snapshot in mobileWalletService (TDD)

Balance is derived: total = Σ completed credits − Σ completed debits; available = total − Σ active holds. Reuse `computeBalanceFromTxs` from the admin service for the tx sum, and sum `EscrowLedger` (status `holding`) for this recruiter's offers.

**Files:**
- Create: `squadgoo-admin-panel-backend/services/mobileWalletService.js`
- Test: `squadgoo-admin-panel-backend/services/mobileWalletService.test.js`

- [ ] **Step 1: Write the failing test**

```js
// services/mobileWalletService.test.js
const { test } = require("node:test");
const assert = require("node:assert");
const { computeAvailable } = require("./mobileWalletService");

test("available = total completed credits - debits - active holds", () => {
  const txs = [
    { type: "deposit", amount: 100, status: "completed" },
    { type: "match_fee", amount: 20, status: "completed" },
    { type: "deposit", amount: 50, status: "pending" }, // ignored (not completed)
  ];
  const holds = [{ heldAmount: 30, status: "holding" }, { heldAmount: 10, status: "released" }];
  // total = 100 - 20 = 80 ; active holds = 30 ; available = 50
  assert.strictEqual(computeAvailable(txs, holds), 50);
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `cd squadgoo-admin-panel-backend && node --test services/mobileWalletService.test.js`
Expected: FAIL (`computeAvailable` is not a function / module not found).

- [ ] **Step 3: Implement minimal `computeAvailable` + snapshot**

```js
// services/mobileWalletService.js
const WalletTransaction = require("../models/WalletTransaction");
const EscrowLedger = require("../models/EscrowLedger");
const Offer = require("../models/Offer");
const { computeBalanceFromTxs } = require("./appUserWalletService");

function computeAvailable(txs, holds) {
  const total = computeBalanceFromTxs(txs);
  const held = (holds || [])
    .filter((h) => String(h.status) === "holding")
    .reduce((s, h) => s + (Number(h.heldAmount) || 0), 0);
  return total - held;
}

// active holds for a recruiter = EscrowLedger(holding) on that recruiter's offers
async function activeHoldsForRecruiter(recruiterId) {
  const offerIds = await Offer.find({ createdByRecruiterId: recruiterId }).distinct("_id");
  if (!offerIds.length) return [];
  return EscrowLedger.find({ offerId: { $in: offerIds }, status: "holding" }).lean();
}

async function getWalletSnapshot(appUserId) {
  const txs = await WalletTransaction.find({ appUserId }).sort({ createdAt: -1 }).lean();
  const holds = await activeHoldsForRecruiter(appUserId);
  const total = computeBalanceFromTxs(txs);
  const held = holds.reduce((s, h) => s + (Number(h.heldAmount) || 0), 0);
  return {
    totalCoins: total,
    availableCoins: total - held,
    heldCoins: held,
    holds: holds.map((h) => ({ offerId: String(h.offerId), amount: h.heldAmount })),
    transactions: txs.slice(0, 40).map((t) => ({
      id: t.txId || String(t._id), type: t.type, amount: t.amount,
      status: t.status, at: t.createdAt, relatedOfferId: t.relatedOfferId ? String(t.relatedOfferId) : null,
    })),
  };
}

module.exports = { computeAvailable, activeHoldsForRecruiter, getWalletSnapshot };
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `cd squadgoo-admin-panel-backend && node --test services/mobileWalletService.test.js`
Expected: PASS.

- [ ] **Step 5: Stage**

```bash
git add services/mobileWalletService.js services/mobileWalletService.test.js
```

---

### Task 3: Escrow hold / deduct / release (TDD)

Pure decision helpers tested in isolation, plus DB-applying wrappers.

**Files:**
- Modify: `squadgoo-admin-panel-backend/services/mobileWalletService.js`
- Test: `squadgoo-admin-panel-backend/services/mobileWalletService.test.js`

- [ ] **Step 1: Add failing tests for the gate decision**

```js
const { canHold } = require("./mobileWalletService");

test("canHold true only when available >= fee and fee > 0", () => {
  assert.strictEqual(canHold(100, 20), true);
  assert.strictEqual(canHold(20, 20), true);
  assert.strictEqual(canHold(19, 20), false);
  assert.strictEqual(canHold(100, 0), false);
});
```

- [ ] **Step 2: Run, verify fail**

Run: `node --test services/mobileWalletService.test.js`
Expected: FAIL (`canHold` undefined).

- [ ] **Step 3: Implement `canHold` + DB wrappers**

```js
// add to services/mobileWalletService.js
const crypto = require("crypto");
function newTxId() { return `TX-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`; }

function canHold(available, fee) {
  return Number(fee) > 0 && Number(available) >= Number(fee);
}

// Create a hold for an offer (idempotent: one holding ledger per offer)
async function holdForOffer({ offerId, recruiterId, feeCoins }) {
  const existing = await EscrowLedger.findOne({ offerId, status: "holding" });
  if (existing) return existing;
  return EscrowLedger.create({
    offerId, heldAmount: feeCoins, status: "holding",
    meta: { recruiterId: String(recruiterId), kind: "match_fee" },
  });
}

// Deduct on accept: mark ledger released + create a completed match_fee debit (idempotent on offer)
async function deductForOffer({ offerId, recruiterId, feeCoins }) {
  const ledger = await EscrowLedger.findOne({ offerId, status: "holding" });
  if (!ledger) return null; // nothing held (already deducted/released)
  const already = await WalletTransaction.findOne({ relatedOfferId: offerId, type: "match_fee" });
  if (!already) {
    await WalletTransaction.create({
      txId: newTxId(), appUserId: recruiterId, type: "match_fee",
      amount: feeCoins, status: "completed", relatedOfferId: offerId,
      meta: { source: "escrow_deduct" },
    });
  }
  ledger.status = "released";
  ledger.releasedAmount = ledger.heldAmount;
  await ledger.save();
  return ledger;
}

// Release on decline/expire/withdraw: mark ledger refunded, no money moved (idempotent)
async function releaseForOffer({ offerId }) {
  const ledger = await EscrowLedger.findOne({ offerId, status: "holding" });
  if (!ledger) return null;
  ledger.status = "refunded";
  await ledger.save();
  return ledger;
}

module.exports = {
  computeAvailable, activeHoldsForRecruiter, getWalletSnapshot,
  canHold, holdForOffer, deductForOffer, releaseForOffer, newTxId,
};
```

- [ ] **Step 4: Run, verify pass**

Run: `node --test services/mobileWalletService.test.js`
Expected: PASS (all tests).

- [ ] **Step 5: Stage**

```bash
git add services/mobileWalletService.js services/mobileWalletService.test.js
```

---

### Task 4: Stripe top-up intent + webhook handler (TDD, Stripe mocked)

**Files:**
- Modify: `squadgoo-admin-panel-backend/services/mobileWalletService.js`
- Test: `squadgoo-admin-panel-backend/services/mobileWalletService.test.js`

- [ ] **Step 1: Add failing test for webhook idempotency credit**

```js
const wallet = require("./mobileWalletService");

test("creditFromPaymentIntent credits coins once (idempotent on paymentIntentId)", async () => {
  const created = [];
  const fakeTxModel = {
    findOne: async ({ "meta.paymentIntentId": pi }) => created.find((t) => t.meta.paymentIntentId === pi) || null,
    create: async (doc) => { created.push(doc); return doc; },
  };
  const pi = { id: "pi_1", amount: 500, metadata: { appUserId: "u1" }, status: "succeeded" };
  const opts = { TxModel: fakeTxModel, audCentsToCoins: (c) => c / 10 };
  const a = await wallet.creditFromPaymentIntent(pi, opts);
  const b = await wallet.creditFromPaymentIntent(pi, opts); // replay
  assert.strictEqual(created.length, 1);          // only one credit
  assert.strictEqual(created[0].amount, 50);      // 500 cents -> 50 coins
  assert.strictEqual(a.credited, true);
  assert.strictEqual(b.credited, false);          // replay no-op
});
```

- [ ] **Step 2: Run, verify fail**

Run: `node --test services/mobileWalletService.test.js`
Expected: FAIL (`creditFromPaymentIntent` undefined).

- [ ] **Step 3: Implement intent creation, credit, and event dispatch**

```js
// add to services/mobileWalletService.js
const AppUser = require("../models/AppUser");
const { getStripe, coinsToAudCents, audCentsToCoins, currency } = require("../config/stripeConfig");

async function ensureStripeCustomer(appUser) {
  if (appUser.stripeCustomerId) return appUser.stripeCustomerId;
  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: appUser.email, name: [appUser.firstName, appUser.lastName].filter(Boolean).join(" "),
    metadata: { appUserId: String(appUser._id) },
  });
  appUser.stripeCustomerId = customer.id;
  await appUser.save();
  return customer.id;
}

// Recruiter buys `coins`; we charge the AUD equivalent.
async function createTopupIntent({ appUserId, coins }) {
  const n = Math.floor(Number(coins));
  if (!Number.isFinite(n) || n <= 0) { const e = new Error("coins must be a positive integer"); e.status = 400; e.code = "VALIDATION"; throw e; }
  const appUser = await AppUser.findById(appUserId);
  if (!appUser) { const e = new Error("User not found"); e.status = 404; e.code = "NOT_FOUND"; throw e; }
  const stripe = getStripe();
  const customerId = await ensureStripeCustomer(appUser);
  const amountCents = coinsToAudCents(n);
  const ephemeralKey = await stripe.ephemeralKeys.create({ customer: customerId }, { apiVersion: "2024-06-20" });
  const intent = await stripe.paymentIntents.create({
    amount: amountCents, currency, customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata: { appUserId: String(appUserId), coins: String(n) },
  }, { idempotencyKey: `topup_${appUserId}_${n}_${intent_seed()}` });
  return {
    paymentIntentClientSecret: intent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customerId,
    coins: n,
    amountCents,
  };
}
function intent_seed() { return `${Date.now()}_${crypto.randomBytes(3).toString("hex")}`; }

// Credit wallet from a succeeded PaymentIntent (idempotent). opts injectable for tests.
async function creditFromPaymentIntent(pi, opts = {}) {
  const TxModel = opts.TxModel || WalletTransaction;
  const toCoins = opts.audCentsToCoins || audCentsToCoins;
  const exists = await TxModel.findOne({ "meta.paymentIntentId": pi.id });
  if (exists) return { credited: false };
  const coins = pi.metadata && pi.metadata.coins ? Number(pi.metadata.coins) : toCoins(pi.amount);
  await TxModel.create({
    txId: newTxId(), appUserId: pi.metadata.appUserId, type: "deposit",
    amount: coins, status: "completed",
    meta: { paymentIntentId: pi.id, source: "stripe_topup", amountCents: pi.amount },
  });
  return { credited: true, coins };
}

async function handleStripeEvent(event) {
  if (event.type === "payment_intent.succeeded") {
    return creditFromPaymentIntent(event.data.object);
  }
  return { credited: false, ignored: event.type };
}

module.exports = Object.assign(module.exports, {
  ensureStripeCustomer, createTopupIntent, creditFromPaymentIntent, handleStripeEvent,
});
```

- [ ] **Step 4: Run, verify pass**

Run: `node --test services/mobileWalletService.test.js`
Expected: PASS.

- [ ] **Step 5: Stage**

```bash
git add services/mobileWalletService.js services/mobileWalletService.test.js
```

---

### Task 5: `routes/mobileWallet.js`

**Files:**
- Create: `squadgoo-admin-panel-backend/routes/mobileWallet.js`

- [ ] **Step 1: Implement the router**

```js
// routes/mobileWallet.js
const express = require("express");
const appUserAuth = require("../middleware/appUserAuth");
const wallet = require("../services/mobileWalletService");
const { getStripe, publishableKey, webhookSecret } = require("../config/stripeConfig");

const router = express.Router();

// GET /wallet — balance snapshot
router.get("/wallet", appUserAuth, async (req, res) => {
  try {
    const snap = await wallet.getWalletSnapshot(req.appUser.id);
    return res.json({ ok: true, wallet: snap, publishableKey: publishableKey() });
  } catch (e) {
    console.error("GET /wallet error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// POST /wallet/topup/intent — create a Stripe PaymentIntent for `coins`
router.post("/wallet/topup/intent", appUserAuth, async (req, res) => {
  try {
    const out = await wallet.createTopupIntent({ appUserId: req.appUser.id, coins: req.body?.coins });
    return res.json({ ok: true, ...out, publishableKey: publishableKey() });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ error: { code: e.code || "SERVER_ERROR", message: e.message } });
  }
});

// POST /wallet/stripe/webhook — raw body mounted in mobileApp.js
router.post("/wallet/stripe/webhook", async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret());
    const result = await wallet.handleStripeEvent(event);
    return res.json({ received: true, ...result });
  } catch (e) {
    console.error("Stripe webhook error:", e.message);
    return res.status(400).json({ error: { code: "WEBHOOK_INVALID", message: e.message } });
  }
});

module.exports = router;
```

- [ ] **Step 2: Syntax check**

Run: `cd squadgoo-admin-panel-backend && node -c routes/mobileWallet.js`
Expected: no output (valid).

- [ ] **Step 3: Stage**

```bash
git add routes/mobileWallet.js
```

---

### Task 6: Mount router + webhook raw body

The webhook needs the **raw** request body for signature verification, so it must bypass the global JSON parser.

**Files:**
- Modify: `squadgoo-admin-panel-backend/routes/mobileApp.js`

- [ ] **Step 1: Require the router (top, with the other mobile routers ~line 23)**

```js
const mobileWalletRoutes = require("./mobileWallet");
```

- [ ] **Step 2: Mount the webhook with a raw parser BEFORE the JSON-parsed routers, then mount the rest**

Add near the other `router.use("/", ...)` mounts (~line 151), but put the raw webhook mount FIRST:

```js
// Stripe webhook needs the raw body (signature verification) — mount before JSON-parsed routers.
router.use("/wallet/stripe/webhook", express.raw({ type: "*/*" }));
router.use("/", mobileWalletRoutes);
```

> Note during execution: confirm where global `express.json()` is applied (likely `index.js`). If it runs before this router for all paths, instead add `express.json({ verify: (req,_res,buf)=>{ req.rawBody = buf; } })` at the app level and change the webhook to verify against `req.rawBody`. Pick whichever matches the app's existing body-parsing; verify by hitting the webhook with the Stripe CLI in Task 8.

- [ ] **Step 3: Syntax check + route-tree load**

Run: `cd squadgoo-admin-panel-backend && node -c routes/mobileApp.js && node -e "require('./routes/mobileApp'); console.log('routes load OK')"`
Expected: `routes load OK`.

- [ ] **Step 4: Stage**

```bash
git add routes/mobileApp.js
```

---

### Task 7: Wire escrow into the offer lifecycle

**Files:**
- Modify: `squadgoo-admin-panel-backend/routes/mobileJobs.js`

- [ ] **Step 1: Import the wallet service (near the top, with the other service requires ~line 11)**

```js
const wallet = require("../services/mobileWalletService");
```

- [ ] **Step 2: SEND — gate + hold (in `POST /offers`, replace lines ~304–324)**

Compute the fee, gate on available balance BEFORE creating the offer, then create the hold AFTER the offer exists (needs `offer._id`):

```js
      // Wallet layer (Phase 3): balance-gate + escrow hold of the match fee.
      const scope = offerScope(req, job);
      const matchFeeSc = resolveMatchFeeSc("manual", scope);

      const available = (await wallet.getWalletSnapshot(req.appUser.id)).availableCoins;
      if (!wallet.canHold(available, matchFeeSc)) {
        return res.status(402).json({
          error: { code: "INSUFFICIENT_FUNDS", message: "Top up your wallet to send this offer.",
            required: matchFeeSc, available },
        });
      }

      const offer = await Offer.create({
        offerId: genOfferId(),
        createdByRecruiterId: req.appUser.id,
        jobseekerId, jobId, mode: "manual", status: "sent", sentAt: new Date(),
        location: job.location, industry: job.industry, role: job.role,
        payRate: payRate || (job.salaryMin && job.salaryMax ? `$${job.salaryMin}-$${job.salaryMax}/${job.salaryType || "hr"}` : undefined),
        message, matchPercentage,
        expiresAt: new Date(Date.now() + hours * 3600 * 1000),
        meta: { matchFeeSc, ratesSource: getOperationalRates(scope).source },
      });

      await wallet.holdForOffer({ offerId: offer._id, recruiterId: req.appUser.id, feeCoins: matchFeeSc });
```

- [ ] **Step 3: ACCEPT — deduct (replace the NOTE at line ~417)**

```js
    await offer.save();
    // Wallet layer (Phase 3): convert the hold into an actual charge.
    await wallet.deductForOffer({ offerId: offer._id, recruiterId: offer.createdByRecruiterId, feeCoins: matchFeeSc });
```

- [ ] **Step 4: WITHDRAW — release (in `POST /offers/:id/withdraw`, after `await offer.save();` ~line 367)**

```js
    await wallet.releaseForOffer({ offerId: offer._id });
```

- [ ] **Step 5: DECLINE — release (in `POST /offers/:id/decline`, after the status is set to "declined" and saved)**

```js
    await wallet.releaseForOffer({ offerId: offer._id });
```

- [ ] **Step 6: EXPIRE — release (in `applyExpiry`, line ~99, when an offer transitions to expired)**

```js
async function applyExpiry(offer) {
  if (offer && offer.status === "sent" && offer.expiresAt && offer.expiresAt.getTime() < Date.now()) {
    offer.status = "expired";
    await offer.save();
    try { await wallet.releaseForOffer({ offerId: offer._id }); } catch (e) { console.warn("expire release skipped:", e?.message); }
  }
  return offer;
}
```

- [ ] **Step 7: Syntax check**

Run: `cd squadgoo-admin-panel-backend && node -c routes/mobileJobs.js`
Expected: no output (valid).

- [ ] **Step 8: Stage**

```bash
git add routes/mobileJobs.js
```

---

### Task 8: Backend integration smoke (live, needs Stripe test keys + Atlas)

**Files:** none (manual verification).

- [ ] **Step 1: Set env** in `squadgoo-admin-panel-backend/.env`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`, `COINS_PER_AUD`, real `MONGODB_URI`.

- [ ] **Step 2: Run server** `npm start` → port 5001, wait for `✅ MongoDB Connected`.

- [ ] **Step 3: Forward webhooks** `stripe listen --forward-to localhost:5001/api/mobile-app/wallet/stripe/webhook` (copy the signing secret into `STRIPE_WEBHOOK_SECRET`, restart).

- [ ] **Step 4: Drive the loop with curl/Stripe CLI:** register recruiter+jobseeker → `GET /wallet` (0) → create top-up intent → `stripe trigger payment_intent.succeeded` (or pay via app) → `GET /wallet` shows coins → preference + job + send offer (hold appears, available drops) → accept (deduct: match_fee tx, hold released) → second offer + decline (release, available restored) → send with empty balance → `402 INSUFFICIENT_FUNDS`.

- [ ] **Step 5: Stage** (no code; note results in the PR description later).

---

# PHASE 2 — MOBILE (Stripe SDK + wiring)

### Task 9: Add the SDK + StripeProvider

**Files:**
- Modify: `mobile/package.json`, `mobile/App.tsx`

- [ ] **Step 1: Add the dependency** `cd mobile && yarn add @stripe/stripe-react-native` then `cd ios && pod install` (macOS).

- [ ] **Step 2: Wrap the tree** in `App.tsx` — import and wrap between Redux `Provider` and `NavigationContainer`. The publishable key is fetched at runtime (Task 10) and can start empty:

```jsx
import { StripeProvider } from "@stripe/stripe-react-native";
// ...
<Provider store={store}>
  <StripeProvider publishableKey={process.env.STRIPE_PUBLISHABLE_KEY || ""}>
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
      <Toast config={toastConfig} />
    </NavigationContainer>
  </StripeProvider>
</Provider>
```

> The PaymentSheet flow passes the publishable key explicitly via `initPaymentSheet` is not needed; instead we set it on the provider once known. Simplest: fetch `GET /wallet` early and call `StripeProvider`'s `publishableKey` from state; or hardcode the test publishable key in `.env` for now. Wire dynamic key in Task 11 if desired.

- [ ] **Step 3: Stage** `git add package.json yarn.lock App.tsx ios/Podfile.lock`

---

### Task 10: Wallet api + query layer

**Files:**
- Create: `mobile/src/api/wallet/wallet.api.js`, `mobile/src/api/wallet/wallet.query.js`

- [ ] **Step 1: API layer** (mirror `offers.api.js`’s `request` helper/import)

```js
// src/api/wallet/wallet.api.js
import { request } from "../apiClient"; // match the helper offers.api.js uses

export const getWallet = async () => {
  const res = await request("/wallet", { method: "get" });
  return res?.wallet ? { ...res.wallet, publishableKey: res.publishableKey } : res;
};

export const createTopupIntent = async ({ coins }) => {
  const res = await request("/wallet/topup/intent", { method: "post", body: { coins } });
  return res; // { paymentIntentClientSecret, ephemeralKey, customerId, coins, publishableKey }
};
```

- [ ] **Step 2: Query layer**

```js
// src/api/wallet/wallet.query.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWallet, createTopupIntent } from "./wallet.api";
import { showToast, toastTypes } from "../../utilities/toastConfig";

export const walletKeys = { all: ["wallet"], snapshot: () => [...walletKeys.all, "snapshot"] };

export const useWallet = () =>
  useQuery({ queryKey: walletKeys.snapshot(), queryFn: getWallet });

export const useTopupIntent = () =>
  useMutation({
    mutationFn: createTopupIntent,
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || "Could not start top-up", "Error", toastTypes.error),
  });
```

- [ ] **Step 3: Lint** `cd mobile && npx eslint src/api/wallet/wallet.api.js src/api/wallet/wallet.query.js`
Expected: no new errors.

- [ ] **Step 4: Stage** `git add src/api/wallet/`

---

### Task 11: `usePaymentSheet` / `useWalletTopup` hook

**Files:**
- Create: `mobile/src/hooks/usePaymentSheet.js`

- [ ] **Step 1: Implement**

```js
// src/hooks/usePaymentSheet.js
import { useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useTopupIntent } from "../api/wallet/wallet.query";
import { walletKeys } from "../api/wallet/wallet.query";
import { showToast, toastTypes } from "../utilities/toastConfig";

export const useWalletTopup = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const intent = useTopupIntent();
  const qc = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const startTopup = async (coins) => {
    setIsProcessing(true);
    try {
      const r = await intent.mutateAsync({ coins });
      const init = await initPaymentSheet({
        merchantDisplayName: "SquadGo",
        customerId: r.customerId,
        customerEphemeralKeySecret: r.ephemeralKey,
        paymentIntentClientSecret: r.paymentIntentClientSecret,
        allowsDelayedPaymentMethods: false,
      });
      if (init.error) throw init.error;
      const { error } = await presentPaymentSheet();
      if (error) {
        if (error.code !== "Canceled") showToast(error.message, "Payment failed", toastTypes.error);
        return { ok: false, canceled: error.code === "Canceled" };
      }
      // success — webhook credits; refresh balance (brief poll covers webhook lag)
      qc.invalidateQueries({ queryKey: walletKeys.all });
      setTimeout(() => qc.invalidateQueries({ queryKey: walletKeys.all }), 2500);
      showToast("Top-up successful", "Success", toastTypes.success);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    } finally {
      setIsProcessing(false);
    }
  };

  return { startTopup, isProcessing };
};
```

- [ ] **Step 2: Lint** `npx eslint src/hooks/usePaymentSheet.js` → no new errors.
- [ ] **Step 3: Stage** `git add src/hooks/usePaymentSheet.js`

---

### Task 12: Wire `PurchaseCoins.jsx` to real top-up

**Files:**
- Modify: `mobile/src/screens/main/wallet/PurchaseCoins.jsx` (replace the dummy success at lines ~44–48)

- [ ] **Step 1: Replace the dummy mutation** with the hook. Keep the existing UI/inputs (frozen). Where it currently shows a fake toast + `addCoins`:

```jsx
import { useWalletTopup } from "../../../hooks/usePaymentSheet";
// inside component:
const { startTopup, isProcessing } = useWalletTopup();

const handlePurchase = async () => {
  const coins = Number(selectedCoins); // existing chosen amount
  if (!coins) return;
  const r = await startTopup(coins);
  if (r.ok) navigation.goBack();
};
// Bind the buy button to handlePurchase; gate with isProcessing (existing button's loading prop).
```

Remove the `addCoins` Redux dispatch + hardcoded success (server balance via `useWallet` is now the source of truth).

- [ ] **Step 2: Lint** `npx eslint src/screens/main/wallet/PurchaseCoins.jsx` → no new errors.
- [ ] **Step 3: Stage** `git add src/screens/main/wallet/PurchaseCoins.jsx`

---

### Task 13: Show server balance in Wallet + WalletBalanceComponent

**Files:**
- Modify: `mobile/src/screens/main/Recruiter/Wallet.jsx`, `mobile/src/components/wallet/WalletBalanceComponent.jsx`

- [ ] **Step 1:** In `Wallet.jsx`, replace the Redux `coins` source with `useWallet()`:

```jsx
import { useWallet } from "../../../api/wallet/wallet.query";
const { data: w, refetch, isFetching } = useWallet();
const coins = w?.availableCoins ?? 0;
const held = w?.heldCoins ?? 0;
// pass coins (+ held if the frozen component supports it) to WalletBalanceComponent; wire pull-to-refresh to refetch
```

- [ ] **Step 2:** `WalletBalanceComponent.jsx` keeps its layout; just receives `balanceAmount={coins}` from props instead of reading Redux. (No layout change.)

- [ ] **Step 3: Lint** both files → no new errors.
- [ ] **Step 4: Stage** `git add src/screens/main/Recruiter/Wallet.jsx src/components/wallet/WalletBalanceComponent.jsx`

---

### Task 14: Wire EscrowHolds screen

**Files:**
- Modify: `mobile/src/screens/main/wallet/EscrowHolds.jsx`

- [ ] **Step 1:** Source the holds list from `useWallet()`:

```jsx
import { useWallet } from "../../../api/wallet/wallet.query";
const { data: w, refetch, isFetching } = useWallet();
const holds = w?.holds ?? []; // [{ offerId, amount }]
// render into the existing frozen list; wire refresh to refetch
```

- [ ] **Step 2: Lint** → no new errors.
- [ ] **Step 3: Stage** `git add src/screens/main/wallet/EscrowHolds.jsx`

---

### Task 15: INSUFFICIENT_FUNDS handler on offer send

**Files:**
- Modify: `mobile/src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx` (the `handleSendOffer`, lines ~58–66)

- [ ] **Step 1: Catch the code and route to top-up**

```jsx
import { screenNames } from "../../../../navigation/screenNames";
// in handleSendOffer's catch:
} catch (err) {
  if (err?.response?.data?.error?.code === "INSUFFICIENT_FUNDS") {
    Alert.alert("Top up required", "You don't have enough balance to send this offer.", [
      { text: "Cancel", style: "cancel" },
      { text: "Top up", onPress: () => navigation.navigate(screenNames.TOP_UP) },
    ]);
  }
  // otherwise the useSendOffer onError toast already fired
}
```

- [ ] **Step 2: Lint** → no new errors.
- [ ] **Step 3: Stage** `git add src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx`

---

### Task 16: End-to-end manual verification (simulator/emulator)

**Files:** none.

- [ ] Point `src/api/apiClient.js` `LOCAL_HOST` at the running backend (this is a separate known TODO — currently stale `172.20.10.2`).
- [ ] Run app, log in as recruiter → Wallet shows 0 → Top up → PaymentSheet with Stripe **test card 4242 4242 4242 4242** → balance updates after webhook.
- [ ] Send an offer → hold appears in EscrowHolds, available drops. Jobseeker accepts → match_fee charged, hold gone. Decline another → released. Empty balance → send shows "Top up required".

---

## Self-Review

- **Spec coverage:** top-up (T1,4,5,9–12) ✓; webhook credit (T4–6) ✓; balance derive/available (T2) ✓; hold/deduct/release on send/accept/decline/withdraw/expire (T3,T7) ✓; insufficient-funds gate (T7 server, T15 mobile) ✓; wallet/holds display (T13,T14) ✓; security/idempotency (T3 dedupe, T4 paymentIntentId dedupe, T6 raw-body signature) ✓; testing (T2–4 unit, T8 integration, T16 e2e) ✓. Withdrawal + PayID intentionally out of scope ✓.
- **Placeholders:** none — all steps carry real code. The only deferred value is `COINS_PER_AUD` (config constant, awaiting client rate) — explicitly a config, not a code gap.
- **Type/name consistency:** service exports (`computeAvailable`, `canHold`, `holdForOffer`, `deductForOffer`, `releaseForOffer`, `getWalletSnapshot`, `createTopupIntent`, `handleStripeEvent`, `creditFromPaymentIntent`) match their call sites in routes/tests; `walletKeys`, `useWallet`, `useTopupIntent`, `useWalletTopup` consistent across hook/screens; snapshot fields (`availableCoins`, `heldCoins`, `holds[{offerId,amount}]`) consistent across backend + mobile.
- **Open item:** Task 6 raw-body mounting must be verified against the app's actual global body parser (`index.js`) during execution — flagged inline with a fallback approach.
