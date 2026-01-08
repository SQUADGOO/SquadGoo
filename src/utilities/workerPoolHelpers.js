/**
 * Helpers for worker pool list screens (employees/contractors/labor pool).
 * Works with dummy datasets that use:
 * - name, location, suburb, preferredRoles[], industries[], skills[]
 * - badge, radiusKm, acceptanceRating, payPreference{min,max}, availability{summary}
 */

export const workerMatchesQuery = (worker, query) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    worker?.name,
    worker?.location,
    worker?.suburb,
    ...(worker?.preferredRoles || []),
    ...(worker?.industries || []),
    ...(worker?.skills || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
};

export const filterAndSortWorkers = (
  workers,
  { query = '', location = 'all', role = 'all', badge = 'all', radius = 'all', sort = 'rating_desc' } = {}
) => {
  let list = (workers || []).filter((w) => {
    if (location !== 'all' && w?.location !== location) return false;
    if (badge !== 'all' && w?.badge !== badge) return false;
    if (role !== 'all' && !(w?.preferredRoles || []).includes(role)) return false;

    if (radius !== 'all') {
      const maxRadius = typeof radius === 'number' ? radius : Number(radius);
      if (!Number.isNaN(maxRadius)) {
        if ((w?.radiusKm || 0) > maxRadius) return false;
      }
    }

    return workerMatchesQuery(w, query);
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case 'rate_asc':
        return (a?.payPreference?.min || 0) - (b?.payPreference?.min || 0);
      case 'radius_asc':
        return (a?.radiusKm || 0) - (b?.radiusKm || 0);
      case 'rating_desc':
      default:
        return (b?.acceptanceRating || 0) - (a?.acceptanceRating || 0);
    }
  });

  return list;
};

export const toWorkerCardItem = (worker, { roleFallback = 'Worker' } = {}) => ({
  id: worker?.id,
  name: worker?.name,
  role: worker?.preferredRoles?.[0] || roleFallback,
  location: `${worker?.suburb || ''}${worker?.suburb ? ', ' : ''}${worker?.location || ''}${
    worker?.radiusKm ? ` (${worker.radiusKm}km radius)` : ''
  }`,
  availability: worker?.availability?.summary || 'Available',
  rate: `$${worker?.payPreference?.min || 0}–${worker?.payPreference?.max || 0}/hour`,
  rating: ((worker?.acceptanceRating || 0) / 10).toFixed(1),
  originalData: worker,
});

export const toWorkerCardItems = (workers, config) => (workers || []).map((w) => toWorkerCardItem(w, config));


