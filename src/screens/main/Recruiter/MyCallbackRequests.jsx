import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';

const INITIAL_CALLBACKS = [
    {
        id: 'CB-1042',
        subject: 'Top-up SG Coins Issues',
        requestedTime: '2:05 PM, Feb 3, 2026',
        status: 'Pending',
    },
    {
        id: 'CB-1038',
        subject: 'Job Offer Issues',
        requestedTime: '1:45 PM, Feb 3, 2026',
        status: 'Called',
    },
    {
        id: 'CB-1031',
        subject: 'Withdrawals',
        requestedTime: '1:20 PM, Feb 2, 2026',
        status: 'Completed',
    },
];

const MyCallbackRequests = ({ navigation }) => {
    const [callbacks, setCallbacks] = useState(INITIAL_CALLBACKS);
    const [cancelTarget, setCancelTarget] = useState(null);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Pending':
                return {
                    bg: '#FEF3C7',
                    text: '#92400E',
                    badgeBg: '#FCD34D',
                    badgeText: '#92400E',
                    border: '#FDE68A',
                    cardBg: '#FFFBEB',
                };
            case 'Called':
                return {
                    bg: '#DBEAFE',
                    text: '#1E40AF',
                    badgeBg: '#3B82F6',
                    badgeText: '#FFFFFF',
                    border: '#93C5FD',
                    cardBg: '#EFF6FF',
                };
            case 'Completed':
                return {
                    bg: '#D1FAE5',
                    text: '#065F46',
                    badgeBg: '#10B981',
                    badgeText: '#FFFFFF',
                    border: '#6EE7B7',
                    cardBg: '#ECFDF5',
                };
            case 'Cancelled':
                return {
                    bg: '#FEE2E2',
                    text: '#991B1B',
                    badgeBg: '#EF4444',
                    badgeText: '#FFFFFF',
                    border: '#FECACA',
                    cardBg: '#FEF2F2',
                };
            default:
                return {
                    bg: '#F3F4F6',
                    text: '#374151',
                    badgeBg: '#6B7280',
                    badgeText: '#FFFFFF',
                    border: '#D1D5DB',
                    cardBg: '#F9FAFB',
                };
        }
    };

    const handleCancelPress = (callback) => {
        setCancelTarget(callback);
    };

    const confirmCancel = () => {
        if (cancelTarget) {
            setCallbacks(prev =>
                prev.map(cb =>
                    cb.id === cancelTarget.id ? { ...cb, status: 'Cancelled' } : cb
                )
            );
            setCancelTarget(null);
        }
    };

    return (
        <View style={styles.screen}>
            {/* Header */}
            <LinearGradient
                colors={[colors.primary || '#6C3CE1', '#8B5CF6', '#A78BFA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroHeader}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="arrow-back" size={22} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.heroContent}>
                    <AppText variant={Variant.caption} style={styles.heroLabel}>SQUADGOO</AppText>
                    <AppText variant={Variant.h6} style={styles.heroTitle}>My Callback Requests</AppText>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scroll}>
                {callbacks.length === 0 ? (
                    /* ═══════ Empty State ═══════ */
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="call-outline" size={48} color="#A0AEC0" />
                        </View>
                        <AppText variant={Variant.h6} style={styles.emptyTitle}>
                            You have no callback requests yet
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.emptySubtitle}>
                            When you request a callback, it will appear here so you can track its status.
                        </AppText>
                    </View>
                ) : (
                    /* ═══════ Callback Cards ═══════ */
                    callbacks.map((cb) => {
                        const config = getStatusConfig(cb.status);
                        return (
                            <View
                                key={cb.id}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: config.cardBg,
                                        borderColor: config.border,
                                    },
                                ]}
                            >
                                <View style={styles.cardTop}>
                                    <View style={styles.cardInfo}>
                                        <AppText variant={Variant.caption} style={styles.cardLabel}>Subject</AppText>
                                        <AppText variant={Variant.bodyMedium} style={styles.cardSubject}>
                                            {cb.subject}
                                        </AppText>
                                        <View style={styles.cardTimeRow}>
                                            <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={12} color="#888" />
                                            <AppText variant={Variant.caption} style={styles.cardTime}>
                                                Requested time: {cb.requestedTime}
                                            </AppText>
                                        </View>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: config.badgeBg }]}>
                                        <AppText variant={Variant.caption} style={[styles.statusText, { color: config.badgeText }]}>
                                            {cb.status}
                                        </AppText>
                                    </View>
                                </View>

                                {/* Cancel button — only for Pending */}
                                {cb.status === 'Pending' && (
                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        activeOpacity={0.7}
                                        onPress={() => handleCancelPress(cb)}
                                    >
                                        <AppText variant={Variant.caption} style={styles.cancelBtnText}>Cancel</AppText>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}

                {/* No Answer Info */}
                {callbacks.length > 0 && (
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={18} color={colors.primary} />
                            <AppText variant={Variant.bodyMedium} style={styles.infoTitle}>No Answer Handling</AppText>
                        </View>
                        <View style={styles.infoItem}>
                            <AppText variant={Variant.caption} style={styles.infoBullet}>•</AppText>
                            <AppText variant={Variant.caption} style={styles.infoText}>
                                If you don't answer, our team will leave a voicemail or send you an SMS.
                            </AppText>
                        </View>
                        <View style={styles.infoItem}>
                            <AppText variant={Variant.caption} style={styles.infoBullet}>•</AppText>
                            <AppText variant={Variant.caption} style={styles.infoText}>
                                You can reschedule via the app or submit a new callback request anytime.
                            </AppText>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* ═══════ Cancel Confirmation Modal ═══════ */}
            <Modal
                visible={!!cancelTarget}
                transparent
                animationType="fade"
                onRequestClose={() => setCancelTarget(null)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.confirmCard}>
                        {/* App logo area */}
                        <View style={styles.confirmLogoRow}>
                            <View style={styles.confirmLogoDot} />
                            <AppText variant={Variant.caption} style={styles.confirmLogoText}>SQUADGOO</AppText>
                        </View>
                        <AppText variant={Variant.h6} style={styles.confirmTitle}>
                            Cancel Callback
                        </AppText>
                        <View style={styles.confirmMsgRow}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="help-circle-outline" size={22} color="#555" />
                            <AppText variant={Variant.body} style={styles.confirmMsg}>
                                Are you sure you want to cancel this callback request?
                            </AppText>
                        </View>
                        <View style={styles.confirmBtnRow}>
                            <TouchableOpacity
                                style={styles.confirmBtnCancel}
                                activeOpacity={0.8}
                                onPress={confirmCancel}
                            >
                                <AppText variant={Variant.bodyMedium} style={styles.confirmBtnCancelText}>Cancel Request</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmBtnKeep}
                                activeOpacity={0.8}
                                onPress={() => setCancelTarget(null)}
                            >
                                <AppText variant={Variant.bodyMedium} style={styles.confirmBtnKeepText}>No, Keep It</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MyCallbackRequests;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    heroHeader: {
        paddingTop: hp(5),
        paddingBottom: hp(2.5),
        paddingHorizontal: wp(4),
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(1),
    },
    heroContent: {
        alignItems: 'center',
    },
    heroLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
        fontSize: getFontSize(11),
        letterSpacing: 1.5,
        marginBottom: hp(0.3),
    },
    heroTitle: {
        color: colors.white,
        fontWeight: '800',
        fontSize: getFontSize(22),
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    // Cards
    card: {
        borderRadius: 16,
        borderWidth: 1.5,
        padding: wp(4),
        marginBottom: hp(1.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardInfo: {
        flex: 1,
        marginRight: wp(3),
    },
    cardLabel: {
        color: '#888',
        fontSize: getFontSize(10),
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: hp(0.3),
    },
    cardSubject: {
        color: '#111',
        fontWeight: '800',
        fontSize: getFontSize(16),
        marginBottom: hp(0.5),
    },
    cardTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    cardTime: {
        color: '#888',
        fontSize: getFontSize(11),
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.4),
        alignSelf: 'flex-start',
        marginTop: hp(0.3),
    },
    statusText: {
        fontWeight: '700',
        fontSize: getFontSize(11),
    },
    cancelBtn: {
        alignSelf: 'flex-start',
        backgroundColor: '#DC3545',
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.6),
        marginTop: hp(1),
    },
    cancelBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(12),
    },
    // Empty state
    emptyState: {
        alignItems: 'center',
        paddingTop: hp(10),
        paddingHorizontal: wp(8),
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EDF2F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(3),
    },
    emptyTitle: {
        color: '#333',
        fontWeight: '700',
        fontSize: getFontSize(18),
        textAlign: 'center',
        marginBottom: hp(1),
    },
    emptySubtitle: {
        color: '#888',
        fontSize: getFontSize(13),
        textAlign: 'center',
        lineHeight: getFontSize(19),
    },
    // Info card
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8E8EF',
        padding: wp(4),
        marginTop: hp(1),
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(1),
    },
    infoTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    infoItem: {
        flexDirection: 'row',
        gap: wp(2),
        marginBottom: hp(0.5),
        paddingLeft: wp(1),
    },
    infoBullet: {
        color: '#555',
        fontSize: getFontSize(12),
    },
    infoText: {
        color: '#555',
        fontSize: getFontSize(12),
        flex: 1,
        lineHeight: getFontSize(17),
    },
    // Cancel confirmation modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(8),
    },
    confirmCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: wp(6),
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    confirmLogoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        marginBottom: hp(1.5),
    },
    confirmLogoDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
    },
    confirmLogoText: {
        color: colors.primary,
        fontWeight: '800',
        fontSize: getFontSize(12),
        letterSpacing: 1,
    },
    confirmTitle: {
        color: '#111',
        fontWeight: '800',
        fontSize: getFontSize(18),
        marginBottom: hp(1.5),
    },
    confirmMsgRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        marginBottom: hp(2.5),
    },
    confirmMsg: {
        flex: 1,
        color: '#555',
        fontSize: getFontSize(14),
        lineHeight: getFontSize(20),
    },
    confirmBtnRow: {
        flexDirection: 'row',
        gap: wp(3),
        width: '100%',
    },
    confirmBtnCancel: {
        flex: 1,
        backgroundColor: '#DC3545',
        borderRadius: 12,
        paddingVertical: hp(1.3),
        alignItems: 'center',
    },
    confirmBtnCancelText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
    confirmBtnKeep: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingVertical: hp(1.3),
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E8E8EF',
    },
    confirmBtnKeepText: {
        color: '#555',
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
});
