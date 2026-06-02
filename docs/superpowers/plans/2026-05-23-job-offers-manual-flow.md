# Job Offers — Manual Flow (Phase 2a) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a recruiter post a manual-search job, see filter-matched jobseeker candidates, and send an offer; let a jobseeker receive, accept, or decline that offer — all against the real backend, replacing the current dummy data.

**Architecture:** The UI is **client-approved and frozen** — the backend and the mobile API layer conform to exactly what the existing screens produce/consume; we wire screens (dummy → hook) without changing their layout, fields, flow, or field names. Any naming difference is bridged in the `*.api.js` mapping layer, never by editing a screen. Add a backend `Job` model (one model, `searchType: manual|quick`) that stores the FULL set of fields the approved job-creation wizard collects (plus a flexible `meta` for flow-specific extras). Extend the existing minimal `Offer` model with a `jobId` link and the fields the UI shows. Jobseeker matchable data is stored in a separate `JobseekerPreference` collection — one document per "preferred job" profile, matching the approved PreferredJobs UI which does add/edit/delete of multiple profiles. Matching mirrors the app's existing `computeMatchScore` weighting (base 45 + industry 20 + title 10 + tax 10 + location 5 + salary 5 + experience 5 + jitter, clamp 40–100) so `matchPercentage` behaves as the UI already expects — filter-based, no geolocation yet. NO money movement in this phase — the Offer is escrow-ready so `EscrowLedger`/`WalletTransaction` plug in during Phase 3. Mobile follows the per-feature `*.api.js` / `*.query.js` convention (see `mobile/CLAUDE.md`).

**Tech Stack:** Backend — Node/Express, Mongoose, express-validator, JWT via `appUserAuth`. Mobile — React Native (JavaScript), TanStack Query, Redux Toolkit, Axios.

**Scope (locked decisions):**
- ✅ **UI is client-approved and FROZEN.** Do not change any screen's layout, fields, copy, navigation, or flow. Screens are only wired from dummy → real hooks. Field-name mismatches are mapped in `*.api.js`, never by editing screens.
- ✅ Backend conforms to the UI's data shapes (capture the full job/preference/offer field set the screens already use).
- ✅ Add `Job` model (full UI field set + `meta`); `Offer` references `jobId`.
- ✅ Jobseeker preferences = separate `JobseekerPreference` collection (one doc per preferred-job profile), matching the PreferredJobs add/edit/delete UI.
- ✅ Manual flow end-to-end first; Quick-search auto-matching is Phase 2b (out of scope here).
- ✅ Defer all money to Phase 3 (escrow-ready design, no financial movement).
- ✅ Matching mirrors the app's `computeMatchScore` weights; filter-based, defer true distance-radius (no lat/lng).

**Out of scope (do NOT build here):** quick-search auto-matching, escrow/wallet/match-fee, offer "modification request" negotiation, work sessions/timer, ratings recalculation, push notifications, admin-panel job/offer management.

---

## Testing approach (read before starting)

These two repos have **no automated test harness** (mobile has only ESLint; backend has only `start: node index.js`). This plan does **not** fabricate a jest/supertest setup — adding one is a separate decision. Instead, each backend task is verified with a **`curl` smoke test** against a locally running server, and each mobile task with **ESLint + a described manual check**. Where a step says "verify", run the given command and confirm the described output before moving on (per superpowers:verification-before-completion — evidence before claiming done).

**Backend local run prerequisites** (one-time, before backend tasks):
- A running MongoDB and `MONGODB_URI` set in the backend `.env`.
- Start the server: `cd squadgoo-admin-panel-backend && node index.js` (leave running in a second terminal).
- Obtain a recruiter token and a jobseeker token by registering + logging in via the existing endpoints. Save them as shell vars:
  ```bash
  REC_TOKEN=...   # from POST /api/mobile-app/auth/login as a recruiter
  JS_TOKEN=...    # from POST /api/mobile-app/auth/login as a jobseeker
  BASE=http://localhost:5000/api/mobile-app
  ```

---

## File Structure

**Backend (`squadgoo-admin-panel-backend/`):**
- Create `models/Job.js` — recruiter job posting (manual|quick) holding the FULL approved-UI field set + a flexible `meta` for flow-specific extras (extraPayRates, availability object, squad/wallet flags, etc.).
- Modify `models/Offer.js` — add `jobId`, `payRate`, `message`, `expiresAt`, `declineReason`; add `expired`/`withdrawn` to the status enum. (Additive only — admin dashboard aggregations keep working.)
- Create `models/JobseekerPreference.js` — one document per "preferred job" profile (mirrors the approved PreferredJobs UI shape: preferredJobTitle{category,subCategory}, expectedPayMin/Max, receiveWithinKm, manualOffers/quickOffers, daysAvailable, startTime/endTime, taxType). `appUserId` ref + indexed.
- Create `routes/mobileJobs.js` — recruiter job + matching + offer endpoints, and jobseeker offer-action endpoints. Mounted under `/api/mobile-app`.
- Create `routes/mobileJobseekerPreferences.js` — CRUD for preferred-job profiles (`POST/GET/PUT/DELETE /jobseeker/preferences`) — what matching matches against; replaces the dead `/app/JobSeeker/updatePreferences` call.
- Modify `routes/mobileApp.js` — mount the two new routers.

**Mobile (`mobile/`):**
- Create `src/api/jobs/jobs.api.js` + `src/api/jobs/jobs.query.js` — recruiter job endpoints + hooks.
- Create `src/api/offers/offers.api.js` + `src/api/offers/offers.query.js` — offer endpoints + hooks (recruiter send/withdraw/list, jobseeker received/accept/decline).
- Modify `src/api/jobSeeker/jobSeeker.api.js` — repoint the dead `/app/JobSeeker/*` paths to the new `/jobseeker/*` endpoints.
- Wire screens (swap dummy → hooks), per the established pattern in `docs/INTEGRATION_STATUS.md`:
  - Recruiter create-manual-job: `src/screens/main/Recruiter/ManualSearchSteps/StepTwo.jsx`, `StepThree.jsx`, `StepFour.jsx`, `src/screens/main/Recruiter/HomeTabs/JobPreview.jsx`.
  - Recruiter candidate pool: `src/screens/main/Recruiter/ManualSearchSteps/ManualMatchList.jsx`, `ManualCandidateProfile.jsx`.
  - Recruiter send offer: `src/screens/main/Recruiter/Offers/SendOffer.jsx`.
  - Recruiter job/offer lists: `src/screens/main/Recruiter/HomeTabs/ActiveJobOffers.jsx`, `DraftedOffers.jsx`, `CompletedOffers.jsx`, `ExpiredOffers.jsx`.
  - Jobseeker offers: `src/screens/main/JobSeeker/ManualSearch/ManualOffers.jsx`, `src/screens/main/JobSeeker/JobOfferDetails.jsx`.

---

## API Contract (the shared interface — build backend to this, wire mobile to this)

All under `/api/mobile-app`. Auth: `Authorization: Bearer <token>` (`appUserAuth`). Success: `{ ok: true, ... }`. Error: `{ error: { code, message } }`.

> **UI-frozen contract rule:** the backend accepts and returns the field names the approved screens already use. The job-creation wizard collects a large field set (see "Job field inventory" below); the backend stores all of it — known columns explicitly, everything else under `meta` — so the screens need zero field renames. The mobile `*.api.js` layer is the only place any mapping happens.

**Recruiter (recruiter token):**
- `POST /jobs` — create a job. Body = the wizard's full payload. KNOWN columns: `{ searchType, title, type/employmentType, jobCategory, jobSubCategory, location, state, postcode, rangeKm, staffNumber, salaryMin, salaryMax, salaryType, taxType, experience (string) | experienceYear+experienceMonth, jobDescription, requiredUniforms, rolesAndResponsibilities, extraPay{}, extraPayRates{}, freshersCanApply, preferredLanguages[], extraQualification, jobStartDate, jobEndDate, jobStartTime, jobEndTime, availability{day:{enabled,from,to}}, jobReferenceId, interestedInSquadPairs, status:"draft"|"posted" }`. Any field not in the schema is preserved under `meta`. → `{ ok, job }`.
- `GET /jobs?status=&page=&limit=` — recruiter's own jobs, paginated → `{ ok, jobs, pagination }`.
- `GET /jobs/:id` → `{ ok, job }`.
- `PUT /jobs/:id` — edit (draft only) → `{ ok, job }`.
- `POST /jobs/:id/publish` — `draft` → `posted` → `{ ok, job }`.
- `GET /jobs/:id/candidates?page=&limit=` — matched jobseekers with `matchPercentage` (mirrors `computeMatchScore`) → `{ ok, candidates, pagination }`. Candidate shape matches the approved candidate-card fields: `{ id, name, avatar, badge, isVerified, acceptanceRating, matchPercentage, location, suburb, radiusKm, taxTypes[], languages[], industries[], preferredRoles[], experienceYears, payPreference{min,max} }` (fields with no backend source yet are returned null/empty — see deferred ledger).
- `POST /offers` — Body: `{ jobId, jobseekerId, payRate, message, expiresInHours }` → `{ ok, offer }`.
- `GET /offers?status=&page=&limit=` — offers the recruiter sent → `{ ok, offers, pagination }`.
- `POST /offers/:id/withdraw` → `{ ok, offer }`.

