const badgeLevels = ['Bronze', 'Silver', 'Gold', 'Platinum'];

/**
 * Dummy data for ABN-registered job seekers (contractors)
 * These are independent contractors/freelancers who:
 * - View every job as a contract
 * - Operate as independent small personal business
 * - Send invoices to clients
 * - Handle their own taxes
 * - Can use platform payment
 */
export const DUMMY_CONTRACTORS = [
  {
    id: 'abn-001',
    name: 'James Mitchell',
    businessName: 'Mitchell Construction Pty Ltd',
    avatar: null,
    badge: 'Gold',
    acceptanceRating: 91,
    experienceYears: 8,
    industries: ['Construction', 'Renovation'],
    preferredRoles: ['Carpenter', 'Project Manager'],
    location: 'Sydney',
    suburb: 'Bondi',
    radiusKm: 30,
    taxTypes: ['ABN'],
    abnNumber: '12 345 678 901',
    phone: '+61 412 345 678',
    email: 'james@mitchellconstruction.com.au',
    languages: ['English'],
    qualifications: ['Certificate III in Carpentry', 'White Card'],
    education: 'TAFE NSW',
    availability: {
      summary: 'Mon - Sat, Flexible hours',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    payPreference: {
      min: 45,
      max: 65,
    },
    reviewCount: 156,
    bio: 'Experienced carpenter and project manager specializing in residential renovations and custom builds. Operates as independent contractor with full ABN registration.',
    skills: ['Carpentry', 'Project Management', 'Blueprint Reading', 'Team Coordination'],
  },
  {
    id: 'abn-002',
    name: 'Emma Thompson',
    businessName: 'Thompson Tech Solutions',
    avatar: null,
    badge: 'Platinum',
    acceptanceRating: 96,
    experienceYears: 12,
    industries: ['IT', 'Software Development'],
    preferredRoles: ['Full Stack Developer', 'Tech Lead'],
    location: 'Melbourne',
    suburb: 'Richmond',
    radiusKm: 50,
    taxTypes: ['ABN'],
    abnNumber: '23 456 789 012',
    phone: '+61 423 456 789',
    email: 'emma@thompsontechsolutions.com.au',
    languages: ['English', 'French'],
    qualifications: ['Bachelor of Computer Science', 'AWS Certified Solutions Architect'],
    education: 'University of Melbourne',
    availability: {
      summary: 'Mon - Fri, Remote or On-site',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 80,
      max: 120,
    },
    reviewCount: 203,
    bio: 'Senior full-stack developer with expertise in modern web technologies. Operates as freelance contractor, available for project-based work and consulting.',
    skills: ['React', 'Node.js', 'AWS', 'Docker', 'Agile Methodology'],
  },
  {
    id: 'abn-003',
    name: 'David Park',
    businessName: 'Pro Plumbing Services',
    avatar: null,
    badge: 'Silver',
    acceptanceRating: 85,
    experienceYears: 5,
    industries: ['Plumbing', 'Maintenance'],
    preferredRoles: ['Licensed Plumber', 'Emergency Repairs'],
    location: 'Brisbane',
    suburb: 'South Brisbane',
    radiusKm: 40,
    taxTypes: ['ABN'],
    abnNumber: '34 567 890 123',
    phone: '+61 434 567 890',
    email: 'david@proplumbing.com.au',
    languages: ['English', 'Korean'],
    qualifications: ['Certificate III in Plumbing', 'Licensed Plumber QLD'],
    education: 'TAFE Queensland',
    availability: {
      summary: '24/7 Emergency, Regular Mon - Sat',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    payPreference: {
      min: 55,
      max: 85,
    },
    reviewCount: 98,
    bio: 'Licensed plumber offering both scheduled maintenance and emergency services. Independent contractor with full insurance and ABN registration.',
    skills: ['Plumbing Installation', 'Emergency Repairs', 'Water Heater Service', 'Drain Cleaning'],
  },
  {
    id: 'abn-004',
    name: 'Sarah Williams',
    businessName: 'Williams Digital Marketing',
    avatar: null,
    badge: 'Gold',
    acceptanceRating: 89,
    experienceYears: 6,
    industries: ['Marketing', 'Digital Media'],
    preferredRoles: ['Digital Marketing Specialist', 'Content Creator'],
    location: 'Perth',
    suburb: 'Subiaco',
    radiusKm: 35,
    taxTypes: ['ABN'],
    abnNumber: '45 678 901 234',
    phone: '+61 445 678 901',
    email: 'sarah@williamsdigital.com.au',
    languages: ['English'],
    qualifications: ['Diploma in Digital Marketing', 'Google Ads Certified'],
    education: 'Curtin University',
    availability: {
      summary: 'Mon - Fri, Flexible remote work',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 50,
      max: 75,
    },
    reviewCount: 74,
    bio: 'Digital marketing contractor specializing in social media management, SEO, and content creation. Works with small to medium businesses on project basis.',
    skills: ['Social Media Marketing', 'SEO', 'Content Writing', 'Analytics', 'PPC Advertising'],
  },
  {
    id: 'abn-005',
    name: 'Michael Chen',
    businessName: 'Chen Electrical Services',
    avatar: null,
    badge: 'Bronze',
    acceptanceRating: 77,
    experienceYears: 3,
    industries: ['Electrical', 'Installation'],
    preferredRoles: ['Electrician', 'Installation Specialist'],
    location: 'Adelaide',
    suburb: 'Adelaide CBD',
    radiusKm: 25,
    taxTypes: ['ABN'],
    abnNumber: '56 789 012 345',
    phone: '+61 456 789 012',
    email: 'michael@chenelectrical.com.au',
    languages: ['English', 'Mandarin'],
    qualifications: ['Certificate III in Electrotechnology', 'Licensed Electrician SA'],
    education: 'TAFE SA',
    availability: {
      summary: 'Mon - Sat, Day shifts',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    payPreference: {
      min: 48,
      max: 68,
    },
    reviewCount: 42,
    bio: 'Licensed electrician offering installation and repair services. Independent contractor with ABN, available for residential and commercial projects.',
    skills: ['Electrical Installation', 'Fault Finding', 'Safety Testing', 'Wiring'],
  },
  {
    id: 'abn-006',
    name: 'Lisa Anderson',
    businessName: 'Anderson Interiors',
    avatar: null,
    badge: 'Platinum',
    acceptanceRating: 94,
    experienceYears: 10,
    industries: ['Design', 'Interior Design'],
    preferredRoles: ['Interior Designer', 'Space Planner'],
    location: 'Sydney',
    suburb: 'Paddington',
    radiusKm: 45,
    taxTypes: ['ABN'],
    abnNumber: '67 890 123 456',
    phone: '+61 467 890 123',
    email: 'lisa@andersoninteriors.com.au',
    languages: ['English', 'Italian'],
    qualifications: ['Bachelor of Interior Design', 'Certified Color Consultant'],
    education: 'University of New South Wales',
    availability: {
      summary: 'Mon - Fri, Flexible appointments',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 70,
      max: 100,
    },
    reviewCount: 187,
    bio: 'Award-winning interior designer operating as independent contractor. Specializes in residential and commercial spaces, offering full design services and project management.',
    skills: ['Space Planning', '3D Rendering', 'Material Selection', 'Project Management', 'Client Consultation'],
  },
  {
    id: 'abn-007',
    name: 'Robert Taylor',
    businessName: 'Taylor Landscaping Co',
    avatar: null,
    badge: 'Silver',
    acceptanceRating: 82,
    experienceYears: 7,
    industries: ['Landscaping', 'Garden Maintenance'],
    preferredRoles: ['Landscaper', 'Garden Designer'],
    location: 'Melbourne',
    suburb: 'St Kilda',
    radiusKm: 30,
    taxTypes: ['ABN'],
    abnNumber: '78 901 234 567',
    phone: '+61 478 901 234',
    email: 'robert@taylorlandscaping.com.au',
    languages: ['English'],
    qualifications: ['Certificate III in Landscape Construction', 'Pesticide Application License'],
    education: 'Melbourne Polytechnic',
    availability: {
      summary: 'Mon - Sat, Weather dependent',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    payPreference: {
      min: 40,
      max: 60,
    },
    reviewCount: 63,
    bio: 'Experienced landscaper and garden maintenance contractor. Offers design, installation, and ongoing maintenance services for residential properties.',
    skills: ['Landscape Design', 'Planting', 'Irrigation Systems', 'Lawn Care', 'Hardscaping'],
  },
  {
    id: 'abn-008',
    name: 'Jennifer Lee',
    businessName: 'Lee Media Productions',
    avatar: null,
    badge: 'Gold',
    acceptanceRating: 88,
    experienceYears: 9,
    industries: ['Photography', 'Videography'],
    preferredRoles: ['Event Photographer', 'Commercial Videographer'],
    location: 'Brisbane',
    suburb: 'Fortitude Valley',
    radiusKm: 50,
    taxTypes: ['ABN'],
    abnNumber: '89 012 345 678',
    phone: '+61 489 012 345',
    email: 'jennifer@leemedia.com.au',
    languages: ['English', 'Cantonese'],
    qualifications: ['Diploma in Photography', 'Drone Pilot License'],
    education: 'Queensland College of Art',
    availability: {
      summary: 'Flexible, Event-based schedule',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    payPreference: {
      min: 60,
      max: 90,
    },
    reviewCount: 112,
    bio: 'Professional photographer and videographer specializing in events, corporate work, and commercial projects. Independent contractor with full equipment and ABN.',
    skills: ['Event Photography', 'Video Production', 'Drone Photography', 'Photo Editing', 'Post-Production'],
  },
  {
    id: 'abn-009',
    name: 'Thomas Brown',
    businessName: 'Brown Clean Services',
    avatar: null,
    badge: 'Bronze',
    acceptanceRating: 73,
    experienceYears: 2,
    industries: ['Cleaning', 'Commercial Cleaning'],
    preferredRoles: ['Commercial Cleaner', 'Window Cleaner'],
    location: 'Gold Coast',
    suburb: 'Surfers Paradise',
    radiusKm: 20,
    taxTypes: ['ABN'],
    abnNumber: '90 123 456 789',
    phone: '+61 490 123 456',
    email: 'thomas@brownclean.com.au',
    languages: ['English'],
    qualifications: ['Certificate II in Cleaning Operations'],
    education: 'TAFE Queensland',
    availability: {
      summary: 'Mon - Fri, Early morning or evening',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 28,
      max: 42,
    },
    reviewCount: 28,
    bio: 'Commercial cleaning contractor offering office cleaning, window cleaning, and specialized cleaning services. Operates as independent contractor with ABN.',
    skills: ['Commercial Cleaning', 'Window Cleaning', 'Carpet Cleaning', 'Sanitization'],
  },
  {
    id: 'abn-010',
    name: 'Amanda White',
    businessName: 'White Accounting Solutions',
    avatar: null,
    badge: 'Platinum',
    acceptanceRating: 97,
    experienceYears: 15,
    industries: ['Accounting', 'Bookkeeping'],
    preferredRoles: ['Accountant', 'Bookkeeper'],
    location: 'Sydney',
    suburb: 'Parramatta',
    radiusKm: 60,
    taxTypes: ['ABN'],
    abnNumber: '01 234 567 890',
    phone: '+61 401 234 567',
    email: 'amanda@whiteaccounting.com.au',
    languages: ['English', 'Spanish'],
    qualifications: ['CPA Certified', 'Bachelor of Accounting'],
    education: 'University of Sydney',
    availability: {
      summary: 'Mon - Fri, Remote or On-site',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 65,
      max: 95,
    },
    reviewCount: 234,
    bio: 'Certified practicing accountant offering bookkeeping, tax preparation, and financial consulting services. Independent contractor serving small businesses and individuals.',
    skills: ['Bookkeeping', 'Tax Preparation', 'Financial Reporting', 'Xero/QuickBooks', 'BAS Preparation'],
  },
  {
    id: 'abn-011',
    name: 'Christopher Martinez',
    businessName: 'Martinez HVAC Solutions',
    avatar: null,
    badge: 'Silver',
    acceptanceRating: 86,
    experienceYears: 6,
    industries: ['HVAC', 'Air Conditioning'],
    preferredRoles: ['HVAC Technician', 'AC Installer'],
    location: 'Melbourne',
    suburb: 'Brunswick',
    radiusKm: 35,
    taxTypes: ['ABN'],
    abnNumber: '12 345 678 901',
    phone: '+61 412 345 679',
    email: 'chris@martinezhvac.com.au',
    languages: ['English', 'Spanish'],
    qualifications: ['Certificate III in Air Conditioning and Refrigeration', 'Refrigerant Handling License'],
    education: 'RMIT University',
    availability: {
      summary: 'Mon - Sat, Emergency available',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    payPreference: {
      min: 52,
      max: 75,
    },
    reviewCount: 89,
    bio: 'HVAC contractor specializing in installation, maintenance, and repairs of air conditioning and heating systems. Licensed and insured independent contractor.',
    skills: ['AC Installation', 'HVAC Maintenance', 'Refrigerant Handling', 'System Diagnostics', 'Ductwork'],
  },
  {
    id: 'abn-012',
    name: 'Nicole Garcia',
    businessName: 'Garcia Creative Studio',
    avatar: null,
    badge: 'Gold',
    acceptanceRating: 90,
    experienceYears: 8,
    industries: ['Graphic Design', 'Branding'],
    preferredRoles: ['Graphic Designer', 'Brand Identity Designer'],
    location: 'Perth',
    suburb: 'Fremantle',
    radiusKm: 40,
    taxTypes: ['ABN'],
    abnNumber: '23 456 789 012',
    phone: '+61 423 456 780',
    email: 'nicole@garciacreative.com.au',
    languages: ['English', 'Portuguese'],
    qualifications: ['Bachelor of Design', 'Adobe Certified Expert'],
    education: 'Edith Cowan University',
    availability: {
      summary: 'Mon - Fri, Remote work preferred',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    payPreference: {
      min: 55,
      max: 80,
    },
    reviewCount: 145,
    bio: 'Creative graphic designer and branding specialist working as freelance contractor. Delivers logo design, brand identity, and marketing materials for businesses.',
    skills: ['Logo Design', 'Brand Identity', 'Print Design', 'Digital Design', 'Adobe Creative Suite'],
  },
];

/**
 * Get a contractor by ID
 * @param {string} contractorId - The ID of the contractor
 * @returns {Object|null} The contractor object or null if not found
 */
export const getContractorById = (contractorId) => {
  return DUMMY_CONTRACTORS.find(contractor => contractor.id === contractorId) || null;
};

/**
 * Get all contractors filtered by industry
 * @param {string} industry - The industry to filter by
 * @returns {Array} Array of contractors in the specified industry
 */
export const getContractorsByIndustry = (industry) => {
  return DUMMY_CONTRACTORS.filter(contractor => 
    contractor.industries.includes(industry)
  );
};

/**
 * Get all contractors filtered by preferred role
 * @param {string} role - The role to filter by
 * @returns {Array} Array of contractors with the specified role
 */
export const getContractorsByRole = (role) => {
  return DUMMY_CONTRACTORS.filter(contractor => 
    contractor.preferredRoles.includes(role)
  );
};

/**
 * Get contractors within a specific location radius
 * @param {string} suburb - The suburb to search from
 * @param {number} maxRadius - Maximum radius in km
 * @returns {Array} Array of contractors within the radius
 */
export const getContractorsByLocation = (suburb, maxRadius = 50) => {
  return DUMMY_CONTRACTORS.filter(contractor => 
    contractor.suburb.toLowerCase() === suburb.toLowerCase() ||
    contractor.radiusKm <= maxRadius
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

