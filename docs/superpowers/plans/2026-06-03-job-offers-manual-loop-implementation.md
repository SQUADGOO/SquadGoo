# Manual Job/Offer Loop — Mobile Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the SquadGo mobile manual job/offer flow (recruiter + jobseeker) off dummy data onto the live backend (`/api/mobile-app`), keeping the frozen UI unchanged.

**Architecture:** Two-layer per feature — `*.api.js` (raw `request()` calls + field mapping) and `*.query.js` (TanStack Query hooks + `xxxKeys` factory). Screens read from hooks; Redux keeps only the job-creation wizard's in-progress form state. Match-fee is **calculated only** this phase (escrow is Phase 3, Stripe).

**Tech Stack:** React Native (JS, bare), `@tanstack/react-query`, Redux Toolkit, axios via `src/api/apiClient.js` (`request` helper + `apiClient`), `showToast`/`toastTypes` from `src/utilities/toastConfig`.

**⚠️ Verification model (no test runner; `mobile/CLAUDE.md` forbids new deps):** there is NO unit-test harness. Each task verifies with **`npx eslint <files>`** (no new errors) and, for screens, **manual two-account simulator testing** in Phase F. Commit after each task.

**Backend response shapes (build to these):** success `{ ok:true, ... }`; error `{ error:{ code, message } }`. Lists: `{ ok, jobs|offers|candidates, pagination }`. Single: `{ ok, job }` / `{ ok, offer }`. Offer status enum `created|sent|accepted|declined|expired|withdrawn` → UI shows `sent` as `pending`.

---

## File Structure

**Create (new api layer):**
- `src/api/jobs/jobs.api.js` — job CRUD + candidates raw calls + mappings
- `src/api/jobs/jobs.query.js` — `jobsKeys` + job/candidate hooks
- `src/api/offers/offers.api.js` — offer raw calls + status mapping
- `src/api/offers/offers.query.js` — `offersKeys` + offer hooks
- `src/api/preferences/preferences.api.js` — preference CRUD raw calls
- `src/api/preferences/preferences.query.js` — `preferencesKeys` + preference hooks

**Modify (screens — swap dummy source for hooks, no layout change):**
- `src/screens/main/JobSeeker/**` PreferredJobs + AddJob step (E1)
- `src/screens/main/Recruiter/HomeTabs/JobPreview.jsx` (E2)
- recruiter job/draft list screen(s) (E2)
- `src/screens/main/Recruiter/ManualSearchSteps/ManualMatchList.jsx` (E3)
- `src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx` (E3)
- `src/screens/main/Recruiter/ManualSearchSteps/ManualOffers.jsx` (E4)
- jobseeker received-offers screen + accept/decline (E5)

**Do NOT delete** the dummy slice paths (`jobsSlice`, `manualOffersSlice`, etc.) — leave them in place, just stop reading them from these screens (no-restructure rule).

---

## Phase D1 — API / Query layer (no screen changes)

### Task 1: Preferences api layer

**Files:**
- Create: `src/api/preferences/preferences.api.js`

- [ ] **Step 1: Write `preferences.api.js`**

```js
import { request } from '../apiClient';

// Backend JobseekerPreference mirrors the PreferredJobs UI shape ~1:1 → mostly pass-through.
// Normalise Mongo `_id` → `id` so screens have a stable key.
const normalize = (p) => (p ? { ...p, id: p._id ?? p.id } : p);

// Backend wraps lists/items; handle the documented shapes defensively.
const listFrom = (res) => res?.preferences ?? res?.data ?? (Array.isArray(res) ? res : []);
const itemFrom = (res) => res?.preference ?? res?.data ?? res;

export const listPreferences = async () => {
  const res = await request('/jobseeker/preferences', { method: 'get' });
  return listFrom(res).map(normalize);
};

export const createPreference = async (data) => {
  const res = await request('/jobseeker/preferences', { method: 'post', body: data });
  return normalize(itemFrom(res));
};

export const updatePreference = async (id, data) => {
  const res = await request(`/jobseeker/preferences/${id}`, { method: 'put', body: data });
  return normalize(itemFrom(res));
};

export const deletePreference = async (id) => {
  await request(`/jobseeker/preferences/${id}`, { method: 'delete' });
  return { id };
};
```

