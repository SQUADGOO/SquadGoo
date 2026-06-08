import {request} from '../apiClient';

// Backend offer status ⇄ UI status. UI shows backend `sent` as `pending`.
const toUiStatus = s => (s === 'sent' ? 'pending' : s);
const toApiStatus = s => (s === 'pending' ? 'sent' : s);

// The GET routes populate jobseeker/recruiter (name fields) + job (title). These cope with
// both the populated object and a bare ObjectId, and always expose ids back as strings so
// screen-side `=== candidate.id` comparisons keep working.
const idOf = v => (v && typeof v === 'object' ? (v._id ?? v.id) : v);
const nameOf = u =>
  u && typeof u === 'object'
    ? [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email
    : undefined;
const avatarOf = u => (u && typeof u === 'object' ? u.profilePhoto : undefined);

const normalizeOffer = o => {
  if (!o) return o;
  const jobseeker = o.jobseekerId;
  const recruiter = o.createdByRecruiterId;
  const job = o.jobId;

  return {
    ...o,
    id: o._id ?? o.id,
    status: toUiStatus(o.status),
    jobseekerId: idOf(jobseeker),
    createdByRecruiterId: idOf(recruiter),
    jobId: idOf(job),
    candidateId: idOf(jobseeker),
    candidateName: nameOf(jobseeker) ?? o.candidateName,
    candidateAvatar: avatarOf(jobseeker),
    recruiterName: nameOf(recruiter) ?? o.recruiterName,
    recruiterAvatar: avatarOf(recruiter),
    jobTitle:
      (job && typeof job === 'object' ? job.title : undefined) ?? o.jobTitle,
  };
};

// Recruiter: send an offer. Screen passes candidateId/expiryHours; map to backend names.
export const sendOffer = async ({
  jobId,
  candidateId,
  expiryHours,
  message,
  payRate,
}) => {
  const body = {
    jobId,
    jobseekerId: candidateId,
    message,
    payRate,
    expiresInHours: expiryHours,
  };
  const res = await request('/offers', {method: 'post', body});

  return normalizeOffer(res?.offer ?? res);
};

export const listSentOffers = async status => {
  const res = await request('/offers', {
    method: 'get',
    params: {status: toApiStatus(status), limit: 50},
  });

  return (res?.offers ?? []).map(normalizeOffer);
};

export const withdrawOffer = async id => {
  const res = await request(`/offers/${id}/withdraw`, {method: 'post'});

  return normalizeOffer(res?.offer ?? res);
};

// Jobseeker side.
export const listReceivedOffers = async status => {
  const res = await request('/offers/received', {
    method: 'get',
    params: {status: toApiStatus(status), limit: 50},
  });

  return (res?.offers ?? []).map(normalizeOffer);
};

export const acceptOffer = async id => {
  const res = await request(`/offers/${id}/accept`, {method: 'post'});

  return normalizeOffer(res?.offer ?? res);
};

export const declineOffer = async (id, reason) => {
  const res = await request(`/offers/${id}/decline`, {
    method: 'post',
    body: {reason},
  });

  return normalizeOffer(res?.offer ?? res);
};
