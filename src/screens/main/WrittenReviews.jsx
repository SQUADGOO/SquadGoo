import React, {useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import PoolHeader from '@/core/PoolHeader';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import ReactionBar from '@/components/social/ReactionBar';
import ReportSheet from '@/components/social/ReportSheet';
import ReviewReply from '@/components/social/ReviewReply';
import {showToast, toastTypes} from '@/utilities/toastConfig';

const DEMO_WRITTEN_BY_AUDIENCE = {
  recruiter: [
    {
      key: 'rec_out_1',
      revieweeName: 'Jane Doe',
      revieweeRole: 'Painter',
      rating: 4.9,
      comment:
        'Arrived on time, great finish, cleaned up without being asked. Would hire again.',
      date: '18 Apr 2026',
      revieweeReaction: 'love',
      reply: {
        author: 'Jane Doe',
        text: 'Thanks so much! Loved working on the project.',
        date: '1 day ago',
      },
    },
    {
      key: 'rec_out_2',
      revieweeName: 'Michael Torres',
      revieweeRole: 'Warehouse Manager',
      rating: 4.5,
      comment:
        'Solid team leader. Inventory counts were off by a small margin but recovered well.',
      date: '11 Apr 2026',
      revieweeReaction: 'clap',
      reply: null,
    },
    {
      key: 'rec_out_3',
      revieweeName: 'Aisha Khan',
      revieweeRole: 'Event Crew',
      rating: 4.8,
      comment: 'Very professional. Handled the crowd well during peak hours.',
      date: '02 Apr 2026',
      revieweeReaction: null,
      reply: null,
    },
  ],
  jobseeker: [
    {
      key: 'js_out_1',
      revieweeName: 'Elite Builders Pty Ltd',
      revieweeRole: 'Recruiter',
      rating: 4.9,
      comment:
        'Clear scope, paid on time, treated the crew well. Recommend working with them.',
      date: '20 Apr 2026',
      revieweeReaction: 'like',
      reply: {
        author: 'Elite Builders Pty Ltd',
        text: 'Appreciate the kind words — looking forward to the next job.',
        date: '2 days ago',
      },
    },
    {
      key: 'js_out_2',
      revieweeName: 'Metro Logistics',
      revieweeRole: 'Recruiter',
      rating: 4.4,
      comment: 'Site ran well. Shift briefing could be more detailed.',
      date: '09 Apr 2026',
      revieweeReaction: null,
      reply: null,
    },
    {
      key: 'js_out_3',
      revieweeName: 'QuickShip Warehousing',
      revieweeRole: 'Recruiter',
      rating: 4.7,
      comment: 'Supportive team, well-organised floor. Would pick up shifts again.',
      date: '27 Mar 2026',
      revieweeReaction: 'support',
      reply: null,
    },
  ],
};

const EMPTY_COPY = {
  recruiter: {
    title: 'No reviews written yet',
    body: 'Reviews you write about job seekers you have hired will appear here.',
  },
  jobseeker: {
    title: 'No reviews written yet',
    body: 'Reviews you write about recruiters you have worked with will appear here.',
  },
};

const WrittenReviews = ({navigation, route}) => {
  const role = useSelector(state => state?.auth?.role);
  const audience =
    route?.params?.audience ||
    (role?.toLowerCase() === 'jobseeker' ? 'jobseeker' : 'recruiter');

  const [reportedKeys, setReportedKeys] = useState({});
  const reportSheetRef = useRef(null);

  const reviews = useMemo(
    () => DEMO_WRITTEN_BY_AUDIENCE[audience] || [],
    [audience],
  );

  const summary = useMemo(
    () => ({
      count: reviews.length,
      lastDate: reviews[0]?.date || '—',
    }),
    [reviews],
  );

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
    const hasResponse = !!item.revieweeReaction || !!item.reply;

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={{flex: 1}}>
            <AppText variant={Variant.caption} style={styles.toLabel}>
              To
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.revieweeName}>
              {item.revieweeName}
            </AppText>
            <AppText variant={Variant.caption} style={styles.reviewMeta}>
              {item.revieweeRole || ''}
              {item.date
                ? `${item.revieweeRole ? ' • ' : ''}${item.date}`
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

        {hasResponse ? (
          <>
            <View style={styles.divider} />
            <AppText variant={Variant.smallCaptionSemi} style={styles.sectionLabel}>
              {item.revieweeName.split(' ')[0]}'s response
            </AppText>
            {item.revieweeReaction ? (
              <ReactionBar
                selected={item.revieweeReaction}
                canReact={false}
                style={styles.reactionBar}
              />
            ) : null}
            {item.reply ? (
              <ReviewReply reply={item.reply} canReply={false} emptyText="" />
            ) : null}
          </>
        ) : (
          <View style={styles.awaitingBadge}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={12}
              color={colors.gray}
            />
            <AppText variant={Variant.smallCaption} style={styles.awaitingText}>
              Awaiting {item.revieweeName.split(' ')[0]}'s response
            </AppText>
          </View>
        )}
      </View>
    );
  };

  const empty = EMPTY_COPY[audience] || EMPTY_COPY.recruiter;

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Reviews I've Written"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <AppText variant={Variant.caption} style={styles.summaryLabel}>
              Reviews written
            </AppText>
            <AppText variant={Variant.subTitle} style={styles.summaryCount}>
              {summary.count}
            </AppText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRight}>
            <AppText variant={Variant.caption} style={styles.summaryLabel}>
              Last written
            </AppText>
            <AppText variant={Variant.bodySemiBold} style={styles.summaryDate}>
              {summary.lastDate}
            </AppText>
          </View>
        </View>
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
              {empty.title}
            </AppText>
            <AppText variant={Variant.caption} style={styles.emptyText}>
              {empty.body}
            </AppText>
          </View>
        }
      />

      <ReportSheet
        ref={reportSheetRef}
        title="Report this review"
        subtitle="Flag this to admin if the response or thread has become inappropriate."
        onSubmit={handleReportSubmit}
      />
    </View>
  );
};

export default WrittenReviews;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  summaryCard: {
    marginHorizontal: wp(4),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    backgroundColor: '#fff',
    borderRadius: hp(1.6),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLeft: {flex: 1},
  summaryRight: {flex: 1, alignItems: 'flex-end'},
  summaryDivider: {
    width: 1,
    height: hp(4),
    backgroundColor: '#E5E7EB',
    marginHorizontal: wp(3),
  },
  summaryLabel: {
    color: colors.gray,
    marginBottom: hp(0.4),
  },
  summaryCount: {
    color: colors.secondary,
    fontWeight: '800',
  },
  summaryDate: {
    color: colors.secondary,
    fontSize: getFontSize(13),
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
  toLabel: {
    color: colors.gray,
    textTransform: 'uppercase',
    fontSize: getFontSize(10),
    letterSpacing: 0.5,
  },
  revieweeName: {
    color: colors.secondary,
    fontWeight: '800',
    marginTop: hp(0.1),
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
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  sectionLabel: {
    color: colors.gray,
    textTransform: 'uppercase',
    fontSize: getFontSize(10),
    letterSpacing: 0.5,
    marginBottom: hp(0.8),
  },
  reactionBar: {
    marginBottom: hp(0.8),
  },
  awaitingBadge: {
    marginTop: hp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    alignSelf: 'flex-start',
    backgroundColor: '#F4F6FA',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: 999,
  },
  awaitingText: {
    color: colors.gray,
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
