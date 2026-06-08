// core/CustomCheckBox.js
import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { colors, wp } from '@/theme'

const CustomCheckBox = ({ checked, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.box, checked && styles.boxChecked]}
    >
      {checked && (
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="checkmark"
          size={18}
          color={colors.white}
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  box: {
    width: wp(6),
    height: wp(6),
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  boxChecked: {
    backgroundColor: colors.primary,
  },
})

export default CustomCheckBox
