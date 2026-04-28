# SquadGoo — Work Status & Continuation Notes

_Last updated: 2026-04-22_

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

Ranked by impact. Grep targets in parentheses where useful.

1. **Industry removal — incomplete.** Client wants Industry gone globally; replaced by Job Category + Sub Category. Still present in:
   - `src/screens/main/JobSeeker/JobOfferDetails.jsx`
   - `src/screens/main/JobSeeker/DashBoard/TabScreens/WorkExperience.jsx`
   - `src/screens/main/JobSeeker/DashBoard/TabScreens/PreferredJobs.jsx`
   - `src/screens/main/JobSeeker/DashBoard/TabScreens/AddExperince/AddJobStep1.jsx`
   - `src/utilities/dummyEmployees.js`
   - `src/utilities/dummyContractors.js`
2. **Info icon pattern not systematized.** Only 2 instances (`CompletedWorkerProfile.jsx`). Client wants helper/disclaimer text hidden behind info icons everywhere: Quick Search steps, Manual Fill steps, salary/benefits, profile sections, KYC, etc.
3. **Salary & Benefits restructure.** `src/screens/main/Recruiter/ManualSearchSteps/StepThree.jsx` has flat `fixedRate` / `overtimeRate`. Client wants:
   - Salary Type dropdown (Hourly / Daily / Weekly / Annually)
   - Salary Range (From / To) with correct unit label
   - Extra Pay toggles: Public holidays, Weekend, Shift loading, Bonuses, Overtime
4. **Weekend Extra Pay conditional logic.** `StepFour.jsx:243-253` currently shows both Saturday and Sunday rate fields unconditionally; should hide / mark "Not Applicable" based on availability.
5. **"How many staff Looking For" → "Required Number of Positions"** rename — not verified in Quick Search step forms.
6. **"In Review" / "Pending Verification"** status labels for submitted profile sections — not implemented.
7. **Same-day end date** — `StepFour.jsx:62` computes `isMultiDay` but doesn't explicitly allow same-day end date per client item 11.
8. **Required Education / Faculty removal** from Update screens — not audited/done.
9. **KYC Proof of Business Address PDF upload** — not verified.
10. **Social media single-link save** without filling all fields — profile form not audited.
11. **"Freshers can also apply"** has no visual checkbox indicator — `QuickSearchPreview.jsx:679` renders as plain text.
12. **Modification Request flow** — `ManualOffers.jsx:583` shows badge + inline; client wants a separate page treatment (Scenario 2).
13. **Standalone Matches page** for Quick Fill offers — not present; candidates only accessible via MatchList → CandidateProfile.

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

Recommended order when picking this back up:

1. **Quick hygiene pass (~30 min)** — low risk, high signal:
   - Remove `AppInputField.js:41` console.log
   - Strip stale `PoolHeader` props from the 7 flagged screens
   - Add visual checkbox to "Freshers can also apply" in `QuickSearchPreview.jsx:679`

2. **Industry removal sweep (~2 hours)** — grep-driven, surgical:
   ```
   grep -rn "Industry\|industry\b" src/
   ```
   Replace with Job Category + Sub Category where it's a form/select; delete where it's just a display. Update `dummyEmployees.js` / `dummyContractors.js` shapes accordingly.

3. **Info icon rollout (~half day)** — wrap helper text in `InfoTooltip` across Quick Search, Manual Fill, salary/benefits, profile sections.

4. **Salary & Benefits restructure (~1 day)** — `StepThree.jsx` form model + validation + preview rendering. Check `StepFour.jsx` weekend logic as part of the same pass.

5. **Verify on device** — walk through Reviews (My / Written / Squad), Announcements (feed / detail / reactions / comments / report), Chat icon from every jobseeker entry point.

---

_For the full client ask list, read `doc_by_ramp/Recruiter Notes S25 Ultra 2.docx`._
