# SquadGoo Mobile App — Developer Docs

## Quick links

| Doc | What's in it |
|-----|-------------|
| [BACKEND_SETUP.md](./BACKEND_SETUP.md) | How to run the backend, all API endpoints, request/response shapes |
| [AUTH_FLOW.md](./AUTH_FLOW.md) | Login / register / logout / token refresh flow end-to-end |
| [API_LAYER.md](./API_LAYER.md) | API folder structure, patterns, how to add new endpoints |
| [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | Redux slices, TanStack Query, how they work together |
| [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) | What's wired to real backend vs still on dummy data |

---

## Start here for a new session

### 1. Start the backend
On the **`mobile/auth`** branch of `squadgoo-admin-panel-backend`:

```bash
# macOS
cd ~/Documents/Projects/upwork/PusparajGiri/adminpanel/squadgoo-admin-panel-backend
# Windows
cd D:\Projects\PushpaRaj\SquadGooFiles\squadgoo-admin-panel-backend

git checkout mobile/auth
npm install     # first time only / after pulling new deps
npm start
```
Verify: `GET http://localhost:5001/api/health` → `{ "ok": true, "db": "connected" }`

### 2. Start Metro
On the **`feature/auth-implementation`** branch of `SquadGoo`:

```bash
yarn start
```

### 3. Run on Android / iOS
```bash
yarn android
# or
yarn ios
```

> If iOS build fails on Pods (e.g. `TOCropViewController` version mismatch after a pull):
> ```bash
> cd ios && pod install
> # or, if the specific pod is locked at an old version:
> cd ios && pod update <PodName>
> ```

> **Base URL** is set in `src/api/apiClient.js`.
> Match it to the backend's `PORT` (currently `5001`).
> Android emulator uses `http://10.0.2.2:<PORT>/api/mobile-app/`.
> Physical device: change to `http://<your-machine-ip>:<PORT>/api/mobile-app/`.

---

## Current state (2026-05-12)

- ✅ Auth fully working end-to-end (register / login / logout / token refresh)
- ✅ Three roles supported: `jobseeker`, `recruiter`, `individual`
- ✅ API layer wired with automatic token refresh on 401
- ⏳ Profile screens not yet wired to `/users/me`
- ❌ Jobs, KYC, Wallet, Chat, etc. still on dummy data

See [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) for the full breakdown.

---

## App roles → navigation

| `userType` from backend | Screen stack |
|------------------------|-------------|
| `recruiter` | `DrawerNavigator` |
| `jobseeker` | `JobSeekerDrawerNavigator` |
| `individual` | `MainNavigator` |

Role is set in Redux `auth.role` on login and drives `RootNavigator.js` automatically.