- [ ] **Step 2: Lint** — Run: `npx eslint src/api/preferences/preferences.api.js` · Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/preferences/preferences.api.js
git commit -m "feat(api): preferences api layer (jobseeker preferences CRUD)"
```

### Task 2: Preferences query hooks

**Files:**
- Create: `src/api/preferences/preferences.query.js`

- [ ] **Step 1: Write `preferences.query.js`**

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import {
  listPreferences, createPreference, updatePreference, deletePreference,
} from './preferences.api';

export const preferencesKeys = {
  all: ['preferences'],
  list: () => [...preferencesKeys.all, 'list'],
};

export const usePreferences = () =>
  useQuery({ queryKey: preferencesKeys.list(), queryFn: listPreferences });

export const useCreatePreference = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPreference,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: preferencesKeys.list() });
      showToast('Preference saved', 'Success', toastTypes.success);
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not save preference', 'Error', toastTypes.error),
  });
};

export const useUpdatePreference = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePreference(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: preferencesKeys.list() });
      showToast('Preference updated', 'Success', toastTypes.success);
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not update preference', 'Error', toastTypes.error),
  });
};

export const useDeletePreference = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePreference(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: preferencesKeys.list() });
      showToast('Preference removed', 'Success', toastTypes.success);
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not remove preference', 'Error', toastTypes.error),
  });
};
```

- [ ] **Step 2: Lint** — Run: `npx eslint src/api/preferences/preferences.query.js` · Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/preferences/preferences.query.js
git commit -m "feat(api): preferences query hooks"
```

### Task 3: Jobs api layer

**Files:**
- Create: `src/api/jobs/jobs.api.js`

- [ ] **Step 1: Write `jobs.api.js`**

```js
import { request } from '../apiClient';

const normalizeJob = (j) => (j ? { ...j, id: j._id ?? j.id } : j);
const normalizeCandidate = (c) => (c ? { ...c, id: c.id ?? c._id } : c);

// Create a job. `status` is 'posted' (post now) or 'draft' (save draft). The backend
// normalises UI aliases (jobTitle/jobType/workLocation/staffCount) and dumps extras to meta,
// so we forward the assembled wizard object as-is and just ensure numbers + status.
export const createJob = async (jobData) => {
  const body = {
    ...jobData,
    salaryMin: jobData.salaryMin != null ? Number(jobData.salaryMin) : undefined,
    salaryMax: jobData.salaryMax != null ? Number(jobData.salaryMax) : undefined,
  };
  const res = await request('/jobs', { method: 'post', body });
  return normalizeJob(res?.job ?? res);
};

export const listMyJobs = async (status) => {
  const res = await request('/jobs', { method: 'get', params: { status, limit: 50 } });
  return (res?.jobs ?? []).map(normalizeJob);
};

export const getJob = async (id) => {
  const res = await request(`/jobs/${id}`, { method: 'get' });
  return normalizeJob(res?.job ?? res);
};

export const updateJobDraft = async (id, jobData) => {
  const res = await request(`/jobs/${id}`, { method: 'put', body: jobData });
  return normalizeJob(res?.job ?? res);
};

export const publishJob = async (id) => {
  const res = await request(`/jobs/${id}/publish`, { method: 'post' });
  return normalizeJob(res?.job ?? res);
};

export const getJobCandidates = async (jobId) => {
  const res = await request(`/jobs/${jobId}/candidates`, { method: 'get', params: { limit: 50 } });
  return (res?.candidates ?? []).map(normalizeCandidate);
};
```

- [ ] **Step 2: Lint** — Run: `npx eslint src/api/jobs/jobs.api.js` · Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/jobs/jobs.api.js
git commit -m "feat(api): jobs api layer (CRUD + candidates)"
```

### Task 4: Jobs query hooks

**Files:**
- Create: `src/api/jobs/jobs.query.js`

- [ ] **Step 1: Write `jobs.query.js`**

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import {
  createJob, listMyJobs, getJob, updateJobDraft, publishJob, getJobCandidates,
} from './jobs.api';

export const jobsKeys = {
  all: ['jobs'],
  lists: () => [...jobsKeys.all, 'list'],
  list: (status) => [...jobsKeys.lists(), status ?? 'all'],
  detail: (id) => [...jobsKeys.all, 'detail', id],
  candidates: (jobId) => [...jobsKeys.all, 'candidates', jobId],
};