**Jobseeker (jobseeker token):**
- `GET /offers/received?status=&page=&limit=` → `{ ok, offers, pagination }`.
- `POST /offers/:id/accept` → `{ ok, offer }`.
- `POST /offers/:id/decline` — Body: `{ reason }` → `{ ok, offer }`. (UI requires a reason when `matchPercentage ≥ 70`; backend stores whatever reason it gets and does not reject when absent — the rule stays enforced in the approved UI.)
- `GET /jobseeker/preferences` — list my preferred-job profiles → `{ ok, preferences }`.
- `POST /jobseeker/preferences` — create one profile (the AddJobStep1+2 payload) → `{ ok, preference }`.
- `PUT /jobseeker/preferences/:id` — edit a profile → `{ ok, preference }`.
- `DELETE /jobseeker/preferences/:id` → `{ ok }`.

**Status mapping (mobile ↔ backend Offer.status):** mobile `pending` ⇒ backend `sent`; `accepted`⇒`accepted`; `declined`⇒`declined`; `expired`⇒`expired`; `withdrawn`⇒`withdrawn`. The mobile api layer maps `sent`→`pending` on read so the approved screens get the status string they already render. Mobile `modification_requested` is Phase 2b (ignore in v1).

### Job field inventory (the approved wizard — backend must accept all of it)
Common: `title/jobTitle, type/jobType, jobCategory, jobSubCategory, location/workLocation, rangeKm, salaryMin/Max, salaryType, taxType (ABN/TFN/ANY), extraPay{publicHolidays,weekend,shiftLoading,bonuses,overtime}, freshersCanApply, preferredLanguages, status, searchType, jobReferenceId, jobStartDate, jobEndDate, availability{day:{enabled,from,to}}`. Manual-only: `staffNumber, experience ("X Years Y Months"), extraPayRates{}, extraQualification, jobStart/EndTime, jobDescription, requiredUniforms, interestedInSquadPairs`. Quick-only (Phase 2b but model now): `staffCount, experienceYear+experienceMonth, rolesAndResponsibilities, fixedRate, overtimeEnabled/Rate, paidThroughWallet, hireSquadPairs, weekendSat/SunExtraPay+Rate`. Note the aliases (title/jobTitle, location/workLocation, staffNumber/staffCount) — the backend picks canonical names and the `*.api.js` layer maps; screens are untouched.

---

## PHASE A — Backend foundation (models)

### Task A1: Job model

**Files:**
- Create: `squadgoo-admin-panel-backend/models/Job.js`

- [ ] **Step 1: Write the model**

```javascript
const mongoose = require("mongoose");

const ExtraPaySchema = new mongoose.Schema(
  {
    publicHolidays: { type: Boolean, default: false },
    weekend: { type: Boolean, default: false },
    shiftLoading: { type: Boolean, default: false },
    bonuses: { type: Boolean, default: false },
    overtime: { type: Boolean, default: false },
  },
  { _id: false }
);

/**
 * A recruiter-posted job. One model serves both flows via `searchType`.
 * Holds the FULL field set the client-approved job-creation wizard collects.
 * Anything not given an explicit column is preserved under `meta` so the
 * frozen UI never needs a field rename. Offers reference this via `jobId`.
 *
 * Field-name policy: the UI uses some aliases (title/jobTitle, location/workLocation,
 * staffNumber/staffCount). Backend canonical names are the LEFT side; the mobile
 * *.api.js layer maps the alias on the way in/out. Strings are stored loosely
 * (taxType "ABN"/"TFN"/"ANY", salaryType free text) to match exactly what the UI sends.
 */
const JobSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "AppUser", required: true, index: true },
    searchType: { type: String, enum: ["manual", "quick"], default: "manual", index: true },
    jobReferenceId: { type: String, trim: true, index: true },

    title: { type: String, required: true, trim: true },
    type: { type: String, trim: true }, // employment type as the UI sends it (Casual/Full-time/…)
    jobCategory: { type: String, trim: true, index: true },
    jobSubCategory: { type: String, trim: true },
    industry: { type: String, trim: true, index: true }, // derived from jobCategory when absent

    location: { type: String, trim: true },
    state: { type: String, trim: true },
    postcode: { type: String, trim: true },
    rangeKm: { type: Number, default: 0 },

    staffNumber: { type: Number, default: 1 }, // staffCount maps here for quick jobs

    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryType: { type: String, trim: true }, // free text to match UI ("Hourly Rate", "Per job", …)
    taxType: { type: String, trim: true }, // "ABN" | "TFN" | "ANY" (as UI sends)

    // Manual sends an "X Years Y Months" string; quick sends year+month parts. Store both.
    experience: { type: String, trim: true },
    experienceYear: { type: String, trim: true },
    experienceMonth: { type: String, trim: true },
    freshersCanApply: { type: Boolean, default: true },

    jobDescription: { type: String, trim: true },
    rolesAndResponsibilities: { type: String, trim: true },
    requiredUniforms: { type: String, trim: true },
    extraQualification: { type: mongoose.Schema.Types.Mixed }, // UI sends string or array of items
    preferredLanguages: { type: [String], default: [] },

    extraPay: { type: ExtraPaySchema, default: () => ({}) },
    extraPayRates: { type: mongoose.Schema.Types.Mixed, default: {} }, // {publicHolidays:Number,…}

    jobStartDate: { type: String, trim: true },
    jobEndDate: { type: String, trim: true },
    jobStartTime: { type: String, trim: true },
    jobEndTime: { type: String, trim: true },
    availability: { type: mongoose.Schema.Types.Mixed, default: {} }, // {Monday:{enabled,from,to},…}

    interestedInSquadPairs: { type: Boolean, default: false },

    // Catch-all for any other approved-UI field (quick-only flags, future additions) so
    // the frozen screens can round-trip data we don't yet have a dedicated column for.
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },

    status: {
      type: String,
      enum: ["draft", "posted", "has_applicants", "matched", "in_progress", "completed", "expired"],
      default: "draft",
      index: true,
    },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

JobSchema.index({ recruiterId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Job", JobSchema);
```

> NOTE: `taxType`/`salaryType` are stored as free strings (not enums) deliberately — the approved UI emits "ABN"/"TFN"/"ANY" and free-text salary types, and we must accept exactly what it sends without forcing a rename. The job-create route (Task C1) whitelists these columns and dumps any unrecognized body keys into `meta`.

- [ ] **Step 2: Verify it loads**

Run: `cd squadgoo-admin-panel-backend && node -c models/Job.js && node -e "require('./models/Job'); console.log('Job model OK')"`
Expected: prints `Job model OK` with no errors.

- [ ] **Step 3: Commit**

```bash
git add models/Job.js
git commit -m "feat(jobs): add Job model for recruiter postings"
```

---

### Task A2: Extend Offer model

**Files:**
- Modify: `squadgoo-admin-panel-backend/models/Offer.js`

- [ ] **Step 1: Add fields + statuses (additive)**

In the Offer schema, add these fields alongside the existing ones:

```javascript
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", index: true, default: null },
    payRate: { type: String, trim: true },
    message: { type: String, trim: true },
    expiresAt: { type: Date },
    declineReason: { type: String, trim: true },
    sentAt: { type: Date, default: null },
    declinedAt: { type: Date, default: null },
    withdrawnAt: { type: Date, default: null },
```

In the `status` enum, add `"expired"` and `"withdrawn"` (keep all existing values):

```javascript
    status: {
      type: String,
      enum: ["created", "sent", "accepted", "declined", "cancelled", "arrived", "completed", "no_show", "expired", "withdrawn"],
      default: "created",
      index: true,
    },
```

Add an index for jobseeker offer queries near the existing indexes:

```javascript
OfferSchema.index({ jobseekerId: 1, status: 1, createdAt: -1 });
OfferSchema.index({ jobId: 1, status: 1 });
```

Update the exported `OFFER_STATUSES` array to include the two new values if that array is hand-maintained.

