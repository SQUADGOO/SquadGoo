import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import { screenNames } from '@/navigation/screenNames';
import { activeHoldsData, completedHoldsData, ESCROW_STAGES } from './escrowData';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import AppButton from '@/core/AppButton';

const STAGE_COLORS = {
    3: '#F59E0B',
    4: '#3B82F6',
    5: '#10B981',
    6: '#22C55E',
    7: '#14B8A6',
    8: '#F97316',
    9: '#16A34A',
};

const getStageLabel = (stage) => ESCROW_STAGES.find(s => s.key === stage)?.label || '';
const getStageColor = (stage) => STAGE_COLORS[stage] || '#6366F1';

const EscrowHolds = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('active');

    const copyCode = (code) => {
        Clipboard.setString(code);
        showToast('Code copied!', 'Copied', toastTypes.success);
    };

    // ── Stage progress bar ──
    const renderProgressBar = (currentStage) => {
        const totalStages = 9;
        const progress = currentStage / totalStages;
        return (
            <View style={styles.progressContainer}>
                <AppText variant={Variant.caption} style={styles.progressLabel}>
                    Stage {currentStage} of {totalStages}
                </AppText>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={[getStageColor(currentStage), getStageColor(currentStage) + '88']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
                    />
                </View>
            </View>
        );
    };

    // ── Status badge ──
    const renderStatusBadge = (stage, statusOverride) => {
        const label = statusOverride || getStageLabel(stage);
        const color = getStageColor(stage);
        return (
            <View style={[styles.statusBadge, { backgroundColor: color + '18', borderColor: color + '40' }]}>
                <AppText variant={Variant.caption} style={[styles.statusBadgeText, { color }]}>{label}</AppText>
            </View>
        );
    };

    // ── Active hold card ──
    const renderActiveCard = (hold) => {
        const stageColor = getStageColor(hold.currentStage);
        return (
            <View key={hold.id} style={styles.holdCard}>
                {/* Status Badge */}
                <View style={styles.cardTopRow}>
                    {renderStatusBadge(hold.currentStage)}
                </View>

                {/* Job info */}
                <AppText variant={Variant.bodyMedium} style={styles.cardJobTitle}>{hold.jobTitle}</AppText>
                <AppText variant={Variant.caption} style={styles.cardCompany}>{hold.company} • {hold.location?.split(',')[1]?.trim()}</AppText>

                {/* Candidate */}
                <View style={styles.candidateRow}>
                    <View style={[styles.avatar, { backgroundColor: hold.candidate.color }]}>
                        <AppText variant={Variant.caption} style={styles.avatarText}>{hold.candidate.initials}</AppText>
                    </View>
                    <View style={styles.candidateInfo}>
                        <AppText variant={Variant.bodyMedium} style={styles.candidateName}>{hold.candidate.name}</AppText>
                        <AppText variant={Variant.caption} style={styles.candidateContact}>{hold.candidate.email} • {hold.candidate.phone}</AppText>
                    </View>
                </View>

                {/* Shift info */}
                <View style={styles.shiftRow}>
                    <View style={styles.shiftItem}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={13} color="#888" />
                        <AppText variant={Variant.caption} style={styles.shiftText}>{hold.shiftDate} • {hold.shiftTime}</AppText>
                    </View>
                    <View style={styles.shiftItem}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="location-outline" size={13} color="#888" />
                        <AppText variant={Variant.caption} style={styles.shiftText}>{hold.location}</AppText>
                    </View>
                    {hold.breakTime && (
                        <View style={styles.shiftItem}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="cafe-outline" size={13} color="#888" />
                            <AppText variant={Variant.caption} style={styles.shiftText}>Break: {hold.breakTime}</AppText>
                        </View>
                    )}
                </View>

                {/* Amount + Payout info */}
                {hold.amountOnHold > 0 && (
                    <View style={styles.amountRow}>
                        <AppText variant={Variant.caption} style={styles.amountLabel}>Amount on Hold</AppText>
                        <AppText variant={Variant.bodyMedium} style={[styles.amountValue, { color: stageColor }]}>${hold.amountOnHold.toFixed(2)}</AppText>
                    </View>
                )}

                {hold.currentStage === 8 && hold.payoutDaysRemaining && (
                    <View style={styles.payoutNotice}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color="#F97316" />
                        <AppText variant={Variant.caption} style={styles.payoutNoticeText}>
                            {hold.payoutDaysRemaining} days remaining in hold period
                        </AppText>
                    </View>
                )}

                {/* Progress bar */}
                {renderProgressBar(hold.currentStage)}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    {hold.clockInCode && hold.currentStage >= 4 && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => copyCode(hold.clockInCode)} activeOpacity={0.7}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="copy-outline" size={14} color={colors.primary} />
                            <AppText variant={Variant.caption} style={styles.actionBtnText}>Copy Code</AppText>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate(screenNames.JOB_TIMELINE, { hold })}
                        activeOpacity={0.7}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color={colors.primary} />
                        <AppText variant={Variant.caption} style={styles.actionBtnText}>Timeline</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnDanger]}
                        onPress={() => navigation.navigate(screenNames.OPEN_DISPUTE, { hold })}
                        activeOpacity={0.7}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="warning-outline" size={14} color="#DC2626" />
                        <AppText variant={Variant.caption} style={[styles.actionBtnText, { color: '#DC2626' }]}>Dispute</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // ── Completed hold card ──
    const renderCompletedCard = (hold) => {
        const isPaidOut = hold.status === 'Paid Out';
        const statusColor = isPaidOut ? '#16A34A' : '#F59E0B';
        return (
            <View key={hold.id} style={[styles.holdCard, { borderLeftColor: statusColor, borderLeftWidth: 3 }]}>
                <View style={styles.cardTopRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '18', borderColor: statusColor + '40' }]}>
                        <VectorIcons name={iconLibName.Ionicons} iconName={isPaidOut ? 'checkmark-circle' : 'refresh-circle'} size={12} color={statusColor} />
                        <AppText variant={Variant.caption} style={[styles.statusBadgeText, { color: statusColor }]}>{hold.status}</AppText>
                    </View>
                </View>
                <AppText variant={Variant.bodyMedium} style={styles.cardJobTitle}>{hold.jobTitle}</AppText>
                <AppText variant={Variant.caption} style={styles.cardCompany}>{hold.company}</AppText>

                <View style={styles.candidateRow}>
                    <View style={[styles.avatar, { backgroundColor: hold.candidate.color }]}>
                        <AppText variant={Variant.caption} style={styles.avatarText}>{hold.candidate.initials}</AppText>
                    </View>
                    <View style={styles.candidateInfo}>
                        <AppText variant={Variant.bodyMedium} style={styles.candidateName}>{hold.candidate.name}</AppText>
                        <AppText variant={Variant.caption} style={styles.candidateContact}>{hold.shiftDate} • {hold.shiftTime}</AppText>
                    </View>
                    <AppText variant={Variant.bodyMedium} style={[styles.completedAmount, { color: statusColor }]}>${hold.amountOnHold.toFixed(2)}</AppText>
                </View>

                {renderProgressBar(9)}

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate(screenNames.JOB_TIMELINE, { hold })}
                        activeOpacity={0.7}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color={colors.primary} />
                        <AppText variant={Variant.caption} style={styles.actionBtnText}>View Timeline</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Escrow & Holds" />

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                    onPress={() => setActiveTab('active')}
                    activeOpacity={0.7}
                >
                    <AppText variant={Variant.bodyMedium} style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                        Active Holds
                    </AppText>
                    {activeHoldsData.length > 0 && (
                        <View style={[styles.tabBadge, activeTab === 'active' && styles.tabBadgeActive]}>
                            <AppText variant={Variant.caption} style={[styles.tabBadgeText, activeTab === 'active' && styles.tabBadgeTextActive]}>{activeHoldsData.length}</AppText>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
                    onPress={() => setActiveTab('completed')}
                    activeOpacity={0.7}
                >
                    <AppText variant={Variant.bodyMedium} style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                        Completed Holds
                    </AppText>
                    {completedHoldsData.length > 0 && (
                        <View style={[styles.tabBadge, activeTab === 'completed' && styles.tabBadgeActive]}>
                            <AppText variant={Variant.caption} style={[styles.tabBadgeText, activeTab === 'completed' && styles.tabBadgeTextActive]}>{completedHoldsData.length}</AppText>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'active' ? (
                    <>
                        {activeHoldsData.map(renderActiveCard)}

                        {/* View All Button */}

                        <AppButton
                            text="View All"
                            onPress={() => navigation.navigate(screenNames.ACTIVE_HOLDS_VIEW_ALL)}
                        />
                        {/* <TouchableOpacity
                            style={styles.viewAllBtn}
                            onPress={() => navigation.navigate(screenNames.ACTIVE_HOLDS_VIEW_ALL)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={[colors.primary || '#6C3CE1', '#8B5CF6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.viewAllGradient}
                            >
                                <AppText variant={Variant.bodyMedium} style={styles.viewAllText}>View All</AppText>
                            </LinearGradient>
                        </TouchableOpacity> */}
                    </>
                ) : (
                    <>
                        {completedHoldsData.map(renderCompletedCard)}
                        {completedHoldsData.length === 0 && (
                            <View style={styles.emptyState}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-done-circle-outline" size={48} color="#CCC" />
                                <AppText variant={Variant.body} style={styles.emptyText}>No completed holds yet.</AppText>
                            </View>
                        )}
                    </>
                )}
                <View style={{ height: hp(4) }} />
            </ScrollView>
        </View>
    );
};

export default EscrowHolds;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(4), paddingTop: hp(1) },
    // Tabs
    tabBar: {
        flexDirection: 'row', backgroundColor: colors.white,
        marginHorizontal: wp(4), borderRadius: 12, padding: 4,
        marginTop: hp(1),
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: hp(1.2), borderRadius: 10, gap: wp(1.5),
    },
    tabActive: { backgroundColor: colors.primary },
    tabText: { color: '#888', fontWeight: '600', fontSize: getFontSize(13) },
    tabTextActive: { color: colors.white },
    tabBadge: { backgroundColor: '#E8E8EF', borderRadius: 10, paddingHorizontal: wp(1.5), paddingVertical: hp(0.15) },
    tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
    tabBadgeText: { color: '#888', fontWeight: '700', fontSize: getFontSize(10) },
    tabBadgeTextActive: { color: colors.white },
    // Hold card
    holdCard: {
        backgroundColor: colors.white, borderRadius: 16, padding: wp(4),
        marginBottom: hp(1.5),
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    cardTopRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: hp(0.8) },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: wp(1),
        borderRadius: 8, paddingHorizontal: wp(2.5), paddingVertical: hp(0.3),
        borderWidth: 1,
    },
    statusBadgeText: { fontWeight: '700', fontSize: getFontSize(10), textTransform: 'uppercase' },
    cardJobTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(0.3) },
    cardCompany: { color: '#888', fontSize: getFontSize(12), marginBottom: hp(1) },
    // Candidate
    candidateRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2.5), marginBottom: hp(1) },
    avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: colors.white, fontWeight: '800', fontSize: getFontSize(12) },
    candidateInfo: { flex: 1 },
    candidateName: { color: '#333', fontWeight: '600', fontSize: getFontSize(13) },
    candidateContact: { color: '#999', fontSize: getFontSize(10), marginTop: hp(0.1) },
    completedAmount: { fontWeight: '800', fontSize: getFontSize(16) },
    // Shift info
    shiftRow: { gap: hp(0.4), marginBottom: hp(1) },
    shiftItem: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5) },
    shiftText: { color: '#666', fontSize: getFontSize(11) },
    // Amount
    amountRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#F9F9FB', borderRadius: 10, padding: wp(3), marginBottom: hp(0.8),
    },
    amountLabel: { color: '#888', fontSize: getFontSize(11) },
    amountValue: { fontWeight: '800', fontSize: getFontSize(18) },
    // Payout notice
    payoutNotice: {
        flexDirection: 'row', alignItems: 'center', gap: wp(1.5),
        backgroundColor: '#FFF8E1', borderRadius: 8, padding: wp(2.5),
        marginBottom: hp(0.8), borderWidth: 1, borderColor: '#FFE082',
    },
    payoutNoticeText: { flex: 1, color: '#E65100', fontSize: getFontSize(11) },
    // Progress bar
    progressContainer: { marginBottom: hp(1) },
    progressLabel: { color: '#999', fontSize: getFontSize(10), marginBottom: hp(0.3) },
    progressBarBg: { height: 6, backgroundColor: '#E8E8EF', borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: 6, borderRadius: 3 },
    // Actions
    actionRow: { flexDirection: 'row', gap: wp(2), flexWrap: 'wrap' },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', gap: wp(1),
        borderWidth: 1.5, borderColor: '#E8E5F0', borderRadius: 10,
        paddingHorizontal: wp(3), paddingVertical: hp(0.7),
    },
    actionBtnDanger: { borderColor: '#FECACA' },
    actionBtnText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(11) },
    // View All
    viewAllBtn: { alignItems: 'center', marginTop: hp(0.5) },
    viewAllGradient: { borderRadius: 20, paddingHorizontal: wp(8), paddingVertical: hp(1) },
    viewAllText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(13) },
    // Empty
    emptyState: { alignItems: 'center', paddingVertical: hp(8) },
    emptyText: { color: '#999', fontSize: getFontSize(14), marginTop: hp(1) },
});
