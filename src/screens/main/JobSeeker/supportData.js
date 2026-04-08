export const supportFaqs = [
  {
    id: 'faq-1',
    question: 'How do I accept or decline a job offer?',
    answer:
      'Go to the "Job Offers" section. Tap on the offer you want to respond to, then choose "Accept," "Decline," or "Request Modification." You must respond before the offer expires.',
  },
  {
    id: 'faq-2',
    question: 'How do I request a modification to a job offer?',
    answer:
      'Open the offer in "Job Offers" and tap "Request Modification." Enter your requested changes (e.g., different start time, pay rate, etc.) and submit. The recruiter will review and respond.',
  },
  {
    id: 'faq-3',
    question: 'How do I withdraw my wallet balance?',
    answer:
      'Go to "Wallet," tap "Withdraw Coin," select your bank account, and enter the amount (minimum withdrawal applies). Follow the prompts to complete your withdrawal.',
  },
  {
    id: 'faq-4',
    question: 'What if my payment is delayed or missing?',
    answer:
      'First, check "Wallet" → "Job Seeker Escrows" to confirm payment status. If payment is still missing after the job is completed and the hold period has passed, contact support via Live Chat or Submit a Ticket.',
  },
  {
    id: 'faq-5',
    question: 'How do I update my profile or documents?',
    answer:
      'Tap your profile avatar, then choose the section you want to update (e.g., Basic Details, KYC, Qualifications). Edit your information and save changes. For verified details (email/phone), contact support to update.',
  },
  {
    id: 'faq-6',
    question: 'How do I complete my KYC verification?',
    answer:
      'Go to "KYC Verification" in your profile. Enter your details, upload a clear photo ID and a selfie with your ID, and (if required) proof of address. Submit for review. You\'ll be notified once verified.',
  },
  {
    id: 'faq-7',
    question: 'How do I reset my password or recover my account?',
    answer:
      'On the login screen, tap "Forgot Password?" and follow the instructions to reset using your registered email or phone. If you\'re locked out, contact support for help.',
  },
  {
    id: 'faq-8',
    question: 'How do I view my work history and completed jobs?',
    answer:
      'Go to "Job Offers" → "Completed Offers" to see all jobs you\'ve finished, payment status, and details.',
  },
  {
    id: 'faq-9',
    question: 'What if I want to cancel an accepted job?',
    answer:
      'If you need to cancel after accepting, open the job in "Active Offers" and tap "Cancel." Provide a valid reason. Frequent cancellations may affect your rating.',
  },
  {
    id: 'faq-10',
    question: 'How do I contact SQUADGOO support?',
    answer:
      'Tap "Support" in the menu. You can search FAQs, start a Live Chat, request a callback, or submit a support ticket.',
  },
  {
    id: 'faq-11',
    question: 'How do I change my email or phone number?',
    answer:
      'For security, email and phone changes must be made through support. Tap "Contact Support" in the "Contact Details" section to request an update.',
  },
  {
    id: 'faq-12',
    question: 'How do I know if I\'ve been paid for a job?',
    answer:
      'Go to "Wallet" → "Job Seeker Escrows" or "Transaction History." Payments move from "Hold" to "Available" after the 7-day dispute period.',
  },
  {
    id: 'faq-13',
    question: 'How do I upload or update my qualifications/certificates?',
    answer:
      'Go to "Extra Job Qualifications" in your profile. Select your qualification, upload the document, and (optionally) enter the expiry date.',
  },
  {
    id: 'faq-14',
    question: 'What if I have a technical issue or app crash?',
    answer:
      'Go to "Support" → "Submit a Ticket" or start a Live Chat. Include details about your device, app version, and a screenshot if possible.',
  },
];

export const ticketCategories = {
  'Offers & Work History': [
    'Didn\'t receive offer',
    'Offer expired',
    'Offer details incorrect',
    'Issue with completed job',
    'Can\'t request modification',
    'Other offer/work issue',
  ],
  'Wallet & Payments': [
    'Payment missing/delayed',
    'Withdrawal issue',
    'Wallet balance incorrect',
    'Bonus/referral issue',
    'Other wallet/payment issue',
  ],
  'KYC/Verification': [
    'KYC pending/slow',
    'Document upload failed',
    'Verification denied',
    'Need help with requirements',
    'Other KYC issue',
  ],
  'Profile & Documents': [
    'Can\'t update profile',
    'Document upload issue',
    'Profile incomplete',
    'Other profile issue',
  ],
  'Account Access & Login': [
    'Forgot password',
    '2FA issue',
    'Locked out',
    'Other login problem',
  ],
  'Notifications & Alerts': [
    'Not receiving alerts',
    'Too many alerts',
    'Turn off alerts',
    'Other notification issue',
  ],
  'App Features & Settings': [
    'Feature not working',
    'Settings not saving',
    'Other feature issue',
  ],
  'Technical/Other': [
    'App crash/bug',
    'Slow performance',
    'Other technical issue',
  ],
};

export const defaultTickets = [
  {
    id: 'TCK-3001',
    subject: 'Payment not received after completed job',
    category: 'Wallet & Payments',
    issueTypes: ['Payment missing/delayed'],
    status: 'In Progress',
    priority: 'High',
    createdAt: '2026-03-06 14:30',
    lastUpdated: '2h ago',
    messages: [
      { id: 'm1', sender: 'user', text: 'I completed a shift on March 4 but the payment hasn\'t appeared in my wallet yet.', time: '14:30', date: 'Mar 6' },
      { id: 'm2', sender: 'agent', text: 'Thank you for reaching out. Payments are held for 7 days after job completion. We\'re checking the status of your hold.', time: '15:00', date: 'Mar 6' },
    ],
  },
  {
    id: 'TCK-3002',
    subject: 'KYC verification stuck on pending',
    category: 'KYC/Verification',
    issueTypes: ['KYC pending/slow'],
    status: 'Open',
    priority: 'Medium',
    createdAt: '2026-03-05 10:15',
    lastUpdated: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'user', text: 'I submitted my KYC documents 5 days ago but still showing as pending.', time: '10:15', date: 'Mar 5' },
    ],
  },
  {
    id: 'TCK-3003',
    subject: 'Unable to accept job offer',
    category: 'Offers & Work History',
    issueTypes: ['Other offer/work issue'],
    status: 'Resolved',
    priority: 'High',
    createdAt: '2026-03-03 09:00',
    lastUpdated: '2d ago',
    messages: [
      { id: 'm1', sender: 'user', text: 'When I tap Accept on a job offer, nothing happens. The button doesn\'t respond.', time: '09:00', date: 'Mar 3' },
      { id: 'm2', sender: 'agent', text: 'Thanks for reporting this. Can you share your device type and app version?', time: '09:30', date: 'Mar 3' },
      { id: 'm3', sender: 'user', text: 'iPhone 14, app version 2.1.3.', time: '09:45', date: 'Mar 3' },
      { id: 'm4', sender: 'agent', text: 'We\'ve identified and fixed the issue. Please update the app and try again.', time: '11:00', date: 'Mar 3' },
    ],
  },
];
