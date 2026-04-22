import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppHeader from '@/core/AppHeader'
import { useNavigation } from '@react-navigation/native'
import { screenNames } from '@/navigation/screenNames'
// ── Simple Progress Bar ──
const ProgressBar = ({ progress, color }) => (
  <View style={{ height: 6, borderRadius: 3, backgroundColor: '#F3F4F6', marginTop: hp(0.5), overflow: 'hidden' }}>
    <View style={{ height: '100%', borderRadius: 3, backgroundColor: color, width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }} />
  </View>
)

// ── KPI Card ──
const KPICard = ({ icon, iconColor, title, value, subtitle, onPress }) => (
  <TouchableOpacity style={styles.kpiCard} activeOpacity={onPress ? 0.7 : 1} onPress={onPress}>
    <View style={[styles.kpiIconCircle, { backgroundColor: iconColor + '15' }]}>
      <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={20} color={iconColor} />
    </View>
    <AppText variant={Variant.caption} style={styles.kpiTitle}>{title}</AppText>
    <AppText variant={Variant.h3} style={styles.kpiValue}>{value}</AppText>
    {subtitle ? <AppText variant={Variant.caption} style={styles.kpiSubtitle}>{subtitle}</AppText> : null}
  </TouchableOpacity>
)

// ── Progress KPI ──
const ProgressKPI = ({ title, value, color, icon }) => {
  const numVal = parseFloat(value) || 0
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={16} color={color} />
        <AppText variant={Variant.caption} style={styles.progressLabel}>{title}</AppText>
      </View>
      <AppText variant={Variant.bodyMedium} style={[styles.progressValue, { color }]}>{value}</AppText>
      <ProgressBar progress={numVal / 100} color={color} />
    </View>
  )
}

// ── Alert Card ──
const AlertCard = ({ icon, iconColor, bgColor, text, buttonText, onPress }) => (
  <TouchableOpacity style={[styles.alertCard, { backgroundColor: bgColor }]} activeOpacity={0.7} onPress={onPress}>
    <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={20} color={iconColor} />
    <AppText variant={Variant.body} style={styles.alertText}>{text}</AppText>
    {buttonText ? (
      <View style={styles.alertBtn}>
        <AppText variant={Variant.caption} style={[styles.alertBtnText, { color: iconColor }]}>{buttonText}</AppText>
      </View>
    ) : null}
  </TouchableOpacity>
)

// ── Tip Card ──
const TipCard = ({ title, description, bgColor, iconColor, icon, onDismiss }) => (
  <View style={[styles.tipCard, { backgroundColor: bgColor }]}>
    <View style={styles.tipRow}>
      <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={18} color={iconColor} />
      <View style={styles.tipContent}>
        <AppText variant={Variant.bodyMedium} style={[styles.tipTitle, { color: iconColor }]}>{title}</AppText>
        <AppText variant={Variant.caption} style={styles.tipDescription}>{description}</AppText>
      </View>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <VectorIcons name={iconLibName.Ionicons} iconName="close" size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  </View>
)

