/**
 * Helpers for squad pool list screens (dummy or API-provided squads).
 */

export const squadMatchesQuery = (squad, query) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    squad?.name,
    squad?.description,
    squad?.location,
    squad?.suburb,
    ...(squad?.preferredJobs || []),
    ...(squad?.specialties || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
};

export const filterAndSortSquads = (
  squads,
  { query = '', location = 'all', job = 'all', badge = 'all', sort = 'rating_desc' } = {}
) => {
  let list = (squads || []).filter((squad) => {
    if (location !== 'all' && squad?.location !== location) return false;
    if (badge !== 'all' && squad?.badge !== badge) return false;
    if (job !== 'all' && !(squad?.preferredJobs || []).includes(job)) return false;
    return squadMatchesQuery(squad, query);
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case 'members_desc':
        return (b?.memberCount || 0) - (a?.memberCount || 0);
      case 'rate_asc':
        return (a?.payPreference?.min || 0) - (b?.payPreference?.min || 0);
      case 'radius_asc':
        return (a?.radiusKm || 0) - (b?.radiusKm || 0);
      case 'rating_desc':
      default:
        return (b?.averageRating || 0) - (a?.averageRating || 0);
    }
  });

  return list;
};

export const toSquadWorkerCardItem = (squad) => ({
  id: squad?.id,
  name: squad?.name,
  role: `${squad?.memberCount || 0} member${(squad?.memberCount || 0) > 1 ? 's' : ''} • ${
    squad?.preferredJobs?.[0] || 'General'
  }`,
  location: `${squad?.suburb || ''}${squad?.suburb ? ', ' : ''}${squad?.location || ''}${
    squad?.radiusKm ? ` (${squad.radiusKm}km radius)` : ''
  }`,
  availability: squad?.availability?.summary || 'Flexible',
  rate: `$${squad?.payPreference?.min || 0}–${squad?.payPreference?.max || 0}/hour`,
  rating: ((squad?.averageRating || 0) / 10).toFixed(1),
  originalData: squad,
});

export const toSquadWorkerCardItems = (squads) => (squads || []).map(toSquadWorkerCardItem);


