import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const CODE_LENGTH = 6;
const CODE_EXPIRY_SECONDS = 300; // 5 minutes

// ── Countdown hook ──
const useCountdown = (seconds, active) => {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef(null);

  useEffect(() => {
    if (!active) { setRemaining(seconds); return; }
    setRemaining(seconds);
    ref.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(ref.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [active, seconds]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return { remaining, display: `${mm}:${ss}` };
};

// ── OTP Code Input ──
const CodeInput = ({ value, onChange, editable = true }) => {
  const refs = useRef([]);

  const handleChange = (text, index) => {
    const digit = text.replace(/\D/g, '');
    const digits = value.split('');
    if (digit) {
      digits[index] = digit.charAt(digit.length - 1);
      onChange(digits.join('').slice(0, CODE_LENGTH));
      if (index < CODE_LENGTH - 1) refs.current[index + 1]?.focus();
    } else {
      digits[index] = '';
      onChange(digits.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      const digits = value.split('');
      digits[index - 1] = '';
      onChange(digits.join(''));
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.codeRow}>
      {Array.from({ length: CODE_LENGTH }).map((_, i) => {
        const digit = value[i] || '';
        return (
          <TextInput
            key={i}
            ref={r => { refs.current[i] = r; }}
            style={[
              styles.codeCell,
              digit ? styles.codeCellFilled : null,
              i === value.length && editable ? styles.codeCellActive : null,
            ]}
            value={digit}
            onChangeText={t => handleChange(t, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={2}
            editable={editable}
            selectTextOnFocus
            textAlign="center"
          />
        );
      })}
    </View>
  );
};

// ── Verification Modal ──
const VerifyCodeModal = ({ visible, onClose, onVerified, label, sentTo }) => {
  const [code, setCode] = useState('');
  const { remaining, display } = useCountdown(CODE_EXPIRY_SECONDS, visible);

  // Reset code when modal opens
  useEffect(() => {
    if (visible) setCode('');
  }, [visible]);

  const handleVerify = () => {
    if (code.length < CODE_LENGTH) return;
    if (remaining === 0) {
      showToast('Code expired. Please try again.', 'Error', toastTypes.error);
      onClose();
      return;
    }
    onVerified();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          {/* Close button */}
          <TouchableOpacity style={styles.modalClose} onPress={onClose} activeOpacity={0.7}>
            <VectorIcons name={iconLibName.Ionicons} iconName="close-circle" size={26} color="#EF4444" />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.modalIcon}>
            <VectorIcons name={iconLibName.Ionicons} iconName="shield-checkmark-outline" size={32} color={colors.primary} />
          </View>

          <AppText variant={Variant.bodyMedium} style={styles.modalTitle}>
            Verify your {label}
          </AppText>
          <AppText variant={Variant.caption} style={styles.modalDesc}>
            We sent a {CODE_LENGTH}-digit code to
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.modalSentTo}>
            {sentTo}
          </AppText>

          <CodeInput value={code} onChange={setCode} editable={remaining > 0} />

          {/* Timer */}
          <View style={styles.timerRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="timer-outline"
              size={14}
              color={remaining > 60 ? '#059669' : '#EF4444'}
            />
            <AppText variant={Variant.caption} style={[styles.timerText, remaining <= 60 && styles.timerUrgent]}>
              Code expires in {display}
            </AppText>
          </View>

          {/* Verify button */}
          <TouchableOpacity
            style={[styles.verifyBtn, code.length < CODE_LENGTH && styles.verifyBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={code.length < CODE_LENGTH}
          >
            <AppText variant={Variant.bodyMedium} style={styles.verifyBtnText}>Verify Code</AppText>
          </TouchableOpacity>

          {remaining === 0 ? (
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.resendBtn}>
              <AppText variant={Variant.caption} style={styles.resendText}>Resend Code</AppText>
            </TouchableOpacity>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ── Main Screen ──
const AccountRecovery = () => {
  const [currentEmail] = useState('john.recruiter@email.com.au');
  const [currentPhone] = useState('+61 412 345 678');

  // Email fields
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  // Phone fields
  const [newPhone, setNewPhone] = useState('');
  const [countryCode] = useState('+61');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'email' | 'phone'

  const handleChangeEmail = () => {
    if (!newEmail.trim()) {
      showToast('Please enter a new email address', 'Warning', toastTypes.warning);
      return;
    }
    if (!newEmail.includes('@')) {
      showToast('Please enter a valid email address', 'Warning', toastTypes.warning);
      return;
    }
    if (newEmail !== confirmEmail) {
      showToast('Email addresses do not match', 'Warning', toastTypes.warning);
      return;
    }
    setModalType('email');
    setModalVisible(true);
  };

  const handleChangePhone = () => {
    if (!newPhone.trim()) {
      showToast('Please enter a new phone number', 'Warning', toastTypes.warning);
      return;
    }
    setModalType('phone');
    setModalVisible(true);
  };

  const handleVerified = () => {
    setModalVisible(false);
    if (modalType === 'email') {
      showToast('Email changed successfully!', 'Success', toastTypes.success);
      setNewEmail('');
      setConfirmEmail('');
    } else {
      showToast('Phone number changed successfully!', 'Success', toastTypes.success);
      setNewPhone('');
    }
    setModalType(null);
  };

  return (
    <View style={styles.container}>
      <PoolHeader title="Update Recovery Info" />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Banner */}
        <View style={styles.infoBanner}>
          <VectorIcons name={iconLibName.Ionicons} iconName="key-outline" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <AppText variant={Variant.bodyMedium} style={styles.infoBannerTitle}>Recovery Information</AppText>
            <AppText variant={Variant.caption} style={styles.infoBannerDesc}>
              Used to regain access if you lose your password
            </AppText>
          </View>
        </View>

        {/* ═══════ EMAIL SECTION ═══════ */}
        <AppText variant={Variant.h6} style={styles.sectionTitle}>Recovery Email</AppText>
        <View style={styles.card}>
          {/* Current email */}
          <View style={styles.currentRow}>
            <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <AppText variant={Variant.body} style={styles.currentValue}>{currentEmail}</AppText>
              <View style={styles.verifiedBadge}>
                <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={14} color="#2E7D32" />
                <AppText variant={Variant.caption} style={styles.verifiedText}>Verified</AppText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* New email inputs */}
          <AppText variant={Variant.caption} style={styles.inputLabel}>New Email Address</AppText>
          <TextInput
            style={styles.input}
            placeholder="Enter new email address"
            placeholderTextColor="#ccc"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppText variant={Variant.caption} style={styles.inputLabel}>Confirm Email Address</AppText>
          <TextInput
            style={styles.input}
            placeholder="Confirm new email address"
            placeholderTextColor="#ccc"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Change button */}
          <TouchableOpacity style={styles.changeBtn} activeOpacity={0.8} onPress={handleChangeEmail}>
            <AppText variant={Variant.bodyMedium} style={styles.changeBtnText}>Change Email</AppText>
          </TouchableOpacity>
        </View>

        {/* ═══════ PHONE SECTION ═══════ */}
        <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Recovery Phone</AppText>
        <View style={styles.card}>
          {/* Current phone */}
          <View style={styles.currentRow}>
            <VectorIcons name={iconLibName.Ionicons} iconName="call-outline" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <AppText variant={Variant.body} style={styles.currentValue}>{currentPhone}</AppText>
              <View style={styles.verifiedBadge}>
                <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={14} color="#2E7D32" />
                <AppText variant={Variant.caption} style={styles.verifiedText}>Verified</AppText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* New phone input */}
          <AppText variant={Variant.caption} style={styles.inputLabel}>New Phone Number</AppText>
          <View style={styles.phoneRow}>
            <View style={styles.codeBox}>
              <AppText variant={Variant.body} style={styles.codeBoxText}>{countryCode}</AppText>
            </View>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="412 345 678"
              placeholderTextColor="#ccc"
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Change button */}
          <TouchableOpacity style={styles.changeBtn} activeOpacity={0.8} onPress={handleChangePhone}>
            <AppText variant={Variant.bodyMedium} style={styles.changeBtnText}>Change Phone</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Verification Code Modal */}
      <VerifyCodeModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setModalType(null); }}
        onVerified={handleVerified}
        label={modalType === 'email' ? 'email' : 'phone number'}
        sentTo={modalType === 'email' ? currentEmail : currentPhone}
      />
    </View>
  );
};

export default AccountRecovery;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray || '#F6F7FB' },
  scroll: { padding: wp(4), paddingBottom: hp(10) },

  // Banner
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: wp(2.5),
    backgroundColor: '#EEF4FF', borderRadius: 14, padding: wp(4), marginBottom: hp(2),
  },
  infoBannerTitle: { color: colors.primary, fontWeight: '700', fontSize: getFontSize(14) },
  infoBannerDesc: { color: colors.primary, fontSize: getFontSize(12), marginTop: hp(0.2) },

  sectionTitle: {
    color: colors.black || '#111', fontWeight: '700', fontSize: getFontSize(17), marginBottom: hp(1.2),
  },

  // Card
  card: {
    backgroundColor: colors.white, borderRadius: 14, borderWidth: 1,
    borderColor: colors.border || '#E8E8EF', padding: wp(4),
  },
  currentRow: { flexDirection: 'row', alignItems: 'center', gap: wp(3) },
  currentValue: { color: colors.black || '#111', fontWeight: '600', fontSize: getFontSize(14) },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: wp(1), marginTop: hp(0.3) },
  verifiedText: { color: '#2E7D32', fontWeight: '600', fontSize: getFontSize(11) },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: hp(1.8) },

  // Inputs
  inputLabel: { color: colors.gray, fontWeight: '600', fontSize: getFontSize(12), marginBottom: hp(0.5) },
  input: {
    borderWidth: 1, borderColor: colors.border || '#E0E0E0', borderRadius: 10,
    backgroundColor: '#FAFAFA', paddingHorizontal: wp(3), paddingVertical: hp(1.3),
    fontSize: getFontSize(14), color: colors.black || '#111', marginBottom: hp(1.2),
  },
  phoneRow: { flexDirection: 'row', gap: wp(2), marginBottom: hp(1.2) },
  codeBox: {
    borderWidth: 1, borderColor: colors.border || '#E0E0E0', borderRadius: 10,
    backgroundColor: '#FAFAFA', paddingHorizontal: wp(3),
    justifyContent: 'center', alignItems: 'center', height: hp(5.5),
  },
  codeBoxText: { color: colors.black || '#111', fontSize: getFontSize(14), fontWeight: '600' },
  phoneInput: { flex: 1, marginBottom: 0 },

  // Change button
  changeBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingVertical: hp(1.5), alignItems: 'center', marginTop: hp(0.5),
  },
  changeBtnText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(14) },

  // ── Modal ──
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', padding: wp(6),
  },
  modalCard: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2.5),
    padding: wp(6), width: '100%', maxWidth: wp(88),
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 12,
  },
  modalClose: { position: 'absolute', top: hp(1.2), right: wp(3), zIndex: 1 },
  modalIcon: {
    width: wp(16), height: wp(16), borderRadius: wp(8),
    backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center',
    marginBottom: hp(1.5), marginTop: hp(0.5),
  },
  modalTitle: {
    color: colors.secondary, fontWeight: '700', fontSize: getFontSize(17), marginBottom: hp(0.5),
  },
  modalDesc: { color: colors.gray, fontSize: getFontSize(12), textAlign: 'center' },
  modalSentTo: {
    color: colors.secondary, fontWeight: '600', fontSize: getFontSize(13),
    marginBottom: hp(2), textAlign: 'center',
  },

  // Code input
  codeRow: {
    flexDirection: 'row', justifyContent: 'center', gap: wp(2), marginBottom: hp(1.2),
  },
  codeCell: {
    width: wp(11), height: wp(13), borderRadius: 10, borderWidth: 1.5,
    borderColor: '#E5E7EB', backgroundColor: '#FAFAFA',
    textAlign: 'center', color: colors.secondary,
    fontWeight: '700', fontSize: getFontSize(20), padding: 0,
  },
  codeCellFilled: { borderColor: colors.primary, backgroundColor: '#F0F7FF' },
  codeCellActive: { borderColor: colors.primary, borderWidth: 2 },

  // Timer
  timerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: wp(1.5), marginBottom: hp(2),
  },
  timerText: { color: '#059669', fontSize: getFontSize(12), fontWeight: '600' },
  timerUrgent: { color: '#EF4444' },

  // Verify button
  verifyBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingVertical: hp(1.5), alignItems: 'center', width: '100%',
  },
  verifyBtnDisabled: { backgroundColor: '#D1D5DB' },
  verifyBtnText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(14) },

  // Resend
  resendBtn: { marginTop: hp(1.5) },
  resendText: {
    color: colors.primary, fontWeight: '700', fontSize: getFontSize(13),
    textDecorationLine: 'underline',
  },
});
