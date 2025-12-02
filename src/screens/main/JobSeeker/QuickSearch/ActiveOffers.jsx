import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectQuickOffers, 
  acceptQuickOffer, 
  declineQuickOffer,
  expireQuickOffers 
} from '@/store/quickSearchSlice';
import { createChatSession } from '@/store/chatSlice';
import { revealContacts } from '@/store/contactRevealSlice';
import { addNotification } from '@/store/notificationsSlice';
import { updateJobStatus } from '@/store/jobsSlice';
import { screenNames } from '@/navigation/screenNames';

const ActiveOffers = ({ navigation }) => {
  const dispatch = useDispatch();
  const allOffers = useSelector(selectQuickOffers);
  const quickJobs = useSelector(state => state?.quickSearch?.quickJobs || []);
  const userInfo = useSelector(state => state?.auth?.userInfo || {});
  const [offers, setOffers] = useState([]);
  
  const currentUserId = userInfo?._id || userInfo?.id || 'js-001';
  const currentCandidateId = userInfo?.candidateId || userInfo?._id || 'js-001';

  useEffect(() => {
    // Filter pending offers for current user (job seeker)
    // In real app, filter by current user ID
    const pendingOffers = allOffers.filter(
      offer => offer.status === 'pending'
    );
    setOffers(pendingOffers);

    // Expire old offers
    dispatch(expireQuickOffers());
  }, [allOffers, dispatch]);

  const handleAccept = (offerId) => {
    const offer = allOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    Alert.alert(
      'Accept Offer',
      'Are you sure you want to accept this job offer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            dispatch(acceptQuickOffer({ offerId }));
            
            // Get job details
            const job = quickJobs.find(j => j.id === offer.jobId);
            if (job) {
              // Update job status to matched
              dispatch(updateJobStatus({ jobId: job.id, status: 'matched' }));
              
              // Create chat session (30 days expiration)
              const recruiterId = job.recruiterId || 'recruiter-001';
              dispatch(createChatSession({
                jobId: job.id,
                userId: currentUserId,
                otherUserId: recruiterId,
                jobTitle: offer.jobTitle || job.jobTitle,
                searchType: 'quick',
                expiresInDays: 30,
              }));
              
              // Reveal contacts between job seeker and recruiter
              dispatch(revealContacts({
                jobId: job.id,
                userId1: currentUserId,
                userId2: recruiterId,
                expiresInDays: 30,
              }));
              
              // Create notification for recruiter
              dispatch(addNotification({
                type: 'offer_accepted',
                title: 'Quick Offer Accepted',
                message: `${userInfo.name || 'A job seeker'} has accepted your quick search offer for "${offer.jobTitle}"`,
                jobId: job.id,
                candidateId: currentCandidateId,
                userId: recruiterId,
              }));
            }
            
            Alert.alert('Success', 'Offer accepted! Chat is now enabled. Location tracking will begin.');
            // Navigate to active jobs or location sharing
            navigation.navigate(screenNames.QUICK_SEARCH_ACTIVE_JOBS_JS);
          },
        },
      ]
    );
  };

  const handleDecline = (offerId) => {
    Alert.alert(
      'Decline Offer',
      'Please provide a reason for declining this offer.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            // In real app, show reason selection modal
            const reason = {
              type: 'other',
              message: 'Not available',
              isValid: true,
            };
            dispatch(declineQuickOffer({ offerId, reason }));
          },
        },
      ]
    );
  };

  const formatExpiryTime = (expiresAt) => {
    if (!expiresAt) return 'No expiry';
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = Math.max(0, Math.floor((expiry - now) / 1000 / 60 / 60 / 24));
    if (diff === 0) {
      const hours = Math.max(0, Math.floor((expiry - now) / 1000 / 60 / 60));
      return hours > 0 ? `${hours} hours left` : 'Expiring soon';
    }
    return `${diff} days left`;
  };

  const OfferCard = ({ offer }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <AppText variant={Variant.subTitle} style={styles.jobTitle}>
            {offer.jobTitle}
          </AppText>
          <View style={styles.matchBadge}>
            <AppText variant={Variant.caption} style={styles.matchText}>
              {Math.round(offer.matchPercentage)}% Match
            </AppText>
          </View>
        </View>
        <AppText variant={Variant.caption} style={styles.expiryText}>
          {formatExpiryTime(offer.expiresAt)}
        </AppText>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="star"
            size={16}
            color={colors.primary}
          />
          <AppText variant={Variant.caption} style={styles.detailText}>
            Rating: {offer.acceptanceRating}%
          </AppText>
        </View>
      </View>

      {offer.message && (
        <AppText variant={Variant.body} style={styles.message}>
          {offer.message}
        </AppText>
      )}

      <View style={styles.buttonRow}>
        <AppButton
          text="Decline"
          onPress={() => handleDecline(offer.id)}
          bgColor={colors.grayE8 || '#E5E7EB'}
          textColor={colors.secondary}
          style={styles.button}
        />
        <AppButton
          text="Accept"
          onPress={() => handleAccept(offer.id)}
          bgColor={colors.primary}
          textColor={colors.white}
          style={styles.button}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Quick Search Offers" showTopIcons={false} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {offers.length === 0 ? (
          <View style={styles.emptyState}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={64}
              color={colors.gray}
            />
            <AppText variant={Variant.bodyMedium} style={styles.emptyText}>
              No Quick Search Offers
            </AppText>
            <AppText variant={Variant.body} style={styles.emptySubText}>
              You'll receive offers here when recruiters post quick search jobs that match your profile.
            </AppText>
          </View>
        ) : (
          offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ActiveOffers;

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
    marginBottom: hp(1.5),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  jobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    flex: 1,
  },
  matchBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 12,
    marginLeft: wp(2),
  },
  matchText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: getFontSize(12),
  },
  expiryText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: hp(1),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(4),
  },
  detailText: {
    color: colors.gray,
    marginLeft: wp(1),
    fontSize: getFontSize(12),
  },
  message: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    marginBottom: hp(1.5),
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  button: {
    flex: 1,
    marginHorizontal: wp(1),
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

