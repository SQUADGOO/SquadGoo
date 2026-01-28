import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import OfferCard from '@/components/Recruiter/Offers/OfferCard';
import {
  selectQuickOffers,
  cancelOffer,
  expireQuickOffers,
  acceptOfferModification,
  declineOfferModification,
} from '@/store/quickSearchSlice';
import { screenNames } from '@/navigation/screenNames';
import { resendOfferToNextMatch } from '@/services/autoOfferService';
import { sendQuickOffer } from '@/store/quickSearchSlice';
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';
import { DUMMY_CONTRACTORS } from '@/utilities/dummyContractors';
import { DUMMY_EMPLOYEES } from '@/utilities/dummyEmployees';

const tabs = [
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'declined', label: 'Declined' },
  { id: 'modification_requested', label: 'Modifications' },
  { id: 'expired', label: 'Expired' },
];

const findCandidateById = (candidateId) =>
  [...DUMMY_JOB_SEEKERS, ...DUMMY_CONTRACTORS, ...DUMMY_EMPLOYEES].find(c => c.id === candidateId) || null;

const formatOfferSentAt = (value) => {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getSalarySuffix = (salaryType) => {
  const t = String(salaryType || '').trim().toLowerCase();
  if (t === 'hourly') return '/hr';
  if (t === 'daily') return '/day';
  if (t === 'weekly') return '/week';
  if (t === 'annually' || t === 'annual' || t === 'yearly') return '/year';
  return '';
};

const pickFirstAvailabilitySlot = (availability) => {
  if (!availability || typeof availability !== 'object') return null;
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  for (const day of days) {
    const v = availability?.[day];
    if (v?.enabled && v?.from && v?.to) return { day, from: v.from, to: v.to };
  }
  return null;
};

const formatAuDate = (value) => {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ActiveOffers = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const allOffers = useSelector(selectQuickOffers);
  const quickJobs = useSelector(state => state.quickSearch.quickJobs);
  const matchesByJobId = useSelector(state => state.quickSearch.matchesByJobId);

  const jobIdFromRoute = route?.params?.jobId;

  const [currentTab, setCurrentTab] = useState('pending');

  useEffect(() => {
    // In a real app you would also filter by current recruiter ID
    dispatch(expireQuickOffers());
  }, [dispatch]);


  const filteredOffers = useMemo(() => {
    return allOffers.filter(offer => {
      if (offer.status !== currentTab) return false;
      if (jobIdFromRoute && offer.jobId !== jobIdFromRoute) return false;
      return true;
    });
  }, [allOffers, currentTab, jobIdFromRoute]);

  // Debug logging
  useEffect(() => {
    console.log('=== Quick Search Active Offers Debug ===');
   
    console.log('Accepted offers:', filteredOffers);
    console.log('========================================');
  }, [filteredOffers]);

  const handleCancel = (offerId) => {
    Alert.alert(
      'Cancel Offer',
      'Are you sure you want to cancel this offer?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            dispatch(cancelOffer({ offerId }));
          },
        },
      ]
    );
  };

  const handleAcceptModification = (offerId) => {
    Alert.alert(
      'Accept modification',
      'Approve the requested changes and accept this offer?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Accept',
          onPress: () => dispatch(acceptOfferModification({ offerId })),
        },
      ],
    );
  };

  const handleDeclineModification = (offerId) => {
    Alert.alert(
      'Decline modification',
      'Decline the requested changes? This will move the offer to Declined.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => dispatch(declineOfferModification({ offerId })),
        },
      ],
    );
  };

  const handleResend = (offer) => {
    const job = quickJobs.find(j => j.id === offer.jobId);
    if (!job) {
      Alert.alert('Error', 'Job not found');
      return;
    }

    const matches = matchesByJobId[job.id] || [];
    const existingOffers = allOffers.filter(o => o.jobId === job.id);

    const newOffer = resendOfferToNextMatch(
      job,
      offer,
      {},
      {},
      existingOffers,
      dispatch,
      sendQuickOffer
    );

    if (newOffer) {
      Alert.alert('Success', 'Offer sent to next available match.');
    } else {
      Alert.alert('No More Matches', 'No more available matches for this job.');
    }
  };

  const handleViewProfile = (candidateId, jobId) => {
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      jobId,
      candidateId,
    });
  };

  const handleMessage = (offer) => {
    const { jobId, candidateId, candidateName, jobTitle } = offer;
    
    // Navigate to Messages screen
    // Chat session should exist if offer is accepted (created when job seeker accepts)
    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        jobId,
        name: candidateName,
        jobTitle,
        jobType: 'quick',
        otherUserId: candidateId,
      },
    });
  };

  const handleTrackHours = (offer) => {
    const job =
      quickJobs.find(j => j.id === offer.jobId) ||
      {
        id: offer.jobId,
        title: offer.jobTitle,
        jobTitle: offer.jobTitle,
        salaryMin: offer.salaryMin,
      };
    navigation.navigate(screenNames.CANDIDATE_HOURS, {
      job,
      candidate: {
        id: offer.candidateId,
        name: offer.candidateName,
      },
    });
  };

  const formatExpiryLabel = (expiresAt) => {
    if (!expiresAt) return 'N/A';
    const date = new Date(expiresAt);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Quick Search Offers"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Tabs (same style as ManualOffers) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, currentTab === tab.id && styles.tabActive]}
            onPress={() => {
              setCurrentTab(tab.id);
            }}
            activeOpacity={0.7}
          >
            <AppText
              variant={Variant.bodyMedium}
              style={[
                styles.tabText,
                currentTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </AppText>
            {currentTab === tab.id && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listContainer}>
        <FlatList
          data={filteredOffers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            (() => {
              const job = quickJobs.find(j => j.id === item.jobId);
              const matchList = matchesByJobId?.[item.jobId] || [];
              const matchCandidate = matchList.find(m => m.id === item.candidateId);
              const baseCandidate = matchCandidate || findCandidateById(item.candidateId);

              const salaryMin = job?.salaryMin;
              const salaryMax = job?.salaryMax;
              const salaryType = job?.salaryType || 'Hourly';
              const salarySuffix = getSalarySuffix(salaryType);
              const salaryOffered =
                typeof salaryMin === 'number' && typeof salaryMax === 'number'
                  ? `$${salaryMin}–$${salaryMax}${salarySuffix}`
                  : '';

              const slot = pickFirstAvailabilitySlot(job?.availability);
              const startTime = slot?.from || '';
              const endTime = slot?.to || '';
              const workHours = slot ? `${slot.day}: ${slot.from}–${slot.to}` : (job?.availability?.summary || '');
              const startDate = formatAuDate(job?.jobStartDate);

              const isVerified = ['Gold', 'Platinum'].includes(String(baseCandidate?.badge || '').trim());
              const experienceSummary =
                typeof baseCandidate?.experienceYears === 'number'
                  ? `${baseCandidate.experienceYears} years`
                  : '';
              const qualificationsSummary = Array.isArray(baseCandidate?.qualifications)
                ? baseCandidate.qualifications.slice(0, 2).join(', ')
                : '';

              const otherTerms = [
                job?.taxType ? `Tax: ${job.taxType}` : '',
                job?.extraPay
                  ? `Extra pay: ${Object.entries(job.extraPay).filter(([, v]) => !!v).map(([k]) => k).join(', ')}`
                  : '',
              ].filter(Boolean);

              return (
            <OfferCard
              mode="quick"
              candidateName={item.candidateName}
              jobTitle={item.jobTitle}
              status={item.status}
              matchPercentage={item.matchPercentage}
              acceptanceRating={item.acceptanceRating}
              expiresLabel={formatExpiryLabel(item.expiresAt)}
              message={item.message}
              autoSent={item.autoSent}
              candidateId={item.candidateId}
              jobId={item.jobId}
              response={item.response}
              originalTerms={item.originalTerms}
              avatarUri={baseCandidate?.avatar}
              isVerified={isVerified}
              offerSentAt={formatOfferSentAt(item.createdAt)}
              modificationRequestedAt={formatOfferSentAt(item.updatedAt)}
              salaryOffered={salaryOffered}
              workHours={workHours}
              startDate={startDate}
              startTime={startTime}
              endTime={endTime}
              otherTerms={otherTerms}
              experienceSummary={experienceSummary}
              qualificationsSummary={qualificationsSummary}
              onViewProfile={handleViewProfile}
              onAcceptModification={
                item.status === 'modification_requested'
                  ? () => handleAcceptModification(item.id)
                  : undefined
              }
              onDeclineModification={
                item.status === 'modification_requested'
                  ? () => handleDeclineModification(item.id)
                  : undefined
              }
              onMessage={
                item.status === 'accepted'
                  ? () => handleMessage(item)
                  : undefined
              }
              onTrackHours={
                item.status === 'accepted'
                  ? () => handleTrackHours(item)
                  : undefined
              }
              onCancel={
                item.status === 'pending'
                  ? () => handleCancel(item.id)
                  : undefined
              }
              onResend={
                item.status === 'declined' || item.status === 'expired'
                  ? () => handleResend(item)
                  : undefined
              }
            />
              );
            })()
          )}
          contentContainerStyle={[
            styles.list,
            filteredOffers.length === 0 && styles.listEmpty,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="send-outline"
                  size={64}
                  color={colors.gray}
                />
              </View>
              <AppText variant={Variant.subTitle} style={styles.emptyTitle}>
                No Offers Found
              </AppText>
              <AppText variant={Variant.body} style={styles.emptyText}>
                No quick search offers in this category yet. Check other tabs or
                post a new quick search job.
              </AppText>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default ActiveOffers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabRow: {
    height: hp(7),
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(2),
    marginRight: wp(1.5),
    position: 'relative',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: `${colors.primary}15`,
  },
  tabText: {
    color: colors.gray,
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -hp(1),
    left: '50%',
    marginLeft: -wp(2.5),
    width: wp(5),
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  listContainer: {
    height: hp(70),
  },
  list: {
    padding: wp(4),
    paddingBottom: hp(4),
    flexGrow: 0,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  offerMeta: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
    gap: wp(1),
  },
  statusText: {
    fontSize: getFontSize(11),
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    flex: 1,
  },
  statText: {
    fontSize: getFontSize(12),
    color: colors.secondary,
    fontWeight: '500',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginBottom: hp(1),
  },
  expiryText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  autoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.grayE8 || '#F3F4F6',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 8,
    marginBottom: hp(1),
  },
  autoText: {
    color: colors.gray,
    fontSize: getFontSize(10),
  },
  responseBox: {
    backgroundColor: '#F9FAFB',
    padding: wp(3.5),
    borderRadius: hp(1.5),
    marginTop: hp(1),
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  responseLabel: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: colors.gray,
    marginBottom: hp(0.3),
  },
  responseValue: {
    fontSize: getFontSize(12),
    color: colors.secondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(2),
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: wp(1.5),
  },
  declineButtonText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  modifyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: wp(1.5),
  },
  modifyButtonText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  acceptedBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: '#D1FAE5',
    gap: wp(1.5),
  },
  acceptedText: {
    color: '#065F46',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: hp(10),
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(1),
  },
  emptyText: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: 'center',
    lineHeight: getFontSize(20),
  },
});

