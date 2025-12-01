import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { selectActiveQuickJobs } from '@/store/quickSearchSlice';
import { LOCATION_STAGES, formatStageName } from '@/services/locationTrackingService';
import { screenNames } from '@/navigation/screenNames';

const ActiveJobs = ({ navigation }) => {
  const activeJobs = useSelector(selectActiveQuickJobs);

  const handleViewLocation = (jobId) => {
    navigation.navigate(screenNames.LIVE_TRACKING, { jobId });
  };

  const handleViewTimer = (jobId) => {
    navigation.navigate(screenNames.TIMER_MANAGEMENT, { jobId });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const JobCard = ({ job }) => {
    const stage = job.currentStage || job.locationTracking?.stage || LOCATION_STAGES.ACCEPTED;
    const timer = job.timer || {};
    const payment = job.payment || {};

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AppText variant={Variant.subTitle} style={styles.jobTitle}>
            {job.jobTitle}
          </AppText>
          <View style={[styles.statusBadge, getStageBadgeStyle(stage)]}>
            <AppText variant={Variant.caption} style={styles.statusText}>
              {formatStageName(stage)}
            </AppText>
          </View>
        </View>

        <AppText variant={Variant.body} style={styles.candidateName}>
          {job.candidateName}
        </AppText>

        {/* Location Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="location"
              size={18}
              color={colors.primary}
            />
            <AppText variant={Variant.body} style={styles.sectionTitle}>
              Location: {formatStageName(stage)}
            </AppText>
          </View>
          {stage !== LOCATION_STAGES.ARRIVED && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleViewLocation(job.id)}
            >
              <AppText variant={Variant.bodyMedium} style={styles.actionText}>
                View Live Tracking →
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Timer Status */}
        {timer.isRunning !== undefined && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="time-outline"
                size={18}
                color={colors.primary}
              />
              <AppText variant={Variant.body} style={styles.sectionTitle}>
                Timer: {timer.isRunning ? 'Running' : 'Stopped'}
              </AppText>
            </View>
            {timer.elapsedTime > 0 && (
              <AppText variant={Variant.caption} style={styles.timerInfo}>
                {formatTime(timer.elapsedTime)} | ${(timer.totalCost || 0).toFixed(2)}
              </AppText>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleViewTimer(job.id)}
            >
              <AppText variant={Variant.bodyMedium} style={styles.actionText}>
                Manage Timer →
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment Status */}
        {payment.method && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="card-outline"
                size={18}
                color={colors.primary}
              />
              <AppText variant={Variant.body} style={styles.sectionTitle}>
                Payment: {payment.method === 'platform' ? 'Platform' : 'Direct'}
              </AppText>
            </View>
            {payment.method === 'platform' && payment.balanceHeld > 0 && (
              <AppText variant={Variant.caption} style={styles.balanceInfo}>
                Balance held: ${payment.balanceHeld.toFixed(2)}
              </AppText>
            )}
          </View>
        )}
      </View>
    );
  };

  const getStageBadgeStyle = (stage) => {
    const stylesMap = {
      [LOCATION_STAGES.ACCEPTED]: { backgroundColor: '#E0D9E9' },
      [LOCATION_STAGES.PREPARING]: { backgroundColor: '#FEF3C7' },
      [LOCATION_STAGES.EN_ROUTE]: { backgroundColor: '#DBEAFE' },
      [LOCATION_STAGES.APPROACHING]: { backgroundColor: '#D1FAE5' },
      [LOCATION_STAGES.ARRIVED]: { backgroundColor: '#D1FAE5' },
    };
    return stylesMap[stage] || stylesMap[LOCATION_STAGES.ACCEPTED];
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Active Quick Jobs" showTopIcons={false} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={64}
              color={colors.gray}
            />
            <AppText variant={Variant.bodyMedium} style={styles.emptyText}>
              No Active Jobs
            </AppText>
            <AppText variant={Variant.body} style={styles.emptySubText}>
              Your active quick search jobs will appear here.
            </AppText>
          </View>
        ) : (
          activeJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ActiveJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  jobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 12,
    marginLeft: wp(2),
  },
  statusText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: getFontSize(11),
  },
  candidateName: {
    color: colors.gray,
    fontSize: getFontSize(14),
    marginBottom: hp(1.5),
  },
  section: {
    marginBottom: hp(1.5),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginLeft: wp(2),
  },
  timerInfo: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginTop: hp(0.5),
  },
  balanceInfo: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginTop: hp(0.5),
  },
  actionButton: {
    marginTop: hp(1),
  },
  actionText: {
    color: colors.primary,
    fontSize: getFontSize(13),
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: wp(10),
  },
  emptyText: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: '600',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  emptySubText: {
    color: colors.gray,
    fontSize: getFontSize(14),
    textAlign: 'center',
    lineHeight: 20,
  },
});