export const useMyJobs = (status) =>
  useQuery({ queryKey: jobsKeys.list(status), queryFn: () => listMyJobs(status) });

export const useJob = (id) =>
  useQuery({ queryKey: jobsKeys.detail(id), queryFn: () => getJob(id), enabled: !!id });

export const useJobCandidates = (jobId) =>
  useQuery({ queryKey: jobsKeys.candidates(jobId), queryFn: () => getJobCandidates(jobId), enabled: !!jobId });

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: jobsKeys.lists() }),
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not post job', 'Error', toastTypes.error),
  });
};

export const useUpdateJobDraft = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateJobDraft(id, data),
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: jobsKeys.lists() });
      if (job?.id) qc.invalidateQueries({ queryKey: jobsKeys.detail(job.id) });
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not save draft', 'Error', toastTypes.error),
  });
};

export const usePublishJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => publishJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobsKeys.lists() });
      showToast('Job published', 'Success', toastTypes.success);
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not publish job', 'Error', toastTypes.error),
  });
};
```

- [ ] **Step 2: Lint** — Run: `npx eslint src/api/jobs/jobs.query.js` · Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/jobs/jobs.query.js
git commit -m "feat(api): jobs query hooks"
```

### Task 5: Offers api layer (status + payload mapping)

**Files:**
- Create: `src/api/offers/offers.api.js`

- [ ] **Step 1: Write `offers.api.js`**

```js
import { request } from '../apiClient';

// Backend offer status ⇄ UI status. UI shows backend `sent` as `pending`.
const toUiStatus = (s) => (s === 'sent' ? 'pending' : s);
const toApiStatus = (s) => (s === 'pending' ? 'sent' : s);

const normalizeOffer = (o) =>
  o ? { ...o, id: o._id ?? o.id, status: toUiStatus(o.status) } : o;

// Recruiter: send an offer. Screen passes candidateId/expiryHours; map to backend names.
export const sendOffer = async ({ jobId, candidateId, expiryHours, message, payRate }) => {
  const body = {
    jobId,
    jobseekerId: candidateId,
    message,
    payRate,
    expiresInHours: expiryHours,
  };
  const res = await request('/offers', { method: 'post', body });
  return normalizeOffer(res?.offer ?? res);
};

export const listSentOffers = async (status) => {
  const res = await request('/offers', { method: 'get', params: { status: toApiStatus(status), limit: 50 } });
  return (res?.offers ?? []).map(normalizeOffer);
};

export const withdrawOffer = async (id) => {
  const res = await request(`/offers/${id}/withdraw`, { method: 'post' });
  return normalizeOffer(res?.offer ?? res);
};

// Jobseeker side.
export const listReceivedOffers = async (status) => {
  const res = await request('/offers/received', { method: 'get', params: { status: toApiStatus(status), limit: 50 } });
  return (res?.offers ?? []).map(normalizeOffer);
};

export const acceptOffer = async (id) => {
  const res = await request(`/offers/${id}/accept`, { method: 'post' });
  return normalizeOffer(res?.offer ?? res);
};

export const declineOffer = async (id, reason) => {
  const res = await request(`/offers/${id}/decline`, { method: 'post', body: { reason } });
  return normalizeOffer(res?.offer ?? res);
};
```

- [ ] **Step 2: Lint** — Run: `npx eslint src/api/offers/offers.api.js` · Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/offers/offers.api.js
git commit -m "feat(api): offers api layer (send/list/withdraw/accept/decline + status mapping)"
```

### Task 6: Offers query hooks

**Files:**
- Create: `src/api/offers/offers.query.js`

- [ ] **Step 1: Write `offers.query.js`**

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { jobsKeys } from '../jobs/jobs.query';
import {
  sendOffer, listSentOffers, withdrawOffer, listReceivedOffers, acceptOffer, declineOffer,
} from './offers.api';

export const offersKeys = {
  all: ['offers'],
  sent: (status) => [...offersKeys.all, 'sent', status ?? 'all'],
  received: (status) => [...offersKeys.all, 'received', status ?? 'all'],
};

export const useSentOffers = (status) =>
  useQuery({ queryKey: offersKeys.sent(status), queryFn: () => listSentOffers(status) });

export const useReceivedOffers = (status) =>
  useQuery({ queryKey: offersKeys.received(status), queryFn: () => listReceivedOffers(status) });

export const useSendOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: offersKeys.all });
      qc.invalidateQueries({ queryKey: jobsKeys.lists() }); // job flips to has_applicants
      showToast('Offer sent', 'Success', toastTypes.success);
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not send offer', 'Error', toastTypes.error),
  });
};

export const useWithdrawOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => withdrawOffer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: offersKeys.all }),
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not withdraw offer', 'Error', toastTypes.error),
  });
};

export const useAcceptOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => acceptOffer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: offersKeys.all });
      showToast('Offer accepted', 'Success', toastTypes.success);
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not accept offer', 'Error', toastTypes.error),
  });
};

export const useDeclineOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => declineOffer(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: offersKeys.all });
      showToast('Offer declined', 'Success', toastTypes.success);
    },
    onError: (err) =>
      showToast(err?.response?.data?.error?.message || 'Could not decline offer', 'Error', toastTypes.error),
  });
};
```

