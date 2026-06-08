import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import { screenNames } from '@/navigation/screenNames';
import { ESCROW_STAGES } from './escrowData';

const STAGE_COLORS = {
    1: '#6366F1', 2: '#8B5CF6', 3: '#F59E0B', 4: '#3B82F6',
    5: '#10B981', 6: '#22C55E', 7: '#14B8A6', 8: '#F97316', 9: '#16A34A',
};

const JobTimeline = ({ navigation, route }) => {
    const { hold } = route.params;
    const currentStage = hold.currentStage;

    const getCurrentStatusMessage = () => {
        switch (currentStage) {
            case 3: return { label: 'Pre-Arrival', sub: 'Jobseeker is on the way' };
            case 4: return { label: 'Arrived - Code Generated', sub: 'Waiting for code exchange' };
            case 5: return { label: 'Code Exchanged', sub: 'Clock-in is now unlocked' };
            case 6: return { label: 'Shift in Progress', sub: 'Worker has clocked in' };
            case 7: return { label: 'Job Completed', sub: 'Payout pending' };
            case 8: return { label: 'Pending Payout', sub: `${hold.payoutDaysRemaining || '?'} days remaining before automatic payout` };
            case 9: return { label: hold.status || 'Paid Out', sub: 'Funds have been processed' };
            default: return { label: 'Processing', sub: '' };
        }
    };

    const status = getCurrentStatusMessage();

    return (
        <View style={styles.screen}>
            <PoolHeader title="Job Timeline & Audit Trail" />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Job Info Card */}
                <View style={styles.jobInfoCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>{hold.jobTitle}</AppText>
                    <AppText variant={Variant.caption} style={styles.jobSubtitle}>
                        {hold.candidate.name} • {hold.company}
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.jobId}>Job ID: {hold.jobId}</AppText>
                </View>

                {/* Status History Title */}
                <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Status History</AppText>

                {/* Timeline */}
                <View style={styles.timeline}>
                    {hold.timeline.map((item, index) => {
                        const isCompleted = item.date !== null;
                        const isCurrent = item.stage === currentStage;
                        const isFuture = item.stage > currentStage;
                        const stageColor = STAGE_COLORS[item.stage] || '#6366F1';
                        const lineColor = isCompleted ? stageColor : '#E8E8EF';

                        return (
                            <View key={item.stage} style={styles.timelineItem}>
                                {/* Left: Number + Line */}
                                <View style={styles.timelineLeft}>
                                    {/* Number circle */}
                                    {isCompleted || isCurrent ? (
                                        <LinearGradient
                                            colors={[stageColor, stageColor + 'CC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.timelineCircle}
                                        >
                                            <AppText variant={Variant.caption} style={styles.timelineNumber}>
                                                {item.stage}
                                            </AppText>
                                        </LinearGradient>
                                    ) : (
                                        <View style={[styles.timelineCircle, styles.timelineCircleFuture]}>
                                            <AppText variant={Variant.caption} style={[styles.timelineNumber, { color: '#CCC' }]}>
                                                {item.stage}
                                            </AppText>
                                        </View>
                                    )}
                                    {/* Connecting line */}
                                    {index < hold.timeline.length - 1 && (
                                        <View style={[styles.timelineLine, { backgroundColor: lineColor }]} />
                                    )}
                                </View>

                                {/* Right: Content */}
                                <View style={[styles.timelineContent, isFuture && styles.timelineContentFuture]}>
                                    {/* Stage label badge */}
                                    <View style={[
                                        styles.stageBadge,
                                        { backgroundColor: isCompleted || isCurrent ? stageColor + '18' : '#F3F3F3' },
                                        { borderColor: isCompleted || isCurrent ? stageColor + '40' : '#E8E8EF' },
                                    ]}>
                                        <AppText variant={Variant.caption} style={[
                                            styles.stageBadgeText,
                                            { color: isCompleted || isCurrent ? stageColor : '#CCC' },
                                        ]}>
                                            {item.label}
                                        </AppText>
                                    </View>

                                    {/* Date/time */}
                                    {item.date && (
                                        <AppText variant={Variant.caption} style={styles.timelineDate}>
                                            {item.date}{item.time ? ` • ${item.time}` : ''}
                                        </AppText>
                                    )}
                                    {!item.date && item.stage <= currentStage && (
                                        <AppText variant={Variant.caption} style={styles.timelineDate}>In progress...</AppText>
                                    )}
                                    {!item.date && item.stage > currentStage && (
                                        <AppText variant={Variant.caption} style={[styles.timelineDate, { color: '#CCC' }]}>Pending</AppText>
                                    )}

                                    {/* Description */}
                                    <AppText variant={Variant.caption} style={[
                                        styles.timelineDesc,
                                        isFuture && { color: '#CCC' },
                                    ]}>
                                        {item.description}
                                    </AppText>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Current Status Banner */}
                <View style={styles.currentStatusBanner}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="alert-circle" size={18} color="#F59E0B" />
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.bodyMedium} style={styles.currentStatusLabel}>
                            Current Status: {status.label}
                        </AppText>
                        {status.sub ? (
                            <AppText variant={Variant.caption} style={styles.currentStatusSub}>{status.sub}</AppText>
                        ) : null}
                    </View>
                </View>

                {/* Bottom Action Buttons */}
                <View style={styles.bottomActions}>
                    <TouchableOpacity
                        style={styles.disputeBtn}
                        onPress={() => navigation.navigate(screenNames.OPEN_DISPUTE, { hold })}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.bodyMedium} style={styles.disputeBtnText}>Open Dispute</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.supportBtn}
                        onPress={() => navigation.navigate(screenNames.SUPPORT)}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.bodyMedium} style={styles.supportBtnText}>Contact Support</AppText>
                    </TouchableOpacity>
                </View>

                <View style={{ height: hp(4) }} />
            </ScrollView>
        </View>
    );
};

