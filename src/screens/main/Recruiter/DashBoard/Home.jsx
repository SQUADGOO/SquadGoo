import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import VectorIcons from '@/theme/vectorIcon'
import { screenNames } from '@/navigation/screenNames'
import { useSelector } from 'react-redux'
import { selectAllNotifications } from '@/store/notificationsSlice'
import Svg, { Polyline, Rect } from 'react-native-svg'

const StatCard = ({ title, value, subtitle }) => (
    <View style={styles.statCard}>
        <AppText variant={Variant.body} style={styles.statTitle}>{title}</AppText>
        <AppText variant={Variant.title} style={styles.statValue}>{value}</AppText>
        {subtitle && <AppText variant={Variant.caption} style={styles.statSubtitle}>{subtitle}</AppText>}
    </View>
)

const Sparkline = ({ series = [], color = '#41D761' }) => {
    if (!Array.isArray(series) || series.length < 2) return null
    const width = wp(18)
    const height = hp(3.2)
    const padding = 2
    const max = Math.max(...series) || 1
    const barWidth = (width - padding * 2) / series.length - 1
    const gap = 1

    return (
        <Svg width={width} height={height}>
            {series.map((v, i) => {
                const barHeight = ((v / max) * (height - padding * 2)) || 1
                const x = padding + i * (barWidth + gap)
                const y = height - padding - barHeight
                return (
                    <Rect
                        key={i}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx={1}
                        fill={color}
                        opacity={0.85}
                    />
                )
            })}
        </Svg>
    )
}

