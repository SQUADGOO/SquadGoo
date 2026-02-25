import React from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import AppHeader from '@/core/AppHeader'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons from '@/theme/vectorIcon'
import { colors, hp, wp } from '@/theme'
import { screenNames } from '@/navigation/screenNames'
import { addNotification } from '@/store/notificationsSlice'
import { acceptOfferModification, declineOfferModification, withdrawQuickOffer, updateQuickJob } from '@/store/quickSearchSlice'
import { updateManualOfferStatus, withdrawManualOffer, updateManualJob } from '@/store/manualOffersSlice'
import { updateJob } from '@/store/jobsSlice'

const isPendingStatus = (s) => s === 'pending' || s === 'modification_requested'

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

const parsePayRateToSalary = (payRate) => {
  if (!payRate || typeof payRate !== 'string') return null
  // Examples: "$35/hr" or "$28–$32/hr" or "$28-$32/hr" or "$28 to $32/hr"
  const nums = payRate.match(/(\d+(?:\.\d+)?)/g)
  if (!nums || nums.length === 0) return { salaryRange: payRate }
  const min = Number(nums[0])
  const max = Number(nums[1] ?? nums[0])
  return {
    salaryRange: payRate,
    salaryMin: Number.isFinite(min) ? min : undefined,
    salaryMax: Number.isFinite(max) ? max : undefined,
  }
}

const OfferCard = ({ item, onView, onAcceptMod, onDeclineMod, onWithdraw }) => {
  const isMod = item?.status === 'modification_requested'
  const requestedPayRate = item?.requestedTerms?.payRate || ''

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <AppText variant={Variant.bodyMedium} style={styles.title}>
            {item?.candidateName || 'Candidate'}
          </AppText>
          <AppText variant={Variant.caption} style={styles.sub}>
            {item?.jobTitle || 'Job'} • {item?.source === 'quick' ? 'Quick' : 'Manual'}
          </AppText>
          <AppText variant={Variant.caption} style={styles.sub}>
            Status: {item?.status || 'pending'} {item?.createdAt ? `• ${formatTimeAgo(item.createdAt)}` : ''}
          </AppText>
        </View>
        <View style={styles.badge}>
          <AppText variant={Variant.caption} style={styles.badgeText}>
            {typeof item?.matchPercentage === 'number'
              ? `${Math.round(item.matchPercentage)}%`
              : '—'}
          </AppText>
        </View>
      </View>

      {isMod ? (
        <View style={styles.modBox}>
          <View style={styles.modRow}>
            <VectorIcons name="Feather" iconName="edit-3" size={14} color="#FF8C42" />
            <AppText variant={Variant.body} style={styles.modLabel}>
              Requested modification
            </AppText>
          </View>
          {requestedPayRate ? (
            <AppText variant={Variant.caption} style={styles.modText}>
              Pay rate: {requestedPayRate}
            </AppText>
          ) : (
            <AppText variant={Variant.caption} style={styles.modText}>
              Requested terms: (see details)
            </AppText>
          )}
          {item?.modificationMessage ? (
            <AppText variant={Variant.caption} style={styles.modText}>
              Note: {item.modificationMessage}
            </AppText>
          ) : null}
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnLight]} onPress={onView} activeOpacity={0.8}>
          <AppText variant={Variant.bodyMedium} style={styles.btnLightText}>
            View details
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={onWithdraw} activeOpacity={0.8}>
          <AppText variant={Variant.bodyMedium} style={styles.btnDangerText}>
            Withdraw offer
          </AppText>
        </TouchableOpacity>
      </View>

      {isMod ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onAcceptMod} activeOpacity={0.8}>
            <AppText variant={Variant.bodyMedium} style={styles.btnPrimaryText}>
              Accept modification
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnLight]} onPress={onDeclineMod} activeOpacity={0.8}>
            <AppText variant={Variant.bodyMedium} style={styles.btnLightText}>
              Decline modification
            </AppText>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}

