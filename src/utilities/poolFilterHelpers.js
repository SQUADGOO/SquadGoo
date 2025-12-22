const defaultNormalize = (v) => (typeof v === 'string' ? v.trim() : v);

/**
 * Build dropdown options from a list of items.
 *
 * @param {Array<any>} items
 * @param {(item: any) => any | any[] | null | undefined} getValues - returns a single value or array of values
 * @param {{
 *   allLabel?: string,
 *   allValue?: any,
 *   sort?: boolean,
 *   normalize?: (v: any) => any
 * }} config
 * @returns {Array<{label: string, value: any}>}
 */
export const buildSelectOptions = (
  items,
  getValues,
  { allLabel = 'All', allValue = 'all', sort = true, normalize = defaultNormalize } = {}
) => {
  const set = new Set();

  for (const item of items || []) {
    const raw = typeof getValues === 'function' ? getValues(item) : undefined;

    if (Array.isArray(raw)) {
      raw.forEach((v) => {
        const n = normalize(v);
        if (n !== null && n !== undefined && n !== '') set.add(n);
      });
    } else {
      const n = normalize(raw);
      if (n !== null && n !== undefined && n !== '') set.add(n);
    }
  }

  const values = Array.from(set);
  if (sort) values.sort((a, b) => String(a).localeCompare(String(b)));

  return [{ label: allLabel, value: allValue }, ...values.map((v) => ({ label: String(v), value: v }))];
};

// Convenience helpers for pool screens (dummy datasets share these fields)
export const getLocationOptions = (items) =>
  buildSelectOptions(items, (x) => x?.location, { allLabel: 'All locations' });

export const getBadgeOptions = (items) =>
  buildSelectOptions(items, (x) => x?.badge, { allLabel: 'All badges' });

export const getPreferredJobOptions = (items) =>
  buildSelectOptions(items, (x) => x?.preferredJobs, { allLabel: 'All jobs' });

export const getPreferredRoleOptions = (items) =>
  buildSelectOptions(items, (x) => x?.preferredRoles, { allLabel: 'All roles' });

// Common sort options used across pool screens
export const POOL_SORT_OPTIONS = [
  { label: 'Rating (high → low)', value: 'rating_desc' },
  { label: 'Members (high → low)', value: 'members_desc' },
  { label: 'Rate min (low → high)', value: 'rate_asc' },
  { label: 'Radius (low → high)', value: 'radius_asc' },
];

// Common radius filter options (km)
// Values are either 'all' or a number representing "max radius" in km.
export const POOL_RADIUS_OPTIONS = [
  { label: 'Any radius', value: 'all' },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 20 km', value: 20 },
  { label: 'Within 30 km', value: 30 },
  { label: 'Within 40 km', value: 40 },
  { label: 'Within 50 km', value: 50 },
];


