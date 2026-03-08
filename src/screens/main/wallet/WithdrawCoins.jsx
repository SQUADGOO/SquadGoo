import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import AppButton from '@/core/AppButton';
import LinearGradient from 'react-native-linear-gradient';
import { screenNames } from '@/navigation/screenNames';
import { useSelector } from 'react-redux';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MIN_WITHDRAW = 15;
const WITHDRAWAL_FEE = 1;

const mockBankAccounts = [
  { id: '1', bankName: 'Commonwealth Bank', accountNumber: '****1234', bsb: '062-000', isVerified: true },
  { id: '2', bankName: 'ANZ', accountNumber: '****5678', bsb: '013-000', isVerified: true },
  { id: '3', bankName: 'Westpac', accountNumber: '****9012', bsb: '032-000', isVerified: true },
];

const WithdrawCoins = ({ navigation }) => {
  const walletCoins = useSelector(state => state.wallet.coins) || 0;
  const bankAccounts = useSelector(state => state.bank?.accounts) || [];
  const accounts = bankAccounts.length > 0 ? bankAccounts : mockBankAccounts;
  const verifiedAccounts = useMemo(() => accounts.filter(a => a.isVerified), [accounts]);

  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(verifiedAccounts[0] || null);
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  // Multi-step flow state
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const isMinError = amount.length > 0 && numericAmount > 0 && numericAmount < MIN_WITHDRAW;
  const isInsufficientFunds = numericAmount > walletCoins;
  const amountToReceive = numericAmount > WITHDRAWAL_FEE ? numericAmount - WITHDRAWAL_FEE : 0;
  const isFormValid = numericAmount >= MIN_WITHDRAW && !isInsufficientFunds && selectedAccount;

  const handleWithdrawAll = () => {
    setAmount(walletCoins.toString());
  };

  // Step 1 → Step 2: Show confirmation
  const handleWithdrawNow = () => {
    if (!isFormValid) return;
    setShowConfirm(true);
  };

  // Step 2 → Step 3: Start processing
  const handleConfirmWithdraw = () => {
    setShowConfirm(false);
    setShowProcessing(true);
  };

  // Step 3 → Step 4: Processing completes → show success
  useEffect(() => {
    if (showProcessing) {
      const timer = setTimeout(() => {
        setShowProcessing(false);
        setShowSuccess(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showProcessing]);

  // Step 5: Cancel confirmation → back to form
  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <PoolHeader title="Withdraw Coins" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Wallet Balance */}
        <View style={styles.balanceCard}>
          <AppText variant={Variant.bodyMedium} style={styles.balanceLabel}>Wallet Balance</AppText>
          <View style={styles.balanceRow}>
            <View>
              <AppText variant={Variant.h6} style={styles.balanceSg}>SG {walletCoins.toFixed(2)}</AppText>
              <AppText variant={Variant.caption} style={styles.balanceAud}>AUD {(walletCoins - WITHDRAWAL_FEE > 0 ? walletCoins - WITHDRAWAL_FEE : 0).toFixed(2)}</AppText>
            </View>
            <TouchableOpacity>
              <VectorIcons name={iconLibName.Ionicons} iconName="refresh-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Account Selector */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <AppText variant={Variant.bodyMedium} style={styles.label}>Bank Account</AppText>
            <TouchableOpacity onPress={() => navigation.navigate(screenNames.MANAGE_BANK_ACCOUNTS)}>
              <AppText variant={Variant.caption} style={styles.manageLink}>Manage Accounts</AppText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.pickerBtn}
            onPress={() => setShowAccountPicker(true)}
            activeOpacity={0.7}
          >
            <AppText variant={Variant.body} style={selectedAccount ? styles.pickerText : styles.pickerPlaceholder}>
              {selectedAccount ? `${selectedAccount.bankName} (${selectedAccount.accountNumber})` : 'Select Bank Account...'}
            </AppText>
            <VectorIcons name={iconLibName.Ionicons} iconName="chevron-down" size={18} color="#999" />
          </TouchableOpacity>

          {accounts.length === 0 && (
            <TouchableOpacity
              style={styles.addBankBtn}
              onPress={() => navigation.navigate(screenNames.MANAGE_BANK_ACCOUNTS)}
              activeOpacity={0.7}
            >
              <VectorIcons name={iconLibName.Ionicons} iconName="add-circle-outline" size={18} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.addBankText}>Add Bank Account</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Amount Input */}
        <View style={styles.fieldGroup}>
          <AppText variant={Variant.bodyMedium} style={styles.label}>Amount (SG/AUD)</AppText>
          <View style={styles.amountRow}>
            <TextInput
              style={[styles.amountInput, isMinError && styles.amountInputError]}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.withdrawAllBtn} onPress={handleWithdrawAll} activeOpacity={0.7}>
              <AppText variant={Variant.caption} style={styles.withdrawAllText}>Withdraw All</AppText>
            </TouchableOpacity>
          </View>

          {/* Validation errors */}
          {isMinError && (
            <View style={styles.errorRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="alert-circle" size={16} color="#DC2626" />
              <AppText variant={Variant.caption} style={styles.errorText}>
                Minimum withdrawal amount is 15 SG. Please enter a valid amount.
              </AppText>
            </View>
          )}
          {isInsufficientFunds && (
            <View style={styles.errorRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="alert-circle" size={16} color="#DC2626" />
              <AppText variant={Variant.caption} style={styles.errorText}>
                Insufficient balance. Your wallet has {walletCoins} SG.
              </AppText>
            </View>
          )}

          <AppText variant={Variant.caption} style={styles.feeNote}>
            Minimum withdrawal $15, $1 fee per withdrawal
          </AppText>
        </View>

        {/* Summary Box */}
        {numericAmount >= MIN_WITHDRAW && !isInsufficientFunds && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <AppText variant={Variant.body} style={styles.summaryLabel}>Amount to Receive:</AppText>
              <AppText variant={Variant.bodyMedium} style={styles.summaryValue}>AUD {amountToReceive.toFixed(2)}</AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant={Variant.body} style={styles.summaryLabel}>Fee:</AppText>
              <AppText variant={Variant.bodyMedium} style={styles.summaryValue}>AUD {WITHDRAWAL_FEE.toFixed(2)}</AppText>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowTotal]}>
              <AppText variant={Variant.bodyMedium} style={styles.summaryTotalLabel}>Total:</AppText>
              <AppText variant={Variant.bodyMedium} style={styles.summaryTotalValue}>AUD {numericAmount.toFixed(2)}</AppText>
            </View>
          </View>
        )}

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <VectorIcons name={iconLibName.Ionicons} iconName="shield-checkmark-outline" size={16} color="#F59E0B" />
          <AppText variant={Variant.caption} style={styles.securityText}>
            Withdrawals only allowed to verified bank accounts. May take 2–24 hours.
          </AppText>
        </View>

        {/* Withdraw Now Button */}
        <AppButton
          text="Withdraw Now"
          onPress={handleWithdrawNow}
          style={[styles.withdrawBtn, !isFormValid && styles.withdrawBtnDisabled]}
          disabled={!isFormValid}
          bgColor="#F59E0B"
          textColor="#FFFFFF"
        />

        <View style={{ height: hp(4) }} />
      </ScrollView>

      {/* ──────── Bank Account Picker Modal ──────── */}
      <Modal visible={showAccountPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowAccountPicker(false)}
        >
          <View style={styles.pickerModal}>
            <View style={styles.pickerModalHeader}>
              <AppText variant={Variant.bodyMedium} style={styles.pickerModalTitle}>Select Bank Account</AppText>
              <TouchableOpacity onPress={() => setShowAccountPicker(false)}>
                <VectorIcons name={iconLibName.Ionicons} iconName="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {verifiedAccounts.length === 0 ? (
                <View style={styles.pickerEmpty}>
                  <VectorIcons name={iconLibName.Ionicons} iconName="alert-circle-outline" size={28} color="#999" />
                  <AppText variant={Variant.body} style={styles.pickerEmptyText}>
                    No verified accounts.{'\n'}Please add and verify a bank account.
                  </AppText>
                  <AppButton
                    text="Add Bank Account"
                    onPress={() => {
                      setShowAccountPicker(false);
                      navigation.navigate(screenNames.MANAGE_BANK_ACCOUNTS);
                    }}
                    style={styles.pickerEmptyBtn}
                    bgColor={colors.primary}
                    textColor="#FFFFFF"
                  />
                </View>
              ) : (
                verifiedAccounts.map((acc) => (
                  <TouchableOpacity
                    key={acc.id}
                    style={[
                      styles.pickerItem,
                      selectedAccount?.id === acc.id && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setSelectedAccount(acc);
                      setShowAccountPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerItemIcon}>
                      <VectorIcons name={iconLibName.Ionicons} iconName="business" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.pickerItemLeft}>
                      <AppText variant={Variant.bodyMedium} style={styles.pickerItemName}>{acc.bankName}</AppText>
                      <AppText variant={Variant.caption} style={styles.pickerItemDetail}>
                        {acc.accountNumber} • BSB {acc.bsb}
                      </AppText>
                    </View>
                    <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={20} color="#16A34A" />
                    {selectedAccount?.id === acc.id && (
                      <VectorIcons name={iconLibName.Ionicons} iconName="radio-button-on" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ──────── Step 2: Confirmation Modal ──────── */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={[styles.modalBackdrop, { justifyContent: 'center' }]}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconCircle}>
              <VectorIcons name={iconLibName.Ionicons} iconName="cash-outline" size={30} color={colors.primary} />
            </View>
            <AppText variant={Variant.h6} style={styles.confirmTitle}>Confirm Withdrawal</AppText>

            <View style={styles.confirmDetailBox}>
              <View style={styles.confirmRow}>
                <AppText variant={Variant.caption} style={styles.confirmLabel}>Amount</AppText>
                <AppText variant={Variant.bodyMedium} style={styles.confirmValue}>SG {numericAmount.toFixed(2)}</AppText>
              </View>
              <View style={styles.confirmRow}>
                <AppText variant={Variant.caption} style={styles.confirmLabel}>Fee</AppText>
                <AppText variant={Variant.bodyMedium} style={styles.confirmValue}>AUD {WITHDRAWAL_FEE.toFixed(2)}</AppText>
              </View>
              <View style={[styles.confirmRow, { borderBottomWidth: 0 }]}>
                <AppText variant={Variant.caption} style={styles.confirmLabel}>Amount to Receive</AppText>
                <AppText variant={Variant.bodyMedium} style={[styles.confirmValue, { color: '#16A34A', fontWeight: '800' }]}>AUD {amountToReceive.toFixed(2)}</AppText>
              </View>
            </View>

            <View style={styles.confirmAccountBox}>
              <VectorIcons name={iconLibName.Ionicons} iconName="business-outline" size={16} color="#666" />
              <View style={{ flex: 1 }}>
                <AppText variant={Variant.caption} style={styles.confirmAccountLabel}>Receiving Account</AppText>
                <AppText variant={Variant.bodyMedium} style={styles.confirmAccountValue}>
                  {selectedAccount?.bankName} ({selectedAccount?.accountNumber})
                </AppText>
              </View>
            </View>

            <View style={styles.confirmBtnsRow}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={handleCancelConfirm}
                activeOpacity={0.7}
              >
                <AppText variant={Variant.bodyMedium} style={styles.confirmCancelText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmProceedBtn}
                onPress={handleConfirmWithdraw}
                activeOpacity={0.7}
              >
                <AppText variant={Variant.bodyMedium} style={styles.confirmProceedText}>Confirm</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ──────── Step 3: Processing Screen ──────── */}
      <Modal visible={showProcessing} transparent={false} animationType="fade">
        <LinearGradient
          colors={['#0A0E27', '#141B3D', '#1B2450']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.processingScreen}
        >
          {/* SquadGoo branding */}
          <View style={styles.processingBrand}>
            <View style={styles.processingLogoCircle}>
              <AppText variant={Variant.bodyMedium} style={styles.processingLogoText}>G</AppText>
            </View>
            <AppText variant={Variant.bodyMedium} style={styles.processingBrandName}>SQUADGOO</AppText>
            <AppText variant={Variant.caption} style={styles.processingBrandSub}>Recruiter Wallet</AppText>
          </View>

          {/* Animated coin icon */}
          <View style={styles.processingCoinContainer}>
            <View style={styles.processingRing3} />
            <View style={styles.processingRing2} />
            <View style={styles.processingRing1} />
            <LinearGradient
              colors={['#00D4FF', '#0088CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.processingCoin}
            >
              <AppText variant={Variant.h6} style={styles.processingCoinText}>S</AppText>
            </LinearGradient>
          </View>

          {/* Processing text */}
          <AppText variant={Variant.h6} style={styles.processingTitle}>Processing your{'\n'}withdrawal...</AppText>

          <ActivityIndicator size="small" color="#00D4FF" style={{ marginTop: hp(3) }} />
        </LinearGradient>
      </Modal>

      {/* ──────── Step 4: Success Screen ──────── */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={[styles.modalBackdrop, { justifyContent: 'center' }]}>
          <View style={styles.successCard}>
            <LinearGradient
              colors={['#16A34A', '#22C55E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.successIcon}
            >
              <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={40} color={colors.white} />
            </LinearGradient>
            <AppText variant={Variant.h6} style={styles.successTitle}>Withdrawal Request{'\n'}Submitted!</AppText>
            <AppText variant={Variant.body} style={styles.successText}>
              {numericAmount.toFixed(0)} SG will be transferred to your bank account ending in {selectedAccount?.accountNumber?.replace(/\*/g, '').trim() || '****'}.
            </AppText>
            <View style={styles.successInfoRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color="#F59E0B" />
              <AppText variant={Variant.caption} style={styles.successInfoText}>
                Withdrawals are typically processed within 2–24 hours. You'll receive a notification once the transfer is complete.
              </AppText>
            </View>
            <AppButton
              text="Back to Wallet"
              onPress={handleSuccessOk}
              style={styles.successBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WithdrawCoins;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F2F9' },
  scroll: { flex: 1 },
  scrollContent: { padding: wp(5) },
  // Balance card
  balanceCard: {
    backgroundColor: colors.white, borderRadius: 14, padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  balanceLabel: { color: '#666', fontWeight: '600', fontSize: getFontSize(13), marginBottom: hp(0.5) },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceSg: { color: '#111', fontWeight: '800', fontSize: getFontSize(22) },
  balanceAud: { color: '#888', fontSize: getFontSize(13), marginTop: hp(0.2) },
  // Fields
  fieldGroup: { marginBottom: hp(2) },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(0.6) },
  label: { color: '#333', fontWeight: '700', fontSize: getFontSize(14) },
  manageLink: { color: colors.primary, fontWeight: '700', fontSize: getFontSize(12), textDecorationLine: 'underline' },
  pickerBtn: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: '#E8E8EF',
    borderRadius: 12, paddingHorizontal: wp(3.5), paddingVertical: hp(1.4),
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  pickerText: { color: '#333', fontSize: getFontSize(14) },
  pickerPlaceholder: { color: '#999', fontSize: getFontSize(14) },
  addBankBtn: {
    flexDirection: 'row', alignItems: 'center', gap: wp(2),
    backgroundColor: '#F5F3FF', borderRadius: 10, padding: wp(3),
    marginTop: hp(1), borderWidth: 1, borderColor: '#E8E5F0',
  },
  addBankText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(13) },
  // Amount
  amountRow: { flexDirection: 'row', gap: wp(2), alignItems: 'center' },
  amountInput: {
    flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E8E8EF',
    borderRadius: 12, paddingHorizontal: wp(3.5), paddingVertical: hp(1.2),
    fontSize: getFontSize(18), color: '#333', fontWeight: '700',
  },
  amountInputError: { borderColor: '#DC2626', borderWidth: 1.5 },
  withdrawAllBtn: {
    borderWidth: 1.5, borderColor: '#E8E8EF', borderRadius: 10,
    paddingHorizontal: wp(3), paddingVertical: hp(1.2),
  },
  withdrawAllText: { color: '#555', fontWeight: '600', fontSize: getFontSize(12) },
  // Errors
  errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(1.5), marginTop: hp(0.8) },
  errorText: { flex: 1, color: '#DC2626', fontSize: getFontSize(12), lineHeight: getFontSize(17) },
  feeNote: { color: '#999', fontSize: getFontSize(11), marginTop: hp(0.5) },
  // Summary
  summaryCard: {
    backgroundColor: '#F5F3FF', borderRadius: 12, padding: wp(4),
    marginBottom: hp(2), borderWidth: 1, borderColor: '#E8E5F0',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(0.6) },
  summaryLabel: { color: '#555', fontSize: getFontSize(13) },
  summaryValue: { color: '#333', fontWeight: '600', fontSize: getFontSize(13) },
  summaryRowTotal: { borderTopWidth: 1, borderTopColor: '#DDD', paddingTop: hp(0.8), marginTop: hp(0.4) },
  summaryTotalLabel: { color: '#111', fontWeight: '700', fontSize: getFontSize(14) },
  summaryTotalValue: { color: '#111', fontWeight: '800', fontSize: getFontSize(14) },
  // Security
  securityNotice: {
    flexDirection: 'row', alignItems: 'flex-start', gap: wp(2),
    backgroundColor: '#FFF8E1', borderRadius: 10, padding: wp(3),
    marginBottom: hp(2), borderWidth: 1, borderColor: '#FFE082',
  },
  securityText: { flex: 1, color: '#BF360C', fontSize: getFontSize(11), lineHeight: getFontSize(16) },
  // Withdraw btn
  withdrawBtn: { width: '100%', borderRadius: 12 },
  withdrawBtnDisabled: { opacity: 0.5 },

  // ── Bank picker modal ──
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerModal: {
    backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '50%', paddingBottom: hp(5),
  },
  pickerModalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: wp(5), paddingVertical: hp(1.5),
    borderBottomWidth: 1, borderBottomColor: '#F3F3F3',
  },
  pickerModalTitle: { color: '#111', fontWeight: '700', fontSize: getFontSize(16) },
  pickerEmpty: { alignItems: 'center', paddingVertical: hp(4), paddingHorizontal: wp(8) },
  pickerEmptyText: { color: '#888', fontSize: getFontSize(14), textAlign: 'center', marginTop: hp(1), lineHeight: getFontSize(21) },
  pickerEmptyBtn: { marginTop: hp(2), borderRadius: 12, minWidth: wp(50) },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: wp(5), paddingVertical: hp(1.5),
    borderBottomWidth: 0.5, borderBottomColor: '#F3F3F3', gap: wp(2.5),
  },
  pickerItemActive: { backgroundColor: '#F5F3FF' },
  pickerItemIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#F5F3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  pickerItemLeft: { flex: 1 },
  pickerItemName: { color: '#333', fontWeight: '600', fontSize: getFontSize(14) },
  pickerItemDetail: { color: '#888', fontSize: getFontSize(11), marginTop: hp(0.2) },

  // ── Confirmation modal ──
  confirmCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: wp(5),
    alignItems: 'center', marginHorizontal: wp(6),
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  confirmIconCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  confirmTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(19), marginBottom: hp(1.5) },
  confirmDetailBox: {
    width: '100%', backgroundColor: '#F9F9FB', borderRadius: 12,
    padding: wp(3.5), marginBottom: hp(1.5),
  },
  confirmRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: hp(0.6), borderBottomWidth: 0.5, borderBottomColor: '#E8E8EF',
  },
  confirmLabel: { color: '#888', fontSize: getFontSize(12) },
  confirmValue: { color: '#333', fontWeight: '700', fontSize: getFontSize(14) },
  confirmAccountBox: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: wp(2),
    backgroundColor: '#F5F3FF', borderRadius: 10, padding: wp(3),
    marginBottom: hp(2), borderWidth: 1, borderColor: '#E8E5F0',
  },
  confirmAccountLabel: { color: '#888', fontSize: getFontSize(11) },
  confirmAccountValue: { color: '#333', fontWeight: '600', fontSize: getFontSize(13) },
  confirmBtnsRow: { flexDirection: 'row', gap: wp(3), width: '100%' },
  confirmCancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#E8E8EF', borderRadius: 12,
    paddingVertical: hp(1.3), alignItems: 'center',
  },
  confirmCancelText: { color: '#555', fontWeight: '600', fontSize: getFontSize(13) },
  confirmProceedBtn: {
    flex: 1, backgroundColor: '#F59E0B', borderRadius: 12,
    paddingVertical: hp(1.3), alignItems: 'center',
  },
  confirmProceedText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(13) },

  // ── Processing screen ──
  processingScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  processingBrand: { alignItems: 'center', position: 'absolute', top: hp(8) },
  processingLogoCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: hp(0.5),
  },
  processingLogoText: { color: '#FFFFFF', fontWeight: '800', fontSize: getFontSize(14) },
  processingBrandName: { color: '#FFFFFF', fontWeight: '800', fontSize: getFontSize(14), letterSpacing: 2 },
  processingBrandSub: { color: 'rgba(255,255,255,0.5)', fontSize: getFontSize(11), marginTop: hp(0.2) },
  processingCoinContainer: {
    width: 160, height: 160, alignItems: 'center', justifyContent: 'center',
  },
  processingRing3: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    borderWidth: 1, borderColor: 'rgba(0,212,255,0.1)',
  },
  processingRing2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    borderWidth: 1.5, borderColor: 'rgba(0,212,255,0.2)',
  },
  processingRing1: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: 'rgba(0,212,255,0.35)',
  },
  processingCoin: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
  },
  processingCoinText: { color: '#FFFFFF', fontWeight: '900', fontSize: getFontSize(28) },
  processingTitle: {
    color: '#FFFFFF', fontWeight: '700', fontSize: getFontSize(22),
    textAlign: 'center', marginTop: hp(4), lineHeight: getFontSize(30),
  },

  // ── Success modal ──
  successCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: wp(6),
    alignItems: 'center', marginHorizontal: wp(6),
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: hp(2),
  },
  successTitle: {
    color: '#111', fontWeight: '800', fontSize: getFontSize(20),
    marginBottom: hp(1), textAlign: 'center',
  },
  successText: {
    color: '#555', fontSize: getFontSize(13), textAlign: 'center',
    lineHeight: getFontSize(20), marginBottom: hp(1.5),
  },
  successInfoRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: wp(2),
    backgroundColor: '#FFF8E1', borderRadius: 10, padding: wp(3),
    marginBottom: hp(2), borderWidth: 1, borderColor: '#FFE082', width: '100%',
  },
  successInfoText: { flex: 1, color: '#BF360C', fontSize: getFontSize(11), lineHeight: getFontSize(16) },
  successBtn: { width: '100%', borderRadius: 12 },
});