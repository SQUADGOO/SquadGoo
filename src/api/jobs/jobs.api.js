import {request} from '../apiClient';

const normalizeJob = j => (j ? {...j, id: j._id ?? j.id} : j);
const normalizeCandidate = c => (c ? {...c, id: c.id ?? c._id} : c);

// Create a job. `status` is 'posted' (post now) or 'draft' (save draft). The backend
// normalises UI aliases (jobTitle/jobType/workLocation/staffCount) and dumps extras to meta,
// so we forward the assembled wizard object as-is and just coerce numbers + status.
export const createJob = async jobData => {
  const body = {
    ...jobData,
    salaryMin:
      jobData.salaryMin != null ? Number(jobData.salaryMin) : undefined,
    salaryMax:
      jobData.salaryMax != null ? Number(jobData.salaryMax) : undefined,
  };
  const res = await request('/jobs', {method: 'post', body});

  return normalizeJob(res?.job ?? res);
};

export const listMyJobs = async status => {
  const res = await request('/jobs', {
    method: 'get',
    params: {status, limit: 50},
  });

  return (res?.jobs ?? []).map(normalizeJob);
};

export const getJob = async id => {
  const res = await request(`/jobs/${id}`, {method: 'get'});

  return normalizeJob(res?.job ?? res);
};

export const updateJobDraft = async (id, jobData) => {
  const res = await request(`/jobs/${id}`, {method: 'put', body: jobData});

  return normalizeJob(res?.job ?? res);
};

export const publishJob = async id => {
  const res = await request(`/jobs/${id}/publish`, {method: 'post'});

  return normalizeJob(res?.job ?? res);
};

// Delete a draft job (backend allows drafts only).
export const deleteJob = async id => {
  await request(`/jobs/${id}`, {method: 'delete'});

  return {id};
};

// Close (cancel) a live job — recruiter removes it from the active list.
export const closeJob = async id => {
  const res = await request(`/jobs/${id}/close`, {method: 'post'});

  return normalizeJob(res?.job ?? res);
};

export const getJobCandidates = async jobId => {
  const res = await request(`/jobs/${jobId}/candidates`, {
    method: 'get',
    params: {limit: 50},
  });

  return (res?.candidates ?? []).map(normalizeCandidate);
};
