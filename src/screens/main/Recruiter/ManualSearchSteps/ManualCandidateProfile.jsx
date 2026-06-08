import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, getFontSize, hp, wp } from '@/theme';
import { useJob } from '@/api/jobs/jobs.query';
import { useSendOffer, useSentOffers } from '@/api/offers/offers.query';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { screenNames } from '@/navigation/screenNames';
import CandidateProfileView from '@/components/Recruiter/CandidateProfileView';

const formatDateTime = (value) => {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatReason = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const label = value?.label ? String(value.label) : '';
  const note = value?.note ? String(value.note) : '';
  return [label, note].filter(Boolean).join(' - ');
};

const ManualCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidate: candidateParam, mode } = route.params || {};
  const { data: job } = useJob(jobId);
  const { data: sentOffers = [] } = useSentOffers();
  const sendOffer = useSendOffer();

  const candidate = candidateParam || null;
  const candidateId = candidate?.id;

  const isDeclinedReview = mode === 'declined_review';
  const isExpiredReview = mode === 'expired_review';
  const isWorkCoordination = mode === 'work_coordination';
  const offerMeta = route?.params?.offerMeta || null;

  const offerForContext = useMemo(
    () =>
      candidateId
        ? sentOffers.find(o => o.jobId === jobId && o.jobseekerId === candidateId) || null
        : null,
    [sentOffers, candidateId, jobId],
  );

  const acceptedOffer = useMemo(() => {
    if (!jobId || !candidateId) return null;
    return sentOffers.find(o => o.jobId === jobId && o.jobseekerId === candidateId && o.status === 'accepted') || null;
  }, [sentOffers, jobId, candidateId]);

  const [offerModal, setOfferModal] = useState(false);

  const handleSendOffer = async ({ expiryHours, message }) => {
    if (!candidate) return;
    try {
      await sendOffer.mutateAsync({ jobId, candidateId: candidate.id, expiryHours, message });
      navigation.navigate(screenNames.MANUAL_OFFERS, { jobId });
    } catch {
      // hook surfaces the error toast
    }
  };

  const handleContact = () => {
    if (!candidate || !jobId || !job) return;
    navigation.navigate(screenNames.MESSAGES, {
      chatData: { jobId, name: candidate.name, jobTitle: job.title, jobType: 'manual', otherUserId: candidate.id },
    });
  };

  const handleTrackHours = () => {
    if (!candidate || !jobId) return;
    navigation.navigate(screenNames.CANDIDATE_HOURS, {
      job: job || { id: jobId, title: 'Manual Job', jobTitle: 'Manual Job' },
      candidate: { id: candidate.id, name: candidate.name },
      source: 'manual',
      mode: 'work_coordination',
    });
  };

  if (!candidate) {
    return (
      <View style={styles.container}>
        <AppHeader title="Candidate Profile" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <AppText variant={Variant.body}>Candidate not found. Please return to the match list.</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Candidate Profile" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Expired banner */}
        {isExpiredReview ? (
          <StatusBanner
            icon="hourglass-outline"
            iconColor="#6B7280"
            title="Expired"
            dateLabel="Expired date"
            dateValue={formatDateTime(offerMeta?.expiresAt || offerForContext?.expiresAt)}
            reasonLabel="Expiry reason"
            reasonValue={formatReason(offerMeta?.expiryReason)}
          />
        ) : null}

        {/* Declined banner */}
        {isDeclinedReview ? (
          <StatusBanner
            icon="close-circle"
            iconColor="#EF4444"
            title="Declined"
            dateLabel="Date declined"
            dateValue={formatDateTime(offerMeta?.declinedAt || offerForContext?.declinedAt)}
            reasonLabel="Decline reason"
            reasonValue={formatReason(offerMeta?.declineReason || offerForContext?.declineReason)}
          />
        ) : null}

        <CandidateProfileView candidate={candidate}>
          {/* Action buttons */}
          <View style={styles.footerActions}>
            {isDeclinedReview || isExpiredReview ? (
              <AppButton text="Back" onPress={() => navigation.goBack()} bgColor="#FFFFFF" textStyle={{ color: colors.primary }} style={styles.secondaryButton} />
            ) : isWorkCoordination ? (
              <>
                <TouchableOpacity style={styles.contactButton} onPress={handleContact} activeOpacity={0.85}>
                  <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-ellipses-outline" size={18} color={colors.primary} />
                  <AppText variant={Variant.bodyMedium} style={styles.contactButtonText}>Contact / Chat</AppText>
                </TouchableOpacity>
                <AppButton text="Track Hours" onPress={handleTrackHours} bgColor="#FFFFFF" textStyle={{ color: colors.primary }} style={styles.secondaryButton} />
              </>
            ) : (
              <>
                <AppButton text="Send Offer" onPress={() => setOfferModal(true)} bgColor={colors.primary} textColor="#FFF" style={styles.primaryButton} />
                {acceptedOffer ? (
                  <TouchableOpacity style={styles.contactButton} onPress={handleContact} activeOpacity={0.85}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-ellipses-outline" size={18} color={colors.primary} />
                    <AppText variant={Variant.bodyMedium} style={styles.contactButtonText}>Contact / Chat</AppText>
                  </TouchableOpacity>
                ) : null}
                <AppButton text="Back to Matches" onPress={() => navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId })} bgColor="#FFFFFF" textStyle={{ color: colors.primary }} style={styles.secondaryButton} />
              </>
            )}
          </View>
        </CandidateProfileView>
      </ScrollView>

      {!isDeclinedReview && !isExpiredReview && !isWorkCoordination ? (
        <SendManualOfferModal visible={offerModal} candidate={candidate} onClose={() => setOfferModal(false)} onSubmit={handleSendOffer} />
      ) : null}
    </View>
  );
};

