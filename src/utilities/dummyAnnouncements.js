export const ANNOUNCEMENT_CATEGORIES = [
  {id: 'all', label: 'All'},
  {id: 'news', label: 'News', color: '#1E40AF', bg: '#DBEAFE'},
  {id: 'update', label: 'Updates', color: '#059669', bg: '#D1FAE5'},
  {id: 'promo', label: 'Promos', color: '#D97706', bg: '#FEF3C7'},
  {id: 'alert', label: 'Alerts', color: '#DC2626', bg: '#FEE2E2'},
];

export const getCategoryMeta = id =>
  ANNOUNCEMENT_CATEGORIES.find(c => c.id === id) ||
  ANNOUNCEMENT_CATEGORIES[0];

export const DUMMY_ANNOUNCEMENTS = [
  {
    id: 'ann-001',
    category: 'news',
    title: 'New Labor Market Reforms Announced',
    body: 'The Australian government has introduced new regulations for gig workers, including stronger minimum wage protections, benefits eligibility, and clearer classification rules. The changes will roll out progressively over the next 6 months. SquadGoo will adapt offer flows to stay compliant — no action required from you.',
    cover: 'https://picsum.photos/seed/squadgoo-ann-1/800/400',
    createdAt: '22 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 24, clap: 8, love: 5, idea: 2},
    comments: [
      {
        id: 'c1',
        author: 'Michael Torres',
        text: "Finally, was hoping for this. Any update on the rollout date?",
        date: '3h ago',
      },
      {
        id: 'c2',
        author: 'Elite Builders Pty Ltd',
        text: 'Good move — helps everyone play on a level field.',
        date: '5h ago',
      },
    ],
  },
  {
    id: 'ann-002',
    category: 'update',
    title: 'Quick Fill now supports multi-role offers',
    body: 'You can now post Quick Fill offers for multiple roles in a single flow — great for events, construction sites, and warehouse operations that need mixed staffing. Find it under Home → Quick Fill → New Offer.',
    cover: 'https://picsum.photos/seed/squadgoo-ann-2/800/400',
    createdAt: '20 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 18, clap: 5, idea: 4},
    comments: [
      {
        id: 'c1',
        author: 'Jane Doe',
        text: 'This is huge for multi-trade sites. Thanks team!',
        date: '1d ago',
      },
    ],
  },
  {
    id: 'ann-003',
    category: 'promo',
    title: '🎉 Double Coins on Top-Ups this week',
    body: "From 22–28 April, every coin top-up gets matched 1:1 — top up $50, get $100 in coins. One-time per account. Head to Wallet → Top Up to claim.",
    cover: 'https://picsum.photos/seed/squadgoo-ann-3/800/400',
    createdAt: '22 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 42, love: 18, clap: 9, funny: 3},
    comments: [
      {
        id: 'c1',
        author: 'Aisha Khan',
        text: 'Just topped up — thanks!',
        date: '30m ago',
      },
      {
        id: 'c2',
        author: 'QuickShip Warehousing',
        text: 'Much appreciated 🙏',
        date: '2h ago',
      },
      {
        id: 'c3',
        author: 'Liam Chen',
        text: 'Does this work with PayID too?',
        date: '4h ago',
      },
    ],
  },
  {
    id: 'ann-004',
    category: 'alert',
    title: 'Scheduled maintenance: Sunday 27 April, 2–4 AM AEST',
    body: 'The app will be briefly unavailable during a scheduled database upgrade. Active shifts and payments will not be interrupted. We recommend not starting new Quick Fill offers during this window.',
    cover: 'https://picsum.photos/seed/squadgoo-ann-4/800/400',
    createdAt: '21 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 6, idea: 3},
    comments: [],
  },
  {
    id: 'ann-005',
    category: 'news',
    title: 'Squad Pool feature now live in Melbourne',
    body: 'Squads — small teams of job seekers who work together — are now available to recruiters in the Melbourne region. Expect faster fills for event and warehouse jobs that need 3+ staff.',
    cover: 'https://picsum.photos/seed/squadgoo-ann-5/800/400',
    createdAt: '18 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 31, clap: 12, love: 4, support: 6},
    comments: [
      {
        id: 'c1',
        author: 'Metro Logistics',
        text: 'When is Sydney getting this?',
        date: '2d ago',
      },
    ],
  },
  {
    id: 'ann-006',
    category: 'update',
    title: 'New badge tiers: Platinum and Gold',
    body: 'High-performing squads and contractors can now earn Platinum and Gold badges based on completion rate, ratings, and hours worked. Badges show on your profile and boost your rank in recruiter searches.',
    cover: 'https://picsum.photos/seed/squadgoo-ann-6/800/400',
    createdAt: '15 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 15, clap: 4, idea: 2},
    comments: [],
  },
  {
    id: 'ann-007',
    category: 'promo',
    title: 'Refer a recruiter, earn 500 coins',
    body: 'Invite recruiter friends to SquadGoo. When they post their first Quick Fill offer, you get 500 coins. No cap on referrals. Share link available in Wallet → Referrals.',
    cover: 'https://picsum.photos/seed/squadgoo-ann-7/800/400',
    createdAt: '10 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 22, love: 5, clap: 3},
    comments: [
      {
        id: 'c1',
        author: 'Elite Builders Pty Ltd',
        text: 'Already got 3 signups 🔥',
        date: '3d ago',
      },
    ],
  },
  {
    id: 'ann-008',
    category: 'news',
    title: 'Partnership with Major Australian Event Network',
    body: 'SquadGoo has partnered with one of the largest event-staffing networks in Australia. Expect more event-focused Quick Fill opportunities coming through the platform over the coming weeks.',
    cover: 'https://picsum.photos/seed/squadgoo-ann-8/800/400',
    createdAt: '05 Apr 2026',
    author: 'SquadGoo Admin',
    reactions: {like: 27, clap: 7, support: 3},
    comments: [],
  },
];

export const getAnnouncementById = id =>
  DUMMY_ANNOUNCEMENTS.find(a => a.id === id) || null;