const AnalyticsCard = ({
    title,
    value,
    valueColor,
    leftNote,
    rightNote,
    rightNoteColor,
    trendDirection = 'up', // up | down | flat
    tooltipText,
    series,
}) => {
    const trendColor = trendDirection === 'down' ? '#EF4444' : trendDirection === 'flat' ? '#8E93A8' : '#41D761'
    const trendIcon =
        trendDirection === 'down'
            ? 'arrow-down-right'
            : trendDirection === 'flat'
                ? 'minus'
                : 'arrow-up-right'

    return (
        <View style={styles.analyticsCard}>
            <View style={styles.analyticsHeader}>
                <View style={styles.analyticsTitleRow}>
                    <AppText variant={Variant.body} style={styles.analyticsTitle}>{title}</AppText>
                    {tooltipText ? (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => Alert.alert(title, tooltipText)}
                            style={styles.infoIconBtn}
                        >
                            <VectorIcons name="Feather" iconName="info" size={16} color="#8E93A8" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={styles.analyticsRight}>
                    <AppText
                        variant={Variant.title}
                        style={[
                            styles.analyticsValue,
                            valueColor ? { color: valueColor } : null
                        ]}
                    >
                        {value}
                    </AppText>
                    <View style={styles.analyticsMiniRow}>
                        <VectorIcons name="Feather" iconName={trendIcon} size={14} color={trendColor} />
                        <Sparkline series={series} color={trendColor} />
                    </View>
                </View>
            </View>

            <View style={styles.analyticsFooter}>
                <AppText variant={Variant.caption} style={styles.analyticsLeftNote}>{leftNote}</AppText>
                <AppText
                    variant={Variant.caption}
                    style={[
                        styles.analyticsRightNote,
                        rightNoteColor ? { color: rightNoteColor } : null
                    ]}
                >
                    {rightNote}
                </AppText>
            </View>
        </View>
    )
}

const ActivityItem = ({ color, text, time, iconName }) => (
    <View style={styles.activityItem}>
        <View style={styles.activityLeft}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            {iconName ? (
                <View style={styles.activityIcon}>
                    <VectorIcons name="Feather" iconName={iconName} size={14} color={color} />
                </View>
            ) : null}
        </View>
        <View>
            <AppText variant={Variant.body} style={styles.activityText}>{text}</AppText>
            <AppText variant={Variant.caption} style={styles.activityTime}>{time}</AppText>
        </View>
    </View>
)

const QuickAction = ({ iconLib, iconName, label, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
        <VectorIcons name={iconLib} iconName={iconName} size={22} color={'#7C4DFF'} />
        <AppText variant={Variant.body} style={styles.quickActionText}>{label}</AppText>
    </TouchableOpacity>
)

const MetricActionCard = ({ color, title, value, subtitle, onPress }) => (
    <TouchableOpacity
        style={[styles.metricActionCard, { borderColor: color }]}
        activeOpacity={0.85}
        onPress={onPress}
    >
        <AppText variant={Variant.title} style={[styles.metricActionValue, { color }]}>
            {value}
        </AppText>
        <AppText variant={Variant.bodyMedium} style={styles.metricActionTitle}>
            {title}
        </AppText>
        <AppText variant={Variant.caption} style={styles.metricActionSubtitle}>
            {subtitle}
        </AppText>
    </TouchableOpacity>
)

const HomeScreen = ({ navigation }) => {
    const notifications = useSelector(selectAllNotifications)
    const activeJobs = useSelector((state) => state.jobs?.activeJobs || [])
    const completedJobs = useSelector((state) => state.jobs?.completedJobs || [])
    const expiredJobs = useSelector((state) => state.jobs?.expiredJobs || [])
    const draftedJobs = useSelector((state) => state.jobs?.draftedJobs || [])

    const manualOffers = useSelector((state) => state.manualOffers?.offers || [])
    const manualMatchesByJobId = useSelector((state) => state.manualOffers?.matchesByJobId || {})
    const quickOffers = useSelector((state) => state.quickSearch?.activeOffers || [])
    const quickMatchesByJobId = useSelector((state) => state.quickSearch?.matchesByJobId || {})

    const totalOffersCreated = activeJobs.length + completedJobs.length + expiredJobs.length + draftedJobs.length

    const totalMatchedCandidates = React.useMemo(() => {
        const ids = new Set()
        Object.values(manualMatchesByJobId || {}).forEach((list) => {
            if (!Array.isArray(list)) return
            list.forEach((c) => c?.id && ids.add(c.id))
        })
        Object.values(quickMatchesByJobId || {}).forEach((list) => {
            if (!Array.isArray(list)) return
            list.forEach((c) => c?.id && ids.add(c.id))
        })
        return ids.size
    }, [manualMatchesByJobId, quickMatchesByJobId])

    const pendingOfferAcceptanceCount = React.useMemo(() => {
        const isPending = (s) => s === 'pending' || s === 'modification_requested'
        const manual = Array.isArray(manualOffers) ? manualOffers.filter(o => isPending(o?.status)).length : 0
        const quick = Array.isArray(quickOffers) ? quickOffers.filter(o => isPending(o?.status)).length : 0
        return manual + quick
    }, [manualOffers, quickOffers])

    const formatTimeAgo = (iso) => {
        if (!iso) return ''
        const d = iso instanceof Date ? iso : new Date(iso)
        if (Number.isNaN(d.getTime())) return ''
        const diffMs = Date.now() - d.getTime()
        const diffMin = Math.max(0, Math.floor(diffMs / 60000))
        if (diffMin < 1) return 'Just now'
        if (diffMin === 1) return '1 min ago'
        if (diffMin < 60) return `${diffMin} min ago`
        const diffHr = Math.floor(diffMin / 60)
        if (diffHr === 1) return '1 hour ago'
        if (diffHr < 24) return `${diffHr} hours ago`
        const diffDay = Math.floor(diffHr / 24)
        if (diffDay === 1) return 'Yesterday'
        return `${diffDay} days ago`
    }

    const activityItems = React.useMemo(() => {
        const list = Array.isArray(notifications) ? notifications : []

        const allowedTypes = new Set([
            'new_offer',
            'manual_offer',
            'offer_accepted',
            'offer_declined',
            'offer_withdrawn',
            'modification_requested',
            'modification_accepted',
            'modification_declined',
            'timer_started',
            'timer_stopped',
            'job_completed',
            'location_update',
            'arrived',
            'offer_expired',
            'match_found',
            'quick_search_completed',
            'manual_search_completed',
        ])

        const mapVisual = (type) => {
            switch (type) {
                case 'offer_accepted':
                case 'modification_accepted':
                    return { color: '#41D761', iconName: 'check-circle' }
                case 'offer_declined':
                case 'modification_declined':
                    return { color: '#EF4444', iconName: 'x-circle' }
                case 'modification_requested':
                    return { color: '#FF8C42', iconName: 'edit-3' }
                case 'new_offer':
                case 'manual_offer':
                    return { color: '#7C4DFF', iconName: 'mail' }
                case 'timer_started':
                    return { color: '#2979FF', iconName: 'play-circle' }
                case 'job_completed':
                    return { color: '#10B981', iconName: 'award' }
                case 'offer_expired':
                    return { color: '#9CA3AF', iconName: 'clock' }
                case 'offer_withdrawn':
                    return { color: '#EF4444', iconName: 'slash' }
                default:
                    return { color: '#7C4DFF', iconName: 'activity' }
            }
        }

        const filtered = list
            .filter(n => allowedTypes.has(n?.type))
            .slice(0, 6)
            .map(n => {
                const v = mapVisual(n?.type)
                return {
                    id: n?.id || `${n?.type}-${n?.createdAt || ''}`,
                    text: n?.message || n?.title || 'Activity',
                    time: formatTimeAgo(n?.createdAt),
                    ...v,
                }
            })

        return filtered
    }, [notifications])

    // Quick Action Handlers
    const handleFindStaff = () => {
        navigation.navigate(screenNames.Tab_NAVIGATION, {
            screen: screenNames.FIND_STAFF,
        })
    }

    const handleViewPools = () => {
        navigation.navigate(screenNames.LABOR_POOL)
    }

    const handleManageOffers = () => {
        navigation.navigate(screenNames.Tab_NAVIGATION, {
            screen: screenNames.HOME,
        })
    }

    const handleMedia = () => {
        navigation.navigate(screenNames.ANNOUNCEMENTS)
    }

    const handleMessages = () => {
        navigation.navigate(screenNames.MESSAGES)
    }

    const handleNotifications = () => {
        navigation.navigate(screenNames.NOTICATIONS)
    }

    const handleSearch = () => {
        navigation.navigate(screenNames.Tab_NAVIGATION, {
            screen: screenNames.FIND_STAFF,
        })
    }

    return (
        <View style={styles.container}>

            <AppHeader
                title="Dashboard"
                rightIcons={[
                    { name: 'Feather', iconName: 'message-circle', onPress: handleMessages },
                    { name: 'Feather', iconName: 'bell', onPress: handleNotifications },
                    { name: 'Feather', iconName: 'search', onPress: handleSearch },
                ]}
                titleStyle={{ color: '#fff' }}
                containerStyle={{ backgroundColor: 'transparent' }}
            />


            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <View style={styles.statsRow}>
                    <StatCard title="Active Job Offers" value="12" subtitle="+2 from last week" />
                    <StatCard title="Completed Hires" value="48" subtitle="This month" />
                </View>
                <View style={styles.statsRow}>
                    <StatCard title="Available Candidates" value="1,247" subtitle="In your area" />
                    <StatCard title="SG Coins Balance" value="2,450" subtitle="Available balance" />
                </View>

                {/* Recent Activity */}
                <AppText variant={Variant.subTitle} style={styles.sectionTitle}>Recent Activity</AppText>
                {activityItems.length > 0 ? (
                    activityItems.map(item => (
                        <ActivityItem
                            key={item.id}
                            color={item.color}
                            iconName={item.iconName}
                            text={item.text}
                            time={item.time}
                        />
                    ))
                ) : (
                    <AppText variant={Variant.body} style={styles.emptyActivityText}>
                        No recent activity yet
                    </AppText>
                )}

                {/* Quick Actions */}
                <AppText variant={Variant.subTitle} style={styles.sectionTitle}>Quick Actions</AppText>
                <View style={styles.quickActionsRow}>
                    <QuickAction 
                        iconLib="Feather" 
                        iconName="user-plus" 
                        label="Find a Staff" 
                        onPress={handleFindStaff}
                    />
                    <QuickAction 
                        iconLib="Feather" 
                        iconName="users" 
                        label="View Pools" 
                        onPress={handleViewPools}
                    />
                </View>
                <View style={styles.quickActionsRow}>
                    <QuickAction
                        iconLib="Feather"
                        iconName="file-text"
                        label="Manage Offers"
                        onPress={handleManageOffers}
                    />
                    <QuickAction
                        iconLib="Feather"
                        iconName="send"
                        label="Messages"
                        onPress={handleMessages}
                    />
                </View>
                <View style={styles.quickActionsRow}>
                    <QuickAction
                        iconLib="Feather"
                        iconName="radio"
                        label="Media"
                        onPress={handleMedia}
                    />
                    <View style={{flex: 1, marginHorizontal: 4}} />
                </View>

                <AppText variant={Variant.subTitle} style={styles.sectionTitle}>
                    Hiring Analytics & Performance
                </AppText>
                <AppText variant={Variant.body} style={styles.sectionSubtitle}>
                    Track your recruitment success metrics
                </AppText>

                <View>
                    <AnalyticsCard
                        title="Offer Acceptance Rate"
                        value="78%"
                        valueColor="#41D761"                 // green value
                        leftNote="Last 30 days"
                        rightNote="+5% from last month"
                        rightNoteColor="#41D761"            // green note
                        trendDirection="up"
                        series={[62, 65, 66, 70, 73, 78]}
                        tooltipText="Percentage of offers accepted by candidates. Higher is better."
                    />

                    <AnalyticsCard
                        title="Average Time to Hire"
                        value="3.2 days"
                        valueColor="#222222"                // dark value
                        leftNote="From posting to acceptance"
                        rightNote="-0.8 days improvement"
                        rightNoteColor="#41D761"            // green for improvement
                        trendDirection="up"
                        series={[4.8, 4.2, 4.0, 3.7, 3.5, 3.2]}
                        tooltipText="Average time from posting an offer to a candidate accepting it. Lower is better."
                    />

                    <AnalyticsCard
                        title="Cost per Hire"
                        value="145 SG"
                        valueColor="#222222"
                        leftNote="Average SG coins spent"
                        rightNote="+12 SG from last month"
                        rightNoteColor="#EF4444"            // red means higher cost
                        trendDirection="down"
                        series={[120, 124, 130, 136, 140, 145]}
                        tooltipText="Average SG Coins spent per successful hire. Lower is better."
                    />
                </View>
                {/* Recruitment metrics */}
                <AppText variant={Variant.subTitle} style={styles.sectionTitle}>
                    Recruitment Metrics
                </AppText>
                <View style={styles.metricsGrid}>
                    <MetricActionCard
                        color="#2979FF"
                        title="Total Offers Created"
                        value={String(totalOffersCreated)}
                        subtitle="All offers you’ve created"
                        onPress={handleManageOffers}
                    />
                    <MetricActionCard
                        color="#7C4DFF"
                        title="Total Matched Candidates"
                        value={String(totalMatchedCandidates)}
                        subtitle="All candidates matched to your offers"
                        onPress={() => navigation.navigate(screenNames.MATCHED_CANDIDATES_POOL)}
                    />
                </View>
                <View style={[styles.metricsGrid, { width: '100%' }]}>
                    <MetricActionCard
                        color="#FF8C42"
                        title="Pending Offer Acceptance"
                        value={String(pendingOfferAcceptanceCount)}
                        subtitle="Awaiting response or modification"
                        onPress={() => navigation.navigate(screenNames.PENDING_OFFER_ACCEPTANCE)}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default HomeScreen

// ---------------- Styles ---------------- //
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        paddingBottom: hp(4),
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    scrollContent: { padding: wp(4), paddingBottom: hp(5) },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF6F2',
        padding: wp(4),
        borderRadius: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#F1E3DC',
    },
    statTitle: { fontSize: wp(3.2), color: '#333' },
    statValue: { fontSize: wp(5), fontWeight: 'bold', marginVertical: 4, color: '#222' },
    statSubtitle: { fontSize: wp(3), color: '#888' },
    sectionTitle: { marginTop: hp(2), marginBottom: hp(1), fontWeight: 'bold', fontSize: wp(4.2), color: '#000' },
    sectionSubtitle: { color: '#777', marginBottom: hp(1) },
    activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5), width: '90%' },
    activityLeft: { width: wp(10), flexDirection: 'row', alignItems: 'center', gap: wp(2) },
    dot: { width: 10, height: 10, borderRadius: 5 },
    activityIcon: { width: 18, alignItems: 'center' },
    activityText: { fontSize: wp(3.5), color: '#333' },
    activityTime: { fontSize: wp(3), color: '#999' },
    emptyActivityText: { color: '#777', marginBottom: hp(1), paddingVertical: hp(1) },
    quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
    quickAction: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0D6F5',
        borderRadius: 12,
        padding: wp(4),
        alignItems: 'center',
        marginHorizontal: 4,
    },
    quickActionText: { marginTop: 5, fontSize: wp(3.5), color: '#444' },
    analyticsBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0D6F5',
        borderRadius: 12,
        padding: wp(4),
        marginBottom: hp(1.5),
    },
    analyticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    /* ====== Styles: add these to your StyleSheet (or merge with existing) ====== */

    analyticsCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EADFF7',   // light purple border like the mock
        borderRadius: 12,
        paddingVertical: hp(1.2),
        paddingHorizontal: wp(4),
        marginBottom: hp(1.4),
        // keeps the cards visually flat like the screenshot
    },
    analyticsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(0.6),
    },
    analyticsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2) },
    infoIconBtn: { paddingHorizontal: wp(1), paddingVertical: hp(0.2) },
    analyticsRight: { alignItems: 'flex-end', gap: hp(0.4) },
    analyticsMiniRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2) },
    analyticsTitle: {
        fontSize: wp(3.4),
        fontWeight: '600',
        color: '#222222',        // near-black title color
    },
    analyticsValue: {
        fontSize: wp(4.6),
        fontWeight: '700',
        color: '#222222',
        textAlign: 'right',
    },

    analyticsFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(0.2),
    },
    analyticsLeftNote: {
        fontSize: wp(3),
        color: '#8E93A8',        // muted grey/blue for left small caption
    },
    analyticsRightNote: {
        fontSize: wp(3),
        color: '#8E93A8',
        textAlign: 'right',
    },



    analyticsValue: { fontSize: wp(5), fontWeight: 'bold', marginVertical: 4, color: '#222' },
    analyticsNote: { fontSize: wp(3), color: '#777' },
    metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
    metricActionCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: wp(4),
        borderRadius: 12,
        marginHorizontal: 4,
        borderWidth: 1.2,
    },
    metricActionValue: { fontWeight: '800', marginBottom: hp(0.4) },
    metricActionTitle: { color: '#111', marginBottom: hp(0.2) },
    metricActionSubtitle: { color: '#888' },
})
