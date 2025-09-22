import {
  StyleSheet,
  View,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import {colors, wp, hp} from '@/theme';
import AppButton from '@/core/AppButton';
import Scrollable from '@/core/Scrollable';
import icons from '@/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {screenNames} from '@/navigation/screenNames';

const UploadCard = ({title}) => {
  return (
    <View style={{marginBottom: hp(2)}}>
      <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={styles.uploadCard}>
        <Image
          source={icons.save}
          style={{width: wp(10), height: wp(10), borderRadius: wp(15)}}
        />
        <AppText
          variant={Variant.bodybold}
          style={{textAlign: 'center', color: colors.black}}>
          Drag and drop your file here, or click to browse
        </AppText>
        <AppButton
          text="Choose File"
          style={{
            borderWidth: 1,
            borderColor: colors.text,
            width: wp(45),
            height: hp(4.5),
            backgroundColor: colors.white,
          }}
          textStyle={{color: colors.text}}
          onPress={() => console.log('Choose File pressed')}
        />
      </View>
    </View>
  );
};

const KycDocument = () => {
  const navigation = useNavigation();
  const progress = 0.5; // example progress (50%)
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const documents = [
    'NRIC/Passport',
    'Selfie with ID',
    'Proof of Address',
    'Business Registration',
    'Tax Certificate',
  ];

  return (
    <>
      <AppHeader showTopIcons={false} title="KYC/KYB Verification" />
      <Scrollable>
        <View style={{flex: 1, padding: wp(4), backgroundColor: colors.white}}>
          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            KYC & KYB Verification
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            Complete your identity and business verification
          </AppText>

          {/* Progress Bar */}
          <View style={{marginVertical: hp(2)}}>
            <View style={styles.labelRow}>
              <AppText variant={Variant.caption} style={styles.labelLeft}>
                Overall Progress
              </AppText>
              <AppText variant={Variant.caption} style={styles.labelRight}>
                0% Complete
              </AppText>
            </View>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[styles.progressFill, {width: widthInterpolated}]}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: wp(90),
              alignItems: 'flex-start',
              gap: wp(14),
              top: hp(1.5),
            }}>
            <AppText variant={Variant.caption} color={colors.primary}>
              Personal KYC
            </AppText>
            <AppText variant={Variant.caption} color={colors.primary}>
              Documents
            </AppText>
            <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
              Review
            </AppText>
          </View>
          <View style={{marginBottom: hp(1)}}>
            <View
              style={{
                flexDirection: 'row',
                width: wp(90),
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: wp(1),
                }}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    backgroundColor: colors.primary,
                    borderRadius: 75,
                  }}
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.primary,
                    width: wp(23),
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: wp(1),
                }}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    backgroundColor: colors.primary,
                    borderRadius: 75,
                  }}
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.primary,
                    width: wp(23),
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: wp(1),
                }}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    backgroundColor: colors.primary,
                    borderRadius: 75,
                  }}
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.primary,
                    width: wp(23),
                  }}
                />
              </View>
            </View>
          </View>

          {documents.map((doc, index) => (
            <UploadCard key={index} title={doc} />
          ))}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: hp(2),
            }}>
            <AppButton
              text="Previous"
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                width: wp(45),
                height: hp(4.5),
                backgroundColor: colors.white,
              }}
              textStyle={{color: colors.primary}}
            />
            <AppButton
              onPress={() =>
                navigation.navigate('DrawerNavigator', {
                  screen: screenNames.KYC_KYB_SUBMIT,
                })
              }
              text="Next"
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                width: wp(45),
                height: hp(4.5),
                backgroundColor: colors.primary,
              }}
              textStyle={{color: colors.white}}
            />
          </View>
        </View>
      </Scrollable>
    </>
  );
};

export default KycDocument;

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: colors.black,
  },
  sectionSubtitle: {
    marginBottom: 16,
    color: colors.text1,
    textAlign: 'left',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelLeft: {
    color: colors.text,
  },
  labelRight: {
    color: colors.text,
  },
  progressBackground: {
    height: hp(1),
    backgroundColor: colors.gray,
    borderRadius: hp(1),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: hp(1),
  },
  uploadCard: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: wp(3),
    alignItems: 'center',
    gap: hp(2),
  },
});