const JobSeekerDashboard = () => {
  const navigation = useNavigation()
  const activeJobs = useSelector(state => state?.jobs?.activeJobs || [])
  const acceptedOffers = useSelector(state => state?.jobSeekerOffers?.acceptedOffers || [])

  const [dismissedTips, setDismissedTips] = useState([])
  const dismissTip = (key) => setDismissedTips(prev => [...prev, key])

  // Mock KPI data
  const activeCount = activeJobs.length || 0
  const earningsThisMonth = '1,250'
  const acceptanceRate = '92'
  const completionRate = '88'
  const onTimeRate = '95'
  const disputeRate = '2'
  const profileViews = '47'

  return (
    <View style={styles.container}>
      <AppHeader showBackButton={false} title="Dashboard" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ═══ KPI Cards ═══ */}
        <View style={styles.kpiRow}>
          <KPICard
            icon="briefcase-outline"
            iconColor="#6366F1"
            title="Active Offers"
            value={String(activeCount)}
            onPress={() => navigation.navigate(screenNames.ACTIVE_OFFERS_POOL)}
          />
          <KPICard
            icon="cash-outline"
            iconColor="#16A34A"
            title="Earnings This Month"
            value={`${earningsThisMonth} SG`}
            subtitle="+15% vs last month"
            onPress={() => navigation.navigate(screenNames.JOBSEEKER_EARNING_REPORTS)}
          />
        </View>

        {/* Progress KPIs */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <VectorIcons name={iconLibName.Ionicons} iconName="analytics-outline" size={18} color={colors.primary} />
            <AppText variant={Variant.bodyMedium} style={styles.cardHeaderTitle}>Performance Overview</AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.progressGrid}>
            <ProgressKPI title="Acceptance Rate" value={`${acceptanceRate}%`} color="#10B981" icon="checkmark-circle-outline" />
            <ProgressKPI title="Completion Rate" value={`${completionRate}%`} color="#3B82F6" icon="checkmark-done-outline" />
            <ProgressKPI title="On-Time Rate" value={`${onTimeRate}%`} color="#8B5CF6" icon="time-outline" />
            <ProgressKPI title="Dispute Rate" value={`${disputeRate}%`} color="#EF4444" icon="alert-circle-outline" />
          </View>
          <TouchableOpacity
            style={styles.viewAnalyticsBtn}
            onPress={() => navigation.navigate(screenNames.JOBSEEKER_PERFORMANCE_ANALYTICS)}
            activeOpacity={0.7}
          >
            <AppText variant={Variant.caption} style={styles.viewAnalyticsBtnText}>Performance Analytics</AppText>
            <VectorIcons name={iconLibName.Ionicons} iconName="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.kpiRow}>
          <KPICard
            icon="eye-outline"
            iconColor="#F59E0B"
            title="Profile Views"
            value={profileViews}
            subtitle="This week"
          />
          <KPICard
            icon="star-outline"
            iconColor="#EC4899"
            title="Avg Rating"
            value="4.8"
            subtitle="From 23 reviews"
          />
        </View>

        {/* ═══ Alerts & Highlights ═══ */}
        <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Alerts & Highlights</AppText>

        {activeCount > 0 ? (
          <AlertCard
            icon="mail-unread-outline"
            iconColor="#6366F1"
            bgColor="#EEF2FF"
            text={`You have ${activeCount} new job offer${activeCount > 1 ? 's' : ''}`}
            buttonText="View Offers"
            onPress={() => navigation.navigate(screenNames.ACTIVE_OFFERS_POOL)}
          />
        ) : null}

        {acceptedOffers.length > 0 ? (
          <AlertCard
            icon="play-circle-outline"
            iconColor="#10B981"
            bgColor="#F0FDF4"
            text={`${acceptedOffers.length} job${acceptedOffers.length > 1 ? 's' : ''} in progress`}
            buttonText="Current Jobs"
            onPress={() => navigation.navigate(screenNames.JOBSEEKER_TAB)}
          />
        ) : null}

        {parseInt(acceptanceRate) < 85 ? (
          <AlertCard
            icon="trending-down-outline"
            iconColor="#EF4444"
            bgColor="#FEF2F2"
            text="Acceptance Rate dropped below 85%"
            buttonText="How to Improve"
            onPress={() => navigation.navigate(screenNames.JOBSEEKER_PERFORMANCE_ANALYTICS)}
          />
        ) : null}

        <AlertCard
          icon="person-outline"
          iconColor="#F59E0B"
          bgColor="#FFFBEB"
          text="Profile 80% complete"
          buttonText="Complete Profile"
          onPress={() => navigation.navigate(screenNames.PROFILE)}
        />

        {/* ═══ Tips ═══ */}
        <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Tips</AppText>

        {!dismissedTips.includes('profile') ? (
          <TipCard
            icon="bulb-outline"
            iconColor="#2563EB"
            bgColor="#EFF6FF"
            title="Profile Optimization"
            description="Add skills and certifications to increase your visibility by up to 60%"
            onDismiss={() => dismissTip('profile')}
          />
        ) : null}

        {!dismissedTips.includes('acceptance') ? (
          <TipCard
            icon="trending-up-outline"
            iconColor="#16A34A"
            bgColor="#F0FDF4"
            title="Acceptance Rate"
            description="Maintain above 85% to qualify for premium job offers"
            onDismiss={() => dismissTip('acceptance')}
          />
        ) : null}

        {!dismissedTips.includes('rating') ? (
          <TipCard
            icon="star-outline"
            iconColor="#7C3AED"
            bgColor="#F5F3FF"
            title="Rating Improvement"
            description="Complete jobs early and communicate proactively to earn 5-star ratings"
            onDismiss={() => dismissTip('rating')}
          />
        ) : null}

        {/* ═══ News & Updates ═══ */}
        <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>News & Updates</AppText>

        <View style={styles.card}>
          <View style={styles.newsItem}>
            <View style={[styles.newsTag, { backgroundColor: '#D1FAE5' }]}>
              <AppText variant={Variant.caption} style={[styles.newsTagText, { color: '#065F46' }]}>Platform Update</AppText>
            </View>
            <AppText variant={Variant.bodyMedium} style={styles.newsTitle}>Enhanced AI Matching System</AppText>
            <AppText variant={Variant.caption} style={styles.newsDesc}>
              Our improved algorithm now considers skill compatibility, location preferences, and work history for better job matches.
            </AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.newsItem}>
            <View style={[styles.newsTag, { backgroundColor: '#DBEAFE' }]}>
              <AppText variant={Variant.caption} style={[styles.newsTagText, { color: '#1E40AF' }]}>Market Trend</AppText>
            </View>
            <AppText variant={Variant.bodyMedium} style={styles.newsTitle}>New Labor Market Reforms</AppText>
            <AppText variant={Variant.caption} style={styles.newsDesc}>
              Government introduces new regulations for gig workers, including minimum wage protections and benefits eligibility.
            </AppText>
          </View>
        </View>

        {/* ═══ Quick Actions ═══ */}
        <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Quick Actions</AppText>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate(screenNames.ACTIVE_OFFERS_POOL)} activeOpacity={0.7}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#EEF2FF' }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="briefcase-outline" size={20} color="#6366F1" />
            </View>
            <AppText variant={Variant.caption} style={styles.quickActionText}>Job Pool</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate(screenNames.JOBSEEKER_JOB_REPORTS)} activeOpacity={0.7}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="bar-chart-outline" size={20} color="#D97706" />
            </View>
            <AppText variant={Variant.caption} style={styles.quickActionText}>Reports</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate(screenNames.Wallet)} activeOpacity={0.7}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F0FDF4' }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="wallet-outline" size={20} color="#16A34A" />
            </View>
            <AppText variant={Variant.caption} style={styles.quickActionText}>Wallet</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate(screenNames.PROFILE)} activeOpacity={0.7}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FDF2F8' }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="person-outline" size={20} color="#EC4899" />
            </View>
            <AppText variant={Variant.caption} style={styles.quickActionText}>Profile</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate(screenNames.ANNOUNCEMENTS)} activeOpacity={0.7}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F3E8FF' }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="megaphone-outline" size={20} color="#7C3AED" />
            </View>
            <AppText variant={Variant.caption} style={styles.quickActionText}>Media</AppText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  )
}

