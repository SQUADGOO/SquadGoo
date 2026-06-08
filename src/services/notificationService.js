/**
 * Notification Service for Quick Search
 * Handles push notifications for quick search events
 */

import { Platform } from 'react-native';

// Optional PushNotification import
let PushNotification = null;
try {
  PushNotification = require('react-native-push-notification').default;
} catch (e) {
  console.warn('react-native-push-notification not installed. Push notifications will be disabled.');
}

/**
 * Initialize push notifications
 */
export const initializeNotifications = () => {
  if (!PushNotification) {
    console.warn('PushNotification not available');
    return;
  }
  
  PushNotification.configure({
    onRegister: function (token) {
      console.log('Push notification token:', token);
      // Send token to backend
    },
    onNotification: function (notification) {
      console.log('Notification received:', notification);
      // Handle notification
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  // Create notification channel for Android
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'quick-search',
        channelName: 'Quick Search Notifications',
        channelDescription: 'Notifications for quick search jobs and offers',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }
};

/**
 * Show local notification
 */
export const showNotification = (title, message, data = {}) => {
  if (!PushNotification) {
    console.log('Notification:', title, message, data);
    return;
  }
  
  PushNotification.localNotification({
    channelId: 'quick-search',
    title,
    message,
    data,
    playSound: true,
    soundName: 'default',
  });
};

/**
 * Notification handlers for Quick Search events
 */

export const notifyNewOffer = (offer) => {
  showNotification(
    'New Quick Search Offer',
    `You have a new offer for ${offer.jobTitle}. Match: ${Math.round(offer.matchPercentage)}%`,
    { type: 'new_offer', offerId: offer.id }
  );
};

export const notifyOfferAccepted = (offer) => {
  showNotification(
    'Offer Accepted',
    `${offer.candidateName} has accepted your quick search offer.`,
    { type: 'offer_accepted', offerId: offer.id }
  );
};

export const notifyOfferDeclined = (offer) => {
  showNotification(
    'Offer Declined',
    `${offer.candidateName} has declined your offer.`,
    { type: 'offer_declined', offerId: offer.id }
  );
};

export const notifyLocationStageChange = (jobId, stage, candidateName) => {
  const stageMessages = {
    'preparing': `${candidateName} is preparing to leave.`,
    'en_route': `${candidateName} is on the way to your workplace.`,
    'approaching': `${candidateName} is approaching your workplace.`,
    'arrived': `${candidateName} has arrived at your workplace.`,
  };

  showNotification(
    'Location Update',
    stageMessages[stage] || 'Location status updated',
    { type: 'location_update', jobId, stage }
  );
};

export const notifyTimerStarted = (jobId, candidateName) => {
  showNotification(
    'Timer Started',
    `${candidateName} has started the timer.`,
    { type: 'timer_started', jobId }
  );
};

export const notifyTimerStopped = (jobId, candidateName) => {
  showNotification(
    'Timer Stopped',
    `Timer has been stopped for ${candidateName}.`,
    { type: 'timer_stopped', jobId }
  );
};

export const notifyPaymentRequest = (jobId, requestedBy) => {
  showNotification(
    'Payment Request',
    `${requestedBy === 'jobseeker' ? 'Job seeker' : 'Recruiter'} has requested platform payment.`,
    { type: 'payment_request', jobId }
  );
};

export const notifyCodeGenerated = (jobId) => {
  showNotification(
    'Payment Code Generated',
    'A payment verification code has been generated. Please share it with the other party.',
    { type: 'code_generated', jobId }
  );
};

export const notifyJobCompleted = (jobId, completedBy) => {
  showNotification(
    'Job Completed',
    `Job has been marked as completed by ${completedBy}.`,
    { type: 'job_completed', jobId }
  );
};

export const notifyLowBalance = (jobId, shortfall) => {
  showNotification(
    'Low Balance Warning',
    `Your wallet balance is low. Shortfall: $${shortfall.toFixed(2)}. Please recharge.`,
    { type: 'low_balance', jobId }
  );
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = () => {
  if (!PushNotification) return;
  PushNotification.cancelAllLocalNotifications();
};

/**
 * Cancel specific notification
 */
export const cancelNotification = (notificationId) => {
  if (!PushNotification) return;
  PushNotification.cancelLocalNotifications({ id: notificationId });
};

