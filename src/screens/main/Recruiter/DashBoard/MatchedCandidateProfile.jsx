import React, { useMemo } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import AppHeader from '@/core/AppHeader'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { colors, getFontSize, hp, wp } from '@/theme'
import { screenNames } from '@/navigation/screenNames'
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers'
import { DUMMY_CONTRACTORS } from '@/utilities/dummyContractors'
import { DUMMY_EMPLOYEES } from '@/utilities/dummyEmployees'
import CandidateProfileView from '@/components/Recruiter/CandidateProfileView'
import InfoTooltip from '@/components/InfoTooltip'

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000

const computeIsVerified = (c) => {
  const docs = c?.documents
  if (!Array.isArray(docs)) return false
  return docs.some(d => (d?.type === 'ID' || d?.type === 'Photo ID') && d?.verified)
}

const findCandidateById = (id) => {
  if (!id) return null
  return (
    DUMMY_JOB_SEEKERS.find(c => c.id === id) ||
    DUMMY_CONTRACTORS.find(c => c.id === id) ||
    DUMMY_EMPLOYEES.find(c => c.id === id) ||
    null
  )
}

const MatchedCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId, source } = route?.params || {}
  const userInfo = useSelector(state => state?.auth?.userInfo || {})
  const currentUserId = userInfo?._id || userInfo?.id || userInfo?.userId || null

  const jobs = useSelector(state => [
    ...(state.jobs?.activeJobs || []),
    ...(state.jobs?.completedJobs || []),
    ...(state.jobs?.expiredJobs || []),
    ...(state.jobs?.draftedJobs || []),
  ])
  const job = jobs.find(j => j.id === jobId) || null

  const manualOffers = useSelector(state => state.manualOffers?.offers || [])
  const quickOffers = useSelector(state => state.quickSearch?.activeOffers || [])

  const offerForContext = useMemo(() => {
    const list = source === 'quick' ? quickOffers : manualOffers
    return list.find(o => o?.jobId === jobId && o?.candidateId === candidateId) || null
  }, [source, quickOffers, manualOffers, jobId, candidateId])

  const candidate = useMemo(() => {
    const base = findCandidateById(candidateId)
    if (!base) return null
    return {
      ...base,
      matchPercentage: offerForContext?.matchPercentage ?? base?.matchPercentage ?? 0,
      acceptanceRating: offerForContext?.acceptanceRating ?? base?.acceptanceRating ?? 0,
      isVerified: typeof base.isVerified === 'boolean' ? base.isVerified : computeIsVerified(base),
    }
  }, [candidateId, offerForContext])

  const matchCreatedAt = offerForContext?.createdAt || offerForContext?.updatedAt || null
  const canContactForMonth = useMemo(() => {
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
        <AppHeader title="Candidate Profile" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <AppText variant={Variant.body}>Candidate not found.</AppText>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Candidate Profile" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CandidateProfileView
          candidate={candidate}
          matchedForLabel={`Matched for: ${job?.title || offerForContext?.jobTitle || 'Job'}`}
          headerExtra={
            !canContactForMonth ? (
              <View style={styles.lockedRow}>
                <VectorIcons name={iconLibName.Ionicons} iconName="call-outline" size={16} color={colors.gray} />
                <AppText variant={Variant.bodyMedium} style={styles.lockedText}>Locked</AppText>
                <InfoTooltip message="Contact details and chat are available for 1 month after the match date." />
              </View>
            ) : null
          }
        >

          {/* Actions */}
          <View style={styles.footerActions}>
            {canContactForMonth ? (
              <TouchableOpacity style={styles.contactButton} onPress={handleChat} activeOpacity={0.85}>
                <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-ellipses-outline" size={18} color={colors.primary} />
                <AppText variant={Variant.bodyMedium} style={styles.contactButtonText}>Contact / Chat</AppText>
              </TouchableOpacity>
            ) : null}
            <AppButton
              text="Back"
              onPress={() => navigation.goBack()}
              bgColor="#FFFFFF"
              textStyle={{ color: colors.primary }}
              style={styles.secondaryButton}
            />
          </View>
        </CandidateProfileView>
      </ScrollView>
    </View>
  )
}

export default MatchedCandidateProfile

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || '#F5F6FA' },
  content: { padding: wp(4), paddingBottom: hp(4), gap: hp(2) },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  lockedText: { color: '#9CA3AF', fontWeight: '600' },
  footerActions: { marginTop: hp(1), gap: hp(1.5) },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.6),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: wp(2),
  },
  contactButtonText: { color: colors.primary, fontSize: getFontSize(14), fontWeight: '700' },
  secondaryButton: { borderRadius: hp(2), borderWidth: 1.5, borderColor: '#E5E7EB' },
})
