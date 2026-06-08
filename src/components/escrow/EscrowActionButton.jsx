import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/core/AppText';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

const EscrowActionButton = ({
  label,
  icon = 'chevron-forward',
  disabled = true,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
    >
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName={icon}
        size={18}
        color={disabled ? colors.gray : colors.primary}
      />
      <AppText
        variant="bodyMedium"
        style={[styles.label, { color: disabled ? colors.gray : colors.primary }]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export default EscrowActionButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.9),
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  disabled: {
    borderColor: colors.grayE8 || '#E5E7EB',
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  label: {
    marginLeft: wp(1.5),
    fontWeight: '600',
    fontSize: getFontSize(12),
  },
});

