import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';
import { screenNames } from '@/navigation/screenNames';

const SECTIONS = [
    {
        key: 'password',
        icon: 'lock-closed',
        iconBg: '#E8F5E9',
        iconColor: '#2E7D32',
        title: 'Password Management',
        subtitle: 'Change password, reset, requirements',
    },
    {
        key: '2fa',
        icon: 'shield-checkmark',
        iconBg: '#EDE7F6',
        iconColor: '#5E35B1',
        title: 'Two-Factor Authentication (2FA)',
        subtitle: 'SMS, Email, Authenticator app',
    },
    {
        key: 'privacy',
        icon: 'eye-off',
        iconBg: '#E3F2FD',
        iconColor: '#1565C0',
        title: 'Privacy Controls',
        subtitle: 'Sessions, visibility, data download',
    },
    {
        key: 'alerts',
        icon: 'warning',
        iconBg: '#FFF3E0',
        iconColor: '#E65100',
        title: 'Security Alerts',
        subtitle: 'Login, password, 2FA notifications',
    },
    {
        key: 'recovery',
        icon: 'key',
        iconBg: '#E8EAF6',
        iconColor: '#283593',
        title: 'Account Recovery',
        subtitle: 'Recovery email, phone, security questions',
    },
    {
        key: 'other',
        icon: 'finger-print',
        iconBg: '#F3E5F5',
        iconColor: '#7B1FA2',
        title: 'Other Security Features',
        subtitle: 'Biometric, auto-logout, timeout',
    },
    {
        key: 'legal',
        icon: 'document-text',
        iconBg: '#E0F2F1',
        iconColor: '#00695C',
        title: 'Legal & Compliance',
        subtitle: 'Privacy policy, terms, licenses',
    },
];

const SecurityPassword = ({ navigation }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSectionPress = (section) => {
        switch (section.key) {
            case 'password':
                navigation.navigate(screenNames.PASSWORD_MANAGEMENT);
                break;
            case '2fa':
                navigation.navigate(screenNames.TWO_FACTOR_AUTH);
                break;
            case 'privacy':
                navigation.navigate(screenNames.PRIVACY_CONTROLS);
                break;
            case 'alerts':
                navigation.navigate(screenNames.SECURITY_ALERTS);
                break;
            case 'recovery':
                navigation.navigate(screenNames.ACCOUNT_RECOVERY);
                break;
            case 'other':
                Alert.alert(
                    'Other Security Features',
                    '• Biometric login: Available\n• Auto-logout: After 30 minutes of inactivity\n• Session timeout: 24 hours'
                );
                break;
            case 'legal':
                Alert.alert(
                    'Legal & Compliance',
                    '• Privacy Policy\n• Terms of Service\n• Open Source Licenses\n• Data Processing Agreement'
                );
                break;
            default:
                break;
        }
    };

    const confirmDeleteAccount = () => {
        setShowDeleteModal(false);
        Alert.alert(
            'Account Deletion',
            'Your account deletion request has been submitted. You will receive an email confirmation.'
        );
    };

    return (
        <View style={styles.container}>
            <PoolHeader title="Security & Password" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Security Status Banner */}
                <View style={styles.statusBanner}>
                    <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="shield-checkmark"
                        size={24}
                        color="#166534"
                    />
                    <View style={styles.statusContent}>
                        <AppText variant={Variant.bodyMedium} style={styles.statusTitle}>
                            Your account is secure
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.statusDesc}>
                            2FA enabled • Strong password • 3 active sessions
                        </AppText>
                    </View>
                </View>

                {/* Section Rows */}
                <View style={styles.card}>
                    {SECTIONS.map((section, index) => (
                        <React.Fragment key={section.key}>
                            {index > 0 && <View style={styles.divider} />}
                            <TouchableOpacity
                                style={styles.row}
                                activeOpacity={0.7}
                                onPress={() => handleSectionPress(section)}
                            >
                                <View style={[styles.rowIconWrap, { backgroundColor: section.iconBg }]}>
                                    <VectorIcons
                                        name={iconLibName.Ionicons}
                                        iconName={section.icon}
                                        size={18}
                                        color={section.iconColor}
                                    />
                                </View>
                                <View style={styles.rowContent}>
                                    <AppText variant={Variant.body} style={styles.rowTitle}>
                                        {section.title}
                                    </AppText>
                                    <AppText variant={Variant.caption} style={styles.rowSubtitle}>
                                        {section.subtitle}
                                    </AppText>
                                </View>
                                <VectorIcons
                                    name={iconLibName.Ionicons}
                                    iconName="chevron-forward"
                                    size={18}
                                    color={colors.gray}
                                />
                            </TouchableOpacity>
                        </React.Fragment>
                    ))}
                </View>

                {/* Delete Account */}
                <View style={[styles.card, styles.dangerCard, { marginTop: hp(2.5) }]}>
                    <TouchableOpacity
                        style={styles.dangerRow}
                        activeOpacity={0.7}
                        onPress={() => setShowDeleteModal(true)}
                    >
                        <View style={[styles.rowIconWrap, { backgroundColor: '#FDECEC' }]}>
                            <VectorIcons
                                name={iconLibName.Ionicons}
                                iconName="trash-outline"
                                size={18}
                                color="#DC3545"
                            />
                        </View>
                        <View style={styles.rowContent}>
                            <AppText variant={Variant.body} style={styles.dangerTitle}>
                                Delete Account
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.rowSubtitle}>
                                Permanently remove all data
                            </AppText>
                        </View>
                        <VectorIcons
                            name={iconLibName.Ionicons}
                            iconName="chevron-forward"
                            size={18}
                            color="#DC3545"
                        />
                    </TouchableOpacity>
                </View>

                {/* Delete Account Modal */}
                <Modal
                    visible={showDeleteModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowDeleteModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.sheetBackdrop}
                        onPress={() => setShowDeleteModal(false)}
                    >
                        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
                            <View style={styles.sheetHandle} />
                            <View style={styles.deleteIconWrap}>
                                <VectorIcons
                                    name={iconLibName.Ionicons}
                                    iconName="warning-outline"
                                    size={36}
                                    color="#DC3545"
                                />
                            </View>
                            <AppText variant={Variant.h6} style={[styles.sheetTitle, { color: '#DC3545' }]}>
                                Delete Account
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.sheetSubtitle}>
                                This action is permanent. All your data, offers, and profile information will be
                                permanently removed and cannot be recovered.
                            </AppText>

                            <View style={styles.sheetButtonRow}>
                                <TouchableOpacity
                                    style={[styles.sheetButton, styles.sheetButtonSecondary]}
                                    onPress={() => setShowDeleteModal(false)}
                                >
                                    <AppText variant={Variant.body} style={styles.sheetButtonSecondaryText}>
                                        Cancel
                                    </AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.sheetButton, styles.sheetButtonDanger]}
                                    onPress={confirmDeleteAccount}
                                >
                                    <AppText variant={Variant.body} style={styles.sheetButtonPrimaryText}>
                                        Delete Account
                                    </AppText>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
        </View>
    );
};

