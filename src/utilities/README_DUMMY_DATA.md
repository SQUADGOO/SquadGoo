# Dummy Data Utility

## 📍 Quick Reference

### Location
All dummy authentication data is managed in:
```
src/utilities/dummyData.js
```

## 🚀 Quick Start

### Test Credentials
```javascript
// Recruiter
Email: recruiter@gmail.com
Password: Recruiter@123

// Job Seeker
Email: jobseeker@gmail.com
Password: Jobseeker@123

// Individual
Email: individual@gmail.com
Password: Individual@123
```

## 🔧 Available Functions

### `validateDummyCredentials(email, password)`
Validates user credentials and returns user data if valid.

```javascript
import { validateDummyCredentials } from '@/utilities/dummyData';

const userData = validateDummyCredentials('jobseeker@gmail.com', 'Jobseeker@123');
// Returns user object with token, role, firstName, etc.
```

### `createDummyUser(signupData)`
Creates a dummy user object for signup flow.

```javascript
import { createDummyUser } from '@/utilities/dummyData';

const newUser = createDummyUser({
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'jobseeker',
  referralCode: 'REF123'
});
```

### `getDisplayCredentials()`
Returns an array of credentials for UI display.

```javascript
import { getDisplayCredentials } from '@/utilities/dummyData';

const credentials = getDisplayCredentials();
// Returns: [{ role, email, password }, ...]
```

### `isDummyMode()`
Checks if dummy mode is enabled.

```javascript
import { isDummyMode } from '@/utilities/dummyData';

if (isDummyMode()) {
  // Use dummy data
} else {
  // Use API
}
```

## ⚙️ Configuration

### Enable/Disable Dummy Mode

In `src/utilities/dummyData.js`:

```javascript
// Enable dummy mode (default)
export const USE_DUMMY_DATA = true;

// Disable dummy mode (use API)
export const USE_DUMMY_DATA = false;
```

## 📝 Data Structure

### User Object
```javascript
{
  token: string,          // Auth token
  role: string,           // 'recruiter' | 'jobseeker' | 'individual'
  email: string,          // User email
  firstName: string,      // First name
  lastName: string,       // Last name
  _id: string,           // Unique ID
  phone: string,         // Phone number
  verified: boolean,     // Email verified status
  bio: string,          // User bio
  location: string,     // User location
  // Role-specific fields...
}
```

## 🎯 Usage Examples

### In SignIn Component
```javascript
import { validateDummyCredentials, isDummyMode } from '@/utilities/dummyData';

const handleLogin = async (data) => {
  if (isDummyMode()) {
    const user = validateDummyCredentials(data.email, data.password);
    if (user) {
      dispatch(loginAction(user));
    }
  } else {
    // API call
  }
};
```

### In SignUp Component
```javascript
import { createDummyUser, isDummyMode } from '@/utilities/dummyData';

const handleSignUp = async (data) => {
  if (isDummyMode()) {
    const user = createDummyUser({
      ...data,
      role: selectedUserType
    });
    console.log('User created:', user);
  } else {
    // API call
  }
};
```

## 🔍 Debugging

### Check Current Mode
```javascript
console.log('Dummy mode:', isDummyMode());
```

### Inspect User Data
```javascript
const user = validateDummyCredentials('jobseeker@gmail.com', 'Jobseeker@123');
console.log('User data:', user);
```

## ✨ Best Practices

1. **Always use `isDummyMode()`** - Don't hardcode dummy checks
2. **Use provided functions** - Don't duplicate validation logic
3. **Keep data centralized** - All dummy data in `dummyData.js`
4. **Comment API code** - Don't delete, just comment out
5. **Test both modes** - Toggle `USE_DUMMY_DATA` to test API integration

## 📚 Related Files

- `src/screens/auth/Signin.js` - Login implementation
- `src/screens/auth/SignUp.jsx` - Signup implementation
- `src/store/authSlice.js` - Redux auth state
- `DUMMY_CREDENTIALS.md` - Full documentation

---

**Version:** 1.0  
**Last Updated:** November 2025

