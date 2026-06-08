// Auto-reply content for Live Chat quick actions
export const QUICK_ACTIONS = [
    { id: 'topup', label: 'Top-up SG Coins' },
    { id: 'job_offers', label: 'Job Offer Issues' },
    { id: 'kyc', label: 'KYC/KYB Verification' },
    { id: 'withdrawals', label: 'Withdrawals' },
    { id: 'technical', label: 'Technical Support' },
    { id: 'other', label: 'Other' },
];

export const MORE_TOPICS = [
    { id: 'profile', label: 'Profile & Company Info', icon: 'person-circle-outline' },
    { id: 'access', label: 'Account Access & Login', icon: 'key-outline' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications-outline' },
    { id: 'reports', label: 'Reports & Analytics', icon: 'bar-chart-outline' },
    { id: 'marketplace', label: 'Marketplace Issues', icon: 'storefront-outline' },
    { id: 'features', label: 'App Features & Settings', icon: 'settings-outline' },
    { id: 'matching', label: 'Candidate Matching', icon: 'people-outline' },
    { id: 'data_export', label: 'Data Export/Privacy', icon: 'download-outline' },
    { id: 'something_else', label: 'Something Else', icon: 'chatbox-ellipses-outline' },
];

export const AUTO_REPLIES = {
    topup:
        'To top-up SG Coins, go to Wallet → Top-up. Enter the amount you want to purchase and your card details. The money will be deducted directly from your card or bank account, and you\'ll instantly receive the equivalent amount in SG Coins (1 SG Coin = 1 AUD).',
    job_offers:
        'Job offers can be managed from Dashboard → Active Offers. You can create, edit, or expire offers anytime. If a candidate requests a modification, you\'ll see it in Pending Offers where you can Accept or Decline. Need more specific help?',
    kyc:
        'To complete KYC/KYB verification, go to My Profile → Verification. Upload your government-issued ID, business documents (ABN/ACN certificate), and proof of business address. Once verified, you\'ll get a blue tick badge. Verification typically takes 24–48 hours.',
    withdrawals:
        'To withdraw SG Coins, go to Wallet → Withdrawals. Minimum withdrawal is 5 coins, with a 1 coin fee applied. Withdrawals go to your linked bank account within 3–5 business days. You can add up to 5 bank accounts.',
    technical:
        'If you\'re experiencing a technical issue, please describe the problem in detail. Include your device type, app version, and steps to reproduce the issue. You can also attach a screenshot. Our team will investigate and get back to you shortly.',
    profile:
        'To update your company profile, go to My Profile → Company Info. You can edit your business name, ABN/ACN, company logo, website, and social media links. Changes are saved instantly.',
    access:
        'If you forgot your password, go to Login → Forgot Password? and follow the instructions to reset via email or phone. If you\'re locked out, submit a support ticket and our team will help you regain access.',
    notifications:
        'To manage notifications, go to App Settings → Notification Preferences. You can enable or disable Email, SMS, and In-App notifications. You can also customize which events trigger notifications.',
    reports:
        'View your hiring analytics and reports by going to Rating & Reports → Billing & Spend Summary. You can see total offers created, matched candidates, pending acceptances, and spending trends.',
    marketplace:
        'Marketplace features are coming soon! This will allow you to buy and sell goods using SG Coins. Stay tuned for updates.',
    features:
        'For help with specific app features, please let me know which feature you need assistance with. I can guide you through using Manual Search, Quick Fill, Labour Pools, Chat, or any other feature.',
    matching:
        'Candidates are matched to your job offers based on experience, skills, location, and availability. View all matched candidates by going to Home → Matched Candidates Pool. You can filter by match percentage (70%+, 80%+, 90%+).',
    data_export:
        'To download or export your data, go to App Settings → Security & Privacy → Data Download/Export. You can request a copy of all your personal and business data for compliance purposes.',
    something_else:
        'Please describe your issue in detail and our support team will assist you. You can also attach files or screenshots to help us understand the problem better.',
};

export const WELCOME_MESSAGE =
    "Hi! You're connected to SquadGoo Support. How can we help you today?";

export const AGENT_ESCALATION_MESSAGE =
    "I see you need more help. Let me connect you with a support specialist who can provide detailed assistance. They'll be with you shortly.";

export const OFFLINE_MESSAGE =
    "Our support team is currently offline (Support hours: Mon–Fri, 9AM–6PM AEST). Please leave your message and we'll get back to you as soon as possible. Your chat will be converted to a support ticket for follow-up.";

export const RATING_CONFIRMATION =
    "Thank you for your feedback! We appreciate your time. Your chat transcript has been saved to your conversation history.";

export const QUICK_REPLY_SUGGESTIONS = [
    'Yes, that helped',
    'No, I need more help',
    'Connect me to a specialist',
    "I'll try this and get back to you",
];
