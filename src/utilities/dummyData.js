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
    businessName: 'Squad Goo Recruitment Pty Ltd',
    abn: '12345678901',
    acn: '987654321',
    businessAddress: '123 Business Street, Sydney NSW 2000',
    directorName: 'John Recruiter',
    directorEmail: 'john@recruiter.com',
    directorPhone: '+61 123 456 789',
    gstRegistered: true,
    gstNumber: 'GST123456789',
    verified: true,
    kycVerified: true,
    kybVerified: true,
    bio: 'Experienced recruiter at Squad Goo',
    location: 'Sydney, Australia',
    address: {
      fullAddress: '123 Business Street, Sydney NSW 2000',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      country: 'Australia',
    },
    profilePicture: null,
    companyLogo: null,
    badge: null, // 'bronze', 'platinum', 'gold'
    accountType: 'owner', // 'owner' or 'representative'
    createdAt: '2024-01-15T00:00:00Z',
    wallet: {
      coins: 500,
      transactions: [],
    },
  },
  jobseeker: {
    token: 'dummy-jobseeker-token',
    role: 'jobseeker',
    email: 'jobseeker@gmail.com',
    firstName: 'Jane',
    lastName: 'Jobseeker',
    _id: 'jobseeker-001',
    phone: '+61 987 654 321',
    dateOfBirth: '1995-05-15',
    skills: ['React Native', 'JavaScript', 'Node.js', 'UI/UX Design'],
    verified: true,
    kycVerified: true,
    bio: 'Full-stack developer looking for opportunities',
    location: 'Melbourne, Australia',
    homeAddress: {
      fullAddress: '456 Home Street, Melbourne VIC 3000',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia',
    },
    experience: '3 years',
    taxType: 'both', // 'tfn', 'abn', 'both'
    tfn: '123456789',
    abn: '98765432101',
    profilePicture: null,
    badge: null, // 'bronze', 'platinum', 'gold'
    acceptanceRating: 85, // 0-100
    preferredJobs: [],
    jobExperience: [],
    educationalDetails: [],
    extraQualifications: [],
    socialMediaLinks: {
      linkedin: '',
      facebook: '',
    },
    createdAt: '2024-02-01T00:00:00Z',
    wallet: {
      coins: 250,
      transactions: [],
    },
  },
  individual: {
    token: 'dummy-individual-token',
    role: 'individual',
    email: 'individual@gmail.com',
    firstName: 'Alex',
    lastName: 'Individual',
    _id: 'individual-001',
    phone: '+61 555 123 456',
    dateOfBirth: '1990-08-20',
    verified: true,
    kycVerified: true,
    bio: 'Looking for contractors to help with various tasks',
    location: 'Brisbane, Australia',
    address: {
      fullAddress: '789 Personal Street, Brisbane QLD 4000',
      suburb: 'Brisbane',
      state: 'QLD',
      postcode: '4000',
      country: 'Australia',
    },
    profilePicture: null,
    badge: null, // 'bronze', 'platinum', 'gold'
    createdAt: '2024-03-10T00:00:00Z',
    wallet: {
      coins: 100,
      transactions: [],
    },
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

  // Base user structure
  const baseUser = {
    token: `dummy-token-${role}-${Date.now()}`,
    role: role,
    email: email,
    firstName: firstName,
    lastName: lastName,
    _id: `${role}-${Date.now()}`,
    phone: '',
    verified: false,
    kycVerified: false,
    bio: '',
    location: '',
    referralCode: referralCode || null,
    createdAt: new Date().toISOString(),
    wallet: {
      coins: 0,
      transactions: [],
    },
  };

  // Add role-specific defaults
  if (role === 'recruiter') {
    return {
      ...baseUser,
      companyName: '',
      businessName: '',
      abn: '',
      acn: '',
      businessAddress: '',
      directorName: '',
      directorEmail: '',
      directorPhone: '',
      gstRegistered: false,
      gstNumber: '',
      kybVerified: false,
      accountType: 'owner',
      address: {
        fullAddress: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'Australia',
      },
    };
  } else if (role === 'jobseeker') {
    return {
      ...baseUser,
      dateOfBirth: '',
      taxType: 'both',
      tfn: '',
      abn: '',
      acceptanceRating: 100,
      preferredJobs: [],
      jobExperience: [],
      educationalDetails: [],
      extraQualifications: [],
      socialMediaLinks: {
        linkedin: '',
        facebook: '',
      },
      homeAddress: {
        fullAddress: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'Australia',
      },
    };
  } else if (role === 'individual') {
    return {
      ...baseUser,
      dateOfBirth: '',
      address: {
        fullAddress: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'Australia',
      },
    };
  }

  return baseUser;
};

