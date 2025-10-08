// screens/KycVerification.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { Icons } from '@/assets';
import { screenNames } from '@/navigation/screenNames';

const KycVerification = () => {
  const navigation = useNavigation();

  const uploadFields = [
    {label: 'NRIC/Passport'},
    {label: 'Selfie with ID'},
    {label: 'Proof of Address'},
    {label: 'Business Registration'},
    {label: 'Tax Certificate'},
  ];

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <AppHeader showTopIcons={false} title="KYC/KYB Verification" />

      <View style={styles.container}>
        {/* Title */}
        <AppText variant={Variant.h2} style={styles.title}>
          KYC & KYB Verification
        </AppText>
        <AppText variant={Variant.body} style={styles.subtitle}>
          Complete your identity and business verification
        </AppText>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <AppText style={styles.progressText}>Overall Progress</AppText>
          <AppText style={styles.progressText}>0% Complete</AppText>
        </View>
        <View style={styles.progressBar} />

        {/* Stepper */}
        <View style={styles.stepperContainer}>
          {/* Labels */}
          <View style={styles.labelsRow}>
            {['Personal KYC', 'Business KYC', 'Documents', 'Review'].map(
              (tab, index) => (
                <AppText
                  key={tab}
                  style={[
                    styles.stepLabel,
                    index < 3 ? styles.activeLabel : styles.inactiveLabel,
                  ]}>
                  {tab}
                </AppText>
              ),
            )}
          </View>

          {/* Dots & lines */}
          <View style={styles.dotsRow}>
            {['1', '2', '3', '4'].map((_, index, arr) => (
              <React.Fragment key={index}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index < 3 ? colors.primary : '#D9D9D9',
                    },
                  ]}
                />
                {index < arr.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      {
                        backgroundColor:
                          index < 2 ? colors.primary : '#D9D9D9',
                      },
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Section Title */}
        <AppText variant={Variant.h3} style={styles.sectionTitle}>
          Document Upload
        </AppText>
        <AppText variant={Variant.body} style={styles.sectionSubtitle}>
          Upload required documents for verification. All documents must be
          clear and readable.
        </AppText>

        {/* Upload Fields */}
        {uploadFields.map((field, index) => (
          <View key={index} style={styles.uploadBox}>
            <AppText style={styles.uploadLabel}>{field.label}</AppText>
            <View style={styles.uploadArea}>
            <Image style={styles.save} source={Icons.save}/>

              <AppText style={styles.uploadText}>
                Drag and drop your file here, or click to browse
              </AppText>
              <TouchableOpacity style={styles.chooseFileButton}>
                <AppText style={styles.chooseFileText}>Choose File</AppText>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.prevButton}>
            <AppText style={styles.prevText}>Previous</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate(screenNames.KYC_KYB_SUBMIT)} style={styles.nextButton}>
            <AppText style={styles.nextText}>Next</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default KycVerification;

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
  },
  title: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    marginBottom: hp(0.5),
    color: colors.black,
  },
  subtitle: {
    color: '#6C7A92',
    marginBottom: hp(2.5),
    fontSize: getFontSize(13),
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  progressText: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 2,
    marginBottom: hp(3),
  },

  stepperContainer: {
    marginTop: 4,
    marginBottom: hp(3),
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#FF8C00',
  },
  inactiveLabel: {
    color: '#C0C0C0',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    height: 2,
    flex: 1,
  },

  sectionTitle: {
    fontSize: getFontSize(15),
    fontWeight: '700',
    marginBottom: hp(0.5),
    color: '#3B2E57',
  },
  sectionSubtitle: {
    color: '#6C7A92',
    marginBottom: hp(2),
    fontSize: getFontSize(12),
  },

  uploadBox: {
    marginBottom: hp(2),
  },
  uploadLabel: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    marginBottom: hp(1),
    color: '#3B2E57',
  },
  uploadArea: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
    textAlign: 'center',
    marginBottom: hp(2),
    marginTop: hp(2),
  },
  chooseFileButton: {
    borderWidth: 1,
    borderColor: '#A0A0A0',
    borderRadius: 6,
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
  },
  chooseFileText: {
    fontSize: getFontSize(13),
    color: '#3B2E57',
    fontWeight: '500',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(4),
  },
  prevButton: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.8),
  },
  prevText: {
    color: '#FF8C00',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.8),
  },
  nextText: {
    color: '#fff',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  save:{
    height:38,
    width:38,
  }
});
