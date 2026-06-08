import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppText from './AppText'
import { colors, getFontSize, hp, wp } from '@/theme'
import { Icons } from '@/assets'
import globalStyles from '@/styles/globalStyles'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'

const SheetHeader = ({title, onPressEdit, showStatus, onClose}) => {
  return (
   <>
   {/* <TouchableOpacity onPress={onClose} style={{alignSelf: 'flex-end', marginVertical: 10}}>
      <VectorIcons name={iconLibName.Ionicons} iconName="close-circle-sharp" size={24} color={colors.textSecondary} onPress={onClose} />
   </TouchableOpacity> */}
    <View style={{...globalStyles.rowJustify}}>
          <View style={{flexDirection: 'row', gap: 5}}>
              <AppText style={styles.title}>{title}</AppText>
              {showStatus &&
                <TouchableOpacity>
                  <Image source={Icons.edit} style={{height: wp(5), width: wp(5)}} />
              </TouchableOpacity>}
          </View>
        <TouchableOpacity onPress={onPressEdit}>
          <Image source={Icons.edit} style={{height: wp(5), width: wp(5)}} />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default SheetHeader

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: getFontSize(18),
        color: colors.textSecondary,
        // textAlign: 'center',
        marginBottom: hp(1),
      },
})