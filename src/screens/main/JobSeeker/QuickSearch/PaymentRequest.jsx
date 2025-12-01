import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import AppInputField from '@/core/AppInputField';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectActiveQuickJobById,
  requestPlatformPayment,
  verifyPaymentCode,
  updatePaymentAgreement,
} from '@/store/quickSearchSlice';
import { checkBalance, holdCoins } from '@/store/walletSlice';
import CodeSharing from '@/components/QuickSearch/CodeSharing';
import { calculateRequiredBalance, calculateCoverableHours, checkBalanceSufficiency } from '@/services/paymentService';
import AppDatePickerModal from '@/core/AppDatePickerModal';
import { screenNames } from '@/navigation/screenNames';

const PaymentRequest = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  const recruiterBalance = useSelector(state => state.wallet?.coins || 0);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(activeJob?.timer?.hourlyRate || activeJob?.salaryMin || 0);
  const [expectedHours, setExpectedHours] = useState(8);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [balanceCheck, setBalanceCheck] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(false);
  const [rechargeRequestSent, setRechargeRequestSent] = useState(false);

  useEffect(() => {
    if (activeJob?.payment?.codeGenerated && !activeJob?.payment?.codeVerified) {
      setShowCodeInput(true);
    }
    // Initialize times from job if available
    if (activeJob && !startTime) {
      const jobStart = activeJob.jobStartDate ? new Date(activeJob.jobStartDate) : new Date();
      setStartTime(jobStart);
      const jobEnd = activeJob.jobEndDate ? new Date(activeJob.jobEndDate) : new Date();
      setEndTime(jobEnd);
    }
  }, [activeJob]);

  const calculateRequiredBalanceAmount = () => {
    return calculateRequiredBalance(hourlyRate, expectedHours);
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    
    if (method === 'platform') {
      setShowAgreementForm(true);
      // Check balance after showing form
      checkRecruiterBalance();
    }
  };

  const checkRecruiterBalance = () => {
    const required = calculateRequiredBalanceAmount();
    const balanceResult = checkBalanceSufficiency(recruiterBalance, required, hourlyRate);
    setBalanceCheck(balanceResult);
    return balanceResult;
  };

  const handleAgreementSubmit = () => {
    // Update agreement details in Redux
    dispatch(updatePaymentAgreement({
      jobId: activeJob.id,
      hourlyRate,
      expectedHours,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    }));

    // Check balance with updated values
    const balanceResult = checkRecruiterBalance();
      
    if (!balanceResult.hasSufficientBalance) {
      // Show low balance warning with hours coverage
      const coverableHours = balanceResult.coverableHours || 0;
        Alert.alert(
          'Insufficient Balance',
        `Recruiter has insufficient balance.\n\nRequired: $${balanceResult.requiredBalance.toFixed(2)}\nAvailable: $${balanceResult.availableBalance.toFixed(2)}\n\nThis balance only covers approximately ${coverableHours} hours for this role today.`,
          [
          { text: 'Cancel', onPress: () => setShowAgreementForm(false) },
          { text: 'Acknowledge & Continue Anyway', onPress: () => proceedWithLowBalance() },
            { text: 'Request Recharge', onPress: () => requestRecharge() },
          ]
        );
      } else {
        proceedWithPlatformPayment();
    }
  };

  const proceedWithPlatformPayment = () => {
    // Request platform payment with agreement details
    dispatch(requestPlatformPayment({ 
      jobId: activeJob.id, 
      requestedBy: 'jobseeker',
      agreementDetails: {
        hourlyRate,
        expectedHours,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }
    }));
    
    Alert.alert(
      'Payment Request Sent',
      'Recruiter will receive a code to share with you. Once shared, you can verify and start the timer.',
      [{ text: 'OK' }]
    );
  };

  const proceedWithLowBalance = () => {
    Alert.alert(
      'Acknowledge & Continue Anyway',
      'You understand that:\n\n• The recruiter has insufficient balance\n• The platform will NOT be liable for payment beyond the available balance\n• It is your responsibility to handle payment after the balance runs out\n\nDo you want to continue?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setShowAgreementForm(false) },
        { 
          text: 'Acknowledge & Continue', 
          onPress: () => {
          dispatch(requestPlatformPayment({ 
            jobId: activeJob.id, 
              requestedBy: 'jobseeker',
              agreementDetails: {
                hourlyRate,
                expectedHours,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
              },
              lowBalanceAcknowledged: true,
            }));
            Alert.alert(
              'Acknowledged',
              'Payment request sent. You can start the timer once the code is verified.',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };

  const requestRecharge = () => {
    setRechargeRequestSent(true);
    Alert.alert(
      'Recharge Request Sent',
      'A request has been sent to the recruiter to recharge their account. They have 5-10 minutes to recharge.',
      [{ text: 'OK' }]
    );
    
    // In real app, send notification to recruiter
    // Simulate recharge timeout after 5-10 minutes
    setTimeout(() => {
      Alert.alert(
        'Recharge Status',
        'Recruiter has not recharged within the timeframe. You can choose to acknowledge and continue or decline.',
        [
          { text: 'Acknowledge & Continue Anyway', onPress: () => proceedWithLowBalance() },
          { text: 'Decline', style: 'destructive', onPress: () => {
            setShowAgreementForm(false);
            setPaymentMethod(null);
            navigation.goBack();
          }},
        ]
      );
    }, 600000); // 10 minutes
  };

  const handleVerifyCode = (code) => {
    dispatch(verifyPaymentCode({ jobId: activeJob.id, code }));
    
    // Check verification status after a short delay
    setTimeout(() => {
      const state = store.getState();
      const updatedJob = state.quickSearch?.activeJobs?.find(j => j.id === activeJob.id);
      const payment = updatedJob?.payment || activeJob.payment || {};
      
      if (payment.codeVerified) {
        // Hold coins based on agreement
        const agreementDetails = payment.agreementDetails || {};
        const hourlyRate = agreementDetails.hourlyRate || activeJob.timer?.hourlyRate || activeJob.salaryMin || 0;
        const expectedHours = agreementDetails.expectedHours || 8;
        const required = calculateRequiredBalance(hourlyRate, expectedHours);
        
      dispatch(holdCoins({ 
        amount: required, 
        jobId: activeJob.id,
        reason: 'Quick search job payment'
      }));
      
      Alert.alert(
        'Code Verified!',
        'Payment setup complete. You can now start the timer.',
        [
          { 
            text: 'Start Timer', 
            onPress: () => navigation.navigate(screenNames.TIMER_CONTROL, { jobId: activeJob.id })
          }
        ]
      );
      } else {
        Alert.alert('Invalid Code', 'The code you entered is incorrect or has expired.');
    }
    }, 100);
  };

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

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Method" showTopIcons={false} />
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
        </View>

        {/* Payment Method Selection */}
        {!paymentMethod && !payment.requested && (
          <View style={styles.section}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Select Payment Method
            </AppText>
            
            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => handleSelectPaymentMethod('platform')}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="card"
                size={24}
                color={colors.primary}
              />
              <View style={styles.methodInfo}>
                <AppText variant={Variant.bodyMedium} style={styles.methodTitle}>
                  Platform Payment
                </AppText>
                <AppText variant={Variant.caption} style={styles.methodDescription}>
                  SquadGoo will handle the payment securely
                </AppText>
              </View>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chevron-forward"
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => handleSelectPaymentMethod('direct')}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="cash-outline"
                size={24}
                color={colors.primary}
              />
              <View style={styles.methodInfo}>
                <AppText variant={Variant.bodyMedium} style={styles.methodTitle}>
                  Direct Payment
                </AppText>
                <AppText variant={Variant.caption} style={styles.methodDescription}>
                  Handle payment directly with recruiter
                </AppText>
              </View>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chevron-forward"
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Agreement Details Form */}
        {paymentMethod === 'platform' && showAgreementForm && !payment.codeGenerated && (
          <View style={styles.section}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Payment Agreement Details
            </AppText>
            <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
              Review and edit the payment details. Recruiter will be notified of any changes.
            </AppText>
            
            {/* Hourly Rate */}
            <View style={styles.formRow}>
              <AppText variant={Variant.body} style={styles.label}>
                Hourly Rate ($)
              </AppText>
              <TextInput
                style={styles.input}
                value={hourlyRate.toString()}
                onChangeText={(text) => {
                  const num = parseFloat(text) || 0;
                  setHourlyRate(num);
                  if (num > 0) {
                    checkRecruiterBalance();
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter hourly rate"
              />
            </View>
            
            {/* Expected Hours */}
            <View style={styles.formRow}>
              <AppText variant={Variant.body} style={styles.label}>
                Expected Hours
              </AppText>
              <TextInput
                style={styles.input}
                value={expectedHours.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setExpectedHours(num);
                  if (num > 0) {
                    checkRecruiterBalance();
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter expected hours"
              />
            </View>
            
            {/* Start Time */}
            <View style={styles.formRow}>
              <AppText variant={Variant.body} style={styles.label}>
                Start Time
              </AppText>
              <AppDatePickerModal
                label=""
                value={startTime instanceof Date ? startTime : new Date(startTime)}
                onChange={(date) => setStartTime(date)}
                mode="time"
                placeholder="Select start time"
              />
            </View>
            
            {/* End Time */}
            <View style={styles.formRow}>
              <AppText variant={Variant.body} style={styles.label}>
                Finish Time
              </AppText>
              <AppDatePickerModal
                label=""
                value={endTime instanceof Date ? endTime : new Date(endTime)}
                onChange={(date) => setEndTime(date)}
                mode="time"
                placeholder="Select finish time"
              />
            </View>
            
            {/* Balance Info */}
            <View style={styles.balanceInfo}>
              <AppText variant={Variant.body} style={styles.balanceLabel}>
                Required Balance
              </AppText>
              <AppText variant={Variant.subTitle} style={styles.balanceValue}>
                ${calculateRequiredBalanceAmount().toFixed(2)}
              </AppText>
              {balanceCheck && (
                <>
                  <AppText variant={Variant.caption} style={styles.balanceDetail}>
                    Available: ${balanceCheck.availableBalance.toFixed(2)}
                  </AppText>
                  {!balanceCheck.hasSufficientBalance && (
                    <>
                <AppText variant={Variant.caption} style={styles.warningText}>
                  ⚠️ Recruiter has insufficient balance
                </AppText>
                      {balanceCheck.coverableHours > 0 && (
                        <AppText variant={Variant.caption} style={styles.warningText}>
                          Balance only covers approximately {balanceCheck.coverableHours} hours
                        </AppText>
                      )}
                    </>
                  )}
                </>
              )}
            </View>

            {/* Submit Agreement Button */}
            <AppButton
              text="Submit Agreement & Request Payment"
              onPress={handleAgreementSubmit}
              bgColor={colors.primary}
              textColor={colors.white}
              style={styles.submitButton}
            />
          </View>
        )}

        {/* Code Sharing - Job Seeker View (Input to verify) */}
        {payment.codeGenerated && !payment.codeVerified && (
          <View style={styles.section}>
            <CodeSharing
              code={payment.code}
              codeExpiry={payment.codeExpiry}
              onCodeVerified={handleVerifyCode}
              showNumeric={true}
              isRecruiter={false}
            />
          </View>
        )}

        {/* Direct Payment Info */}
        {paymentMethod === 'direct' && (
          <View style={styles.section}>
            <AppText variant={Variant.body} style={styles.infoText}>
              You have selected direct payment. Please coordinate with the recruiter to handle payment outside the platform.
            </AppText>
            <AppButton
              text="Continue"
              onPress={() => navigation.navigate(screenNames.TIMER_CONTROL, { jobId: activeJob.id })}
              bgColor={colors.primary}
              textColor={colors.white}
              style={styles.continueButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentRequest;

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
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  methodInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  methodTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  methodDescription: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  formRow: {
    marginBottom: hp(1.5),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(14),
  },
  balanceInfo: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 8,
    padding: wp(4),
    alignItems: 'center',
    marginTop: hp(2),
  },
  balanceLabel: {
    color: colors.gray,
    fontSize: getFontSize(14),
    marginBottom: hp(0.5),
  },
  balanceValue: {
    color: colors.primary,
    fontSize: getFontSize(24),
    fontWeight: 'bold',
  },
  warningText: {
    color: '#EF4444',
    fontSize: getFontSize(12),
    marginTop: hp(1),
  },
  infoText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    lineHeight: 20,
    marginBottom: hp(2),
  },
  continueButton: {
    marginTop: hp(1),
  },
  sectionSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(1.5),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: getFontSize(14),
    color: colors.secondary,
    marginTop: hp(0.5),
  },
  balanceDetail: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginTop: hp(0.5),
  },
  submitButton: {
    marginTop: hp(2),
  },
});