- [ ] **Step 2: Verify it loads**

Run: `node -c models/Offer.js && node -e "const O=require('./models/Offer'); console.log('Offer OK');"`
Expected: prints `Offer OK`.

- [ ] **Step 3: Commit**

```bash
git add models/Offer.js
git commit -m "feat(offers): link Offer to Job and add expired/withdrawn statuses"
```

---

### Task A3: JobseekerPreference model (one doc per preferred-job profile)

The approved PreferredJobs UI lets a jobseeker add/edit/delete MULTIPLE preference profiles, each with its own category/pay/radius/availability. So preferences are their own collection (not a single subdoc), matching the UI's per-item CRUD with stable ids. Matching scans these profiles. Field names mirror the UI's `preferredJobs[]` shape exactly.

**Files:**
- Create: `squadgoo-admin-panel-backend/models/JobseekerPreference.js`

- [ ] **Step 1: Write the model**

```javascript
const mongoose = require("mongoose");

/**
 * One "preferred job" profile for a jobseeker (the approved PreferredJobs UI).
 * A jobseeker may have several. Matching (Task C2) scans these to score candidates.
 * Field names mirror the UI's preferredJobs[] objects exactly so screens are untouched.
 */
const JobseekerPreferenceSchema = new mongoose.Schema(
  {
    appUserId: { type: mongoose.Schema.Types.ObjectId, ref: "AppUser", required: true, index: true },

    // UI sends preferredJobTitle as { category, subCategory } (or a string). Store as given.
    preferredJobTitle: { type: mongoose.Schema.Types.Mixed },
    preferredIndustry: { type: mongoose.Schema.Types.Mixed }, // { id, title } when present

    expectedPayMin: { type: Number },
    expectedPayMax: { type: Number },
    receiveWithinKm: { type: String, trim: true }, // UI stores as string

    manualOffers: { type: Boolean, default: true },
    quickOffers: { type: Boolean, default: true },

    daysAvailable: { type: String, trim: true }, // "Monday,Tuesday,..."
    startTime: { type: String, trim: true }, // "HH:MM"
    endTime: { type: String, trim: true },

    taxType: { type: String, trim: true }, // "ABN" | "TFN" | "both" (as UI sends)
    jobType: { type: String, trim: true },
    totalExperience: { type: String, trim: true },

    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

JobseekerPreferenceSchema.index({ appUserId: 1, createdAt: -1 });

module.exports = mongoose.model("JobseekerPreference", JobseekerPreferenceSchema);
```

- [ ] **Step 2: Verify it loads**

Run: `node -c models/JobseekerPreference.js && node -e "require('./models/JobseekerPreference'); console.log('JobseekerPreference OK')"`
Expected: prints `JobseekerPreference OK`.

- [ ] **Step 3: Commit**

```bash
git add models/JobseekerPreference.js
git commit -m "feat(jobseeker): JobseekerPreference model mirroring approved PreferredJobs UI"
```

---

## PHASE B — Backend jobseeker preferences CRUD (matching data)

### Task B1: jobseeker preferences CRUD endpoints

Mirrors the approved PreferredJobs UI (add / list / edit / delete preferred-job profiles). The mobile `addJobPreferences` currently posts ONE profile to a dead path; this gives it (and the list/edit/delete the UI already does) a live home.

**Files:**
- Create: `squadgoo-admin-panel-backend/routes/mobileJobseekerPreferences.js`
- Modify: `squadgoo-admin-panel-backend/routes/mobileApp.js`

- [ ] **Step 1: Create the router**

```javascript
const express = require("express");
const JobseekerPreference = require("../models/JobseekerPreference");
const appUserAuth = require("../middleware/appUserAuth");

const router = express.Router();

// Fields accepted from the approved AddJobStep1+2 payload (everything else → meta).
const PREF_FIELDS = [
  "preferredJobTitle", "preferredIndustry", "expectedPayMin", "expectedPayMax",
  "receiveWithinKm", "manualOffers", "quickOffers", "daysAvailable",
  "startTime", "endTime", "taxType", "jobType", "totalExperience",
];

function pickPrefFields(body) {
  const out = {};
  const meta = {};
  for (const [k, v] of Object.entries(body || {})) {
    if (k === "id" || k === "_id" || k === "appUserId" || k === "createdAt") continue;
    if (PREF_FIELDS.includes(k)) out[k] = v;
    else meta[k] = v;
  }
  if (Object.keys(meta).length) out.meta = meta;
  return out;
}

// GET /api/mobile-app/jobseeker/preferences — my preferred-job profiles.
router.get("/jobseeker/preferences", appUserAuth, async (req, res) => {
  try {
    const preferences = await JobseekerPreference.find({ appUserId: req.appUser.id }).sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, preferences });
  } catch (e) {
    console.error("GET /jobseeker/preferences error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// POST /api/mobile-app/jobseeker/preferences — create one profile.
router.post("/jobseeker/preferences", appUserAuth, async (req, res) => {
  try {
    const preference = await JobseekerPreference.create({ ...pickPrefFields(req.body), appUserId: req.appUser.id });
    return res.status(201).json({ ok: true, preference });
  } catch (e) {
    console.error("POST /jobseeker/preferences error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// PUT /api/mobile-app/jobseeker/preferences/:id — edit a profile.
router.put("/jobseeker/preferences/:id", appUserAuth, async (req, res) => {
  try {
    const preference = await JobseekerPreference.findOneAndUpdate(
      { _id: req.params.id, appUserId: req.appUser.id },
      { $set: pickPrefFields(req.body) },
      { new: true }
    );
    if (!preference) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Preference not found" } });
    return res.json({ ok: true, preference });
  } catch (e) {
    console.error("PUT /jobseeker/preferences/:id error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// DELETE /api/mobile-app/jobseeker/preferences/:id
router.delete("/jobseeker/preferences/:id", appUserAuth, async (req, res) => {
  try {
    const result = await JobseekerPreference.deleteOne({ _id: req.params.id, appUserId: req.appUser.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Preference not found" } });
    return res.json({ ok: true });
  } catch (e) {
    console.error("DELETE /jobseeker/preferences/:id error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

module.exports = router;
```

- [ ] **Step 2: Mount the router**

In `routes/mobileApp.js`, after `router.use("/", mobileAuthRoutes);` add:

```javascript
const mobileJobseekerPreferencesRoutes = require("./mobileJobseekerPreferences");
router.use("/", mobileJobseekerPreferencesRoutes);
```

- [ ] **Step 3: Verify load + curl CRUD**

Run: `node -e "require('./routes/mobileApp'); console.log('routes load OK')"` → expect `routes load OK`.

With server running and `$JS_TOKEN`:
```bash
curl -s -X POST "$BASE/jobseeker/preferences" -H "Authorization: Bearer $JS_TOKEN" -H "Content-Type: application/json" \
  -d '{"preferredJobTitle":{"category":"Construction","subCategory":"Painter"},"expectedPayMin":25,"expectedPayMax":35,"receiveWithinKm":"50","taxType":"ABN","manualOffers":true,"quickOffers":true,"daysAvailable":"Monday,Tuesday","startTime":"08:00","endTime":"17:00"}'
curl -s "$BASE/jobseeker/preferences" -H "Authorization: Bearer $JS_TOKEN"
```
Expected: POST → `{ ok:true, preference:{ _id, preferredJobTitle:{category:"Construction",…}, … } }` (save `_id` as `PREF_ID`); GET lists it. Then PUT `$BASE/jobseeker/preferences/$PREF_ID` updates it; DELETE removes it.

- [ ] **Step 4: Commit**

```bash
git add routes/mobileJobseekerPreferences.js routes/mobileApp.js
git commit -m "feat(jobseeker): preferred-job profiles CRUD via /jobseeker/preferences"
```

---

## PHASE C — Backend jobs, matching, offers

### Task C1: Recruiter job CRUD

**Files:**
- Create: `squadgoo-admin-panel-backend/routes/mobileJobs.js`
- Modify: `squadgoo-admin-panel-backend/routes/mobileApp.js`

- [ ] **Step 1: Create the router with job create/list/get/update/publish**