export default JobSeekerDashboard

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: wp(4), paddingBottom: hp(5) },

  // KPI Cards
  kpiRow: { flexDirection: 'row', gap: wp(3), marginBottom: hp(2) },
  kpiCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: hp(2), padding: wp(4),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  kpiIconCircle: { width: wp(10), height: wp(10), borderRadius: wp(5), justifyContent: 'center', alignItems: 'center', marginBottom: hp(1) },
  kpiTitle: { color: '#6B7280', fontSize: getFontSize(11), fontWeight: '600', marginBottom: hp(0.3) },
  kpiValue: { color: colors.secondary || '#111827', fontWeight: '800', fontSize: getFontSize(22), marginBottom: hp(0.2) },
  kpiSubtitle: { color: '#9CA3AF', fontSize: getFontSize(10) },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2.5), padding: wp(5), marginBottom: hp(2),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  cardHeaderTitle: { color: colors.secondary, fontWeight: '800', fontSize: getFontSize(16) },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },

  // Progress KPIs
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(3) },
  progressCard: { width: '47%', marginBottom: hp(1.5) },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), marginBottom: hp(0.3) },
  progressLabel: { color: '#6B7280', fontSize: getFontSize(11), fontWeight: '600' },
  progressValue: { fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(0.2) },
  viewAnalyticsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(1.5), paddingVertical: hp(1), borderTopWidth: 1, borderTopColor: '#F3F4F6', marginTop: hp(0.5) },
  viewAnalyticsBtnText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(12) },

  // Section
  sectionTitle: { color: colors.secondary || '#111827', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(1.2), marginTop: hp(0.5) },

  // Alerts
  alertCard: {
    flexDirection: 'row', alignItems: 'center', gap: wp(3), padding: wp(4), borderRadius: hp(1.5), marginBottom: hp(1),
  },
  alertText: { flex: 1, color: '#374151', fontSize: getFontSize(13), fontWeight: '500' },
  alertBtn: { paddingHorizontal: wp(3), paddingVertical: hp(0.5), borderRadius: hp(1.2), backgroundColor: '#FFFFFF' },
  alertBtnText: { fontWeight: '700', fontSize: getFontSize(11) },

  // Tips
  tipCard: { borderRadius: hp(1.5), padding: wp(4), marginBottom: hp(1) },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3) },
  tipContent: { flex: 1 },
  tipTitle: { fontWeight: '700', fontSize: getFontSize(13), marginBottom: hp(0.3) },
  tipDescription: { color: '#555', fontSize: getFontSize(12), lineHeight: getFontSize(18) },

  // News
  newsItem: { marginBottom: hp(1) },
  newsTag: { alignSelf: 'flex-start', paddingHorizontal: wp(2.5), paddingVertical: hp(0.3), borderRadius: hp(1), marginBottom: hp(0.8) },
  newsTagText: { fontWeight: '700', fontSize: getFontSize(10) },
  newsTitle: { color: colors.secondary, fontWeight: '700', fontSize: getFontSize(14), marginBottom: hp(0.4) },
  newsDesc: { color: '#6B7280', fontSize: getFontSize(12), lineHeight: getFontSize(18) },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
  quickAction: { alignItems: 'center', width: '23%' },
  quickActionIcon: { width: wp(13), height: wp(13), borderRadius: hp(2), justifyContent: 'center', alignItems: 'center', marginBottom: hp(0.8) },
  quickActionText: { color: '#374151', fontSize: getFontSize(11), fontWeight: '600', textAlign: 'center' },
})
