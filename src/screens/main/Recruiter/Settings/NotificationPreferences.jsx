import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const NotificationPreferences = ({ navigation }) => {
    // ======== NOTIFICATION CHANNELS ========
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(true);

    // ======== NOTIFICATION TYPES ========
    const [jobMatches, setJobMatches] = useState(true);
    const [applicationReceived, setApplicationReceived] = useState(true);
    const [shiftReminders, setShiftReminders] = useState(true);
    const [paymentConfirmations, setPaymentConfirmations] = useState(true);
    const [disputeAlerts, setDisputeAlerts] = useState(true);
    const [systemUpdates, setSystemUpdates] = useState(false);
    const [marketing, setMarketing] = useState(false);

    // ======== QUIET HOURS ========
    const [quietHours, setQuietHours] = useState(true);

    // Toggle row helper
    const ToggleRow = ({ icon, label, description, value, onChange, highlight, extraInfo }) => (
        <View style={[styles.toggleCard, highlight && styles.toggleCardHighlight]}>
            <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                    <View style={styles.toggleLabelRow}>
                        {icon ? (
                            <AppText variant={Variant.caption} style={styles.toggleIcon}>{icon}</AppText>
                        ) : null}
                        <AppText variant={Variant.body} style={styles.toggleLabel}>
                            {label}
                        </AppText>
                    </View>
                    <AppText variant={Variant.caption} style={styles.toggleDesc}>
                        {description}
                    </AppText>
                    {extraInfo ? (
                        <AppText variant={Variant.caption} style={styles.extraInfo}>
                            {extraInfo}
                        </AppText>
                    ) : null}
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
            <PoolHeader title="Notification Preferences" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* ======== NOTIFICATION CHANNELS ======== */}
                <AppText variant={Variant.caption} style={styles.sectionLabel}>
                    NOTIFICATION CHANNELS
                </AppText>

                <ToggleRow
                    icon="🔔"
                    label="Push Notifications"
                    description="Receive alerts on your device"
                    value={pushEnabled}
                    onChange={setPushEnabled}
                />
                <ToggleRow
                    icon="📧"
                    label="Email Notifications"
                    description="Receive updates via email"
                    value={emailEnabled}
                    onChange={setEmailEnabled}
                />
                <ToggleRow
                    icon="💬"
                    label="SMS Notifications"
                    description="Receive text messages to +61 412 345 678"
                    extraInfo="Standard SMS rates may apply • Max 10 SMS/day"
                    value={smsEnabled}
                    onChange={setSmsEnabled}
                    highlight
                />

                {/* ======== NOTIFICATION TYPES ======== */}
                <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2) }]}>
                    NOTIFICATION TYPES
                </AppText>

                <ToggleRow
                    label="Job Matches"
                    description="When AI finds matching candidates"
                    value={jobMatches}
                    onChange={setJobMatches}
                />
                <ToggleRow
                    label="Application Received"
                    description="When candidate applies to your job"
                    value={applicationReceived}
                    onChange={setApplicationReceived}
                />
                <ToggleRow
                    label="Shift Reminders"
                    description="24h and 1h before scheduled shifts"
                    value={shiftReminders}
                    onChange={setShiftReminders}
                />
                <ToggleRow
                    label="Payment Confirmations"
                    description="When payments are processed"
                    value={paymentConfirmations}
                    onChange={setPaymentConfirmations}
                />
                <ToggleRow
                    label="Dispute Alerts"
                    description="When a dispute is filed or resolved"
                    value={disputeAlerts}
                    onChange={setDisputeAlerts}
                />
                <ToggleRow
                    label="System Updates"
                    description="App updates and maintenance notices"
                    value={systemUpdates}
                    onChange={setSystemUpdates}
                />
                <ToggleRow
                    label="Marketing & Promotions"
                    description="New features and special offers"
                    value={marketing}
                    onChange={setMarketing}
                />

                {/* ======== QUIET HOURS ======== */}
                <View style={styles.quietHoursCard}>
                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.toggleLabelRow}>
                                <AppText variant={Variant.caption} style={styles.toggleIcon}>🌙</AppText>
                                <AppText variant={Variant.body} style={styles.toggleLabel}>
                                    Quiet Hours
                                </AppText>
                            </View>
                            <AppText variant={Variant.caption} style={styles.toggleDesc}>
                                Pause non-urgent notifications during:
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.quietHoursTime}>
                                10:00 PM → 7:00 AM
                            </AppText>
                        </View>
                        <Switch
                            value={quietHours}
                            onValueChange={setQuietHours}
                            trackColor={{ false: '#e0e0e0', true: colors.primary }}
                            thumbColor={quietHours ? colors.white : '#f4f3f4'}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default NotificationPreferences;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    sectionLabel: {
        color: colors.gray,
        fontWeight: '600',
        letterSpacing: 0.8,
        fontSize: getFontSize(11),
        marginBottom: hp(1.2),
    },
    toggleCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(1.2),
    },
    toggleCardHighlight: {
        backgroundColor: '#F0FDF4',
        borderColor: '#BBF7D0',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    toggleLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        marginBottom: hp(0.3),
    },
    toggleIcon: {
        fontSize: getFontSize(14),
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
    extraInfo: {
        color: '#15803D',
        fontSize: getFontSize(11),
        marginTop: hp(0.4),
        fontWeight: '500',
    },
    quietHoursCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FDE68A',
        padding: wp(4),
        marginTop: hp(2),
    },
    quietHoursTime: {
        color: '#92400E',
        fontSize: getFontSize(13),
        fontWeight: '700',
        marginTop: hp(0.5),
    },
});