/**
 * Get role-specific default data structure
 * @param {string} role - User role ('recruiter', 'jobseeker', 'individual')
 * @returns {Object} - Default data structure for the role
 */
export const getRoleDefaults = (role) => {
  const defaults = {
    recruiter: {
      companyName: '',
      businessName: '',
      abn: '',
      acn: '',
      businessAddress: '',
      directorName: '',
      directorEmail: '',
      directorPhone: '',
      gstRegistered: false,
      gstNumber: '',
      accountType: 'owner',
    },
    jobseeker: {
      taxType: 'both',
      tfn: '',
      abn: '',
      acceptanceRating: 100,
      preferredJobs: [],
      jobExperience: [],
      educationalDetails: [],
      extraQualifications: [],
    },
    individual: {
      // Individual-specific defaults if needed
    },
  };

  return defaults[role] || {};
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

/**
 * Recruiter account upgrade plans (Badges)
 * Note: extra fields (key/tier/billingPeriod) are safe; UI can ignore them.
 * billingPeriod: null = one-time (no expiry). Set to '12m' later if needed.
 */
export const recruiterBadges = [
  {
    id: 'recruiter_bronze',
    key: 'bronze',
    tier: 'BRONZE',
    title: 'Bronze Badge',
    price: 50,
    color: '#CD7F32',
    billingPeriod: null,
    requirements: [
      'Registered for over 3 months',
      'Completed at least 2 job offers (Manual or Quick)',
      'KYC/KYB verified (recommended)',
    ],
    benefits: [
      'Unlock Squad hiring',
      'Unlock in-app payment to eligible Jobseekers (ABN contractors only)',
      'Bronze badge displayed on your recruiter profile',
    ],
    buttonLabel: 'Upgrade to Bronze',
  },
  {
    id: 'recruiter_platinum',
    key: 'platinum',
    tier: 'PLATINUM',
    title: 'Platinum Badge',
    price: 100,
    color: '#7A8A99',
    billingPeriod: null,
    requirements: [
      'Registered for over 6 months',
      'Completed at least 4 job offers (Manual or Quick)',
      'KYC/KYB verified (recommended)',
    ],
    benefits: [
      'Unlock Squad hiring',
      'Unlock in-app payment to eligible Jobseekers (ABN contractors only)',
      'VIP level customer service',
      '10% discount on squad hiring fee',
      '10% discount on transaction fees',
      'Platinum badge displayed on your recruiter profile',
    ],
    buttonLabel: 'Upgrade to Platinum',
  },
  {
    id: 'recruiter_gold',
    key: 'gold',
    tier: 'GOLD',
    title: 'Gold Badge',
    price: 200,
    color: '#D4AF37',
    billingPeriod: null,
    requirements: [
      'Registered for over 8 months',
      'Completed at least 8 job offers (Manual or Quick)',
      'KYC/KYB verified (recommended)',
    ],
    benefits: [
      'Unlock Squad hiring',
      'Unlock in-app payment to eligible Jobseekers (ABN contractors only)',
      'VIP level customer service (highest priority)',
      '10% discount on each Manual and Quick match fee',
      '10% discount on squad hiring fee',
      '50% off transaction fees',
      'Unlock News feed',
      'Gold badge displayed on your recruiter profile',
    ],
    buttonLabel: 'Upgrade to Gold',
  },
  // PRO as a plan card too (your preference: show in both sections)
  {
    id: 'recruiter_pro',
    key: 'pro',
    tier: 'PRO',
    title: 'PRO (Enhanced Due Diligence)',
    price: 200,
    color: '#3D5AFE',
    billingPeriod: null,
    requirements: ['Complete business details', 'KYC verified', 'KYB verified'],
    benefits: [
      'PRO badge displayed on your business profile',
      'Enhanced due diligence checks to improve trust',
      'Helps jobseekers identify higher-authenticity recruiters',
    ],
    buttonLabel: 'Purchase PRO',
  },
];

/**
 * Recruiter extra purchases (separate section)
 */
export const recruiterExtraPurchases = [
  {
    id: 'recruiter_pro_extra',
    key: 'pro',
    title: 'PRO (Enhanced Due Diligence)',
    price: 200,
    description:
      'Get PRO verification on your business profile. Enhanced due diligence checks. Duration configurable.',
    billingPeriod: null,
  },
];
