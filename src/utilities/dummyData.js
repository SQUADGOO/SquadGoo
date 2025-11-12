/**
 * Dummy Data for Local Development
 * Use this file when APIs are not available
 */

// Dummy user credentials for testing
export const DUMMY_CREDENTIALS = {
  recruiter: {
    email: 'recruiter@gmail.com',
    password: 'Recruiter@123',
  },
  jobseeker: {
    email: 'jobseeker@gmail.com',
    password: 'Jobseeker@123',
  },
  individual: {
    email: 'individual@gmail.com',
    password: 'Individual@123',
  },
};

// Dummy user data for authentication
export const DUMMY_USERS = {
  recruiter: {
    token: 'dummy-recruiter-token',
    role: 'recruiter',
    email: 'recruiter@gmail.com',
    firstName: 'John',
    lastName: 'Recruiter',
    _id: 'recruiter-001',
    phone: '+61 123 456 789',
    companyName: 'Squad Goo Recruitment',
    verified: true,
    bio: 'Experienced recruiter at Squad Goo',
    location: 'Sydney, Australia',
  },
  jobseeker: {
    token: 'dummy-jobseeker-token',
    role: 'jobseeker',
    email: 'jobseeker@gmail.com',
    firstName: 'Jane',
    lastName: 'Jobseeker',
    _id: 'jobseeker-001',
    phone: '+61 987 654 321',
    skills: ['React Native', 'JavaScript', 'Node.js', 'UI/UX Design'],
    verified: true,
    bio: 'Full-stack developer looking for opportunities',
    location: 'Melbourne, Australia',
    experience: '3 years',
  },
  individual: {
    token: 'dummy-individual-token',
    role: 'individual',
    email: 'individual@gmail.com',
    firstName: 'Alex',
    lastName: 'Individual',
    _id: 'individual-001',
    phone: '+61 555 123 456',
    verified: true,
    bio: 'Freelance professional',
    location: 'Brisbane, Australia',
  },
};

/**
 * Validate dummy credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} - Returns user data if valid, null if invalid
 */
export const validateDummyCredentials = (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check recruiter credentials
  if (
    normalizedEmail === DUMMY_CREDENTIALS.recruiter.email.toLowerCase() &&
    password === DUMMY_CREDENTIALS.recruiter.password
  ) {
    return {
      ...DUMMY_USERS.recruiter,
      token: DUMMY_USERS.recruiter.token + '-' + Date.now(),
    };
  }

  // Check jobseeker credentials
  if (
    normalizedEmail === DUMMY_CREDENTIALS.jobseeker.email.toLowerCase() &&
    password === DUMMY_CREDENTIALS.jobseeker.password
  ) {
    return {
      ...DUMMY_USERS.jobseeker,
      token: DUMMY_USERS.jobseeker.token + '-' + Date.now(),
    };
  }

  // Check individual credentials
  if (
    normalizedEmail === DUMMY_CREDENTIALS.individual.email.toLowerCase() &&
    password === DUMMY_CREDENTIALS.individual.password
  ) {
    return {
      ...DUMMY_USERS.individual,
      token: DUMMY_USERS.individual.token + '-' + Date.now(),
    };
  }

  return null;
};

/**
 * Create dummy user data for signup
 * @param {Object} signupData - Signup form data
 * @returns {Object} - Dummy user data
 */
export const createDummyUser = (signupData) => {
  const { email, firstName, lastName, role, referralCode } = signupData;

  return {
    token: `dummy-token-${role}-${Date.now()}`,
    role: role,
    email: email,
    firstName: firstName,
    lastName: lastName,
    _id: `${role}-${Date.now()}`,
    phone: '',
    verified: false,
    bio: '',
    location: '',
    referralCode: referralCode || null,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Get display credentials for UI
 * @returns {Array} - Array of credential objects for display
 */
export const getDisplayCredentials = () => {
  return [
    {
      role: 'Recruiter',
      email: DUMMY_CREDENTIALS.recruiter.email,
      password: DUMMY_CREDENTIALS.recruiter.password,
    },
    {
      role: 'Job Seeker',
      email: DUMMY_CREDENTIALS.jobseeker.email,
      password: DUMMY_CREDENTIALS.jobseeker.password,
    },
    {
      role: 'Individual',
      email: DUMMY_CREDENTIALS.individual.email,
      password: DUMMY_CREDENTIALS.individual.password,
    },
  ];
};

// Configuration flag to enable/disable dummy data
export const USE_DUMMY_DATA = true; // Set to false when API is ready

/**
 * Check if dummy data mode is enabled
 * @returns {boolean}
 */
export const isDummyMode = () => USE_DUMMY_DATA;
