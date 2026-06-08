import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import AppText, {Variant} from '@/core/AppText';
import globalStyles from '@/styles/globalStyles';
import {colors, hp, wp} from '@/theme';

const DrawerButton = ({onPress, title = '', icon, color = colors.black}) => {
  return (
    <TouchableOpacity
      style={[styles.drawerButton, {flexDirection: 'row'}]}
      onPress={onPress}>
      <Image source={icon} style={styles.iconStyle} />
      <AppText variant={Variant.ligntBody} color={color}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

export default DrawerButton;

const styles = StyleSheet.create({
  drawerButton: {
    ...globalStyles.flexRow,
    height: hp(6),
    width: '100%',
    borderRadius: hp(1),
    backgroundColor: colors.gray05,
    marginTop: hp(2),
    gap: wp(1.2),
    paddingHorizontal: wp(3),
  },
  iconStyle: {
    height: hp(2.5),
    width: hp(2.5),
    resizeMode: 'contain',
  },
});
