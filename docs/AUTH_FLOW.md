# Authentication Flow

## Overview

The app uses JWT-based auth with short-lived access tokens and long-lived refresh tokens.

| Token | Expiry | Where stored |
|-------|--------|-------------|
| Access token (JWT) | 15 minutes | Redux `auth.token` + axios default header |
| Refresh token (opaque) | 30 days | Redux `auth.refreshToken` |
| User ID | permanent | Redux `auth.userId` (needed for refresh call) |

---

## Login flow

```
User fills email + password on Signin.js
  ↓
handleLogin() calls login({ email, password })
  ↓
useLogin() mutation → POST /auth/login
  ↓
onSuccess: dispatch(loginAction(res))
  ↓
authSlice.login reducer:
  - state.token         = res.accessToken
  - state.refreshToken  = res.refreshToken
  - state.userId        = res.user.id
  - state.role          = res.user.userType   ← "jobseeker" | "recruiter" | "individual"
  - state.userInfo      = { ...res.user, role, name }
  ↓
RootNavigator reads auth.token + auth.role from Redux
  - role === "recruiter"  → DrawerNavigator
  - role === "jobseeker"  → JobSeekerDrawerNavigator
  - role === "individual" → MainNavigator
  - no token              → AuthNavigator (login/signup screens)
```

## Register flow

```
User fills form + selects userType on SignUp.jsx
  ↓
handleSignUp() calls registerUser({ email, password, userType, firstName, lastName })
  ↓
useRegister() mutation → POST /auth/register
  ↓
onSuccess: dispatch(loginAction(res))   ← same as login, user is immediately logged in
  ↓
RootNavigator routes to correct screen automatically
```

## Logout flow

```
User taps logout (any screen)
  ↓
useLogout() mutation → POST /auth/logout   ← invalidates refresh token on backend
  ↓
onSettled: dispatch(logout())              ← always runs, even if API call fails
  ↓
authSlice clears: token, refreshToken, userId, role, userInfo
  ↓
RootNavigator sees no token → shows AuthNavigator
```

## Token refresh flow (automatic)

Handled entirely in `src/api/apiClient.js` — screens never deal with this.

```
Any API call returns 401
  ↓
Refresh interceptor catches it
  ↓
Reads auth.userId + auth.refreshToken from Redux
  ↓
POST /auth/refresh { userId, refreshToken }
  ↓
Success:
  - dispatch setTokens({ token: newAccess, refreshToken: newRefresh })
  - Retry original failed request
  - Flush any queued requests that arrived during refresh
  ↓
Failure (refresh token expired):
  - dispatch logout()
  - User is redirected to login screen
```

---

## Redux auth state shape

```js
// src/store/authSlice.js
{
  token: string | null,          // JWT access token
  refreshToken: string | null,   // opaque refresh token
  userId: string | null,         // MongoDB _id of AppUser
  role: string | null,           // "jobseeker" | "recruiter" | "individual"
  userInfo: {
    id: string,
    userType: string,
    accountType: string | null,  // recruiter only: "owner" | "representative"
    email: string,
    firstName: string | null,
    lastName: string | null,
    phone: string | null,
    profilePhoto: string | null,
    status: string,              // "active" | "inactive" | "suspended" | "deleted"
    kycStatus: string,           // "pending" | "verified" | "rejected"
    kybStatus: string,
    blueTick: boolean,
    role: string,                // same as state.role (for backward compat)
    name: string,                // firstName + lastName combined
  } | null
}
```

## Available reducers

```js
import { login, logout, setTokens, updateUserFields } from '@/store/authSlice';

// Log in (called by useLogin / useRegister on success)
dispatch(login(backendResponse));

// Log out (called by useLogout, or by refresh interceptor on failure)
dispatch(logout());

// Update tokens after refresh (called by apiClient interceptor)
dispatch(setTokens({ token: newAccessToken, refreshToken: newRefreshToken }));

// Merge profile fields into userInfo (called by useGetMe / useUpdateMe on success)
dispatch(updateUserFields({ city: 'Sydney', phone: '0412345678' }));
```

## Reading auth state in screens

```js
import { useSelector } from 'react-redux';

const token    = useSelector(state => state.auth.token);
const role     = useSelector(state => state.auth.role);
const userInfo = useSelector(state => state.auth.userInfo);
const userId   = useSelector(state => state.auth.userId);
```

---

## Relevant files

| File | Role |
|------|------|
| `src/screens/auth/Signin.js` | Login screen |
| `src/screens/auth/SignUp.jsx` | Registration screen |
| `src/api/auth/auth.api.js` | Raw auth API functions |
| `src/api/auth/auth.query.js` | `useLogin`, `useRegister`, `useLogout` hooks |
| `src/api/apiClient.js` | Axios instance + refresh interceptor |
| `src/store/authSlice.js` | Redux auth state + reducers |
| `src/navigation/RootNavigator.js` | Routes based on `auth.token` + `auth.role` |
