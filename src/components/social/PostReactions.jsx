import React, {memo, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import {REACTIONS as DEFAULT_REACTIONS} from './constants';

const PostReactions = ({
  reactions = DEFAULT_REACTIONS,
  counts = {},
  userReaction = null,
  onChange,
  style,
}) => {
  const [picking, setPicking] = useState(false);

  const reactionsWithCount = reactions.filter(r => (counts?.[r.id] || 0) > 0);
  const hasAny = reactionsWithCount.length > 0;
  const showChips = hasAny || userReaction;

  const adjustedCounts = (() => {
    const next = {...counts};
    if (userReaction) next[userReaction] = (next[userReaction] || 0) + 1;
    return next;
  })();

  const visibleChips = reactions.filter(
    r => (adjustedCounts[r.id] || 0) > 0 || r.id === userReaction,
  );

  const handleTogglePill = id => {
    if (!onChange) return;
    onChange(userReaction === id ? null : id);
  };

  const handlePickFromExpander = id => {
    onChange?.(userReaction === id ? null : id);
    setPicking(false);
  };

  if (picking) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.rowScroll, style]}
        keyboardShouldPersistTaps="handled">
        {reactions.map(r => {
          const isUser = userReaction === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.85}
              onPress={() => handlePickFromExpander(r.id)}
              accessibilityLabel={r.label}
              style={[styles.pill, isUser && styles.pillUser]}>
              <AppText style={styles.emoji}>{r.emoji}</AppText>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          onPress={() => setPicking(false)}
          hitSlop={8}
          style={styles.closeBtn}
          activeOpacity={0.7}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="close"
            size={16}
            color={colors.gray}
          />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.row, style]}>
      {showChips ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowScroll}
          keyboardShouldPersistTaps="handled">
          {visibleChips.map(r => {
            const count = adjustedCounts[r.id] || 0;
            const isUser = userReaction === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                activeOpacity={0.85}
                onPress={() => handleTogglePill(r.id)}
                style={[styles.pill, isUser && styles.pillUser]}>
                <AppText style={styles.emoji}>{r.emoji}</AppText>
                {count > 0 ? (
                  <AppText
                    variant={Variant.smallCaptionSemi}
                    style={[styles.count, isUser && styles.countUser]}>
                    {count}
                  </AppText>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setPicking(true)}
        style={styles.addBtn}
        accessibilityLabel={userReaction ? 'Change reaction' : 'Add reaction'}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName={userReaction ? 'swap-horizontal' : 'happy-outline'}
          size={14}
          color={colors.gray}
        />
        <AppText variant={Variant.smallCaptionSemi} style={styles.addText}>
          {userReaction ? 'Change' : 'React'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(PostReactions);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  rowScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingRight: wp(2),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F4F6FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillUser: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  emoji: {
    fontSize: getFontSize(16),
  },
  count: {
    color: colors.gray,
    fontSize: getFontSize(11),
  },
  countUser: {
    color: colors.secondary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addText: {
    color: colors.gray,
  },
  closeBtn: {
    marginLeft: wp(1),
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.4),
  },
});