/* Status banner for declined/expired offers */
const StatusBanner = ({ icon, iconColor, title, dateLabel, dateValue, reasonLabel, reasonValue }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={20} color={iconColor} />
      <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>{title}</AppText>
    </View>
    <View style={styles.divider} />
    {dateValue ? (
      <View style={styles.infoRow}>
        <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={16} color={colors.gray} />
        <View style={styles.infoContent}>
          <AppText variant={Variant.caption} style={styles.infoLabel}>{dateLabel}</AppText>
          <AppText variant={Variant.body} style={styles.infoValue}>{dateValue}</AppText>
        </View>
      </View>
    ) : null}
    {reasonValue ? (
      <View style={[styles.infoRow, { marginTop: hp(1.5) }]}>
        <VectorIcons name={iconLibName.Ionicons} iconName="chatbox-ellipses-outline" size={16} color={colors.gray} />
        <View style={styles.infoContent}>
          <AppText variant={Variant.caption} style={styles.infoLabel}>{reasonLabel}</AppText>
          <AppText variant={Variant.body} style={styles.infoValue}>{reasonValue}</AppText>
        </View>
      </View>
    ) : null}
  </View>
);

export default ManualCandidateProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || '#F5F6FA' },
  content: { padding: wp(4), paddingBottom: hp(4), gap: hp(2) },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2.5), padding: wp(5),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5), gap: wp(2) },
  sectionTitle: { fontSize: getFontSize(16), fontWeight: '700', color: colors.secondary },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3) },
  infoContent: { flex: 1 },
  infoLabel: { color: colors.gray, fontSize: getFontSize(11), fontWeight: '500', marginBottom: hp(0.3), textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { color: colors.secondary, fontSize: getFontSize(14), lineHeight: getFontSize(20) },
  footerActions: { marginTop: hp(1), gap: hp(1.5) },
  primaryButton: { borderRadius: hp(2), paddingVertical: hp(1.8) },
  secondaryButton: { borderRadius: hp(2), borderWidth: 1.5, borderColor: '#E5E7EB' },
  contactButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: hp(1.6), borderRadius: hp(2), backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: colors.primary, gap: wp(2),
  },
  contactButtonText: { color: colors.primary, fontSize: getFontSize(14), fontWeight: '700' },
});
