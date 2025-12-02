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
} from '@/store/quickSearchSlice';
import { screenNames } from '@/navigation/screenNames';
import { resendOfferToNextMatch } from '@/services/autoOfferService';
import { sendQuickOffer } from '@/store/quickSearchSlice';

const tabs = [
  { id: 'pending', label: 'Pending' },
  { id: 'matches', label: 'Matches' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'declined', label: 'Declined' },
  { id: 'expired', label: 'Expired' },
];

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


  const filteredOffers = useMemo(
    () => {
      // console.log('testng', allOffers)
      return  allOffers.filter(offer => offer.status === currentTab)
    },
    [currentTab],
  );

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
              if (tab.id === 'matches') {
                if (!jobIdFromRoute) {
                  Alert.alert(
                    'No job selected',
                    'Matches are only available when viewing offers for a specific quick search job.',
                  );
                  return;
                }
                navigation.navigate(screenNames.QUICK_SEARCH_MATCH_LIST, {
                  jobId: jobIdFromRoute,
                });
              } else {
                setCurrentTab(tab.id);
              }
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
            {currentTab === tab.id && tab.id !== 'matches' && (
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
              onViewProfile={handleViewProfile}
              onMessage={
                item.status === 'accepted'
                  ? () => handleMessage(item)
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

