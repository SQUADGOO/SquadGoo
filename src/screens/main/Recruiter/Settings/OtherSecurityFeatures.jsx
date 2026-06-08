import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const TIMEOUT_OPTIONS = [5, 10, 15, 30, 60];

const OtherSecurityFeatures = ({ navigation }) => {
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true);
    const [autoLogoutMinutes, setAutoLogoutMinutes] = useState(30);
    const [sessionWarningEnabled, setSessionWarningEnabled] = useState(true);
    const [showTimeoutPicker, setShowTimeoutPicker] = useState(false);

    const biometricType = Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';
    const biometricIcon = Platform.OS === 'ios' ? 'scan-outline' : 'finger-print';

    const handleBiometricToggle = (val) => {
        if (val) {
            Alert.alert(
                `Enable ${biometricType}`,
                `Allow ${biometricType} for quick, secure login?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Enable', onPress: () => setBiometricEnabled(true) },
                ]
            );
        } else {
            setBiometricEnabled(false);
        }
    };

    return (
        <View style={styles.container}>
            <PoolHeader title="Other Security Features" />

            <ScrollView contentContainerStyle={styles.scroll}>

                {/* ═══════ Biometric Login ═══════ */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                            <VectorIcons name={iconLibName.Ionicons} iconName={biometricIcon} size={22} color="#7B1FA2" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.bodyMedium} style={styles.cardTitle}>Biometric Login</AppText>
                            <AppText variant={Variant.caption} style={styles.cardDesc}>
                                Use {biometricType} for quick, secure access
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.toggleSection}>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.body} style={styles.toggleLabel}>
                                Enable {biometricType}
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                {Platform.OS === 'ios'
                                    ? 'Use Face ID to unlock the app'
                                    : 'Use fingerprint to unlock the app'}
                            </AppText>
                        </View>
                        <Switch
                            value={biometricEnabled}
                            onValueChange={handleBiometricToggle}
                            trackColor={{ false: '#e0e0e0', true: '#7B1FA2' }}
                            thumbColor={biometricEnabled ? colors.white : '#f4f3f4'}
                        />
                    </View>

                    {biometricEnabled && (
                        <View style={styles.statusPill}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={14} color="#2E7D32" />
                            <AppText variant={Variant.caption} style={styles.statusPillText}>
                                {biometricType} is active — you can login without a password
                            </AppText>
                        </View>
                    )}
                </View>

                {/* ═══════ Auto-Logout ═══════ */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="timer-outline" size={22} color="#E65100" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.bodyMedium} style={styles.cardTitle}>Auto-Logout</AppText>
                            <AppText variant={Variant.caption} style={styles.cardDesc}>
                                Automatically logout after inactivity
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.toggleSection}>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.body} style={styles.toggleLabel}>
                                Enable Auto-Logout
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Log out automatically after a period of inactivity
                            </AppText>
                        </View>
                        <Switch
                            value={autoLogoutEnabled}
                            onValueChange={setAutoLogoutEnabled}
                            trackColor={{ false: '#e0e0e0', true: '#E65100' }}
                            thumbColor={autoLogoutEnabled ? colors.white : '#f4f3f4'}
                        />
                    </View>

                    {autoLogoutEnabled && (
                        <>
                            <AppText variant={Variant.caption} style={styles.pickerLabel}>
                                Logout after inactivity of:
                            </AppText>
                            <View style={styles.chipRow}>
                                {TIMEOUT_OPTIONS.map((min) => (
                                    <TouchableOpacity
                                        key={min}
                                        style={[
                                            styles.chip,
                                            autoLogoutMinutes === min && styles.chipActive,
                                        ]}
                                        activeOpacity={0.7}
                                        onPress={() => setAutoLogoutMinutes(min)}
                                    >
                                        <AppText
                                            variant={Variant.caption}
                                            style={[
                                                styles.chipText,
                                                autoLogoutMinutes === min && styles.chipTextActive,
                                            ]}
                                        >
                                            {min} min
                                        </AppText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </View>

                {/* ═══════ Session Timeout Warning ═══════ */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="notifications-outline" size={22} color="#1565C0" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.bodyMedium} style={styles.cardTitle}>Session Timeout Warning</AppText>
                            <AppText variant={Variant.caption} style={styles.cardDesc}>
                                Get notified before your session expires
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.toggleSection}>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.body} style={styles.toggleLabel}>
                                Enable Timeout Warning
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Show a notification 2 minutes before session expires
                            </AppText>
                        </View>
                        <Switch
                            value={sessionWarningEnabled}
                            onValueChange={setSessionWarningEnabled}
                            trackColor={{ false: '#e0e0e0', true: '#1565C0' }}
                            thumbColor={sessionWarningEnabled ? colors.white : '#f4f3f4'}
                        />
                    </View>

                    {sessionWarningEnabled && (
                        <View style={styles.previewCard}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="alert-circle" size={16} color="#B45309" />
                            <View style={{ flex: 1 }}>
                                <AppText variant={Variant.caption} style={styles.previewTitle}>Preview</AppText>
                                <AppText variant={Variant.caption} style={styles.previewText}>
                                    "Your session will expire in 2 minutes. Tap to stay logged in."
                                </AppText>
                            </View>
                        </View>
                    )}
                </View>

                {/* Info note */}
                <View style={styles.infoNote}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={16} color={colors.gray} />
                    <AppText variant={Variant.caption} style={styles.infoNoteText}>
                        These settings apply to the current device only. Biometric availability depends on your device capabilities.
                    </AppText>
                </View>
            </ScrollView>
        </View>
    );
};

export default OtherSecurityFeatures;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(16),
    },
    cardDesc: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginTop: hp(0.2),
    },
    divider: {
        height: 1,
        backgroundColor: colors.border || '#E8E8EF',
        marginVertical: hp(1.5),
    },
    toggleSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleLabel: {
        color: colors.secondary || '#111',
        fontWeight: '600',
        fontSize: getFontSize(14),
    },
    toggleDesc: {
        color: colors.gray,
        fontSize: getFontSize(12),
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        backgroundColor: '#F0FDF4',
        borderRadius: 8,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.7),
        marginTop: hp(1.2),
    },
    statusPillText: {
        color: '#166534',
        fontWeight: '500',
        fontSize: getFontSize(11),
    },
    pickerLabel: {
        color: colors.gray,
        fontWeight: '600',
        fontSize: getFontSize(12),
        marginTop: hp(1.5),
        marginBottom: hp(0.8),
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
    },
    chip: {
        borderWidth: 1.5,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.9),
        backgroundColor: '#FAFAFA',
    },
    chipActive: {
        borderColor: '#E65100',
        backgroundColor: '#FFF3E0',
    },
    chipText: {
        color: colors.gray,
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    chipTextActive: {
        color: '#E65100',
    },
    previewCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 10,
        padding: wp(3),
        marginTop: hp(1.2),
    },
    previewTitle: {
        color: '#92400E',
        fontWeight: '700',
        fontSize: getFontSize(11),
        marginBottom: hp(0.2),
    },
    previewText: {
        color: '#92400E',
        fontSize: getFontSize(11),
        fontStyle: 'italic',
    },
    infoNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        paddingHorizontal: wp(1),
    },
    infoNoteText: {
        color: colors.gray,
        fontSize: getFontSize(12),
        flex: 1,
        lineHeight: getFontSize(17),
    },
});
