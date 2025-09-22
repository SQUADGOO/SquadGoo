import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons from '@/theme/vectorIcon'
import AppHeader from '@/core/AppHeader'

const StatCard = ({ title, value, subtitle }) => (
  <View style={styles.statCard}>
    <AppText style={styles.statTitle}>{title}</AppText>
    <AppText style={styles.statValue}>{value}</AppText>
    {subtitle && <AppText style={styles.statSubtitle}>{subtitle}</AppText>}
  </View>
)

const FeedCard = ({ tag, time, title, description }) => (
  <View style={styles.feedCard}>
    <View style={styles.feedHeader}>
      <AppText style={[styles.feedTag, tag === 'Breaking' && { backgroundColor: '#E7F9EF', color: '#27AE60' }]}>{tag}</AppText>
      <AppText style={styles.feedTime}>{time}</AppText>
    </View>
    <AppText style={styles.feedTitle}>{title}</AppText>
    <AppText style={styles.feedDesc} numberOfLines={2}>{description}</AppText>
  </View>
)

const TipCard = ({ title, description, bgColor, textColor }) => (
  <View style={[styles.tipCard, { backgroundColor: bgColor }]}>
    <AppText style={[styles.tipTitle, { color: textColor }]}>{title}</AppText>
    <AppText style={styles.tipDescription}>{description}</AppText>
  </View>
)


const JobCard = ({ title, details, time, quick }) => (
  <View style={styles.jobCard}>
    <View style={styles.jobHeader}>
      <AppText style={styles.jobTitle}>{title}</AppText>
      <AppText style={styles.jobTime}>{time}</AppText>
    </View>
    <AppText style={styles.jobDetails}>{details}</AppText>
    <View style={styles.jobButtons}>
      <TouchableOpacity style={styles.viewBtn}>
        <AppText style={styles.viewText}>View</AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.acceptBtn}>
        <AppText style={styles.acceptText}>Accept</AppText>
      </TouchableOpacity>
    </View>
  </View>
)

const JobSeekerDashboard = () => {
  return (
    <View style={styles.container}>
      {/* Gradient Header */}
 <AppHeader  showBackButton={false} title='Dashboard'/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard title="Active Offers" value="4" subtitle="2 quick, 1 manual" />
          <StatCard title="This Month Earnings" value="1,250 SG" subtitle="+15% from last month" />
        </View>
        <View style={styles.statsRow}>
          <StatCard title="Acceptance Rate" value="92%" subtitle="Excellent rating" />
          <StatCard title="Profile Views" value="47" subtitle="This week" />
        </View>

        {/* News & Feed */}
        <AppText style={styles.sectionTitle}>News & Feed</AppText>
        <AppText style={styles.sectionSubtitle}>Labour market updates and system suggestions</AppText>
        <FeedCard
          tag="Breaking"
          time="2 hours ago"
          title="New Labor Market Reforms Announced"
          description="Government introduces new regulations for gig workers, including minimum wage protections and benefits eligibility..."
        />
        <FeedCard
          tag="Platform Update"
          time="1 day ago"
          title="Enhanced AI Matching System"
          description="Our improved algorithm now considers skill compatibility, location preferences, and work history for better job matches..."
        />
        <FeedCard
          tag="Market Trend"
          time="3 days ago"
          title="Enhanced AI Matching System"
          description="Our improved algorithm now considers skill compatibility, location preferences, and work history for better job matches..."
        />

        {/* Tips */}
        <AppText style={styles.sectionTitle}>Tips</AppText>
        <TipCard 
  title="Profile Optimization Tip" 
  description="Add specific skills and certifications to increase your visibility by up to 60%" 
  bgColor="#EAF4FF" 
  textColor="#2979FF" 
/>

<TipCard 
  title="Acceptance Rate Tip" 
  description="Maintain above 85% acceptance rate to qualify for premium job offers" 
  bgColor="#E8FBF1" 
  textColor="#27AE60" 
/>

<TipCard 
  title="Rating Improvement" 
  description="Complete jobs early and communicate proactively to earn 5-star ratings" 
  bgColor="#F8EAFB" 
  textColor="#A44CEE" 
/>

        {/* Current Jobs */}
        <AppText style={styles.sectionTitle}>Current Job Offers & Important Notifications</AppText>
        <AppText style={styles.sectionSubtitle}>Offers requiring immediate attention</AppText>

        <JobCard title="Data Entry Specialist" details="Quick Offer • 4 hours • 120 SG/hour" time="01:47:23" quick />
        <JobCard title="Customer Service Rep" details="Manual Offer • Negotiable • Pro Recruiter" time="23:45:12 remaining" />
      </ScrollView>
    </View>
  )
}

export default JobSeekerDashboard

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: wp(4), paddingTop: hp(6), borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerIcons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: wp(6), fontWeight: '700', marginTop: hp(2) },

  scrollContent: { padding: wp(4), paddingBottom: hp(5) },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
  statCard: { flex: 1, backgroundColor: '#fff', padding: wp(4), borderRadius: 12, marginHorizontal: 4, borderWidth: 1, backgroundColor: '#FFD6A5AA' },
  statTitle: { fontSize: wp(3.2), color: '#6B6B6B', fontWeight: '500' },
  statValue: { fontSize: wp(5), fontWeight: '700', marginVertical: 4, color: '#222' },
  statSubtitle: { fontSize: wp(3), color: '#8E93A8' },

  sectionTitle: { marginTop: hp(2), fontWeight: '700', fontSize: wp(4.4), color: '#000' },
  sectionSubtitle: { color: '#777', marginBottom: hp(1), fontSize: wp(3.2) },

  feedCard: { borderWidth: 1, borderColor: '#EADFF7', borderRadius: 12, padding: wp(4), marginBottom: hp(1.5) },
  feedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  feedTag: { fontSize: wp(2.8), paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: '#F0F0F0', color: '#7C4DFF', marginRight: 10 },
  feedTime: { fontSize: wp(3), color: '#999' },
  feedTitle: { fontSize: wp(3.6), fontWeight: '600', color: '#222', marginBottom: 4 },
  feedDesc: { fontSize: wp(3.2), color: '#666' },

tipCard: { borderRadius: 12, padding: wp(3.5), marginBottom: hp(1.2) },
tipTitle: { fontSize: wp(3.4), fontWeight: '600' },
tipDescription: { fontSize: wp(3.2), color: '#555', marginTop: 4 },


  jobCard: { borderWidth: 1, borderColor: '#EADFF7', borderRadius: 12, padding: wp(4), marginBottom: hp(2) },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  jobTitle: { fontSize: wp(3.8), fontWeight: '600', color: '#222' },
  jobTime: { fontSize: wp(3), color: '#999' },
  jobDetails: { fontSize: wp(3.2), color: '#666', marginBottom: hp(1.5) },
  jobButtons: { flexDirection: 'row', justifyContent: 'flex-start' },
  viewBtn: { backgroundColor: '#FF8C42', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8, marginRight: 10 },
  acceptBtn: { borderWidth: 1, borderColor: '#27AE60', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  viewText: { color: '#fff', fontWeight: '600' },
  acceptText: { color: '#27AE60', fontWeight: '600' },
})
