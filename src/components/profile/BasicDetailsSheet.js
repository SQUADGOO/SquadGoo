import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/core/AppText';
import { colors, getFontSize, hp, wp } from '@/theme';
import { fonts } from '@/assets/fonts';
import { useSelector } from 'react-redux';
import SheetHeader from '@/core/SheetHeader';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import AppButton from '@/core/AppButton';

const BasicDetailsSheet = ({onClose}) => {
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const basicInfo = userInfo?.job_seeker || userInfo?.recruiter || {};

  const handleEdit = async () => {
    onClose()
    navigation.navigate(screenNames.EDIT_PROFILE)
  }
  return (
    <View style={styles.container}>
      {/* <AppText style={styles.title}>Basic Details</AppText> */}
      <SheetHeader onPressEdit={handleEdit} title='Basic Details' onClose={onClose} />
      <View style={styles.row}>
        <AppText style={styles.label}>First name: </AppText>
        <AppText style={styles.value}>{basicInfo.first_name || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>Last name:</AppText>
        <AppText style={styles.value}>{basicInfo.last_name || '-'}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.label}>Date of birth: </AppText>
        <AppText style={styles.value}>
          {basicInfo.dob ? new Date(basicInfo.dob).toDateString() : '-'}
        </AppText>
      </View>

      <AppButton
        onPress={onClose}
        text='Close'
        style={{ marginTop: hp(2) }}
      />
    </View>
  );
};

export default BasicDetailsSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
  },
  
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1),
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
