import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppDropDown from '@/core/AppDropDown';
import PoolHeader from '../../../../core/PoolHeader';

const DEVICES = [
    {
        name: 'iPhone 13 Pro - Sydney, AU',
        detail: 'Current session • iOS 17.1',
        active: true,
        icon: 'phone-portrait',
        iconColor: '#2E7D32',
    },
    {
        name: 'MacBook Pro - Sydney, AU',
        detail: 'Last active: 2 hours ago',
        active: false,
        icon: 'laptop',
        iconColor: '#1565C0',
    },
    {
        name: 'iPad Air - Melbourne, AU',
        detail: 'Last active: 3 days ago',
        active: false,
        icon: 'tablet-portrait',
        iconColor: '#7B1FA2',
    },
];

const visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Jobseekers', value: 'jobseekers' },
    { label: 'Private', value: 'private' },
];

const PrivacyControls = ({ navigation }) => {
    const [visibility, setVisibility] = useState('jobseekers');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [maskingEnabled, setMaskingEnabled] = useState(true);
    const [sessions, setSessions] = useState(DEVICES);

    const handleLogout = (index) => {
        Alert.alert(
            'Logout Device',
            `Are you sure you want to logout "${sessions[index].name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        const updated = sessions.filter((_, i) => i !== index);
                        setSessions(updated);
                    },
                },
            ]
        );
    };

    const handleLogoutAll = () => {
        Alert.alert(
            'Logout All Devices',
            'This will log you out of all other devices. You will remain logged in on this device.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout All',
                    style: 'destructive',
                    onPress: () => {
                        setSessions(sessions.filter(s => s.active));
                    },
                },
            ]
        );
    };

    const handleRequestDownload = () => {
        Alert.alert(
            'Data Request Submitted',
            'Your data export has been requested. You will receive a download link via email within 24 hours.'
        );
    };

    const otherDevices = sessions.filter(s => !s.active);

    return (
        <View style={styles.container}>
            <PoolHeader title="Privacy Controls" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Session Management */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>Session Management</AppText>

                <View style={styles.card}>
                    <View style={styles.sessionHeader}>
                        <AppText variant={Variant.bodyMedium} style={styles.sessionHeaderTitle}>Active Sessions</AppText>
                        <AppText variant={Variant.caption} style={styles.sessionCount}>{sessions.length} devices</AppText>
                    </View>

                    {sessions.map((device, index) => (
                        <View key={index}>
                            <View style={styles.divider} />
                            <View style={styles.deviceRow}>
                                <View style={[styles.deviceIcon, { backgroundColor: device.iconColor + '15' }]}>
                                    <VectorIcons
                                        name={iconLibName.Ionicons}
                                        iconName={device.icon}
                                        size={18}
                                        color={device.iconColor}
                                    />
                                </View>
                                <View style={styles.deviceInfo}>
                                    <AppText variant={Variant.body} style={styles.deviceName}>{device.name}</AppText>
                                    <AppText variant={Variant.caption} style={styles.deviceDetail}>{device.detail}</AppText>
                                </View>
                                {device.active ? (
                                    <View style={styles.activePill}>
                                        <AppText variant={Variant.caption} style={styles.activePillText}>Active</AppText>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => handleLogout(index)}>
                                        <AppText variant={Variant.caption} style={styles.logoutText}>Logout</AppText>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {otherDevices.length > 0 && (
                    <TouchableOpacity style={styles.logoutAllBtn} activeOpacity={0.8} onPress={handleLogoutAll}>
                        <AppText variant={Variant.bodyMedium} style={styles.logoutAllText}>Logout All Other Devices</AppText>
                    </TouchableOpacity>
                )}

                {/* Account Visibility */}
                <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(2.5) }]}>Account Visibility</AppText>

                <View style={styles.fieldCard}>
                    <AppText variant={Variant.body} style={styles.fieldLabel}>Who can see your profile</AppText>
                    <AppText variant={Variant.caption} style={styles.fieldDesc}>
                        Control who can view your contact information
                    </AppText>
                    <AppDropDown
                        placeholder="Select Visibility"
                        options={visibilityOptions}
                        selectedValue={visibility}
                        onSelect={(val) => setVisibility(val)}
                        isVisible={isDropdownVisible}
                        setIsVisible={setDropdownVisible}
                    />
                </View>

                {/* Contact Info Masking */}
                <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(1) }]}>Contact Info Masking</AppText>

                <View style={styles.card}>
                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.body} style={styles.toggleLabel}>
                                Mask phone/email after 30 days
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Hide contact details from matched candidates after 30 days
                            </AppText>
                        </View>
                        <Switch
                            value={maskingEnabled}
                            onValueChange={setMaskingEnabled}
                            trackColor={{ false: '#e0e0e0', true: colors.primary }}
                            thumbColor={maskingEnabled ? colors.white : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Data Download/Export */}
                <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(1) }]}>Data Download/Export</AppText>

                <View style={styles.downloadCard}>
                    <View style={styles.downloadHeader}>
                        <AppText variant={Variant.caption} style={styles.downloadIcon}>📥</AppText>
                        <AppText variant={Variant.bodyMedium} style={styles.downloadTitle}>Download Your Data</AppText>
                    </View>
                    <AppText variant={Variant.caption} style={styles.downloadDesc}>
                        Get a copy of your personal data for your records
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.downloadIncludes}>
                        Includes: profile info, job history, messages, settings
                    </AppText>
                    <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8} onPress={handleRequestDownload}>
                        <AppText variant={Variant.caption} style={styles.downloadBtnText}>Request Download</AppText>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoNote}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={16} color={colors.gray} />
                    <AppText variant={Variant.caption} style={styles.infoNoteText}>
                        Data Processing: Your data will be prepared within 24 hours
                    </AppText>
                </View>
            </ScrollView>
        </View>
    );
};

export default PrivacyControls;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    sectionTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(17),
        marginBottom: hp(1.2),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        overflow: 'hidden',
        marginBottom: hp(1.5),
    },
    divider: {
        height: 1,
        backgroundColor: colors.border || '#E8E8EF',
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
    },
    sessionHeaderTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    sessionCount: {
        color: colors.gray,
        fontSize: getFontSize(12),
    },
    deviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
    },
    deviceIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceInfo: {
        flex: 1,
        marginLeft: wp(3),
    },
    deviceName: {
        color: colors.black || '#111',
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    deviceDetail: {
        color: colors.gray,
        fontSize: getFontSize(11),
        marginTop: hp(0.2),
    },
    activePill: {
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.4),
    },
    activePillText: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    logoutText: {
        color: '#DC3545',
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    logoutAllBtn: {
        backgroundColor: '#DC3545',
        borderRadius: 12,
        paddingVertical: hp(1.4),
        alignItems: 'center',
        marginBottom: hp(1),
    },
    logoutAllText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    fieldCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(2),
    },
    fieldLabel: {
        color: colors.secondary || '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
        marginBottom: hp(0.3),
    },
    fieldDesc: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginBottom: hp(1.2),
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
    downloadCard: {
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(1.5),
    },
    downloadHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        marginBottom: hp(0.5),
    },
    downloadIcon: {
        fontSize: getFontSize(14),
    },
    downloadTitle: {
        color: '#166534',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    downloadDesc: {
        color: '#15803D',
        fontSize: getFontSize(12),
    },
    downloadIncludes: {
        color: '#15803D',
        fontSize: getFontSize(11),
        marginTop: hp(0.3),
        marginBottom: hp(1.2),
    },
    downloadBtn: {
        backgroundColor: '#DC3545',
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.8),
        alignSelf: 'flex-start',
    },
    downloadBtnText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    infoNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        paddingHorizontal: wp(1),
    },
    infoNoteText: {
        color: colors.gray,
        fontSize: getFontSize(12),
    },
});
