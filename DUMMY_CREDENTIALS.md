# 🔧 Dummy Credentials for Local Testing

This document contains test credentials for local development when APIs are unavailable.

## 📂 File Structure

All dummy data is centralized in:
```
src/utilities/dummyData.js
```

This file contains:
- ✅ Dummy user credentials
- ✅ User profile data
- ✅ Validation functions
- ✅ Helper utilities
- ✅ Configuration flags

## 📱 Sign In Credentials

### Recruiter Account
- **Email:** `recruiter@gmail.com`
- **Password:** `Recruiter@123`
- **Role:** Recruiter
- **Name:** John Recruiter
- **Features:** Access to recruiter dashboard, can post jobs, search candidates

### Job Seeker Account
- **Email:** `jobseeker@gmail.com`
- **Password:** `Jobseeker@123`
- **Role:** Job Seeker
- **Name:** Jane Jobseeker
- **Features:** Access to job listings, marketplace, can apply for jobs

### Individual Account
- **Email:** `individual@gmail.com`
- **Password:** `Individual@123`
- **Role:** Individual
- **Name:** Alex Individual
- **Features:** Basic individual user access

## 📝 Sign Up

Sign up is working in **dummy mode**. You can create an account with any details:
- Fill in all required fields
- Password must meet these requirements:
  - ✓ At least 8 characters
  - ✓ One uppercase letter
  - ✓ One lowercase letter
  - ✓ One number
  - ✓ One special character
- Accept Terms and Conditions
- Click "Join Squad Goo"
- After success, use the same credentials to login

**Note:** The signup only stores data locally during the session. Use the pre-configured dummy accounts above for consistent testing.

## 🎨 Features in Local Mode

### ✅ Working Features:
- Login with dummy credentials
- Sign up (redirects to sign in)
- Role-based navigation (Recruiter/Job Seeker/Individual)
- Redux store for user data
- Marketplace (can create and view products)
- Password validation indicators
- Toast notifications
- Session persistence

### ⚠️ Temporarily Disabled:
- API calls (commented out)
- Email verification
- Real authentication flow
- Server-side data persistence

## 🔄 Switching Back to API Mode

### Quick Toggle (Recommended)

In `src/utilities/dummyData.js`, change:
```javascript
export const USE_DUMMY_DATA = false; // Set to false when API is ready
```

This single flag will disable all dummy data across the app!

### Manual Integration (If needed)

If you need more control:

#### In `src/screens/auth/Signin.js`:
1. Uncomment: `const { mutate: login, isPending, isError } = useLogin();`
2. In `handleLogin` function:
   - Comment out: `if (isDummyMode()) { ... }`
   - Uncomment: `await login({ email, password });`
3. Change `isLoading={isLoggingIn}` to `isLoading={isPending}`

#### In `src/screens/auth/SignUp.jsx`:
1. Uncomment: `const { mutate: register, isPending } = useRegister()`
2. In `handleSignUp` function:
   - Comment out: `if (isDummyMode()) { ... }`
   - Uncomment the API integration block
3. Change `isLoading={isRegistering}` to `isLoading={isPending}`

## 📊 User Data Structure

Each dummy user includes:
```javascript
{
  token: 'dummy-token-timestamp',
  role: 'recruiter' | 'jobseeker' | 'individual',
  email: 'user@example.com',
  firstName: 'First',
  lastName: 'Last',
  _id: 'user-id',
  phone: '+61 XXX XXX XXX',
  verified: true,
  // Additional role-specific fields
}
```

## 🐛 Troubleshooting

### Login not working?
- Make sure email is exactly as shown (case-insensitive)
- Password is case-sensitive
- Check console logs for errors

### App crashes after login?
- Clear app data and restart
- Check Redux store configuration
- Verify navigation setup for the user role

### Can't see created products in marketplace?
- Products are stored in Redux (session only)
- Refresh will clear products until API is integrated
- Use Redux DevTools to inspect state

## 🎨 Benefits of Centralized Dummy Data

### ✅ Advantages:
- **Single Source of Truth**: All dummy data in one file
- **Easy to Maintain**: Update credentials in one place
- **Type Safe**: Consistent data structure
- **Easy Toggle**: Switch between dummy/API with one flag
- **Reusable**: Functions can be used across multiple components
- **Clean Code**: Components are not cluttered with test data

### 📝 Adding New Dummy Users

To add a new user type, edit `src/utilities/dummyData.js`:

```javascript
export const DUMMY_CREDENTIALS = {
  // ... existing users
  newRole: {
    email: 'newrole@gmail.com',
    password: 'NewRole@123',
  },
};

export const DUMMY_USERS = {
  // ... existing users
  newRole: {
    token: 'dummy-newrole-token',
    role: 'newRole',
    email: 'newrole@gmail.com',
    firstName: 'New',
    lastName: 'Role',
    _id: 'newrole-001',
    // ... other fields
  },
};
```

Then update the `validateDummyCredentials` function to handle the new role.

---

**Last Updated:** November 2025  
**Environment:** Local Development Mode  
**API Status:** Disabled  
**Dummy Data Location:** `src/utilities/dummyData.js`

