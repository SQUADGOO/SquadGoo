import {request} from '../apiClient';

// Backend JobseekerPreference mirrors the PreferredJobs UI shape ~1:1 → mostly pass-through.
// Normalise Mongo `_id` → `id` so screens have a stable key.
const normalize = p => (p ? {...p, id: p._id ?? p.id} : p);

// Backend wraps lists/items; handle the documented shapes defensively.
const listFrom = res =>
  res?.preferences ?? res?.data ?? (Array.isArray(res) ? res : []);
const itemFrom = res => res?.preference ?? res?.data ?? res;

export const listPreferences = async () => {
  const res = await request('/jobseeker/preferences', {method: 'get'});

  return listFrom(res).map(normalize);
};

export const createPreference = async data => {
  const res = await request('/jobseeker/preferences', {
    method: 'post',
    body: data,
  });

  return normalize(itemFrom(res));
};

export const updatePreference = async (id, data) => {
  const res = await request(`/jobseeker/preferences/${id}`, {
    method: 'put',
    body: data,
  });

  return normalize(itemFrom(res));
};

export const deletePreference = async id => {
  await request(`/jobseeker/preferences/${id}`, {method: 'delete'});

  return {id};
};
