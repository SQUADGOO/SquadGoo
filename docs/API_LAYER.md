# API Layer — Structure & Patterns

## Folder structure

```
src/api/
  apiClient.js        ← Axios instance, base URL, interceptors
  auth/
    auth.api.js       ← Raw API functions for auth endpoints
    auth.query.js     ← TanStack Query hooks for auth
  user/
    user.api.js       ← Raw API functions for user/profile endpoints
    user.query.js     ← TanStack Query hooks for user/profile
  jobSeeker/          ← (future) jobseeker-specific endpoints
  recruiter/          ← (future) recruiter-specific endpoints
```

## Two-layer pattern

Every feature follows the same two-file pattern:

```
feature.api.js   → plain async functions that call the API
feature.query.js → TanStack Query hooks that wrap those functions
                   + dispatch Redux actions on success/error
```

Screens only ever import from `*.query.js`, never from `*.api.js` directly.

## Base URL

Defined as a single constant at the top of `src/api/apiClient.js`:

```js
// Change this one line when moving to a server
// Android emulator  → http://10.0.2.2:5000/api/mobile-app/
// iOS simulator     → http://localhost:5000/api/mobile-app/
// Physical device   → http://<machine-local-ip>:5000/api/mobile-app/
const BASE_URL = 'http://10.0.2.2:5000/api/mobile-app/';
```

## Request interceptor
Automatically attaches `Authorization: Bearer <token>` from Redux `auth.token` to every request. No manual header setting needed in screens.

## Refresh token interceptor
When any request gets a 401:
1. Pauses and queues any other requests that arrive during refresh
2. Calls `POST /auth/refresh` with `{ userId, refreshToken }` from Redux
3. If refresh succeeds → updates Redux tokens, retries original request + queued requests
4. If refresh fails → dispatches `logout()`, clears Redux state

This is fully automatic — screens never handle 401 manually.

## Currently implemented hooks

### Auth — `src/api/auth/auth.query.js`

```js
import { useLogin, useRegister, useLogout } from '@/api/auth/auth.query';
```

| Hook | Mutation/Query | On success |
|------|---------------|------------|
| `useLogin()` | mutation | dispatches `login(res)` to Redux |
| `useRegister()` | mutation | dispatches `login(res)` to Redux (auto-logs in) |
| `useLogout()` | mutation | dispatches `logout()` to Redux always (even if API fails) |

Usage:
```js
const { mutate: login, isPending } = useLogin();
login({ email, password });

const { mutate: registerUser, isPending } = useRegister();
registerUser({ email, password, userType, firstName, lastName });

const { mutate: logout } = useLogout();
logout();
```

### User / Profile — `src/api/user/user.query.js`

```js
import { useGetMe, useUpdateMe } from '@/api/user/user.query';
```

| Hook | Mutation/Query | On success |
|------|---------------|------------|
| `useGetMe()` | query (auto-fetches) | dispatches `updateUserFields(user)` |
| `useUpdateMe()` | mutation | dispatches `updateUserFields(user)`, shows toast |

Usage:
```js
// Auto-fetches on mount, updates Redux
const { data: user, isLoading } = useGetMe();

// Update profile
const { mutate: updateMe, isPending } = useUpdateMe();
updateMe({ firstName: 'Jane', city: 'Sydney' });
```

## How to add a new feature

1. Create `src/api/<feature>/<feature>.api.js`:
```js
import { request } from '../apiClient';

export const getSomething = () => request('/something', { method: 'get' });
export const createSomething = (data) => request('/something', { method: 'post', body: data });
```

2. Create `src/api/<feature>/<feature>.query.js`:
```js
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getSomething, createSomething } from './feature.api';

export const useGetSomething = () =>
  useQuery({ queryKey: ['something'], queryFn: getSomething });

export const useCreateSomething = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: createSomething,
    onSuccess: (res) => { /* dispatch if needed */ },
    onError: (err) => { /* show toast */ },
  });
};
```

3. Import the hook in your screen — done.

## Error handling

Backend errors come as:
```json
{ "error": { "code": "SOME_CODE", "message": "Human readable" } }
```

In hooks, access via:
```js
onError: (err) => {
  const message = err?.response?.data?.error?.message || 'Something went wrong';
  showToast(message, 'Error', toastTypes.error);
}
```

## File reference
| File | Purpose |
|------|---------|
| `src/api/apiClient.js` | Axios instance, BASE_URL, request/refresh interceptors |
| `src/api/auth/auth.api.js` | `loginUser`, `register`, `refreshToken`, `logout` |
| `src/api/auth/auth.query.js` | `useLogin`, `useRegister`, `useLogout` |
| `src/api/user/user.api.js` | `getMe`, `updateMe` |
| `src/api/user/user.query.js` | `useGetMe`, `useUpdateMe` |
