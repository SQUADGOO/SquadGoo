import React, {useMemo, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PoolHeader from '@/core/PoolHeader';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import PostReactions from '@/components/social/PostReactions';
import CommentThread from '@/components/social/CommentThread';
import ReportSheet from '@/components/social/ReportSheet';
import {getAnnouncementById, getCategoryMeta} from '@/utilities/dummyAnnouncements';
import {showToast, toastTypes} from '@/utilities/toastConfig';

const AnnouncementDetails = ({navigation, route}) => {
  const id = route?.params?.id;
  const post = useMemo(() => getAnnouncementById(id), [id]);

  const [userReaction, setUserReaction] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const [postReported, setPostReported] = useState(false);
  const reportSheetRef = useRef(null);

  const meta = post ? getCategoryMeta(post.category) : null;

  const comments = useMemo(
    () => [...(post?.comments || []), ...localComments],
    [post, localComments],
  );

  const handleAddComment = text => {
    setLocalComments(prev => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        author: 'You',
        text,
        date: 'just now',
      },
    ]);
  };

  const openReportPost = () =>
    reportSheetRef.current?.open({type: 'post', postId: id});

  const openReportComment = comment =>
    reportSheetRef.current?.open({
      type: 'comment',
      postId: id,
      commentId: comment?.id,
    });

  const handleReportSubmit = payload => {
    if (payload?.target?.type === 'post') setPostReported(true);
    showToast(
      'Report sent to admin for review.',
      'Reported',
      toastTypes.success,
    );
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <PoolHeader title="Announcement" onBackPress={() => navigation.goBack()} />
        <View style={styles.notFound}>
          <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>
            Announcement not found
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Announcement"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={openReportPost} hitSlop={8} activeOpacity={0.7}>
            <VectorIcons
              name={iconLibName.Feather}
              iconName="flag"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {post.cover ? (
          <Image source={{uri: post.cover}} style={styles.cover} />
        ) : null}

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.categoryChip,
                {backgroundColor: meta?.bg || '#F4F6FA'},
              ]}>
              <AppText
                variant={Variant.smallCaptionSemi}
                style={[
                  styles.categoryText,
                  {color: meta?.color || colors.gray},
                ]}>
                {meta?.label || 'Announcement'}
              </AppText>
            </View>
            <TouchableOpacity
              onPress={openReportPost}
              hitSlop={8}
              style={styles.reportBtn}
              activeOpacity={0.7}>
              <VectorIcons
                name={iconLibName.Feather}
                iconName="flag"
                size={14}
                color={postReported ? colors.softRed : colors.gray}
              />
              <AppText
                variant={Variant.smallCaption}
                style={[
                  styles.reportText,
                  postReported && {color: colors.softRed},
                ]}>
                {postReported ? 'Reported' : 'Report'}
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText variant={Variant.title} style={styles.title}>
            {post.title}
          </AppText>
          <AppText variant={Variant.smallCaption} style={styles.meta}>
            {post.author} • {post.createdAt}
          </AppText>

          <AppText variant={Variant.body} style={styles.postBody}>
            {post.body}
          </AppText>

          <View style={styles.divider} />

          <AppText variant={Variant.smallCaptionSemi} style={styles.sectionLabel}>
            Reactions
          </AppText>
          <PostReactions
            counts={post.reactions}
            userReaction={userReaction}
            onChange={setUserReaction}
            style={styles.reactions}
          />

          <View style={styles.divider} />

          <AppText variant={Variant.smallCaptionSemi} style={styles.sectionLabel}>
            Comments ({comments.length})
          </AppText>
          <CommentThread
            comments={comments}
            currentUser={{name: 'You'}}
            onSubmit={handleAddComment}
            onReport={openReportComment}
          />
        </View>
      </ScrollView>

      <ReportSheet
        ref={reportSheetRef}
        title="Report this content"
        subtitle="Flag this post or comment to admin for review."
        onSubmit={handleReportSubmit}
      />
    </View>
  );
};

export default AnnouncementDetails;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  scrollContent: {
    paddingBottom: hp(4),
  },
  cover: {
    width: '100%',
    height: hp(26),
    backgroundColor: '#E5E7EB',
  },
  body: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1.2),
  },
  categoryChip: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 999,
  },
  categoryText: {
    fontSize: getFontSize(10),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
  },
  reportText: {
    color: colors.gray,
  },
  title: {
    color: colors.secondary,
    fontSize: getFontSize(20),
    lineHeight: hp(3.4),
  },
  meta: {
    color: colors.gray,
    marginTop: hp(0.6),
  },
  postBody: {
    color: colors.textPrimary,
    marginTop: hp(1.5),
    lineHeight: hp(2.4),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: hp(2),
  },
  sectionLabel: {
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: getFontSize(10),
    marginBottom: hp(1),
  },
  reactions: {},
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  emptyTitle: {
    color: colors.secondary,
    fontWeight: '800',
  },
});
