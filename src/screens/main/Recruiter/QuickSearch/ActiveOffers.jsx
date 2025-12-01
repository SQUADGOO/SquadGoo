import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectQuickOffers,
  cancelOffer,
  expireQuickOffers,
} from '@/store/quickSearchSlice';
import { resendOfferToNextMatch } from '@/services/autoOfferService';
import { sendQuickOffer } from '@/store/quickSearchSlice';

const ActiveOffers = ({ navigation }) => {
  const dispatch = useDispatch();
  const allOffers = useSelector(selectQuickOffers);
  const quickJobs = useSelector(state => state.quickSearch.quickJobs);
  const matchesByJobId = useSelector(state => state.quickSearch.matchesByJobId);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Filter offers sent by current recruiter
    // In real app, filter by current user ID
    const recruiterOffers = allOffers.filter(
      offer => ['pending', 'accepted', 'declined'].includes(offer.status)
    );
    setOffers(recruiterOffers);

    // Expire old offers
    dispatch(expireQuickOffers());
  }, [allOffers, dispatch]);

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

  const getStatusColor = (status) => {
    const colorsMap = {
      pending: colors.primary,
      accepted: '#10B981',
      declined: '#EF4444',
      expired: colors.gray,
      cancelled: colors.gray,
    };
    return colorsMap[status] || colors.gray;
  };

  const OfferCard = ({ offer }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <AppText variant={Variant.subTitle} style={styles.candidateName}>
            {offer.candidateName}
          </AppText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(offer.status) + '20' }]}>
            <AppText variant={Variant.caption} style={[styles.statusText, { color: getStatusColor(offer.status) }]}>
              {offer.status.toUpperCase()}
            </AppText>
          </View>
        </View>
        <AppText variant={Variant.caption} style={styles.expiryText}>
          {formatExpiryTime(offer.expiresAt)}
        </AppText>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <AppText variant={Variant.caption} style={styles.detailLabel}>
            Job:
          </AppText>
          <AppText variant={Variant.body} style={styles.detailValue}>
            {offer.jobTitle}
          </AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText variant={Variant.caption} style={styles.detailLabel}>
            Match:
          </AppText>
          <AppText variant={Variant.body} style={styles.matchValue}>
            {Math.round(offer.matchPercentage)}%
          </AppText>
        </View>
      </View>

      {offer.message && (
        <AppText variant={Variant.body} style={styles.message}>
          {offer.message}
        </AppText>
      )}

      {offer.autoSent && (
        <View style={styles.autoBadge}>
          <AppText variant={Variant.caption} style={styles.autoText}>
            🤖 Auto-sent
          </AppText>
        </View>
      )}

      <View style={styles.buttonRow}>
        {offer.status === 'pending' && (
          <>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(offer.id)}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close-circle-outline"
                size={18}
                color="#EF4444"
              />
              <AppText variant={Variant.bodyMedium} style={styles.cancelText}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </>
        )}
        {(offer.status === 'declined' || offer.status === 'expired') && (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => handleResend(offer)}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="refresh-outline"
              size={18}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.resendText}>
              Resend to Next Match
            </AppText>
          </TouchableOpacity>
        )}
        {offer.status === 'accepted' && (
          <View style={styles.acceptedBadge}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark-circle"
              size={18}
              color="#10B981"
            />
            <AppText variant={Variant.bodyMedium} style={styles.acceptedText}>
              Offer Accepted
            </AppText>
          </View>
        )}
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
              iconName="send-outline"
              size={64}
              color={colors.gray}
            />
            <AppText variant={Variant.bodyMedium} style={styles.emptyText}>
              No Offers Sent
            </AppText>
            <AppText variant={Variant.body} style={styles.emptySubText}>
              Your sent quick search offers will appear here.
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
  candidateName: {
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
    fontWeight: '600',
    fontSize: getFontSize(11),
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
    flex: 1,
    marginRight: wp(2),
  },
  detailLabel: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(0.3),
  },
  detailValue: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  matchValue: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: 'bold',
  },
  message: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    marginBottom: hp(1),
    lineHeight: 20,
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
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp(1),
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  cancelText: {
    color: '#EF4444',
    marginLeft: wp(2),
    fontWeight: '600',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  resendText: {
    color: colors.primary,
    marginLeft: wp(2),
    fontWeight: '600',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  acceptedText: {
    color: '#065F46',
    marginLeft: wp(2),
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

