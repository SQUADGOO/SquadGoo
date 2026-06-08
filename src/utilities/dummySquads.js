import { DUMMY_JOB_SEEKERS } from './dummyJobSeekers';

// Helper to calculate average rating
const calculateAverageRating = (memberIds) => {
  const members = DUMMY_JOB_SEEKERS.filter(js => memberIds.includes(js.id));
  if (members.length === 0) return 0;
  const total = members.reduce((sum, m) => sum + m.acceptanceRating, 0);
  return Math.round(total / members.length);
};

// Helper to get combined availability
const getCombinedAvailability = (memberIds) => {
  const members = DUMMY_JOB_SEEKERS.filter(js => memberIds.includes(js.id));
  const allDays = new Set();
  members.forEach(m => {
    if (m.availability?.days) {
      m.availability.days.forEach(day => allDays.add(day));
    }
  });
  return {
    summary: Array.from(allDays).join(', ') || 'Flexible',
    days: Array.from(allDays),
  };
};

// Helper to get combined pay preference
const getCombinedPayPreference = (memberIds) => {
  const members = DUMMY_JOB_SEEKERS.filter(js => memberIds.includes(js.id));
  if (members.length === 0) return { min: 0, max: 0 };
  const mins = members.map(m => m.payPreference?.min || 0);
  const maxs = members.map(m => m.payPreference?.max || 0);
  return {
    min: Math.min(...mins),
    max: Math.max(...maxs),
  };
};

export const DUMMY_SQUADS = [
  {
    id: 'squad-001',
    name: 'Elite Construction Team',
    description: 'Professional construction squad specializing in residential and commercial projects',
    avatar: null,
    badge: 'Gold',
    memberIds: ['js-001', 'js-004'], // Jane Jobseeker (Painter) + Liam Chen (Cleaning Supervisor)
    memberCount: 2,
    taxType: 'ABN',
    experience: '5+ years combined',
    preferredJobs: ['Construction', 'Maintenance', 'Cleaning Services'],
    location: 'Sydney',
    suburb: 'Parramatta',
    radiusKm: 30,
    availability: getCombinedAvailability(['js-001', 'js-004']),
    payPreference: getCombinedPayPreference(['js-001', 'js-004']),
    averageRating: calculateAverageRating(['js-001', 'js-004']),
    specialties: ['Painting', 'Cleaning', 'Surface Prep', 'Team Leadership'],
    languages: ['English', 'Mandarin'],
    completedProjects: 45,
    totalHours: 1200,
  },
  {
    id: 'squad-002',
    name: 'Warehouse Operations Squad',
    description: 'Experienced warehouse and logistics team ready for large-scale operations',
    avatar: null,
    badge: 'Platinum',
    memberIds: ['js-002', 'js-003'], // Michael Torres (Warehouse Manager) + Aisha Khan (Event Crew)
    memberCount: 2,
    taxType: 'Both',
    experience: '8+ years combined',
    preferredJobs: ['Logistics', 'Warehousing', 'Events'],
    location: 'Melbourne',
    suburb: 'Footscray',
    radiusKm: 35,
    availability: getCombinedAvailability(['js-002', 'js-003']),
    payPreference: getCombinedPayPreference(['js-002', 'js-003']),
    averageRating: calculateAverageRating(['js-002', 'js-003']),
    specialties: ['Inventory Management', 'Event Setup', 'Forklift Operation', 'Customer Service'],
    languages: ['English', 'Spanish', 'Hindi'],
    completedProjects: 62,
    totalHours: 1800,
  },
  {
    id: 'squad-003',
    name: 'Hospitality & Events Crew',
    description: 'Versatile team for hospitality, events, and retail operations',
    avatar: null,
    badge: 'Silver',
    memberIds: ['js-003', 'js-006'], // Aisha Khan (Event Crew) + Noah Wilson (Store Assistant)
    memberCount: 2,
    taxType: 'ABN',
    experience: '3+ years combined',
    preferredJobs: ['Events', 'Hospitality', 'Retail'],
    location: 'Brisbane',
    suburb: 'Fortitude Valley',
    radiusKm: 20,
    availability: getCombinedAvailability(['js-003', 'js-006']),
    payPreference: getCombinedPayPreference(['js-003', 'js-006']),
    averageRating: calculateAverageRating(['js-003', 'js-006']),
    specialties: ['Event Setup', 'Customer Service', 'Visual Merchandising', 'POS Systems'],
    languages: ['English', 'Hindi'],
    completedProjects: 38,
    totalHours: 950,
  },
  {
    id: 'squad-004',
    name: 'Landscaping Professionals',
    description: 'Expert landscaping and outdoor project team',
    avatar: null,
    badge: 'Gold',
    memberIds: ['js-005'], // Sofia Romero (Landscape Designer)
    memberCount: 1,
    taxType: 'ABN',
    experience: '7+ years',
    preferredJobs: ['Landscaping', 'Outdoor Projects'],
    location: 'Adelaide',
    suburb: 'Norwood',
    radiusKm: 40,
    availability: getCombinedAvailability(['js-005']),
    payPreference: getCombinedPayPreference(['js-005']),
    averageRating: calculateAverageRating(['js-005']),
    specialties: ['Design', 'Site Management', 'Client Liaison'],
    languages: ['English', 'Spanish'],
    completedProjects: 28,
    totalHours: 650,
  },
  {
    id: 'squad-005',
    name: 'Multi-Service Team',
    description: 'Flexible squad covering construction, cleaning, and general maintenance',
    avatar: null,
    badge: 'Bronze',
    memberIds: ['js-001', 'js-004', 'js-006'], // Jane, Liam, Noah
    memberCount: 3,
    taxType: 'Both',
    experience: '6+ years combined',
    preferredJobs: ['Construction', 'Cleaning Services', 'Retail', 'Maintenance'],
    location: 'Sydney',
    suburb: 'CBD',
    radiusKm: 25,
    availability: getCombinedAvailability(['js-001', 'js-004', 'js-006']),
    payPreference: getCombinedPayPreference(['js-001', 'js-004', 'js-006']),
    averageRating: calculateAverageRating(['js-001', 'js-004', 'js-006']),
    specialties: ['Painting', 'Cleaning', 'Retail Operations', 'General Maintenance'],
    languages: ['English'],
    completedProjects: 52,
    totalHours: 1400,
  },
];

// Helper function to get squad with full member details
export const getSquadWithMembers = (squadId) => {
  const squad = DUMMY_SQUADS.find(s => s.id === squadId);
  if (!squad) return null;
  
  return {
    ...squad,
    members: DUMMY_JOB_SEEKERS.filter(js => squad.memberIds.includes(js.id)),
  };
};

// Helper to get all squads with member details
export const getAllSquadsWithMembers = () => {
  return DUMMY_SQUADS.map(squad => ({
    ...squad,
    members: DUMMY_JOB_SEEKERS.filter(js => squad.memberIds.includes(js.id)),
  }));
};

