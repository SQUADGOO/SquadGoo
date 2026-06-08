import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import { completedHoldsData } from './escrowData';

const STATUS_STYLES = {
    'Paid Out': { color: '#16A34A', icon: 'checkmark-circle', barColor: '#16A34A' },
    'Disputed': { color: '#F97316', icon: 'alert-circle', barColor: '#F97316' },
    'Refunded': { color: '#6B7280', icon: 'arrow-undo-circle', barColor: '#6B7280' },
};

const CompletedHoldsViewAll = ({ navigation }) => {

    const renderCard = (hold) => {
        const s = STATUS_STYLES[hold.status] || STATUS_STYLES['Paid Out'];
        return (
            <View key={hold.id} style={[styles.card, { borderLeftColor: s.color, borderLeftWidth: 3 }]}>
                {/* Status + Amount top row */}
                <View style={styles.topRow}>
                    <View style={[styles.badge, { backgroundColor: s.color + '15', borderColor: s.color + '35' }]}>
                        <VectorIcons name={iconLibName.Ionicons} iconName={s.icon} size={12} color={s.color} />
                        <AppText variant={Variant.caption} style={[styles.badgeText, { color: s.color }]}>
                            {hold.statusBadge || hold.status}
                        </AppText>
                    </View>
                    <AppText variant={Variant.bodyMedium} style={[styles.topAmount, { color: s.color }]}>
                        ${hold.amountOnHold.toFixed(2)}
                    </AppText>
                </View>

                {/* Job info */}
                <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>{hold.jobTitle}</AppText>
                <AppText variant={Variant.caption} style={styles.company}>{hold.company}</AppText>

                {/* Candidate */}
                <View style={styles.candidateRow}>
                    <View style={[styles.avatar, { backgroundColor: hold.candidate.color + '70' }]}>
                        <AppText variant={Variant.caption} style={styles.avatarText}>{hold.candidate.initials}</AppText>
                    </View>
                    <View style={styles.candidateInfo}>
                        <AppText variant={Variant.bodyMedium} style={styles.candidateName}>{hold.candidate.name}</AppText>
                        <AppText variant={Variant.caption} style={styles.candidateSub}>{hold.shiftDate} • {hold.shiftTime}</AppText>
                    </View>
                </View>

                {/* Details row */}
                <View style={styles.detailsBox}>
                    <View style={styles.detailItem}>
                        <AppText variant={Variant.caption} style={styles.detailLabel}>Amount Held</AppText>
                        <AppText variant={Variant.caption} style={styles.detailValue}>${hold.amountOnHold.toFixed(2)}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                        <AppText variant={Variant.caption} style={styles.detailLabel}>
                            {hold.status === 'Paid Out' ? 'Paid On' : hold.status === 'Refunded' ? 'Refunded On' : 'Resolved On'}
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.detailValue}>{hold.payoutDate || '—'}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                        <AppText variant={Variant.caption} style={styles.detailLabel}>Job ID</AppText>
                        <AppText variant={Variant.caption} style={styles.detailValue}>{hold.jobId}</AppText>
                    </View>
                </View>

                {/* Notes / summary */}
                {hold.notes && (
                    <View style={styles.notesRow}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="document-text-outline" size={12} color="#999" />
                        <AppText variant={Variant.caption} style={styles.notesText}>{hold.notes}</AppText>
                    </View>
                )}

                {/* Progress bar (fully filled) */}
                <View style={styles.progressRow}>
                    <AppText variant={Variant.caption} style={styles.progressLabel}>Stage 9 of 9 — Complete</AppText>
                    <View style={styles.progressBg}>
                        <LinearGradient
                            colors={[s.barColor, s.barColor + '88']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.progressFill}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Completed Holds" />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {completedHoldsData.length === 0 ? (
                    <View style={styles.emptyState}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-done-circle-outline" size={48} color="#CCC" />
                        <AppText variant={Variant.body} style={styles.emptyText}>No completed holds yet.</AppText>
                    </View>
                ) : (
                    completedHoldsData.map(renderCard)
                )}
                <View style={{ height: hp(4) }} />
            </ScrollView>
        </View>
    );
};

export default CompletedHoldsViewAll;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(4) },
    // Card
    card: {
        backgroundColor: colors.white, borderRadius: 16, padding: wp(4),
        marginBottom: hp(1.5), opacity: 0.88,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    },
    // Top row
    topRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: hp(0.8),
    },
    badge: {
        flexDirection: 'row', alignItems: 'center', gap: wp(1),
        borderRadius: 8, paddingHorizontal: wp(2.5), paddingVertical: hp(0.3),
        borderWidth: 1,
    },
    badgeText: { fontWeight: '700', fontSize: getFontSize(10), textTransform: 'uppercase' },
    topAmount: { fontWeight: '800', fontSize: getFontSize(16) },
    // Job
    jobTitle: { color: '#555', fontWeight: '700', fontSize: getFontSize(15), marginBottom: hp(0.3) },
    company: { color: '#999', fontSize: getFontSize(12), marginBottom: hp(1) },
    // Candidate
    candidateRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2.5), marginBottom: hp(1) },
    avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: colors.white, fontWeight: '800', fontSize: getFontSize(12) },
    candidateInfo: { flex: 1 },
    candidateName: { color: '#555', fontWeight: '600', fontSize: getFontSize(13) },
    candidateSub: { color: '#999', fontSize: getFontSize(10) },
    // Details box
    detailsBox: {
        backgroundColor: '#F9F9FB', borderRadius: 10, padding: wp(3),
        gap: hp(0.4), marginBottom: hp(0.8),
    },
    detailItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { color: '#999', fontSize: getFontSize(11) },
    detailValue: { color: '#666', fontWeight: '600', fontSize: getFontSize(11) },
    // Notes
    notesRow: {
        flexDirection: 'row', alignItems: 'flex-start', gap: wp(1.5),
        marginBottom: hp(0.8),
    },
    notesText: { flex: 1, color: '#999', fontSize: getFontSize(10), lineHeight: getFontSize(15), fontStyle: 'italic' },
    // Progress
    progressRow: { marginBottom: hp(0.3) },
    progressLabel: { color: '#BBB', fontSize: getFontSize(10), marginBottom: hp(0.3) },
    progressBg: { height: 5, backgroundColor: '#E8E8EF', borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: 5, borderRadius: 3, width: '100%' },
    // Empty
    emptyState: { alignItems: 'center', paddingVertical: hp(8) },
    emptyText: { color: '#999', fontSize: getFontSize(14), marginTop: hp(1) },
});
