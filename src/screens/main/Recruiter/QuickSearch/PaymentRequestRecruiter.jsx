import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectActiveQuickJobById,
  requestPlatformPayment,
  updatePaymentAgreement,
} from '@/store/quickSearchSlice';
import CodeSharing from '@/components/QuickSearch/CodeSharing';
import { screenNames } from '@/navigation/screenNames';

const PaymentRequestRecruiter = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  
  const [showCodeDisplay, setShowCodeDisplay] = useState(false);

  useEffect(() => {
    // Show code display if code is generated
    if (activeJob?.payment?.codeGenerated && activeJob?.payment?.requestedBy === 'jobseeker') {
      setShowCodeDisplay(true);
    }
  }, [activeJob]);

  if (!activeJob) {
    return (
      <View style={styles.container}>
        <AppHeader title="Payment Request" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.body} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    );
  }

  const payment = activeJob.payment || {};
  const agreementDetails = payment.agreementDetails || {};

  const handleRequestPlatformPayment = () => {
    Alert.alert(
      'Request Platform Payment',
      'Do you want to request platform payment handling for this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () => {
            dispatch(requestPlatformPayment({
              jobId: activeJob.id,
              requestedBy: 'recruiter',
              agreementDetails: {
                hourlyRate: agreementDetails.hourlyRate || activeJob.timer?.hourlyRate || activeJob.salaryMin || 0,
                expectedHours: agreementDetails.expectedHours || 8,
                startTime: agreementDetails.startTime || new Date().toISOString(),
                endTime: agreementDetails.endTime || new Date().toISOString(),
              },
            }));
            
            Alert.alert(
              'Payment Request Sent',
              'A code has been generated. Share this code with the job seeker to confirm platform payment.',
              [{ text: 'OK' }]
            );
            setShowCodeDisplay(true);
          },
        },
      ]
    );
  };

  const handleAcceptAgreementChanges = () => {
    if (agreementDetails) {
      Alert.alert(
        'Agreement Accepted',
        'You have accepted the payment agreement details. Share the code with the job seeker.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRequestChanges = () => {
    Alert.alert(
      'Request Changes',
      'You can request changes to the agreement details. This will notify the job seeker.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Changes',
          onPress: () => {
            // In a real app, this would send a notification to job seeker
            Alert.alert(
              'Change Request Sent',
              'The job seeker has been notified to review and update the agreement details.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Request" showTopIcons={false} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Job Info */}
        <View style={styles.jobInfo}>
          <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>
            {activeJob.jobTitle}
          </AppText>
          <AppText variant={Variant.caption} style={styles.jobSubtitle}>
            Job Seeker: {activeJob.candidateName || 'Unknown'}
          </AppText>
        </View>

        {/* Payment Request Status */}
        {payment.requested && (
          <View style={styles.statusCard}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={payment.requestedBy === 'jobseeker' ? 'person-outline' : 'business-outline'}
              size={24}
              color={colors.primary}
            />
            <View style={styles.statusInfo}>
              <AppText variant={Variant.bodyMedium} style={styles.statusTitle}>
                Payment Request {payment.requestedBy === 'jobseeker' ? 'from Job Seeker' : 'by You'}
              </AppText>
              <AppText variant={Variant.caption} style={styles.statusText}>
                {payment.codeGenerated ? 'Code generated. Share with job seeker.' : 'Waiting for code generation...'}
              </AppText>
            </View>
          </View>
        )}

        {/* Agreement Details Review */}
        {agreementDetails && Object.keys(agreementDetails).length > 0 && payment.requestedBy === 'jobseeker' && (
          <View style={styles.section}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Agreement Details
            </AppText>
            <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
              Review the payment details provided by the job seeker
            </AppText>

            <View style={styles.agreementCard}>
              <View style={styles.agreementRow}>
                <AppText variant={Variant.body} style={styles.agreementLabel}>
                  Hourly Rate:
                </AppText>
                <AppText variant={Variant.bodyMedium} style={styles.agreementValue}>
                  ${agreementDetails.hourlyRate || '0'}
                </AppText>
              </View>

              <View style={styles.agreementRow}>
                <AppText variant={Variant.body} style={styles.agreementLabel}>
                  Expected Hours:
                </AppText>
                <AppText variant={Variant.bodyMedium} style={styles.agreementValue}>
                  {agreementDetails.expectedHours || '0'} hours
                </AppText>
              </View>

              {agreementDetails.startTime && (
                <View style={styles.agreementRow}>
                  <AppText variant={Variant.body} style={styles.agreementLabel}>
                    Start Time:
                  </AppText>
                  <AppText variant={Variant.bodyMedium} style={styles.agreementValue}>
                    {new Date(agreementDetails.startTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </AppText>
                </View>
              )}

              {agreementDetails.endTime && (
                <View style={styles.agreementRow}>
                  <AppText variant={Variant.body} style={styles.agreementLabel}>
                    Finish Time:
                  </AppText>
                  <AppText variant={Variant.bodyMedium} style={styles.agreementValue}>
                    {new Date(agreementDetails.endTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </AppText>
                </View>
              )}

              {/* Action Buttons */}
              {!payment.codeShared && (
                <View style={styles.actionButtons}>
                  <AppButton
                    text="Accept & Share Code"
                    onPress={handleAcceptAgreementChanges}
                    bgColor={colors.primary}
                    textColor={colors.white}
                    style={styles.actionButton}
                  />
                  <AppButton
                    text="Request Changes"
                    onPress={handleRequestChanges}
                    bgColor={colors.grayE8 || '#E5E7EB'}
                    textColor={colors.secondary}
                    style={styles.actionButton}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Code Display - Recruiter View */}
        {payment.codeGenerated && showCodeDisplay && (
          <View style={styles.section}>
            <CodeSharing
              code={payment.code}
              codeExpiry={payment.codeExpiry}
              showNumeric={true}
              isRecruiter={true}
            />
            <AppText variant={Variant.caption} style={styles.codeHint}>
              Share this code with the job seeker. They will enter it to verify and start the timer.
            </AppText>
          </View>
        )}

        {/* Request Payment Button - If not yet requested */}
        {!payment.requested && (
          <View style={styles.section}>
            <AppButton
              text="Request Platform Payment"
              onPress={handleRequestPlatformPayment}
              bgColor={colors.primary}
              textColor={colors.white}
              style={styles.requestButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentRequestRecruiter;

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
  jobInfo: {
    marginBottom: hp(2),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  jobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  jobSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
  },
  statusInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  statusTitle: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  statusText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  sectionSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(2),
  },
  agreementCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  agreementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  agreementLabel: {
    color: colors.gray,
    fontSize: getFontSize(14),
  },
  agreementValue: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: hp(2),
    gap: hp(1),
  },
  actionButton: {
    marginBottom: hp(1),
  },
  codeHint: {
    color: colors.gray,
    fontSize: getFontSize(12),
    textAlign: 'center',
    marginTop: hp(1),
    fontStyle: 'italic',
  },
  requestButton: {
    marginTop: hp(1),
  },
});

