# SquadGo — Resume Here (work state)

_Last updated: 2026-05-24._ Pick up from this file. It captures where we are, how to run/test
locally, and what's next. Companion docs: `docs/INTEGRATION_STATUS.md` (phase table),
`docs/superpowers/plans/2026-05-23-job-offers-manual-flow.md` (the job-offers plan),
`mobile/CLAUDE.md` (coding rules incl. the required null-safety/error-handling section).

---

## TL;DR — where we are

Backend integration of the mobile app (was 100% dummy data). Auth, Profile, KYC, and the whole
recruiter **Profile menu** are wired + tested. **Job Offers (Phase 2a)**: backend built &
validated end-to-end; **mobile side (Phase D–E) not started** — this is the main next task.

---

## ✅ Done

### Auth / Profile / KYC (backend + mobile)
- Login / register / token refresh / logout.
- Profile: `GET/PUT /users/me` (firstName, lastName, phone, dateOfBirth, bio, address fields),
  profile-photo upload (`POST /users/profile-picture`, multer disk — local only, real storage TBD).
- KYC/KYB submission → separate `KycSubmission` collection (`POST/GET /users/kyc-kyb`); manual
  admin review later.

### Recruiter Profile menu — ALL items wired + hardened (this session)
Backend: `AppUser` gained `address`/`tax`/`visa`/`social` (Mixed); `routes/mobileProfile.js` adds
`POST /app/JobSeeker/update{Address,TaxInfo,SocialLinks,Visa}` + `POST /users/change-password`
(bcrypt verify/set). `safeUser` returns the new fields and is exported.
Mobile: defined the missing `useUpdateJobSeekerProfile` (→ visa) + `useChangePassword`; wired
Password (was fake setTimeout), Visa (was fake setTimeout), Contact (→ `useUpdateMe` for phone);
fixed null-crash in BasicDetailsSheet; fixed wrong field paths in Address/Contact sheets +
Tax/Visa/Social/Address prefills; added error toasts to all jobSeeker.query hooks.
Status: Basic/Contact details (display sheets), Address, Tax, Visa, KYB, Social, Password — all save.

### Job Offers — Phase 2a BACKEND (built + validated end-to-end against Atlas)
- Models: `Job.js` (full approved-UI field set + `meta`), `JobseekerPreference.js`,
  `Offer.js` extended (`jobId`, payRate, message, expiresAt, decline/withdraw/sent timestamps,
  `expired`/`withdrawn` statuses, indexes; generates unique `offerId`).
- Routes (`routes/mobileJobs.js` + `routes/mobileJobseekerPreferences.js`):
  recruiter job CRUD, filter+score candidate matching (mirrors app's computeMatchScore),
  send/withdraw offer, jobseeker received/accept/decline, preferred-job CRUD.
- Smoke-tested: register→preference→post job→match(100%)→offer→accept→409 guard. ✓

---

## ⏭️ Next (in priority order)

1. **Job Offers — Phase D–E (MOBILE).** The plan is written and the contract is proven.
   - Phase D: create `src/api/jobs/`, `src/api/offers/`, `src/api/preferences/` (api + query hooks).
   - Phase E: wire screens dummy→hooks (recruiter post-job wizard → JobPreview, ManualMatchList,
     SendOffer, the offer-status tabs; jobseeker ManualOffers + JobOfferDetails accept/decline;
     PreferredJobs CRUD — the matching data source).
   - Follow the plan task-by-task; obey `CLAUDE.md` (UI frozen, null-safety, error toasts).
2. **Jobseeker profile screens** (Education, Skills & Languages, Work Experience) — same hardening
   + backend wiring pass as the recruiter profile menu. Education/Skills are currently local-only.
3. **Remaining Phase 1**: bank account, push notifications (FCM).
4. **Storage-blocked**: profile photo + KYC document file uploads (need real storage, e.g. S3).
5. **Admin panel**: KYC review UI + job/offer management (deferred by client).
6. **Phase 2b** (quick search auto-match/auto-send, offer modification), **Phase 3** (wallet,
   work session/timer/location, escrow), **Social** (chat, reviews, contact reveal), **Squads**.

---

## 🖥️ Local dev setup & how to run/test (IMPORTANT — these bit us)

- **DB:** MongoDB Atlas (`mongodb+srv://…cluster0.r6i9ho…`). The Atlas SRV DNS is **intermittently
  flaky** (`queryTxt ETIMEOUT`) — if the server logs "Skipping Mongo route mounts (no database)",
  just **restart** it (and the new job/profile routes only mount when DB is connected).
- **Port 5000 is taken by macOS AirPlay Receiver** (ControlCenter). Either turn AirPlay Receiver
  off (System Settings → General → AirDrop & Handoff) to use 5000, or **run the backend on an
  alt port** (we've used 5001 / 5055): `PORT=5001 node index.js`.
- **`src/api/apiClient.js`** `BASE_URL` must point at the backend. iOS simulator → `localhost`;
  Android emulator → `10.0.2.2`; physical device → Mac's LAN IP (was `192.168.1.10`; check
  `ifconfig`). The port in BASE_URL must match the port the backend runs on.
- **After backend code changes:** restart `node index.js`. **After mobile changes:** reload Metro (`r`).
- **Test accounts (created in DB):**
  - Recruiter — `recruiter@squadgo.com` / `Squadgo@123`
  - Jobseeker — `jobseeker@squadgo.com` / `Squadgo@123`
- **Sessions expire** (15-min access token). If screens show empty data or you hit a logout, the
  token expired — log in again.

### Quick backend smoke test (curl)
```bash
BASE=http://localhost:5001/api/mobile-app   # match your run port
REC=$(curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' -d '{"email":"recruiter@squadgo.com","password":"Squadgo@123"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["accessToken"])')
curl -s "$BASE/users/me" -H "Authorization: Bearer $REC"
```

---

## ⚠️ Open issues / gotchas

- **Git push blocked.** Backend commits are made locally on branch `mobile/auth` but **not pushed** —
  the remote `SQUADGOO/squadgoo-admin-panel-backend` isn't resolvable by the logged-in GitHub
  accounts (only `SQUADGOO/SquadGoo`, the mobile repo, is visible). Need correct remote URL or
  account access before pushing. Mobile repo changes also not committed yet.
- **Backend must be restarted** to pick up any backend code added in a session.
- Profile photo / KYC docs / matching geo-distance are deferred (storage / lat-lng not set up).

---

## Conventions reminder (see `mobile/CLAUDE.md`)
JavaScript only (no TS), UI is client-approved & **frozen** (wire dummy→hooks, never change
layout/fields/names), per-feature `*.api.js` + `*.query.js`, query-key objects, null-safe Redux
reads, every mutation `onError` toasts, no fake `setTimeout` success stubs, verify hooks exist
before importing.