export default JobTimeline;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(4) },
    // Job info card
    jobInfoCard: {
        backgroundColor: colors.white, borderRadius: 16, padding: wp(4),
        marginBottom: hp(2),
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    jobTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(18), marginBottom: hp(0.3) },
    jobSubtitle: { color: '#666', fontSize: getFontSize(13), marginBottom: hp(0.2) },
    jobId: { color: '#999', fontSize: getFontSize(11) },
    // Section
    sectionTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(1.5) },
    // Timeline
    timeline: {},
    timelineItem: { flexDirection: 'row', gap: wp(3), minHeight: hp(8) },
    timelineLeft: { alignItems: 'center', width: 34 },
    timelineCircle: {
        width: 30, height: 30, borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
    },
    timelineCircleFuture: {
        backgroundColor: '#F3F3F3', borderWidth: 1.5, borderColor: '#E8E8EF',
    },
    timelineNumber: { color: colors.white, fontWeight: '800', fontSize: getFontSize(12) },
    timelineLine: {
        width: 2.5, flex: 1, marginVertical: hp(0.3),
        borderRadius: 1.5, backgroundColor: '#E8E8EF',
    },
    timelineContent: { flex: 1, paddingBottom: hp(2) },
    timelineContentFuture: { opacity: 0.5 },
    stageBadge: {
        alignSelf: 'flex-start', borderRadius: 8,
        paddingHorizontal: wp(2.5), paddingVertical: hp(0.3),
        borderWidth: 1, marginBottom: hp(0.4),
    },
    stageBadgeText: { fontWeight: '700', fontSize: getFontSize(10), textTransform: 'uppercase' },
    timelineDate: { color: '#888', fontSize: getFontSize(11), marginBottom: hp(0.2) },
    timelineDesc: { color: '#555', fontSize: getFontSize(12), lineHeight: getFontSize(17) },
    // Current status
    currentStatusBanner: {
        flexDirection: 'row', alignItems: 'center', gap: wp(2.5),
        backgroundColor: '#FFF8E1', borderRadius: 12, padding: wp(4),
        marginBottom: hp(2), borderWidth: 1, borderColor: '#FFE082',
    },
    currentStatusLabel: { color: '#111', fontWeight: '700', fontSize: getFontSize(14) },
    currentStatusSub: { color: '#E65100', fontSize: getFontSize(11), marginTop: hp(0.2) },
    // Bottom actions
    bottomActions: { flexDirection: 'row', gap: wp(3) },
    disputeBtn: {
        flex: 1, backgroundColor: '#DC2626', borderRadius: 12,
        paddingVertical: hp(1.5), alignItems: 'center',
    },
    disputeBtnText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(13) },
    supportBtn: {
        flex: 1, backgroundColor: colors.primary, borderRadius: 12,
        paddingVertical: hp(1.5), alignItems: 'center',
    },
    supportBtnText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(13) },
});
