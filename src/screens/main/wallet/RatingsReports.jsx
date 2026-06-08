import React, { useState } from 'react';
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

// Mock data
const OVERALL_RATING = 4.7;
const TOTAL_REVIEWS = 38;

const METRICS = [
    { key: 'acceptance', label: 'Acceptance Rate', value: 92, icon: 'checkmark-circle', color: '#16A34A', suffix: '%' },
    { key: 'punctuality', label: 'Punctuality', value: 88, icon: 'time', color: '#6366F1', suffix: '%' },
    { key: 'response', label: 'Response Time', value: 4.2, icon: 'flash', color: '#F59E0B', suffix: ' min' },
    { key: 'completion', label: 'Job Completion', value: 96, icon: 'shield-checkmark', color: '#14B8A6', suffix: '%' },
    { key: 'disputes', label: 'Dispute Rate', value: 2, icon: 'warning', color: '#EF4444', suffix: '%' },
    { key: 'rehire', label: 'Re-hire Rate', value: 78, icon: 'repeat', color: '#8B5CF6', suffix: '%' },
];

const RATING_DIST = [
    { stars: 5, count: 24, pct: 63 },
    { stars: 4, count: 8, pct: 21 },
    { stars: 3, count: 4, pct: 10 },
    { stars: 2, count: 1, pct: 3 },
    { stars: 1, count: 1, pct: 3 },
];

const RECENT_REVIEWS = [
    {
        id: 'r1',
        name: 'Sarah J.',
        jobTitle: 'Warehouse Night Shift',
        date: 'Feb 7, 2024',
        rating: 5,
        comment: 'Great recruiter! Clear instructions and fair pay. Would work again.',
    },
    {
        id: 'r2',
        name: 'Tom W.',
        jobTitle: 'Delivery Driver',
        date: 'Feb 3, 2024',
        rating: 4,
        comment: 'Good experience overall. Timely communication.',
    },
    {
        id: 'r3',
        name: 'Lisa C.',
        jobTitle: 'Event Staff',
        date: 'Jan 28, 2024',
        rating: 5,
        comment: 'Professional and well-organized. Highly recommended.',
    },
    {
        id: 'r4',
        name: 'David P.',
        jobTitle: 'Retail Assistant',
        date: 'Jan 22, 2024',
        rating: 3,
        comment: 'Job was fine but shift ran longer than expected.',
    },
];

const MONTHLY_STATS = [
    { month: 'Oct', jobs: 5, rating: 4.5 },
    { month: 'Nov', jobs: 7, rating: 4.6 },
    { month: 'Dec', jobs: 9, rating: 4.8 },
    { month: 'Jan', jobs: 11, rating: 4.7 },
    { month: 'Feb', jobs: 6, rating: 4.7 },
];

