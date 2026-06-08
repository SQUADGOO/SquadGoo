import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'

const ActionButton = ({
  text,
  onPress,
  icon,
  iconName,
  iconLib = iconLibName.Ionicons,
  variant = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  style,
  textStyle,
  ...rest
}) => {
  const getButtonColors = () => {
    switch (variant) {
      case 'success':
        return {
          borderColor: '#10B981',
          backgroundColor: colors.white,
          textColor: '#10B981',
          iconColor: '#10B981'
        }
      case 'warning':
        return {
          borderColor: '#F59E0B',
          backgroundColor: colors.white,
          textColor: '#F59E0B',
          iconColor: '#F59E0B'
        }
      case 'danger':
        return {
          borderColor: '#EF4444',
          backgroundColor: colors.white,
          textColor: '#EF4444',
          iconColor: '#EF4444'
        }
      case 'secondary':
        return {
          borderColor: '#7C3AED',
          backgroundColor: colors.white,
          textColor: '#7C3AED',
          iconColor: '#7C3AED'
        }
      default: // primary
        return {
          borderColor: colors.primary || '#FF6B35',
          backgroundColor: colors.white,
          textColor: colors.primary || '#FF6B35',
          iconColor: colors.primary || '#FF6B35'
        }
    }
  }

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: wp(3),
          paddingVertical: hp(1),
          gap: wp(1.5),
          fontSize: getFontSize(12),
          iconSize: 14
        }
      case 'large':
        return {
          paddingHorizontal: wp(8),
          paddingVertical: hp(2),
          gap: wp(3),
          fontSize: getFontSize(16),
          iconSize: 20
        }
      default: // medium
        return {
          paddingHorizontal: wp(6),
          paddingVertical: hp(1.5),
          gap: wp(2),
          fontSize: getFontSize(14),
          iconSize: 18
        }
    }
  }

  const buttonColors = getButtonColors()
  const buttonSize = getButtonSize()

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          borderColor: buttonColors.borderColor,
          backgroundColor: buttonColors.backgroundColor,
          paddingHorizontal: buttonSize.paddingHorizontal,
          paddingVertical: buttonSize.paddingVertical,
          gap: buttonSize.gap
        },
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...rest}
    >
      {(icon || iconName) && (
        <VectorIcons
          name={iconLib}
          iconName={iconName || icon}
          size={buttonSize.iconSize}
          color={disabled ? colors.gray : buttonColors.iconColor}
        />
      )}
      
      <AppText 
        variant={Variant.bodyMedium} 
        style={[
          {
            color: disabled ? colors.gray : buttonColors.textColor,
            fontSize: buttonSize.fontSize,
            fontWeight: '500'
          },
          textStyle
        ]}
      >
        {text}
      </AppText>
    </TouchableOpacity>
  )
}

export default ActionButton

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: hp(3),
    borderWidth: 1,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: colors.gray || '#9CA3AF',
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
})