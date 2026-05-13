# SquadGoo — Work Status & Continuation Notes

_Last updated: 2026-04-29 (added admin panel audit notes)_

This file tracks work in progress against the client's **Recruiter Notes S25 Ultra 2.docx** (located at `doc_by_ramp/Recruiter Notes S25 Ultra 2.docx`) and recent UX additions. Pick it up from the "Resume here" section at the bottom.

---

## Project scope

UI-only engagement. **Admin panel and backend are owned by another developer.** Dummy data + toast stubs are the expected pattern for this work. Don't build admin screens or persistence layers.

---

## ✅ Completed in this stream of work

### Reviews module (1-to-1 model: reviewer ↔ reviewee)
Client asked for: users react to reviews, reply, and either party can report to admin.

Shared components in `src/components/social/`:
- `ReactionBar.jsx` — single-emoji picker (tap `+ React` → pick one → collapses to chip); supports `canReact={false}` read-only mode
- `ReviewReply.jsx` — single reply (one per reviewee); supports `canReply={false}` read-only mode
- `ReportSheet.jsx` — reason radio list + optional note; admin-queue payload
- `constants.js` — `REACTIONS` (6 emojis), `REPORT_REASONS`

Screens:
- `src/screens/main/MyReviews.jsx` — received reviews (user is reviewee → can react, reply, report)
- `src/screens/main/WrittenReviews.jsx` — outgoing reviews (user is reviewer → sees reviewee's response read-only; can report)
- `src/screens/main/Recruiter/LaborPool/SquadReviews.jsx` — third-party browsing; reactions/replies read-only; report enabled

Drawer entries (both roles) under **Rating & Reports** (recruiter) / **Reports & Stats** (jobseeker):
- My Reviews (`screenNames.MY_REVIEWS`, params `{ audience: 'recruiter'|'jobseeker' }`)
- Reviews I've Written (`screenNames.WRITTEN_REVIEWS`, params `{ audience }`)

### Announcements module (social — many users react/comment)
Client asked for: admin creates posts/news, users receive them, react with emojis, comment, report.

Shared components:
- `src/components/social/PostReactions.jsx` — aggregated counts + user's pick highlighted; single reaction per user
- `src/components/social/CommentThread.jsx` — one-level comments + input + per-comment report

Screens:
- `src/screens/main/Announcements.jsx` — feed with category filter chips (All / News / Updates / Promos / Alerts), unread dots, pull-to-refresh
- `src/screens/main/AnnouncementDetails.jsx` — full post + reactions + comments + report (post or comment)

Data: `src/utilities/dummyAnnouncements.js` — 8 seed posts with cover images (picsum.photos seeds), reactions, comments.

Entry points:
- Drawer → **Announcements** on both roles
- Quick Actions **Media** tile on recruiter `Home.jsx` and jobseeker `Dashboard.jsx` (per doc line 608)
- `screenNames.ANNOUNCEMENTS` + `screenNames.ANNOUNCEMENT_DETAILS`

### Chat icon on jobseeker AppHeader
Client asked for: jobseeker needs a way to reach chat (recruiter already has it in bottom tab).

- `src/core/AppHeader.js` now reads `auth.role` from Redux and renders a white `chatbubble-outline` Ionicon in the top-right icon row when `role === 'jobseeker'`.
- Navigates to `screenNames.CHAT` → `ui.Chat` = inbox list (`src/screens/main/Recruiter/Chat.jsx`, shared between roles).
- Appears on every jobseeker screen that uses `AppHeader` with `showTopIcons={true}` (default).

### JobSeekerTab collision fix
Was: bottom tab named `CHAT` routed to `PreferredJobs` → `navigate(CHAT)` could land on the wrong screen.

Fix:
- Added `PREFERRED_JOBS: 'preferred_jobs'` to `screenNames.js`
- Renamed the tab's `name` to `PREFERRED_JOBS` in `src/navigation/JobSeekerTab.js`
- Swapped tab icon from chat PNG to Ionicons `heart` / `heart-outline`
- `TabIcon` refactored to accept either `activeIcon/inactiveIcon` PNG pair **or** `vectorIcon/vectorIconActive` Ionicon pair

### Naming (partial — sampled, not exhaustive)
- Quick Fill / Manual Fill labels applied across drawer, FindStaff, Quick Search flow
- 30-day expiry messaging in `CompletedWorkerProfile.jsx:105,150`, `JobPreview.jsx:223-225`, `QuickSearchPreview.jsx:440`
- Per-section edit icons in `QuickSearchPreview.jsx:200-212`
- Basic pool filters in `YourPool.jsx:13,362-367`

### Salary & Benefits restructure (Manual Fill) ✓
`ManualSearchSteps/StepTwo.jsx:55-142` — full restructure done:
- Salary Type dropdown: Hourly / Daily / Weekly / Annual / Other
- Salary Range From / To with correct unit label
- Extra Pay toggles: Public Holidays, Weekend, Shift Loading, Bonuses, Overtime
- Validation gates rate fields on toggle state

### Weekend Extra Pay conditional logic ✓
`QuickSearch/StepFour.jsx:347-450` — Saturday/Sunday rate fields render only when the corresponding day is selected (`isSaturdaySelected` / `isSundaySelected`). Validation at `:243-256` matches.

### "Required Number of Positions" rename ✓
`QuickSearch/StepOne.jsx:469` — label now reads "Required Number of Position*" (internal field still `staffCount`).

### Same-day end date ✓
`QuickSearch/StepFour.jsx:62-63` — `isMultiDay` is `false` when start === end; no validator blocks same-day.

### Social media single-link save ✓
`Recruiter/profile/SocialMedia.jsx:38-147` — `activeFields` toggle gates each social row; non-"Other" fields aren't required, so saving a single link works.

### Industry removal — Jobseeker side ✓ (2026-04-28)
- `AddJobStep1.jsx` — dropped Preferred Industry selector, `industryOptions`, sheet ref, and `preferredIndustry` form field; `JobCategorySelector` now drives Job Category + Sub Category alone (label "Job Category & Sub Category")
- `PreferredJobs.jsx` — derives `jobCategory` + `subCategory` from `preferredJobTitle`; renders both rows when sub-category is present
- `WorkExperience.jsx` — `formatIndustry` renamed to `formatJobCategory`; label was already "Job Category"
- `JobOfferDetails.jsx` — chip and InfoRow now read `jobCategory || industry` (legacy fallback); InfoRow label "Job category"
- `MyCurrentJobs.jsx` — emits `jobCategory` (was `industry`)
- `CompletedOffers.jsx`, `AcceptedOffers.jsx` — display `jobCategory || industry`
- `JobPool/{ActiveOffersPool,ExpiredDeclinedPool,CompletedOffersPool}.jsx` — search filters and Employer rows updated

### Industry removal — Recruiter side ✓ (2026-04-28)
- `dummyEmployees.js` — `getEmployeesByIndustry` renamed to `getEmployeesByJobCategory` (parameter renamed)
- `dummyContractors.js` — `getContractorsByIndustry` renamed to `getContractorsByJobCategory` (parameter renamed)
- `CandidateProfile.jsx` (QuickSearch) — "Industries" label → "Job Categories"
- `CandidateProfileView.jsx` — `InfoField label="Industries"` → `"Job Categories"`
- No user-facing "Industry" / "Industries" labels remain in recruiter UI

### Required Education / Faculty removal ✓ (2026-04-28)
- `ManualSearchSteps/StepThree.jsx` — removed Educational Qualification section (EducationSelector + LanguageTag display + state + handlers + form field + `educationalQualifications` payload key); also removed orphaned `LanguageTag` component, `EducationSelector` import
- `QuickSearch/StepOne.jsx` — removed Required Education label/field, `requiredEducation` state, `setRequiredEducation` calls in 3 places (init, edit-mode prefill, returnToPreview prefill), validation, payload key
- `QuickSearch/QuickSearchPreview.jsx` — removed Required Education DetailRow, validation, payload propagation in 2 places
- `HomeTabs/JobPreview.jsx` — removed Required education preview row, validation, and `educationalQualification(s)` propagation in 2 places
- `ViewJobDetails.jsx` — removed `keyQualificationsValue` education entry and the "Education required" InfoRow
- `EducationSelector` component left in place (unused; safe for jobseeker profile reuse)

### Hygiene pass ✓ (2026-04-28)
- Removed `console.log('value', value);` from `src/core/AppInputField.js:41`
- Stripped stale PoolHeader props (`leftIcon`/`rightIcon`/`containerStyle`/`titleStyle`) from 7 screens: LaborPool/{Contractors, SquadReviews, Employees, YourPool, SquadPool}.jsx, MyReviews.jsx, WrittenReviews.jsx — replaced with `showBackButton` + `onBackPress`

### Freshers can also apply — visual checkbox ✓ (2026-04-28)
- `QuickSearchPreview.jsx:679` — replaced plain-text "Freshers can also apply" value with a separate row containing a filled checkbox icon + label; experience years/months always shown

### KYC Proof of Business Address PDF upload ✓ (2026-04-28)
- `ImagePickerSheet.jsx` — added optional `allowPdf` prop showing a third "Choose PDF" option (stub asset for UI/dummy; reachable from camera/gallery sheet)
- `KycDocument.jsx` — passes `allowPdf` so both ABN/ACN Certificate and Proof of Business Address can be uploaded as PDF (per docx p.234 item 2)
- KycVerification (personal ID + selfie) intentionally NOT extended — those remain image-only per scope

---

## 🐛 Known bugs / tech debt

### Trivial cleanups
- `src/core/AppInputField.js:41` — `console.log('value', value)` fires on every keystroke; remove it
- `src/screens/auth/OnBoardingScreen.jsx:59,171` — empty `.catch(() => {})` swallowing errors
- `src/screens/main/Recruiter/Settings/LegalCompliance.jsx:24` — same pattern

### Stale `PoolHeader` props (silently ignored)
`PoolHeader` does NOT accept `leftIcon`, `rightIcon`, `containerStyle`, `titleStyle`. It accepts: `title`, `showBackButton`, `onBackPress`, `rightComponent`, `stepIndicator`, `statusBarStyle`, `backgroundColor`, `children`.

Screens passing bogus props (back button still works via default `showBackButton=true`):
- `src/screens/main/Recruiter/LaborPool/Contractors.jsx:128-130`
- `src/screens/main/Recruiter/LaborPool/SquadReviews.jsx:163-169`
- `src/screens/main/Recruiter/LaborPool/Employees.jsx:126-128`
- `src/screens/main/Recruiter/LaborPool/YourPool.jsx:353-359`
- `src/screens/main/Recruiter/LaborPool/SquadPool.jsx:155-157`
- `src/screens/main/MyReviews.jsx` (also uses stale props — fix when doing the sweep)
- `src/screens/main/WrittenReviews.jsx` (same)

### TODOs left in marketplace (out of current scope)
- `MarketPlace.jsx:118,125,158`
- `PostProduct.jsx:167,183`
- `ProductDetails.jsx:103,112`

---

## 📋 Client items still outstanding (from the docx)

_All unblocked items completed 2026-04-28. Remaining 4 are blocked on client clarification._

1. **Modification Request flow — needs client wireframe.** `ManualOffers.jsx:186-189,322` still inline badge; client docx mentions "Scenario 2" but no UI spec; awaiting wireframe before extracting standalone page.
2. **Standalone Matches page** for Quick Fill offers — current flow `QuickSearchPreview → MatchList → CandidateProfile`. Client to confirm whether `MatchList` should be folded in or kept as inner sub-view of new Matches screen.
3. **Info icon rollout** — only 6 `<InfoTooltip>` instances. Tooltip *copy* for each location needs client doc as source of truth before mass rollout. Special case: "Contact details and chat are disabled after 1 month" must move behind info icon (docx p.98).
4. **Per-section "In Review" / "Pending Verification" badges.** `Profile.jsx:72` has a top-level status, but the trigger condition for "Pending Verification" (vs. "In Review") isn't defined; needs client clarification on the state machine.

---

## 🔍 Admin panel + backend audit (2026-04-29)

The admin panel and its backend live in a sibling repo at `/Users/qadirali/Documents/Projects/upwork/PusparajGiri/adminpanel` (backend: `squadgoo-admin-panel-backend`, frontend: `squadgoo-admin-panel-frontend`). Owned by another developer; built with AI assistance. Audited at the user's request.

**Scope clarification:** This is the admin-panel backend ONLY — it is NOT the mobile app's API backend. The mobile app's backend is separate (likely the one at `WebBackup/well-known/apis.squadgoo.com` or still pending).

**Verdict:** "Needs work but salvageable." Real Mongoose models, real socket.io, dashboard route does serious aggregation — bones are competent. But wiring is dangerous and several admin-frontend screens appear to run on `localStorage` mock stores, not the backend.

**Top issues to flag back to the other developer (priority order):**

1. **Rotate live MongoDB Atlas password + JWT secret immediately.** Plaintext in `squadgoo-admin-panel-backend/.env`. JWT_SECRET also has fallback `"squadgoo-dev-secret-change-me"` in `lib/jwt.js:4`.
2. **Admin authorization is broken — privilege escalation.** `routes/admin/appUsersAdminRoutes.js`, `routes/users.js`, `routes/badges.js`, admin half of `routes/supportChats.js` use bare `auth` middleware (jwt.verify only, no role/portal check). Same `JWT_SECRET` signs admin AND mobile-app JWTs (via `middleware/appUserAuth.js` falling back to `JWT_SECRET`). Net: any logged-in mobile user (e.g. via support chat) can call admin endpoints. Fix: split per-portal secrets OR add a required `aud`/`portal` JWT claim and reject mismatches.
3. **~3,000 lines of unmounted route files** (`operationsRoutes.js` 1018L, `ownerOperationsRoutes.js` 666L, `staffAuthRoutes.js` 346L, `chatReportsAdminRoutes.js`, `staffOwnerApprovalsRoutes.js`, `app/chatReportsPublic.js`, +3 more) AND **frontend calls endpoints that don't exist** (`/owner/live-chats`, `/owner/job-chats`, `/owner/dispute-chats`, `/owner/users/:id/profile`). Need a definitive endpoint matrix saying what's actually wired end-to-end vs. what's mock-only.
4. **Basic hardening missing:** no `helmet`, no rate-limit on login, no multer `fileFilter` (admin can upload `.html`/`.js` served from `/uploads/`), NoSQL `$regex` injection in `routes/users.js:17` and `routes/appUsers.js:36`, public unauth support-chat mutations (`/select-topic`, `/connect-human`, `/mark-solved`, `/rating`), hardcoded `admin@squadgoo.com / admin123` seed credentials, frontend dev fallback magic token `"sg-demo-admin-token"` in `Login.js:38-50`.

**Implication for Qadir's work:** None directly — mobile-app integration is not against this backend. But once the mobile-app backend appears, expect the same developer to have made similar choices, so push for a security review there too.

---

## 📂 Key conventions (for quick ramp-up)

- **Theme primitives**: `import { colors, getFontSize, hp, wp } from '@/theme'`
- **Text**: `import AppText, { Variant } from '@/core/AppText'`
- **Icons**: `import VectorIcons, { iconLibName } from '@/theme/vectorIcon'` — lib values: `Ionicons`, `Feather`, `MaterialIcons`, etc.
- **Bottom sheets**: `@/core/RbSheetComponent` — `forwardRef` with `.open()` / `.close()`
- **Inputs**: `@/core/AppInputField`
- **Screen header**: `@/core/AppHeader` for main screens (supports top icons + back button); `@/core/PoolHeader` for pool/detail screens (back + `rightComponent`)
- **Toasts**: `import { showToast, toastTypes } from '@/utilities/toastConfig'`
- **Redux role**: `useSelector(state => state?.auth?.role)` — compares lowercase `'recruiter'` / `'jobseeker'`
- **Navigation names**: `src/navigation/screenNames.js` — add new names here first
- **Screen export**: `src/screens/index.js` — import + export new screens here
- **Drawer registration**: register screens in BOTH `DrawerNavigator.js` (recruiter) AND `JobSeekerDrawer.js` (jobseeker) when shared
- **Drawer menu**: `src/core/CustomDrawer.js` — role-gated items via `getMenuItemsByRole`

---

## 🚀 Resume here

All unblocked work landed 2026-04-28. Remaining 4 items need client input first — see "Client items still outstanding" above. Once spec is in hand, recommended order:

1. **Modification Request standalone page** — once Scenario 2 wireframe arrives, extract from `ManualOffers.jsx:186-189,322` into a new screen + drawer entry.
2. **Standalone Matches page for Quick Fill** — once MatchList retention decision is in, build new screen between `QuickSearchPreview` and `CandidateProfile`.
3. **Info icon rollout** — once tooltip copy is provided, wrap helper text across Manual Fill, salary/benefits, KYC, jobseeker profile sections; relocate the "Contact details and chat are disabled after 1 month" message into the info icon.
4. **Per-section "In Review" / "Pending Verification" badges** — once state-machine is defined, add `SectionStatusBadge` to recruiter + jobseeker profile/KYC sections.

**Verify on device** — walk through Reviews (My / Written / Squad), Announcements (feed / detail / reactions / comments / report), Chat icon from every jobseeker entry point, salary restructure end-to-end, and the new KYC PDF upload option.

---

_For the full client ask list, read `doc_by_ramp/Recruiter Notes S25 Ultra 2.docx`._
