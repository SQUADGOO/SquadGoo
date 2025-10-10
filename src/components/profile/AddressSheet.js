import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/core/AppText';
import { colors, getFontSize, hp, wp } from '@/theme';
import { fonts } from '@/assets/fonts';
import { useSelector } from 'react-redux';
import SheetHeader from '@/core/SheetHeader';
import AppButton from '@/core/AppButton';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';

const AddressSheet = ({onClose}) => {
    const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const addressInfo = userInfo?.job_seeker || userInfo?.recruiter || {};

  const handleEdit = async () => {
    onClose()
    navigation.navigate(screenNames.ADDRESS)
  }
  return (
    <View style={styles.container}>
      {/* <AppText style={styles.title}>Address</AppText> */}
      <SheetHeader title='Address' onPressEdit={handleEdit} />

      <View style={[styles.row, {flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}]}>
        <AppText style={styles.label}>Full Address: </AppText>
        <AppText style={styles.value}>{addressInfo?.address || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>Country: </AppText>
        <AppText style={styles.value}>{addressInfo?.country || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>State: </AppText>
        <AppText style={styles.value}>{addressInfo?.state || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>Suburb: </AppText>
        <AppText style={styles.value}>{addressInfo?.suburb || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>Unit No: </AppText>
        <AppText style={styles.value}>{addressInfo?.unit_no || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>House No: </AppText>
        <AppText style={styles.value}>{addressInfo?.house_no || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>Street Name: </AppText>
        <AppText style={styles.value}>{addressInfo?.street_name || '-'}</AppText>
      </View>

      <AppButton
        onPress={onClose}
        text='Close'
        style={{marginVertical: hp(2.5)}}
      />
    </View>
  );
};

export default AddressSheet;

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
