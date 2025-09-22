import {StyleSheet, Text, View, Animated, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect} from 'react';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import {colors, wp, hp} from '@/theme';
import AppInputField from '@/core/AppInputField';
import AppButton from '@/core/AppButton';
import Scrollable from '@/core/Scrollable';
import {screenNames} from '@/navigation/screenNames';
import {useNavigation} from '@react-navigation/native';

const KycVerification = () => {
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

  return (
    <>
      <AppHeader showTopIcons={false} title="KYC/KYB Verification" />
      <Scrollable>
        <View style={{flex: 1, padding: wp(4), backgroundColor: colors.white}}>
          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Create New Ticket
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            Describe your issue and we'll help you resolve it
          </AppText>

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
            <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
              Personal KYC
            </AppText>
            <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
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
                    backgroundColor: colors.gray,
                    borderRadius: 75,
                  }}
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.gray,
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
                    backgroundColor: colors.gray,
                    borderRadius: 75,
                  }}
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.gray,
                    width: wp(23),
                  }}
                />
              </View>
            </View>
          </View>
          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Personal Information
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            Provide your personal details for identity verification
          </AppText>
          <AppInputField
            label="Full Name (as per ID)"
            placeholder="John Doe"
            lablstyle={{colors: colors.text1}}
          />
          <AppInputField
            label="NRIC/Passport Number"
            placeholder="JG12345678"
            lablstyle={{colors: colors.text1}}
          />
          <AppInputField
            label="Nationality"
            placeholder="USA"
            lablstyle={{colors: colors.text1}}
          />
          <AppInputField
            label="Occupation"
            placeholder="Software Engineer"
            lablstyle={{colors: colors.text1}}
          />
          <AppInputField
            label="Monthly Income (SGD)"
            placeholder="5000"
            keyboardType="numeric"
            lablstyle={{colors: colors.text1}}
          />
          <AppInputField
            label="Source of Funds"
            placeholder="Employment"
            lablstyle={{colors: colors.text1}}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
                  screen: screenNames.KYC_KYB_DOC,
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
            />
          </View>
        </View>
      </Scrollable>
    </>
  );
};

export default KycVerification;

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: colors.black,
  },
  sectionSubtitle: {
    marginBottom: 16,
    color: colors.text,
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
    backgroundColor: colors.gray,
    borderRadius: hp(1),
  },
});
