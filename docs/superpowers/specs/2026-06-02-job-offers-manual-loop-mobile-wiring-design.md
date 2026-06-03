# Phase 2a — Mobile wiring of the manual job/offer loop (design)

**Status: DESIGN COMPLETE & APPROVED (Sections 1–3 + flow). UNBLOCKED — ready for writing-plans.**
Backend reconciliation with `main` is DONE (merged + deployed live). The escrow/pay-to-send question
is RESOLVED: escrow is **Phase 3** (Stripe-funded wallet), so Phase 2a wires the manual flow with the
match-fee **calculated only** (no balance gate/hold/deduct). See "Backend reconciliation" below.
Date: 2026-06-02 (updated 2026-06-03). Flow diagram: `2026-06-02-job-offers-manual-loop-FLOW.md`.

## Goal
Wire the SquadGo mobile app's **manual search** job/offer flow (recruiter + jobseeker)
off dummy data onto the already-built, already-validated backend endpoints. UI is
**client-approved/FROZEN** — change only the data source, never layout/copy/fields/
field-names. Field-name mapping lives only in the `*.api.js` layer. See
`reference-job-offer-flow` memory and `docs/superpowers/plans/2026-05-23-job-offers-manual-flow.md`.

## Locked decisions (approved in brainstorming)
1. **Scope: full manual loop, both roles** — recruiter post→matches→offer→withdraw;
   jobseeker preferences + received offers + accept/decline. (Recruiter match list is
   empty without jobseeker `JobseekerPreference` rows → both sides wired so the loop is
   testable end-to-end in-app.)
2. **Drafts included** — save-draft, draft list, edit-draft prefill, publish.
3. **React Query is the source of truth** (per `mobile/CLAUDE.md`). Screens read from
   hooks; Redux keeps ONLY the multi-step wizard's in-progress form state. Old dummy
   read-paths in `jobsSlice`/`manualOffersSlice`/`jobSeekerOffersSlice`/
   `jobSeekerPreferredSlice` are left in place (no deletes) but no longer read.

## Backend (already built + validated — base `/api/mobile-app`)
Routes: `squadgoo-admin-panel-backend/routes/mobileJobs.js` + `mobileJobseekerPreferences.js`.
Success `{ ok:true, ... }`; error `{ error:{ code, message } }`.
- Recruiter jobs: `POST /jobs` (draft|posted) · `GET /jobs?status=` · `GET /jobs/:id` ·
  `PUT /jobs/:id` (draft only) · `POST /jobs/:id/publish` · `GET /jobs/:id/candidates`.
- Recruiter offers: `POST /offers` `{jobId, jobseekerId, payRate?, message?, expiresInHours?}` ·
  `GET /offers?status=` · `POST /offers/:id/withdraw`.
- Jobseeker offers: `GET /offers/received` · `POST /offers/:id/accept` ·
  `POST /offers/:id/decline` (`body.reason`).
- Jobseeker prefs: `GET/POST /jobseeker/preferences` · `PUT/DELETE /jobseeker/preferences/:id`.
- Offer status enum `created/sent/accepted/declined/expired/withdrawn` (UI maps `sent`→`pending`).
- `JobseekerPreference` mirrors UI `preferredJobs[]` ~1:1 → mapping mostly pass-through.
- Candidate object from `/jobs/:id/candidates`: id(=AppUser _id), name, avatar, state, suburb,
  radiusKm, taxTypes[], industries[], preferredRoles[], payPreference{min,max}, languages[](empty),
  experienceYears(0), badge(null), isVerified, acceptanceRating(null), matchPercentage. Rich card
  fields without a source come back null/empty — frozen card tolerates.

---

## Backend reconciliation with `main` (discovered 2026-06-03)
When merging our backend branch (`mobile/auth`) into `origin/main`, we found the admin-panel
team (commits authored by **`SQUADGOO ADMIN`**) independently built their own mobile API on
`main`. The branches **diverged** (main = +94 commits, ours = +4 incl. the Phase 2a jobs/offers
backend we built 2026-05-24). Only **`routes/mobileApp.js`** has a git conflict; everything else
auto-merges.

**The two mobile backends are ~90% complementary:**
- **Ours (unique):** job CRUD `/jobs` + draft/publish, candidate matching `/jobs/:id/candidates`,
  jobseeker preferences `/jobseeker/preferences`, offer lifecycle `GET /offers` + `/offers/received`
  + `/offers/:id/{decline,withdraw}`, profile fields/photo/KYC/KYB.
- **Theirs (unique):** wallet (`/wallet/fee-quote|top-up|withdraw|bank-withdrawals`), `/disputes`,
  job-offer chat `/job-chats/threads...`, public config reads, their own mobile auth at `/api/*`
  (`/login`,`/me`,`/logout`,`/finalize-login`,`/verify-otp`), admin jobs/offers mgmt (Offer 360).

