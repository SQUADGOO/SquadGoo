# Backend Integration Status

_Last updated: 2026-05-12_

## Overall status
Mobile app was fully on dummy data. Backend integration is now in progress.
Auth is the first completed phase — app can register, log in, and maintain session against the real backend.

---

## Phase 1 — Auth + Profile

| Feature | Backend | Mobile wired | Notes |
|---------|---------|--------------|-------|
| Register (jobseeker / recruiter / individual) | ✅ | ✅ | `POST /auth/register` |
| Login | ✅ | ✅ | `POST /auth/login` |
| Token refresh | ✅ | ✅ | Auto via axios interceptor |
| Logout | ✅ | ✅ | `POST /auth/logout` |
| GET profile (`/users/me`) | ✅ | ⏳ | Hook ready (`useGetMe`), screens not wired yet |
| PUT profile (`/users/me`) | ✅ | ⏳ | Hook ready (`useUpdateMe`), screens not wired yet |
| KYC document upload | ❌ | ❌ | Not built |
| Push notifications | ❌ | ❌ | Not built |
| Bank account | ❌ | ❌ | Not built |

## Phase 2 — Jobs & Offers

| Feature | Backend | Mobile wired | Notes |
|---------|---------|--------------|-------|
| Manual search (post job) | ❌ | ❌ | Model design decision needed first |
| Quick search (post job) | ❌ | ❌ | Model design decision needed first |
| Job matching | ❌ | ❌ | |
| Job applications | ❌ | ❌ | |

## Phase 3 — Wallet & Work Session

| Feature | Backend | Mobile wired | Notes |
|---------|---------|--------------|-------|
| Wallet balance | ❌ | ❌ | |
| Escrow | ❌ | ❌ | |
| Work session / timer | ❌ | ❌ | |
| Live location | ❌ | ❌ | |

## Phase 4 — Social

| Feature | Backend | Mobile wired | Notes |
|---------|---------|--------------|-------|
| Reviews | ❌ | ❌ | UI complete, dummy data |
| Announcements | ❌ | ❌ | UI complete, dummy data |
| Peer chat | ❌ | ❌ | |

## Phase 5 — Marketplace & Misc

| Feature | Backend | Mobile wired | Notes |
|---------|---------|--------------|-------|
| Marketplace | ❌ | ❌ | UI has TODOs |
| Badge claim | ❌ | ❌ | |
| Contact reveal | ❌ | ❌ | |
| FCM push notifications | ❌ | ❌ | |

---

## Open decisions (must resolve before Phase 2)

1. **Manual vs Quick Search job model** — one `Job` model with `searchType` field, or two separate models?
2. **Currency** — AUD only?
3. **SG Coins** — what is the AUD/coin conversion rate?
4. **Email/SMS provider** — which provider for OTP / password reset?
5. **Push notifications** — FCM only, or APNS too?
6. **KYC** — manual admin review, or third-party identity service (Onfido etc.)?

---

## How to switch a screen from dummy → real

The app has a `USE_DUMMY_DATA` flag in `src/utilities/dummyData.js`.
Rather than a global toggle, we wire screens feature by feature:

1. Remove dummy mode `if (isDummyMode())` block from the screen
2. Import the relevant TanStack Query hook
3. Replace dummy data source with the hook's `data`
4. Replace manual loading state with hook's `isPending` / `isLoading`

Auth screens (`Signin.js`, `SignUp.jsx`) are already wired — use them as reference.

---

## Key files changed during integration

| File | What changed |
|------|-------------|
| `src/api/apiClient.js` | New base URL, removed console.log, added refresh interceptor |
| `src/api/auth/auth.api.js` | Updated to new backend paths |
| `src/api/auth/auth.query.js` | Rewrote hooks to match new response shape |
| `src/api/user/user.api.js` | Updated path to `/users/me` |
| `src/api/user/user.query.js` | Replaced `useGetUserData` mutation with proper `useQuery`, added `useUpdateMe` |
| `src/store/authSlice.js` | Added `refreshToken`, `userId`; maps `userType` → `role`; added `setTokens` |
| `src/screens/auth/Signin.js` | Removed dummy mode, wired `useLogin` |
| `src/screens/auth/SignUp.jsx` | Removed dummy mode, wired `useRegister` |
