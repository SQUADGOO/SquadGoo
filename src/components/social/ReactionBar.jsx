import React, {memo, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import {REACTIONS as DEFAULT_REACTIONS} from './constants';

const SIZE_MAP = {
  sm: {emoji: 14, padH: wp(2), padV: 4, radius: 14},
  md: {emoji: 16, padH: wp(2.5), padV: 6, radius: 18},
};

const ReactionBar = ({
  reactions = DEFAULT_REACTIONS,
  selected = null,
  onChange,
  canReact = true,
  size = 'md',
  style,
}) => {
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  const [picking, setPicking] = useState(false);

  const selectedReaction = reactions.find(r => r.id === selected);

  const handlePick = id => {
    onChange?.(id === selected ? null : id);
    setPicking(false);
  };

  if (!canReact && !selectedReaction) return null;

  if (!canReact && selectedReaction) {
    return (
      <View style={[styles.rowWrap, style]}>
        <View
          style={[
            styles.pill,
            {
              paddingHorizontal: s.padH,
              paddingVertical: s.padV,
              borderRadius: s.radius,
            },
            styles.pillSelected,
          ]}>
          <AppText style={{fontSize: getFontSize(s.emoji)}}>
            {selectedReaction.emoji}
          </AppText>
        </View>
      </View>
    );
  }

  if (picking) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, style]}
        keyboardShouldPersistTaps="handled">
        {reactions.map(r => {
          const isSelected = selected === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.85}
              onPress={() => handlePick(r.id)}
              accessibilityLabel={r.label}
              style={[
                styles.pill,
                {
                  paddingHorizontal: s.padH,
                  paddingVertical: s.padV,
                  borderRadius: s.radius,
                },
                isSelected && styles.pillSelected,
              ]}>
              <AppText style={{fontSize: getFontSize(s.emoji)}}>
                {r.emoji}
              </AppText>
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
    <View style={[styles.rowWrap, style]}>
      {selectedReaction ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setPicking(true)}
          accessibilityLabel={`Reaction: ${selectedReaction.label}. Tap to change.`}
          style={[
            styles.pill,
            {
              paddingHorizontal: s.padH,
              paddingVertical: s.padV,
              borderRadius: s.radius,
            },
            styles.pillSelected,
          ]}>
          <AppText style={{fontSize: getFontSize(s.emoji)}}>
            {selectedReaction.emoji}
          </AppText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setPicking(true)}
          accessibilityLabel="Add reaction"
          style={[
            styles.addBtn,
            {
              paddingHorizontal: s.padH,
              paddingVertical: s.padV,
              borderRadius: s.radius,
            },
          ]}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="happy-outline"
            size={14}
            color={colors.gray}
          />
          <AppText variant={Variant.smallCaptionSemi} style={styles.addText}>
            React
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(ReactionBar);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingRight: wp(2),
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    backgroundColor: '#F4F6FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
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
