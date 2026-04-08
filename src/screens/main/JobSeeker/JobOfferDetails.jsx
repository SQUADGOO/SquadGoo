import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import { addCandidateToJob, updateJobStatus } from '@/store/jobsSlice';
import { applyToOffer } from '@/store/jobSeekerOffersSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectContactRevealByJobId } from '@/store/contactRevealSlice';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

const JobOfferDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { job, isCompleted } = route.params || {};

  const userInfo = useSelector(state => state?.auth?.userInfo || {});
  const currentUserId = userInfo?._id || userInfo?.id || 'js-001';
  const currentCandidateId = userInfo?.candidateId || userInfo?._id || 'js-001';

  const acceptedOffers = useSelector(state => state?.jobSeekerOffers?.acceptedOffers || []);
  const declinedOffers = useSelector(state => state?.jobSeekerOffers?.declinedOffers || []);
  const jobCandidates = useSelector(state => state?.jobs?.jobCandidates || {});

  const hasApplied = acceptedOffers.some(offer => offer.id === job?.id);
  const hasDeclined = declinedOffers.some(offer => offer.id === job?.id);
  const candidates = jobCandidates[job?.id] || [];
  const candidateExists = candidates.some(c =>
    c.id === currentCandidateId ||
    c.email === userInfo.email ||
    (userInfo.name && c.name === userInfo.name)
  );
  const alreadyApplied = hasApplied || hasDeclined || candidateExists;

  const contactReveal = useSelector(state =>
    selectContactRevealByJobId(state, job?.id, currentUserId)
  );
  const canSeeContacts = !!contactReveal;

  const recruiterInfo = {
    name: job?.recruiterName || 'Recruiter',
    phone: job?.recruiterPhone || '+61 400 000 000',
    email: job?.recruiterEmail || 'recruiter@example.com',
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <AppHeader title="Job Details" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.h3} style={styles.errorText}>Job not found</AppText>
        </View>
      </View>
    );
  }

  const isQuickJob = job?.searchType?.toLowerCase?.() === 'quick' || job?.source === 'quick';
  const primaryActionLabel = isQuickJob ? 'Accept' : 'Apply';
  const searchType = isQuickJob ? 'quick' : 'manual';

  const isEmptyValue = value => value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

  const formatTimeString = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return '';
    const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return String(timeString);
    const hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes} ${period}`;
  };

  const payRange = job?.salaryRange || (
    job?.salaryMin && job?.salaryMax
      ? `$${job.salaryMin}–$${job.salaryMax}${job?.salaryType?.toLowerCase?.()?.includes('hour') ? '/hr' : ''}`
      : '—'
  );
  const paySummary = job?.salaryType ? `${job.salaryType}: ${payRange}` : payRange;

  // ── Reusable sub-components ──
  const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
  );

  const SectionHeader = ({ iconName, title, iconColor = colors.primary }) => (
    <View style={styles.sectionHeader}>
      <VectorIcons name={iconLibName.Ionicons} iconName={iconName} size={20} color={iconColor} />
      <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>{title}</AppText>
    </View>
  );

  const InfoRow = ({ iconName, label, value, valueStyle, hideIfEmpty = true }) => {
    if (hideIfEmpty && isEmptyValue(value)) return null;
    return (
      <View style={styles.infoRow}>
        <VectorIcons name={iconLibName.Ionicons} iconName={iconName} size={16} color={colors.gray} />
        <View style={styles.infoContent}>
          <AppText variant={Variant.caption} style={styles.infoLabel}>{label}</AppText>
          <AppText variant={Variant.body} style={[styles.infoValue, valueStyle]}>
            {isEmptyValue(value) ? 'Not specified' : value}
          </AppText>
        </View>
      </View>
    );
  };

  const AvailabilityRow = ({ day, timeData }) => {
    if (!timeData?.enabled || !timeData.from || !timeData.to) return null;
    return (
      <View style={styles.availabilityRow}>
        <AppText variant={Variant.body} style={styles.dayLabel}>{day}:</AppText>
        <AppText variant={Variant.bodyMedium} style={styles.hoursText}>
          {formatTimeString(timeData.from)} - {formatTimeString(timeData.to)}
        </AppText>
      </View>
    );
  };

  const handleApply = () => {
    const candidate = {
      id: currentCandidateId,
      name: userInfo.name || (userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : 'Job Seeker'),
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      experience: userInfo.experience || 'Not specified',
      location: userInfo.location || userInfo.address || 'Not specified',
      status: 'accepted',
      appliedAt: new Date().toISOString(),
    };
    dispatch(addCandidateToJob({ jobId: job.id, candidate, autoAccept: true }));
    dispatch(updateJobStatus({ jobId: job.id, status: 'matched' }));
    dispatch(applyToOffer(job));
    Alert.alert(
      isQuickJob ? 'Offer Accepted!' : 'Application Submitted!',
      isQuickJob
        ? `You have accepted the quick offer for "${job.title}".`
        : `You have successfully applied for "${job.title}". The recruiter will review your application.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const WEEKEND = ['Saturday', 'Sunday'];
  const availability = job?.availability;
  const hasAvailability = availability && typeof availability === 'object' && !Array.isArray(availability);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppHeader title="Job Details" showTopIcons={false} height={hp(14)} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>

        {/* ═══ Summary / Hero Card ═══ */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <VectorIcons name={iconLibName.Ionicons} iconName="briefcase-outline" size={24} color={colors.white} />
            </View>
            <View style={styles.summaryInfo}>
              <AppText variant={Variant.h3} style={styles.summaryTitle}>{job.title}</AppText>
              <View style={styles.summaryMetaRow}>
                <VectorIcons name={iconLibName.Ionicons} iconName="location-outline" size={14} color={colors.gray} />
                <AppText variant={Variant.bodySmall} style={styles.summaryMetaText}>{job.location || 'Location not specified'}</AppText>
              </View>
              {job.industry ? (
                <View style={styles.summaryMetaRow}>
                  <VectorIcons name={iconLibName.Ionicons} iconName="pricetag-outline" size={14} color={colors.gray} />
                  <AppText variant={Variant.bodySmall} style={styles.summaryMetaText}>{job.industry}</AppText>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.chipsRow}>
            {(isCompleted || job.status === 'completed') ? (
              <View style={[styles.chip, styles.completedChip]}>
                <AppText variant={Variant.caption} style={styles.chipText}>✓ Completed</AppText>
              </View>
            ) : null}
            {hasApplied ? (
              <View style={[styles.chip, styles.completedChip]}>
                <AppText variant={Variant.caption} style={styles.chipText}>✓ {isQuickJob ? 'Accepted' : 'Applied'}</AppText>
              </View>
            ) : hasDeclined ? (
              <View style={[styles.chip, styles.expiredChip]}>
                <AppText variant={Variant.caption} style={styles.chipText}>✗ Declined</AppText>
              </View>
            ) : null}
            <View style={[styles.chip, searchType === 'quick' ? styles.quickChip : styles.manualChip]}>
              <AppText variant={Variant.caption} style={styles.chipText}>
                {searchType === 'quick' ? '⚡ Quick Search' : '📝 Manual Search'}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <VectorIcons name={iconLibName.Ionicons} iconName="people-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.bodySmall} style={styles.statText}>{job.staffNumber || '—'} Positions</AppText>
            </View>
            <View style={styles.statPill}>
              <VectorIcons name={iconLibName.Ionicons} iconName="cash-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.bodySmall} style={styles.statText}>{paySummary}</AppText>
            </View>
          </View>
        </Card>

        {/* ═══ Job Information ═══ */}
        <Card>
          <SectionHeader iconName="information-circle-outline" title="Job Information" />
          <View style={styles.divider} />
          <InfoRow iconName="briefcase-outline" label="Job type" value={job.type} />
          <InfoRow iconName="pricetag-outline" label="Industry" value={job.industry || job.jobCategory} />
          <InfoRow iconName="pricetags-outline" label="Sub category" value={job.jobSubCategory} />
          <InfoRow iconName="navigate-outline" label="Work location" value={job.location} />
          <InfoRow iconName="compass-outline" label="Range from location" value={job.rangeKm ? `${job.rangeKm} km` : null} />
          <InfoRow iconName="document-text-outline" label="Tax type" value={job.taxType} valueStyle={styles.highlightValue} />
        </Card>

        {/* ═══ Requirements ═══ */}
        <Card>
          <SectionHeader iconName="ribbon-outline" title="Requirements" />
          <View style={styles.divider} />
          <InfoRow iconName="school-outline" label="Education required" value={job.educationalQualification} />
          <InfoRow iconName="medal-outline" label="Extra qualifications" value={job.extraQualification} />
          <InfoRow iconName="shirt-outline" label="Required uniforms" value={job.requiredUniforms} />
          <InfoRow iconName="language-outline" label="Preferred languages" value={job.preferredLanguages} />
          <InfoRow iconName="clipboard-outline" label="Roles & responsibilities" value={job.rolesAndResponsibilities} />
          <InfoRow iconName="person-add-outline" label="Freshers can apply" value={job.freshersCanApply ? 'Yes' : 'No'} valueStyle={job.freshersCanApply ? styles.yesValue : undefined} hideIfEmpty={false} />
        </Card>

        {/* ═══ Experience & Compensation ═══ */}
        <Card>
          <SectionHeader iconName="star-outline" title="Experience & Compensation" />
          <View style={styles.divider} />
          <InfoRow iconName="star-outline" label="Experience required" value={job.experience} />
          <InfoRow iconName="cash-outline" label="Salary range" value={payRange} valueStyle={styles.salaryValue} />
          <InfoRow iconName="wallet-outline" label="Salary type" value={job.salaryType} />
        </Card>

        {/* ═══ Job Timeline ═══ */}
        <Card>
          <SectionHeader iconName="calendar-outline" title="Job Timeline" />
          <View style={styles.divider} />
          <InfoRow iconName="calendar-outline" label="Posted date" value={job.offerDate} />
          <InfoRow iconName="play-outline" label="Start date" value={job.jobStartDate} />
          <InfoRow iconName="stop-outline" label="End date" value={job.jobEndDate} />
          <InfoRow iconName="time-outline" label="Offer expires" value={job.expireDate} />
          {(isCompleted || job.status === 'completed') && job.completedDate ? (
            <InfoRow iconName="checkmark-done" label="Completed date" value={job.completedDate} valueStyle={styles.yesValue} />
          ) : null}
        </Card>

        {/* ═══ Extra Pay ═══ */}
        {(job.extraPay?.publicHolidays || job.extraPay?.weekend || job.extraPay?.shiftLoading || job.extraPay?.bonuses || job.extraPay?.overtime || job.weekendSatExtraPay || job.weekendSunExtraPay) ? (
          <Card>
            <SectionHeader iconName="gift-outline" title="Extra Pay Offered" />
            <View style={styles.divider} />
            {job.extraPay?.publicHolidays ? <InfoRow iconName="flag-outline" label="Public holidays" value={job.extraPayRates?.publicHolidays ? `$${job.extraPayRates.publicHolidays}` : 'Yes'} valueStyle={styles.yesValue} hideIfEmpty={false} /> : null}
            {job.extraPay?.weekend ? <InfoRow iconName="sunny-outline" label="Weekend" value={job.extraPayRates?.weekend ? `$${job.extraPayRates.weekend}` : 'Yes'} valueStyle={styles.yesValue} hideIfEmpty={false} /> : null}
            {job.extraPay?.shiftLoading ? <InfoRow iconName="moon-outline" label="Shift loading" value={job.extraPayRates?.shiftLoading ? `$${job.extraPayRates.shiftLoading}` : 'Yes'} valueStyle={styles.yesValue} hideIfEmpty={false} /> : null}
            {job.extraPay?.bonuses ? <InfoRow iconName="trophy-outline" label="Bonuses" value={job.extraPayRates?.bonuses ? `$${job.extraPayRates.bonuses}` : 'Yes'} valueStyle={styles.yesValue} hideIfEmpty={false} /> : null}
            {job.extraPay?.overtime ? <InfoRow iconName="time-outline" label="Overtime" value={job.overtimeRate || job.extraPayRates?.overtime ? `$${job.overtimeRate || job.extraPayRates.overtime}` : 'Yes'} valueStyle={styles.yesValue} hideIfEmpty={false} /> : null}
            {job.weekendSatExtraPay ? <InfoRow iconName="sunny-outline" label="Saturday extra pay" value={job.weekendSatRate ? `$${job.weekendSatRate}` : 'Yes'} valueStyle={styles.yesValue} hideIfEmpty={false} /> : null}
            {job.weekendSunExtraPay ? <InfoRow iconName="sunny-outline" label="Sunday extra pay" value={job.weekendSunRate ? `$${job.weekendSunRate}` : 'Yes'} valueStyle={styles.yesValue} hideIfEmpty={false} /> : null}
          </Card>
        ) : null}

        {/* ═══ Availability ═══ */}
        {hasAvailability ? (
          <Card>
            <SectionHeader iconName="time-outline" title="Availability" />
            <View style={styles.divider} />
            <View style={styles.availabilityContainer}>
              {WEEKDAYS.map(day => <AvailabilityRow key={day} day={day} timeData={availability[day]} />)}
              {WEEKEND.some(day => availability[day]?.enabled) ? (
                <>
                  <View style={styles.weekendDivider} />
                  {WEEKEND.map(day => <AvailabilityRow key={day} day={day} timeData={availability[day]} />)}
                </>
              ) : null}
            </View>
          </Card>
        ) : null}

        {/* ═══ Job Description ═══ */}
        {(job.jobDescription || job.description) ? (
          <Card>
            <SectionHeader iconName="document-text-outline" title="Job Description" />
            <View style={styles.divider} />
            <AppText variant={Variant.body} style={styles.descriptionText}>
              {job.jobDescription || job.description}
            </AppText>
          </Card>
        ) : null}

        {/* ═══ Recruiter Contact (only after accepting) ═══ */}
        {canSeeContacts ? (
          <Card>
            <SectionHeader iconName="person-outline" title="Recruiter Contact" />
            <View style={styles.divider} />
            <InfoRow iconName="call-outline" label="Phone" value={recruiterInfo.phone} hideIfEmpty={false} />
            <InfoRow iconName="mail-outline" label="Email" value={recruiterInfo.email} hideIfEmpty={false} />
          </Card>
        ) : null}

        {/* ═══ Action Buttons ═══ */}
        {!(isCompleted || job.status === 'completed') && !alreadyApplied ? (
          <View style={styles.actionContainer}>
            <AppButton
              text={`${primaryActionLabel} this Job`}
              onPress={handleApply}
              bgColor={colors.primary}
              textColor="#FFFFFF"
            />
          </View>
        ) : null}

        {alreadyApplied && !(isCompleted || job.status === 'completed') ? (
          <Card>
            <View style={styles.appliedStatusContainer}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName={hasDeclined ? 'close-circle' : 'checkmark-circle'}
                size={24}
                color={hasDeclined ? '#EF4444' : '#10B981'}
              />
              <AppText variant={Variant.bodyMedium} style={[styles.appliedStatusText, { color: hasDeclined ? '#EF4444' : '#10B981' }]}>
                {hasDeclined
                  ? 'You have declined this job offer'
                  : isQuickJob
                    ? 'You have already accepted this job offer'
                    : 'You have already applied for this job'}
              </AppText>
            </View>
          </Card>
        ) : null}

      </ScrollView>
    </View>
  );
};

