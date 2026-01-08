const badgeLevels = ['Bronze', 'Silver', 'Gold', 'Platinum'];

/**
 * Dummy data for TFN-registered job seekers (employees)
 * These are traditional employees who:
 * - Work as legal employees of businesses
 * - Have TFN (Tax File Number) registration
 * - Receive salary directly from employer with reduced taxes
 * - Organizations need to follow employment laws and regulations
 */
export const DUMMY_EMPLOYEES = [
  {
    id: 'tfn-001',
    name: 'Liam Chen',
    avatar: null,
    badge: 'Silver',
    acceptanceRating: 84,
    experienceYears: 5,
    industries: ['Cleaning Services', 'Facilities'],
    preferredRoles: ['Cleaning Supervisor', 'Deep Cleaning Specialist'],
    location: 'Perth',
    suburb: 'Scarborough',
    radiusKm: 35,
    taxTypes: ['TFN'],
    tfnNumber: '123 456 789',
    languages: ['English', 'Mandarin'],
    qualifications: ['Workplace Health & Safety (Level 2)'],
    education: 'North Metropolitan TAFE',
    availability: {
      summary: 'Mon - Fri, Evening & Night',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 26,
      max: 36,
    },
    bio: 'Cleaning supervisor experienced with large commercial kitchens and hospitality venues. TFN employee seeking stable employment opportunities.',
    skills: ['Team Leadership', 'Chemical Handling', 'Quality Assurance', 'Safety Compliance'],
  },
  {
    id: 'tfn-002',
    name: 'Noah Wilson',
    avatar: null,
    badge: 'Bronze',
    acceptanceRating: 70,
    experienceYears: 1,
    industries: ['Retail', 'Customer Service'],
    preferredRoles: ['Store Assistant', 'Visual Merchandiser'],
    location: 'Gold Coast',
    suburb: 'Southport',
    radiusKm: 15,
    taxTypes: ['TFN'],
    tfnNumber: '234 567 890',
    languages: ['English'],
    qualifications: ['Certificate III in Retail'],
    education: 'TAFE Queensland',
    availability: {
      summary: 'Wed - Sun, Morning shifts',
      days: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    payPreference: {
      min: 20,
      max: 28,
    },
    bio: 'Retail professional with an eye for detail and merchandising layouts. Looking for part-time or full-time employment opportunities.',
    skills: ['POS Systems', 'Visual Merchandising', 'Stock Control', 'Customer Service'],
  },
  {
    id: 'tfn-003',
    name: 'Emily Johnson',
    avatar: null,
    badge: 'Gold',
    acceptanceRating: 87,
    experienceYears: 4,
    industries: ['Administration', 'Office Support'],
    preferredRoles: ['Administrative Assistant', 'Office Coordinator'],
    location: 'Sydney',
    suburb: 'Chatswood',
    radiusKm: 20,
    taxTypes: ['TFN'],
    tfnNumber: '345 678 901',
    languages: ['English', 'French'],
    qualifications: ['Diploma in Business Administration'],
    education: 'TAFE NSW',
    availability: {
      summary: 'Mon - Fri, 9 AM - 5 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 28,
      max: 38,
    },
    bio: 'Experienced administrative professional with strong organizational skills. Seeking permanent or long-term employment opportunities.',
    skills: ['Data Entry', 'Microsoft Office', 'Customer Relations', 'Scheduling', 'Document Management'],
  },
  {
    id: 'tfn-004',
    name: 'Daniel Kim',
    avatar: null,
    badge: 'Platinum',
    acceptanceRating: 93,
    experienceYears: 8,
    industries: ['Hospitality', 'Food Service'],
    preferredRoles: ['Restaurant Manager', 'Head Chef'],
    location: 'Melbourne',
    suburb: 'CBD',
    radiusKm: 25,
    taxTypes: ['TFN'],
    tfnNumber: '456 789 012',
    languages: ['English', 'Korean'],
    qualifications: ['Certificate IV in Commercial Cookery', 'Food Safety Supervisor'],
    education: 'William Angliss Institute',
    availability: {
      summary: 'Mon - Sun, Flexible shifts',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    payPreference: {
      min: 35,
      max: 50,
    },
    bio: 'Experienced restaurant manager and chef with expertise in Asian cuisine. Looking for management positions in established restaurants.',
    skills: ['Kitchen Management', 'Menu Planning', 'Staff Training', 'Inventory Control', 'Customer Service'],
  },
  {
    id: 'tfn-005',
    name: 'Olivia Martinez',
    avatar: null,
    badge: 'Silver',
    acceptanceRating: 81,
    experienceYears: 3,
    industries: ['Healthcare', 'Aged Care'],
    preferredRoles: ['Personal Care Assistant', 'Support Worker'],
    location: 'Brisbane',
    suburb: 'Toowong',
    radiusKm: 30,
    taxTypes: ['TFN'],
    tfnNumber: '567 890 123',
    languages: ['English', 'Spanish'],
    qualifications: ['Certificate III in Individual Support', 'First Aid Certificate'],
    education: 'TAFE Queensland',
    availability: {
      summary: 'Mon - Sat, Day & Evening shifts',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    payPreference: {
      min: 25,
      max: 35,
    },
    bio: 'Compassionate care worker with experience in aged care and disability support. Seeking stable employment with regular hours.',
    skills: ['Personal Care', 'Medication Administration', 'Mobility Assistance', 'Communication', 'Empathy'],
  },
  {
    id: 'tfn-006',
    name: 'James Anderson',
    avatar: null,
    badge: 'Gold',
    acceptanceRating: 89,
    experienceYears: 6,
    industries: ['Security', 'Event Security'],
    preferredRoles: ['Security Officer', 'Event Security'],
    location: 'Adelaide',
    suburb: 'Adelaide CBD',
    radiusKm: 40,
    taxTypes: ['TFN'],
    tfnNumber: '678 901 234',
    languages: ['English'],
    qualifications: ['Certificate II in Security Operations', 'Security License'],
    education: 'TAFE SA',
    availability: {
      summary: 'Mon - Sun, All shifts available',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    payPreference: {
      min: 30,
      max: 42,
    },
    bio: 'Licensed security officer with experience in retail, events, and corporate security. Reliable and professional TFN employee.',
    skills: ['Crowd Control', 'Access Control', 'Incident Reporting', 'First Aid', 'Conflict Resolution'],
  },
  {
    id: 'tfn-007',
    name: 'Sophie Brown',
    avatar: null,
    badge: 'Bronze',
    acceptanceRating: 75,
    experienceYears: 2,
    industries: ['Childcare', 'Education'],
    preferredRoles: ['Childcare Assistant', 'Early Childhood Educator'],
    location: 'Perth',
    suburb: 'Subiaco',
    radiusKm: 20,
    taxTypes: ['TFN'],
    tfnNumber: '789 012 345',
    languages: ['English'],
    qualifications: ['Certificate III in Early Childhood Education and Care'],
    education: 'North Metropolitan TAFE',
    availability: {
      summary: 'Mon - Fri, 7 AM - 6 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 24,
      max: 32,
    },
    bio: 'Dedicated childcare professional with passion for early childhood development. Seeking permanent part-time or full-time position.',
    skills: ['Child Development', 'Activity Planning', 'Safety Management', 'Parent Communication', 'Creative Play'],
  },
  {
    id: 'tfn-008',
    name: 'Ryan Taylor',
    avatar: null,
    badge: 'Silver',
    acceptanceRating: 83,
    experienceYears: 5,
    industries: ['Warehousing', 'Logistics'],
    preferredRoles: ['Warehouse Operative', 'Forklift Operator'],
    location: 'Melbourne',
    suburb: 'Dandenong',
    radiusKm: 35,
    taxTypes: ['TFN'],
    tfnNumber: '890 123 456',
    languages: ['English'],
    qualifications: ['Forklift License', 'White Card'],
    education: 'TAFE Victoria',
    availability: {
      summary: 'Mon - Sat, Day shifts preferred',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    payPreference: {
      min: 28,
      max: 38,
    },
    bio: 'Experienced warehouse operative with forklift operation skills. Reliable TFN employee seeking stable employment in logistics.',
    skills: ['Forklift Operation', 'Inventory Management', 'Order Picking', 'Loading/Unloading', 'Safety Compliance'],
  },
  {
    id: 'tfn-009',
    name: 'Isabella White',
    avatar: null,
    badge: 'Platinum',
    acceptanceRating: 96,
    experienceYears: 10,
    industries: ['Nursing', 'Healthcare'],
    preferredRoles: ['Enrolled Nurse', 'Patient Care'],
    location: 'Sydney',
    suburb: 'Parramatta',
    radiusKm: 30,
    taxTypes: ['TFN'],
    tfnNumber: '901 234 567',
    languages: ['English', 'Italian'],
    qualifications: ['Diploma of Nursing', 'AHPRA Registration'],
    education: 'University of Sydney',
    availability: {
      summary: 'Mon - Sun, All shifts (rotating roster)',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    payPreference: {
      min: 38,
      max: 52,
    },
    bio: 'Registered enrolled nurse with extensive experience in hospital and aged care settings. Seeking permanent employment opportunities.',
    skills: ['Patient Care', 'Medication Administration', 'Wound Care', 'Vital Signs', 'Documentation'],
  },
  {
    id: 'tfn-010',
    name: 'Ethan Davis',
    avatar: null,
    badge: 'Gold',
    acceptanceRating: 88,
    experienceYears: 7,
    industries: ['Construction', 'Carpentry'],
    preferredRoles: ['Carpenter', 'Construction Worker'],
    location: 'Brisbane',
    suburb: 'Chermside',
    radiusKm: 25,
    taxTypes: ['TFN'],
    tfnNumber: '012 345 678',
    languages: ['English'],
    qualifications: ['Certificate III in Carpentry', 'White Card', 'Confined Spaces'],
    education: 'TAFE Queensland',
    availability: {
      summary: 'Mon - Fri, 7 AM - 4 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 32,
      max: 45,
    },
    bio: 'Skilled carpenter with experience in residential and commercial construction. TFN employee seeking long-term employment with established builders.',
    skills: ['Framing', 'Finishing', 'Blueprint Reading', 'Power Tools', 'Safety Protocols'],
  },
  {
    id: 'tfn-011',
    name: 'Charlotte Green',
    avatar: null,
    badge: 'Silver',
    acceptanceRating: 79,
    experienceYears: 3,
    industries: ['Hospitality', 'Café'],
    preferredRoles: ['Barista', 'Café All-Rounder'],
    location: 'Adelaide',
    suburb: 'Glenelg',
    radiusKm: 20,
    taxTypes: ['TFN'],
    tfnNumber: '123 456 780',
    languages: ['English', 'German'],
    qualifications: ['Barista Certificate', 'Food Handling Certificate'],
    education: 'TAFE SA',
    availability: {
      summary: 'Mon - Sun, Morning & Day shifts',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    payPreference: {
      min: 22,
      max: 30,
    },
    bio: 'Experienced barista with passion for coffee and customer service. Seeking part-time or full-time employment in café environment.',
    skills: ['Coffee Making', 'Customer Service', 'Cash Handling', 'Food Preparation', 'POS Systems'],
  },
  {
    id: 'tfn-012',
    name: 'Alexander Lee',
    avatar: null,
    badge: 'Platinum',
    acceptanceRating: 94,
    experienceYears: 9,
    industries: ['IT Support', 'Help Desk'],
    preferredRoles: ['IT Support Technician', 'Help Desk Analyst'],
    location: 'Melbourne',
    suburb: 'Richmond',
    radiusKm: 30,
    taxTypes: ['TFN'],
    tfnNumber: '234 567 801',
    languages: ['English', 'Mandarin'],
    qualifications: ['Diploma of Information Technology', 'ITIL Foundation'],
    education: 'RMIT University',
    availability: {
      summary: 'Mon - Fri, Business hours',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 40,
      max: 55,
    },
    bio: 'Experienced IT support professional with expertise in troubleshooting, system administration, and user support. Seeking permanent role in corporate environment.',
    skills: ['Technical Support', 'Troubleshooting', 'Windows/Mac OS', 'Network Administration', 'Ticketing Systems'],
  },
];

/**
 * Get an employee by ID
 * @param {string} employeeId - The ID of the employee
 * @returns {Object|null} The employee object or null if not found
 */
export const getEmployeeById = (employeeId) => {
  return DUMMY_EMPLOYEES.find(employee => employee.id === employeeId) || null;
};

/**
 * Get all employees filtered by industry
 * @param {string} industry - The industry to filter by
 * @returns {Array} Array of employees in the specified industry
 */
export const getEmployeesByIndustry = (industry) => {
  return DUMMY_EMPLOYEES.filter(employee => 
    employee.industries.includes(industry)
  );
};

/**
 * Get all employees filtered by preferred role
 * @param {string} role - The role to filter by
 * @returns {Array} Array of employees with the specified role
 */
export const getEmployeesByRole = (role) => {
  return DUMMY_EMPLOYEES.filter(employee => 
    employee.preferredRoles.includes(role)
  );
};

/**
 * Get employees within a specific location radius
 * @param {string} suburb - The suburb to search from
 * @param {number} maxRadius - Maximum radius in km
 * @returns {Array} Array of employees within the radius
 */
export const getEmployeesByLocation = (suburb, maxRadius = 50) => {
  return DUMMY_EMPLOYEES.filter(employee => 
    employee.suburb.toLowerCase() === suburb.toLowerCase() ||
    employee.radiusKm <= maxRadius
  );
};

/**
 * Get random badge level
 * @returns {string} Random badge level
 */
export const getRandomBadge = () => {
  const index = Math.floor(Math.random() * badgeLevels.length);
  return badgeLevels[index];
};

