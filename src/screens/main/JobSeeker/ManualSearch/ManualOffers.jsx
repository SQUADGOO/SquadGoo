import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import AppInputField from '@/core/AppInputField';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectManualOffers, 
  selectManualJobById,
  updateManualOfferStatus,
  expireManualOffers 
} from '@/store/manualOffersSlice';
import { applyToOffer } from '@/store/jobSeekerOffersSlice';
import { addJob, updateJobStatus, addCandidateToJob } from '@/store/jobsSlice';
import { createChatSession } from '@/store/chatSlice';
import { revealContacts } from '@/store/contactRevealSlice';
import { addNotification } from '@/store/notificationsSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { screenNames } from '@/navigation/screenNames';
import CustomCheckBox from '@/core/CustomCheckBox';

const DECLINE_REASONS = [
  { id: 'salary', label: 'Salary too low', isValid: true },
  { id: 'location', label: 'Location too far', isValid: true },
  { id: 'schedule', label: 'Schedule conflict', isValid: true },
  { id: 'not_interested', label: 'Not interested in this role', isValid: true },
  { id: 'other', label: 'Other / unsatisfactory', isValid: false },
];

const ManualOffers = ({ navigation }) => {
  const dispatch = useDispatch();
  const allOffers = useSelector(selectManualOffers);
  const userInfo = useSelector(state => state?.auth?.userInfo || {});
  const manualJobs = useSelector(state => state?.manualOffers?.jobs || []);
  const [offers, setOffers] = useState([]);
  const [declineModal, setDeclineModal] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');

  // Get current job seeker's candidate ID and user ID
  const currentCandidateId = userInfo?.candidateId || userInfo?._id || 'js-001';
  const currentUserId = userInfo?._id || userInfo?.id || 'js-001';

  useEffect(() => {
    // Filter offers for current job seeker
    const myOffers = allOffers.filter(
      offer => offer.candidateId === currentCandidateId
    );
    setOffers(myOffers);

    // Expire old offers
    dispatch(expireManualOffers());
  }, [allOffers, dispatch, currentCandidateId]);

  const formatExpiryTime = (expiresAt) => {
    if (!expiresAt) return 'No expiry';
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handleAccept = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    Alert.alert(
      'Accept Offer',
      'Are you sure you want to accept this job offer? Once accepted, you\'ll be matched with the recruiter.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            // Update offer status
            dispatch(updateManualOfferStatus({
              offerId,
              status: 'accepted',
              response: { type: 'accepted' },
            }));

            // Get full job details and add to active jobs
            const job = manualJobs.find(j => j.id === offer.jobId);
            if (job) {
              // Create candidate object
              const candidate = {
                id: currentCandidateId,
                name: userInfo.name || (userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : 'Job Seeker'),
                email: userInfo.email || '',
                phone: userInfo.phone || '',
                experience: userInfo.experience || 'Not specified',
                location: userInfo.location || userInfo.address || 'Not specified',
                status: 'accepted', // Job seeker accepted
                appliedAt: new Date().toISOString(),
              };
              
              // Add candidate to recruiter's job with autoAccept flag
              dispatch(addCandidateToJob({ jobId: job.id, candidate, autoAccept: true }));
              
              // Update job status to matched (match making is complete)
              dispatch(updateJobStatus({ jobId: job.id, status: 'matched' }));
              
              // Add to job seeker's accepted offers
              dispatch(applyToOffer(job));
              
              // Create chat session (30 days expiration)
              const recruiterId = job.recruiterId || 'recruiter-001'; // In real app, get from job
              dispatch(createChatSession({
                jobId: job.id,
                userId: currentUserId,
                otherUserId: recruiterId,
                jobTitle: job.title || offer.jobTitle,
                searchType: 'manual',
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
                title: 'Offer Accepted',
                message: `${userInfo.name || 'A job seeker'} has accepted your offer for "${job.title || offer.jobTitle}"`,
                jobId: job.id,
                candidateId: currentCandidateId,
                userId: recruiterId,
              }));
            }

            showToast('Offer accepted successfully! Chat is now enabled.', 'Success', toastTypes.success);
            // Navigate to active jobs
            navigation.navigate(screenNames.ACTIVE_JOB_OFFERS);
          },
        },
      ]
    );
  };

  const openDeclineModal = (offer) => {
    setDeclineModal(offer);
    setSelectedReason(null);
    setOtherReason('');
  };

  const handleDecline = () => {
    if (!declineModal) return;

    // Check if reason is required (match >= 70%)
    const requiresReason = declineModal.matchPercentage >= 70;
    
    if (requiresReason && !selectedReason) {
      showToast('Please select a reason for declining', 'Warning', toastTypes.warning);
      return;
    }

    if (selectedReason === 'other' && !otherReason.trim()) {
      showToast('Please provide a reason', 'Warning', toastTypes.warning);
      return;
    }

    const reason = DECLINE_REASONS.find(r => r.id === selectedReason);
    dispatch(updateManualOfferStatus({
      offerId: declineModal.id,
      status: 'declined',
      response: {
        type: 'declined',
        reason: {
          id: selectedReason,
          label: reason?.label || 'Other',
          isValid: reason?.isValid ?? true,
          note: selectedReason === 'other' ? otherReason : '',
        },
      },
    }));
    
    showToast('Offer declined', 'Success', toastTypes.success);
    setDeclineModal(null);
    setSelectedReason(null);
    setOtherReason('');
  };

  const pendingOffers = useMemo(() => 
    offers.filter(offer => offer.status === 'pending'),
    [offers]
  );

  const OfferCard = ({ offer, job }) => {
    const isExpiringSoon = () => {
      if (!offer.expiresAt) return false;
      const expiry = new Date(offer.expiresAt);
      const now = new Date();
      const diffHours = (expiry - now) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 24;
    };

    const handleCardPress = () => {
      // Get full job details from store
      navigation.navigate(screenNames.JOB_OFFER_DETAILS, { 
        job: job ? { ...job, searchType: 'manual', offerId: offer.id } : { ...offer, searchType: 'manual' },
        offerId: offer.id 
      });
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <AppText variant={Variant.subTitle} style={styles.jobTitle}>
                {offer.jobTitle || 'Job Offer'}
              </AppText>
              <View style={[styles.matchBadge, offer.matchPercentage >= 70 && styles.matchBadgeHigh]}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark-circle"
                  size={14}
                  color={colors.white}
                />
                <AppText variant={Variant.caption} style={styles.matchText}>
                  {Math.round(offer.matchPercentage)}% Match
                </AppText>
              </View>
            </View>
          </View>
          
          <View style={styles.expiryRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={16}
              color={isExpiringSoon() ? '#EF4444' : colors.gray}
            />
            <AppText 
              variant={Variant.caption} 
              style={[styles.expiryText, isExpiringSoon() && styles.expiryTextUrgent]}
            >
              {formatExpiryTime(offer.expiresAt)}
            </AppText>
          </View>
        </View>

        {/* Message Section */}
        {offer.message && (
          <View style={styles.messageContainer}>
            <AppText variant={Variant.body} style={styles.message}>
              {offer.message}
            </AppText>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={(e) => {
              e.stopPropagation();
              openDeclineModal(offer);
            }}
            activeOpacity={0.8}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="close-circle"
              size={18}
              color="#EF4444"
            />
            <AppText variant={Variant.bodyMedium} style={styles.declineButtonText}>
              Decline
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={(e) => {
              e.stopPropagation();
              handleAccept(offer.id);
            }}
            activeOpacity={0.8}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark-circle"
              size={18}
              color={colors.white}
            />
            <AppText variant={Variant.bodyMedium} style={styles.acceptButtonText}>
              Accept
            </AppText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Manual Job Offers" showTopIcons={false} />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pendingOffers.length === 0 ? (
          <View style={styles.emptyState}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={64}
              color={colors.gray}
            />
            <AppText variant={Variant.bodyMedium} style={styles.emptyText}>
              No Manual Offers
            </AppText>
            <AppText variant={Variant.body} style={styles.emptySubText}>
              You'll receive manual job offers here when recruiters send you personalized job opportunities.
            </AppText>
          </View>
        ) : (
          <>
            <View style={styles.headerInfo}>
              <AppText variant={Variant.bodyMedium} style={styles.headerText}>
                {pendingOffers.length} {pendingOffers.length === 1 ? 'offer' : 'offers'} pending
              </AppText>
            </View>
            {pendingOffers.map(offer => {
              const job = manualJobs.find(j => j.id === offer.jobId);
              return <OfferCard key={offer.id} offer={offer} job={job} />;
            })}
          </>
        )}
      </ScrollView>

      {/* Decline Reason Modal */}
      <Modal
        visible={declineModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setDeclineModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant={Variant.h2} style={styles.modalTitle}>
                Decline Offer
              </AppText>
              <TouchableOpacity
                onPress={() => setDeclineModal(null)}
                style={styles.closeButton}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="close"
                  size={24}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>

            {declineModal && declineModal.matchPercentage >= 70 && (
              <View style={styles.reasonRequiredNote}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="information-circle"
                  size={20}
                  color="#F59E0B"
                />
                <AppText variant={Variant.caption} style={styles.reasonRequiredText}>
                  This offer has a {Math.round(declineModal.matchPercentage)}% match. Please provide a reason for declining.
                </AppText>
              </View>
            )}

            <ScrollView style={styles.reasonsList}>
              {DECLINE_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason.id && styles.reasonItemSelected,
                  ]}
                  onPress={() => setSelectedReason(reason.id)}
                  activeOpacity={0.7}
                >
                  <CustomCheckBox
                    checked={selectedReason === reason.id}
                    onPress={() => setSelectedReason(reason.id)}
                  />
                  <AppText variant={Variant.bodyMedium} style={styles.reasonText}>
                    {reason.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedReason === 'other' && (
              <View style={styles.otherReasonContainer}>
                <AppInputField
                  placeholder="Please provide a reason..."
                  value={otherReason}
                  onChangeText={setOtherReason}
                  multiline
                  style={styles.otherReasonInput}
                />
              </View>
            )}

            <View style={styles.modalButtonRow}>
              <AppButton
                text="Cancel"
                onPress={() => setDeclineModal(null)}
                bgColor={colors.grayE8 || '#E5E7EB'}
                textColor={colors.secondary}
                style={styles.modalButton}
              />
              <AppButton
                text="Decline Offer"
                onPress={handleDecline}
                bgColor="#EF4444"
                textColor={colors.white}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManualOffers;

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
  headerInfo: {
    marginBottom: hp(2),
  },
  headerText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: getFontSize(16),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    marginBottom: hp(1.5),
  },
  titleRow: {
    marginBottom: hp(1),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  jobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    flex: 1,
    marginRight: wp(2),
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    gap: wp(1.5),
  },
  matchBadgeHigh: {
    backgroundColor: '#10B981',
  },
  matchText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: getFontSize(12),
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
    gap: wp(1.5),
  },
  expiryText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  expiryTextUrgent: {
    color: '#EF4444',
    fontWeight: '600',
  },
  messageContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: wp(3),
    marginBottom: hp(1.5),
  },
  message: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
    gap: wp(2),
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: 12,
    gap: wp(2),
  },
  declineButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  declineButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: getFontSize(14),
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  acceptButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: getFontSize(14),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: wp(4),
    maxHeight: hp(80),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    color: colors.secondary,
    fontSize: getFontSize(20),
    fontWeight: 'bold',
  },
  closeButton: {
    padding: wp(2),
  },
  reasonRequiredNote: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(2),
    gap: wp(2),
    alignItems: 'center',
  },
  reasonRequiredText: {
    color: '#92400E',
    fontSize: getFontSize(13),
    flex: 1,
    lineHeight: 18,
  },
  reasonsList: {
    maxHeight: hp(30),
    marginBottom: hp(2),
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(1),
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reasonItemSelected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  reasonText: {
    color: colors.secondary,
    marginLeft: wp(2),
    fontSize: getFontSize(14),
  },
  otherReasonContainer: {
    marginBottom: hp(2),
  },
  otherReasonInput: {
    minHeight: hp(10),
    textAlignVertical: 'top',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(1),
  },
  modalButton: {
    flex: 1,
  },
});

