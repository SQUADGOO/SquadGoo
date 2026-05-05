import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PoolHeader from '@/core/PoolHeader';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import {
  ANNOUNCEMENT_CATEGORIES,
  DUMMY_ANNOUNCEMENTS,
  getCategoryMeta,
} from '@/utilities/dummyAnnouncements';
import {screenNames} from '@/navigation/screenNames';

const INITIAL_UNREAD = new Set(['ann-001', 'ann-003', 'ann-004']);

const Announcements = ({navigation}) => {
  const [categoryId, setCategoryId] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    const all = new Set(DUMMY_ANNOUNCEMENTS.map(a => a.id));
    INITIAL_UNREAD.forEach(id => all.delete(id));
    return all;
  });

  const posts = useMemo(() => {
    if (categoryId === 'all') return DUMMY_ANNOUNCEMENTS;
    return DUMMY_ANNOUNCEMENTS.filter(a => a.category === categoryId);
  }, [categoryId]);

  const totalReactions = useCallback(reactions => {
    if (!reactions) return 0;
    return Object.values(reactions).reduce((acc, n) => acc + (n || 0), 0);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  const openDetail = post => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(post.id);
      return next;
    });
    navigation.navigate(screenNames.ANNOUNCEMENT_DETAILS, {id: post.id});
  };

  const renderItem = ({item}) => {
    const meta = getCategoryMeta(item.category);
    const unread = !readIds.has(item.id);
    const reactionsCount = totalReactions(item.reactions);
    const commentsCount = (item.comments || []).length;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openDetail(item)}
        style={styles.card}>
        {item.cover ? (
          <Image source={{uri: item.cover}} style={styles.cover} />
        ) : null}
        <View style={styles.cardBody}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.categoryChip,
                {backgroundColor: meta.bg || '#F4F6FA'},
              ]}>
              <AppText
                variant={Variant.smallCaptionSemi}
                style={[styles.categoryText, {color: meta.color || colors.gray}]}>
                {meta.label}
              </AppText>
            </View>
            {unread ? <View style={styles.unreadDot} /> : null}
          </View>

          <AppText variant={Variant.bodyMedium} style={styles.title}>
            {item.title}
          </AppText>
          <AppText
            variant={Variant.caption}
            numberOfLines={2}
            style={styles.excerpt}>
            {item.body}
          </AppText>

          <View style={styles.footer}>
            <AppText variant={Variant.smallCaption} style={styles.metaText}>
              {item.author} • {item.createdAt}
            </AppText>
            <View style={styles.counts}>
              <View style={styles.countItem}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="happy-outline"
                  size={12}
                  color={colors.gray}
                />
                <AppText
                  variant={Variant.smallCaption}
                  style={styles.countText}>
                  {reactionsCount}
                </AppText>
              </View>
              <View style={styles.countItem}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="chatbubble-outline"
                  size={12}
                  color={colors.gray}
                />
                <AppText
                  variant={Variant.smallCaption}
                  style={styles.countText}>
                  {commentsCount}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Announcements"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.chipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
          keyboardShouldPersistTaps="handled">
          {ANNOUNCEMENT_CATEGORIES.map(c => {
            const active = c.id === categoryId;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                activeOpacity={0.8}
                style={[styles.filterChip, active && styles.filterChipActive]}>
                <AppText
                  variant={Variant.caption}
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}>
                  {c.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={posts}
        keyExtractor={x => x.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>
              Nothing here yet
            </AppText>
            <AppText variant={Variant.caption} style={styles.emptyText}>
              Check back soon — new announcements appear here as they're
              posted.
            </AppText>
          </View>
        }
      />
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  chipsWrap: {
    paddingVertical: hp(1.2),
    backgroundColor: '#F5F7FA',
  },
  chipsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  filterChip: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.9),
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: wp(2),
  },
  filterChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  filterText: {
    color: colors.grayishBlue,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    marginTop: hp(1.2),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cover: {
    width: '100%',
    height: hp(18),
    backgroundColor: '#E5E7EB',
  },
  cardBody: {
    padding: wp(4),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: getFontSize(15),
  },
  excerpt: {
    color: colors.textPrimary,
    marginTop: hp(0.6),
    lineHeight: hp(2),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(1.2),
  },
  metaText: {
    color: colors.gray,
    flex: 1,
  },
  counts: {
    flexDirection: 'row',
    gap: wp(2.5),
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  countText: {
    color: colors.gray,
  },
  empty: {
    marginTop: hp(10),
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