- [ ] **Step 2: Lint** — Run: `npx eslint src/api/offers/offers.query.js` · Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/offers/offers.query.js
git commit -m "feat(api): offers query hooks"
```

---

## Phase E — Screen wiring

**General rule for every E task (frozen UI):** open the screen, find the dummy data source (a `useSelector(selectXxx)` reading a Redux slice, a `dispatch(generateManualMatches/…)`, or a `DUMMY_JOB_SEEKERS` import), and replace ONLY the data source with the hook's `data`. Gate buttons with the hook's `isPending`/`isLoading`. Do not touch layout, copy, field names, or styles. Map any name differences in the `*.api.js` layer (already done in D1), never in the screen.

### Task 7 (E1): Jobseeker preferences — `PreferredJobs` + add/edit screen

**Files:**
- Modify: the jobseeker PreferredJobs list screen + its add/edit screen under `src/screens/main/JobSeeker/**`
  (locate with: `grep -rl "jobSeekerPreferred\|preferredJobs\|PreferredJobs" src/screens src/navigation`)

- [ ] **Step 1: Wire the list** — replace the `useSelector(...preferredJobs...)` read with:

```js
import { usePreferences } from '@/api/preferences/preferences.query';
// inside component:
const { data: preferredJobs = [], isLoading } = usePreferences();
// use `isLoading` for the existing spinner; render `preferredJobs` exactly as before.
```

- [ ] **Step 2: Wire create/edit/delete** — on the add/edit screen's Save/Delete handlers:

```js
import { useCreatePreference, useUpdatePreference, useDeletePreference } from '@/api/preferences/preferences.query';
const createPref = useCreatePreference();
const updatePref = useUpdatePreference();
const deletePref = useDeletePreference();

// Save (the form object already matches backend field names — preferredIndustry/preferredJobTitle/
// expectedPayMin/expectedPayMax/receiveWithinKm/manualOffers/quickOffers/daysAvailable/startTime/
// endTime/taxType). New vs edit:
const onSave = async (form) => {
  try {
    if (editingId) await updatePref.mutateAsync({ id: editingId, data: form });
    else await createPref.mutateAsync(form);
    navigation.goBack();
  } catch { /* hook already toasts */ }
};
// gate the Save button with: createPref.isPending || updatePref.isPending
```

- [ ] **Step 3: Lint** — Run: `npx eslint <the two screen files>` · Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(jobseeker): wire PreferredJobs to preferences API"
```

### Task 8 (E2): Recruiter job create + drafts — `JobPreview` + job/draft list

**Files:**
- Modify: `src/screens/main/Recruiter/HomeTabs/JobPreview.jsx`
- Modify: the recruiter job/draft list screen (locate: `grep -rln "activeJobs\|draftedJobs\|jobsSlice" src/screens/main/Recruiter`)

- [ ] **Step 1: Wire "Post now" / "Save draft" in JobPreview** — replace the `dispatch(addJob(...))` / `dispatch(saveDraftJob(...))` calls:

