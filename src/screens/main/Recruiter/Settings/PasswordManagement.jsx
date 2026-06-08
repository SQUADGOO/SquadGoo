import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const PasswordManagement = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Password requirements check
    const requirements = useMemo(() => [
        { label: 'At least 8 characters', met: newPassword.length >= 8 },
        { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
        { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
        { label: 'One number (0-9)', met: /[0-9]/.test(newPassword) },
        { label: 'One special character (!@#$%)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) },
    ], [newPassword]);

    const metCount = requirements.filter(r => r.met).length;

    // Strength calculation
    const strength = useMemo(() => {
        if (newPassword.length === 0) return { label: '', color: '#e0e0e0', width: 0 };
        if (metCount <= 2) return { label: 'Weak', color: '#DC3545', width: 33 };
        if (metCount <= 4) return { label: 'Medium', color: '#F57C00', width: 66 };
        return { label: 'Strong', color: '#2E7D32', width: 100 };
    }, [metCount, newPassword]);

    const handleUpdatePassword = () => {
        if (!currentPassword) {
            Alert.alert('Error', 'Please enter your current password.');
            return;
        }
        if (metCount < 5) {
            Alert.alert('Error', 'New password does not meet all requirements.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        Alert.alert('Success', 'Your password has been updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleResetViaEmail = () => {
        Alert.alert('Reset Link Sent', 'A password reset link has been sent to john.recruiter@email.com.au');
    };

    const handleResetViaSMS = () => {
        Alert.alert('Reset Link Sent', 'A password reset link has been sent to +61 412 345 678');
    };

    const PasswordInput = ({ label, value, onChange, show, onToggle, placeholder }) => (
        <View style={styles.inputGroup}>
            <AppText variant={Variant.caption} style={styles.inputLabel}>{label}</AppText>
            <View style={styles.inputWrap}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!show}
                    placeholder={placeholder || '••••••••'}
                    placeholderTextColor="#ccc"
                />
                <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
                    <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName={show ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.gray}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <PoolHeader title="Password Management" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Last changed info */}
                <View style={styles.infoBanner}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={16} color={colors.primary} />
                    <AppText variant={Variant.caption} style={styles.infoBannerText}>
                        Last password change: 2 weeks ago
                    </AppText>
                </View>

                {/* Change Password */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>Change Password</AppText>

                <View style={styles.formCard}>
                    <PasswordInput
                        label="Current Password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        show={showCurrent}
                        onToggle={() => setShowCurrent(!showCurrent)}
                    />

                    <PasswordInput
                        label="New Password"
                        value={newPassword}
                        onChange={setNewPassword}
                        show={showNew}
                        onToggle={() => setShowNew(!showNew)}
                    />

                    {/* Strength meter */}
                    {newPassword.length > 0 && (
                        <View style={styles.strengthSection}>
                            <View style={styles.strengthHeader}>
                                <AppText variant={Variant.caption} style={styles.strengthLabel}>Password Strength</AppText>
                                <AppText variant={Variant.caption} style={[styles.strengthValue, { color: strength.color }]}>
                                    {strength.label}
                                </AppText>
                            </View>
                            <View style={styles.strengthTrack}>
                                <View style={[styles.strengthBar, { width: `${strength.width}%`, backgroundColor: strength.color }]} />
                            </View>
                        </View>
                    )}

                    {/* Requirements checklist */}
                    {newPassword.length > 0 && (
                        <View style={styles.requirements}>
                            <AppText variant={Variant.caption} style={styles.reqTitle}>Password Requirements:</AppText>
                            {requirements.map((req, i) => (
                                <View key={i} style={styles.reqRow}>
                                    <VectorIcons
                                        name={iconLibName.Ionicons}
                                        iconName={req.met ? 'checkmark-circle' : 'close-circle'}
                                        size={16}
                                        color={req.met ? '#2E7D32' : '#DC3545'}
                                    />
                                    <AppText variant={Variant.caption} style={[styles.reqText, { color: req.met ? '#2E7D32' : '#999' }]}>
                                        {req.label}
                                    </AppText>
                                </View>
                            ))}
                        </View>
                    )}

                    <PasswordInput
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        show={showConfirm}
                        onToggle={() => setShowConfirm(!showConfirm)}
                    />

                    {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                        <AppText variant={Variant.caption} style={styles.mismatch}>Passwords do not match</AppText>
                    )}

                    <TouchableOpacity style={styles.updateBtn} activeOpacity={0.8} onPress={handleUpdatePassword}>
                        <AppText variant={Variant.bodyMedium} style={styles.updateBtnText}>Update Password</AppText>
                    </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(3) }]}>Forgot Password?</AppText>
                <AppText variant={Variant.caption} style={styles.sectionDesc}>Reset your password via secure link</AppText>

                <View style={styles.card}>
                    <TouchableOpacity style={styles.resetRow} activeOpacity={0.7} onPress={handleResetViaEmail}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={20} color={colors.primary} />
                        <View style={styles.resetContent}>
                            <AppText variant={Variant.body} style={styles.resetTitle}>Send reset link via Email</AppText>
                            <AppText variant={Variant.caption} style={styles.resetSub}>john.recruiter@email.com.au</AppText>
                        </View>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={18} color={colors.gray} />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.resetRow} activeOpacity={0.7} onPress={handleResetViaSMS}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-outline" size={20} color={colors.primary} />
                        <View style={styles.resetContent}>
                            <AppText variant={Variant.body} style={styles.resetTitle}>Send reset link via SMS</AppText>
                            <AppText variant={Variant.caption} style={styles.resetSub}>+61 412 345 678</AppText>
                        </View>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={18} color={colors.gray} />
                    </TouchableOpacity>
                </View>

                {/* Security Notice */}
                <View style={styles.noticeBanner}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="warning-outline" size={18} color="#92400E" />
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.body} style={styles.noticeTitle}>Security Notice</AppText>
                        <AppText variant={Variant.caption} style={styles.noticeText}>
                            Account will be temporarily locked after 5 failed login attempts for 30 minutes.
                        </AppText>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default PasswordManagement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        backgroundColor: '#EEF4FF',
        borderRadius: 10,
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(1.2),
        marginBottom: hp(2),
    },
    infoBannerText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    sectionTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(17),
        marginBottom: hp(1.2),
    },
    sectionDesc: {
        color: colors.gray,
        fontSize: getFontSize(13),
        marginBottom: hp(1.5),
        marginTop: hp(-0.5),
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
    },
    inputGroup: {
        marginBottom: hp(1.5),
    },
    inputLabel: {
        color: colors.gray,
        fontWeight: '600',
        fontSize: getFontSize(12),
        marginBottom: hp(0.5),
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
    },
    input: {
        flex: 1,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.3),
        fontSize: getFontSize(14),
        color: colors.black || '#111',
    },
    eyeBtn: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.3),
    },
    strengthSection: {
        marginBottom: hp(1),
    },
    strengthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(0.5),
    },
    strengthLabel: {
        color: colors.gray,
        fontSize: getFontSize(12),
    },
    strengthValue: {
        fontWeight: '700',
        fontSize: getFontSize(12),
    },
    strengthTrack: {
        height: 6,
        backgroundColor: '#E8E8EF',
        borderRadius: 3,
        overflow: 'hidden',
    },
    strengthBar: {
        height: 6,
        borderRadius: 3,
    },
    requirements: {
        marginBottom: hp(1.5),
    },
    reqTitle: {
        color: colors.black || '#111',
        fontWeight: '600',
        fontSize: getFontSize(12),
        marginBottom: hp(0.8),
    },
    reqRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(0.4),
    },
    reqText: {
        fontSize: getFontSize(12),
    },
    mismatch: {
        color: '#DC3545',
        fontSize: getFontSize(12),
        marginTop: hp(-1),
        marginBottom: hp(1),
    },
    updateBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: hp(1.6),
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    updateBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border || '#E8E8EF',
        marginLeft: wp(4) + 24,
    },
    resetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
        gap: wp(3),
    },
    resetContent: {
        flex: 1,
    },
    resetTitle: {
        color: colors.black || '#111',
        fontWeight: '600',
        fontSize: getFontSize(14),
    },
    resetSub: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginTop: hp(0.2),
    },
    noticeBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2.5),
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 12,
        padding: wp(4),
        marginTop: hp(2.5),
    },
    noticeTitle: {
        color: '#92400E',
        fontWeight: '700',
        fontSize: getFontSize(13),
        marginBottom: hp(0.3),
    },
    noticeText: {
        color: '#92400E',
        fontSize: getFontSize(12),
        lineHeight: getFontSize(17),
    },
});