const RatingsReports = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Render stars
    const renderStars = (count, size = 12) => {
        return (
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                    <VectorIcons
                        key={i}
                        name={iconLibName.Ionicons}
                        iconName={i <= count ? 'star' : 'star-outline'}
                        size={size}
                        color={i <= count ? '#F59E0B' : '#DDD'}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Ratings & Reports" />

            {/* Tabs */}
            <View style={styles.tabBar}>
                {['overview', 'reviews', 'reports'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.bodyMedium} style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'overview' && (
                    <>
                        {/* Overall Rating Card */}
                        <View style={styles.overallCard}>
                            <View style={styles.overallLeft}>
                                <AppText variant={Variant.h2} style={styles.overallNumber}>{OVERALL_RATING}</AppText>
                                {renderStars(Math.round(OVERALL_RATING), 16)}
                                <AppText variant={Variant.caption} style={styles.overallSub}>{TOTAL_REVIEWS} reviews</AppText>
                            </View>
                            <View style={styles.overallRight}>
                                {RATING_DIST.map(rd => (
                                    <View key={rd.stars} style={styles.distRow}>
                                        <AppText variant={Variant.caption} style={styles.distStarLabel}>{rd.stars}</AppText>
                                        <VectorIcons name={iconLibName.Ionicons} iconName="star" size={8} color="#F59E0B" />
                                        <View style={styles.distBar}>
                                            <View style={[styles.distFill, { width: `${rd.pct}%` }]} />
                                        </View>
                                        <AppText variant={Variant.caption} style={styles.distCount}>{rd.count}</AppText>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Performance Metrics */}
                        <AppText variant={Variant.title} style={styles.sectionTitle}>Performance Metrics</AppText>
                        <View style={styles.metricsGrid}>
                            {METRICS.map(m => (
                                <View key={m.key} style={styles.metricCard}>
                                    <View style={[styles.metricIconCircle, { backgroundColor: m.color + '15' }]}>
                                        <VectorIcons name={iconLibName.Ionicons} iconName={m.icon} size={16} color={m.color} />
                                    </View>
                                    <AppText variant={Variant.h5} style={[styles.metricValue, { color: m.color }]}>
                                        {m.value}{m.suffix}
                                    </AppText>
                                    <AppText variant={Variant.caption} style={styles.metricLabel}>{m.label}</AppText>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {activeTab === 'reviews' && (
                    <>
                        {/* Recent Reviews */}
                        <AppText variant={Variant.title} style={styles.sectionTitle}>Recent Reviews</AppText>
                        {RECENT_REVIEWS.map(review => (
                            <View key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewAvatar}>
                                        <AppText variant={Variant.bodyMedium} style={styles.reviewAvatarText}>
                                            {review.name.split(' ').map(w => w[0]).join('')}
                                        </AppText>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <AppText variant={Variant.bodyMedium} style={styles.reviewName}>{review.name}</AppText>
                                        <AppText variant={Variant.caption} style={styles.reviewJob}>{review.jobTitle}</AppText>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        {renderStars(review.rating, 11)}
                                        <AppText variant={Variant.caption} style={styles.reviewDate}>{review.date}</AppText>
                                    </View>
                                </View>
                                <AppText variant={Variant.body} style={styles.reviewComment}>{review.comment}</AppText>
                            </View>
                        ))}
                    </>
                )}

                {activeTab === 'reports' && (
                    <>
                        {/* Monthly Activity */}
                        <AppText variant={Variant.title} style={styles.sectionTitle}>Monthly Activity</AppText>
                        <View style={styles.chartCard}>
                            <View style={styles.chartHeader}>
                                <AppText variant={Variant.caption} style={styles.chartLabel}>Month</AppText>
                                <AppText variant={Variant.caption} style={styles.chartLabel}>Jobs</AppText>
                                <AppText variant={Variant.caption} style={styles.chartLabel}>Avg Rating</AppText>
                            </View>
                            {MONTHLY_STATS.map((ms, idx) => {
                                const barWidth = (ms.jobs / 15) * 100;
                                return (
                                    <View key={ms.month} style={[styles.chartRow, idx < MONTHLY_STATS.length - 1 && styles.chartRowBorder]}>
                                        <AppText variant={Variant.bodyMedium} style={styles.chartMonth}>{ms.month}</AppText>
                                        <View style={styles.chartBarContainer}>
                                            <View style={[styles.chartBar, { width: `${barWidth}%` }]} />
                                            <AppText variant={Variant.caption} style={styles.chartBarLabel}>{ms.jobs}</AppText>
                                        </View>
                                        <View style={styles.chartRatingCell}>
                                            <VectorIcons name={iconLibName.Ionicons} iconName="star" size={10} color="#F59E0B" />
                                            <AppText variant={Variant.bodyMedium} style={styles.chartRating}>{ms.rating}</AppText>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Quick Stats Summary */}
                        <AppText variant={Variant.title} style={styles.sectionTitle}>Quick Summary</AppText>
                        <View style={styles.summaryCards}>
                            <View style={[styles.summaryCard, { borderLeftColor: '#6366F1' }]}>
                                <AppText variant={Variant.h4} style={styles.summaryValue}>38</AppText>
                                <AppText variant={Variant.caption} style={styles.summaryLabel}>Total Jobs</AppText>
                            </View>
                            <View style={[styles.summaryCard, { borderLeftColor: '#16A34A' }]}>
                                <AppText variant={Variant.h4} style={styles.summaryValue}>$4,250</AppText>
                                <AppText variant={Variant.caption} style={styles.summaryLabel}>Total Spent</AppText>
                            </View>
                            <View style={[styles.summaryCard, { borderLeftColor: '#F59E0B' }]}>
                                <AppText variant={Variant.h4} style={styles.summaryValue}>12</AppText>
                                <AppText variant={Variant.caption} style={styles.summaryLabel}>Workers Hired</AppText>
                            </View>
                            <View style={[styles.summaryCard, { borderLeftColor: '#8B5CF6' }]}>
                                <AppText variant={Variant.h4} style={styles.summaryValue}>4.7</AppText>
                                <AppText variant={Variant.caption} style={styles.summaryLabel}>Avg Rating</AppText>
                            </View>
                        </View>
                    </>
                )}

                <View style={{ height: hp(4) }} />
            </ScrollView>
        </View>
    );
};

export default RatingsReports;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(4) },
    // Tabs
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginHorizontal: wp(4),
        marginTop: hp(1),
        borderRadius: 12,
        padding: 3,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(1),
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: '#6366F1',
    },
    tabText: {
        color: '#888',
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    tabTextActive: {
        color: colors.white,
        fontWeight: '700',
    },
    sectionTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(16),
        marginTop: hp(2),
        marginBottom: hp(1),
    },
    // Overall rating card
    overallCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: wp(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    overallLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: wp(4),
        borderRightWidth: 1,
        borderRightColor: '#F3F3F3',
        minWidth: wp(25),
    },
    overallNumber: {
        color: '#111',
        fontWeight: '900',
        fontSize: getFontSize(42),
        lineHeight: getFontSize(46),
    },
    overallSub: {
        color: '#999',
        fontSize: getFontSize(11),
        marginTop: hp(0.3),
    },
    overallRight: {
        flex: 1,
        paddingLeft: wp(3),
        justifyContent: 'center',
        gap: hp(0.3),
    },
    // Rating distribution
    distRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    distStarLabel: {
        color: '#666',
        fontWeight: '600',
        fontSize: getFontSize(10),
        width: 10,
        textAlign: 'right',
    },
    distBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#F3F3F6',
        borderRadius: 3,
        overflow: 'hidden',
    },
    distFill: {
        height: '100%',
        backgroundColor: '#F59E0B',
        borderRadius: 3,
    },
    distCount: {
        color: '#BBB',
        fontSize: getFontSize(9),
        width: 18,
        textAlign: 'right',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 1,
    },
    // Metrics
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metricCard: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 14,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3),
        alignItems: 'center',
        marginBottom: hp(1.2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    metricIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(0.4),
    },
    metricValue: {
        fontWeight: '800',
        fontSize: getFontSize(16),
    },
    metricLabel: {
        color: '#999',
        fontSize: getFontSize(9),
        textAlign: 'center',
        marginTop: hp(0.1),
    },
    // Reviews
    reviewCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: wp(3.5),
        marginBottom: hp(1),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(0.8),
    },
    reviewAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E8E5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewAvatarText: {
        color: '#6366F1',
        fontWeight: '700',
        fontSize: getFontSize(12),
    },
    reviewName: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
    reviewJob: {
        color: '#999',
        fontSize: getFontSize(10),
    },
    reviewDate: {
        color: '#CCC',
        fontSize: getFontSize(9),
        marginTop: hp(0.2),
    },
    reviewComment: {
        color: '#555',
        fontSize: getFontSize(12),
        lineHeight: getFontSize(18),
    },
    // Reports chart
    chartCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: wp(3.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: hp(0.8),
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F3F3',
        marginBottom: hp(0.5),
    },
    chartLabel: {
        color: '#BBB',
        fontWeight: '700',
        fontSize: getFontSize(9),
        textTransform: 'uppercase',
        flex: 1,
    },
    chartRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(0.8),
    },
    chartRowBorder: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#F8F8F8',
    },
    chartMonth: {
        color: '#333',
        fontWeight: '600',
        fontSize: getFontSize(12),
        width: wp(12),
    },
    chartBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
    },
    chartBar: {
        height: 14,
        backgroundColor: '#6366F1',
        borderRadius: 4,
        minWidth: 4,
    },
    chartBarLabel: {
        color: '#666',
        fontSize: getFontSize(10),
        fontWeight: '600',
    },
    chartRatingCell: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(0.5),
        width: wp(14),
        justifyContent: 'flex-end',
    },
    chartRating: {
        color: '#333',
        fontWeight: '700',
        fontSize: getFontSize(12),
    },
    // Summary cards
    summaryCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2.5),
    },
    summaryCard: {
        width: (wp(100) - wp(8) - wp(2.5)) / 2,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: wp(3.5),
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    summaryValue: {
        color: '#111',
        fontWeight: '900',
        fontSize: getFontSize(22),
    },
    summaryLabel: {
        color: '#999',
        fontSize: getFontSize(10),
        marginTop: hp(0.2),
    },
});
