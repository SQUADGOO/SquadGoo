import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectAllNotifications, 
  markAsRead, 
  markAllAsRead,
  removeNotification,
  addNotification
} from '@/store/notificationsSlice';
import { screenNames } from '@/navigation/screenNames';

// Generate dummy notifications if store is empty
const generateDummyNotifications = () => {
  const now = new Date();
  const notifications = [
    // Quick Search Notifications
    {
      type: 'new_offer',
      title: 'New Quick Search Offer',
      message: 'You have a new offer for Construction Worker position. Match: 85%',
      createdAt: new Date(now - 5 * 60000).toISOString(),
      jobId: 'job-001',
      offerId: 'offer-001',
      matchPercentage: 85,
    },
    {
      type: 'offer_accepted',
      title: 'Offer Accepted',
      message: 'John Smith has accepted your quick search offer for Warehouse Assistant.',
      createdAt: new Date(now - 15 * 60000).toISOString(),
      jobId: 'job-002',
      offerId: 'offer-002',
      candidateName: 'John Smith',
    },
    {
      type: 'location_update',
      title: 'Location Update',
      message: 'Sarah Johnson is approaching your workplace. ETA: 5 minutes',
      createdAt: new Date(now - 30 * 60000).toISOString(),
      jobId: 'job-003',
      stage: 'approaching',
      candidateName: 'Sarah Johnson',
    },
    {
      type: 'arrived',
      title: 'Job Seeker Arrived',
      message: 'Michael Brown has arrived at your workplace.',
      createdAt: new Date(now - 45 * 60000).toISOString(),
      jobId: 'job-004',
      candidateName: 'Michael Brown',
    },
    {
      type: 'timer_started',
      title: 'Timer Started',
      message: 'Emma Wilson has started the timer for your job.',
      createdAt: new Date(now - 60 * 60000).toISOString(),
      jobId: 'job-005',
      candidateName: 'Emma Wilson',
    },
    {
      type: 'payment_request',
      title: 'Payment Request',
      message: 'Job seeker has requested platform payment. Please share verification code.',
      createdAt: new Date(now - 90 * 60000).toISOString(),
      jobId: 'job-006',
      requestedBy: 'jobseeker',
    },
    {
      type: 'code_generated',
      title: 'Payment Code Generated',
      message: 'A payment verification code has been generated. Share it with the job seeker.',
      createdAt: new Date(now - 120 * 60000).toISOString(),
      jobId: 'job-007',
    },
    {
      type: 'low_balance',
      title: 'Low Balance Warning',
      message: 'Your wallet balance is low. Shortfall: $45.20. Please recharge soon.',
      createdAt: new Date(now - 180 * 60000).toISOString(),
      jobId: 'job-008',
      shortfall: 45.20,
    },
    {
      type: 'job_completed',
      title: 'Job Completed',
      message: 'Job has been marked as completed by David Lee.',
      createdAt: new Date(now - 240 * 60000).toISOString(),
      jobId: 'job-009',
      completedBy: 'David Lee',
    },
    // Manual Search Notifications
    {
      type: 'manual_offer',
      title: 'New Manual Job Offer',
      message: 'You have received a manual job offer for Administrative Assistant role.',
      createdAt: new Date(now - 300 * 60000).toISOString(),
      jobId: 'job-010',
      offerId: 'offer-010',
    },
    {
      type: 'offer_declined',
      title: 'Offer Declined',
      message: 'Lisa Anderson declined your offer. Reason: Schedule conflict',
      createdAt: new Date(now - 360 * 60000).toISOString(),
      jobId: 'job-011',
      candidateName: 'Lisa Anderson',
      reason: 'Schedule conflict',
    },
    {
      type: 'modification_requested',
      title: 'Modification Requested',
      message: 'Robert Taylor requested changes to the job offer. Review and respond.',
      createdAt: new Date(now - 420 * 60000).toISOString(),
      jobId: 'job-012',
      candidateName: 'Robert Taylor',
    },
    {
      type: 'modification_accepted',
      title: 'Modification Accepted',
      message: 'Recruiter accepted your modification request. Job offer updated.',
      createdAt: new Date(now - 480 * 60000).toISOString(),
      jobId: 'job-013',
    },
    // Chat & Communication
    {
      type: 'chat_message',
      title: 'New Message',
      message: 'You have a new message from Jennifer Martinez',
      createdAt: new Date(now - 540 * 60000).toISOString(),
      chatData: { userId: 'user-001', userName: 'Jennifer Martinez' },
    },
    {
      type: 'chat_enabled',
      title: 'Chat Enabled',
      message: 'Chat function is now enabled. You can communicate for 30 days.',
      createdAt: new Date(now - 600 * 60000).toISOString(),
      jobId: 'job-014',
    },
    // Wallet & Payment
    {
      type: 'payment_received',
      title: 'Payment Received',
      message: 'You received 150 SG Coins. Payment is on hold for 7 days.',
      createdAt: new Date(now - 720 * 60000).toISOString(),
      amount: 150,
    },
    {
      type: 'invoice_received',
      title: 'Invoice Received',
      message: 'You received an invoice from contractor for completed work.',
      createdAt: new Date(now - 780 * 60000).toISOString(),
      jobId: 'job-015',
    },
    {
      type: 'payment_released',
      title: 'Payment Released',
      message: 'Your payment hold has been released. 150 SG Coins are now available.',
      createdAt: new Date(now - 1440 * 60000).toISOString(),
      amount: 150,
    },
    // KYC & Verification
    {
      type: 'kyc_approved',
      title: 'KYC Verification Approved',
      message: 'Your KYC verification has been approved. Your account is now active.',
      createdAt: new Date(now - 1800 * 60000).toISOString(),
    },
    {
      type: 'resume_verified',
      title: 'Resume Verification Complete',
      message: 'Your resume verification is complete. Certificate available for download.',
      createdAt: new Date(now - 2160 * 60000).toISOString(),
    },
    // Account & Badge
    {
      type: 'badge_eligible',
      title: 'Badge Eligibility',
      message: 'You are now eligible for Bronze Badge. Apply now for 20 SG Coins.',
      createdAt: new Date(now - 2520 * 60000).toISOString(),
      badgeType: 'bronze',
    },
    {
      type: 'badge_purchased',
      title: 'Badge Purchased',
      message: 'Congratulations! You have successfully purchased Platinum Badge.',
      createdAt: new Date(now - 2880 * 60000).toISOString(),
      badgeType: 'platinum',
    },
    // Squad Profile
    {
      type: 'squad_pairing_request',
      title: 'Squad Pairing Request',
      message: 'Alex Thompson wants to pair with you. Check your notifications for code.',
      createdAt: new Date(now - 3240 * 60000).toISOString(),
      requesterName: 'Alex Thompson',
    },
    {
      type: 'squad_offer',
      title: 'Squad Job Offer',
      message: 'Your squad received a job offer for 3 team members.',
      createdAt: new Date(now - 3600 * 60000).toISOString(),
      jobId: 'job-016',
    },
    // Marketplace
    {
      type: 'marketplace_purchase',
      title: 'Item Purchase Request',
      message: 'Someone wants to buy your listed item: iPhone 13 Pro',
      createdAt: new Date(now - 3960 * 60000).toISOString(),
      itemId: 'item-001',
      itemName: 'iPhone 13 Pro',
    },
    {
      type: 'marketplace_delivered',
      title: 'Item Delivered',
      message: 'Your purchased item has been delivered. Please confirm receipt.',
      createdAt: new Date(now - 4320 * 60000).toISOString(),
      itemId: 'item-002',
    },
    // System & General
    {
      type: 'system_suggestion',
      title: 'System Suggestion',
      message: 'Complete your profile to get better job matches. 3 sections remaining.',
      createdAt: new Date(now - 4680 * 60000).toISOString(),
    },
    {
      type: 'news_update',
      title: 'Labour Market News',
      message: 'New updates on labour market reforms. Read more in News Feed.',
      createdAt: new Date(now - 5040 * 60000).toISOString(),
    },
    {
      type: 'review_received',
      title: 'New Review Received',
      message: 'You received a 5-star review from a recruiter.',
      createdAt: new Date(now - 5400 * 60000).toISOString(),
      rating: 5,
    },
    // Escrow Notifications
    {
      type: 'escrow_hold_started',
      title: 'Escrow Hold Started',
      message: 'Payment of 250 SG Coins has been placed on hold for your active job.',
      createdAt: new Date(now - 10 * 60000).toISOString(),
      jobId: 'job-017',
      amount: 250,
    },
    {
      type: 'escrow_complete',
      title: 'Escrow Complete',
      message: 'Escrow payment of 320 SG Coins has been released to your wallet.',
      createdAt: new Date(now - 20 * 60000).toISOString(),
      jobId: 'job-018',
      amount: 320,
    },
    {
      type: 'escrow_code_shared',
      title: 'Escrow Code Shared',
      message: 'Recruiter has shared the escrow verification code. You can now start the timer.',
      createdAt: new Date(now - 25 * 60000).toISOString(),
      jobId: 'job-019',
    },
    {
      type: 'escrow_dispute',
      title: 'Escrow Dispute',
      message: 'A dispute has been raised for escrow payment. Please review and respond.',
      createdAt: new Date(now - 35 * 60000).toISOString(),
      jobId: 'job-020',
    },
    {
      type: 'escrow_release_pending',
      title: 'Escrow Release Pending',
      message: 'Your escrow payment will be released in 2 days. No disputes received.',
      createdAt: new Date(now - 100 * 60000).toISOString(),
      jobId: 'job-021',
      daysRemaining: 2,
    },
    // More Payment & Wallet Notifications
    {
      type: 'payment_released',
      title: 'Payment Released',
      message: 'Your payment hold has been released. 180 SG Coins are now available for withdrawal.',
      createdAt: new Date(now - 8 * 60000).toISOString(),
      amount: 180,
      jobId: 'job-022',
    },
    {
      type: 'payment_on_hold',
      title: 'Payment On Hold',
      message: 'Payment of 200 SG Coins is on hold for 7 days. Will be released automatically.',
      createdAt: new Date(now - 12 * 60000).toISOString(),
      amount: 200,
      jobId: 'job-023',
    },
    {
      type: 'wallet_recharged',
      title: 'Wallet Recharged',
      message: 'You successfully recharged 500 SG Coins to your wallet.',
      createdAt: new Date(now - 18 * 60000).toISOString(),
      amount: 500,
    },
    {
      type: 'withdrawal_processed',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal of 300 SG Coins has been processed. Funds will arrive in 2-3 business days.',
      createdAt: new Date(now - 22 * 60000).toISOString(),
      amount: 300,
    },
    {
      type: 'payment_failed',
      title: 'Payment Failed',
      message: 'Payment processing failed. Please check your payment method and try again.',
      createdAt: new Date(now - 28 * 60000).toISOString(),
      jobId: 'job-024',
    },
    // More Chat & Message Notifications
    {
      type: 'chat_message',
      title: 'New Message',
      message: 'You have 3 new messages from Sarah Johnson',
      createdAt: new Date(now - 3 * 60000).toISOString(),
      chatData: { userId: 'user-002', userName: 'Sarah Johnson' },
      unreadCount: 3,
    },
    {
      type: 'chat_message',
      title: 'New Message',
      message: 'Michael Brown sent you a message about the job offer',
      createdAt: new Date(now - 7 * 60000).toISOString(),
      chatData: { userId: 'user-003', userName: 'Michael Brown' },
    },
    {
      type: 'chat_message',
      title: 'New Message',
      message: 'You have a new message from Emma Wilson regarding payment',
      createdAt: new Date(now - 14 * 60000).toISOString(),
      chatData: { userId: 'user-004', userName: 'Emma Wilson' },
    },
    {
      type: 'chat_message',
      title: 'New Message',
      message: 'David Lee replied to your message',
      createdAt: new Date(now - 19 * 60000).toISOString(),
      chatData: { userId: 'user-005', userName: 'David Lee' },
    },
    {
      type: 'chat_expiring_soon',
      title: 'Chat Expiring Soon',
      message: 'Your chat with Jennifer Martinez will expire in 2 days. Send a new offer to continue.',
      createdAt: new Date(now - 32 * 60000).toISOString(),
      jobId: 'job-025',
      daysRemaining: 2,
    },
    // More Job & Offer Notifications
    {
      type: 'offer_expired',
      title: 'Offer Expired',
      message: 'Your job offer for Warehouse Assistant has expired without response.',
      createdAt: new Date(now - 40 * 60000).toISOString(),
      jobId: 'job-026',
    },
    {
      type: 'offer_cancelled',
      title: 'Offer Cancelled',
      message: 'Recruiter cancelled the job offer before you could respond.',
      createdAt: new Date(now - 50 * 60000).toISOString(),
      jobId: 'job-027',
    },
    {
      type: 'timer_stopped',
      title: 'Timer Stopped',
      message: 'Timer has been stopped by recruiter. Total hours: 4.5 hours',
      createdAt: new Date(now - 55 * 60000).toISOString(),
      jobId: 'job-028',
      hoursWorked: 4.5,
    },
    {
      type: 'timer_resumed',
      title: 'Timer Resumed',
      message: 'Recruiter has resumed the timer. Clock is running again.',
      createdAt: new Date(now - 65 * 60000).toISOString(),
      jobId: 'job-029',
    },
    // Invoice & Payment Proof
    {
      type: 'invoice_sent',
      title: 'Invoice Sent',
      message: 'You successfully sent an invoice for 280 SG Coins to the recruiter.',
      createdAt: new Date(now - 70 * 60000).toISOString(),
      jobId: 'job-030',
      amount: 280,
    },
    {
      type: 'payment_proof_uploaded',
      title: 'Payment Proof Uploaded',
      message: 'Recruiter has uploaded payment proof. Please review and confirm.',
      createdAt: new Date(now - 75 * 60000).toISOString(),
      jobId: 'job-031',
    },
    {
      type: 'payment_proof_requested',
      title: 'Payment Proof Requested',
      message: 'Job seeker has requested payment proof. Please upload your receipt.',
      createdAt: new Date(now - 80 * 60000).toISOString(),
      jobId: 'job-032',
    },
    // Account & Profile Notifications
    {
      type: 'profile_updated',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated. Changes are now visible.',
      createdAt: new Date(now - 85 * 60000).toISOString(),
    },
    {
      type: 'availability_updated',
      title: 'Availability Updated',
      message: 'Your availability schedule has been updated. New offers will match your schedule.',
      createdAt: new Date(now - 95 * 60000).toISOString(),
    },
    {
      type: 'acceptance_rating_updated',
      title: 'Acceptance Rating Updated',
      message: 'Your acceptance rating has been updated to 92%. Keep up the great work!',
      createdAt: new Date(now - 105 * 60000).toISOString(),
      rating: 92,
    },
    // Support & System
    {
      type: 'support_ticket_response',
      title: 'Support Ticket Response',
      message: 'Support team has responded to your ticket #12345. Check your messages.',
      createdAt: new Date(now - 110 * 60000).toISOString(),
      ticketId: '12345',
    },
    {
      type: 'callback_scheduled',
      title: 'Callback Scheduled',
      message: 'Your callback request has been scheduled for tomorrow at 2:00 PM.',
      createdAt: new Date(now - 115 * 60000).toISOString(),
    },
    {
      type: 'system_maintenance',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM.',
      createdAt: new Date(now - 125 * 60000).toISOString(),
    },
  ];

  return notifications.map((notif, index) => ({
    ...notif,
    id: `notif-${Date.now()}-${index}`,
    read: index > 8, // First 9 are unread
  }));
};

const Notifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);

  // Initialize dummy notifications if store is empty or has very few notifications
  useEffect(() => {
    // Generate dummy notifications if we have less than 10 notifications
    // This ensures we always have a good set of notifications for testing
    if (notifications.length < 10) {
      const dummyNotifications = generateDummyNotifications();
      console.log('Generating dummy notifications:', dummyNotifications.length, 'Current:', notifications.length);
      
      // Only add notifications that don't already exist (check by type and title)
      const existingTitles = new Set(notifications.map(n => `${n.type}-${n.title}`));
      const newNotifications = dummyNotifications.filter(notif => 
        !existingTitles.has(`${notif.type}-${notif.title}`)
      );
      
      console.log('Adding new notifications:', newNotifications.length);
      newNotifications.forEach(notif => {
        dispatch(addNotification(notif));
      });
      
      // If we still have very few notifications, add all dummy ones
      if (notifications.length === 0 && newNotifications.length === 0) {
        dummyNotifications.forEach(notif => {
          dispatch(addNotification(notif));
        });
      }
    } else {
      console.log('Sufficient notifications already exist:', notifications.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      let groupKey = '';

      if (notifDate >= today) {
        groupKey = 'Today';
      } else if (notifDate >= yesterday) {
        groupKey = 'Yesterday';
      } else {
        groupKey = notifDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    // Sort notifications within each group by most recent first
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });

    return groups;
  }, [notifications]);

  const flatNotifications = useMemo(() => {
    const result = [];
    
    // Sort date groups: Today first, then Yesterday, then others chronologically
    const sortedDates = Object.keys(groupedNotifications).sort((a, b) => {
      if (a === 'Today') return -1;
      if (b === 'Today') return 1;
      if (a === 'Yesterday') return -1;
      if (b === 'Yesterday') return 1;
      
      // For other dates (format: "DD MMM YYYY"), parse and sort chronologically (newest first)
      try {
        // Parse date string like "15 Dec 2024"
        const parseDate = (dateStr) => {
          const parts = dateStr.split(' ');
          if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames.indexOf(parts[1]);
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
          }
          return new Date(0);
        };
        
        const dateA = parseDate(a);
        const dateB = parseDate(b);
        return dateB - dateA;
      } catch (e) {
        return 0;
      }
    });
    
    sortedDates.forEach(date => {
      result.push({ type: 'date', date, id: `date-${date}` });
      groupedNotifications[date].forEach(notif => {
        result.push(notif);
      });
    });
    
    console.log('Flat notifications count:', result.length);
    return result;
  }, [groupedNotifications]);

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate based on notification type
    if (notification.jobId) {
      if (notification.type === 'application_received' || notification.type === 'manual_offer') {
        navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId: notification.jobId });
      } else if (
        notification.type === 'offer_accepted' || 
        notification.type === 'offer_declined' ||
        notification.type === 'new_offer' ||
        notification.type === 'location_update' ||
        notification.type === 'arrived' ||
        notification.type === 'timer_started' ||
        notification.type === 'payment_request' ||
        notification.type === 'code_generated' ||
        notification.type === 'low_balance' ||
        notification.type === 'job_completed' ||
        notification.type === 'timer_resumed' ||
        notification.type === 'offer_expired' ||
        notification.type === 'offer_cancelled'
      ) {
        navigation.navigate(screenNames.ACTIVE_OFFERS);
      } else if (notification.type === 'modification_requested' || notification.type === 'modification_accepted') {
        navigation.navigate(screenNames.ACTIVE_OFFERS);
      }
    } else if (notification.type === 'chat_message' || notification.type === 'chat_enabled' || notification.type === 'chat_expiring_soon') {
      navigation.navigate(screenNames.MESSAGES, { chatData: notification.chatData });
    } else if (
      notification.type === 'payment_received' || 
      notification.type === 'payment_released' || 
      notification.type === 'payment_on_hold' ||
      notification.type === 'payment_failed' ||
      notification.type === 'wallet_recharged' ||
      notification.type === 'withdrawal_processed' ||
      notification.type === 'invoice_received' ||
      notification.type === 'invoice_sent' ||
      notification.type === 'payment_proof_uploaded' ||
      notification.type === 'payment_proof_requested' ||
      notification.type === 'escrow_hold_started' ||
      notification.type === 'escrow_complete' ||
      notification.type === 'escrow_code_shared' ||
      notification.type === 'escrow_dispute' ||
      notification.type === 'escrow_release_pending'
    ) {
      navigation.navigate(screenNames.Wallet);
    } else if (notification.type === 'marketplace_purchase' || notification.type === 'marketplace_delivered') {
      // Navigate to marketplace if available
      // navigation.navigate(screenNames.MARKETPLACE);
    } else if (notification.type === 'squad_pairing_request' || notification.type === 'squad_offer') {
      // Navigate to squad settings
      // navigation.navigate(screenNames.SQUAD_SETTINGS);
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      // Quick Search
      case 'new_offer':
        return { name: iconLibName.Ionicons, iconName: 'briefcase-outline', color: '#3B82F6' };
      case 'offer_accepted':
        return { name: iconLibName.Ionicons, iconName: 'checkmark-circle', color: '#10B981' };
      case 'offer_declined':
        return { name: iconLibName.Ionicons, iconName: 'close-circle', color: '#EF4444' };
      case 'location_update':
        return { name: iconLibName.Ionicons, iconName: 'location-outline', color: '#8B5CF6' };
      case 'arrived':
        return { name: iconLibName.Ionicons, iconName: 'checkmark-done-circle', color: '#10B981' };
      case 'timer_started':
        return { name: iconLibName.Ionicons, iconName: 'time-outline', color: '#F59E0B' };
      case 'timer_stopped':
        return { name: iconLibName.Ionicons, iconName: 'stop-circle-outline', color: '#EF4444' };
      case 'timer_resumed':
        return { name: iconLibName.Ionicons, iconName: 'play-circle-outline', color: '#10B981' };
      case 'payment_request':
        return { name: iconLibName.Ionicons, iconName: 'card-outline', color: '#8B5CF6' };
      case 'code_generated':
        return { name: iconLibName.Ionicons, iconName: 'key-outline', color: '#6366F1' };
      case 'low_balance':
        return { name: iconLibName.Ionicons, iconName: 'warning-outline', color: '#F59E0B' };
      case 'job_completed':
        return { name: iconLibName.Ionicons, iconName: 'trophy-outline', color: '#10B981' };
      case 'offer_expired':
        return { name: iconLibName.Ionicons, iconName: 'time-outline', color: '#9CA3AF' };
      case 'offer_cancelled':
        return { name: iconLibName.Ionicons, iconName: 'close-circle-outline', color: '#EF4444' };
      
      // Manual Search
      case 'manual_offer':
        return { name: iconLibName.Ionicons, iconName: 'document-text-outline', color: '#3B82F6' };
      case 'modification_requested':
        return { name: iconLibName.Ionicons, iconName: 'create-outline', color: '#F59E0B' };
      case 'modification_accepted':
        return { name: iconLibName.Ionicons, iconName: 'checkmark-done', color: '#10B981' };
      
      // Chat & Communication
      case 'chat_message':
        return { name: iconLibName.Ionicons, iconName: 'chatbubble-ellipses-outline', color: '#8B5CF6' };
      case 'chat_enabled':
        return { name: iconLibName.Ionicons, iconName: 'chatbubbles-outline', color: '#10B981' };
      case 'chat_expiring_soon':
        return { name: iconLibName.Ionicons, iconName: 'hourglass-outline', color: '#F59E0B' };
      
      // Wallet & Payment
      case 'payment_received':
        return { name: iconLibName.Ionicons, iconName: 'wallet-outline', color: '#10B981' };
      case 'payment_released':
        return { name: iconLibName.Ionicons, iconName: 'cash-outline', color: '#10B981' };
      case 'payment_on_hold':
        return { name: iconLibName.Ionicons, iconName: 'lock-closed-outline', color: '#F59E0B' };
      case 'payment_failed':
        return { name: iconLibName.Ionicons, iconName: 'close-circle-outline', color: '#EF4444' };
      case 'wallet_recharged':
        return { name: iconLibName.Ionicons, iconName: 'add-circle-outline', color: '#10B981' };
      case 'withdrawal_processed':
        return { name: iconLibName.Ionicons, iconName: 'arrow-down-circle-outline', color: '#10B981' };
      case 'invoice_received':
        return { name: iconLibName.Ionicons, iconName: 'receipt-outline', color: '#6366F1' };
      case 'invoice_sent':
        return { name: iconLibName.Ionicons, iconName: 'send-outline', color: '#10B981' };
      case 'payment_proof_uploaded':
        return { name: iconLibName.Ionicons, iconName: 'document-attach-outline', color: '#10B981' };
      case 'payment_proof_requested':
        return { name: iconLibName.Ionicons, iconName: 'document-text-outline', color: '#F59E0B' };
      // Escrow
      case 'escrow_hold_started':
        return { name: iconLibName.Ionicons, iconName: 'lock-closed-outline', color: '#6366F1' };
      case 'escrow_complete':
        return { name: iconLibName.Ionicons, iconName: 'checkmark-done-circle', color: '#10B981' };
      case 'escrow_code_shared':
        return { name: iconLibName.Ionicons, iconName: 'share-outline', color: '#8B5CF6' };
      case 'escrow_dispute':
        return { name: iconLibName.Ionicons, iconName: 'alert-circle-outline', color: '#EF4444' };
      case 'escrow_release_pending':
        return { name: iconLibName.Ionicons, iconName: 'time-outline', color: '#F59E0B' };
      
      // KYC & Verification
      case 'kyc_approved':
        return { name: iconLibName.Ionicons, iconName: 'shield-checkmark-outline', color: '#10B981' };
      case 'resume_verified':
        return { name: iconLibName.Ionicons, iconName: 'document-checkmark-outline', color: '#10B981' };
      
      // Account & Badge
      case 'badge_eligible':
        return { name: iconLibName.Ionicons, iconName: 'star-outline', color: '#F59E0B' };
      case 'badge_purchased':
        return { name: iconLibName.Ionicons, iconName: 'medal-outline', color: '#F59E0B' };
      
      // Squad Profile
      case 'squad_pairing_request':
        return { name: iconLibName.Ionicons, iconName: 'people-outline', color: '#8B5CF6' };
      case 'squad_offer':
        return { name: iconLibName.Ionicons, iconName: 'people-circle-outline', color: '#3B82F6' };
      
      // Marketplace
      case 'marketplace_purchase':
        return { name: iconLibName.Ionicons, iconName: 'cart-outline', color: '#10B981' };
      case 'marketplace_delivered':
        return { name: iconLibName.Ionicons, iconName: 'cube-outline', color: '#10B981' };
      
      // Account & Profile
      case 'profile_updated':
        return { name: iconLibName.Ionicons, iconName: 'person-outline', color: '#3B82F6' };
      case 'availability_updated':
        return { name: iconLibName.Ionicons, iconName: 'calendar-outline', color: '#10B981' };
      case 'acceptance_rating_updated':
        return { name: iconLibName.Ionicons, iconName: 'trending-up-outline', color: '#10B981' };
      // Support & System
      case 'support_ticket_response':
        return { name: iconLibName.Ionicons, iconName: 'help-circle-outline', color: '#3B82F6' };
      case 'callback_scheduled':
        return { name: iconLibName.Ionicons, iconName: 'call-outline', color: '#10B981' };
      case 'system_maintenance':
        return { name: iconLibName.Ionicons, iconName: 'construct-outline', color: '#F59E0B' };
      // System & General
      case 'system_suggestion':
        return { name: iconLibName.Ionicons, iconName: 'bulb-outline', color: '#F59E0B' };
      case 'news_update':
        return { name: iconLibName.Ionicons, iconName: 'newspaper-outline', color: '#3B82F6' };
      case 'review_received':
        return { name: iconLibName.Ionicons, iconName: 'star', color: '#F59E0B' };
      
      // Default
      default:
        return { name: iconLibName.Ionicons, iconName: 'notifications-outline', color: colors.primary };
    }
  };

  const getNotificationCategory = (type) => {
    if (['new_offer', 'offer_accepted', 'offer_declined', 'location_update', 'arrived', 'timer_started', 'timer_stopped', 'timer_resumed', 'payment_request', 'code_generated', 'low_balance', 'job_completed', 'offer_expired', 'offer_cancelled'].includes(type)) {
      return 'quick_search';
    }
    if (['manual_offer', 'modification_requested', 'modification_accepted'].includes(type)) {
      return 'manual_search';
    }
    if (['chat_message', 'chat_enabled', 'chat_expiring_soon'].includes(type)) {
      return 'chat';
    }
    if (['payment_received', 'payment_released', 'payment_on_hold', 'payment_failed', 'wallet_recharged', 'withdrawal_processed', 'invoice_received', 'invoice_sent', 'payment_proof_uploaded', 'payment_proof_requested'].includes(type)) {
      return 'wallet';
    }
    if (['escrow_hold_started', 'escrow_complete', 'escrow_code_shared', 'escrow_dispute', 'escrow_release_pending'].includes(type)) {
      return 'escrow';
    }
    if (['kyc_approved', 'resume_verified'].includes(type)) {
      return 'verification';
    }
    if (['badge_eligible', 'badge_purchased', 'profile_updated', 'availability_updated', 'acceptance_rating_updated'].includes(type)) {
      return 'account';
    }
    if (['squad_pairing_request', 'squad_offer'].includes(type)) {
      return 'squad';
    }
    if (['marketplace_purchase', 'marketplace_delivered'].includes(type)) {
      return 'marketplace';
    }
    if (['support_ticket_response', 'callback_scheduled', 'system_maintenance', 'system_suggestion', 'news_update', 'review_received'].includes(type)) {
      return 'system';
    }
    return 'system';
  };

  const renderNotification = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateHeader}>
          <AppText variant={Variant.bodyMedium} style={styles.dateText}>
            {item.date}
          </AppText>
        </View>
      );
    }

    const icon = getNotificationIcon(item.type);
    const category = getNotificationCategory(item.type);
    const isUnread = !item.read;

    return (
      <TouchableOpacity
        style={[styles.notificationItem, isUnread && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
          <VectorIcons
            name={icon.name}
            iconName={icon.iconName}
            size={22}
            color={icon.color}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <AppText variant={Variant.bodyMedium} style={[styles.notificationTitle, isUnread && styles.unreadTitle]}>
              {item.title}
            </AppText>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <AppText variant={Variant.body} style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </AppText>
          <View style={styles.footerRow}>
            <AppText variant={Variant.caption} style={styles.notificationTime}>
              {formatTime(item.createdAt)}
            </AppText>
            {category && (
              <View style={[styles.categoryBadge, styles[`${category}Badge`]]}>
                <AppText variant={Variant.caption} style={[styles.categoryText, styles[`${category}BadgeText`]]}>
                  {category.replace(/_/g, ' ').toUpperCase()}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Notifications" 
        showTopIcons={false}
        rightComponent={
          notifications.some(n => !n.read) ? (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <AppText variant={Variant.body} style={styles.markAllRead}>
                Mark all read
              </AppText>
            </TouchableOpacity>
          ) : null
        }
      />
      {flatNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="notifications-off-outline"
            size={64}
            color={colors.gray}
          />
          <AppText variant={Variant.bodyMedium} style={styles.emptyText}>
            No Notifications
          </AppText>
          <AppText variant={Variant.body} style={styles.emptySubText}>
            You'll receive notifications here when there are updates on your jobs or applications.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={flatNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id || `notif-${item.type}-${item.date || ''}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  listContent: {
    paddingBottom: hp(5),
  },
  dateHeader: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  dateText: {
    fontWeight: '600',
    fontSize: getFontSize(13),
    color: colors.gray || '#6B7280',
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
    backgroundColor: colors.white || '#FFFFFF',
  },
  unreadNotification: {
    backgroundColor: '#F8FAFF',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary || '#FF6B35',
  },
  iconContainer: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
    alignSelf: 'flex-start',
    marginTop: hp(0.5),
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(0.5),
  },
  notificationTitle: {
    fontWeight: '600',
    fontSize: getFontSize(15),
    color: colors.black || '#111827',
    flex: 1,
    lineHeight: getFontSize(20),
  },
  unreadTitle: {
    fontWeight: '700',
    color: colors.black || '#1F2937',
  },
  notificationMessage: {
    fontSize: getFontSize(14),
    color: colors.gray || '#6B7280',
    marginBottom: hp(0.8),
    lineHeight: getFontSize(20),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: getFontSize(12),
    color: colors.gray || '#9CA3AF',
  },
  unreadDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: colors.primary || '#FF6B35',
    marginLeft: wp(2),
  },
  categoryBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
    borderRadius: wp(1.5),
    marginLeft: wp(2),
  },
  categoryText: {
    fontSize: getFontSize(9),
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  quick_searchBadge: {
    backgroundColor: '#EFF6FF',
  },
  quick_searchBadgeText: {
    color: '#3B82F6',
  },
  manual_searchBadge: {
    backgroundColor: '#F0FDF4',
  },
  manual_searchBadgeText: {
    color: '#10B981',
  },
  chatBadge: {
    backgroundColor: '#F5F3FF',
  },
  chatBadgeText: {
    color: '#8B5CF6',
  },
  walletBadge: {
    backgroundColor: '#F0FDF4',
  },
  walletBadgeText: {
    color: '#10B981',
  },
  verificationBadge: {
    backgroundColor: '#F0FDF4',
  },
  verificationBadgeText: {
    color: '#10B981',
  },
  accountBadge: {
    backgroundColor: '#FFFBEB',
  },
  accountBadgeText: {
    color: '#F59E0B',
  },
  squadBadge: {
    backgroundColor: '#F5F3FF',
  },
  squadBadgeText: {
    color: '#8B5CF6',
  },
  marketplaceBadge: {
    backgroundColor: '#F0FDF4',
  },
  marketplaceBadgeText: {
    color: '#10B981',
  },
  escrowBadge: {
    backgroundColor: '#EEF2FF',
  },
  escrowBadgeText: {
    color: '#6366F1',
  },
  systemBadge: {
    backgroundColor: '#F3F4F6',
  },
  systemBadgeText: {
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyText: {
    marginTop: hp(2),
    fontWeight: '600',
    fontSize: getFontSize(18),
    color: colors.black || '#111827',
  },
  emptySubText: {
    marginTop: hp(1),
    textAlign: 'center',
    fontSize: getFontSize(14),
    color: colors.gray || '#6B7280',
    lineHeight: getFontSize(20),
  },
  markAllRead: {
    color: colors.primary || '#FF6B35',
    fontWeight: '600',
    fontSize: getFontSize(14),
  },
});

