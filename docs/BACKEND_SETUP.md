# Backend Setup

## Location
`D:\Projects\PushpaRaj\SquadGooFiles\squadgoo-admin-panel-backend\`

## Stack
Node.js + Express 4.21, MongoDB via Mongoose 8.9, Socket.IO 4.8, JWT, bcryptjs

## Prerequisites
- Node.js installed
- MongoDB running locally on port 27017 (already installed on this machine)

## Run the backend

```bash
cd D:\Projects\PushpaRaj\SquadGooFiles\squadgoo-admin-panel-backend
npm install       # first time only
node index.js
```

Server starts at: `http://localhost:5000/api`

Health check: `GET http://localhost:5000/api/health`
Expected response: `{ "ok": true, "service": "squadgoo-api", "db": "connected" }`

## Environment file
Located at `squadgoo-admin-panel-backend\.env`

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/squadgoo
JWT_SECRET=squadgoo-local-dev-jwt-secret-change-before-prod
APP_USER_JWT_SECRET=squadgoo-mobile-jwt-secret-change-before-prod
PUBLIC_ORIGIN=http://localhost:5000
NODE_ENV=development
```

**When moving to production / MongoDB Atlas:**
Replace `MONGODB_URI` with the Atlas connection string. All other code stays the same.

## Mobile app endpoints (built so far)

Base path: `/api/mobile-app`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | None | Create account (jobseeker / recruiter / individual) |
| POST | `/auth/login` | None | Login, returns access + refresh token |
| POST | `/auth/refresh` | None | Rotate refresh token, get new access token |
| POST | `/auth/logout` | Bearer | Invalidate refresh token |
| GET | `/users/me` | Bearer | Get current user profile |
| PUT | `/users/me` | Bearer | Update profile fields |

## Request / Response shape

### Register — `POST /auth/register`
```json
// Request
{
  "email": "user@example.com",
  "password": "Min8Chars!",
  "userType": "jobseeker",        // "jobseeker" | "recruiter" | "individual"
  "accountType": "owner",         // recruiter only: "owner" | "representative"
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "0412345678"           // optional
}

// Response 201
{
  "ok": true,
  "accessToken": "<jwt>",
  "refreshToken": "<opaque-token>",
  "expiresIn": "15m",
  "user": {
    "id": "<mongo-id>",
    "userType": "jobseeker",
    "accountType": null,
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": null,
    "profilePhoto": null,
    "status": "active",
    "kycStatus": "pending",
    "kybStatus": "pending",
    "blueTick": false,
    "createdAt": "2026-05-12T00:00:00.000Z"
  }
}
```

### Login — `POST /auth/login`
```json
// Request
{ "email": "user@example.com", "password": "Min8Chars!" }

// Response 200 — same shape as register
```

### Refresh — `POST /auth/refresh`
```json
// Request
{ "userId": "<mongo-id>", "refreshToken": "<opaque-token>" }

// Response 200
{
  "ok": true,
  "accessToken": "<new-jwt>",
  "refreshToken": "<new-opaque-token>",
  "expiresIn": "15m"
}
```

### Logout — `POST /auth/logout`
Header: `Authorization: Bearer <accessToken>`
Response: `{ "ok": true, "message": "Logged out" }`

### GET /users/me
Header: `Authorization: Bearer <accessToken>`
Response: `{ "ok": true, "user": { ...profile fields } }`

### PUT /users/me
Header: `Authorization: Bearer <accessToken>`
```json
// Request — all fields optional
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "0412345678",
  "addressLine1": "123 Main St",
  "city": "Sydney",
  "state": "NSW",
  "postcode": "2000"
}
// Response: { "ok": true, "user": { ...updated profile } }
```

## Token details
| Token | Expiry | Storage |
|-------|--------|---------|
| Access token (JWT) | 15 minutes | Redux `auth.token` |
| Refresh token (opaque, bcrypt-hashed in DB) | 30 days, rotated on use | Redux `auth.refreshToken` |

## Error shape
```json
{ "error": { "code": "EMAIL_TAKEN", "message": "Email already registered" } }
```

| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Missing / invalid fields |
| `EMAIL_TAKEN` | Email already registered |
| `INVALID_CREDENTIALS` | Wrong email or password |
| `ACCOUNT_SUSPENDED` | Account suspended by admin |
| `INVALID_REFRESH_TOKEN` | Bad or expired refresh token |
| `REFRESH_TOKEN_EXPIRED` | Must log in again |

## AppUser model fields (relevant to mobile)
```
email, phone, firstName, lastName
userType: "jobseeker" | "recruiter" | "individual"
accountType: "owner" | "representative"   (recruiter only)
profilePhoto: string (URL)
addressLine1, city, state, postcode
status: "active" | "inactive" | "suspended" | "deleted"
kycStatus: "pending" | "verified" | "rejected"
kybStatus: "pending" | "verified" | "rejected"
blueTick: boolean
```

## Relevant backend files
| File | Purpose |
|------|---------|
| `index.js` | Server entry, route mounting |
| `routes/mobileApp.js` | Mobile route aggregator |
| `routes/mobileAuth.js` | Auth + profile endpoints |
| `models/AppUser.js` | Mobile user model |
| `middleware/appUserAuth.js` | JWT verification for mobile routes |
| `.env` | Environment config |
