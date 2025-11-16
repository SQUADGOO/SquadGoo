import { createSlice } from '@reduxjs/toolkit';
import images from '@/assets/images';

const initialState = {
  activeOffers: [
    {
      id: 1,
      title: 'Full house painting',
      salary: '$500/month',
      salaryValue: 500,
      postedAt: new Date().toISOString(),
      expiry: 'Expire in : 2 days',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...',
      company: 'McDonald',
      location: 'Sydney',
      country: 'Australia',
      experience: '4 years',
      experienceYears: 4,
      logo: images.mc,
    },
    {
      id: 2,
      title: 'Kitchen deep cleaning',
      salary: '$1200/month',
      salaryValue: 1200,
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      expiry: 'Expire in : 5 days',
      description:
        'Clean commercial kitchen equipment, floors, and vents. PPE provided.',
      company: 'KitchenPro',
      location: 'Melbourne',
      country: 'Australia',
      experience: '2 years',
      experienceYears: 2,
      logo: images.mc,
    },
    {
      id: 3,
      title: 'Warehouse picker',
      salary: '$800/month',
      salaryValue: 800,
      postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
      expiry: 'Expire in : 1 day',
      description:
        'Pick and pack orders in a fast-paced environment.',
      company: 'OzLogistics',
      location: 'Brisbane',
      country: 'Australia',
      experience: '1 year',
      experienceYears: 1,
      logo: images.mc,
    },
    {
      id: 4,
      title: 'Customer support associate',
      salary: '$1500/month',
      salaryValue: 1500,
      postedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      expiry: 'Expire in : 3 days',
      description:
        'Handle inbound calls and emails for e-commerce customers.',
      company: 'ShopMate',
      location: 'Sydney',
      country: 'Australia',
      experience: '3 years',
      experienceYears: 3,
      logo: images.mc,
    },
    {
      id: 5,
      title: 'Gardening and lawn care',
      salary: '$700/month',
      salaryValue: 700,
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      expiry: 'Expire in : 6 days',
      description:
        'Maintain lawns, hedges, and gardens for residential clients.',
      company: 'GreenThumb',
      location: 'Perth',
      country: 'Australia',
      experience: '2 years',
      experienceYears: 2,
      logo: images.mc,
    },
    {
      id: 6,
      title: 'Retail store assistant',
      salary: '$1100/month',
      salaryValue: 1100,
      postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      expiry: 'Expire in : 4 days',
      description:
        'Assist customers, manage stock, and operate POS.',
      company: 'CityRetail',
      location: 'Adelaide',
      country: 'Australia',
      experience: '1 year',
      experienceYears: 1,
      logo: images.mc,
    },
    {
      id: 7,
      title: 'Painting contractor assistant',
      salary: '$950/month',
      salaryValue: 950,
      postedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      expiry: 'Expire in : 2 days',
      description:
        'Assist lead painters with prep and finishing.',
      company: 'ProPaint',
      location: 'Gold Coast',
      country: 'Australia',
      experience: '2 years',
      experienceYears: 2,
      logo: images.mc,
    },
    {
      id: 8,
      title: 'Office cleaner (evening shift)',
      salary: '$600/month',
      salaryValue: 600,
      postedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      expiry: 'Expire in : 2 days',
      description:
        'Clean offices and common areas after hours.',
      company: 'ShineCo',
      location: 'Sydney',
      country: 'Australia',
      experience: '0 years',
      experienceYears: 0,
      logo: images.mc,
    },
  ],
  acceptedOffers: [],
};

const jobSeekerOffersSlice = createSlice({
  name: 'jobSeekerOffers',
  initialState,
  reducers: {
    applyToOffer: (state, { payload }) => {
      const offerId = typeof payload === 'object' ? payload.id : payload;
      const index = state.activeOffers.findIndex(o => o.id === offerId);
      if (index !== -1) {
        const [offer] = state.activeOffers.splice(index, 1);
        state.acceptedOffers.unshift(offer);
      }
    },
    declineActiveOffer: (state, { payload }) => {
      const offerId = typeof payload === 'object' ? payload.id : payload;
      state.activeOffers = state.activeOffers.filter(o => o.id !== offerId);
    },
    removeAcceptedOffer: (state, { payload }) => {
      const offerId = typeof payload === 'object' ? payload.id : payload;
      state.acceptedOffers = state.acceptedOffers.filter(o => o.id !== offerId);
    },
    clearAllOffers: (state) => {
      state.activeOffers = [];
      state.acceptedOffers = [];
    },
  },
});

export const {
  applyToOffer,
  declineActiveOffer,
  removeAcceptedOffer,
  clearAllOffers,
} = jobSeekerOffersSlice.actions;

export default jobSeekerOffersSlice.reducer;


