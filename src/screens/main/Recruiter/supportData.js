export const supportFaqs = [
  {
    id: 'faq-1',
    question: 'How do I buy SG Coins to search for candidates?',
    answer:
      'Go to Wallet → Top-up → Purchase SG Coins using your card. Coins are instantly available. You\'ll spend 15 coins per Manual Search or 20 coins per Quick Search.',
  },
  {
    id: 'faq-2',
    question: 'How does the pay-per-match model work?',
    answer:
      'You only pay when you search for or match with candidates. No subscriptions, no monthly fees—just pay as you hire.',
  },
  {
    id: 'faq-3',
    question: 'Can I withdraw my unused SG Coins?',
    answer:
      'Yes. Go to Wallet → Withdrawals. Minimum 15 coins, 1 coin fee applies. Withdrawals go to your linked bank account.',
  },
  {
    id: 'faq-4',
    question: 'Can I talk to support outside business hours?',
    answer:
      'Live Chat is available Mon–Fri, 9AM–6PM AEST. For urgent issues outside these hours, submit a ticket or email support@squadgoo.com.au and our team will follow up next business day.',
  },
  {
    id: 'faq-5',
    question: 'Where do I track my payouts?',
    answer:
      'Navigate to Wallet → Transactions to see every payout and its status.',
  },
  {
    id: 'faq-6',
    question: 'How do I create a new job offer?',
    answer:
      'Go to Home → Manage Offers → Create Offer. Fill in job details and submit the offer for candidates to view.',
  },
  {
    id: 'faq-7',
    question: 'How do I filter offers by Manual or Quick Fill?',
    answer:
      'On the Offers page, use the dropdown filter at the top to switch between Manual Search and Quick Search offers.',
  },
  {
    id: 'faq-8',
    question: 'How can I edit a job offer after posting?',
    answer:
      'Go to Manage Offers, select the offer you want to edit, and click the Edit button. Update the details and save.',
  },
  {
    id: 'faq-9',
    question: 'What happens if a candidate requests a modification?',
    answer:
      'You\'ll see a notification in Pending Offers. Review the request, then Accept or Decline the modification. The candidate will be notified automatically.',
  },
  {
    id: 'faq-10',
    question: 'How do I view all matched candidates for my offers?',
    answer:
      'Go to Home → Matched Candidates Pool. You\'ll see a list of all candidates matched to your job offers, including profile and match percentage.',
  },
  {
    id: 'faq-11',
    question: 'How do I update my company profile or logo?',
    answer:
      'Go to My Profile → Company Info. Edit your details or upload a new company logo, then save changes.',
  },
  {
    id: 'faq-12',
    question: 'How do I verify my business (KYC/KYB)?',
    answer:
      'Go to My Profile → Verification. Follow the prompts to upload required documents and complete verification.',
  },
  {
    id: 'faq-13',
    question: 'Can I reset my password if I forget it?',
    answer:
      'Yes. On the login screen, tap \'Forgot Password?\' and follow the instructions to reset using your registered email or phone.',
  },
  {
    id: 'faq-14',
    question: 'How do I change notification preferences (email, SMS, app)?',
    answer:
      'Go to App Settings → Notification Preferences. Enable or disable notifications for Email, SMS, or App as preferred.',
  },
  {
    id: 'faq-15',
    question: 'How do I delete my recruiter account?',
    answer:
      'Go to App Settings → Security & Privacy → Delete Account. Follow the steps to permanently delete your account.',
  },
  {
    id: 'faq-16',
    question: 'Where can I find analytics and reports for my hiring activity?',
    answer:
      'Go to Rating & Reports → Billing & Spend Summary. View analytics, trends, and download reports as needed.',
  },
  {
    id: 'faq-17',
    question: 'How do I use SquadPairs for group hiring?',
    answer:
      'When creating a job offer, select two or more positions. The \'Hire SquadPairs\' option will appear—tick it to send offers to SquadPairs based on matching percentage.',
  },
  {
    id: 'faq-18',
    question: 'What should I do if I experience a technical issue or app crash?',
    answer:
      'Submit a ticket via Support → Create New Ticket. Attach a screenshot if possible and describe the problem in detail.',
  },
];

