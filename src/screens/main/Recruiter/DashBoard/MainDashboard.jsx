import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import VectorIcons from '@/theme/vectorIcon'

const StatCard = ({ title, value, subtitle }) => (
    <View style={styles.statCard}>
        <AppText variant={Variant.body} style={styles.statTitle}>{title}</AppText>
        <AppText variant={Variant.title} style={styles.statValue}>{value}</AppText>
        {subtitle && <AppText variant={Variant.caption} style={styles.statSubtitle}>{subtitle}</AppText>}
    </View>
)
const AnalyticsCard = ({ title, value, valueColor, leftNote, rightNote, rightNoteColor }) => (
  <View style={styles.analyticsCard}>
    <View style={styles.analyticsHeader}>
      <AppText variant={Variant.body} style={styles.analyticsTitle}>{title}</AppText>
      <AppText variant={Variant.title} style={[styles.analyticsValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </AppText>
    </View>

    <View style={styles.analyticsFooter}>
      <AppText variant={Variant.caption} style={styles.analyticsLeftNote}>{leftNote}</AppText>
      <AppText variant={Variant.caption} style={[styles.analyticsRightNote, rightNoteColor ? { color: rightNoteColor } : null]}>
        {rightNote}
      </AppText>
    </View>
  </View>
)

const ActivityItem = ({ color, text, time }) => (
    <View style={styles.activityItem}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View>
            <AppText variant={Variant.body} style={styles.activityText}>{text}</AppText>
            <AppText variant={Variant.caption} style={styles.activityTime}>{time}</AppText>
        </View>
    </View>
)

const QuickAction = ({ iconLib, iconName, label }) => (
    <TouchableOpacity style={styles.quickAction}>
        <VectorIcons name={iconLib} iconName={iconName} size={22} color={'#7C4DFF'} />
        <AppText variant={Variant.body} style={styles.quickActionText}>{label}</AppText>
    </TouchableOpacity>
)

const DashboardScreen = () => {
    return (
        <View style={styles.container}>

            <AppHeader
                title="Dashboard"
                rightIcons={[
                    { name: 'Feather', iconName: 'message-circle', onPress: () => { } },
                    { name: 'Feather', iconName: 'bell', onPress: () => { } },
                    { name: 'Feather', iconName: 'search', onPress: () => { } },
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
                <ActivityItem color="#41D761" text="New candidate matched for Marketing Manager" time="2 hours ago" />
                <ActivityItem color="#7C4DFF" text="Job offer accepted by John Smith" time="5 hours ago" />
                <ActivityItem color="#FF8C42" text="Quick search completed - 15 matches found" time="1 day ago" />

                {/* Quick Actions */}
                <AppText variant={Variant.subTitle} style={styles.sectionTitle}>Quick Actions</AppText>
                <View style={styles.quickActionsRow}>
                    <QuickAction iconLib="Feather" iconName="user-plus" label="Find a Staff" />
                    <QuickAction iconLib="Feather" iconName="users" label="View Pools" />
                </View>
                <View style={styles.quickActionsRow}>
                    <QuickAction iconLib="Feather" iconName="file-text" label="Manage Offers" />
                    <QuickAction iconLib="Feather" iconName="send" label="Messages" />
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
  />

  <AnalyticsCard
    title="Average Time to Hire"
    value="3.2 days"
    valueColor="#222222"                // dark value
    leftNote="From posting to acceptance"
    rightNote="-0.8 days improvement"
    rightNoteColor="#8E93A8"            // muted grey for improvement text
  />

  <AnalyticsCard
    title="Cost per Hire"
    value="145 SG"
    valueColor="#222222"
    leftNote="Average SG coins spent"
    rightNote="+12 SG from last month"
    rightNoteColor="#7C4DFF"            // purple accent for coin-change
  />
</View>
                {/* Hiring Metrics */}
                <View style={styles.metricsGrid}>
                    <View style={[styles.metricCard, { borderColor: '#2979FF' }]}>
                        <AppText variant={Variant.title} style={{ color: '#2979FF' }}>24</AppText>
                        <AppText variant={Variant.caption}>Job Postings</AppText>
                        <AppText variant={Variant.caption} style={styles.metricSubtitle}>Active positions</AppText>
                    </View>
                    <View style={[styles.metricCard, { borderColor: '#7C4DFF' }]}>
                        <AppText variant={Variant.title} style={{ color: '#7C4DFF' }}>156</AppText>
                        <AppText variant={Variant.caption}>Applications</AppText>
                        <AppText variant={Variant.caption} style={styles.metricSubtitle}>Total received</AppText>
                    </View>
                </View>

                <View style={styles.metricsGrid}>
                    <View style={[styles.metricCard, { borderColor: '#FF9800' }]}>
                        <AppText variant={Variant.title} style={{ color: '#FF9800' }}>89</AppText>
                        <AppText variant={Variant.caption}>Screening</AppText>
                        <AppText variant={Variant.caption} style={styles.metricSubtitle}>Under review</AppText>
                    </View>
                    <View style={[styles.metricCard, { borderColor: '#F44336' }]}>
                        <AppText variant={Variant.title} style={{ color: '#F44336' }}>34</AppText>
                        <AppText variant={Variant.caption}>Interviews</AppText>
                        <AppText variant={Variant.caption} style={styles.metricSubtitle}>Scheduled/pending</AppText>
                    </View>
                </View>

                <View style={[styles.metricsGrid, { width: '50%' }]}>
                    <View style={[styles.metricCard, { borderColor: '#4CAF50' }]}>
                        <AppText variant={Variant.title} style={{ color: '#4CAF50' }}>12</AppText>
                        <AppText variant={Variant.caption}>Offers Sent</AppText>
                        <AppText variant={Variant.caption} style={styles.metricSubtitle}>Awaiting response</AppText>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default DashboardScreen

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
    activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5) },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: wp(2) },
    activityText: { fontSize: wp(3.5), color: '#333' },
    activityTime: { fontSize: wp(3), color: '#999' },
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
    metricCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: wp(4),
        borderRadius: 12,
        marginHorizontal: 4,
        borderWidth: 1.2,
    },
    metricSubtitle: { color: '#888' },
})
