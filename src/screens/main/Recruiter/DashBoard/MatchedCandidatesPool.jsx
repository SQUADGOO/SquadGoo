import React from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import AppHeader from '@/core/AppHeader'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons from '@/theme/vectorIcon'
import { colors, hp, wp } from '@/theme'
import { screenNames } from '@/navigation/screenNames'

const MatchedCandidateRow = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.row}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.avatar}>
          <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
            {(item?.name || '?').charAt(0)}
          </AppText>
        </View>
      </View>

      <View style={styles.mid}>
        <AppText variant={Variant.bodyMedium} style={styles.name}>
          {item?.name || 'Unknown'}
        </AppText>
        <AppText variant={Variant.caption} style={styles.sub}>
          {item?.jobTitle ? `Matched for: ${item.jobTitle}` : 'Matched candidate'}
        </AppText>
        {item?.location ? (
          <AppText variant={Variant.caption} style={styles.sub}>
            📍 {item.location}
          </AppText>
        ) : null}
        <AppText variant={Variant.caption} style={styles.sub}>
          {typeof item?.matchPercentage === 'number'
            ? `Match: ${Math.round(item.matchPercentage)}%`
            : 'Match: —'}
          {item?.positions ? `  •  Positions: ${item.positions}` : ''}
          {item?.source ? `  •  ${item.source === 'quick' ? 'Quick' : 'Manual'}` : ''}
        </AppText>
      </View>

      <View style={styles.right}>
        <VectorIcons name="Feather" iconName="chevron-right" size={18} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  )
}

const MatchedCandidatesPool = ({ navigation }) => {
  const manualMatchesByJobId = useSelector((state) => state.manualOffers?.matchesByJobId || {})
  const quickMatchesByJobId = useSelector((state) => state.quickSearch?.matchesByJobId || {})

  const jobsActive = useSelector((state) => state.jobs?.activeJobs || [])
  const jobsCompleted = useSelector((state) => state.jobs?.completedJobs || [])
  const jobsExpired = useSelector((state) => state.jobs?.expiredJobs || [])
  const jobsDrafted = useSelector((state) => state.jobs?.draftedJobs || [])
  const quickJobs = useSelector((state) => state.quickSearch?.quickJobs || [])
  const manualJobs = useSelector((state) => state.manualOffers?.jobs || [])

  const jobTitleById = React.useMemo(() => {
    const map = new Map()
    const byId = new Map()
    ;[...jobsActive, ...jobsCompleted, ...jobsExpired, ...jobsDrafted].forEach((j) => {
      if (j?.id && j?.title) map.set(j.id, j.title)
      if (j?.id) byId.set(j.id, j)
    })
    ;[...quickJobs].forEach((j) => {
      if (j?.id && (j?.jobTitle || j?.title)) map.set(j.id, j.jobTitle || j.title)
      if (j?.id) byId.set(j.id, j)
    })
    ;[...manualJobs].forEach((j) => {
      if (j?.id && j?.title) map.set(j.id, j.title)
      if (j?.id) byId.set(j.id, j)
    })
    return { titleMap: map, jobMap: byId }
  }, [jobsActive, jobsCompleted, jobsExpired, jobsDrafted, quickJobs, manualJobs])

  const rows = React.useMemo(() => {
    const out = []
    const seen = new Set()

    const push = ({ source, jobId, candidate }) => {
      const candidateId = candidate?.id
      if (!candidateId || !jobId) return
      const key = `${source}:${jobId}:${candidateId}`
      if (seen.has(key)) return
      seen.add(key)
      out.push({
        id: key,
        source,
        jobId,
        candidateId,
        name: candidate?.name || 'Unknown',
        matchPercentage: typeof candidate?.matchPercentage === 'number' ? candidate.matchPercentage : null,
        jobTitle: jobTitleById?.titleMap?.get(jobId) || candidate?.jobTitle || '',
        location: candidate?.location || '',
        positions:
          jobTitleById?.jobMap?.get(jobId)?.staffNumber ??
          jobTitleById?.jobMap?.get(jobId)?.staffCount ??
          '',
      })
    }

    Object.entries(manualMatchesByJobId || {}).forEach(([jobId, list]) => {
      if (!Array.isArray(list)) return
      list.forEach((c) => push({ source: 'manual', jobId, candidate: c }))
    })

    Object.entries(quickMatchesByJobId || {}).forEach(([jobId, list]) => {
      if (!Array.isArray(list)) return
      list.forEach((c) => push({ source: 'quick', jobId, candidate: c }))
    })

    // Most recent first is unknown; keep stable order for now
    return out
  }, [manualMatchesByJobId, quickMatchesByJobId, jobTitleById])

  return (
    <View style={styles.container}>
      <AppHeader
        title="Matched candidates"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {rows.length > 0 ? (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MatchedCandidateRow
              item={item}
              onPress={() =>
                navigation.navigate(screenNames.MATCHED_CANDIDATE_PROFILE, {
                  jobId: item.jobId,
                  candidateId: item.candidateId,
                  source: item.source,
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <AppText variant={Variant.subTitle} style={styles.emptyTitle}>
            No matched candidates yet
          </AppText>
          <AppText variant={Variant.body} style={styles.emptyText}>
            Once matches are generated for your offers, they’ll appear here.
          </AppText>
        </View>
      )}
    </View>
  )
}

export default MatchedCandidatesPool

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white || '#fff' },
  list: { padding: wp(4), paddingBottom: hp(3) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3.5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADFF7',
    backgroundColor: '#FFFFFF',
    marginBottom: hp(1.2),
  },
  left: { marginRight: wp(3) },
  avatar: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#111827' },
  mid: { flex: 1 },
  name: { color: '#111', marginBottom: hp(0.3) },
  sub: { color: '#6B7280' },
  right: { paddingLeft: wp(2) },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: wp(10) },
  emptyTitle: { color: '#111', marginBottom: hp(1) },
  emptyText: { color: '#6B7280', textAlign: 'center' },
})