```js
import { useCreateJob, useUpdateJobDraft, usePublishJob } from '@/api/jobs/jobs.query';
const createJob = useCreateJob();
const updateDraft = useUpdateJobDraft();

const handlePost = async () => {
  try {
    const job = await createJob.mutateAsync({ ...assembledJob, status: 'posted' });
    navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId: job.id });
  } catch { /* hook toasts */ }
};

const handleSaveDraft = async () => {
  try {
    if (editingDraftId) await updateDraft.mutateAsync({ id: editingDraftId, data: assembledJob });
    else await createJob.mutateAsync({ ...assembledJob, status: 'draft' });
    navigation.navigate(/* existing jobs/draft list route */);
  } catch { /* hook toasts */ }
};
// gate both buttons with createJob.isPending || updateDraft.isPending
```

- [ ] **Step 2: Wire the job/draft list** — replace `useSelector(...activeJobs/draftedJobs...)`:

```js
import { useMyJobs } from '@/api/jobs/jobs.query';
const { data: postedJobs = [], isLoading } = useMyJobs('posted');
const { data: draftJobs = [] } = useMyJobs('draft');
// render exactly as before; edit-draft → navigate into the wizard with the draft prefilled
// (load via useJob(id) on the wizard entry, or pass the draft object through nav params).
```

- [ ] **Step 3: Wire publish (draft → live)** — on the draft's "Publish/Go live" action:

```js
import { usePublishJob } from '@/api/jobs/jobs.query';
const publish = usePublishJob();
const onPublish = (id) => publish.mutate(id); // hook toasts + invalidates lists
```

- [ ] **Step 4: Lint** — Run: `npx eslint <JobPreview + list files>` · Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(recruiter): wire job post/draft/publish to jobs API"
```

### Task 9 (E3): Recruiter matches + candidate profile

**Files:**
- Modify: `src/screens/main/Recruiter/ManualSearchSteps/ManualMatchList.jsx`
- Modify: `src/screens/main/Recruiter/ManualSearchSteps/ManualCandidateProfile.jsx`

- [ ] **Step 1: Wire ManualMatchList** — remove `dispatch(generateManualMatches({ jobId }))` and the `useSelector(selectManualMatchesByJobId)`; replace with:

```js
import { useJobCandidates } from '@/api/jobs/jobs.query';
const { data: matches = [], isLoading } = useJobCandidates(jobId);
// render `matches` in the existing card list (fields: id, name, avatar, matchPercentage,
// acceptanceRating(null ok), industries, preferredRoles, payPreference, isVerified, state, suburb).
// isLoading → existing spinner; matches.length === 0 → existing empty state.
```

- [ ] **Step 2: Pass candidate via nav params (no extra fetch)** — on candidate tap:

```js
navigation.navigate(screenNames.MANUAL_CANDIDATE_PROFILE, { candidate: item, jobId });
```

- [ ] **Step 3: Wire ManualCandidateProfile** — read the candidate from route params instead of `DUMMY_JOB_SEEKERS.find(...)`:

```js
const { candidate, jobId } = route.params;
// render the frozen profile from `candidate`; fields with no backend source (badge, languages,
// reviews, references) are null/empty and the card already tolerates them.
```

- [ ] **Step 4: Wire "Send offer"** — replace `dispatch(sendManualOffer(...))`:

```js
import { useSendOffer } from '@/api/offers/offers.query';
const sendOffer = useSendOffer();
const handleSendOffer = async ({ expiryHours, message }) => {
  try {
    await sendOffer.mutateAsync({ jobId, candidateId: candidate.id, expiryHours, message });
    navigation.navigate(screenNames.MANUAL_OFFERS, { jobId });
  } catch { /* hook toasts */ }
};
// gate the modal's Send button with sendOffer.isPending
```

- [ ] **Step 5: Lint** — Run: `npx eslint <both files>` · Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(recruiter): wire candidate matching + send offer to API"
```

### Task 10 (E4): Recruiter offers list + withdraw — `ManualOffers`

**Files:**
- Modify: `src/screens/main/Recruiter/ManualSearchSteps/ManualOffers.jsx`

- [ ] **Step 1: Wire the offers list per tab** — replace `useSelector(selectManualOffers)` and the `DUMMY_JOB_SEEKERS` lookup:

```js
import { useSentOffers, useWithdrawOffer } from '@/api/offers/offers.query';
const { data: offers = [], isLoading } = useSentOffers(activeTabStatus); // 'pending'|'accepted'|'declined'|'expired'|'withdrawn'
// filter by jobId in-screen if the screen is job-scoped: offers.filter(o => !jobId || o.jobId === jobId)
```