export default SecurityPassword;

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
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(2),
        gap: wp(3),
    },
    statusContent: {
        flex: 1,
    },
    statusTitle: {
        color: '#166534',
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    statusDesc: {
        color: '#15803D',
        fontSize: getFontSize(12),
        marginTop: hp(0.2),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    dangerCard: {
        borderColor: '#FECACA',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border || '#E8E8EF',
        marginLeft: wp(4) + 38,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
        backgroundColor: colors.white,
    },
    dangerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
        backgroundColor: '#FFF5F5',
    },
    rowIconWrap: {
        height: 34,
        width: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowContent: {
        flex: 1,
        marginLeft: wp(3),
    },
    rowTitle: {
        color: colors.black || '#111',
        fontWeight: '600',
        fontSize: getFontSize(14),
    },
    dangerTitle: {
        color: '#DC3545',
        fontWeight: '600',
        fontSize: getFontSize(14),
    },
    rowSubtitle: {
        color: colors.gray,
        marginTop: hp(0.3),
        fontSize: getFontSize(12),
    },
    // Modal styles
    sheetBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingHorizontal: wp(4),
        paddingTop: hp(1.2),
        paddingBottom: hp(3),
    },
    sheetHandle: {
        alignSelf: 'center',
        width: wp(12),
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border || '#E0E0E0',
        marginBottom: hp(1.2),
    },
    deleteIconWrap: {
        alignSelf: 'center',
        marginBottom: hp(1),
    },
    sheetTitle: {
        fontWeight: '700',
        fontSize: getFontSize(16),
        textAlign: 'center',
        marginBottom: hp(0.5),
    },
    sheetSubtitle: {
        color: colors.gray,
        textAlign: 'center',
        marginBottom: hp(2),
        lineHeight: getFontSize(18),
    },
    sheetButtonRow: {
        flexDirection: 'row',
        gap: wp(3),
        marginTop: hp(1),
    },
    sheetButton: {
        flex: 1,
        paddingVertical: hp(1.6),
        borderRadius: 12,
        alignItems: 'center',
    },
    sheetButtonDanger: {
        backgroundColor: '#DC3545',
    },
    sheetButtonSecondary: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
    },
    sheetButtonPrimaryText: {
        color: colors.white,
        fontWeight: '600',
    },
    sheetButtonSecondaryText: {
        color: colors.black || '#111',
        fontWeight: '600',
    },
});
