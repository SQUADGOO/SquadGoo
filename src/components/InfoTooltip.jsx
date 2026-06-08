import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { colors, getFontSize, hp, wp } from '@/theme'

/**
 * Inline info icon that shows a tooltip message on press.
 *
 * Props:
 *   message   – tooltip text
 *   iconSize  – info icon size (default 16)
 *   iconColor – info icon colour (default colors.primary)
 */
const InfoTooltip = ({ message, iconSize = 16, iconColor = colors.primary }) => {
  const [visible, setVisible] = useState(false)

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="information-circle-outline"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.bubble}>
            <View style={styles.bubbleHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="information-circle"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.bubbleTitle}>Info</AppText>
              <TouchableOpacity onPress={() => setVisible(false)} activeOpacity={0.7} style={styles.closeBtn}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="close-circle"
                  size={22}
                  color="#EF4444"
                />
              </TouchableOpacity>
            </View>
            <AppText variant={Variant.body} style={styles.bubbleText}>
              {message}
            </AppText>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

export default InfoTooltip

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(8),
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    width: '100%',
    maxWidth: wp(84),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2),
    gap: wp(2),
  },
  bubbleTitle: {
    flex: 1,
    color: colors.secondary,
    fontWeight: '700',
    fontSize: getFontSize(15),
  },
  closeBtn: {
    padding: wp(0.5),
  },
  bubbleText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    lineHeight: getFontSize(22),
  },
})
