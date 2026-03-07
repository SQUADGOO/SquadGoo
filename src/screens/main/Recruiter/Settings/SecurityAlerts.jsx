import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const EVENTS = [
    { text: 'Password changed successfully', time: 'Today, 10:30 AM', icon: 'checkmark-circle', color: '#2E7D32' },
    { text: 'New login from iPhone 13 Pro', time: 'Yesterday, 2:15 PM', icon: 'checkmark-circle', color: '#2E7D32' },
    { text: '2FA enabled for your account', time: 'Jan 15, 2024', icon: 'checkmark-circle', color: '#2E7D32' },
];

const SecurityAlerts = ({ navigation }) => {
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [passwordAlerts, setPasswordAlerts] = useState(true);
    const [twoFAAlerts, setTwoFAAlerts] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [phoneAlerts, setPhoneAlerts] = useState(false);
    const [profileAlerts, setProfileAlerts] = useState(false);

    const ToggleRow = ({ icon, label, description, value, onChange }) => (
        <View style={styles.toggleCard}>
            <View style={styles.toggleRow}>
                <AppText variant={Variant.caption} style={styles.toggleIcon}>{icon}</AppText>
                <View style={{ flex: 1 }}>
                    <AppText variant={Variant.body} style={styles.toggleLabel}>{label}</AppText>
                    <AppText variant={Variant.caption} style={styles.toggleDesc}>{description}</AppText>
                </View>
                <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#e0e0e0', true: colors.primary }}
                    thumbColor={value ? colors.white : '#f4f3f4'}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <PoolHeader title="Security Alerts" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Info banner */}
                <View style={styles.infoBanner}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={18} color={colors.primary} />
                    <AppText variant={Variant.caption} style={styles.infoBannerText}>
                        Get notified about important security events
                    </AppText>
                </View>

                {/* Alert toggles */}
                <ToggleRow
                    icon="🔔"
                    label="Login Alerts"
                    description="Notify on new device or location login"
                    value={loginAlerts}
                    onChange={setLoginAlerts}
                />
                <ToggleRow
                    icon="🔑"
                    label="Password Change Alerts"
                    description="Notify when password is changed"
                    value={passwordAlerts}
                    onChange={setPasswordAlerts}
                />
                <ToggleRow
                    icon="🛡"
                    label="2FA Change Alerts"
                    description="Notify when 2FA is enabled/disabled"
                    value={twoFAAlerts}
                    onChange={setTwoFAAlerts}
                />
                <ToggleRow
                    icon="📧"
                    label="Email Change Alerts"
                    description="Notify when email address is updated"
                    value={emailAlerts}
                    onChange={setEmailAlerts}
                />
                <ToggleRow
                    icon="📱"
                    label="Phone Change Alerts"
                    description="Notify when phone number is updated"
                    value={phoneAlerts}
                    onChange={setPhoneAlerts}
                />
                <ToggleRow
                    icon="👤"
                    label="Profile Change Alerts"
                    description="Notify when profile info is modified"
                    value={profileAlerts}
                    onChange={setProfileAlerts}
                />

                {/* Recent Security Events */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>Recent Security Events</AppText>

                <View style={styles.eventsCard}>
                    {EVENTS.map((event, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <View style={styles.divider} />}
                            <View style={styles.eventRow}>
                                <VectorIcons
                                    name={iconLibName.Ionicons}
                                    iconName={event.icon}
                                    size={18}
                                    color={event.color}
                                />
                                <AppText variant={Variant.body} style={styles.eventText}>{event.text}</AppText>
                                <AppText variant={Variant.caption} style={styles.eventTime}>{event.time}</AppText>
                            </View>
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default SecurityAlerts;

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
    toggleCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(1.2),
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
    },
    toggleIcon: {
        fontSize: getFontSize(16),
        marginTop: hp(0.2),
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
        marginTop: hp(1.5),
        marginBottom: hp(1.2),
    },
    eventsCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border || '#E8E8EF',
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        gap: wp(2.5),
    },
    eventText: {
        flex: 1,
        color: colors.black || '#111',
        fontSize: getFontSize(13),
    },
    eventTime: {
        color: colors.gray,
        fontSize: getFontSize(11),
    },
});
