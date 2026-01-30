import { createSlice } from '@reduxjs/toolkit';
import { COUNTRIES } from '@/utilities/appData';

// Dummy candidates generator
const generateDummyCandidates = (jobId) => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  // Use a subset of countries for dummy data
  const locations = COUNTRIES.slice(0, 20); // Use first 20 countries for variety
  const experiences = ['2 years', '3 years', '5 years', '1 year', '4 years', '6+ years', 'Fresh graduate'];
  const statuses = ['pending', 'pending', 'pending', 'accepted', 'rejected']; // More pending for variety
  
  const candidatesCount = Math.floor(Math.random() * 6) + 3; // 3-8 candidates
  const candidates = [];
  
  for (let i = 0; i < candidatesCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    candidates.push({
      id: `candidate-${jobId}-${Date.now()}-${i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+61 4${Math.floor(Math.random() * 90000000 + 10000000)}`,
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: status,
      appliedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random within last 7 days
      skills: ['Communication', 'Teamwork', 'Problem Solving'].slice(0, Math.floor(Math.random() * 3) + 1),
    });
  }
  
  return candidates;
};

// Generate dummy completed and expired jobs
const generateDummyJobs = () => {
  const completedJobsData = [
    {
      title: 'Commercial Kitchen Deep Clean',
      type: 'Contract',
      industry: 'Cleaning Services',
      location: 'Sydney CBD',
      salaryRange: '$25/hr to $35/hr',
      salaryMin: 25,
      salaryMax: 35,
      experience: '2 Years 0 Month',
      staffNumber: 2,
      searchType: 'quick',
      daysAgo: 5,
      jobDescription: 'Deep cleaning of commercial kitchen facilities including equipment sanitization, floor cleaning, and vent maintenance. All equipment was thoroughly cleaned and sanitized.',
      description: 'Deep cleaning of commercial kitchen facilities including equipment sanitization, floor cleaning, and vent maintenance. All equipment was thoroughly cleaned and sanitized.',
      rangeKm: 10,
      salaryType: 'Hourly',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: true,
        bonuses: false,
        overtime: false,
      },
    },
    {
      title: 'Warehouse Inventory Management',
      type: 'Full-time',
      industry: 'Logistics',
      location: 'Melbourne',
      salaryRange: '$22/hr to $30/hr',
      salaryMin: 22,
      salaryMax: 30,
      experience: '3 Years 0 Month',
      staffNumber: 3,
      searchType: 'manual',
      daysAgo: 12,
      jobDescription: 'Inventory tracking and warehouse organization for logistics company. Successfully organized warehouse layout and implemented new inventory system.',
      description: 'Inventory tracking and warehouse organization for logistics company. Successfully organized warehouse layout and implemented new inventory system.',
      rangeKm: 20,
      salaryType: 'Hourly',
      taxType: 'TFN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: true,
        bonuses: true,
        overtime: true,
      },
    },
    {
      title: 'Garden Landscaping Project',
      type: 'Contract',
      industry: 'Landscaping',
      location: 'Brisbane',
      salaryRange: '$20/hr to $28/hr',
      salaryMin: 20,
      salaryMax: 28,
      experience: '1 Year 0 Month',
      staffNumber: 2,
      searchType: 'quick',
      daysAgo: 8,
      jobDescription: 'Complete garden landscaping including planting, hardscaping, irrigation installation, and lawn maintenance. Project completed on time and within budget.',
      description: 'Complete garden landscaping including planting, hardscaping, irrigation installation, and lawn maintenance. Project completed on time and within budget.',
      rangeKm: 25,
      salaryType: 'Hourly',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: false,
        bonuses: false,
        overtime: false,
      },
    },
    {
      title: 'Office Renovation',
      type: 'Full-time',
      industry: 'Construction',
      location: 'Perth',
      salaryRange: '$30/hr to $45/hr',
      salaryMin: 30,
      salaryMax: 45,
      experience: '5 Years 0 Month',
      staffNumber: 4,
      searchType: 'manual',
      daysAgo: 20,
      jobDescription: 'Complete office space renovation including painting, carpentry, electrical work, and flooring. Delivered high-quality finish that exceeded client expectations.',
      description: 'Complete office space renovation including painting, carpentry, electrical work, and flooring. Delivered high-quality finish that exceeded client expectations.',
      rangeKm: 15,
      salaryType: 'Hourly',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: true,
        bonuses: true,
        overtime: true,
      },
    },
    {
      title: 'Event Setup & Cleanup',
      type: 'Casual',
      industry: 'Events',
      location: 'Gold Coast',
      salaryRange: '$18/hr to $25/hr',
      salaryMin: 18,
      salaryMax: 25,
      experience: '0 Years 6 Month',
      staffNumber: 5,
      searchType: 'quick',
      daysAgo: 3,
      jobDescription: 'Setup and cleanup for corporate events and functions. Handled multiple events successfully with excellent client feedback.',
      description: 'Setup and cleanup for corporate events and functions. Handled multiple events successfully with excellent client feedback.',
      rangeKm: 30,
      salaryType: 'Hourly',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: true,
        overtime: true,
      },
    },
    {
      title: 'Residential Painting Project',
      type: 'Contract',
      industry: 'Construction',
      location: 'Sydney',
      salaryRange: '$28/hr to $38/hr',
      salaryMin: 28,
      salaryMax: 38,
      experience: '2 Years 0 Month',
      staffNumber: 2,
      searchType: 'manual',
      daysAgo: 15,
      jobDescription: 'Interior and exterior painting of residential property. High-quality workmanship with attention to detail. Client very satisfied with results.',
      description: 'Interior and exterior painting of residential property. High-quality workmanship with attention to detail. Client very satisfied with results.',
      rangeKm: 18,
      salaryType: 'Hourly',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: false,
        overtime: false,
      },
    },
    {
      title: 'Retail Store Setup',
      type: 'Part-time',
      industry: 'Retail',
      location: 'Melbourne',
      salaryRange: '$21/hr to $27/hr',
      salaryMin: 21,
      salaryMax: 27,
      experience: '1 Year 0 Month',
      staffNumber: 3,
      searchType: 'quick',
      daysAgo: 10,
      jobDescription: 'Store setup and merchandising for new retail location. Organized product displays and set up point-of-sale systems.',
      description: 'Store setup and merchandising for new retail location. Organized product displays and set up point-of-sale systems.',
      rangeKm: 12,
      salaryType: 'Hourly',
      taxType: 'TFN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: true,
        overtime: false,
      },
    },
  ];

  const expiredJobsData = [
    {
      title: 'Construction Site Laborer',
      type: 'Full-time',
      location: 'Sydney',
      salaryRange: '$28/hr to $38/hr',
      experience: '2+ years',
      staffNumber: 3,
      searchType: 'manual',
      daysAgo: 35,
      description: 'General construction labor for residential building project.',
    },
    {
      title: 'Retail Store Assistant',
      type: 'Part-time',
      location: 'Melbourne CBD',
      salaryRange: '$20/hr to $26/hr',
      experience: '1+ years',
      staffNumber: 2,
      searchType: 'quick',
      daysAgo: 42,
      description: 'Customer service and stock management for busy retail store.',
    },
    {
      title: 'Delivery Driver',
      type: 'Casual',
      location: 'Brisbane',
      salaryRange: '$22/hr to $30/hr',
      experience: '1+ years',
      staffNumber: 1,
      searchType: 'quick',
      daysAgo: 50,
      description: 'Local delivery services for food and packages.',
    },
    {
      title: 'Hotel Housekeeping',
      type: 'Part-time',
      location: 'Adelaide',
      salaryRange: '$19/hr to $24/hr',
      experience: '0.5+ years',
      staffNumber: 4,
      searchType: 'manual',
      daysAgo: 38,
      description: 'Housekeeping and room maintenance for boutique hotel.',
    },
  ];

  const completedJobs = completedJobsData.map((data, index) => {
    const completedDate = new Date(Date.now() - data.daysAgo * 24 * 60 * 60 * 1000);
    const jobId = `completed-job-${index}-${Date.now()}`;
    const postedDate = new Date(completedDate.getTime() - 15 * 24 * 60 * 60 * 1000);
    const startDate = new Date(postedDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(postedDate.getTime() + 10 * 24 * 60 * 60 * 1000);
    
    return {
      id: jobId,
      title: data.title,
      type: data.type,
      location: data.location,
      salaryRange: data.salaryRange,
      salaryMin: data.salaryMin || 20,
      salaryMax: data.salaryMax || 30,
      experience: data.experience,
      salaryType: data.salaryType || 'Hourly',
      offerDate: postedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      createdAt: postedDate.toISOString(),
      completedAt: completedDate.toISOString(),
      completedDate: completedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      jobStartDate: startDate.toISOString().slice(0, 10), // YYYY-MM-DD
      jobEndDate: completedDate.toISOString().slice(0, 10), // YYYY-MM-DD
      expiresAt: expiryDate.toISOString(),
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'completed',
      searchType: data.searchType,
      staffNumber: data.staffNumber,
      jobDescription: data.jobDescription || data.description,
      description: data.description || data.jobDescription,
      industry: data.industry || 'General Services',
      rangeKm: data.rangeKm || 15,
      taxType: data.taxType || 'ABN',
      extraPay: data.extraPay || {},
      freshersCanApply: false,
    };
  });

  const expiredJobs = expiredJobsData.map((data, index) => {
    const expiredDate = new Date(Date.now() - data.daysAgo * 24 * 60 * 60 * 1000);
    const jobId = `expired-job-${index}-${Date.now()}`;
    const postedDate = new Date(expiredDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const expiryReasonOptions = [
      'No suitable candidates',
      'Time expired',
      'Budget changed',
      'Role no longer required',
    ];
    
    return {
      id: jobId,
      title: data.title,
      type: data.type,
      location: data.location,
      salaryRange: data.salaryRange,
      experience: data.experience,
      salaryType: 'Hourly',
      positionsFilled: 0,
      expiryReason:
        expiryReasonOptions[index % expiryReasonOptions.length],
      expiryNotes: '',
      offerDate: postedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      createdAt: postedDate.toISOString(),
      expireDate: expiredDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expiredAt: expiredDate.toISOString(),
      status: 'expired',
      searchType: data.searchType,
      staffNumber: data.staffNumber,
      jobDescription: data.description,
      industry: 'General Services',
      rangeKm: 15,
      taxType: 'ABN',
      freshersCanApply: false,
    };
  });
  
  return { completedJobs, expiredJobs };
};

const { completedJobs: initialCompletedJobs, expiredJobs: initialExpiredJobs } = generateDummyJobs();

// Generate candidates for initial jobs
const initialJobCandidates = {};
const initialCompletedByCandidates = {};

// Add candidates to completed jobs
initialCompletedJobs.forEach(job => {
  const candidates = generateDummyCandidates(job.id);
  // Mark some candidates as accepted (completed the job)
  const acceptedCandidates = candidates.filter((_, index) => index < job.staffNumber);
  acceptedCandidates.forEach(candidate => {
    candidate.status = 'accepted';
  });
  initialJobCandidates[job.id] = candidates;
  initialCompletedByCandidates[job.id] = acceptedCandidates.map(c => c.id);
});

// Add candidates to expired jobs
initialExpiredJobs.forEach(job => {
  initialJobCandidates[job.id] = generateDummyCandidates(job.id);
});

// Add dummy accepted candidates for quick search offers
// These correspond to the dummy accepted offers in quickSearchSlice
const quickJobId1 = 'quick-job-dummy-001';
const quickJobId2 = 'quick-job-dummy-002';

initialJobCandidates[quickJobId1] = [
  {
    id: 'js-001',
    name: 'Jane Jobseeker',
    email: 'jane.jobseeker@email.com',
    phone: '+61 400 000 001',
    experience: '4 years',
    location: 'Sydney, Parramatta',
    status: 'accepted',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Painting', 'Surface Prep', 'Team Leadership'],
  },
];

initialJobCandidates[quickJobId2] = [
  {
    id: 'js-002',
    name: 'Michael Torres',
    email: 'michael.torres@email.com',
    phone: '+61 400 000 002',
    experience: '6 years',
    location: 'Melbourne, Footscray',
    status: 'accepted',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Inventory Systems', 'Team Training', 'Forklift Operation'],
  },
];

// Add 3 more dummy accepted candidates for quick search offers
const quickJobId3 = 'quick-job-dummy-003';
const quickJobId4 = 'quick-job-dummy-004';
const quickJobId5 = 'quick-job-dummy-005';

initialJobCandidates[quickJobId3] = [
  {
    id: 'js-003',
    name: 'Aisha Khan',
    email: 'aisha.khan@email.com',
    phone: '+61 400 000 003',
    experience: '2 years',
    location: 'Brisbane, Fortitude Valley',
    status: 'accepted',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Customer Service', 'Manual Handling', 'Scheduling'],
  },
];

initialJobCandidates[quickJobId4] = [
  {
    id: 'js-004',
    name: 'Liam Chen',
    email: 'liam.chen@email.com',
    phone: '+61 400 000 004',
    experience: '5 years',
    location: 'Perth, Scarborough',
    status: 'accepted',
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Team Leadership', 'Chemical Handling', 'Quality Assurance'],
  },
];

initialJobCandidates[quickJobId5] = [
  {
    id: 'js-005',
    name: 'Sofia Romero',
    email: 'sofia.romero@email.com',
    phone: '+61 400 000 005',
    experience: '7 years',
    location: 'Adelaide, Norwood',
    status: 'accepted',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Design', 'Site Management', 'Client Liaison'],
  },
];

// Generate dummy active jobs for job seekers
const generateDummyActiveJobs = () => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  
  const activeJobsData = [
    {
      title: 'Full House Painting',
      type: 'Full-time',
      industry: 'Construction',
      experience: '3 Years 0 Month',
      staffNumber: '2',
      location: 'Sydney',
      rangeKm: 15,
      salaryRange: '$25/hr to $35/hr',
      salaryMin: 25,
      salaryMax: 35,
      salaryType: 'Hourly',
      jobStartDate: '2024-02-01',
      jobEndDate: '2024-02-15',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: false,
        overtime: true,
      },
      availability: 'Monday to Friday, 8am - 5pm',
      taxType: 'ABN',
      searchType: 'manual',
      jobDescription: 'We are looking for experienced painters to complete a full house painting project. Must have own tools and transportation. Work includes interior and exterior painting, preparation, and cleanup.',
    },
    {
      title: 'Kitchen Deep Cleaning',
      type: 'Contract',
      industry: 'Cleaning Services',
      experience: '1 Year 0 Month',
      staffNumber: '1',
      location: 'Melbourne',
      rangeKm: 10,
      salaryRange: '$22/hr to $30/hr',
      salaryMin: 22,
      salaryMax: 30,
      salaryType: 'Hourly',
      jobStartDate: '2024-01-20',
      jobEndDate: '2024-01-22',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: true,
        bonuses: false,
        overtime: false,
      },
      availability: 'Flexible hours',
      taxType: 'ABN',
      searchType: 'quick',
      jobDescription: 'Deep cleaning of commercial kitchen including equipment sanitization, floor cleaning, and vent maintenance. PPE provided. Must have food handling certificate.',
    },
    {
      title: 'Warehouse Picker',
      type: 'Part-time',
      industry: 'Logistics',
      experience: '0 Years 6 Month',
      staffNumber: '3',
      location: 'Brisbane',
      rangeKm: 20,
      salaryRange: '$20/hr to $28/hr',
      salaryMin: 20,
      salaryMax: 28,
      salaryType: 'Hourly',
      jobStartDate: '2024-01-25',
      jobEndDate: '2024-03-25',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: false,
        weekend: true,
        shiftLoading: true,
        bonuses: true,
        overtime: true,
      },
      availability: 'Morning and afternoon shifts available',
      taxType: 'TFN',
      searchType: 'manual',
      jobDescription: 'Pick and pack orders in fast-paced warehouse environment. Physical work required. Must be able to lift 20kg. Training provided.',
    },
    {
      title: 'Garden Landscaping',
      type: 'Contract',
      industry: 'Landscaping',
      experience: '2 Years 0 Month',
      staffNumber: '2',
      location: 'Perth',
      rangeKm: 25,
      salaryRange: '$28/hr to $40/hr',
      salaryMin: 28,
      salaryMax: 40,
      salaryType: 'Hourly',
      jobStartDate: '2024-02-10',
      jobEndDate: '2024-02-28',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: false,
        bonuses: false,
        overtime: false,
      },
      availability: 'Monday to Saturday, 7am - 4pm',
      taxType: 'ABN',
      searchType: 'quick',
      jobDescription: 'Complete garden landscaping project including planting, hardscaping, irrigation installation, and lawn maintenance. Must have landscaping experience.',
    },
    {
      title: 'Office Cleaner (Evening)',
      type: 'Part-time',
      industry: 'Cleaning Services',
      experience: '0 Years 3 Month',
      staffNumber: '1',
      location: 'Adelaide',
      rangeKm: 12,
      salaryRange: '$19/hr to $24/hr',
      salaryMin: 19,
      salaryMax: 24,
      salaryType: 'Hourly',
      jobStartDate: '2024-01-15',
      jobEndDate: 'Ongoing',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: true,
        bonuses: false,
        overtime: false,
      },
      availability: 'Monday to Friday, 6pm - 9pm',
      taxType: 'TFN',
      searchType: 'manual',
      jobDescription: 'Evening office cleaning after business hours. Duties include vacuuming, mopping, restroom cleaning, and trash removal. Reliable transport required.',
    },
    {
      title: 'Construction Laborer',
      type: 'Full-time',
      industry: 'Construction',
      experience: '2 Years 0 Month',
      staffNumber: '4',
      location: 'Sydney',
      rangeKm: 20,
      salaryRange: '$30/hr to $45/hr',
      salaryMin: 30,
      salaryMax: 45,
      salaryType: 'Hourly',
      jobStartDate: '2024-02-05',
      jobEndDate: '2024-04-30',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: true,
        bonuses: false,
        overtime: true,
      },
      availability: 'Monday to Friday, 7am - 4pm',
      taxType: 'ABN',
      searchType: 'quick',
      jobDescription: 'General construction labor for residential building project. Tasks include material handling, site preparation, and assisting tradespeople. Safety boots and hard hat required.',
    },
    {
      title: 'Retail Store Assistant',
      type: 'Part-time',
      industry: 'Retail',
      experience: '1 Year 0 Month',
      staffNumber: '2',
      location: 'Melbourne CBD',
      rangeKm: 5,
      salaryRange: '$20/hr to $26/hr',
      salaryMin: 20,
      salaryMax: 26,
      salaryType: 'Hourly',
      jobStartDate: '2024-01-22',
      jobEndDate: 'Ongoing',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: true,
        overtime: false,
      },
      availability: 'Flexible shifts including weekends',
      taxType: 'TFN',
      searchType: 'manual',
      jobDescription: 'Customer service and stock management for busy retail store. Must have excellent communication skills and cash handling experience. Weekend availability essential.',
    },
    {
      title: 'Delivery Driver',
      type: 'Casual',
      industry: 'Transportation',
      experience: '1 Year 0 Month',
      staffNumber: '1',
      location: 'Brisbane',
      rangeKm: 30,
      salaryRange: '$22/hr to $30/hr',
      salaryMin: 22,
      salaryMax: 30,
      salaryType: 'Hourly',
      jobStartDate: '2024-01-18',
      jobEndDate: 'Ongoing',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: false,
        overtime: true,
      },
      availability: 'Monday to Saturday, flexible hours',
      taxType: 'ABN',
      searchType: 'quick',
      jobDescription: 'Local delivery services for food and packages. Must have valid driver\'s license and own vehicle. GPS navigation skills required. Mileage reimbursement provided.',
    },
    {
      title: 'Hotel Housekeeping',
      type: 'Part-time',
      industry: 'Hospitality',
      experience: '0 Years 6 Month',
      staffNumber: '4',
      location: 'Adelaide',
      rangeKm: 15,
      salaryRange: '$19/hr to $24/hr',
      salaryMin: 19,
      salaryMax: 24,
      salaryType: 'Hourly',
      jobStartDate: '2024-01-20',
      jobEndDate: 'Ongoing',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: true,
        bonuses: false,
        overtime: false,
      },
      availability: 'Morning shifts, 7am - 2pm',
      taxType: 'TFN',
      searchType: 'manual',
      jobDescription: 'Housekeeping and room maintenance for boutique hotel. Duties include cleaning rooms, making beds, restocking amenities, and maintaining cleanliness standards. Training provided.',
    },
    {
      title: 'Event Setup & Cleanup',
      type: 'Casual',
      industry: 'Events',
      experience: '0 Years 3 Month',
      staffNumber: '5',
      location: 'Gold Coast',
      rangeKm: 25,
      salaryRange: '$18/hr to $25/hr',
      salaryMin: 18,
      salaryMax: 25,
      salaryType: 'Hourly',
      jobStartDate: '2024-02-01',
      jobEndDate: '2024-12-31',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: true,
        overtime: true,
      },
      availability: 'Event-based schedule, weekends and evenings',
      taxType: 'ABN',
      searchType: 'quick',
      jobDescription: 'Setup and cleanup for corporate events and functions. Physical work required. Must be available for weekend and evening events. Uniform provided.',
    },
  ];

  return activeJobsData.map((data, index) => {
    const jobId = `dummy-active-job-${index}-${Date.now()}`;
    const createdAt = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000); // Random within last 2 weeks
    
    return {
      id: jobId,
      ...data,
      status: 'active',
      createdAt: createdAt.toISOString(),
      offerDate: createdAt.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      description: data.jobDescription, // For compatibility
    };
  });
};

