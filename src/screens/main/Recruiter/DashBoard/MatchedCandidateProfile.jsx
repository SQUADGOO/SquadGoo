import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import AppHeader from '@/core/AppHeader'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import VectorIcons from '@/theme/vectorIcon'
import { colors, hp, wp } from '@/theme'
import { screenNames } from '@/navigation/screenNames'
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers'
import { DUMMY_CONTRACTORS } from '@/utilities/dummyContractors'
import { DUMMY_EMPLOYEES } from '@/utilities/dummyEmployees'

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000

const findCandidateById = (id) => {
  if (!id) return null
  return (
    DUMMY_JOB_SEEKERS.find((c) => c.id === id) ||
    DUMMY_CONTRACTORS.find((c) => c.id === id) ||
    DUMMY_EMPLOYEES.find((c) => c.id === id) ||
    null
  )
}

const MatchedCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId, source } = route?.params || {}
  const userInfo = useSelector((state) => state?.auth?.userInfo || {})
  const currentUserId = userInfo?._id || userInfo?.id || userInfo?.userId || null

  const jobs = useSelector((state) => [
    ...(state.jobs?.activeJobs || []),
    ...(state.jobs?.completedJobs || []),
    ...(state.jobs?.expiredJobs || []),
    ...(state.jobs?.draftedJobs || []),
  ])
  const job = jobs.find((j) => j.id === jobId) || null

  const manualOffers = useSelector((state) => state.manualOffers?.offers || [])
  const quickOffers = useSelector((state) => state.quickSearch?.activeOffers || [])

  const offerForContext = React.useMemo(() => {
    const list = source === 'quick' ? quickOffers : manualOffers
    return list.find((o) => o?.jobId === jobId && o?.candidateId === candidateId) || null
  }, [source, quickOffers, manualOffers, jobId, candidateId])

  const candidate = React.useMemo(() => findCandidateById(candidateId), [candidateId])

  const matchCreatedAt = offerForContext?.createdAt || offerForContext?.updatedAt || null
  const canContactForMonth = React.useMemo(() => {
    if (!matchCreatedAt) return false
    const d = new Date(matchCreatedAt)
    if (Number.isNaN(d.getTime())) return false
    return Date.now() - d.getTime() <= ONE_MONTH_MS
  }, [matchCreatedAt])

  const handleChat = () => {
    if (!canContactForMonth) return
    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        jobId,
        name: candidate?.name || 'Candidate',
        jobTitle: job?.title || offerForContext?.jobTitle || 'Job',
        jobType: source === 'quick' ? 'quick' : 'manual',
        otherUserId: candidateId,
        userId: currentUserId,
      },
    })
  }

  if (!candidate) {
    return (
      <View style={styles.container}>
        <AppHeader title="Matched candidate" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.empty}>
          <AppText variant={Variant.body}>Candidate not found.</AppText>
        </View>
      </View>
    )
  }

  const phoneValue = canContactForMonth ? candidate?.phone : null

  return (
    <View style={styles.container}>
      <AppHeader title="Candidate profile" showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <AppText variant={Variant.title} style={styles.avatarText}>
                {(candidate?.name || '?').charAt(0)}
              </AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant={Variant.subTitle} style={styles.name}>
                {candidate?.name || 'Unknown'}
              </AppText>
              <AppText variant={Variant.caption} style={styles.sub}>
                {candidate?.location || 'Location not specified'}
              </AppText>
              <AppText variant={Variant.caption} style={styles.sub}>
                Matched for: {job?.title || offerForContext?.jobTitle || 'Job'}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <VectorIcons name="Feather" iconName="phone" size={16} color="#6B7280" />
            <AppText variant={Variant.body} style={styles.infoLabel}>Phone</AppText>
            <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
              {phoneValue || 'Locked (available for 1 month after match)'}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <VectorIcons name="Feather" iconName="award" size={16} color="#6B7280" />
            <AppText variant={Variant.body} style={styles.infoLabel}>Experience</AppText>
            <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
              {candidate?.experience || candidate?.experienceYears ? `${candidate.experience || `${candidate.experienceYears} years`}` : '—'}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <VectorIcons name="Feather" iconName="percent" size={16} color="#6B7280" />
            <AppText variant={Variant.body} style={styles.infoLabel}>Match</AppText>
            <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
              {typeof offerForContext?.matchPercentage === 'number'
                ? `${Math.round(offerForContext.matchPercentage)}%`
                : '—'}
            </AppText>
          </View>

          {!canContactForMonth ? (
            <View style={styles.notice}>
              <VectorIcons name="Feather" iconName="clock" size={16} color="#9CA3AF" />
              <AppText variant={Variant.caption} style={styles.noticeText}>
                Contact details and chat are disabled after 1 month.
              </AppText>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.subTitle} style={styles.sectionTitle}>
            Skills & documents
          </AppText>
          <AppText variant={Variant.body} style={styles.bodyText}>
            {Array.isArray(candidate?.skills) && candidate.skills.length > 0
              ? candidate.skills.join(' • ')
              : 'Not specified'}
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            text="Chat"
            onPress={handleChat}
            bgColor={colors.primary}
            disabled={!canContactForMonth}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default MatchedCandidateProfile

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white || '#fff' },
  content: { padding: wp(4), paddingBottom: hp(4), gap: hp(2) },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EADFF7',
    padding: wp(4),
  },
  headerRow: { flexDirection: 'row', gap: wp(3), alignItems: 'center' },
  avatar: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#111' },
  name: { color: '#111' },
  sub: { color: '#6B7280', marginTop: hp(0.2) },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: hp(1.5) },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  infoLabel: { width: wp(22), color: '#6B7280' },
  infoValue: { flex: 1, color: '#111' },
  notice: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginTop: hp(1) },
  noticeText: { color: '#6B7280', flex: 1 },
  sectionTitle: { color: '#111', marginBottom: hp(0.6) },
  bodyText: { color: '#374151' },
  actions: { marginTop: hp(0.5) },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