export default JobOfferDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || '#F5F6FA' },
  content: { flex: 1 },
  contentContainer: { padding: wp(4), paddingBottom: hp(4), gap: hp(2) },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: colors.gray },

  // Card
  card: { backgroundColor: '#FFFFFF', borderRadius: hp(2.5), padding: wp(5), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },

  // Summary / Hero
  summaryCard: { padding: wp(5) },
  summaryHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: hp(1.5) },
  summaryIcon: { width: wp(14), height: wp(14), borderRadius: wp(7), backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: wp(4) },
  summaryInfo: { flex: 1 },
  summaryTitle: { color: colors.secondary, fontWeight: '800', fontSize: getFontSize(20), marginBottom: hp(0.6) },
  summaryMetaRow: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), marginTop: hp(0.3) },
  summaryMetaText: { color: colors.gray },

  // Chips
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(2), marginTop: hp(1) },
  chip: { paddingHorizontal: wp(3), paddingVertical: hp(0.6), borderRadius: hp(3) },
  completedChip: { backgroundColor: '#D1FAE5', borderWidth: 1, borderColor: '#86EFAC' },
  expiredChip: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  quickChip: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#86EFAC' },
  manualChip: { backgroundColor: '#DBEAFE', borderWidth: 1, borderColor: '#93C5FD' },
  chipText: { color: colors.secondary, fontWeight: '700', fontSize: getFontSize(11) },

  // Stats
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },
  statsRow: { flexDirection: 'row', gap: wp(2), marginTop: hp(1.5) },
  statPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#EEF2F7', paddingVertical: hp(1.2), paddingHorizontal: wp(3), borderRadius: hp(2), gap: wp(2) },
  statText: { color: colors.secondary, fontWeight: '600', fontSize: getFontSize(12) },

  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1.2) },
  sectionTitle: { fontSize: getFontSize(16), fontWeight: '800', color: colors.secondary },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3), marginBottom: hp(1.5) },
  infoContent: { flex: 1 },
  infoLabel: { color: colors.gray, fontSize: getFontSize(11), fontWeight: '600', marginBottom: hp(0.2), textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { color: colors.secondary, fontSize: getFontSize(14), fontWeight: '600' },
  salaryValue: { color: colors.primary, fontWeight: 'bold' },
  highlightValue: { color: colors.primary },
  yesValue: { color: '#4ADE80', fontWeight: '700' },

  // Availability
  availabilityContainer: { marginTop: hp(0.5) },
  availabilityRow: { flexDirection: 'row', marginBottom: hp(1) },
  dayLabel: { color: colors.gray, width: wp(25) },
  hoursText: { fontWeight: 'bold', color: colors.black, flex: 1 },
  weekendDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: hp(1) },

  // Description
  descriptionText: { lineHeight: hp(2.5), color: colors.black },

  // Actions
  actionContainer: { marginTop: hp(1) },
  appliedStatusContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(2), paddingVertical: hp(1) },
  appliedStatusText: { fontWeight: '700', fontSize: getFontSize(14) },
});
