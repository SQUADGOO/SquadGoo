import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import { screenNames } from '@/navigation/screenNames';

const JobDetailRow = ({ iconName, label, value }) => (
  <View style={styles.detailRow}>
    <VectorIcons name={iconLibName.Ionicons} iconName={iconName} size={18} color={colors.gray} />
    <AppText variant={Variant.body} style={styles.detailText}>
      {label}:{' '}
      <AppText variant={Variant.bodyMedium} style={styles.detailValue}>
        {value || '—'}
      </AppText>
    </AppText>
  </View>
);

const getStatusBadge = (status) => {
  const map = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', icon: 'time-outline' },
    accepted: { label: 'Accepted', color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' },
    declined: { label: 'Declined', color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle' },
    completed: { label: 'Completed', color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-done' },
    'in progress': { label: 'In Progress', color: '#3B82F6', bg: '#DBEAFE', icon: 'play-circle' },
    'modification requested': { label: 'Modification Requested', color: '#3B82F6', bg: '#DBEAFE', icon: 'create-outline' },
    expired: { label: 'Expired', color: '#6B7280', bg: '#F3F4F6', icon: 'hourglass-outline' },
  };
  return map[status?.toLowerCase()] || map.pending;
};

const JobSeekerJobCard = ({
  job,
  isCompleted = false,
  onAccept,
  onDecline,
  showChatButton = false,
  chatEnabled = true,
  onChatPress,
  jobSeekerStatus = null,
  isCurrentJob = false,
  recruiterStatus = null,
  onCancel,
  onViewDetails,
  showTimerButton = false,
  timerLabel = 'Manage Timer',
  timerStatus = null,
  onTimerPress,
}) => {
  const navigation = useNavigation();
  const isQuickJob = job?.searchType?.toLowerCase?.() === 'quick' || job?.source === 'quick';
  const acceptActionLabel = isQuickJob ? 'Accept' : 'Apply';

  const handleCardPress = () => {
    navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job, isCompleted });
  };

  // Determine current status for badge
  const currentStatus = isCompleted
    ? 'completed'
    : isCurrentJob
      ? (recruiterStatus || 'accepted')
      : (jobSeekerStatus || job?.status || 'pending');

  const statusInfo = getStatusBadge(currentStatus);

  const payRange = job?.salaryRange || (
    job?.salaryMin && job?.salaryMax
      ? `$${job.salaryMin}–$${job.salaryMax}${job?.salaryType?.toLowerCase?.()?.includes('hour') ? '/hr' : ''}`
      : 'Not specified'
  );

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
        {/* Header - Title + Badges */}
        <View style={styles.cardHeader}>
          <AppText variant={Variant.subTitle} style={styles.jobTitle} numberOfLines={2}>
            {job.title}
          </AppText>
          <View style={styles.badgeContainer}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName={statusInfo.icon} size={12} color={statusInfo.color} />
              <AppText variant={Variant.caption} style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </AppText>
            </View>
            {/* Search Type Badge */}
            <View style={[styles.searchTypeBadge, isQuickJob ? styles.quickBadge : styles.manualBadge]}>
              <AppText variant={Variant.caption} style={styles.searchTypeText}>
                {isQuickJob ? 'Quick' : 'Manual'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Salary */}
        <AppText variant={Variant.bodyMedium} style={styles.salaryText}>
          {payRange}
        </AppText>

        {/* Job Details */}
        <View style={styles.detailsContainer}>
          {job?.companyName || job?.jobCategory ? (
            <JobDetailRow iconName="business-outline" label="Employer" value={job.companyName || job.jobCategory} />
          ) : null}
          {job?.location ? (
            <JobDetailRow iconName="location-outline" label="Location" value={job.location} />
          ) : null}
          {job?.experience ? (
            <JobDetailRow iconName="star-outline" label="Experience" value={job.experience} />
          ) : null}
          {!isCompleted && job?.expireDate ? (
            <JobDetailRow iconName="time-outline" label="Expires" value={job.expireDate} />
          ) : null}
          {job?.shiftDate ? (
            <JobDetailRow iconName="calendar-outline" label="Shift" value={job.shiftDate} />
          ) : null}
        </View>

        {/* Description preview */}
        {job?.description ? (
          <AppText variant={Variant.body} style={styles.descriptionText} numberOfLines={2}>
            {job.description}
          </AppText>
        ) : null}

        {/* Timer status for current jobs */}
        {timerStatus ? (
          <View style={styles.timerStatusRow}>
            <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color={colors.primary} />
            <AppText variant={Variant.caption} style={styles.timerStatusText}>{timerStatus}</AppText>
          </View>
        ) : null}
      </TouchableOpacity>

      {/* Completed date */}
      {isCompleted && job.completedDate ? (
        <View style={styles.completedRow}>
          <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-done" size={14} color="#10B981" />
          <AppText variant={Variant.caption} style={styles.completedDate}>
            Completed: {job.completedDate}
          </AppText>
        </View>
      ) : null}

      {/* ───── Action Buttons ───── */}
      <View style={styles.buttonContainer}>
        {isCurrentJob ? (
          /* Current Jobs: Cancel, Message, Timer, View Details */
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={() => onCancel?.(job)} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="close-circle-outline" size={16} color="#EF4444" />
              <AppText variant={Variant.bodyMedium} style={styles.dangerButtonText}>Cancel</AppText>
            </TouchableOpacity>

            {showChatButton ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryOutlineButton, !chatEnabled && styles.disabledButton]}
                onPress={() => chatEnabled && onChatPress?.(job)}
                activeOpacity={0.8}
              >
                <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-outline" size={16} color={chatEnabled ? colors.primary : '#9CA3AF'} />
                <AppText variant={Variant.bodyMedium} style={[styles.primaryOutlineText, !chatEnabled && styles.disabledText]}>Message</AppText>
              </TouchableOpacity>
            ) : null}

            {showTimerButton ? (
              <TouchableOpacity style={[styles.actionButton, styles.infoButton]} onPress={() => onTimerPress?.(job)} activeOpacity={0.8}>
                <VectorIcons name={iconLibName.Ionicons} iconName="timer-outline" size={16} color="#2563EB" />
                <AppText variant={Variant.bodyMedium} style={styles.infoButtonText}>{timerLabel}</AppText>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={[styles.actionButton, styles.primaryOutlineButton]} onPress={() => (onViewDetails || handleCardPress)(job)} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="eye-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.primaryOutlineText}>View Details</AppText>
            </TouchableOpacity>
          </View>
        ) : isCompleted ? (
          /* Completed: View Details only */
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.primaryOutlineButton]} onPress={handleCardPress} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="eye-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.primaryOutlineText}>View Details</AppText>
            </TouchableOpacity>
          </View>
        ) : showChatButton ? (
          /* Accepted with chat: Message + View Details */
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.primaryOutlineButton]} onPress={() => onChatPress?.(job)} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.primaryOutlineText}>Message</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryOutlineButton]} onPress={handleCardPress} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="eye-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.primaryOutlineText}>View Details</AppText>
            </TouchableOpacity>
          </View>
        ) : jobSeekerStatus === 'accepted' || jobSeekerStatus === 'declined' ? (
          /* Already acted: View Details only */
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.primaryOutlineButton]} onPress={handleCardPress} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="eye-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.primaryOutlineText}>View Details</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          /* Pending: Accept + Decline */
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.successButton]} onPress={() => onAccept?.(job)} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle-outline" size={16} color="#10B981" />
              <AppText variant={Variant.bodyMedium} style={styles.successButtonText}>{acceptActionLabel}</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={() => onDecline?.(job)} activeOpacity={0.8}>
              <VectorIcons name={iconLibName.Ionicons} iconName="close-circle-outline" size={16} color="#EF4444" />
              <AppText variant={Variant.bodyMedium} style={styles.dangerButtonText}>Decline</AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default JobSeekerJobCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(5),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  jobTitle: {
    flex: 1,
    color: '#65799B',
    fontWeight: 'bold',
    marginRight: wp(3),
  },
  badgeContainer: {
    alignItems: 'flex-end',
    gap: hp(0.5),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: hp(2.5),
  },
  statusText: {
    fontSize: getFontSize(10),
    fontWeight: '700',
  },
  searchTypeBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: hp(2.5),
  },
  quickBadge: {
    backgroundColor: '#10B981',
  },
  manualBadge: {
    backgroundColor: '#3B82F6',
  },
  searchTypeText: {
    color: colors.white,
    fontSize: getFontSize(10),
    fontWeight: 'bold',
  },
  salaryText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(1.5),
  },
  detailsContainer: {
    marginBottom: hp(1),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  detailText: {
    flex: 1,
    color: colors.gray,
  },
  detailValue: {
    fontWeight: 'bold',
    color: colors.secondary || '#333',
  },
  descriptionText: {
    color: '#6B7280',
    fontSize: getFontSize(12),
    lineHeight: getFontSize(18),
    marginBottom: hp(1),
  },
  timerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginTop: hp(0.5),
    marginBottom: hp(0.5),
    backgroundColor: '#F0F9FF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1),
  },
  timerStatusText: {
    color: '#1F2937',
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingTop: hp(1),
    marginTop: hp(0.5),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  completedDate: {
    color: '#10B981',
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  // ── Buttons ──
  buttonContainer: {
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2.5),
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(1.5),
    paddingVertical: hp(1.3),
    borderRadius: hp(4),
    borderWidth: 1,
  },
  primaryOutlineButton: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  primaryOutlineText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: getFontSize(13),
  },
  successButton: {
    backgroundColor: 'transparent',
    borderColor: '#10B981',
  },
  successButtonText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: getFontSize(13),
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderColor: '#EF4444',
  },
  dangerButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: getFontSize(13),
  },
  infoButton: {
    backgroundColor: '#EEF2FF',
    borderColor: '#2563EB',
  },
  infoButtonText: {
    color: '#1D4ED8',
    fontWeight: '600',
    fontSize: getFontSize(13),
  },
  disabledButton: {
    borderColor: '#D1D5DB',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});
