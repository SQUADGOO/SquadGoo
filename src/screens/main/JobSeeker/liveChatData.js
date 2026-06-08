// Auto-reply content for Live Chat quick actions (Jobseeker)
export const QUICK_ACTIONS = [
    { id: 'offer_issues', label: 'Offer Issues' },
    { id: 'payment_wallet', label: 'Payment/Wallet Issues' },
    { id: 'profile_kyc', label: 'Profile & KYC' },
    { id: 'account_login', label: 'Account/Login Help' },
    { id: 'technical', label: 'Technical Support' },
    { id: 'other', label: 'Other' },
];

export const MORE_TOPICS = [
    { id: 'offer_not_received', label: 'Didn\'t receive offer', icon: 'mail-unread-outline' },
    { id: 'offer_expired', label: 'Offer expired', icon: 'time-outline' },
    { id: 'cancel_job', label: 'Need to cancel job', icon: 'close-circle-outline' },
    { id: 'modification', label: 'Can\'t request modification', icon: 'create-outline' },
    { id: 'withdrawal', label: 'Withdrawal issue', icon: 'wallet-outline' },
    { id: 'bonus_referral', label: 'Bonus/referral issue', icon: 'gift-outline' },
    { id: 'doc_upload', label: 'Document upload failed', icon: 'document-attach-outline' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications-outline' },
    { id: 'something_else', label: 'Something Else', icon: 'chatbox-ellipses-outline' },
];

export const AUTO_REPLIES = {
    offer_issues:
        'You can view and respond to job offers in the "Job Offers" section. If your offer is missing or expired, please provide the job title or date. To request a modification, open the offer and tap "Request Modification." If you need to cancel an accepted job, open the job in "Active Offers" and tap "Cancel" with a valid reason.',
    payment_wallet:
        'To withdraw your balance, go to "Wallet" and tap "Withdraw Coin." If your payment is missing, check "Wallet" → "Job Seeker Escrows" for payment status. If still missing after the hold period, please provide job details below. For withdrawal issues, ensure your bank details are correct and you\'ve met the minimum withdrawal amount.',
    profile_kyc:
        'To complete or check your KYC status, go to "KYC Verification" in your profile. If your document upload failed, try again with a clear photo or PDF. Accepted formats: JPG, PNG, PDF. If your verification was denied, check the reason in your notifications or contact support for details. To update your profile, tap your avatar and edit the relevant section.',
    account_login:
        'To reset your password, tap "Forgot Password?" on the login screen and follow the instructions. If you have issues with 2FA, ensure you have access to your registered email or phone. For further help, contact support. If you\'re locked out, please provide your registered email/phone for verification.',
    technical:
        'If you\'re experiencing a crash or bug, please describe what happened and attach a screenshot if possible. For slow performance, try restarting the app or checking your internet connection. If a feature isn\'t working, specify which feature and what error you see.',
    offer_not_received:
        'If you haven\'t received an expected offer, make sure your "Preferred Jobs" profile matches the job requirements. Check your notification settings to ensure offers aren\'t being filtered. If the issue persists, please provide the recruiter or job details.',
    offer_expired:
        'Offers have a limited acceptance window. Once expired, they cannot be accepted. If you believe the offer expired prematurely, please provide the offer details and we\'ll investigate.',
    cancel_job:
        'If you need to cancel an accepted job, open the job in "Active Offers" and tap "Cancel." Please provide a reason. Note that frequent cancellations may affect your Acceptance Rating.',
    modification:
        'To request a modification, open the offer and tap "Request Modification." If the button is not available, the recruiter may not have enabled modifications for this offer. Contact support for assistance.',
    withdrawal:
        'To withdraw, go to "Wallet" → "Withdraw Coin." Ensure your bank details are correct and you\'ve met the minimum withdrawal amount. Withdrawals typically take 3–5 business days.',
    bonus_referral:
        'For bonus or referral issues, please specify the referral code or bonus type. Our team will verify and credit any pending bonuses.',
    doc_upload:
        'If your document upload failed, try again with a clear photo or PDF. Accepted formats: JPG, PNG, PDF. Maximum file size: 5MB. If the issue persists, try clearing the app cache or using a different file.',
    notifications:
        'To manage your notifications, go to Settings → Notifications. You can enable or disable Push, Email, and SMS notifications. If you\'re not receiving alerts, check your device notification settings as well.',
    something_else:
        'Please describe your issue in detail. Our support team will assist you as soon as possible.',
    other:
        'Please describe your issue in detail. Our support team will assist you as soon as possible.',
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