- [ ] **Step 2: Remove client-side expiry logic** — delete the local `expireManualOffers`/timer expiry; the backend returns the correct status (it lazily expires on read).

- [ ] **Step 3: Wire withdraw**

```js
const withdraw = useWithdrawOffer();
const onWithdraw = (offerId) => withdraw.mutate(offerId); // hook toasts + invalidates
// gate the withdraw button with withdraw.isPending
```

- [ ] **Step 4: Lint** — Run: `npx eslint src/screens/main/Recruiter/ManualSearchSteps/ManualOffers.jsx` · Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(recruiter): wire sent-offers list + withdraw to API"
```

### Task 11 (E5): Jobseeker received offers + accept/decline

**Files:**
- Modify: the jobseeker received-offers screen + its accept/decline UI
  (locate: `grep -rln "jobSeekerOffers\|activeOffers\|acceptedOffers" src/screens/main/JobSeeker src/store`)

- [ ] **Step 1: Wire the received list**

```js
import { useReceivedOffers } from '@/api/offers/offers.query';
const { data: offers = [], isLoading } = useReceivedOffers(activeTabStatus); // 'pending'|'accepted'|'declined'|...
```

- [ ] **Step 2: Wire accept**

```js
import { useAcceptOffer } from '@/api/offers/offers.query';
const accept = useAcceptOffer();
const onAccept = (offerId) => accept.mutate(offerId); // gate button with accept.isPending
```

- [ ] **Step 3: Wire decline (keep the frozen rule)** — reason REQUIRED when `matchPercentage >= 70`, validated in-screen exactly as today:

```js
import { useDeclineOffer } from '@/api/offers/offers.query';
const decline = useDeclineOffer();
const onDecline = async (offer, reason) => {
  if (offer.matchPercentage >= 70 && !reason) {
    showToast('Please select a reason', 'Error', toastTypes.error); // existing copy/validation
    return;
  }
  try { await decline.mutateAsync({ id: offer.id, reason: reason || '' }); }
  catch { /* hook toasts; 409 INVALID_STATE message surfaces + list invalidates */ }
};
```

- [ ] **Step 4: Lint** — Run: `npx eslint <the screen file(s)>` · Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(jobseeker): wire received offers + accept/decline to API"
```

---

## Phase F — End-to-end verification

### Task 12: Two-account manual e2e + eslint sweep

**Prereq:** backend reachable. Either point `src/api/apiClient.js` `LOCAL_HOST` at a running local backend (on the user's alt port), OR temporarily at the live ALB host `alb-squadgoo-api-1340218315.ap-southeast-2.elb.amazonaws.com` with port/path adjusted. Run the app on the iOS simulator.

- [ ] **Step 1: eslint sweep of all new/changed files**

Run: `npx eslint src/api/jobs src/api/offers src/api/preferences src/screens/main/Recruiter/ManualSearchSteps`
Expected: no new errors attributable to this work.

- [ ] **Step 2: Manual loop — jobseeker account**
  - Log in as a jobseeker → PreferredJobs → add a preference (industry/role/pay/tax) → confirm it persists (reload list).

- [ ] **Step 3: Manual loop — recruiter account**
  - Log in as a recruiter → post a job matching that preference → open match list → confirm the jobseeker appears with a match % → open candidate → Send offer.

- [ ] **Step 4: Back to jobseeker**
  - Received offers shows the offer as "pending" → Accept → status flips to accepted.
  - (Separately) test Decline with a ≥70% match → confirm reason is required; with <70% → optional.

- [ ] **Step 5: Back to recruiter**
  - Sent offers shows "accepted". Test Withdraw on a still-pending offer. Re-accept an accepted offer → confirm the 409 error toast appears and the list refreshes.

- [ ] **Step 6: Draft path**
  - Save a draft → see it in drafts → edit → publish → it moves to posted.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A && git commit -m "fix: address issues found during manual e2e of manual job/offer flow"
```

---

## Notes / out of scope
- **Escrow/wallet (Phase 3, Stripe):** match-fee is calculated only this phase. No balance gate, hold, or deduct. Tracked separately with the admin team (they own `WalletTransaction`/`EscrowLedger`).
- **Quick search (Phase 2b):** auto-match/auto-offer/modification flow — not in this plan.
- **Candidate-card rich fields** (badge, languages, structured experience, reviews, references): no backend source yet; render null/empty (frozen card tolerates).