```javascript
const express = require("express");
const { body, validationResult } = require("express-validator");
const Job = require("../models/Job");
const Offer = require("../models/Offer");
const AppUser = require("../models/AppUser");
const appUserAuth = require("../middleware/appUserAuth");

const router = express.Router();

function validationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", details: errors.array() } });
    return true;
  }
  return false;
}

function requireRecruiter(req, res) {
  if (req.appUser.userType !== "recruiter") {
    res.status(403).json({ error: { code: "FORBIDDEN", message: "Recruiter account required" } });
    return true;
  }
  return false;
}

// Columns the Job schema (Task A1) knows. Aliases the approved UI uses are normalized
// to the canonical column. Anything not listed is preserved under `meta` so the frozen
// screens round-trip every field they send.
const JOB_FIELDS = [
  "searchType", "jobReferenceId", "title", "type", "jobCategory", "jobSubCategory", "industry",
  "location", "state", "postcode", "rangeKm", "staffNumber", "salaryMin", "salaryMax", "salaryType",
  "taxType", "experience", "experienceYear", "experienceMonth", "freshersCanApply", "jobDescription",
  "rolesAndResponsibilities", "requiredUniforms", "extraQualification", "preferredLanguages",
  "extraPay", "extraPayRates", "jobStartDate", "jobEndDate", "jobStartTime", "jobEndTime",
  "availability", "interestedInSquadPairs",
];

// UI aliases → canonical column.
const JOB_ALIASES = { jobTitle: "title", jobType: "type", workLocation: "location", staffCount: "staffNumber" };

function pickJobFields(body) {
  const out = {};
  const meta = {};
  for (const [rawKey, value] of Object.entries(body || {})) {
    if (value === undefined) continue;
    if (["status", "id", "_id", "recruiterId", "createdAt"].includes(rawKey)) continue;
    const key = JOB_ALIASES[rawKey] || rawKey;
    if (JOB_FIELDS.includes(key)) {
      // Don't let a blank alias clobber a real canonical value already set.
      if (out[key] === undefined) out[key] = value;
    } else {
      meta[rawKey] = value;
    }
  }
  if (Object.keys(meta).length) out.meta = meta;
  // Derive industry from jobCategory when the UI didn't send a separate industry.
  if (out.industry === undefined && out.jobCategory !== undefined) out.industry = out.jobCategory;
  return out;
}

// POST /api/mobile-app/jobs
router.post(
  "/jobs",
  appUserAuth,
  [body("title").trim().notEmpty().withMessage("Job title is required")],
  async (req, res) => {
    if (requireRecruiter(req, res)) return;
    if (validationErrors(req, res)) return;
    try {
      const data = pickJobFields(req.body);
      data.recruiterId = req.appUser.id;
      data.searchType = "manual";
      data.status = req.body.status === "posted" ? "posted" : "draft";
      const job = await Job.create(data);
      return res.status(201).json({ ok: true, job });
    } catch (e) {
      console.error("POST /jobs error:", e);
      return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
    }
  }
);

// GET /api/mobile-app/jobs?status=&page=&limit=
router.get("/jobs", appUserAuth, async (req, res) => {
  if (requireRecruiter(req, res)) return;
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const query = { recruiterId: req.appUser.id };
    if (req.query.status) query.status = req.query.status;
    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Job.countDocuments(query),
    ]);
    return res.json({ ok: true, jobs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (e) {
    console.error("GET /jobs error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// GET /api/mobile-app/jobs/:id
router.get("/jobs/:id", appUserAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found" } });
    return res.json({ ok: true, job });
  } catch (e) {
    console.error("GET /jobs/:id error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// PUT /api/mobile-app/jobs/:id  (draft only)
router.put("/jobs/:id", appUserAuth, async (req, res) => {
  if (requireRecruiter(req, res)) return;
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.appUser.id });
    if (!job) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found" } });
    if (job.status !== "draft") return res.status(409).json({ error: { code: "NOT_EDITABLE", message: "Only draft jobs can be edited" } });
    Object.assign(job, pickJobFields(req.body));
    await job.save();
    return res.json({ ok: true, job });
  } catch (e) {
    console.error("PUT /jobs/:id error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// POST /api/mobile-app/jobs/:id/publish
router.post("/jobs/:id/publish", appUserAuth, async (req, res) => {
  if (requireRecruiter(req, res)) return;
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.appUser.id });
    if (!job) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found" } });
    if (job.status === "draft") { job.status = "posted"; await job.save(); }
    return res.json({ ok: true, job });
  } catch (e) {
    console.error("POST /jobs/:id/publish error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

module.exports = router;
```

- [ ] **Step 2: Mount it**

In `routes/mobileApp.js`, after the jobseeker-profile mount add:

```javascript
const mobileJobsRoutes = require("./mobileJobs");
router.use("/", mobileJobsRoutes);
```

- [ ] **Step 3: Verify load + curl create/list**

Run: `node -e "require('./routes/mobileApp'); console.log('routes load OK')"` → expect `routes load OK`.

With server running and `$REC_TOKEN`:
```bash
curl -s -X POST "$BASE/jobs" -H "Authorization: Bearer $REC_TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Painter","industry":"Construction","state":"NSW","postcode":"2000","taxType":"abn","salaryMin":25,"salaryMax":35,"status":"posted"}'
curl -s "$BASE/jobs?status=posted" -H "Authorization: Bearer $REC_TOKEN"
```
Expected: first returns `{ ok:true, job:{ _id, status:"posted", ... } }`; second returns `{ ok:true, jobs:[...], pagination:{...} }` containing that job. Save the job `_id` as `JOB_ID`.

- [ ] **Step 4: Commit**

```bash
git add routes/mobileJobs.js routes/mobileApp.js
git commit -m "feat(jobs): recruiter job create/list/get/update/publish endpoints"
```

---

### Task C2: Candidate matching endpoint

**Files:**
- Modify: `squadgoo-admin-panel-backend/routes/mobileJobs.js`

- [ ] **Step 1: Add a scoring helper + the candidates route**

Add near the top of `mobileJobs.js` (after `pickJobFields`):

```javascript
const JobseekerPreference = require("../models/JobseekerPreference");

// Read the category string from a preferredJobTitle that may be a string or { category, subCategory }.
function prefCategory(pref) {
  const t = pref.preferredJobTitle;
  if (!t) return null;
  return typeof t === "string" ? t : (t.category || null);
}
function eqi(a, b) { return a && b && String(a).toLowerCase() === String(b).toLowerCase(); }

// Score ONE preferred-job profile against a job. Mirrors the app's computeMatchScore
// weighting so matchPercentage behaves as the approved UI already expects:
// base 45 + category/industry 20 + role/title 10 + tax 10 + location-in-state 5 + salary overlap 5
// + experience 5 + small deterministic jitter, clamped 40–100.
function scorePreference(job, pref, user) {
  let score = 45;
  const jobCat = job.jobCategory || job.industry;
  if (jobCat && eqi(jobCat, prefCategory(pref))) score += 20;
  const jobRole = job.jobSubCategory || job.role || job.title;
  const prefSub = typeof pref.preferredJobTitle === "object" ? pref.preferredJobTitle?.subCategory : null;
  if (jobRole && prefSub && eqi(jobRole, prefSub)) score += 10;
  const jt = (job.taxType || "").toLowerCase();
  const pt = (pref.taxType || "").toLowerCase();
  if (!jt || jt === "any" || !pt || pt === "both" || pt === jt) score += 10;
  if (!job.state || !user.state || eqi(job.state, user.state)) score += 5;
  const pMin = pref.expectedPayMin;
  if (pMin == null || job.salaryMax == null || pMin <= job.salaryMax) score += 5;
  score += 5; // experience placeholder (no structured candidate experienceYears yet — see deferred ledger)
  // Deterministic 0–4 jitter so equal scores get stable ordering (matches the app's "random variation").
  const jitter = Math.abs((String(user._id).charCodeAt(0) || 0)) % 5;
  return Math.max(40, Math.min(100, Math.round(score + jitter)));
}
```

Then add the route (before `module.exports`):

