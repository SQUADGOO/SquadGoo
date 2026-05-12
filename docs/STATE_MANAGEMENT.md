# State Management

## Stack
Redux Toolkit + redux-persist + TanStack Query

- **Redux** — persistent user/session state (auth, wallet, jobs, etc.)
- **TanStack Query** — server state (API data, loading/error states)
- **redux-persist** — survives app restarts (auth token stays logged in)

---

## Redux slices

All slices live in `src/store/`.

| Slice file | State key | Purpose |
|------------|-----------|---------|
| `authSlice.js` | `auth` | Token, refresh token, user info, role |
| `walletSlice.js` | `wallet` | SG coins balance, transactions |
| `jobsSlice.js` | `jobs` | Job listings |
| `manualOffersSlice.js` | `manualOffers` | Manual search offers |
| `quickSearchSlice.js` | `quickSearch` | Quick search offers |
| `jobSeekerOffersSlice.js` | `jobSeekerOffers` | Offers received by jobseeker |
| `jobSeekerPreferredSlice.js` | `jobSeekerPreferred` | Preferred job settings |
| `jobSeekerExperienceSlice.js` | `jobSeekerExperience` | Work experience |
| `chatSlice.js` | `chat` | Chat threads & messages |
| `notificationsSlice.js` | `notifications` | In-app notifications |
| `marketplaceSlice.js` | `marketplace` | Marketplace listings |
| `bankSlice.js` | `bank` | Bank accounts |
| `contactRevealSlice.js` | `contactReveal` | Revealed contacts |
| `recruiterSettingsSlice.js` | `recruiterSettings` | Recruiter preferences |

---

## Auth slice (most important)

```js
// src/store/authSlice.js
import { login, logout, setTokens, updateUserFields } from '@/store/authSlice';
```

### State shape
```js
{
  token: string | null,           // JWT access token (15 min)
  refreshToken: string | null,    // Opaque refresh token (30 days)
  userId: string | null,          // Backend MongoDB _id
  role: string | null,            // "jobseeker" | "recruiter" | "individual"
  userInfo: object | null         // Full user profile from backend
}
```

### Reducers
```js
login(backendResponse)     // Set all auth state from API response
logout()                   // Clear all auth state
setTokens({ token, refreshToken }) // Update tokens after refresh (interceptor use)
updateUserFields(fields)   // Merge partial profile update into userInfo
```

### Reading in components
```js
const role     = useSelector(state => state.auth.role);
const userInfo = useSelector(state => state.auth.userInfo);
const token    = useSelector(state => state.auth.token);
```

---

## TanStack Query setup

Provider is already wired in `App.tsx` (or providers file).

### Query key conventions
```js
['me']                  // Current user profile
['jobs']                // Job listings
['offers', userId]      // Offers for a specific user
// etc.
```

### When to use Query vs Mutation
- `useQuery` — for fetching data (GET). Auto-refetches, caches, shows stale data.
- `useMutation` — for sending data (POST/PUT/DELETE). Manual trigger.

---

## Pattern: server state + Redux together

Some data lives in both TanStack Query cache AND Redux (e.g. user profile):

```
useGetMe (TanStack Query)
  ↓ fetches GET /users/me
  ↓ onSuccess: dispatch(updateUserFields(user))
  ↓ Redux userInfo updated
```

Screens that need profile data can read from either:
- `useGetMe()` — if they need loading state or refetch
- `useSelector(state => state.auth.userInfo)` — if they just need the value

---

## Store file
`src/store/store.js` — configures Redux store with redux-persist.

Persisted keys (survive app restart): `auth`, `wallet` (and others configured there).