const initialActiveJobs = generateDummyActiveJobs();

// Add dummy quick search jobs for accepted offers
const now = new Date();
const dummyQuickJobs = [
  {
    id: 'quick-job-dummy-001',
    title: 'Commercial Painting Project',
    jobTitle: 'Commercial Painting Project',
    description: 'Large-scale commercial painting project requiring skilled painters. Experience with industrial equipment preferred.',
    industry: 'Construction',
    experienceYear: 4,
    staffCount: 2,
    location: 'Sydney CBD',
    rangeKm: 25,
    salaryMin: 30,
    salaryMax: 40,
    salaryType: 'Hourly',
    taxType: 'ABN',
    searchType: 'quick',
    status: 'matched',
    applicationCount: 1,
    recruiterId: 'recruiter-001',
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    offerDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  },
  {
    id: 'quick-job-dummy-002',
    title: 'Warehouse Inventory Management',
    jobTitle: 'Warehouse Inventory Management',
    description: 'Warehouse operations role focusing on inventory management and team coordination.',
    industry: 'Logistics',
    experienceYear: 5,
    staffCount: 1,
    location: 'Melbourne CBD',
    rangeKm: 30,
    salaryMin: 35,
    salaryMax: 45,
    salaryType: 'Hourly',
    taxType: 'ABN',
    searchType: 'quick',
    status: 'matched',
    applicationCount: 1,
    recruiterId: 'recruiter-001',
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    offerDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  },
  {
    id: 'quick-job-dummy-003',
    title: 'Event Setup and Management',
    jobTitle: 'Event Setup and Management',
    description: 'Event crew role for corporate events and functions. Setup and packdown experience required.',
    industry: 'Events',
    experienceYear: 2,
    staffCount: 3,
    location: 'Brisbane CBD',
    rangeKm: 20,
    salaryMin: 25,
    salaryMax: 32,
    salaryType: 'Hourly',
    taxType: 'ABN',
    searchType: 'quick',
    status: 'matched',
    applicationCount: 1,
    recruiterId: 'recruiter-001',
    createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    offerDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  },
  {
    id: 'quick-job-dummy-004',
    title: 'Commercial Deep Cleaning Service',
    jobTitle: 'Commercial Deep Cleaning Service',
    description: 'Deep cleaning supervisor role for large commercial facilities. Experience with commercial kitchens preferred.',
    industry: 'Cleaning Services',
    experienceYear: 5,
    staffCount: 2,
    location: 'Perth CBD',
    rangeKm: 35,
    salaryMin: 28,
    salaryMax: 36,
    salaryType: 'Hourly',
    taxType: 'TFN',
    searchType: 'quick',
    status: 'matched',
    applicationCount: 1,
    recruiterId: 'recruiter-001',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    offerDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  },
  {
    id: 'quick-job-dummy-005',
    title: 'Landscape Design and Installation',
    jobTitle: 'Landscape Design and Installation',
    description: 'Landscape design project requiring experienced landscape professional for bespoke outdoor projects.',
    industry: 'Landscaping',
    experienceYear: 7,
    staffCount: 1,
    location: 'Adelaide CBD',
    rangeKm: 40,
    salaryMin: 38,
    salaryMax: 55,
    salaryType: 'Hourly',
    taxType: 'ABN',
    searchType: 'quick',
    status: 'matched',
    applicationCount: 1,
    recruiterId: 'recruiter-001',
    createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    offerDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  },
];

