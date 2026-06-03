# Manual job/offer loop — end-to-end flow sketch

Visual companion to `2026-06-02-job-offers-manual-loop-mobile-wiring-design.md`.
Shows how the wired flow works across both roles. All endpoints are under
`/api/mobile-app` (via the shared `apiClient`). Legend:

```
[Screen]      mobile screen (frozen UI)
useXxx()      React Query hook (src/api/.../*.query.js)
==> POST ...  HTTP call to backend (mapped in *.api.js)
{status}      resulting DB status
```

---

## A. The full loop (happy path)

```
 JOBSEEKER (role: jobseeker)              BACKEND                         RECRUITER (role: recruiter)
 ───────────────────────────             ───────────────                 ────────────────────────────

 0. [PreferredJobs / AddJobStep2]
    useCreatePreference()
        ==> POST /jobseeker/preferences ──► JobseekerPreference doc
                                            saved {manualOffers:true}
                                                  │
                                                  │ (this is what makes the
                                                  │  jobseeker show up in
                                                  │  recruiter matching)
                                                  ▼
                                                                          1. [ManualSearch → StepTwo →
                                                                              AbilityToWork → StepThree →
                                                                              StepFour]  (wizard form
                                                                              state in Redux, no API yet)
                                                                                  │
                                                                          2. [JobPreview]
                                                                             "Post now" → useCreateJob()
                                            Job doc created ◄══════════════════ ==> POST /jobs {status:posted}
                                            {job.status: posted}                       returns job._id
                                                  │                                       │
                                                  │                          3. navigate ► [ManualMatchList]
                                                  │                             useJobCandidates(jobId)
                                            scan JobseekerPreference  ◄═══════════ ==> GET /jobs/:id/candidates
                                            score each (scorePreference)
                                            return ranked candidates ═══════════════►  list of scored
                                            (incl. our jobseeker @ N%)               candidates rendered
                                                                                          │
                                                                          4. tap candidate ► [ManualCandidateProfile]
                                                                             (candidate passed via nav params,
                                                                              no refetch)
                                                                                          │
                                                                          5. "Send offer" (modal: expiry+message)
                                                                             useSendOffer()
                                                                             [Phase 3 (Stripe escrow): balance
                                                                              gate + HOLD amount here. Phase 2a:
                                                                              fee calculated only — see note F]
                                            Offer doc created  ◄══════════════════ ==> POST /offers
                                            {offer.status: sent}                        {jobId, jobseekerId,
                                            +match-fee calc (their layer)               message, expiresInHours}
                                            job.status: posted→has_applicants
                                                  │                                          │
                                                  │                          6. navigate ► [ManualOffers]
                                                  │                             useSentOffers() shows offer
                                                  ▼                             as "pending" (sent→pending)
 7. [Received offers]
    useReceivedOffers()
        ==> GET /offers/received ──────────► returns offer {sent}
    offer shown as "pending"
        │
 8a. ACCEPT → useAcceptOffer()
        ==> POST /offers/:id/accept ───────► {offer.status: accepted}
                                            +charge match-fee (their layer)
                                            +open job-offer chat thread (their layer)
                                                  │
                                                  ▼
                                                                          9. [ManualOffers] (refetch/invalidate)
                                                                             offer now shows "accepted"  ✅ LOOP DONE

 8b. DECLINE → useDeclineOffer(reason)
        (reason REQUIRED if matchPercentage ≥ 70 — validated in-screen)
        ==> POST /offers/:id/decline ──────► {offer.status: declined}
                                                                          → recruiter sees "declined"
```

---

## B. Alternate / edge branches

