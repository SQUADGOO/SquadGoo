// screens/Profile.tsx
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';
import AppText, { Variant } from '@/core/AppText';
import { colors, getFontSize, hp, wp } from '@/theme';
import Spacer from '@/core/Spacer';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import images from '@/assets/images';
import { useNavigation } from '@react-navigation/native';
import icons from '@/assets/icons';
import MenuCard from '@/components/Recruiter/MenuCard';
import Scrollable from '@/core/Scrollable';
import { fonts } from '@/assets/fonts';
import AppHeader from '@/core/AppHeader';
import { useSelector } from 'react-redux';
import FastImageView from '@/core/FastImageView';
import { screenNames } from '@/navigation/screenNames';

const Profile = () => {
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
      <AppHeader
        onBackPress={handleBackPress}
        showBackButton={true}
        rightComponent={false}
        showTopIcons={false}
        title='My Profile'
        children={
          <View style={styles.headerCard}>

            <View style={[styles.row, { marginVertical: 15, bottom: 5 }]}>
              <View>
                <FastImageView
                  source={{ uri: userInfo?.profile_picture }}
                  style={styles.avatar}
                // resizeMode={'contain'}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Image
                    source={icons.cam}
                    style={{ height: 30, width: 30, left: wp(1.5) }}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, marginLeft: wp(4) }}>
                <View style={{ flexDirection: 'row', width: wp(45) }}>
                  <Text style={styles.name}>
                    {userInfo?.name || 'John Doe'}
                  </Text>
                  <Image
                    source={icons.time}
                    style={{ height: 20, width: 20, left: wp(1) }}
                  />
                </View>
                <AppText variant={Variant.caption} style={styles.subtitle}>
                  #Jobseeker-721543730
                </AppText>

                <Spacer size={8} />

                <View style={styles.row}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <VectorIcons
                      key={index}
                      name={iconLibName.Ionicons}
                      iconName="star"
                      size={14}
                      color={colors.primary}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                  <AppText
                    variant={Variant.caption}
                    style={{ marginLeft: 4 }}
                    color={colors.white}>
                    4.9 (20 reviews)
                  </AppText>
                </View>
              </View>
            </View>

            {/* <Spacer size={20} /> */}

            <View style={styles.infoRow}>
              <Image resizeMode='contain' source={icons.msg} style={{ height: 18, width: 18 }} />
              <AppText variant={Variant.caption} style={styles.infoText}>
                Email: <Text style={{ fontFamily: fonts.poppinsSemiBold }}>{userInfo?.email}</Text>
              </AppText>
            </View>


            <View style={styles.infoRow}>
              <Image resizeMode='contain' source={icons.call} style={{ height: 18, width: 18 }} />
              <AppText variant={Variant.caption} style={styles.infoText}>
                Phone: <Text style={{ fontFamily: fonts.poppinsSemiBold }}>{userInfo?.contactNumber || 'N/A'}</Text>
              </AppText>
            </View>


            <View style={styles.infoRow}>
              <Image resizeMode='contain' source={icons.pf} style={{ height: 18, width: 18 }} />
              <AppText variant={Variant.caption} style={styles.infoText}>
                Profile Status:{' '}
                <Text style={{ fontFamily: fonts.poppinsSemiBold }}>Incomplete</Text>
              </AppText>
              <TouchableOpacity
                onPress={() => navigation.navigate(screenNames.EDIT_PROFILE)}
                style={{ marginLeft: 'auto' }}>
                <Image resizeMode='contain' source={icons.edit} style={{ height: 22, width: 22 }} />
              </TouchableOpacity>
            </View>
          </View>
        }
      />
      <Scrollable>
        
        <View style={{ backgroundColor: colors.white, flex: 1 }}>
          <MenuCard />
        </View>
      </Scrollable>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp(2),
    paddingBottom: hp(0.5),
    gap: wp(2),
    marginVertical: hp(2),
  },
  headerCard: {
    // height: hp(46),
    paddingHorizontal: wp(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: hp(1),
  },
  avatar: {
    width: wp(17),
    height: wp(17),
    borderRadius: wp(25),
    // borderWidth: 1,
    borderColor: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    right: 0,
    borderRadius: wp(3),
  },
  name: {
    color: colors.white,
    fontSize: getFontSize(18),
    fontFamily: fonts.poppinsSemiBold,
  },
  subtitle: {
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5),
    marginLeft: wp(2),
  },
  infoText: {
    marginLeft: wp(3),
    color: colors.white,
  },
});
