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

const DEMO_REVIEWS_BY_AUDIENCE = {
  recruiter: [
    {
      key: 'rec_rev_1',
      reviewer: 'Jane Doe',
      reviewerRole: 'Painter',
      rating: 5.0,
      comment:
        'Clear job brief, fair pay, and prompt payment. Would work with them again anytime.',
      date: '18 Apr 2026',
      seedReaction: 'love',
      seedReply: {
        author: 'You',
        text: 'Appreciate the kind words, Jane!',
        date: '2 days ago',
      },
    },
    {
      key: 'rec_rev_2',
      reviewer: 'Michael Torres',
      reviewerRole: 'Warehouse Manager',
      rating: 4.6,
      comment:
        'Great communication and site was well-organised. Small delay checking in but nothing major.',
      date: '11 Apr 2026',
      seedReaction: null,
      seedReply: null,
    },
    {
      key: 'rec_rev_3',
      reviewer: 'Aisha Khan',
      reviewerRole: 'Event Crew',
      rating: 4.8,
      comment: 'Treated the team well and the shift ran smoothly end-to-end.',
      date: '02 Apr 2026',
      seedReaction: 'clap',
      seedReply: null,
    },
  ],
  jobseeker: [
    {
      key: 'js_rev_1',
      reviewer: 'Elite Builders Pty Ltd',
      reviewerRole: 'Recruiter',
      rating: 4.9,
      comment:
        'Outstanding workmanship and a reliable showup record. Finished the job ahead of schedule.',
      date: '20 Apr 2026',
      seedReaction: 'love',
      seedReply: {
        author: 'You',
        text: 'Thank you — was a pleasure working on the project.',
        date: '1 day ago',
      },
    },
    {
      key: 'js_rev_2',
      reviewer: 'Metro Logistics',
      reviewerRole: 'Recruiter',
      rating: 4.5,
      comment:
        'Strong work ethic and team player. Would rehire for the next cycle.',
      date: '09 Apr 2026',
      seedReaction: null,
      seedReply: null,
    },
    {
      key: 'js_rev_3',
      reviewer: 'QuickShip Warehousing',
      reviewerRole: 'Recruiter',
      rating: 4.7,
      comment: 'Picked up processes quickly and kept the line moving.',
      date: '27 Mar 2026',
      seedReaction: 'idea',
      seedReply: null,
    },
  ],
};

const EMPTY_COPY = {
  recruiter: {
    title: 'No reviews yet',
    body: 'Reviews from job seekers you have hired will appear here.',
  },
  jobseeker: {
    title: 'No reviews yet',
    body: 'Reviews from recruiters you have worked with will appear here.',
  },
};

const MyReviews = ({navigation, route}) => {
  const role = useSelector(state => state?.auth?.role);
  const audience =
    route?.params?.audience ||
    (role?.toLowerCase() === 'jobseeker' ? 'jobseeker' : 'recruiter');

  const [reactionByKey, setReactionByKey] = useState({});
  const [replyByKey, setReplyByKey] = useState({});
  const [reportedKeys, setReportedKeys] = useState({});
  const reportSheetRef = useRef(null);

  const reviews = useMemo(
    () => DEMO_REVIEWS_BY_AUDIENCE[audience] || [],
    [audience],
  );

  const summary = useMemo(() => {
    if (reviews.length === 0) return {average: 0, count: 0};
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return {
      average: Math.round((sum / reviews.length) * 10) / 10,
      count: reviews.length,
    };
  }, [reviews]);

  const handleReact = (key, reactionId) => {
    setReactionByKey(prev => ({...(prev || {}), [key]: reactionId}));
  };

  const handleSetReply = (key, text) => {
    setReplyByKey(prev => ({
      ...(prev || {}),
      [key]: {author: 'You', text, date: 'just now'},
    }));
  };

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
    const reactionValue =
      key in reactionByKey ? reactionByKey[key] : item.seedReaction;
    const replyValue = replyByKey?.[key] ?? item.seedReply ?? null;
    const isReported = !!reportedKeys?.[key];

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={{flex: 1}}>
            <AppText variant={Variant.bodyMedium} style={styles.reviewer}>
              {item.reviewer}
            </AppText>
            <AppText variant={Variant.caption} style={styles.reviewMeta}>
              {item.reviewerRole || ''}
              {item.date
                ? `${item.reviewerRole ? ' • ' : ''}${item.date}`
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

        <ReactionBar
          selected={reactionValue || null}
          canReact
          onChange={id => handleReact(key, id)}
          style={styles.reactionBar}
        />

        <View style={styles.divider} />

        <ReviewReply
          reply={replyValue}
          canReply
          onSubmit={text => handleSetReply(key, text)}
        />
      </View>
    );
  };

  const empty = EMPTY_COPY[audience] || EMPTY_COPY.recruiter;

  return (
    <View style={styles.container}>
      <PoolHeader
        title="My Reviews"
        leftIcon={{
          name: 'Feather',
          iconName: 'arrow-left',
          onPress: () => navigation.goBack(),
        }}
        containerStyle={{backgroundColor: 'transparent'}}
        titleStyle={{color: '#fff'}}
      />

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <AppText variant={Variant.caption} style={styles.summaryLabel}>
              Average rating
            </AppText>
            <View style={styles.summaryValueRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="star"
                size={18}
                color="#F59E0B"
              />
              <AppText
                variant={Variant.subTitle}
                style={styles.summaryAverage}>
                {summary.average.toFixed(1)}
              </AppText>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRight}>
            <AppText variant={Variant.caption} style={styles.summaryLabel}>
              Total reviews
            </AppText>
            <AppText variant={Variant.subTitle} style={styles.summaryCount}>
              {summary.count}
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
        title="Report review"
        subtitle="Let admin know what's wrong. They'll review and take action."
        onSubmit={handleReportSubmit}
      />
    </View>
  );
};

export default MyReviews;

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
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.2),
  },
  summaryAverage: {
    color: colors.secondary,
    fontWeight: '800',
  },
  summaryCount: {
    color: colors.secondary,
    fontWeight: '800',
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