const initialState = {
  activeJobs: dummyQuickJobs, // Start with dummy quick search jobs for accepted offers
  completedJobs: initialCompletedJobs,
  expiredJobs: initialExpiredJobs,
  jobCandidates: initialJobCandidates,
  completedByCandidates: initialCompletedByCandidates,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Add a new job (from Quick Search or Manual Search)
    addJob: (state, action) => {
      const jobId = action.payload.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newJob = {
        ...action.payload,
        id: jobId,
        status: 'posted', // Changed from 'active' to 'posted' for proper status progression
        applicationCount: 0,
        createdAt: new Date().toISOString(),
        offerDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };
      state.activeJobs.unshift(newJob); // Add to beginning of array
      
      // Generate dummy candidates for the job
      state.jobCandidates[jobId] = generateDummyCandidates(jobId);
    },

    // Update an existing job
    updateJob: (state, action) => {
      const { jobId, updates } = action.payload;
      const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        state.activeJobs[jobIndex] = {
          ...state.activeJobs[jobIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // Close/Delete a job
    closeJob: (state, action) => {
      const jobId = action.payload;
      state.activeJobs = state.activeJobs.filter(job => job.id !== jobId);
      // Optionally move to expiredJobs
      const closedJob = state.activeJobs.find(job => job.id === jobId);
      if (closedJob) {
        state.expiredJobs.push({
          ...closedJob,
          status: 'closed',
          closedAt: new Date().toISOString(),
        });
      }
    },

    // Mark job as completed
    completeJob: (state, action) => {
      const { jobId, completedByCandidates } = action.payload;
      const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        const completedJob = {
          ...state.activeJobs[jobIndex],
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        };
        state.completedJobs.unshift(completedJob);
        state.activeJobs.splice(jobIndex, 1);
        
        // Store which candidates completed the job
        if (completedByCandidates) {
          state.completedByCandidates[jobId] = completedByCandidates;
        }
      }
    },

    // Add candidate to a job
    addCandidateToJob: (state, action) => {
      const { jobId, candidate, autoAccept = false } = action.payload;
      if (!state.jobCandidates[jobId]) {
        state.jobCandidates[jobId] = [];
      }
      
      // If autoAccept is true (job seeker accepted the offer), set status to 'accepted'
      const candidateStatus = autoAccept ? 'accepted' : (candidate.status || 'pending');
      
      // Check if candidate already exists (by ID, email, or name)
      const existingCandidateIndex = state.jobCandidates[jobId].findIndex(
        c => c.id === candidate.id || 
             (candidate.email && c.email === candidate.email) ||
             (candidate.name && c.name === candidate.name && candidate.email && c.email === candidate.email)
      );
      
      const candidateData = {
        ...candidate,
        status: candidateStatus,
        appliedAt: candidate.appliedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (existingCandidateIndex !== -1) {
        // Update existing candidate - merge existing data with new data and set status
        state.jobCandidates[jobId][existingCandidateIndex] = {
          ...state.jobCandidates[jobId][existingCandidateIndex],
          ...candidateData,
          // Preserve original appliedAt if it exists
          appliedAt: state.jobCandidates[jobId][existingCandidateIndex].appliedAt || candidateData.appliedAt,
        };
      } else {
        // Add new candidate
        state.jobCandidates[jobId].push(candidateData);
        
        // Update job status and application count only when adding new candidate
        const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
          const job = state.activeJobs[jobIndex];
          // Update application count
          job.applicationCount = (job.applicationCount || 0) + 1;
          
          // Update status: posted → has_applicants (when first application)
          if (!autoAccept && (job.status === 'posted' || job.status === 'active')) {
            job.status = 'has_applicants';
          }
          job.updatedAt = new Date().toISOString();
        }
      }
      
      // If job seeker accepted, match making is complete - set status to 'matched'
      if (autoAccept) {
        const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
          state.activeJobs[jobIndex].status = 'matched';
          state.activeJobs[jobIndex].updatedAt = new Date().toISOString();
        }
      }
    },

    // Update job status explicitly
    updateJobStatus: (state, action) => {
      const { jobId, status } = action.payload;
      const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        const job = state.activeJobs[jobIndex];
        const validTransitions = {
          'posted': ['has_applicants'],
          'has_applicants': ['matched', 'has_applicants'], // Can stay has_applicants if more apply
          'matched': ['in_progress'],
          'in_progress': ['completed'],
        };
        
        // Validate status transition
        const allowedStatuses = validTransitions[job.status] || [];
        if (allowedStatuses.includes(status) || job.status === status) {
          job.status = status;
          job.updatedAt = new Date().toISOString();
        }
      }
    },

    // Update candidate status
    updateCandidateStatus: (state, action) => {
      const { jobId, candidateId, status } = action.payload;
      const candidates = state.jobCandidates[jobId];
      
      if (candidates) {
        const candidateIndex = candidates.findIndex(c => c.id === candidateId);
        if (candidateIndex !== -1) {
          candidates[candidateIndex].status = status;
          candidates[candidateIndex].updatedAt = new Date().toISOString();
        }
      }
    },

    // Mark job as expired
    expireJob: (state, action) => {
      const jobId = action.payload;
      const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        const expiredJob = {
          ...state.activeJobs[jobIndex],
          status: 'expired',
          expiredAt: new Date().toISOString(),
          expiryReason: state.activeJobs[jobIndex]?.expiryReason || '',
          expiryNotes: state.activeJobs[jobIndex]?.expiryNotes || '',
          positionsFilled: state.activeJobs[jobIndex]?.positionsFilled ?? 0,
        };
        state.expiredJobs.unshift(expiredJob);
        state.activeJobs.splice(jobIndex, 1);
      }
    },

    // Update expiry reason/notes for an expired job (analytics + recruiter notes)
    updateExpiredJobFeedback: (state, action) => {
      const { jobId, expiryReason, expiryNotes, positionsFilled } = action.payload || {};
      const idx = state.expiredJobs.findIndex(j => j.id === jobId);
      if (idx === -1) return;
      const job = state.expiredJobs[idx];
      if (typeof expiryReason === 'string') job.expiryReason = expiryReason;
      if (typeof expiryNotes === 'string') job.expiryNotes = expiryNotes;
      if (typeof positionsFilled === 'number') job.positionsFilled = positionsFilled;
      job.updatedAt = new Date().toISOString();
    },

    // Seed dummy data (only if empty)
    seedDummyData: (state) => {
      // Ensure objects are initialized
      if (!state.jobCandidates) {
        state.jobCandidates = {};
      }
      if (!state.completedByCandidates) {
        state.completedByCandidates = {};
      }
      if (!state.completedJobs) {
        state.completedJobs = [];
      }
      if (!state.expiredJobs) {
        state.expiredJobs = [];
      }

      const { completedJobs, expiredJobs } = generateDummyJobs();
      
      // Only seed if empty
      if (state.completedJobs.length === 0) {
        state.completedJobs = completedJobs;
        
        // Add candidates to completed jobs
        completedJobs.forEach(job => {
          const candidates = generateDummyCandidates(job.id);
          const acceptedCandidates = candidates.filter((_, index) => index < job.staffNumber);
          acceptedCandidates.forEach(candidate => {
            candidate.status = 'accepted';
          });
          state.jobCandidates[job.id] = candidates;
          state.completedByCandidates[job.id] = acceptedCandidates.map(c => c.id);
        });
      }
      
      if (state.expiredJobs.length === 0) {
        state.expiredJobs = expiredJobs;
        
        // Add candidates to expired jobs
        expiredJobs.forEach(job => {
          state.jobCandidates[job.id] = generateDummyCandidates(job.id);
        });
      }
    },

    // Initialize dummy data for active jobs (if empty)
    // NOTE: Disabled - we want to show only real jobs posted by recruiters
    initializeDummyData: (state) => {
      // Don't initialize dummy active jobs - only show real posted jobs
      // Keep this action for backward compatibility but don't populate dummy data
      if (!state.activeJobs) {
        state.activeJobs = [];
      }
    },

    // Clear all jobs (for logout or reset)
    clearJobs: (state) => {
      state.activeJobs = [];
      state.completedJobs = [];
      state.expiredJobs = [];
      state.jobCandidates = {};
      state.completedByCandidates = {};
    },

    // Clear dummy jobs (remove jobs with dummy ID pattern)
    clearDummyJobs: (state) => {
      // Remove jobs that have dummy job ID pattern (dummy-active-job-*)
      state.activeJobs = state.activeJobs.filter(
        job => !job.id?.includes('dummy-active-job-')
      );
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration from redux-persist
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload) {
        // Filter out old dummy jobs from persisted state, but keep our quick search dummy jobs
        const persistedActiveJobs = action.payload.jobs?.activeJobs || [];
        const realJobs = persistedActiveJobs.filter(
          job => !job.id?.includes('dummy-active-job-')
        );
        
        // Merge with dummy quick search jobs (avoid duplicates)
        const existingJobIds = new Set(realJobs.map(j => j.id));
        const newDummyJobs = dummyQuickJobs.filter(j => !existingJobIds.has(j.id));
        const mergedJobs = [...realJobs, ...newDummyJobs];
        
        return {
          ...state,
          activeJobs: mergedJobs, // Merge real jobs with dummy quick search jobs
          completedJobs: action.payload.jobs?.completedJobs || initialCompletedJobs,
          expiredJobs: action.payload.jobs?.expiredJobs || initialExpiredJobs,
          jobCandidates: action.payload.jobs?.jobCandidates || initialJobCandidates,
          completedByCandidates: action.payload.jobs?.completedByCandidates || initialCompletedByCandidates,
        };
      }
      return state;
    });
  },
});

export const {
  addJob,
  updateJob,
  closeJob,
  completeJob,
  expireJob,
  updateExpiredJobFeedback,
  addCandidateToJob,
  updateCandidateStatus,
  updateJobStatus,
  seedDummyData,
  clearJobs,
  clearDummyJobs,
  initializeDummyData,
} = jobsSlice.actions;

export default jobsSlice.reducer;

