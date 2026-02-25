import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import PoolHeader from '@/core/PoolHeader'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { colors, getFontSize, hp, wp } from '@/theme'
import { getSquadWithMembers } from '@/utilities/dummySquads'

const REACTIONS = [
  { id: 'like', emoji: '👍', label: 'Like' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'support', emoji: '🫶', label: 'Support' },
  { id: 'love', emoji: '❤️', label: 'Love' },
  { id: 'idea', emoji: '💡', label: 'Insightful' },
  { id: 'funny', emoji: '😄', label: 'Funny' },
]

const SquadReviews = ({ navigation, route }) => {
  const squadId = route?.params?.squadId

  const squad = useMemo(() => getSquadWithMembers(squadId), [squadId])
  const [reactionByKey, setReactionByKey] = useState({})

  const reviews = useMemo(() => {
    const out = []
    const members = squad?.members || []
    members.forEach((m) => {
      ;(m?.reviews || []).forEach((r, idx) => {
        out.push({
          key: `${m?.id || 'member'}_${idx}`,
          memberId: m?.id,
          memberName: m?.name,
          reviewer: r?.reviewer,
          rating: r?.rating,
          comment: r?.comment,
          date: r?.date,
        })
      })
    })
    return out
  }, [squad])

  const toggleReaction = (reviewKey, reactionId) => {
    setReactionByKey((prev) => {
      const current = prev?.[reviewKey]
      if (current === reactionId) {
        const next = { ...(prev || {}) }
        delete next[reviewKey]
        return next
      }
      return { ...(prev || {}), [reviewKey]: reactionId }
    })
  }

  const renderReactionRow = (reviewKey) => {
    const selected = reactionByKey?.[reviewKey] || null
    return (
      <View style={styles.reactionsRow}>
        {REACTIONS.map((r) => {
          const isSelected = selected === r.id
          return (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.85}
              onPress={() => toggleReaction(reviewKey, r.id)}
              style={[styles.reactionBtn, isSelected && styles.reactionBtnSelected]}
              accessibilityLabel={r.label}
            >
              <AppText variant={Variant.bodyMedium} style={styles.reactionEmoji}>
                {r.emoji}
              </AppText>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={{ flex: 1 }}>
          <AppText variant={Variant.bodyMedium} style={styles.reviewer}>
            {item.reviewer || 'Recruiter'}
          </AppText>
          <AppText variant={Variant.caption} style={styles.reviewMeta}>
            {item.memberName ? `For ${item.memberName}` : ''}{item.date ? `${item.memberName ? ' • ' : ''}${item.date}` : ''}
          </AppText>
        </View>

        <View style={styles.ratingPill}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="star"
            size={14}
            color="#F59E0B"
          />
          <AppText variant={Variant.caption} style={styles.ratingText}>
            {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating || '—'}
          </AppText>
        </View>
      </View>

      {item.comment ? (
        <AppText variant={Variant.body} style={styles.comment}>
          {item.comment}
        </AppText>
      ) : null}

      {renderReactionRow(item.key)}
    </View>
  )

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Reviews"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <View style={styles.headerCard}>
        <AppText variant={Variant.bodyMedium} style={styles.squadName}>
          {squad?.name || 'Squad'}
        </AppText>
        <AppText variant={Variant.caption} style={styles.squadMeta}>
          {squad?.memberCount ? `${squad.memberCount} member${squad.memberCount > 1 ? 's' : ''}` : ''}
          {squad?.location ? `${squad?.memberCount ? ' • ' : ''}${squad.location}` : ''}
        </AppText>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(x) => x.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>
              No reviews yet
            </AppText>
            <AppText variant={Variant.caption} style={styles.emptyText}>
              Reviews will appear here once recruiters leave feedback for squad members.
            </AppText>
          </View>
        }
      />
    </View>
  )
}

export default SquadReviews

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerCard: {
    marginHorizontal: wp(4),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    backgroundColor: '#fff',
    borderRadius: hp(1.6),
    padding: wp(4),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  squadName: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: getFontSize(16),
  },
  squadMeta: {
    marginTop: hp(0.5),
    color: colors.gray,
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    padding: wp(4),
    marginTop: hp(1.2),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  reviewer: {
    color: colors.secondary,
    fontWeight: '800',
  },
  reviewMeta: {
    color: colors.gray,
    marginTop: hp(0.3),
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: 999,
    backgroundColor: `${'#F59E0B'}15`,
  },
  ratingText: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  comment: {
    marginTop: hp(1.2),
    color: colors.secondary,
    lineHeight: hp(2.2),
  },
  reactionsRow: {
    marginTop: hp(1.5),
    flexDirection: 'row',
    gap: wp(2),
    flexWrap: 'wrap',
  },
  reactionBtn: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reactionBtnSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  reactionEmoji: {
    fontSize: getFontSize(18),
  },
  empty: {
    marginTop: hp(8),
    alignItems: 'center',
    paddingHorizontal: wp(6),
  },
  emptyTitle: {
    color: colors.secondary,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: hp(0.8),
    color: colors.gray,
    textAlign: 'center',
  },
})

