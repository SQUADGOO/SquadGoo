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
import AppText, {Variant} from '@/core/AppText';
import {colors, getFontSize, hp, wp} from '@/theme';
import Spacer from '@/core/Spacer';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import images from '@/assets/images';
import {useNavigation} from '@react-navigation/native';
import icons from '@/assets/icons';
import MenuCard from '@/components/Recruiter/MenuCard';
import Scrollable from '@/core/Scrollable';
import { fonts } from '@/assets/fonts';

const Profile = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <Scrollable>
      <View style={{backgroundColor:colors.white,flex:1}}>
        <ImageBackground source={images.phead} style={styles.headerCard}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="arrow-back"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <AppText variant={Variant.title} color={colors.white}>
              My Profile
            </AppText>
          </View>

          <View style={styles.row}>
            <View>
              <Image
                source={{uri: 'https://i.pravatar.cc/150?img=3'}}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Image
                  source={icons.cam}
                  style={{height: 30, width: 30, left: wp(1.5)}}
                />
              </TouchableOpacity>
            </View>

            <View style={{flex: 1, marginLeft: wp(4)}}>
              <View style={{flexDirection: 'row', width: wp(45)}}>
                <Text  style={styles.name}>
                  Alex Linderson
                </Text>
                <Image
                  source={icons.time}
                  style={{height: 20, width: 20, left: wp(1)}}
                />
              </View>
              <AppText variant={Variant.caption} style={styles.subtitle}>
                #Jobseeker-721543730
              </AppText>

              <Spacer size={8} />

              <View style={styles.row}>
                {Array.from({length: 5}).map((_, index) => (
                  <VectorIcons
                    key={index}
                    name={iconLibName.Ionicons}
                    iconName="star"
                    size={14}
                    color={colors.primary}
                    style={{marginRight: 2}}
                  />
                ))}
                <AppText
                  variant={Variant.caption}
                  style={{marginLeft: 4}}
                  color={colors.white}>
                  4.9 (20 reviews)
                </AppText>
              </View>
            </View>
          </View>

          <Spacer size={35} />

          <View style={styles.infoRow}>
            <Image resizeMode='contain' source={icons.msg} style={{height: 18, width: 22}} />
            <AppText variant={Variant.caption} style={styles.infoText}>
              Email: <Text style={{fontFamily:fonts.poppinsSemiBold}}> jobseeker@yopmail.com</Text>
            </AppText>
          </View>


          <View style={styles.infoRow}>
            <Image resizeMode='contain' source={icons.call} style={{height: 18, width: 22}} />
            <AppText variant={Variant.caption} style={styles.infoText}>
              Phone: <Text style={{fontFamily:fonts.poppinsSemiBold}}>+61 5875767524</Text>
            </AppText>
          </View>


          <View style={styles.infoRow}>
            <Image resizeMode='contain' source={icons.pf} style={{height: 22, width: 22}} />
            <AppText variant={Variant.caption} style={styles.infoText}>
              Profile Status:{' '}
              <Text style={{fontFamily:fonts.poppinsSemiBold}}>Incomplete</Text>
            </AppText>
            <TouchableOpacity style={{marginLeft: 'auto'}}>
              <Image resizeMode='contain' source={icons.edit} style={{height: 22, width: 22}} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <MenuCard />
      </View>
    </Scrollable>
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
    height: hp(46),
    padding: wp(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 2,
    borderColor: colors.white,
  },
  cameraButton: {
    position: 'absolute',
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
    marginVertical: hp(1),
    marginLeft: wp(2),
  },
  infoText: {
    marginLeft: wp(5),
    color: colors.white,
  },
});
