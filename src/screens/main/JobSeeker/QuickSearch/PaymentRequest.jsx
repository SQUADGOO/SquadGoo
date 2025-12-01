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
  verifyPaymentCode,
} from '@/store/quickSearchSlice';
import { checkBalance, holdCoins } from '@/store/walletSlice';
import CodeSharing from '@/components/QuickSearch/CodeSharing';
import { screenNames } from '@/navigation/screenNames';

const PaymentRequest = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  const recruiterBalance = useSelector(state => state.wallet?.coins || 0);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(activeJob?.timer?.hourlyRate || 0);
  const [expectedHours, setExpectedHours] = useState(8);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [balanceCheck, setBalanceCheck] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    if (activeJob?.payment?.codeGenerated && !activeJob?.payment?.codeVerified) {
      setShowCodeInput(true);
    }
  }, [activeJob]);

  const calculateRequiredBalance = () => {
    return hourlyRate * expectedHours;
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    
    if (method === 'platform') {
      // Check balance
      const required = calculateRequiredBalance();
      const check = dispatch(checkBalance({ requiredAmount: required }));
      setBalanceCheck(check);
      
      if (!check.hasSufficientBalance) {
        // Show low balance warning
        Alert.alert(
          'Insufficient Balance',
          `Recruiter has insufficient balance. Required: $${required.toFixed(2)}, Available: $${check.availableBalance.toFixed(2)}.`,
          [
            { text: 'Cancel', onPress: () => setPaymentMethod(null) },
            { text: 'Acknowledge & Continue', onPress: () => proceedWithLowBalance() },
            { text: 'Request Recharge', onPress: () => requestRecharge() },
          ]
        );
      } else {
        proceedWithPlatformPayment();
      }
    }
  };

  const proceedWithPlatformPayment = () => {
    // Request platform payment
    dispatch(requestPlatformPayment({ 
      jobId: activeJob.id, 
      requestedBy: 'jobseeker' 
    }));
    
    Alert.alert(
      'Payment Request Sent',
      'Recruiter will receive a code to share with you. Once shared, you can verify and start the timer.',
      [{ text: 'OK' }]
    );
  };

  const proceedWithLowBalance = () => {
    Alert.alert(
      'Acknowledged',
      'You understand that the platform will not be liable for payment beyond the available balance. Timer can be started.',
      [
        { text: 'OK', onPress: () => {
          dispatch(requestPlatformPayment({ 
            jobId: activeJob.id, 
            requestedBy: 'jobseeker' 
          }));
        }},
      ]
    );
  };

  const requestRecharge = () => {
    Alert.alert(
      'Recharge Request',
      'A request has been sent to the recruiter to recharge their account. They have 5-10 minutes to recharge.',
      [{ text: 'OK' }]
    );
    
    // In real app, send notification to recruiter
    setTimeout(() => {
      Alert.alert(
        'Recharge Status',
        'Recruiter has not recharged. You can choose to acknowledge and continue or decline.',
        [
          { text: 'Acknowledge & Continue', onPress: () => proceedWithLowBalance() },
          { text: 'Decline', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    }, 600000); // 10 minutes
  };

  const handleVerifyCode = (code) => {
    const verified = dispatch(verifyPaymentCode({ jobId: activeJob.id, code }));
    if (verified) {
      // Hold coins
      const required = calculateRequiredBalance();
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
    }
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
  const requiredBalance = calculateRequiredBalance();

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

        {/* Payment Details Form */}
        {paymentMethod === 'platform' && !payment.codeGenerated && (
          <View style={styles.section}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Payment Details
            </AppText>
            
            <View style={styles.formRow}>
              <AppText variant={Variant.body} style={styles.label}>
                Hourly Rate: ${hourlyRate}
              </AppText>
            </View>
            
            <View style={styles.formRow}>
              <AppText variant={Variant.body} style={styles.label}>
                Expected Hours: {expectedHours}
              </AppText>
            </View>
            
            <View style={styles.balanceInfo}>
              <AppText variant={Variant.body} style={styles.balanceLabel}>
                Required Balance
              </AppText>
              <AppText variant={Variant.subTitle} style={styles.balanceValue}>
                ${requiredBalance.toFixed(2)}
              </AppText>
              {balanceCheck && !balanceCheck.hasSufficientBalance && (
                <AppText variant={Variant.caption} style={styles.warningText}>
                  ⚠️ Recruiter has insufficient balance
                </AppText>
              )}
            </View>
          </View>
        )}

        {/* Code Sharing */}
        {payment.codeGenerated && (
          <View style={styles.section}>
            <CodeSharing
              code={payment.code}
              codeExpiry={payment.codeExpiry}
              onCodeVerified={handleVerifyCode}
              showQR={true}
              showNumeric={true}
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
});

