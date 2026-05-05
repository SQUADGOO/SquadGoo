import React, {useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import PoolHeader from '@/core/PoolHeader';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import {getSquadWithMembers} from '@/utilities/dummySquads';
import ReactionBar from '@/components/social/ReactionBar';
import ReportSheet from '@/components/social/ReportSheet';
import ReviewReply from '@/components/social/ReviewReply';
import {showToast, toastTypes} from '@/utilities/toastConfig';

const SEED_REACTIONS = ['love', null, 'clap', 'idea', null];
const SEED_REPLIES = [
  {
    author: 'Squad Member',
    text: 'Thanks for the kind words — appreciate the opportunity!',
    date: '2 days ago',
  },
  null,
  null,
  {
    author: 'Squad Member',
    text: 'Glad we could help. Looking forward to the next project.',
    date: '1 week ago',
  },
  null,
];

const SquadReviews = ({navigation, route}) => {
  const squadId = route?.params?.squadId;
  const squad = useMemo(() => getSquadWithMembers(squadId), [squadId]);

  const [reportedKeys, setReportedKeys] = useState({});
  const reportSheetRef = useRef(null);

  const reviews = useMemo(() => {
    const out = [];
    const members = squad?.members || [];
    let i = 0;
    members.forEach(m => {
      (m?.reviews || []).forEach((r, idx) => {
        const key = `${m?.id || 'member'}_${idx}`;
        out.push({
          key,
          memberId: m?.id,
          memberName: m?.name,
          reviewer: r?.reviewer,
          rating: r?.rating,
          comment: r?.comment,
          date: r?.date,
          revieweeReaction: SEED_REACTIONS[i % SEED_REACTIONS.length] || null,
          reply: SEED_REPLIES[i % SEED_REPLIES.length] || null,
        });
        i += 1;
      });
    });
    return out;
  }, [squad]);

  const openReport = reviewKey => {
    reportSheetRef.current?.open({type: 'review', reviewKey});
  };

  const handleReportSubmit = payload => {
    const key = payload?.target?.reviewKey;
    if (key) setReportedKeys(prev => ({...(prev || {}), [key]: true}));
    showToast(
      'Report sent to admin for review.',
      'Reported',
      toastTypes.success,
    );
  };

  const renderItem = ({item}) => {
    const key = item.key;
    const isReported = !!reportedKeys?.[key];

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={{flex: 1}}>
            <AppText variant={Variant.bodyMedium} style={styles.reviewer}>
              {item.reviewer || 'Recruiter'}
            </AppText>
            <AppText variant={Variant.caption} style={styles.reviewMeta}>
              {item.memberName ? `For ${item.memberName}` : ''}
              {item.date
                ? `${item.memberName ? ' • ' : ''}${item.date}`
                : ''}
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
              {typeof item.rating === 'number'
                ? item.rating.toFixed(1)
                : item.rating || '—'}
            </AppText>
          </View>

          <TouchableOpacity
            onPress={() => openReport(key)}
            style={styles.reportIconBtn}
            hitSlop={8}
            activeOpacity={0.7}>
            <VectorIcons
              name={iconLibName.Feather}
              iconName="flag"
              size={16}
              color={isReported ? colors.softRed : colors.gray}
            />
          </TouchableOpacity>
        </View>

        {item.comment ? (
          <AppText variant={Variant.body} style={styles.comment}>
            {item.comment}
          </AppText>
        ) : null}

        {isReported ? (
          <View style={styles.reportedBadge}>
            <VectorIcons
              name={iconLibName.Feather}
              iconName="alert-triangle"
              size={12}
              color={colors.softRed}
            />
            <AppText
              variant={Variant.smallCaption}
              style={styles.reportedText}>
              Reported — under admin review
            </AppText>
          </View>
        ) : null}

        {item.revieweeReaction ? (
          <ReactionBar
            selected={item.revieweeReaction}
            canReact={false}
            style={styles.reactionBar}
          />
        ) : null}

        {item.reply ? <View style={styles.divider} /> : null}

        <ReviewReply reply={item.reply} canReply={false} emptyText="" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Reviews"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.headerCard}>
        <AppText variant={Variant.bodyMedium} style={styles.squadName}>
          {squad?.name || 'Squad'}
        </AppText>
        <AppText variant={Variant.caption} style={styles.squadMeta}>
          {squad?.memberCount
            ? `${squad.memberCount} member${squad.memberCount > 1 ? 's' : ''}`
            : ''}
          {squad?.location
            ? `${squad?.memberCount ? ' • ' : ''}${squad.location}`
            : ''}
        </AppText>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={x => x.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>
              No reviews yet
            </AppText>
            <AppText variant={Variant.caption} style={styles.emptyText}>
              Reviews will appear here once recruiters leave feedback for squad
              members.
            </AppText>
          </View>
        }
      />

      <ReportSheet
        ref={reportSheetRef}
        title="Report review"
        subtitle="Let admin know what's wrong. They'll review and take action."
        onSubmit={handleReportSubmit}
      />
    </View>
  );
};

export default SquadReviews;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(2),
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
  reportIconBtn: {
    padding: wp(1),
  },
  comment: {
    marginTop: hp(1.2),
    color: colors.secondary,
    lineHeight: hp(2.2),
  },
  reportedBadge: {
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    alignSelf: 'flex-start',
    backgroundColor: colors.redBg,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: 999,
  },
  reportedText: {
    color: colors.softRed,
    fontWeight: '600',
  },
  reactionBar: {
    marginTop: hp(1.5),
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: hp(1.5),
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
});
