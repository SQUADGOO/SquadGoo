import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';

// Mock shift data
const MOCK_SHIFT = {
    jobTitle: 'Warehouse Night Shift',
    candidateName: 'Sarah J.',
    hourlyRate: 35.00,
    scheduledHours: 5,
    hoursWorked: 2.5, // simulated current state
    clockInTime: '6:00 PM',
    totalDeducted: 87.50,
    remainingWallet: 1662.50,
};

const LiveShiftTracker = ({ onViewDetails }) => {
    const [shift] = useState(MOCK_SHIFT);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const progress = shift.hoursWorked / shift.scheduledHours;
    const isNearEnd = progress >= 0.8;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 1500,
            useNativeDriver: false,
        }).start();

        // Pulse the timer when active
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.02, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const formatTime = (hours) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m.toString().padStart(2, '0')}m`;
    };

    const remainingHours = shift.scheduledHours - shift.hoursWorked;

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <AppText variant={Variant.caption} style={styles.liveText}>LIVE SHIFT</AppText>
                </View>
                <AppText variant={Variant.caption} style={styles.clockInLabel}>
                    Clocked in: {shift.clockInTime}
                </AppText>
            </View>

            {/* Job info */}
            <View style={styles.jobRow}>
                <View style={styles.avatar}>
                    <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
                        {shift.candidateName.split(' ').map(w => w[0]).join('')}
                    </AppText>
                </View>
                <View style={{ flex: 1 }}>
                    <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>{shift.jobTitle}</AppText>
                    <AppText variant={Variant.caption} style={styles.candidateName}>{shift.candidateName}</AppText>
                </View>
                <View style={styles.rateBox}>
                    <AppText variant={Variant.caption} style={styles.rateLabel}>Rate</AppText>
                    <AppText variant={Variant.bodyMedium} style={styles.rateValue}>${shift.hourlyRate}/hr</AppText>
                </View>
            </View>

            {/* Timer */}
            <Animated.View style={[styles.timerSection, { transform: [{ scale: pulseAnim }] }]}>
                <AppText variant={Variant.h4} style={styles.timerValue}>{formatTime(shift.hoursWorked)}</AppText>
                <AppText variant={Variant.caption} style={styles.timerSub}>
                    of {shift.scheduledHours}h scheduled
                </AppText>
            </Animated.View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                                backgroundColor: isNearEnd ? '#F59E0B' : '#6366F1',
                            },
                        ]}
                    />
                </View>
                <View style={styles.progressLabels}>
                    <AppText variant={Variant.caption} style={styles.progressLabelText}>0h</AppText>
                    <AppText variant={Variant.caption} style={styles.progressLabelText}>{shift.scheduledHours}h</AppText>
                </View>
            </View>

            {/* Warning if near end */}
            {isNearEnd && (
                <View style={styles.warningBox}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="warning" size={14} color="#F59E0B" />
                    <AppText variant={Variant.caption} style={styles.warningText}>
                        {formatTime(remainingHours)} remaining — auto clock-out at {shift.scheduledHours}h
                    </AppText>
                </View>
            )}

            {/* Deduction summary */}
            <View style={styles.deductionRow}>
                <View style={styles.deductionItem}>
                    <AppText variant={Variant.caption} style={styles.deductionLabel}>Deducted So Far</AppText>
                    <AppText variant={Variant.bodyMedium} style={[styles.deductionValue, { color: '#EF4444' }]}>
                        -${shift.totalDeducted.toFixed(2)}
                    </AppText>
                </View>
                <View style={styles.deductionDivider} />
                <View style={styles.deductionItem}>
                    <AppText variant={Variant.caption} style={styles.deductionLabel}>On Hold (Escrow)</AppText>
                    <AppText variant={Variant.bodyMedium} style={[styles.deductionValue, { color: '#F59E0B' }]}>
                        ${shift.totalDeducted.toFixed(2)}
                    </AppText>
                </View>
                <View style={styles.deductionDivider} />
                <View style={styles.deductionItem}>
                    <AppText variant={Variant.caption} style={styles.deductionLabel}>Wallet Balance</AppText>
                    <AppText variant={Variant.bodyMedium} style={[styles.deductionValue, { color: '#16A34A' }]}>
                        ${shift.remainingWallet.toFixed(2)}
                    </AppText>
                </View>
            </View>

            {/* Hourly breakdown mini */}
            <View style={styles.breakdownRow}>
                <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={12} color="#999" />
                <AppText variant={Variant.caption} style={styles.breakdownText}>
                    ${shift.hourlyRate.toFixed(2)} × {shift.hoursWorked}h = ${shift.totalDeducted.toFixed(2)} (moves to escrow each hour)
                </AppText>
            </View>

            {/* View details */}
            {onViewDetails && (
                <TouchableOpacity style={styles.viewDetailsBtn} onPress={onViewDetails} activeOpacity={0.7}>
                    <AppText variant={Variant.bodyMedium} style={styles.viewDetailsText}>View in Active Holds</AppText>
                    <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={14} color="#6366F1" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default LiveShiftTracker;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginHorizontal: wp(4),
        marginBottom: hp(1.5),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#E8E5FF',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(1),
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        backgroundColor: '#FEF2F2',
        borderRadius: 6,
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.25),
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
    },
    liveText: {
        color: '#EF4444',
        fontWeight: '800',
        fontSize: getFontSize(9),
        letterSpacing: 1,
    },
    clockInLabel: {
        color: '#999',
        fontSize: getFontSize(10),
    },
    // Job
    jobRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(1.5),
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E8E5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#6366F1',
        fontWeight: '700',
        fontSize: getFontSize(12),
    },
    jobTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
    candidateName: {
        color: '#888',
        fontSize: getFontSize(10),
    },
    rateBox: {
        alignItems: 'flex-end',
    },
    rateLabel: {
        color: '#BBB',
        fontSize: getFontSize(8),
    },
    rateValue: {
        color: '#6366F1',
        fontWeight: '800',
        fontSize: getFontSize(13),
    },
    // Timer
    timerSection: {
        alignItems: 'center',
        marginBottom: hp(1),
    },
    timerValue: {
        color: '#111',
        fontWeight: '900',
        fontSize: getFontSize(32),
    },
    timerSub: {
        color: '#999',
        fontSize: getFontSize(11),
        marginTop: hp(-0.3),
    },
    // Progress
    progressContainer: {
        marginBottom: hp(1),
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#F3F3F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(0.2),
    },
    progressLabelText: {
        color: '#CCC',
        fontSize: getFontSize(9),
    },
    // Warning
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        backgroundColor: '#FFFBEB',
        borderRadius: 8,
        padding: wp(2.5),
        marginBottom: hp(1),
        borderWidth: 0.5,
        borderColor: '#FDE68A',
    },
    warningText: {
        flex: 1,
        color: '#92400E',
        fontSize: getFontSize(10),
        fontWeight: '500',
    },
    // Deduction
    deductionRow: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFE',
        borderRadius: 12,
        padding: wp(3),
        marginBottom: hp(0.8),
    },
    deductionItem: {
        flex: 1,
        alignItems: 'center',
    },
    deductionDivider: {
        width: 1,
        backgroundColor: '#F0F0F0',
    },
    deductionLabel: {
        color: '#BBB',
        fontSize: getFontSize(8),
        marginBottom: hp(0.2),
    },
    deductionValue: {
        fontWeight: '800',
        fontSize: getFontSize(13),
    },
    // Breakdown
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(1),
        marginBottom: hp(1),
    },
    breakdownText: {
        color: '#BBB',
        fontSize: getFontSize(9),
    },
    // View details
    viewDetailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(1),
        paddingTop: hp(0.5),
        borderTopWidth: 0.5,
        borderTopColor: '#F3F3F3',
    },
    viewDetailsText: {
        color: '#6366F1',
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
});
