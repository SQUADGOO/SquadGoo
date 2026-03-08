import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import { screenNames } from '@/navigation/screenNames';
import { activeHoldsData, ESCROW_STAGES } from './escrowData';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const getStageColor = (stage) => {
    const map = { 3: '#F59E0B', 4: '#3B82F6', 5: '#10B981', 6: '#22C55E', 7: '#14B8A6', 8: '#F97316', 9: '#16A34A' };
    return map[stage] || '#6366F1';
};
const getStageLabel = (stage) => ESCROW_STAGES.find(s => s.key === stage)?.label || '';

const ActiveHoldsViewAll = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const filtered = activeHoldsData.filter(h =>
        h.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        h.candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        h.company.toLowerCase().includes(search.toLowerCase())
    );

    const copyCode = (code) => {
        Clipboard.setString(code);
        showToast('Code copied!', 'Copied', toastTypes.success);
    };

    const renderCard = (hold) => {
        const stageColor = getStageColor(hold.currentStage);
        const stageLabel = getStageLabel(hold.currentStage);
        const progress = hold.currentStage / 9;

        return (
            <View key={hold.id} style={styles.card}>
                {/* Status badge row */}
                <View style={[styles.statusBadge, { backgroundColor: stageColor + '18', borderColor: stageColor + '40' }]}>
                    <AppText variant={Variant.caption} style={[styles.statusBadgeText, { color: stageColor }]}>
                        {stageLabel}
                    </AppText>
                </View>

                {/* Job Title */}
                <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>{hold.jobTitle}</AppText>
                <AppText variant={Variant.caption} style={styles.company}>{hold.company} • {hold.location?.split(',')[1]?.trim()}</AppText>

                {/* Candidate full info */}
                <View style={styles.candidateSection}>
                    <View style={[styles.avatar, { backgroundColor: hold.candidate.color }]}>
                        <AppText variant={Variant.caption} style={styles.avatarText}>{hold.candidate.initials}</AppText>
                    </View>
                    <View style={styles.candidateDetails}>
                        <AppText variant={Variant.bodyMedium} style={styles.candidateName}>{hold.candidate.name}</AppText>
                        <AppText variant={Variant.caption} style={styles.candidateSub}>{hold.candidate.email}</AppText>
                        <AppText variant={Variant.caption} style={styles.candidateSub}>{hold.candidate.phone}</AppText>
                    </View>
                </View>

                {/* Shift details */}
                <View style={styles.detailsBox}>
                    <View style={styles.detailRow}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={14} color="#888" />
                        <AppText variant={Variant.caption} style={styles.detailText}>{hold.shiftDate} • {hold.shiftTime}</AppText>
                    </View>
                    <View style={styles.detailRow}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="location-outline" size={14} color="#888" />
                        <AppText variant={Variant.caption} style={styles.detailText}>{hold.location}</AppText>
                    </View>
                    {hold.breakTime && (
                        <View style={styles.detailRow}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="cafe-outline" size={14} color="#888" />
                            <AppText variant={Variant.caption} style={styles.detailText}>Break: {hold.breakTime}</AppText>
                        </View>
                    )}
                </View>

                {/* Description / Notes */}
                <View style={styles.notesBox}>
                    <AppText variant={Variant.caption} style={styles.notesLabel}>Job Description / Notes:</AppText>
                    <AppText variant={Variant.caption} style={styles.notesText}>{hold.description}</AppText>
                    {hold.notes && <AppText variant={Variant.caption} style={styles.notesText}>{hold.notes}</AppText>}
                </View>

                {/* Amount + Clock-in code */}
                {hold.amountOnHold > 0 && (
                    <View style={styles.amountRow}>
                        <View>
                            <AppText variant={Variant.caption} style={styles.amountLabel}>Amount on Hold</AppText>
                            <AppText variant={Variant.bodyMedium} style={[styles.amountValue, { color: stageColor }]}>${hold.amountOnHold.toFixed(2)}</AppText>
                        </View>
                        {hold.clockInCode && (
                            <View>
                                <AppText variant={Variant.caption} style={styles.amountLabel}>Clock-In Code</AppText>
                                <AppText variant={Variant.bodyMedium} style={styles.codeValue}>{hold.clockInCode}</AppText>
                            </View>
                        )}
                    </View>
                )}

                {hold.currentStage === 8 && hold.payoutDaysRemaining && (
                    <View style={styles.payoutNotice}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color="#F97316" />
                        <AppText variant={Variant.caption} style={styles.payoutText}>
                            Payout available in {hold.payoutDaysRemaining} days. Funds are held for 7 days after job completion to allow for disputes.
                        </AppText>
                    </View>
                )}

                {/* Progress bar */}
                <View style={styles.progressSection}>
                    <AppText variant={Variant.caption} style={styles.progressLabel}>Stage {hold.currentStage} of 9</AppText>
                    <View style={styles.progressBg}>
                        <LinearGradient
                            colors={[stageColor, stageColor + '88']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${progress * 100}%` }]}
                        />
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                    {hold.clockInCode && hold.currentStage >= 4 && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => copyCode(hold.clockInCode)} activeOpacity={0.7}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="copy-outline" size={14} color={colors.primary} />
                            <AppText variant={Variant.caption} style={styles.actionText}>Copy Code</AppText>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate(screenNames.JOB_TIMELINE, { hold })}
                        activeOpacity={0.7}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color={colors.primary} />
                        <AppText variant={Variant.caption} style={styles.actionText}>Timeline</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnDanger]}
                        onPress={() => navigation.navigate(screenNames.OPEN_DISPUTE, { hold })}
                        activeOpacity={0.7}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="warning-outline" size={14} color="#DC2626" />
                        <AppText variant={Variant.caption} style={[styles.actionText, { color: '#DC2626' }]}>Open Dispute</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Active Holds" />

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <VectorIcons name={iconLibName.Ionicons} iconName="search-outline" size={18} color="#999" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search jobs, candidates..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="close-circle" size={18} color="#CCC" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filtered.length === 0 ? (
                    <View style={styles.emptyState}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="search" size={48} color="#CCC" />
                        <AppText variant={Variant.body} style={styles.emptyText}>No active holds found.</AppText>
                    </View>
                ) : (
                    filtered.map(renderCard)
                )}
                <View style={{ height: hp(4) }} />
            </ScrollView>
        </View>
    );
};

export default ActiveHoldsViewAll;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(4) },
    // Search
    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: wp(2),
        backgroundColor: colors.white, borderRadius: 12,
        marginHorizontal: wp(4), marginTop: hp(1),
        paddingHorizontal: wp(3.5), paddingVertical: hp(1),
        borderWidth: 1, borderColor: '#E8E8EF',
    },
    searchInput: { flex: 1, fontSize: getFontSize(14), color: '#333', padding: 0 },
    // Card
    card: {
        backgroundColor: colors.white, borderRadius: 16, padding: wp(4),
        marginBottom: hp(1.5),
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    },
    statusBadge: {
        alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center',
        borderRadius: 8, paddingHorizontal: wp(2.5), paddingVertical: hp(0.3),
        borderWidth: 1, marginBottom: hp(0.8),
    },
    statusBadgeText: { fontWeight: '700', fontSize: getFontSize(10), textTransform: 'uppercase' },
    jobTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(0.3) },
    company: { color: '#888', fontSize: getFontSize(12), marginBottom: hp(1.2) },
    // Candidate
    candidateSection: { flexDirection: 'row', alignItems: 'center', gap: wp(2.5), marginBottom: hp(1.2) },
    avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: colors.white, fontWeight: '800', fontSize: getFontSize(13) },
    candidateDetails: { flex: 1 },
    candidateName: { color: '#333', fontWeight: '700', fontSize: getFontSize(14) },
    candidateSub: { color: '#999', fontSize: getFontSize(11), marginTop: hp(0.1) },
    // Details box
    detailsBox: {
        backgroundColor: '#F9F9FB', borderRadius: 10, padding: wp(3), gap: hp(0.5),
        marginBottom: hp(1),
    },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5) },
    detailText: { color: '#666', fontSize: getFontSize(12) },
    // Notes
    notesBox: { marginBottom: hp(1) },
    notesLabel: { color: '#888', fontWeight: '600', fontSize: getFontSize(10), marginBottom: hp(0.3) },
    notesText: { color: '#666', fontSize: getFontSize(11), lineHeight: getFontSize(16) },
    // Amount / code
    amountRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        backgroundColor: '#F5F3FF', borderRadius: 10, padding: wp(3), marginBottom: hp(0.8),
        borderWidth: 1, borderColor: '#E8E5F0',
    },
    amountLabel: { color: '#888', fontSize: getFontSize(10), marginBottom: hp(0.1) },
    amountValue: { fontWeight: '800', fontSize: getFontSize(18) },
    codeValue: { fontWeight: '800', fontSize: getFontSize(16), color: '#333' },
    // Payout
    payoutNotice: {
        flexDirection: 'row', alignItems: 'flex-start', gap: wp(1.5),
        backgroundColor: '#FFF8E1', borderRadius: 8, padding: wp(2.5),
        marginBottom: hp(0.8), borderWidth: 1, borderColor: '#FFE082',
    },
    payoutText: { flex: 1, color: '#E65100', fontSize: getFontSize(10), lineHeight: getFontSize(15) },
    // Progress
    progressSection: { marginBottom: hp(1.2) },
    progressLabel: { color: '#999', fontSize: getFontSize(10), marginBottom: hp(0.3) },
    progressBg: { height: 6, backgroundColor: '#E8E8EF', borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: 6, borderRadius: 3 },
    // Actions
    actionsRow: { flexDirection: 'row', gap: wp(2), flexWrap: 'wrap' },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', gap: wp(1),
        borderWidth: 1.5, borderColor: '#E8E5F0', borderRadius: 10,
        paddingHorizontal: wp(3), paddingVertical: hp(0.7),
    },
    actionBtnDanger: { borderColor: '#FECACA' },
    actionText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(11) },
    // Empty
    emptyState: { alignItems: 'center', paddingVertical: hp(8) },
    emptyText: { color: '#999', fontSize: getFontSize(14), marginTop: hp(1) },
});
