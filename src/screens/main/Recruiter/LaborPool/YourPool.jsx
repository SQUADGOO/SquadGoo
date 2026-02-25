import React, { useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import PoolHeader from '@/core/PoolHeader'
import AppText, { Variant } from '@/core/AppText'
import { colors, hp, wp, getFontSize } from '@/theme'
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters'
import AppDatePickerModal from '@/core/AppDatePickerModal'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { screenNames } from '@/navigation/screenNames'
import { sendQuickOffer } from '@/store/quickSearchSlice'
import { sendManualOffer } from '@/store/manualOffersSlice'
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

const dateFromOffer = (offer) => {
  const raw =
    offer?.response?.acceptedAt ||
    offer?.acceptedAt ||
    offer?.createdAt ||
    offer?.updatedAt ||
    null
  if (!raw) return null
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

const startOfDay = (d) => {
  if (!d) return null
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

const endOfDay = (d) => {
  if (!d) return null
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

const formatShortDate = (d) => {
  if (!d) return ''
  const dt = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(dt.getTime())) return ''
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusOptions = [
  { label: 'All status', value: 'all' },
  { label: 'ACTIVE', value: 'ACTIVE' },
  { label: 'INACTIVE', value: 'INACTIVE' },
  { label: 'BLOCKED', value: 'BLOCKED' },
]

const YourPool = ({ navigation }) => {
  const dispatch = useDispatch()

  const userInfo = useSelector((state) => state?.auth?.userInfo || {})
  const currentUserId =
    userInfo?._id || userInfo?.id || userInfo?.userId || null

  const quickOffers = useSelector((state) => state.quickSearch?.activeOffers || [])
  const manualOffers = useSelector((state) => state.manualOffers?.offers || [])

  // Filters / search
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const poolItems = useMemo(() => {
    const acceptedQuick = quickOffers
      .filter((o) => String(o?.status || '').toLowerCase() === 'accepted')
      .map((o) => ({ ...o, __source: 'quick' }))

    const acceptedManual = manualOffers
      .filter((o) => String(o?.status || '').toLowerCase() === 'accepted')
      .map((o) => ({ ...o, __source: 'manual' }))

    const combined = [...acceptedQuick, ...acceptedManual]

    // Group by candidateId and keep the latest accepted match
    const map = new Map()
    combined.forEach((offer) => {
      const candidateId = offer?.candidateId
      if (!candidateId) return
      const matchDate = dateFromOffer(offer)
      const ts = matchDate ? matchDate.getTime() : 0
      const existing = map.get(candidateId)
      if (!existing || ts > existing.latestMatchTs) {
        map.set(candidateId, {
          candidateId,
          candidate: findCandidateById(candidateId),
          latestOffer: offer,
          latestMatchDate: matchDate,
          latestMatchTs: ts,
        })
      }
    })

    return Array.from(map.values()).sort((a, b) => b.latestMatchTs - a.latestMatchTs)
  }, [manualOffers, quickOffers])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    const from = fromDate ? startOfDay(fromDate).getTime() : null
    const to = toDate ? endOfDay(toDate).getTime() : null

    return poolItems.filter((item) => {
      const candidate = item.candidate
      const offer = item.latestOffer
      const matchTs = item.latestMatchDate ? item.latestMatchDate.getTime() : 0

      // Status filter (frontend-only; falls back to ACTIVE)
      const candidateStatus =
        String(candidate?.hiringStatus || candidate?.status || 'ACTIVE').toUpperCase()
      if (status !== 'all' && candidateStatus !== status) return false

      // Date filter
      if (from !== null && matchTs < from) return false
      if (to !== null && matchTs > to) return false

      // Search filter
      if (!q) return true

      const hay = [
        candidate?.name,
        candidate?.id,
        candidate?.email,
        candidate?.phone,
        candidate?.mobile,
        offer?.candidateName,
        offer?.jobTitle,
        offer?.jobId,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase())
        .join(' | ')

      return hay.includes(q)
    })
  }, [fromDate, poolItems, query, status, toDate])

  const clearFilters = () => {
    setQuery('')
    setStatus('all')
    setFromDate(null)
    setToDate(null)
  }

  const canContact = (matchDate) => {
    if (!matchDate) return false
    return Date.now() - matchDate.getTime() <= ONE_MONTH_MS
  }

  const handleView = (item) => {
    const offer = item.latestOffer
    navigation.navigate(screenNames.MATCHED_CANDIDATE_PROFILE, {
      jobId: offer?.jobId,
      candidateId: item.candidateId,
      source: offer?.__source || offer?.searchType || offer?.source || 'quick',
    })
  }

  const handleChat = (item) => {
    const offer = item.latestOffer
    const matchDate = item.latestMatchDate
    if (!canContact(matchDate)) return

    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        jobId: offer?.jobId,
        name: item.candidate?.name || offer?.candidateName || 'Candidate',
        jobTitle: offer?.jobTitle || 'Job',
        jobType: offer?.__source === 'manual' ? 'manual' : 'quick',
        otherUserId: item.candidateId,
        userId: currentUserId,
      },
    })
  }

  const handleReoffer = (item) => {
    const offer = item.latestOffer
    if (!offer?.jobId || !item.candidateId) return

    Alert.alert(
      'Reoffer!',
      'This will send a new offer. The candidate must accept to reactivate contact for another 30 days.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send reoffer',
          onPress: () => {
            const expiresAt = new Date(Date.now() + ONE_MONTH_MS).toISOString()
            const payload = {
              jobId: offer.jobId,
              candidateId: item.candidateId,
              expiresAt,
              message: 'Reoffer sent to reactivate contact for 30 days.',
              autoSent: false,
            }

            if (offer.__source === 'manual') {
              dispatch(
                sendManualOffer({
                  jobId: payload.jobId,
                  candidateId: payload.candidateId,
                  expiresAt: payload.expiresAt,
                  message: payload.message,
                }),
              )
            } else {
              dispatch(sendQuickOffer(payload))
            }

            Alert.alert(
              'Reoffer sent',
              'The offer is now pending. Contact will reactivate when the candidate accepts.',
            )
          },
        },
      ],
    )
  }

  const renderItem = ({ item }) => {
    const candidate = item.candidate
    const offer = item.latestOffer
    const matchDate = item.latestMatchDate
    const contactActive = canContact(matchDate)
    const candidateStatus =
      String(candidate?.hiringStatus || candidate?.status || 'ACTIVE').toUpperCase()

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleView(item)}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
              {(candidate?.name || offer?.candidateName || '?').charAt(0).toUpperCase()}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant={Variant.bodyMedium} style={styles.name}>
              {candidate?.name || offer?.candidateName || 'Candidate'}
            </AppText>
            <AppText variant={Variant.caption} style={styles.sub}>
              Jobseeker ID: {item.candidateId}
            </AppText>
            <AppText variant={Variant.caption} style={styles.sub}>
              Last hired for: {offer?.jobTitle || 'Job'}
            </AppText>
          </View>
          <View style={styles.statusPill}>
            <AppText variant={Variant.caption} style={styles.statusText}>
              {candidateStatus}
            </AppText>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <VectorIcons
              name={iconLibName.Feather}
              iconName="calendar"
              size={14}
              color={colors.gray}
            />
            <AppText variant={Variant.caption} style={styles.metaText}>
              {matchDate ? formatShortDate(matchDate) : '—'}
            </AppText>
          </View>
          <View style={styles.metaItem}>
            <VectorIcons
              name={iconLibName.Feather}
              iconName={contactActive ? 'unlock' : 'lock'}
              size={14}
              color={contactActive ? '#10B981' : '#6B7280'}
            />
            <AppText
              variant={Variant.caption}
              style={[styles.metaText, contactActive ? styles.activeText : styles.lockedText]}
            >
              {contactActive ? 'Contact active (30 days)' : 'Contact locked'}
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.viewBtn}
            activeOpacity={0.85}
            onPress={() => handleView(item)}
          >
            <AppText variant={Variant.bodyMedium} style={styles.viewBtnText}>
              View profile
            </AppText>
          </TouchableOpacity>

          {contactActive ? (
            <TouchableOpacity
              style={styles.chatBtn}
              activeOpacity={0.85}
              onPress={() => handleChat(item)}
            >
              <AppText variant={Variant.bodyMedium} style={styles.chatBtnText}>
                Chat
              </AppText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.reofferBtn}
              activeOpacity={0.85}
              onPress={() => handleReoffer(item)}
            >
              <AppText variant={Variant.bodyMedium} style={styles.reofferBtnText}>
                Reoffer!
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Your Pool"
        leftIcon={{
          name: 'Feather',
          iconName: 'arrow-left',
          onPress: () => navigation.goBack(),
        }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={filteredItems.length}
        onClear={clearFilters}
        filters={[
          {
            key: 'status',
            placeholder: 'Status',
            options: statusOptions,
            value: status,
            onChange: setStatus,
          },
        ]}
        sort={null}
      />

      <View style={styles.dateRow}>
        <View style={{ flex: 1 }}>
          <AppDatePickerModal
            label="From"
            value={fromDate}
            onChange={setFromDate}
            mode="date"
            placeholder="Select date"
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppDatePickerModal
            label="To"
            value={toDate}
            onChange={setToDate}
            mode="date"
            minimumDate={fromDate || undefined}
            placeholder="Select date"
          />
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(it) => it.candidateId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant={Variant.body} style={styles.emptyText}>
              No hired candidates yet.
            </AppText>
          </View>
        }
      />
    </View>
  )
}

export default YourPool

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  dateRow: {
    flexDirection: 'row',
    gap: wp(3),
    paddingHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  list: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(3),
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: getFontSize(18),
    fontWeight: '800',
  },
  name: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '800',
  },
  sub: { color: colors.gray, marginTop: hp(0.2) },
  statusPill: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  statusText: { color: '#3730A3', fontWeight: '700' },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.6),
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: wp(2), flex: 1 },
  metaText: { color: colors.gray },
  activeText: { color: '#10B981', fontWeight: '700' },
  lockedText: { color: '#6B7280', fontWeight: '700' },
  actions: { flexDirection: 'row', gap: wp(2), marginTop: hp(2) },
  viewBtn: {
    flex: 1,
    paddingVertical: hp(1.4),
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  viewBtnText: { color: '#111827', fontWeight: '800' },
  chatBtn: {
    flex: 1,
    paddingVertical: hp(1.4),
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  chatBtnText: { color: '#fff', fontWeight: '800' },
  reofferBtn: {
    flex: 1,
    paddingVertical: hp(1.4),
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
  },
  reofferBtnText: { color: '#fff', fontWeight: '800' },
  empty: { padding: wp(6), alignItems: 'center' },
  emptyText: { color: colors.gray },
})