const PendingOfferAcceptance = ({ navigation }) => {
  const dispatch = useDispatch()

  const manualOffers = useSelector((state) => state.manualOffers?.offers || [])
  const quickOffers = useSelector((state) => state.quickSearch?.activeOffers || [])

  const items = React.useMemo(() => {
    const out = []

    manualOffers
      .filter((o) => isPendingStatus(o?.status))
      .forEach((o) => {
        const requestedTerms = o?.response?.modification?.requestedTerms || o?.response?.modification?.requestedTerms || {}
        out.push({
          id: `manual:${o.id}`,
          source: 'manual',
          offerId: o.id,
          jobId: o.jobId,
          jobTitle: o.jobTitle,
          candidateId: o.candidateId,
          candidateName: o.candidateName,
          matchPercentage: o.matchPercentage,
          status: o.status,
          requestedTerms,
          modificationMessage: o?.response?.modification?.message || '',
          createdAt: o.createdAt,
        })
      })

    quickOffers
      .filter((o) => isPendingStatus(o?.status))
      .forEach((o) => {
        const requestedTerms = o?.response?.modification?.requestedTerms || {}
        out.push({
          id: `quick:${o.id}`,
          source: 'quick',
          offerId: o.id,
          jobId: o.jobId,
          jobTitle: o.jobTitle,
          candidateId: o.candidateId,
          candidateName: o.candidateName,
          matchPercentage: o.matchPercentage,
          status: o.status,
          requestedTerms,
          modificationMessage: o?.response?.modification?.message || '',
          createdAt: o.createdAt,
        })
      })

    // newest first
    out.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    return out
  }, [manualOffers, quickOffers])

  const handleViewDetails = (item) => {
    if (!item?.jobId || !item?.candidateId) return
    if (item.source === 'quick') {
      navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
        jobId: item.jobId,
        candidateId: item.candidateId,
        mode: 'pending_review',
        offerMeta: { from: 'pending_acceptance', offerId: item.offerId },
      })
      return
    }
    navigation.navigate(screenNames.MANUAL_CANDIDATE_PROFILE, {
      jobId: item.jobId,
      candidateId: item.candidateId,
      mode: 'pending_review',
      offerMeta: { from: 'pending_acceptance', offerId: item.offerId },
    })
  }

  const handleWithdraw = (item) => {
    Alert.alert(
      'Withdraw Offer',
      'Are you sure you want to withdraw this offer? The candidate will be notified and this offer will be cancelled.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: () => {
            if (item.source === 'quick') {
              dispatch(withdrawQuickOffer({ offerId: item.offerId }))
            } else {
              dispatch(withdrawManualOffer({ offerId: item.offerId }))
            }
            dispatch(addNotification({
              type: 'offer_withdrawn',
              title: 'Offer Withdrawn',
              message: `Offer withdrawn for ${item.candidateName || 'candidate'}.`,
              jobId: item.jobId,
              candidateName: item.candidateName,
            }))
            Alert.alert('Offer withdrawn', 'Offer withdrawn. The candidate has been notified.')
          },
        },
      ],
    )
  }

  const handleAcceptModification = (item) => {
    const requestedTerms = item?.requestedTerms || {}
    const pay = requestedTerms?.payRate
    const jobUpdates = pay ? parsePayRateToSalary(pay) : null

    if (item.source === 'quick') {
      dispatch(acceptOfferModification({ offerId: item.offerId }))
      if (jobUpdates) {
        dispatch(updateJob({ jobId: item.jobId, updates: jobUpdates }))
        dispatch(updateQuickJob({ jobId: item.jobId, updates: jobUpdates }))
      }
    } else {
      dispatch(updateManualOfferStatus({
        offerId: item.offerId,
        status: 'accepted',
        response: {
          type: 'modification_accepted',
          acceptedAt: new Date().toISOString(),
          modification: { requestedTerms },
        },
      }))
      if (jobUpdates) {
        dispatch(updateJob({ jobId: item.jobId, updates: jobUpdates }))
        dispatch(updateManualJob({ jobId: item.jobId, updates: jobUpdates }))
      }
    }

    dispatch(addNotification({
      type: 'modification_accepted',
      title: 'Modification accepted',
      message: `Modification accepted for ${item.candidateName || 'candidate'}. The offer has been updated.`,
      jobId: item.jobId,
      candidateName: item.candidateName,
    }))

    Alert.alert(
      'Modification accepted',
      'Modification accepted. The candidate will be notified and the offer has been updated.',
    )
  }

  const handleDeclineModification = (item) => {
    if (item.source === 'quick') {
      dispatch(declineOfferModification({ offerId: item.offerId, reason: 'Declined by recruiter' }))
    } else {
      dispatch(updateManualOfferStatus({
        offerId: item.offerId,
        status: 'declined',
        response: {
          type: 'modification_declined',
          declinedAt: new Date().toISOString(),
          modification: { requestedTerms: item?.requestedTerms || {} },
        },
      }))
    }

    dispatch(addNotification({
      type: 'modification_declined',
      title: 'Modification declined',
      message: `Modification declined for ${item.candidateName || 'candidate'}. The original offer remains unchanged.`,
      jobId: item.jobId,
      candidateName: item.candidateName,
    }))

    Alert.alert(
      'Modification declined',
      'Modification declined. The candidate will be notified and the original offer remains unchanged.',
    )
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Pending offer acceptance"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OfferCard
              item={item}
              onView={() => handleViewDetails(item)}
              onWithdraw={() => handleWithdraw(item)}
              onAcceptMod={() => handleAcceptModification(item)}
              onDeclineMod={() => handleDeclineModification(item)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <AppText variant={Variant.subTitle} style={styles.emptyTitle}>
            No pending offers
          </AppText>
          <AppText variant={Variant.body} style={styles.emptyText}>
            Offers awaiting candidate response or modification requests will appear here.
          </AppText>
        </View>
      )}
    </View>
  )
}

export default PendingOfferAcceptance

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white || '#fff' },
  list: { padding: wp(4), paddingBottom: hp(4) },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EADFF7',
    padding: wp(4),
    marginBottom: hp(1.4),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(2) },
  title: { color: '#111' },
  sub: { color: '#6B7280', marginTop: hp(0.3) },
  badge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#111' },
  modBox: {
    marginTop: hp(1.2),
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: wp(3),
  },
  modRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(0.6) },
  modLabel: { color: '#9A3412' },
  modText: { color: '#9A3412', marginTop: hp(0.2) },
  actionsRow: { flexDirection: 'row', gap: wp(3), marginTop: hp(1.2) },
  btn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: hp(1.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  btnPrimaryText: { color: '#fff' },
  btnLight: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
  btnLightText: { color: '#111827' },
  btnDanger: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  btnDangerText: { color: '#fff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: wp(10) },
  emptyTitle: { color: '#111', marginBottom: hp(1) },
  emptyText: { color: '#6B7280', textAlign: 'center' },
})

