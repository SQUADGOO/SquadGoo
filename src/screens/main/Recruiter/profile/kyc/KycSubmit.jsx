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

const KycSubmit = () => {
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

  const personalInfo = [
    {label: 'Full Name:', value: 'John Doe'},
    {label: 'NRIC:', value: 'JG12345678'},
    {label: 'Nationality:', value: 'USA'},
    {label: 'Occupation:', value: 'Software Engineer'},
  ];

  const businessInfo = [
    {label: 'Business Name:', value: 'ABC Solutions'},
    {label: 'Registration:', value: 'BR123456'},
    {label: 'Type:', value: 'IT Services'},
    {label: 'Years Operating:', value: '5'},
  ];

  const documentStatus = [
    {label: 'NRIC/Passport', value: 'pending'},
    {label: 'Selfie with ID', value: 'pending'},
    {label: 'Proof of Address', value: 'pending'},
    {label: 'Business Registration', value: 'pending'},
    {label: 'Tax Certificate', value: 'pending'},
  ];

  const InfoCard = ({title, data}) => (
    <View style={styles.card}>
      <AppText variant={Variant.bodybold} style={styles.cardTitle}>
        {title}
      </AppText>
      {data.map((item, idx) => (
        <View key={idx} style={styles.cardRow}>
          <AppText variant={Variant.caption} style={styles.cardLabel}>
            {item.label}
          </AppText>
          <AppText variant={Variant.bodybold} style={styles.cardValue}>
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );

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
            <AppText
              variant={Variant.caption}
              color={colors.primary}
              style={{
                textAlign: 'left',
                marginBottom: 15,
              }}>
              Personal KYC
            </AppText>
            <AppText
              variant={Variant.caption}
              color={colors.primary}
              style={{
                textAlign: 'left',
                marginBottom: 15,
              }}>
              Documents
            </AppText>
            <AppText
              variant={Variant.caption}
              color={colors.primary}
              style={{
                textAlign: 'left',
                marginBottom: 15,
              }}>
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

          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Personal Information
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            Provide your personal details for identity verification
          </AppText>

          <InfoCard title="Personal Information" data={personalInfo} />
          <InfoCard title="Business Information" data={businessInfo} />
          <InfoCard title="Document Status" data={documentStatus} />

          <View
            style={{
              height: hp(13),
              width: wp(90),
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.primary,
              marginVertical: hp(2),
              padding: 10,
              backgroundColor:'#fef5ec',
              gap:hp(1)
            }}>
            <AppText variant={Variant.bodybold} color={colors.primary}>
              Important Notice
            </AppText>
            <AppText variant={Variant.caption} color={colors.primary}>
              By submitting this application, you confirm that all information
              provided is accurate and complete. False information may result in
              account suspension.
            </AppText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <AppButton
              onPress={() =>
                navigation.navigate('DrawerNavigator', {
                  screen: screenNames.KYC_KYB_DOC,
                })
              }
              text="Submit for Verification"
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                width: wp(90),
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

export default KycSubmit;

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: colors.text1,
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
  card: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: wp(3),
    marginBottom: hp(2),
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: hp(1),
    color: colors.text1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.8),
  },
  cardLabel: {color: colors.text},
  cardValue: {color: colors.text},
  noticeCard: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 8,
    padding: wp(3),
    marginBottom: hp(3),
  },
});