```
DRAFT branch (recruiter, step 2):
  [JobPreview] "Save draft" → useCreateJob({status:draft})  ==> POST /jobs {status:draft}  {job.status: draft}
        │
        ├─ [Job/Draft list]  useMyJobs('draft')             ==> GET /jobs?status=draft
        ├─ edit  → useUpdateJobDraft(id)                    ==> PUT /jobs/:id   (draft only; 409 if not draft)
        └─ go live → usePublishJob(id)                      ==> POST /jobs/:id/publish   {draft → posted}

WITHDRAW (recruiter, after sending):
  [ManualOffers] withdraw → useWithdrawOffer(id)            ==> POST /offers/:id/withdraw  {sent → withdrawn}
        (409 if offer already accepted/declined/expired)

EXPIRY (automatic, lazy):
  any GET /offers or /offers/received past expiresAt        ──► {sent → expired}  (server flips it on read)

RACE / re-action (409 handling):
  accept/decline/withdraw on an offer no longer {sent}      ──► 409 INVALID_STATE
        → onError toast (error.message) + invalidate list to refresh the real state
```

---

## C. Status state machines

```
JOB.status:
    draft ──publish──► posted ──(first offer sent)──► has_applicants ──► (matched/in_progress/…* future phases)
      ▲                                                                   *Phase 3 work-session statuses
      └─ edit allowed only while draft

OFFER.status:
    created ──► sent ──accept──► accepted
                 │  ├─decline─► declined
                 │  ├─withdraw► withdrawn   (recruiter)
                 │  └─expiresAt► expired    (lazy, on read)
                 │
       UI maps "sent" ⇄ "pending" for display
```

---

## D. Screen → hook → endpoint quick map

| Role | Screen | Action | Hook | Endpoint |
|------|--------|--------|------|----------|
| Jobseeker | PreferredJobs / AddJobStep2 | list / add / edit / delete | usePreferences / useCreatePreference / useUpdatePreference / useDeletePreference | `/jobseeker/preferences[/:id]` |
| Recruiter | JobPreview | post / save draft | useCreateJob | `POST /jobs` |
| Recruiter | Job & draft list | list by status | useMyJobs(status) | `GET /jobs?status=` |
| Recruiter | (edit draft) | edit / publish | useUpdateJobDraft / usePublishJob | `PUT /jobs/:id` · `POST /jobs/:id/publish` |
| Recruiter | ManualMatchList | matched candidates | useJobCandidates(jobId) | `GET /jobs/:id/candidates` |
| Recruiter | ManualCandidateProfile | send offer | useSendOffer | `POST /offers` |
| Recruiter | ManualOffers | sent offers / withdraw | useSentOffers / useWithdrawOffer | `GET /offers?status=` · `POST /offers/:id/withdraw` |
| Jobseeker | Received offers | received / accept / decline | useReceivedOffers / useAcceptOffer / useDeclineOffer | `GET /offers/received` · `POST /offers/:id/{accept,decline}` |

---

## E. Build order (matches design Section 3)

```
D1  api/query layer (jobs, offers, preferences)        ── no screen changes
 │
E1  Jobseeker preferences  ◄── FIRST (matching needs data)
 │
E2  Recruiter job create + lists + drafts
 │
E3  Recruiter matches + candidate profile
 │
E4  Recruiter offers list + withdraw
 │
E5  Jobseeker received offers + accept/decline
 │
F   Two-account end-to-end test + eslint sweep
```

The dotted dependency: **E1 must exist (a jobseeker with a saved preference) before E3 shows any candidate** — that's why preferences are wired first.

---

## F. Backend reconciliation note (2026-06-03)
`main` (admin team / `SQUADGOO ADMIN`) added a parallel mobile layer that **wraps** our offer flow:
- **On send (`POST /offers`)** their layer **calculates** a wallet match-fee (today: calculation only — no balance check, no deduction; wallet top-up/withdraw are 501 stubs).
- **On accept** their layer **charges** the match-fee (meta only today) and **opens a job-offer chat thread**.

We are **combining** both (our hiring lifecycle + their fee/chat layer), not replacing either.

✅ **RESOLVED (client, 2026-06-03):** escrow model = recruiter needs balance for N staff to start a
search → **hold** amount on send → **deduct** on accept → release on decline/expire. Funding = **Stripe**.
**Deferred to Phase 3** (wallet not functional yet: top-up is a 501 stub).
**Phase 2a (now):** match-fee is **calculated only** (meta) — NO balance gate / hold / deduct. The flow
above runs end-to-end without money movement. Phase 3 adds Stripe top-up + balance gate + hold/deduct/release.
```