export const ticketCategories = {
  'General': ['Other General Issue'],
  'Payments & Billing': ['Wallet Issue', 'SG Coin Purchase', 'Refund Request', 'Invoice Problem', 'Other Payment Issue'],
  'Job Offers / Postings': ['Create Offer', 'Edit Offer', 'Expire Offer', 'Offer Not Visible', 'Other Posting Issue'],
  'Account Access & Login': ['Forgot Password', '2FA Issue', 'Locked Out', 'Other Login Problem'],
  'Verification (KYC/KYB)': ['KYC Pending', 'KYB Document Upload', 'Verification Denied', 'Other Verification Issue'],
  'Candidate Issues': ['Matching Problem', 'No Response', 'Communication Issue', 'Offer Status', 'Other Candidate Issue'],
  'Wallet/SG Coins': ['Balance Not Updating', 'Top-Up Issue', 'Withdrawal Delay', 'Transaction Error', 'Other Wallet Issue'],
  'Profile & Company Info': ['Edit Profile', 'Change Company Details', 'Logo Upload', 'Other Profile Issue'],
  'Notifications & Alerts': ['Not Receiving Alerts', 'Too Many Alerts', 'Turn Off Alerts', 'Other Notification Issue'],
  'App Features & Settings': ['Feature Not Working', 'Settings Not Saving', 'Other Feature Issue'],
  'Marketplace': ['Buy/Sell Problem', 'Dispute', 'Listing Issue', 'Payment Issue', 'Other Marketplace Issue'],
  'Reports & Analytics': ['Data Missing', 'Report Error', 'Understanding Metrics', 'Other Analytics Issue'],
  'Technical / Other': ['App Crash', 'Bug Report', 'Slow Performance', 'Other Technical Issue'],
};

export const defaultTickets = [
  {
    id: 'TCK-2041',
    subject: 'Issue with job posting visibility',
    category: 'Job Offers / Postings',
    issueTypes: ['Offer Not Visible'],
    status: 'In Progress',
    priority: 'High',
    createdAt: '2026-03-06 14:30',
    lastUpdated: '2h ago',
    messages: [
      { id: 'm1', sender: 'user', text: 'My recently posted job is not visible to applicants. I\'ve checked all settings. Please help!', time: '14:30', date: 'Mar 6' },
      { id: 'm2', sender: 'agent', text: 'Thank you for reaching out. We are investigating the issue. You can track the progress here.', time: '15:00', date: 'Mar 6' },
      { id: 'm3', sender: 'agent', text: 'We have identified a glitch and are working on a fix. Will notify once resolved.', time: '09:00', date: 'Mar 7', attachment: 'logs.zip' },
    ],
  },
  {
    id: 'TCK-2036',
    subject: 'Unable to add new contractor',
    category: 'Candidate Issues',
    issueTypes: ['Communication Issue'],
    status: 'Open',
    priority: 'Medium',
    createdAt: '2026-03-05 10:15',
    lastUpdated: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'user', text: 'I am unable to add a new contractor to my team. The button is greyed out.', time: '10:15', date: 'Mar 5' },
    ],
  },
  {
    id: 'TCK-2011',
    subject: 'Coins not reflecting after purchase',
    category: 'Wallet/SG Coins',
    issueTypes: ['Balance Not Updating', 'Top-Up Issue'],
    status: 'Resolved',
    priority: 'High',
    createdAt: '2026-03-03 09:00',
    lastUpdated: '2d ago',
    messages: [
      { id: 'm1', sender: 'user', text: 'I purchased 100 SG Coins but they are not showing in my wallet.', time: '09:00', date: 'Mar 3' },
      { id: 'm2', sender: 'agent', text: 'We are looking into this. Can you share your transaction receipt?', time: '09:30', date: 'Mar 3' },
      { id: 'm3', sender: 'user', text: 'Here is the receipt screenshot.', time: '09:45', date: 'Mar 3', attachment: 'receipt.png' },
      { id: 'm4', sender: 'agent', text: 'Thank you! We\'ve credited the coins to your wallet. Please check now.', time: '11:00', date: 'Mar 3' },
      { id: 'm5', sender: 'user', text: 'Okay, thanks to the update.', time: '10:15', date: 'Mar 4' },
    ],
  },
];

export const supportAgentProfile = {
  id: 'support',
  name: 'SquadGoo Support',
  lastMessage: 'Hey! How can we help today?',
  timestamp: 'Just now',
  avatar:
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=faces',
  isOnline: true,
  unreadCount: 0,
  isGroup: false,
  isSupport: true,
  status: 'Active now',
};