```javascript
// GET /api/mobile-app/jobs/:id/candidates?page=&limit=
// Scans jobseekers' preferred-job profiles; a candidate's matchPercentage is the best score
// across their profiles. Only profiles open to manual offers are considered (manualOffers !== false).
router.get("/jobs/:id/candidates", appUserAuth, async (req, res) => {
  if (requireRecruiter(req, res)) return;
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.appUser.id }).lean();
    if (!job) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found" } });

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    // All preferences open to manual offers, with their owner.
    const prefs = await JobseekerPreference.find({ manualOffers: { $ne: false } }).lean();
    const userIds = [...new Set(prefs.map((p) => String(p.appUserId)))];
    const users = await AppUser.find({ _id: { $in: userIds }, status: "active", userType: { $in: ["jobseeker", "individual"] } }).lean();
    const usersById = Object.fromEntries(users.map((u) => [String(u._id), u]));

    // Best score per candidate across their preference profiles.
    const bestByUser = {};
    for (const pref of prefs) {
      const u = usersById[String(pref.appUserId)];
      if (!u) continue;
      const s = scorePreference(job, pref, u);
      if (!bestByUser[String(u._id)] || s > bestByUser[String(u._id)].matchPercentage) {
        bestByUser[String(u._id)] = {
          id: u._id,
          name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
          avatar: u.profilePhoto || null,
          state: u.state || null,
          suburb: u.city || null,
          radiusKm: pref.receiveWithinKm || null,
          taxTypes: pref.taxType ? [pref.taxType] : [],
          industries: [prefCategory(pref)].filter(Boolean),
          preferredRoles: (typeof pref.preferredJobTitle === "object" && pref.preferredJobTitle?.subCategory) ? [pref.preferredJobTitle.subCategory] : [],
          payPreference: { min: pref.expectedPayMin ?? null, max: pref.expectedPayMax ?? null },
          // Fields the approved card shows but we have no backend source for yet → safe defaults.
          languages: [],
          experienceYears: 0,
          badge: null,
          isVerified: u.kycStatus === "verified",
          acceptanceRating: null,
          matchPercentage: s,
        };
      }
    }

    const scored = Object.values(bestByUser).sort((a, b) => b.matchPercentage - a.matchPercentage);
    const total = scored.length;
    const candidates = scored.slice((page - 1) * limit, (page - 1) * limit + limit);
    return res.json({ ok: true, candidates, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (e) {
    console.error("GET /jobs/:id/candidates error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});
```

> NOTE: matching is preference-driven — only jobseekers who created a preferred-job profile (and left it open to manual offers) are candidates. `acceptanceRating`, `languages`, structured `experienceYears`, and `badge` are returned null/empty because no backend source exists for them yet (ratings = Social phase; skills/languages/experience persistence is unwired in the approved UI too — see deferred ledger). The approved candidate card already tolerates missing values.

- [ ] **Step 2: Verify load + curl**

Run: `node -e "require('./routes/mobileJobs'); console.log('OK')"` → expect `OK`.

