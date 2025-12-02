import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, getFontSize, hp, wp } from '@/theme';
import {
  selectManualOffers,
  updateManualOfferStatus,
  expireManualOffers,
  selectManualJobById,
  initializeDummyData,
} from '@/store/manualOffersSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import FormField from '@/core/FormField';
import OfferCard from '@/components/Recruiter/Offers/OfferCard';
import { FormProvider, useForm } from 'react-hook-form';
import { screenNames } from '@/navigation/screenNames';

const tabs = [
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'declined', label: 'Declined' },
  { id: 'modification_requested', label: 'Modifications' },
  { id: 'expired', label: 'Expired' },
];

const DECLINE_REASONS = [
  { id: 'schedule', label: 'Schedule conflict', isValid: true },
  { id: 'rate', label: 'Rate too low', isValid: true },
  { id: 'other', label: 'Other / unsatisfactory', isValid: false },
];

const ManualOffers = ({ navigation }) => {
  const dispatch = useDispatch();
  const offers = useSelector(selectManualOffers);
  const [currentTab, setCurrentTab] = useState('pending');
  const [declineModal, setDeclineModal] = useState(null);
  const [modModal, setModModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    dispatch(initializeDummyData());
    dispatch(expireManualOffers());
  }, [dispatch]);

  const filteredOffers = useMemo(
    () => offers.filter(offer => offer.status === currentTab),
    [offers, currentTab],
  );

  const handleAccept = (offerId) => {
    dispatch(updateManualOfferStatus({
      offerId,
      status: 'accepted',
      response: { type: 'accepted' },
    }));
    showToast('Marked as accepted', 'Success', toastTypes.success);
  };

  const openDeclineModal = (offer) => {
    setDeclineModal(offer);
  };

  const openModificationModal = (offer) => {
    setModModal(offer);
  };

  const handleDeclineSubmit = ({ reasonId, note }) => {
    if (!declineModal) return;
    const reason = DECLINE_REASONS.find(r => r.id === reasonId);
    dispatch(updateManualOfferStatus({
      offerId: declineModal.id,
      status: 'declined',
      response: {
        type: 'declined',
        reason: {
          id: reasonId,
          label: reason?.label,
          isValid: reason?.isValid ?? true,
          note,
        },
      },
    }));
    showToast('Offer declined with reason', 'Success', toastTypes.success);
    setDeclineModal(null);
  };

  const handleModificationSubmit = ({ payRate, message }) => {
    if (!modModal) return;
    dispatch(updateManualOfferStatus({
      offerId: modModal.id,
      status: 'modification_requested',
      response: {
        type: 'modification',
        modification: {
          payRate,
          message,
        },
      },
    }));
    showToast('Modification captured', 'Success', toastTypes.success);
    setModModal(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
        return '#10B981';
      case 'declined':
        return '#EF4444';
      case 'modification_requested':
        return '#3B82F6';
      case 'expired':
        return '#6B7280';
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'accepted':
        return 'checkmark-circle';
      case 'declined':
        return 'close-circle';
      case 'modification_requested':
        return 'create-outline';
      case 'expired':
        return 'hourglass-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleViewProfile = (candidateId, jobId) => {
    navigation.navigate(screenNames.MANUAL_CANDIDATE_PROFILE, {
      jobId,
      candidateId,
    });
  };

  const renderOffer = ({ item }) => (
    <OfferCard
      mode="manual"
      candidateName={item.candidateName}
      jobTitle={item.jobTitle}
      status={item.status}
      matchPercentage={item.matchPercentage}
      acceptanceRating={item.acceptanceRating || 'Pending'}
      expiresLabel={formatDate(item.expiresAt)}
      message={item.message}
      response={item.response}
      candidateId={item.candidateId}
      jobId={item.jobId}
      onViewProfile={handleViewProfile}
      onPress={item.status === 'accepted' ? () => setDetailModal(item) : undefined}
      onAcceptModification={
        item.status === 'modification_requested'
          ? () => handleAccept(item.id)
          : undefined
      }
      onDeclineModification={
        item.status === 'modification_requested'
          ? () => openDeclineModal(item)
          : undefined
      }
    />
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Manual Offers"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, currentTab === tab.id && styles.tabActive]}
            onPress={() => setCurrentTab(tab.id)}
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
        renderItem={renderOffer}
        contentContainerStyle={[
          styles.list,
          filteredOffers.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="document-text-outline"
                size={64}
                color={colors.gray}
              />
            </View>
            <AppText variant={Variant.subTitle} style={styles.emptyTitle}>
              No Offers Found
            </AppText>
            <AppText variant={Variant.body} style={styles.emptyText}>
              No offers in this category yet. Check other tabs or create new offers.
            </AppText>
          </View>
        }
      />  
      </View>

      <DeclineModal
        visible={Boolean(declineModal)}
        onClose={() => setDeclineModal(null)}
        onSubmit={handleDeclineSubmit}
      />

      <ModificationModal
        visible={Boolean(modModal)}
        onClose={() => setModModal(null)}
        onSubmit={handleModificationSubmit}
      />

      <OfferDetailModal
        visible={Boolean(detailModal)}
        offer={detailModal}
        onClose={() => setDetailModal(null)}
      />
    </View>
  );
};

export default ManualOffers;

const DeclineModal = ({ visible, onClose, onSubmit }) => {
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      reasonId: DECLINE_REASONS[0].id,
      note: '',
    },
  });

  const handleSend = methods.handleSubmit(values => {
    onSubmit(values);
    methods.reset();
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <AppText variant={Variant.subTitle} style={styles.modalTitle}>
              Decline Reason
            </AppText>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <FormProvider {...methods}>
              <View style={styles.modalContent}>
                {DECLINE_REASONS.map(reason => (
                  <TouchableOpacity
                    key={reason.id}
                    style={[
                      styles.radioRow,
                      methods.watch('reasonId') === reason.id && styles.radioRowActive,
                    ]}
                    onPress={() => methods.setValue('reasonId', reason.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        methods.watch('reasonId') === reason.id && styles.radioOuterActive,
                      ]}
                    >
                      {methods.watch('reasonId') === reason.id ? <View style={styles.radioInner} /> : null}
                    </View>
                    <AppText 
                      variant={Variant.body} 
                      style={[
                        styles.radioLabel,
                        methods.watch('reasonId') === reason.id && styles.radioLabelActive,
                      ]}
                    >
                      {reason.label}
                    </AppText>
                  </TouchableOpacity>
                ))}
                <View style={styles.formFieldContainer}>
                  <FormField
                    name="note"
                    label="Notes (optional)"
                    multiline
                    placeholder="Add detail if needed"
                  />
                </View>
              </View>
            </FormProvider>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <AppText variant={Variant.bodyMedium} style={styles.modalCancelText}>
                Cancel
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <AppText variant={Variant.bodyMedium} style={styles.modalSubmitText}>
                Submit
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ModificationModal = ({ visible, onClose, onSubmit }) => {
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      payRate: '',
      message: '',
    },
  });

  const handleSend = methods.handleSubmit(values => {
    onSubmit(values);
    methods.reset();
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <AppText variant={Variant.subTitle} style={styles.modalTitle}>
              Modification Request
            </AppText>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FormProvider {...methods}>
              <View style={styles.modalContent}>
                <View style={styles.formFieldContainer}>
                  <FormField
                    name="payRate"
                    label="Requested pay rate"
                    placeholder="$35/hr"
                  />
                </View>
                <View style={styles.formFieldContainer}>
                  <FormField
                    name="message"
                    label="Message"
                    multiline
                    placeholder="Describe requested changes"
                  />
                </View>
              </View>
            </FormProvider>
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <AppText variant={Variant.bodyMedium} style={styles.modalCancelText}>
                Cancel
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <AppText variant={Variant.bodyMedium} style={styles.modalSubmitText}>
                Submit
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const OfferDetailModal = ({ visible, offer, onClose }) => {
  const job = useSelector(state => offer ? selectManualJobById(state, offer.jobId) : null);

  if (!offer) return null;

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailModalRow}>
      <AppText variant={Variant.caption} style={styles.detailModalLabel}>
        {label}
      </AppText>
      <AppText variant={Variant.bodyMedium} style={styles.detailModalValue}>
        {value || 'N/A'}
      </AppText>
    </View>
  );

  const SectionTitle = ({ title }) => (
    <AppText variant={Variant.bodyMedium} style={styles.detailModalSectionTitle}>
      {title}
    </AppText>
  );

  // Get agreed rate - use modification rate if exists, otherwise use original job rate
  const agreedRate = offer.response?.modification?.payRate 
    ? offer.response.modification.payRate 
    : job?.salaryRange || 'N/A';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.detailModalCard}>
          <View style={styles.modalHeader}>
            <AppText variant={Variant.subTitle} style={styles.modalTitle}>
              Offer Details
            </AppText>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.detailModalScroll}>
            {/* Candidate Information */}
            <SectionTitle title="Candidate Information" />
            <View style={styles.detailModalSection}>
              <DetailRow label="Name" value={offer.candidateName} />
              <DetailRow label="Match Percentage" value={`${offer.matchPercentage}%`} />
              <DetailRow label="Acceptance Rating" value={`${offer.acceptanceRating || 'N/A'}%`} />
            </View>

            {/* Job Information */}
            {job && (
              <>
                <SectionTitle title="Job Information" />
                <View style={styles.detailModalSection}>
                  <DetailRow label="Job Title" value={job.title} />
                  <DetailRow label="Job Type" value={job.type} />
                  <DetailRow label="Industry" value={job.industry} />
                  <DetailRow label="Location" value={job.location} />
                  {job.rangeKm && <DetailRow label="Range" value={`${job.rangeKm} km`} />}
                  <DetailRow label="Staff Needed" value={job.staffNumber} />
                  {job.experience && <DetailRow label="Experience Required" value={job.experience} />}
                </View>
              </>
            )}

            {/* Agreed Terms */}
            <SectionTitle title="Agreed Terms" />
            <View style={styles.detailModalSection}>
              <DetailRow label="Agreed Rate" value={agreedRate} />
              {job?.salaryType && <DetailRow label="Salary Type" value={job.salaryType} />}
              {job?.taxType && <DetailRow label="Tax Type" value={job.taxType} />}
              {offer.expiresAt && (
                <DetailRow 
                  label="Offer Expires" 
                  value={new Date(offer.expiresAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} 
                />
              )}
              {offer.createdAt && (
                <DetailRow 
                  label="Offer Created" 
                  value={new Date(offer.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} 
                />
              )}
            </View>

            {/* Extra Pay Information */}
            {job?.extraPay && Object.keys(job.extraPay).length > 0 && (
              <>
                <SectionTitle title="Extra Pay" />
                <View style={styles.detailModalSection}>
                  {job.extraPay.publicHolidays && <DetailRow label="Public Holidays" value="Yes" />}
                  {job.extraPay.weekend && <DetailRow label="Weekend" value="Yes" />}
                  {job.extraPay.shiftLoading && <DetailRow label="Shift Loading" value="Yes" />}
                  {job.extraPay.bonuses && <DetailRow label="Bonuses" value="Yes" />}
                  {job.extraPay.overtime && <DetailRow label="Overtime" value="Yes" />}
                </View>
              </>
            )}

            {/* Modification Request Details (if applicable) */}
            {offer.response?.modification && (
              <>
                <SectionTitle title="Modification Request" />
                <View style={styles.detailModalSection}>
                  <DetailRow label="Requested Pay Rate" value={offer.response.modification.payRate} />
                  {offer.response.modification.message && (
                    <View style={styles.detailModalRow}>
                      <AppText variant={Variant.caption} style={styles.detailModalLabel}>
                        Message:
                      </AppText>
                      <AppText variant={Variant.bodyMedium} style={styles.detailModalValue}>
                        {offer.response.modification.message}
                      </AppText>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Original Offer Message */}
            {offer.message && (
              <>
                <SectionTitle title="Original Offer Message" />
                <View style={styles.detailModalSection}>
                  <AppText variant={Variant.bodyMedium} style={styles.detailModalValue}>
                    {offer.message}
                  </AppText>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <AppText variant={Variant.bodyMedium} style={styles.modalSubmitText}>
                Close
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  list: {
    padding: wp(4),
    paddingBottom: hp(4),
    flexGrow: 0,
  },
  listContainer: {
    height: hp(70),
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
  responseBox: {
    backgroundColor: '#F9FAFB',
    padding: wp(3.5),
    borderRadius: hp(1.5),
    marginTop: hp(1.5),
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  responseTitle: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.secondary,
  },
  responseDetail: {
    marginTop: hp(0.8),
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
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: '#10B981',
    gap: wp(1.5),
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(5),
    maxHeight: hp(80),
  },
  modalTitle: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(2),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  modalContent: {
    gap: hp(2),
  },
  formFieldContainer: {
    marginBottom: hp(1),
  },
  modalActions: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(2),
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    padding: wp(3),
    borderRadius: hp(1.5),
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: hp(1),
  },
  radioRowActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    flex: 1,
    fontSize: getFontSize(14),
    color: colors.secondary,
  },
  radioLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  detailModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(5),
    maxHeight: hp(85),
    width: '100%',
  },
  detailModalScroll: {
    maxHeight: hp(60),
  },
  detailModalSection: {
    marginBottom: hp(2),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
    paddingVertical: hp(0.5),
  },
  detailModalLabel: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: colors.gray,
    flex: 1,
  },
  detailModalValue: {
    fontSize: getFontSize(14),
    color: colors.secondary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailModalSectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: colors.secondary,
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
});