**The ONLY true collisions (same path, both sides):**
1. `POST /offers` — ours = create offer in hiring flow (jobId+jobseekerId, status `sent`, expiry);
   theirs = calculate **wallet match-fee** from rate card (status `created`).
2. `POST /offers/:id/accept` — ours = accept manual offer; theirs = **charge match-fee** (meta only
   today) + **open a job-offer chat thread** (`upsertThreadOnAccept`).

**Decision (2026-06-03): COMBINE both** — our offer lifecycle owns the paths, and their fee-calc +
chat-on-accept are grafted on top. Their auth at `/api/*` can coexist with ours (different paths);
mobile app keeps calling our `/api/mobile-app/...` paths. Resolving `mobileApp.js` = mount our 4
routers + keep their wallet/disputes/job-chat inline routes; the 2 colliding offer routes get the
combined handler.

**✅ RESOLVED by client (2026-06-03) — escrow model, deferred to Phase 3:**
Client's rule: a recruiter must have **enough wallet balance for the number of staff required** to
start a manual/quick search; on **offer sent** the pre-calculated amount is **held**; on **jobseeker
accept** it is **deducted**; (implied) released on decline/expire/withdraw. **Payment funding =
Stripe** (top-up).
**Decision: this escrow enforcement is Phase 3 (Wallet), NOT part of Phase 2a.** Reason: the wallet
isn't functional for recruiters yet — mobile `/wallet/top-up` + `/withdraw` are 501 stubs (no way to
fund a wallet), no balance gate / hold / deduct / release wired. The admin team built wallet
primitives for finance ops only (`WalletTransaction` created in admin routes, `EscrowLedger` in
dashboards/disputes, `AppUser.walletHolds`/`walletFrozen`, `balanceSc` in admin 360 reports), but the
recruiter-facing funding + offer hold/deduct is unbuilt.
**Phase 2a (now):** keep the match-fee **calculated** only (already grafted: `meta.matchFeeSc` on
send, `meta.matchFeeChargedSc` on accept) — NO balance gate, NO hold, NO deduct. Manual hiring flow
works end-to-end without money movement.
**Phase 3 (later, with admin team — they own WalletTransaction/EscrowLedger):** Stripe top-up →
real balance → balance-gate to start search (≥ staffNumber × matchFee) → hold on send → deduct on
accept → release on decline/expire/withdraw.

**Merge status:** PAUSED — `git merge origin/main` in progress on `mobile/auth`, conflict in
`routes/mobileApp.js` not yet resolved. Hold until the client answers the pay-to-send question,
then resolve `mobileApp.js` per the COMBINE decision.

---

## Section 1 — Data layer & new modules (APPROVED)
Three new feature folders under `src/api/`, each two-layer (`*.api.js` raw axios via the
shared `apiClient` + error/field mapping; `*.query.js` TanStack hooks + `xxxKeys` factory).
Paths relative to the apiClient base (`/api/mobile-app`).

```
src/api/jobs/        createJob, listMyJobs(status), getJob(id), updateJobDraft(id),
                     publishJob(id), getJobCandidates(jobId)
                     hooks: useCreateJob, useMyJobs, useJob, useUpdateJobDraft,
                            usePublishJob, useJobCandidates
src/api/offers/      sendOffer, listSentOffers(status), withdrawOffer(id),
                     listReceivedOffers(status), acceptOffer(id), declineOffer(id, reason)
                     hooks: useSendOffer, useSentOffers, useWithdrawOffer,
                            useReceivedOffers, useAcceptOffer, useDeclineOffer
src/api/preferences/ listPreferences, createPreference, updatePreference(id), deletePreference(id)
                     hooks: usePreferences, useCreatePreference, useUpdatePreference, useDeletePreference
```

Three mappings that live in `.api.js` (never in screens):
1. Offer status: backend `sent` ⇄ UI `pending` (both ways); others pass through.
2. Send-offer payload: screen `candidateId`→`jobseekerId`; `expiryHours`/`expiresAt`→`expiresInHours`;
   pass `message`, optional `payRate`.
3. Job create: wizard object → backend (numbers for salaryMin/Max; clean keys; extras→meta server-side).
   Also normalise Mongo `_id`↔`id` for screens that expect `id`.

---

## Section 2 — Per-screen wiring (APPROVED)

**Recruiter — job creation wizard** (`ManualSearch→StepTwo→AbilityToWork→StepThree→StepFour→JobPreview`)
- Steps 1–4 + AbilityToWork: unchanged; accumulate into wizard Redux form state, no mid-wizard API.
- JobPreview "Post now": `useCreateJob({status:'posted', ...mapped})` → on success take `job._id`,
  clear wizard state, navigate to `ManualMatchList` with jobId. Button gated by `isPending`.
- JobPreview "Save draft": `useCreateJob({status:'draft'})` (or `useUpdateJobDraft(id)` when editing).