With server running (the `$JS_TOKEN` jobseeker created a preference with category `Construction` in Task B1, and the `$JOB_ID` job's `jobCategory` is `Construction`):
```bash
curl -s "$BASE/jobs/$JOB_ID/candidates" -H "Authorization: Bearer $REC_TOKEN"
```
Expected: `{ ok:true, candidates:[ { id, name, matchPercentage, payPreference, ... } ], pagination:{...} }` — the jobseeker appears with a `matchPercentage` (e.g. 70–100).

- [ ] **Step 3: Commit**

```bash
git add routes/mobileJobs.js
git commit -m "feat(jobs): filter+score candidate matching endpoint"
```

---

### Task C3: Offer send / list / withdraw (recruiter)

**Files:**
- Modify: `squadgoo-admin-panel-backend/routes/mobileJobs.js`

- [ ] **Step 1: Add the recruiter offer routes**

Add a lazy-expiry helper near the scoring helper:

```javascript
// Lazily mark a sent offer expired if past its expiry. Returns the (possibly updated) doc.
async function applyExpiry(offer) {
  if (offer && offer.status === "sent" && offer.expiresAt && offer.expiresAt.getTime() < Date.now()) {
    offer.status = "expired";
    await offer.save();
  }
  return offer;
}
```

Add the routes (before `module.exports`):

```javascript
// POST /api/mobile-app/offers  (recruiter sends an offer to a jobseeker for a job)
router.post(
  "/offers",
  appUserAuth,
  [
    body("jobId").trim().notEmpty(),
    body("jobseekerId").trim().notEmpty(),
  ],
  async (req, res) => {
    if (requireRecruiter(req, res)) return;
    if (validationErrors(req, res)) return;
    try {
      const { jobId, jobseekerId, payRate, message, expiresInHours } = req.body;
      const job = await Job.findOne({ _id: jobId, recruiterId: req.appUser.id });
      if (!job) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found" } });

      const jobseeker = await AppUser.findById(jobseekerId);
      if (!jobseeker || !["jobseeker", "individual"].includes(jobseeker.userType)) {
        return res.status(404).json({ error: { code: "NOT_FOUND", message: "Jobseeker not found" } });
      }

      const hours = Number(expiresInHours) > 0 ? Number(expiresInHours) : 48;
      const offer = await Offer.create({
        createdByRecruiterId: req.appUser.id,
        jobseekerId,
        jobId,
        mode: "manual",
        status: "sent",
        sentAt: new Date(),
        location: job.location,
        industry: job.industry,
        role: job.role,
        payRate: payRate || (job.salaryMin && job.salaryMax ? `$${job.salaryMin}-$${job.salaryMax}/${job.salaryType}` : undefined),
        message,
        expiresAt: new Date(Date.now() + hours * 3600 * 1000),
      });

      if (job.status === "posted") { job.status = "has_applicants"; await job.save(); }
      return res.status(201).json({ ok: true, offer });
    } catch (e) {
      console.error("POST /offers error:", e);
      return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
    }
  }
);

// GET /api/mobile-app/offers?status=&page=&limit=  (offers the recruiter sent)
router.get("/offers", appUserAuth, async (req, res) => {
  if (requireRecruiter(req, res)) return;
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const query = { createdByRecruiterId: req.appUser.id };
    if (req.query.status) query.status = req.query.status;
    let offers = await Offer.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    offers = await Promise.all(offers.map(applyExpiry));
    const total = await Offer.countDocuments(query);
    return res.json({ ok: true, offers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (e) {
    console.error("GET /offers error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// POST /api/mobile-app/offers/:id/withdraw
router.post("/offers/:id/withdraw", appUserAuth, async (req, res) => {
  if (requireRecruiter(req, res)) return;
  try {
    const offer = await Offer.findOne({ _id: req.params.id, createdByRecruiterId: req.appUser.id });
    if (!offer) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Offer not found" } });
    if (!["sent", "created"].includes(offer.status)) {
      return res.status(409).json({ error: { code: "INVALID_STATE", message: `Cannot withdraw an offer that is ${offer.status}` } });
    }
    offer.status = "withdrawn";
    offer.withdrawnAt = new Date();
    await offer.save();
    return res.json({ ok: true, offer });
  } catch (e) {
    console.error("POST /offers/:id/withdraw error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});
```

- [ ] **Step 2: Verify load + curl send/list/withdraw**

Run: `node -e "require('./routes/mobileJobs'); console.log('OK')"` → `OK`.

With server running (`$REC_TOKEN`, `$JOB_ID`, and the jobseeker's id as `$JS_ID` — read it from the candidates response in C2):
```bash
curl -s -X POST "$BASE/offers" -H "Authorization: Bearer $REC_TOKEN" -H "Content-Type: application/json" \
  -d "{\"jobId\":\"$JOB_ID\",\"jobseekerId\":\"$JS_ID\",\"payRate\":\"$30/hr\",\"message\":\"Keen to have you\",\"expiresInHours\":48}"
curl -s "$BASE/offers" -H "Authorization: Bearer $REC_TOKEN"
```
Expected: first → `{ ok:true, offer:{ _id, status:"sent", jobId, jobseekerId, expiresAt } }` (save as `OFFER_ID`); second lists it. Then `curl -s -X POST "$BASE/offers/$OFFER_ID/withdraw" ...` → `status:"withdrawn"`. (Send a fresh offer afterwards for C4 testing.)

- [ ] **Step 3: Commit**

```bash
git add routes/mobileJobs.js
git commit -m "feat(offers): recruiter send/list/withdraw offer endpoints"
```

---

### Task C4: Offer received / accept / decline (jobseeker)

**Files:**
- Modify: `squadgoo-admin-panel-backend/routes/mobileJobs.js`

- [ ] **Step 1: Add the jobseeker offer routes**

Add (before `module.exports`):

```javascript
// GET /api/mobile-app/offers/received?status=&page=&limit=
router.get("/offers/received", appUserAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const query = { jobseekerId: req.appUser.id };
    if (req.query.status) query.status = req.query.status;
    let offers = await Offer.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    offers = await Promise.all(offers.map(applyExpiry));
    const total = await Offer.countDocuments(query);
    return res.json({ ok: true, offers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (e) {
    console.error("GET /offers/received error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// POST /api/mobile-app/offers/:id/accept
router.post("/offers/:id/accept", appUserAuth, async (req, res) => {
  try {
    let offer = await Offer.findOne({ _id: req.params.id, jobseekerId: req.appUser.id });
    if (!offer) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Offer not found" } });
    offer = await applyExpiry(offer);
    if (offer.status !== "sent") {
      return res.status(409).json({ error: { code: "INVALID_STATE", message: `Cannot accept an offer that is ${offer.status}` } });
    }
    offer.status = "accepted";
    offer.acceptedAt = new Date();
    await offer.save();
    // NOTE (Phase 3): escrow hold + match-fee WalletTransaction would be created here.
    return res.json({ ok: true, offer });
  } catch (e) {
    console.error("POST /offers/:id/accept error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});

// POST /api/mobile-app/offers/:id/decline  body: { reason }
router.post("/offers/:id/decline", appUserAuth, async (req, res) => {
  try {
    let offer = await Offer.findOne({ _id: req.params.id, jobseekerId: req.appUser.id });
    if (!offer) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Offer not found" } });
    offer = await applyExpiry(offer);
    if (offer.status !== "sent") {
      return res.status(409).json({ error: { code: "INVALID_STATE", message: `Cannot decline an offer that is ${offer.status}` } });
    }
    offer.status = "declined";
    offer.declinedAt = new Date();
    offer.declineReason = (req.body && req.body.reason) || "";
    await offer.save();
    return res.json({ ok: true, offer });
  } catch (e) {
    console.error("POST /offers/:id/decline error:", e);
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Server error" } });
  }
});
```

- [ ] **Step 2: Verify load + curl accept/decline**

Run: `node -e "require('./routes/mobileJobs'); console.log('OK')"` → `OK`.

With server running and `$JS_TOKEN` + a fresh sent `$OFFER_ID`:
```bash
curl -s "$BASE/offers/received" -H "Authorization: Bearer $JS_TOKEN"
curl -s -X POST "$BASE/offers/$OFFER_ID/accept" -H "Authorization: Bearer $JS_TOKEN"
```
Expected: received list contains the offer; accept returns `status:"accepted"`. A second accept returns 409 `INVALID_STATE`. Decline on a fresh offer with `-d '{"reason":"Too far"}'` returns `status:"declined", declineReason:"Too far"`.

- [ ] **Step 3: Commit**

```bash
git add routes/mobileJobs.js
git commit -m "feat(offers): jobseeker received/accept/decline offer endpoints"
```

---

## PHASE D — Mobile API layer

> Follow `mobile/CLAUDE.md`: JavaScript, per-feature `*.api.js` (raw calls) + `*.query.js` (TanStack hooks + a `xxxKeys` query-key object), errors surfaced via `src/utilities/toastConfig`. Verify each task with `npx eslint <files>` (clean of NEW errors; the repo has pre-existing lint noise — only fix what you introduce).

### Task D1: Jobs API + hooks

**Files:**
- Create: `mobile/src/api/jobs/jobs.api.js`
- Create: `mobile/src/api/jobs/jobs.query.js`

- [ ] **Step 1: jobs.api.js**

```javascript
import { request } from '../apiClient';

export const createJob       = (data)        => request('/jobs', { method: 'post', body: data });
export const getMyJobs       = (params)       => request('/jobs', { method: 'get', params });
export const getJob          = (id)           => request(`/jobs/${id}`, { method: 'get' });
export const updateJob       = (id, data)     => request(`/jobs/${id}`, { method: 'put', body: data });
export const publishJob      = (id)           => request(`/jobs/${id}/publish`, { method: 'post' });
export const getJobCandidates = (id, params)  => request(`/jobs/${id}/candidates`, { method: 'get', params });
```

- [ ] **Step 2: jobs.query.js**

```javascript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import {
  createJob, getMyJobs, getJob, updateJob, publishJob, getJobCandidates,
} from './jobs.api';

export const jobKeys = {
  all: ['jobs'],
  list: (params) => [...jobKeys.all, 'list', params || {}],
  detail: (id) => [...jobKeys.all, 'detail', id],
  candidates: (id, params) => [...jobKeys.all, 'candidates', id, params || {}],
};

export const useMyJobs = (params) =>
  useQuery({ queryKey: jobKeys.list(params), queryFn: () => getMyJobs(params) });

export const useJob = (id) =>
  useQuery({ queryKey: jobKeys.detail(id), queryFn: () => getJob(id), enabled: !!id });

export const useJobCandidates = (id, params) =>
  useQuery({ queryKey: jobKeys.candidates(id, params), queryFn: () => getJobCandidates(id, params), enabled: !!id });

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: jobKeys.all }),
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not create job', 'Error', toastTypes.error),
  });
};

export const useUpdateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateJob(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: jobKeys.all }),
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not update job', 'Error', toastTypes.error),
  });
};

export const usePublishJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: publishJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: jobKeys.all }),
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not publish job', 'Error', toastTypes.error),
  });
};
```

- [ ] **Step 3: Verify**

Run: `cd mobile && npx eslint src/api/jobs/jobs.api.js src/api/jobs/jobs.query.js`
Expected: no errors that reference these files' own identifiers (pre-existing prettier noise is acceptable; no `no-undef`).

- [ ] **Step 4: Commit**

```bash
git add src/api/jobs/
git commit -m "feat(jobs): mobile jobs api + query hooks"
```

---

### Task D2: Offers API + hooks

**Files:**
- Create: `mobile/src/api/offers/offers.api.js`
- Create: `mobile/src/api/offers/offers.query.js`

- [ ] **Step 1: offers.api.js**

```javascript
import { request } from '../apiClient';

// Recruiter
export const sendOffer       = (data)         => request('/offers', { method: 'post', body: data });
export const getSentOffers   = (params)       => request('/offers', { method: 'get', params });
export const withdrawOffer   = (id)           => request(`/offers/${id}/withdraw`, { method: 'post' });

// Jobseeker
export const getReceivedOffers = (params)     => request('/offers/received', { method: 'get', params });
export const acceptOffer       = (id)         => request(`/offers/${id}/accept`, { method: 'post' });
export const declineOffer      = (id, reason) => request(`/offers/${id}/decline`, { method: 'post', body: { reason } });
```

- [ ] **Step 2: offers.query.js**

```javascript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import {
  sendOffer, getSentOffers, withdrawOffer, getReceivedOffers, acceptOffer, declineOffer,
} from './offers.api';

export const offerKeys = {
  all: ['offers'],
  sent: (params) => [...offerKeys.all, 'sent', params || {}],
  received: (params) => [...offerKeys.all, 'received', params || {}],
};

export const useSentOffers = (params) =>
  useQuery({ queryKey: offerKeys.sent(params), queryFn: () => getSentOffers(params) });

export const useReceivedOffers = (params) =>
  useQuery({ queryKey: offerKeys.received(params), queryFn: () => getReceivedOffers(params) });

export const useSendOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: offerKeys.all });
      showToast('Offer sent', 'Success', toastTypes.success);
    },
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not send offer', 'Error', toastTypes.error),
  });
};

export const useWithdrawOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: withdrawOffer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: offerKeys.all }); showToast('Offer withdrawn', 'Success', toastTypes.success); },
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not withdraw offer', 'Error', toastTypes.error),
  });
};

export const useAcceptOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptOffer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: offerKeys.all }); showToast('Offer accepted', 'Success', toastTypes.success); },
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not accept offer', 'Error', toastTypes.error),
  });
};

export const useDeclineOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => declineOffer(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: offerKeys.all }); showToast('Offer declined', 'Success', toastTypes.success); },
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not decline offer', 'Error', toastTypes.error),
  });
};
```

- [ ] **Step 3: Verify**

Run: `cd mobile && npx eslint src/api/offers/offers.api.js src/api/offers/offers.query.js`
Expected: no new `no-undef`/unused errors in these files.

- [ ] **Step 4: Commit**

```bash
git add src/api/offers/
git commit -m "feat(offers): mobile offers api + query hooks"
```

---

### Task D3: Jobseeker preferences API + hooks (CRUD)

The approved PreferredJobs UI adds/lists/edits/deletes preference profiles — and these are the matching data source, so they must round-trip. Build a dedicated feature module (don't overload `jobSeeker.api.js`).

**Files:**
- Create: `mobile/src/api/preferences/preferences.api.js`
- Create: `mobile/src/api/preferences/preferences.query.js`
- Modify: `mobile/src/api/jobSeeker/jobSeeker.api.js` (repoint the dead `addJobPreferences` to delegate here)

- [ ] **Step 1: preferences.api.js**

```javascript
import { request } from '../apiClient';

export const getPreferences    = ()         => request('/jobseeker/preferences', { method: 'get' });
export const createPreference  = (data)     => request('/jobseeker/preferences', { method: 'post', body: data });
export const updatePreference  = (id, data) => request(`/jobseeker/preferences/${id}`, { method: 'put', body: data });
export const deletePreference  = (id)       => request(`/jobseeker/preferences/${id}`, { method: 'delete' });
```

- [ ] **Step 2: preferences.query.js**

```javascript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { getPreferences, createPreference, updatePreference, deletePreference } from './preferences.api';

export const preferenceKeys = { all: ['preferences'], list: () => [...preferenceKeys.all, 'list'] };

export const usePreferences = () =>
  useQuery({ queryKey: preferenceKeys.list(), queryFn: getPreferences });

export const useCreatePreference = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPreference,
    onSuccess: () => { qc.invalidateQueries({ queryKey: preferenceKeys.all }); showToast('Preference saved', 'Success', toastTypes.success); },
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not save preference', 'Error', toastTypes.error),
  });
};

export const useUpdatePreference = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePreference(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: preferenceKeys.all }); showToast('Preference updated', 'Success', toastTypes.success); },
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not update preference', 'Error', toastTypes.error),
  });
};

export const useDeletePreference = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePreference,
    onSuccess: () => { qc.invalidateQueries({ queryKey: preferenceKeys.all }); showToast('Preference removed', 'Success', toastTypes.success); },
    onError: (err) => showToast(err?.response?.data?.error?.message || 'Could not remove preference', 'Error', toastTypes.error),
  });
};
```

- [ ] **Step 3: Repoint the dead `addJobPreferences`**

In `jobSeeker.api.js`, change the dead `/app/JobSeeker/updatePreferences` line to delegate to the live endpoint:

```javascript
export const addJobPreferences = (data) => request('/jobseeker/preferences', { method: 'POST', body: data });
```

> NOTE: the other `/app/JobSeeker/*` calls (experience, address, tax, social) are not consumed by the manual-offer matching path and are left for a later task — those screens (Education, SkillsLanguages, work experience) are not yet persisted even in the approved UI.

- [ ] **Step 4: Verify**

Run: `cd mobile && npx eslint src/api/preferences/preferences.api.js src/api/preferences/preferences.query.js src/api/jobSeeker/jobSeeker.api.js`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/api/preferences/ src/api/jobSeeker/jobSeeker.api.js
git commit -m "feat(jobseeker): preferences CRUD api + hooks; repoint addJobPreferences"
```

---

## PHASE E — Mobile screen wiring (dummy → real)

> **UI is FROZEN.** These tasks only swap the data source — do NOT change layout, fields, copy, navigation, validation, or field names. If a screen field name differs from the backend, map it in the `*.api.js` layer or in a small adapter inside the screen's data-loading hook usage — never by renaming the screen's fields or restructuring its JSX.
>
> Pattern (from `docs/INTEGRATION_STATUS.md`): remove the dummy/`isDummyMode()` source, import the relevant hook, replace the dummy data with the hook's `data`, drive loading with `isPending`/`isLoading`, and call mutations on submit. Each task: make the change, run `npx eslint <file>`, then commit. Reference wired examples: `src/screens/auth/Signin.js`, `src/screens/main/Recruiter/profile/kyc/KycSubmit.jsx`.

### Task E1: Recruiter — submit manual job

**Files:**
- Modify: `mobile/src/screens/main/Recruiter/HomeTabs/JobPreview.jsx` (the final "post job" action of the ManualSearchSteps wizard)
- Read for context: `src/screens/main/Recruiter/ManualSearchSteps/StepTwo.jsx`, `StepThree.jsx`, `StepFour.jsx` (where wizard fields are collected into Redux/local state)

- [ ] **Step 1: Replace the dummy "post job" dispatch with the real mutation**

In `JobPreview.jsx`: import `useCreateJob` from `@/api/jobs/jobs.query`. Build the payload by passing the wizard's collected fields through **as-is** (the backend `pickJobFields` already accepts the full approved field set + aliases like `jobTitle`/`workLocation`/`staffCount`, and dumps anything else into `meta`). Do NOT rename or drop fields in the screen — just hand the assembled wizard object to the mutation, then:
  - set `searchType: 'manual'` and `status: 'posted'` (or `'draft'` if the user chose "Save draft").
Replace the existing `dispatch(createManualJob(...))`/dummy call with:
```javascript
const { mutateAsync: createJobApi, isPending } = useCreateJob();
// in the post handler:
try {
  const res = await createJobApi(buildJobPayload());
  // navigate to ManualMatchList with res.job._id
  navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId: res.job._id });
} catch { /* hook toasts */ }
```
Gate the post button with `isPending`.

- [ ] **Step 2: Verify**

Run: `cd mobile && npx eslint src/screens/main/Recruiter/HomeTabs/JobPreview.jsx`
Expected: no new errors. Manual check (if emulator + backend available): completing the wizard creates a job (visible via `GET /jobs`).

- [ ] **Step 3: Commit**

```bash
git add src/screens/main/Recruiter/HomeTabs/JobPreview.jsx
git commit -m "feat(jobs): post manual job to backend from JobPreview"
```

---

### Task E2: Recruiter — candidate list + profile from matching

**Files:**
- Modify: `mobile/src/screens/main/Recruiter/ManualSearchSteps/ManualMatchList.jsx`
- Modify: `mobile/src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx`

- [ ] **Step 1: ManualMatchList — use `useJobCandidates`**

Import `useJobCandidates` from `@/api/jobs/jobs.query`. Read `jobId` from route params (set in E1). Replace the dummy/`generateManualMatches` Redux source with `const { data, isLoading } = useJobCandidates(jobId);` and render `data?.candidates` (each has `id, name, matchPercentage, profilePhoto, industries, taxType, payPreference, experienceYears, kycVerified, blueTick`). Use `isLoading` for the spinner. On a candidate tap, navigate to `ManualCandidateProfile` passing the candidate object (or its `id`) plus `jobId`.

- [ ] **Step 2: ManualCandidateProfile — render passed candidate; wire "Send Offer" nav**

Render from the candidate passed via params (no dummy lookup). The "Send Offer" button navigates to `SendOffer` with `{ jobId, candidate }`.

- [ ] **Step 3: Verify**

Run: `cd mobile && npx eslint src/screens/main/Recruiter/ManualSearchSteps/ManualMatchList.jsx src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/screens/main/Recruiter/ManualSearchSteps/ManualMatchList.jsx src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx
git commit -m "feat(jobs): show backend-matched candidates in manual flow"
```

---

### Task E3: Recruiter — send offer

**Files:**
- Modify: `mobile/src/screens/main/Recruiter/Offers/SendOffer.jsx`

- [ ] **Step 1: Wire `useSendOffer`**

Import `useSendOffer` from `@/api/offers/offers.query`. Read `jobId` + `candidate` from route params. On submit, build `{ jobId, jobseekerId: candidate.id, payRate, message, expiresInHours }` and call the mutation:
```javascript
const { mutateAsync: sendOfferApi, isPending } = useSendOffer();
try {
  await sendOfferApi({ jobId, jobseekerId: candidate.id, payRate, message, expiresInHours });
  navigation.goBack(); // or navigate to ActiveJobOffers
} catch { /* hook toasts */ }
```
Replace any `dispatch(sendManualOffer(...))` dummy call. Gate the button with `isPending`.

- [ ] **Step 2: Verify**

Run: `cd mobile && npx eslint src/screens/main/Recruiter/Offers/SendOffer.jsx`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/main/Recruiter/Offers/SendOffer.jsx
git commit -m "feat(offers): send manual offer to backend"
```

---

### Task E4: Recruiter — job/offer status lists

**Files:**
- Modify: `mobile/src/screens/main/Recruiter/HomeTabs/ActiveJobOffers.jsx`
- Modify: `mobile/src/screens/main/Recruiter/HomeTabs/DraftedOffers.jsx`
- Modify: `mobile/src/screens/main/Recruiter/HomeTabs/CompletedOffers.jsx`
- Modify: `mobile/src/screens/main/Recruiter/HomeTabs/ExpiredOffers.jsx`

- [ ] **Step 1: Wire each list to the right query + status filter**

Replace each screen's dummy source with hooks:
  - `ActiveJobOffers.jsx` → `useSentOffers({ status: 'sent' })` (offers awaiting response) and/or `useMyJobs({ status: 'posted' })` for posted jobs, per the tab's intent. Render `data?.offers` / `data?.jobs`.
  - `DraftedOffers.jsx` → `useMyJobs({ status: 'draft' })`.
  - `CompletedOffers.jsx` → `useSentOffers({ status: 'completed' })`.
  - `ExpiredOffers.jsx` → `useSentOffers({ status: 'expired' })`.
Drive each with `isLoading`. Add a "Withdraw" action on active offers calling `useWithdrawOffer().mutate(offer._id)`.

- [ ] **Step 2: Verify**

Run: `cd mobile && npx eslint src/screens/main/Recruiter/HomeTabs/ActiveJobOffers.jsx src/screens/main/Recruiter/HomeTabs/DraftedOffers.jsx src/screens/main/Recruiter/HomeTabs/CompletedOffers.jsx src/screens/main/Recruiter/HomeTabs/ExpiredOffers.jsx`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/main/Recruiter/HomeTabs/
git commit -m "feat(offers): wire recruiter job/offer status tabs to backend"
```

---

### Task E5: Jobseeker — received offers list + detail accept/decline

**Files:**
- Modify: `mobile/src/screens/main/JobSeeker/ManualSearch/ManualOffers.jsx`
- Modify: `mobile/src/screens/main/JobSeeker/JobOfferDetails.jsx`

- [ ] **Step 1: ManualOffers — list received offers**

Import `useReceivedOffers` from `@/api/offers/offers.query`. Replace the dummy `jobSeekerOffersSlice`/dummy source with `const { data, isLoading } = useReceivedOffers({ status: 'sent' });` and render `data?.offers`. Each offer tap navigates to `JobOfferDetails` with the offer (or `offerId`).

- [ ] **Step 2: JobOfferDetails — accept/decline**

Import `useAcceptOffer`, `useDeclineOffer`. Render the offer passed via params (or fetch via received list). Wire:
```javascript
const { mutateAsync: accept, isPending: accepting } = useAcceptOffer();
const { mutateAsync: decline, isPending: declining } = useDeclineOffer();
// Accept button:
try { await accept(offer._id); navigation.goBack(); } catch {}
// Decline button (with a reason prompt/sheet):
try { await decline({ id: offer._id, reason }); navigation.goBack(); } catch {}
```
Gate the buttons with `accepting`/`declining`. Remove the dummy `applyToOffer`/`declineActiveOffer` dispatches.

- [ ] **Step 3: Verify**

Run: `cd mobile && npx eslint src/screens/main/JobSeeker/ManualSearch/ManualOffers.jsx src/screens/main/JobSeeker/JobOfferDetails.jsx`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/screens/main/JobSeeker/ManualSearch/ManualOffers.jsx src/screens/main/JobSeeker/JobOfferDetails.jsx
git commit -m "feat(offers): jobseeker receives and accepts/declines offers from backend"
```

---

### Task E6: Jobseeker — preferred-job profiles CRUD (matching data source)

Without persisted preferences, matching (Task C2) returns no candidates — so this is required for the manual flow to surface anyone. Wire the approved PreferredJobs screens to the preferences CRUD. **UI stays frozen** — only swap dummy/Redux for the hooks; map the screen's existing field names to the API payload in the api/hook usage, never by renaming screen fields.

**Files:**
- Modify: `mobile/src/screens/main/JobSeeker/DashBoard/TabScreens/PreferredJobs.jsx` (list + delete)
- Modify: `mobile/src/screens/main/JobSeeker/DashBoard/TabScreens/AddExperince/AddJobStep2.jsx` (final submit → create/update)

- [ ] **Step 1: PreferredJobs — list + delete from backend**

Import `usePreferences`, `useDeletePreference` from `@/api/preferences/preferences.query`. Replace the `state.jobSeekerPreferred.preferredJobs` Redux source with `const { data, isLoading } = usePreferences();` and render `data?.preferences` (each already has `_id`, `preferredJobTitle`, pay, availability — the same fields the card reads). Wire the existing delete (trash) control to `useDeletePreference().mutate(item._id)`. Edit (pencil) still navigates to `AddJobStep1` passing the preference object (unchanged).

- [ ] **Step 2: AddJobStep2 — create/update via backend**

Import `useCreatePreference`, `useUpdatePreference`. The screen already assembles the payload object (`{ ...step1Data, daysAvailable, startTime, endTime }`). Replace the `dispatch(addPreferredJob(...))` / `dispatch(updatePreferredJob(...))` calls with:
```javascript
const { mutateAsync: createPref, isPending: creating } = useCreatePreference();
const { mutateAsync: updatePref, isPending: updating } = useUpdatePreference();
// on submit:
try {
  if (editId) await updatePref({ id: editId, data: payload });
  else await createPref(payload);
  navigation.goBack();
} catch { /* hook toasts */ }
```
Gate the submit button with `creating || updating`. Do not change the form fields or the payload shape — the backend accepts it as-is.

- [ ] **Step 3: Verify**

Run: `cd mobile && npx eslint src/screens/main/JobSeeker/DashBoard/TabScreens/PreferredJobs.jsx "src/screens/main/JobSeeker/DashBoard/TabScreens/AddExperince/AddJobStep2.jsx"`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add "src/screens/main/JobSeeker/DashBoard/TabScreens/PreferredJobs.jsx" "src/screens/main/JobSeeker/DashBoard/TabScreens/AddExperince/AddJobStep2.jsx"
git commit -m "feat(jobseeker): persist preferred-job profiles via backend (matching data)"
```

---

## PHASE F — End-to-end verification

### Task F1: Full manual flow smoke test

- [ ] **Step 1: Run the complete loop via curl** (server running; recruiter + jobseeker tokens)

```bash
# 1. Jobseeker creates a preferred-job profile (category must match the job's jobCategory)
curl -s -X POST "$BASE/jobseeker/preferences" -H "Authorization: Bearer $JS_TOKEN" -H "Content-Type: application/json" \
  -d '{"preferredJobTitle":{"category":"Construction","subCategory":"Painter"},"expectedPayMin":25,"expectedPayMax":35,"receiveWithinKm":"50","taxType":"ABN","manualOffers":true,"daysAvailable":"Monday,Tuesday","startTime":"08:00","endTime":"17:00"}'
# 2. Recruiter posts a job
JOB=$(curl -s -X POST "$BASE/jobs" -H "Authorization: Bearer $REC_TOKEN" -H "Content-Type: application/json" -d '{"title":"Painter","jobCategory":"Construction","state":"NSW","taxType":"ABN","salaryMin":25,"salaryMax":35,"status":"posted"}')
echo "$JOB"
# 3. Recruiter lists candidates → copy the jobseeker id + job id into JOB_ID / JS_ID
# 4. Recruiter sends an offer
# 5. Jobseeker GET /offers/received → accept
# 6. Recruiter GET /offers?status=accepted → sees it accepted
```
Expected: each step returns `ok:true`; the final recruiter list shows the offer with `status:"accepted"`. Confirm a declined path and an expired path (set `expiresInHours` small / wait) as well.

- [ ] **Step 2: Document the result**

Update `mobile/docs/INTEGRATION_STATUS.md` Phase 2 table: mark manual job posting, candidate matching, manual offers (send/accept/decline) as wired (✅), with the new endpoints noted. Leave quick-search rows as ❌ (Phase 2b).

- [ ] **Step 3: Commit**

```bash
cd mobile && git add docs/INTEGRATION_STATUS.md
git commit -m "docs: mark Phase 2a manual job-offers flow as integrated"
```

---

## Self-review notes

- **UI-frozen compliance:** no task changes any screen's layout, fields, copy, flow, or field names. Backend accepts the approved field set (Job model + `meta` catch-all; preference fields mirror the UI). All mapping/aliasing lives in the `*.api.js` layer. The wiring tasks (E1–E6) only swap dummy → hooks.
- **Spec coverage:** preferred-job profiles CRUD = matching data source (A3/B1/D3/E6), post job (C1/E1), candidate matching mirroring `computeMatchScore` (C2/E2), send/withdraw offer (C3/E3/E4), jobseeker receive/accept/decline (C4/E5). Locked decisions honored: single `Job` model w/ `searchType` holding the FULL approved field set + `meta`; preferences as a separate collection matching the PreferredJobs UI; manual flow only; no money (accept has an explicit Phase-3 NOTE where escrow would go); filter+score matching, no geo.
- **Type/field consistency:** job aliases (jobTitle/workLocation/staffCount) normalized in `pickJobFields`; Offer status mapping (`pending`⇔`sent`) documented and mapped in the mobile api layer; candidate-card fields with no backend source yet (acceptanceRating, languages, structured experienceYears, badge) returned null/empty — the approved card tolerates them.
- **Known follow-ups (NOT this plan):** quick-search auto-matching + auto-send (Phase 2b), offer modification/negotiation (2b), escrow/match-fee on accept (Phase 3), work sessions/timer/location/payment/complete (Phase 3), ratings/acceptanceRating recalculation + reviews (Social), chat session + contact reveal on accept (Social), squads, and persistence for Education/SkillsLanguages/work-experience (unwired even in the approved UI). Document/photo uploads remain storage-blocked.
