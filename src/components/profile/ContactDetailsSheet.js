import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/core/AppText';
import { colors, getFontSize, hp, wp } from '@/theme';
import { fonts } from '@/assets/fonts';
import { useSelector } from 'react-redux';
import SheetHeader from '@/core/SheetHeader';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppButton from '@/core/AppButton';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';

const ContactDetailsSheet = ({ onClose }) => {
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const addressInfo = userInfo?.job_seeker || userInfo?.recruiter || {};

  const handleEdit = async () => {
    onClose()
    navigation.navigate(screenNames.CONTACT_DETAILS)
  }

  console.log('Address Info:', addressInfo);
  return (
    <View style={styles.container}>
      {/* <AppText style={styles.title}>Address</AppText> */}
      <SheetHeader title='Email and Phone number' onPressEdit={handleEdit} />

      <View style={[styles.row]}>
        <VectorIcons name={iconLibName.MaterialIcons} iconName="email" size={wp(6)} color={colors.textPrimary} />
        <AppText style={styles.value}>{addressInfo?.email || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <VectorIcons name={iconLibName.MaterialIcons} iconName="local-phone" size={wp(6)} color={colors.textPrimary} />
        <AppText style={styles.value}>{addressInfo?.phone || '-'}</AppText>
      </View>
    
      <AppButton
        onPress={onClose}
        text="Close"
        style={{ marginVertical: hp(2) }}
      />

    </View>
  );
};

export default ContactDetailsSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
  },
  title: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: getFontSize(18),
    color: colors.textDark,
    marginBottom: hp(2.5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: hp(0.8),
    gap: 5,
    // borderBottomWidth: 0.5,
    // borderBottomColor: colors.grayE,
  },
  label: {
    fontFamily: fonts.poppinsRegular,
    fontSize: getFontSize(16),
    color: colors.textPrimary,
  },
  value: {
    // fontFamily: fonts.poppinsMedium,
    fontWeight: 'bold',
    fontSize: getFontSize(16),
    color: colors.textPrimary,
  },
});
