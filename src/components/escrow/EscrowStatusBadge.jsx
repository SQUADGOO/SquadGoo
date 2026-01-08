import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText, { Variant } from '@/core/AppText';
import { colors, hp, wp, getFontSize } from '@/theme';

const toneStyles = {
  default: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    text: colors.secondary,
  },
  info: {
    backgroundColor: '#DBEAFE',
    text: '#1D4ED8',
  },
  warning: {
    backgroundColor: '#FEF3C7',
    text: '#B45309',
  },
  success: {
    backgroundColor: '#DCFCE7',
    text: '#047857',
  },
  danger: {
    backgroundColor: '#FEE2E2',
    text: '#B91C1C',
  },
};

const EscrowStatusBadge = ({ label, value, tone = 'default', compact = false }) => {
  const palette = toneStyles[tone] || toneStyles.default;

  return (
    <View style={[styles.container, { backgroundColor: palette.backgroundColor }]}>
      {label ? (
        <AppText
          variant={compact ? Variant.caption : Variant.bodySmall}
          style={[styles.label, { color: palette.text }]}
        >
          {label}
        </AppText>
      ) : null}
      {value ? (
        <AppText
          variant={compact ? Variant.caption : Variant.bodyMedium}
          style={[styles.value, { color: palette.text }]}
        >
          {value}
        </AppText>
      ) : null}
    </View>
  );
};

export default EscrowStatusBadge;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginRight: wp(2),
    marginBottom: hp(0.5),
    alignSelf: 'flex-start',
    width: '55%',
  },
  label: {
    marginRight: wp(1.5),
    textTransform: 'uppercase',
    fontSize: getFontSize(10),
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  value: {
    fontWeight: '600',
    flexShrink: 1,
  },
});

