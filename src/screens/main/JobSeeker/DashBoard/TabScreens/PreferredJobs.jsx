import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { screenNames } from '@/navigation/screenNames';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formatJobTitle = (value) => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  return value?.subCategory || value?.title || value?.category || '—';
};

const formatJobCategory = (value) => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  return value?.category || value?.title || value?.name || '—';
};

const formatSubCategory = (value) => {
  if (!value) return '';
  if (typeof value === 'object') return value?.subCategory || '';
  return '';
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={16} color={colors.gray} />
    <View style={styles.infoContent}>
      <AppText variant={Variant.caption} style={styles.infoLabel}>{label}</AppText>
      <AppText variant={Variant.body} style={styles.infoValue}>{value || '—'}</AppText>
    </View>
  </View>
);

const PreferredJobs = ({ navigation }) => {
  const preferredJobs = useSelector(state => state?.jobSeekerPreferred?.preferredJobs || []);

  return (
    <View style={styles.container}>
      <AppHeader
        onPlusPress={() => navigation.navigate(screenNames.ADD_JOB_STEP1)}
        showPlusIcon={true}
        showBackButton={false}
        title="Preferred Jobs"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {preferredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="heart-outline" size={56} color="#D1D5DB" />
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>No preferred jobs added yet</AppText>
            <AppText variant={Variant.caption} style={styles.emptySub}>
              Tap + to create your first preferred job profile. These are matched with recruiter offers.
            </AppText>
          </View>
        ) : (
          preferredJobs.map((job) => {
            const title = formatJobTitle(job.preferredJobTitle);
            const jobCategory = formatJobCategory(job.preferredJobTitle);
            const subCategory = formatSubCategory(job.preferredJobTitle);
            const enabledDays = new Set((job.daysAvailable || '').split(',').map(s => s.trim()).filter(Boolean));
            const salaryDisplay = (job.expectedPayMin && job.expectedPayMax)
              ? `$${job.expectedPayMin}/hr – $${job.expectedPayMax}/hr`
              : '—';

            return (
              <View key={job.id} style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderIcon}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="heart" size={20} color={colors.white} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant={Variant.bodyMedium} style={styles.cardTitle} numberOfLines={2}>
                      {title !== '—' ? title : jobCategory}
                    </AppText>
                    {job.jobType ? (
                      <View style={styles.typeBadge}>
                        <AppText variant={Variant.caption} style={styles.typeBadgeText}>{job.jobType}</AppText>
                      </View>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(screenNames.ADD_JOB_STEP1, { mode: 'edit', preferredJob: job })}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <VectorIcons name={iconLibName.Ionicons} iconName="create-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                {/* Details */}
                <InfoRow icon="pricetag-outline" label="Job Category" value={jobCategory} />
                {subCategory ? <InfoRow icon="pricetags-outline" label="Sub Category" value={subCategory} /> : null}
                <InfoRow icon="cash-outline" label="Expected Salary" value={salaryDisplay} />
                <InfoRow icon="star-outline" label="Experience" value={job.totalExperience} />

                {/* Availability */}
                <View style={styles.divider} />
                <View style={styles.availHeader}>
                  <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={16} color={colors.primary} />
                  <AppText variant={Variant.caption} style={styles.availTitle}>AVAILABILITY</AppText>
                </View>

                {DAYS_OF_WEEK.map((day) => {
                  const enabled = enabledDays.has(day);
                  return (
                    <View key={`${job.id}_${day}`} style={styles.dayRow}>
                      <View style={styles.dayLabelRow}>
                        <View style={[styles.dayDot, { backgroundColor: enabled ? '#10B981' : '#D1D5DB' }]} />
                        <AppText variant={Variant.body} style={[styles.dayText, !enabled && styles.dayTextDisabled]}>
                          {day}
                        </AppText>
                      </View>
                      <AppText variant={Variant.bodyMedium} style={[styles.timeText, !enabled && styles.timeTextDisabled]}>
                        {enabled ? `${job.startTime || '—'} – ${job.endTime || '—'}` : 'Not available'}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}

        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
};

export default PreferredJobs;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: wp(4), paddingBottom: hp(5) },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2), padding: wp(5), marginBottom: hp(2),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3), marginBottom: hp(1) },
  cardHeaderIcon: {
    width: wp(11), height: wp(11), borderRadius: wp(5.5),
    backgroundColor: '#EC4899', justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { color: colors.secondary || '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(0.3) },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: '#DCFCE7', paddingHorizontal: wp(2.5), paddingVertical: hp(0.3), borderRadius: hp(1.5) },
  typeBadgeText: { color: '#065F46', fontWeight: '700', fontSize: getFontSize(10) },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: hp(1.2) },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3), marginBottom: hp(1) },
  infoContent: { flex: 1 },
  infoLabel: { color: colors.gray, fontSize: getFontSize(11), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: hp(0.2) },
  infoValue: { color: colors.secondary || '#333', fontSize: getFontSize(14), fontWeight: '600' },

  // Availability
  availHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  availTitle: { color: colors.primary, fontWeight: '700', fontSize: getFontSize(11), letterSpacing: 0.5 },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(0.7) },
  dayLabelRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2) },
  dayDot: { width: 8, height: 8, borderRadius: 4 },
  dayText: { color: '#374151', fontSize: getFontSize(13), fontWeight: '500' },
  dayTextDisabled: { color: '#D1D5DB' },
  timeText: { color: colors.secondary || '#111', fontSize: getFontSize(13), fontWeight: '600' },
  timeTextDisabled: { color: '#D1D5DB', fontWeight: '400' },

  // Empty
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: hp(12), gap: hp(1), paddingHorizontal: wp(8) },
  emptyTitle: { color: '#374151', fontWeight: '700', fontSize: getFontSize(16) },
  emptySub: { color: '#9CA3AF', fontSize: getFontSize(13), textAlign: 'center', lineHeight: getFontSize(20) },
});
