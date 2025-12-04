import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, hp, wp, getFontSize } from '@/theme';
import { screenNames } from '@/navigation/screenNames';

const JobSeekerJobCard = ({ 
  job, 
  isCompleted = false,
  onAccept,
  onDecline,
  showChatButton = false,
  chatEnabled = true,
  onChatPress,
  jobSeekerStatus = null, // 'accepted', 'declined', or null
  isCurrentJob = false, // true when job is in "My Current Jobs"
  recruiterStatus = null, // 'pending', 'accepted', 'rejected' - status from recruiter
  onCancel, // Cancel/withdraw application
  onViewDetails, // View job details
  showTimerButton = false,
  timerLabel = 'Manage Timer',
  timerStatus = null,
  onTimerPress,
}) => {
  const navigation = useNavigation();
  const isQuickJob = job?.searchType?.toLowerCase?.() === 'quick' || job?.source === 'quick';
  const acceptActionLabel = isQuickJob ? 'Accept' : 'Apply';
  const acceptedBadgeLabel = isQuickJob ? 'Accepted' : 'Applied';

  const handleCardPress = () => {
    navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job, isCompleted });
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(job);
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline(job);
    }
  };

  const handleChat = () => {
    if (onChatPress) {
      onChatPress(job);
    }
  };

  const handleTimer = () => {
    if (onTimerPress) {
      onTimerPress(job);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(job);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(job);
    } else {
      handleCardPress();
    }
  };

  // Get recruiter status badge info
  const getRecruiterStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Pending', color: '#6B7280', bg: '#F3F4F6', icon: 'time-outline' },
      'accepted': { label: 'Accepted', color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' },
      'rejected': { label: 'Declined', color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle' },
    };
    return statusMap[status] || statusMap['pending'];
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={handleCardPress}
        activeOpacity={0.7}
        style={styles.cardContent}
      >
        <View style={{ gap: hp(1) }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{job.title}</Text>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <Icon name="checkmark-circle" size={14} color="#4ADE80" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            ) : isCurrentJob && recruiterStatus ? (
              // Show recruiter status for current jobs
              (() => {
                const statusInfo = getRecruiterStatusBadge(recruiterStatus);
                return (
                  <View style={[styles.recruiterStatusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Icon name={statusInfo.icon} size={14} color={statusInfo.color} />
                    <Text style={[styles.recruiterStatusText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                );
              })()
            ) : jobSeekerStatus === 'accepted' ? (
              <View style={styles.acceptedBadge}>
                <Icon name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.acceptedText}>{acceptedBadgeLabel}</Text>
              </View>
            ) : jobSeekerStatus === 'declined' ? (
              <View style={styles.declinedBadge}>
                <Icon name="close-circle" size={14} color="#EF4444" />
                <Text style={styles.declinedText}>Declined</Text>
              </View>
            ) : (
              <Text style={styles.expiry}>Expire on {job.expireDate}</Text>
            )}
          </View>

          <View style={styles.cardHeader}>
            <Text style={styles.salary}>{job.salaryRange}</Text>
            <Text style={styles.expiry}>{job?.searchType?.toUpperCase() || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {job?.description}
          <Text style={styles.viewDetails}> View Details</Text>
        </Text>

        {timerStatus && (
          <View style={styles.timerStatusRow}>
            <Icon name="time-outline" size={16} color={colors.primary || '#FF6B35'} />
            <Text style={styles.timerStatusText}>{timerStatus}</Text>
          </View>
        )}

        <View style={styles.companyRow}>
          {job?.image ? (
            <Image source={{ uri: job.image }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, { backgroundColor: '#E0E0E0' }]} />
          )}
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{job.industry}</Text>
            <View style={styles.locationRow}>
              <Icon name="location-outline" size={14} color="#4F5D75" />
              <Text style={styles.location}>{job.location}</Text>
            </View>
          </View>
          <Text style={styles.experience}>Experience: {job.experience}</Text>
        </View>
      </TouchableOpacity>

      {/* Show buttons based on context */}
      {isCurrentJob ? (
        <View style={[styles.buttonRow, styles.currentJobActions]}>
          <View style={styles.actionItem}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Icon name="close-circle-outline" size={18} color="#EF4444" />
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {showChatButton && (
            <View style={styles.actionItem}>
              <TouchableOpacity 
                style={[styles.chatBtn, !chatEnabled && styles.disabledBtn]} 
                onPress={handleChat}
                activeOpacity={0.8}
              >
                <Icon
                  name="chatbubble-outline"
                  size={18}
                  color={chatEnabled ? (colors.primary || '#FF6B35') : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.chatText,
                    !chatEnabled && styles.disabledText,
                  ]}
                >
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {showTimerButton && (
            <View style={styles.actionItem}>
              <TouchableOpacity 
                style={styles.timerBtn} 
                onPress={handleTimer}
                activeOpacity={0.8}
              >
                <Icon name="timer-outline" size={18} color="#2563EB" />
                <Text style={styles.timerText}>{timerLabel}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionItem}>
            <TouchableOpacity 
              style={styles.viewDetailsBtn} 
              onPress={handleViewDetails}
              activeOpacity={0.8}
            >
              <Icon name="eye-outline" size={18} color={colors.primary || '#FF6B35'} />
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : showChatButton ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.chatBtn} 
            onPress={handleChat}
            activeOpacity={0.8}
          >
            <Icon name="chatbubble-outline" size={18} color={colors.primary || '#FF6B35'} />
            <Text style={styles.chatText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.viewDetailsBtn} 
            onPress={handleCardPress}
            activeOpacity={0.8}
          >
            <Icon name="eye-outline" size={18} color={colors.primary || '#FF6B35'} />
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ) : jobSeekerStatus === 'accepted' || jobSeekerStatus === 'declined' ? (
        // Hide buttons if job is already accepted or declined
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.viewDetailsBtn} 
            onPress={handleCardPress}
            activeOpacity={0.8}
          >
            <Icon name="eye-outline" size={18} color={colors.primary || '#FF6B35'} />
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.acceptBtn} 
            onPress={handleAccept}
            activeOpacity={0.8}
          >
            <Icon name="checkmark" size={18} color="green" />
            <Text style={styles.acceptText}>{acceptActionLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.declineBtn} 
            onPress={handleDecline}
            activeOpacity={0.8}
          >
            <Icon name="close" size={18} color="red" />
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isCompleted && job.completedDate && (
        <View style={styles.completedInfoRow}>
          <View style={styles.infoItem}>
            <Icon name="calendar-outline" size={14} color="#4F5D75" />
            <Text style={styles.infoText}>Completed: {job.completedDate}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default JobSeekerJobCard;

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 0.8,
    borderColor: '#eee',
    marginVertical: 5,
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { 
    fontWeight: '700', 
    fontSize: 16, 
    color: '#4F5D75', 
    width: '60%' 
  },
  expiry: {
    backgroundColor: '#E0D9E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: '#4F5D75',
  },
  salary: {
    color: '#FF9800',
    fontWeight: '700',
    width: wp(50),
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  description: { 
    color: '#4F5D75', 
    fontSize: 13, 
    marginBottom: 8 
  },
  viewDetails: { 
    color: '#FF9800', 
    fontWeight: '600' 
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  logo: { 
    width: 35, 
    height: 35, 
    borderRadius: 35 / 2, 
    marginRight: 10 
  },
  companyInfo: { 
    flex: 1 
  },
  companyName: { 
    fontWeight: '600', 
    color: '#000' 
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 2 
  },
  location: { 
    marginLeft: 4, 
    color: '#4F5D75', 
    fontSize: 12 
  },
  experience: { 
    color: '#4F5D75', 
    fontSize: 13,
    width: wp(25),
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  acceptedText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  declinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  declinedText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
  },
  recruiterStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  recruiterStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 0,
    width: '100%',
    backgroundColor: colors.white,
  },
  cancelText: {
    color: '#EF4444',
    marginLeft: 6,
    fontWeight: '600',
  },
  completedInfoRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#4F5D75',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  currentJobActions: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: wp(2),
  },
  actionItem: {
    width: '48%',
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 0,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
  },
  acceptText: { 
    color: 'green', 
    marginLeft: 6, 
    fontWeight: '600' 
  },
  declineText: { 
    color: 'red', 
    marginLeft: 6, 
    fontWeight: '600' 
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary || '#FF6B35',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
    width: '100%',
    backgroundColor: colors.white,
  },
  chatText: { 
    color: colors.primary || '#FF6B35', 
    marginLeft: 6, 
    fontWeight: '600' 
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    minWidth: wp(28),
    width: '100%',
  },
  timerText: {
    color: '#1D4ED8',
    marginLeft: 6,
    fontWeight: '600',
  },
  timerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: hp(0.5),
  },
  timerStatusText: {
    color: '#1F2937',
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  disabledBtn: {
    borderColor: '#D1D5DB',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary || '#FF6B35',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.white,
    maxWidth: '100%',
  },
  viewDetailsText: { 
    color: colors.primary || '#FF6B35', 
    marginLeft: 6, 
    fontWeight: '600' 
  },
});