**Recruiter — job & draft lists**
- `useMyJobs('posted')` / `useMyJobs('draft')` etc. replace `jobsSlice` dummy reads.
- Edit draft: wizard prefilled from `useJob(id)`; save `useUpdateJobDraft(id)`; go live `usePublishJob(id)`.

**Recruiter — matches** (`ManualMatchList`)
- On mount `useJobCandidates(jobId)` (replaces `generateManualMatches()`); `isLoading`→spinner;
  empty→existing empty state. Tap candidate → navigate to `ManualCandidateProfile` passing the
  candidate object via nav params (no refetch — no single-candidate endpoint).

**Recruiter — candidate profile** (`ManualCandidateProfile`)
- Read candidate from nav params. Rich unsourced fields render as the frozen card tolerates.
- Send offer (modal: expiry+message) → `useSendOffer`; api maps candidate.id→jobseekerId,
  expiryHours→expiresInHours, message, optional payRate. Success → toast + navigate to `ManualOffers`.
  Gated by `isPending`.

**Recruiter — offers list** (`ManualOffers`)
- `useSentOffers(status)` per tab; api maps `sent→pending`; replaces Redux dummy + client-side expiry.
- Withdraw → `useWithdrawOffer(id)` → invalidate offers query.

**Jobseeker — preferences** (`PreferredJobs`/`AddJobStep2`)
- List `usePreferences()`; add/edit `useCreatePreference`/`useUpdatePreference` (~pass-through);
  delete `useDeletePreference`. This populates the recruiter match list.

**Jobseeker — received offers + accept/decline**
- Received list `useReceivedOffers(status)` (`sent→pending`).
- Accept `useAcceptOffer(id)`. Decline `useDeclineOffer(id, reason)` keeping the frozen rule
  (reason required if `matchPercentage ≥ 70`, validated in-screen).
- 409 handling: non-`sent` offer → `409 INVALID_STATE` → error toast + invalidate list.

---

## Section 3 — Errors, caching, testing & sequencing (APPROVED)

**Error handling (per CLAUDE.md):** every mutation `onError` →
`showToast(err?.response?.data?.error?.message || '<fallback>', 'Error', toastTypes.error)`.
Screens calling `mutateAsync` wrap in try/catch. Query errors → inline/empty + retry. Null-safety
guards on selectors/user fields. Reuse existing `apiClient` (auth + 401-refresh). No file uploads here.

**Loading gating:** mutations gate buttons with `isPending` (Post, Save draft, Send offer, Withdraw,
Accept, Decline, preference save/delete). Queries use `isLoading`→spinner; empty→existing empty state.

**Query keys + invalidation:**
- `jobsKeys`: lists(status), detail(id), candidates(jobId) · `offersKeys`: sent(status), received(status) ·
  `preferencesKeys`: list.
- createJob/updateJobDraft/publishJob → invalidate jobsKeys.lists (+ detail).
- sendOffer → offersKeys.sent (+ jobsKeys.lists; job flips to has_applicants).
- withdrawOffer → offersKeys.sent. accept/decline → offersKeys.received.
- preference create/update/delete → preferencesKeys.list.
- Pagination: lists are server-paginated; frozen screens are simple lists → request high `limit` (~50),
  single-page for now; infinite scroll = later enhancement.

**Redux boundary:** wizard form state stays in Redux; dummy slice read-paths left unused (no deletes);
these screens always use hooks (not gated on `USE_DUMMY_DATA`).

**Testing/verification (no harness; don't add deps):**
- Backend: re-run existing node smoke script vs Atlas (no backend changes expected).
- Mobile: eslint (no new real errors) + module-load sanity.
- Manual two-account e2e on simulator (recruiter + jobseeker): jobseeker saves preference →
  recruiter posts job → sees jobseeker as scored candidate → sends offer → jobseeker receives →
  accepts → recruiter sees accepted. Plus decline (≥70 reason rule), withdraw, draft save→edit→publish,
  409 re-accept. Requires local backend on the user's alt port; apiClient LOCAL_HOST = LAN IP.

**Implementation sequencing:**
```
D1 api/query layer (no screen changes)
E1 Jobseeker preferences  ◄── FIRST (matching needs preference data)
E2 Recruiter job create + lists + drafts
E3 Recruiter matches + candidate profile
E4 Recruiter offers list + withdraw
E5 Jobseeker received offers + accept/decline
F  Two-account end-to-end test + eslint sweep + fixes
```
Rationale: preferences first so matching has data; then recruiter create→match→offer; then jobseeker
receive/accept closes the loop.

---

## NEXT when we resume
1. Spec self-review (placeholders / consistency / scope / ambiguity) — fix inline.
2. User reviews this spec.
3. Invoke `writing-plans` skill → detailed implementation plan keyed to the D1/E1–E5/F sequence.
4. Implement (TDD where it fits; eslint + two-account manual e2e to verify).
