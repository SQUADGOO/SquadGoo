# SquadGo Mobile — Claude Code rules

You are a senior React Native engineer working on the SquadGo mobile app.

These conventions mirror the **Rituo** mobile app
(`/Users/qadirali/Documents/Projects/FaloutSolutions/RituoGit/rituo/mobile`),
which is the reference for *patterns*. Apply Rituo's patterns where they map
onto this project's existing structure — but **this project's own rules below
take precedence**.

## Hard constraints (do not violate)

- **Language: JavaScript.** This app is plain React Native + JS. **Do NOT convert
  files to TypeScript** and do NOT add TS config/deps. (Rituo is TS; we are not.)
- **Do NOT restructure existing folders or move/rename existing files.** Keep the
  current `src/**` layout. Follow the conventions for *new* code; leave existing
  code where it is unless explicitly asked to refactor.
- **Do NOT add new dependencies** unless explicitly requested.
- Make changes only inside `mobile/` unless explicitly asked otherwise.
- Prefer existing patterns in `src/**` over introducing new abstractions.

## Stack (current repo)

React Native (bare, not Expo) · JavaScript · React Navigation ·
TanStack React Query (`@tanstack/react-query`) · Redux Toolkit · Axios.

## Project structure (current — keep it)

- `src/api/apiClient.js` — shared axios client + interceptors. All HTTP goes through here.
- `src/api/<feature>/<feature>.api.js` — raw API calls for a feature (e.g. `auth/auth.api.js`, `user/user.api.js`).
- `src/api/<feature>/<feature>.query.js` — TanStack Query hooks (`useQuery`/`useMutation`) for that feature.
- `src/store/` — Redux store (`store.js`) + one `xSlice.js` per domain.
- `src/screens/**` — screen components (keep them thin). Grouped by role/feature (`main/Recruiter`, `main/JobSeeker`, `auth`).
- `src/components/**` — reusable components. `src/core/**` — shared UI primitives.
- `src/theme/**` & `src/styles/**` — design tokens / styling. Avoid hard-coded colours in screens.
- `src/utilities/**` — pure helpers (no React hooks). `src/hooks/**` — custom hooks.
- `src/navigation/**` — navigators. `src/services/**`, `src/providers/**`, `src/permissions/**`.

## API & data-fetching patterns (from Rituo)

- **Two layers per feature**: `*.api.js` holds raw axios calls returning typed/normalized
  data; `*.query.js` wraps them in TanStack hooks. Keep them separate.
- **Query keys**: define a `xxxKeys` object with factory functions per feature
  (e.g. `authKeys.user()`), instead of inline string arrays.
- **Errors**: normalize axios/network errors to a user-friendly message in the api layer.
  Surface user-visible failures via the toast util (`src/utilities/toastConfig.js`).
- **After a mutation that changes the user**, refetch the full user from `/users/me` and
  update Redux + the query cache — don't trust partial update responses to carry every field.
- **File uploads**: use native `fetch` (not axios) for reliable Android multipart.
- **Server state lives in React Query; Redux is only for truly-global client state.**
  Don't duplicate server state into Redux.

## Null-safety, error handling & wiring (REQUIRED — these bugs keep recurring)

When wiring any screen to the backend, every one of these must hold. They exist because
real crashes/silent-failures happened from skipping them.

**1. Never read a property off a possibly-null selector value.**
`state.auth.userInfo` is `null` when logged out or while a session refreshes — and the 401
interceptor sets it to null on token expiry. So:
- Guard the root: `const info = useSelector(s => s.auth.userInfo) || {};` then `info.firstName`.
- Or always optional-chain: `userInfo?.firstName`. Never `userInfo.firstName`.
- Read backend sub-objects the same way: `const addr = userData?.address || {};`
  (profile sub-sections live under `address` / `tax` / `visa` / `social`; the user object
  also carries top-level `email`, `phone`, `firstName`, `lastName`, `profilePhoto`,
  `kycStatus`, `kybStatus`). Match these exact field names — don't invent `full_address`,
  `contactDetails`, `taxInformation`, etc.

**2. No fake "success" stubs.** Never ship a `setTimeout(() => showToast('...success'))` or a
commented-out `// await save(...)`. If a screen has a Save button, it must call a real
`*.query.js` mutation. A stub that lies about success is worse than an error.

**3. Verify the hook actually exists before importing it.** Importing a non-existent hook
(e.g. `useUpdateProfile`, `useUpdateJobSeekerProfile`) yields `undefined` and crashes when
called. Confirm the export exists in the target `*.query.js` / `*.api.js`.

**4. Every mutation hook MUST surface errors.** `onError` shows a toast, never just
`console.log`:
```js
onError: (err) =>
  showToast(err?.response?.data?.error?.message || 'Could not save X', 'Error', toastTypes.error),
```
Screens calling `mutateAsync` wrap it in `try/catch` (the hook toasts; the catch just stops
the rejection from bubbling). Use `catch {` (no unused binding) unless you read `err`.

**5. Backend response shapes (build/read to these):** success `{ ok: true, message?, user? }`;
error `{ error: { code, message } }`. That's why error toasts read
`err?.response?.data?.error?.message`. After a mutation that changes the user, sync Redux —
either the hook dispatches `updateUserFields`, or it calls `refreshUserData()` (GET /users/me).

**6. UI is frozen.** Wiring a screen = swap dummy/`setTimeout` for the hook, fix the data
source, gate the button with `isPending`/`isLoading`. Do NOT change layout, fields, copy, or
field names. Map any backend↔screen name difference in the `*.api.js` layer, never in the screen.

## State

- Server/remote data → React Query (`*.query.js` hooks).
- Global client state → Redux Toolkit slices in `src/store/`.

## Migration note (dummy → real backend)

The app shipped on dummy data. We wire screens to the real backend feature by feature.
See `docs/INTEGRATION_STATUS.md`. To convert a screen: remove the dummy block, import the
relevant `*.query.js` hook, replace the dummy source with the hook's `data`, and use the
hook's `isPending`/`isLoading` for loading state. `Signin.js` / `SignUp.jsx` are wired examples.

## Naming

- Components / Screens: `PascalCase` (`MainHeader.jsx`).
- Variables / functions: `camelCase`. Event handlers: `handle*` (`handleSubmit`, `handlePress`).
- Booleans: `is/has/can/should` (`isLoading`, `hasError`, `canSubmit`).
- Custom hooks: `use*`. Redux slices: `camelCaseSlice.js`.
- API files keep the existing `<feature>.api.js` / `<feature>.query.js` convention.

## User-facing copy: UK English + sentence case

- Sentence case for all UI text (buttons, headings, labels, toasts, placeholders):
  capitalise only the first word and proper nouns. ✅ "Sign up" / "Log in" / "Privacy policy".
- UK spellings: personalised, favourite, colour, centre, organise — **except** code
  identifiers like `backgroundColor`. Keep brand names' official capitalisation.
