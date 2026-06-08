import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectActiveQuickJobById,
  selectCompletedQuickJobs,
} from '@/store/quickSearchSlice';
import { generateInvoice, sendInvoice } from '@/services/invoiceService';
import { generatePaymentProof, requestPaymentProof } from '@/services/paymentProofService';
import { screenNames } from '@/navigation/screenNames';

const JobComplete = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  const completedJob = useSelector(state => 
    state.quickSearch.completedJobs.find(j => j.id === jobId)
  );
  
  const job = completedJob || activeJob;
  const [invoiceSent, setInvoiceSent] = useState(false);
  const [paymentProofRequested, setPaymentProofRequested] = useState(false);

  if (!job) {
    return (
      <View style={styles.container}>
        <AppHeader title="Job Complete" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.body} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    );
  }

  const timer = job.timer || {};
  const payment = job.payment || {};
  const isABN = job.taxType === 'ABN' || job.taxType === 'both';

  const handleSendInvoice = async () => {
    if (!isABN) {
      Alert.alert('Not Applicable', 'Invoices are only for ABN contractors.');
      return;
    }

    try {
      await sendInvoice(job.id, {
        jobTitle: job.jobTitle,
        hours: (timer.elapsedTime || 0) / 3600,
        hourlyRate: timer.hourlyRate || 0,
        totalAmount: timer.totalCost || 0,
      });
      setInvoiceSent(true);
      Alert.alert('Success', 'Invoice sent to recruiter successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send invoice. Please try again.');
    }
  };

  const handleRequestPaymentProof = async () => {
    if (payment.method === 'platform') {
      // Generate payment proof
      try {
        const proof = await generatePaymentProof(job.id);
        Alert.alert(
          'Payment Proof Generated',
          'Your payment proof has been generated and saved.',
          [
            { text: 'View Proof', onPress: () => {
              // Navigate to proof view
            }},
            { text: 'OK' },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to generate payment proof.');
      }
    } else {
      // Request proof from recruiter
      try {
        await requestPaymentProof(job.id);
        setPaymentProofRequested(true);
        Alert.alert('Request Sent', 'Payment proof request sent to recruiter.');
      } catch (error) {
        Alert.alert('Error', 'Failed to request payment proof.');
      }
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Job Complete" showTopIcons={false} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Message */}
        <View style={styles.successContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="checkmark-circle"
            size={64}
            color="#10B981"
          />
          <AppText variant={Variant.subTitle} style={styles.successTitle}>
            Job Completed Successfully!
          </AppText>
          <AppText variant={Variant.body} style={styles.successText}>
            {job.jobTitle}
          </AppText>
        </View>

        {/* Job Summary */}
        <View style={styles.summaryCard}>
          <AppText variant={Variant.bodyMedium} style={styles.summaryTitle}>
            Job Summary
          </AppText>
          
          <View style={styles.summaryRow}>
            <AppText variant={Variant.body} style={styles.summaryLabel}>
              Total Time:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.summaryValue}>
              {formatTime(timer.elapsedTime || 0)}
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <AppText variant={Variant.body} style={styles.summaryLabel}>
              Hourly Rate:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.summaryValue}>
              ${(timer.hourlyRate || 0).toFixed(2)}/hr
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <AppText variant={Variant.body} style={styles.summaryLabel}>
              Total Amount:
            </AppText>
            <AppText variant={Variant.subTitle} style={styles.totalAmount}>
              ${(timer.totalCost || 0).toFixed(2)}
            </AppText>
          </View>

          {payment.method === 'platform' && (
            <View style={styles.paymentInfo}>
              <AppText variant={Variant.caption} style={styles.paymentInfoText}>
                💰 Payment will be available in your wallet after 7-day hold period
              </AppText>
            </View>
          )}
        </View>

        {/* Invoice Section (ABN only) */}
        {isABN && (
          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="document-text-outline"
                size={24}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.actionTitle}>
                Send Invoice
              </AppText>
            </View>
            <AppText variant={Variant.caption} style={styles.actionDescription}>
              Send invoice to recruiter for this completed job.
            </AppText>
            {invoiceSent ? (
              <View style={styles.completedBadge}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark-circle"
                  size={20}
                  color="#10B981"
                />
                <AppText variant={Variant.caption} style={styles.completedText}>
                  Invoice sent
                </AppText>
              </View>
            ) : (
              <AppButton
                text="Send Invoice Now"
                onPress={handleSendInvoice}
                bgColor={colors.primary}
                textColor={colors.white}
                style={styles.actionButton}
              />
            )}
          </View>
        )}

        {/* Payment Proof Section */}
        <View style={styles.actionCard}>
          <View style={styles.actionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="receipt-outline"
              size={24}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.actionTitle}>
              Payment Proof
            </AppText>
          </View>
          <AppText variant={Variant.caption} style={styles.actionDescription}>
            {payment.method === 'platform' 
              ? 'Generate payment transaction proof.'
              : 'Request payment proof from recruiter.'}
          </AppText>
          {paymentProofRequested ? (
            <View style={styles.completedBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="checkmark-circle"
                size={20}
                color="#10B981"
              />
              <AppText variant={Variant.caption} style={styles.completedText}>
                {payment.method === 'platform' ? 'Proof generated' : 'Request sent'}
              </AppText>
            </View>
          ) : (
            <AppButton
              text={payment.method === 'platform' ? 'Generate Proof' : 'Request Proof'}
              onPress={handleRequestPaymentProof}
              bgColor={colors.primary}
              textColor={colors.white}
              style={styles.actionButton}
            />
          )}
        </View>

        {/* Done Button */}
        <AppButton
          text="Done"
          onPress={() => navigation.navigate(screenNames.QUICK_SEARCH_ACTIVE_JOBS_JS)}
          bgColor={colors.grayE8 || '#E5E7EB'}
          textColor={colors.secondary}
          style={styles.doneButton}
        />
      </ScrollView>
    </View>
  );
};

export default JobComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(4),
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.gray,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
    paddingVertical: hp(3),
  },
  successTitle: {
    color: '#10B981',
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    marginTop: hp(1.5),
    marginBottom: hp(0.5),
  },
  successText: {
    color: colors.gray,
    fontSize: getFontSize(14),
  },
  summaryCard: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
  },
  summaryTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  summaryLabel: {
    color: colors.gray,
    fontSize: getFontSize(14),
  },
  summaryValue: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  totalAmount: {
    color: colors.primary,
    fontSize: getFontSize(20),
    fontWeight: 'bold',
  },
  paymentInfo: {
    marginTop: hp(1.5),
    padding: wp(3),
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  paymentInfoText: {
    color: colors.gray,
    fontSize: getFontSize(12),
    lineHeight: 16,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  actionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginLeft: wp(2),
  },
  actionDescription: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(1.5),
    lineHeight: 16,
  },
  actionButton: {
    marginTop: hp(0.5),
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: wp(3),
    borderRadius: 8,
    marginTop: hp(1),
  },
  completedText: {
    color: '#065F46',
    fontSize: getFontSize(12),
    fontWeight: '600',
    marginLeft: wp(2),
  },
  doneButton: {
    marginTop: hp(2),
  },
});

