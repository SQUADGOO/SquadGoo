import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const TwoFactorAuth = ({ navigation }) => {
    const [twoFAEnabled, setTwoFAEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [authAppEnabled, setAuthAppEnabled] = useState(false);

    const handleSetupAuthApp = () => {
        Alert.alert(
            'Setup Authenticator App',
            'To set up an authenticator app:\n\n1. Download Google Authenticator or Authy\n2. Scan the QR code from your SquadGoo account\n3. Enter the 6-digit code to verify\n\nThis feature will be fully available soon.'
        );
    };

    const handleViewCodes = () => {
        Alert.alert(
            'Backup Codes',
            '1. ABCD-1234-EFGH\n2. IJKL-5678-MNOP\n3. QRST-9012-UVWX\n4. YZAB-3456-CDEF\n5. GHIJ-7890-KLMN\n\nKeep these codes safe. Each code can only be used once.'
        );
    };

    const handleGenerateNew = () => {
        Alert.alert(
            'Generate New Codes',
            'This will invalidate your current backup codes. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Generate', onPress: () => Alert.alert('Success', 'New backup codes have been generated.') },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <PoolHeader title="Two-Factor Authentication" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Status banner */}
                <View style={[styles.statusBanner, !twoFAEnabled && styles.statusBannerOff]}>
                    <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName={twoFAEnabled ? 'shield-checkmark' : 'shield-outline'}
                        size={20}
                        color={twoFAEnabled ? '#166534' : '#92400E'}
                    />
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.bodyMedium} style={[styles.statusTitle, !twoFAEnabled && styles.statusTitleOff]}>
                            {twoFAEnabled ? '2FA Is Enabled' : '2FA Is Disabled'}
                        </AppText>
                        <AppText variant={Variant.caption} style={[styles.statusDesc, !twoFAEnabled && styles.statusDescOff]}>
                            {twoFAEnabled
                                ? 'Your account is protected with two-factor authentication'
                                : 'Enable 2FA to add an extra layer of security'}
                        </AppText>
                    </View>
                </View>

                {/* Enable 2FA toggle */}
                <View style={styles.card}>
                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.body} style={styles.toggleLabel}>
                                Enable Two-Factor Authentication
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Require verification code when signing in
                            </AppText>
                        </View>
                        <Switch
                            value={twoFAEnabled}
                            onValueChange={setTwoFAEnabled}
                            trackColor={{ false: '#e0e0e0', true: colors.primary }}
                            thumbColor={twoFAEnabled ? colors.white : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* 2FA Methods */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>2FA Methods</AppText>

                <View style={styles.card}>
                    {/* SMS Code */}
                    <View style={styles.methodRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.methodLabelRow}>
                                <AppText variant={Variant.caption} style={styles.methodIcon}>💬</AppText>
                                <AppText variant={Variant.body} style={styles.methodLabel}>SMS Code</AppText>
                            </View>
                            <AppText variant={Variant.caption} style={styles.methodPhone}>+61 412 *** 678</AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Receive 6-digit code via text message
                            </AppText>
                        </View>
                        <Switch
                            value={smsEnabled}
                            onValueChange={setSmsEnabled}
                            disabled={!twoFAEnabled}
                            trackColor={{ false: '#e0e0e0', true: colors.primary }}
                            thumbColor={smsEnabled ? colors.white : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Email Code */}
                    <View style={styles.methodRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.methodLabelRow}>
                                <AppText variant={Variant.caption} style={styles.methodIcon}>📧</AppText>
                                <AppText variant={Variant.body} style={styles.methodLabel}>Email Code</AppText>
                            </View>
                            <AppText variant={Variant.caption} style={styles.methodPhone}>john@***.com.au</AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Receive 6-digit code via email
                            </AppText>
                        </View>
                        <Switch
                            value={emailEnabled}
                            onValueChange={setEmailEnabled}
                            disabled={!twoFAEnabled}
                            trackColor={{ false: '#e0e0e0', true: colors.primary }}
                            thumbColor={emailEnabled ? colors.white : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Authenticator App */}
                    <View style={styles.methodRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.methodLabelRow}>
                                <AppText variant={Variant.caption} style={styles.methodIcon}>🔐</AppText>
                                <AppText variant={Variant.body} style={styles.methodLabel}>Authenticator App</AppText>
                            </View>
                            <AppText variant={Variant.caption} style={styles.methodPhone}>Google Authenticator, Authy, etc.</AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Use time-based one-time passwords (TOTP)
                            </AppText>
                        </View>
                        <View style={styles.methodRight}>
                            <Switch
                                value={authAppEnabled}
                                onValueChange={setAuthAppEnabled}
                                disabled={!twoFAEnabled}
                                trackColor={{ false: '#e0e0e0', true: colors.primary }}
                                thumbColor={authAppEnabled ? colors.white : '#f4f3f4'}
                            />
                            {!authAppEnabled && (
                                <TouchableOpacity style={styles.setupBtn} activeOpacity={0.8} onPress={handleSetupAuthApp}>
                                    <AppText variant={Variant.caption} style={styles.setupBtnText}>Setup</AppText>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Backup Codes */}
                <View style={styles.backupCard}>
                    <View style={styles.backupHeader}>
                        <AppText variant={Variant.caption} style={styles.backupIcon}>🔑</AppText>
                        <AppText variant={Variant.bodyMedium} style={styles.backupTitle}>Backup Codes</AppText>
                    </View>
                    <AppText variant={Variant.caption} style={styles.backupDesc}>
                        Use these codes if you lose access to your 2FA methods
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.backupWarning}>
                        ⚠ Keep these codes safe and private
                    </AppText>
                    <AppText variant={Variant.bodyMedium} style={styles.backupCount}>5 codes remaining</AppText>

                    <View style={styles.backupBtnRow}>
                        <TouchableOpacity style={styles.backupBtnView} activeOpacity={0.8} onPress={handleViewCodes}>
                            <AppText variant={Variant.caption} style={styles.backupBtnViewText}>View Codes</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.backupBtnGen} activeOpacity={0.8} onPress={handleGenerateNew}>
                            <AppText variant={Variant.caption} style={styles.backupBtnGenText}>Generate New</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Lost access card */}
                <View style={styles.lostCard}>
                    <AppText variant={Variant.caption} style={styles.lostIcon}>ℹ</AppText>
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.bodyMedium} style={styles.lostTitle}>Lost access to 2FA?</AppText>
                        <AppText variant={Variant.caption} style={styles.lostDesc}>
                            Use your backup codes or contact support{'\n'}support@squadgoo.com.au
                        </AppText>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default TwoFactorAuth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(2),
    },
    statusBannerOff: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
    },
    statusTitle: {
        color: '#166534',
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    statusTitleOff: {
        color: '#92400E',
    },
    statusDesc: {
        color: '#15803D',
        fontSize: getFontSize(12),
        marginTop: hp(0.2),
    },
    statusDescOff: {
        color: '#B45309',
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        overflow: 'hidden',
        marginBottom: hp(2),
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
    },
    toggleLabel: {
        color: colors.secondary || '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    toggleDesc: {
        color: colors.gray,
        fontSize: getFontSize(12),
    },
    sectionTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(17),
        marginBottom: hp(1.2),
    },
    divider: {
        height: 1,
        backgroundColor: colors.border || '#E8E8EF',
        marginLeft: wp(4),
    },
    methodRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
    },
    methodLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        marginBottom: hp(0.2),
    },
    methodIcon: {
        fontSize: getFontSize(14),
    },
    methodLabel: {
        color: colors.secondary || '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    methodPhone: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginBottom: hp(0.2),
    },
    methodRight: {
        alignItems: 'center',
    },
    setupBtn: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.6),
        marginTop: hp(0.5),
    },
    setupBtnText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    backupCard: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(2),
    },
    backupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        marginBottom: hp(0.5),
    },
    backupIcon: {
        fontSize: getFontSize(14),
    },
    backupTitle: {
        color: '#92400E',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    backupDesc: {
        color: '#B45309',
        fontSize: getFontSize(12),
    },
    backupWarning: {
        color: '#92400E',
        fontSize: getFontSize(11),
        marginTop: hp(0.3),
    },
    backupCount: {
        color: '#92400E',
        fontWeight: '700',
        fontSize: getFontSize(14),
        marginTop: hp(1),
        marginBottom: hp(1),
    },
    backupBtnRow: {
        flexDirection: 'row',
        gap: wp(2),
    },
    backupBtnView: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.8),
    },
    backupBtnViewText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    backupBtnGen: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.8),
    },
    backupBtnGenText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    lostCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2.5),
        backgroundColor: '#EEF4FF',
        borderRadius: 12,
        padding: wp(4),
    },
    lostIcon: {
        fontSize: getFontSize(16),
        color: colors.primary,
    },
    lostTitle: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: getFontSize(13),
        marginBottom: hp(0.3),
    },
    lostDesc: {
        color: colors.primary,
        fontSize: getFontSize(12),
        lineHeight: getFontSize(17),
    },
});
