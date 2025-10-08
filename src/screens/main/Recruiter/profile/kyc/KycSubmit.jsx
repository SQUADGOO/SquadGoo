// screens/KycReview.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';

const KycSubmit = () => {
  const navigation = useNavigation();

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

        {/* Progress */}
        <View style={styles.progressRow}>
          <AppText style={styles.progressText}>Overall Progress</AppText>
          <AppText style={styles.progressText}>0% Complete</AppText>
        </View>
        <View style={styles.progressBar} />

        {/* Stepper */}
        <View style={styles.stepperContainer}>
          <View style={styles.labelsRow}>
            {['Personal KYC', 'Business KYC', 'Documents', 'Review'].map(
              (tab, index) => (
                <AppText
                  key={tab}
                  style={[
                    styles.stepLabel,
                    index <= 3 ? styles.activeLabel : styles.inactiveLabel,
                  ]}>
                  {tab}
                </AppText>
              ),
            )}
          </View>

          <View style={styles.dotsRow}>
            {['1', '2', '3', '4'].map((_, index, arr) => (
              <React.Fragment key={index}>
                <View
                  style={[
                    styles.dot,
                    {backgroundColor: index <= 3 ? colors.primary : '#D9D9D9'},
                  ]}
                />
                {index < arr.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      {backgroundColor: index <= 2 ? colors.primary : '#D9D9D9'},
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Section Title */}
        <AppText variant={Variant.h3} style={styles.sectionTitle}>
          Review & Submit
        </AppText>
        <AppText variant={Variant.body} style={styles.sectionSubtitle}>
          Review your information and submit for verification
        </AppText>

        {/* Personal Info */}
        <View style={styles.infoCard}>
          <AppText style={styles.cardTitle}>Personal Information</AppText>
          <View style={styles.row}>
            <AppText style={styles.label}>Full Name:</AppText>
            <AppText style={styles.value}>John Doe</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>NRIC:</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Nationality:</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Occupation:</AppText>
          </View>
        </View>

        {/* Business Info */}
        <View style={styles.infoCard}>
          <AppText style={styles.cardTitle}>Business Information</AppText>
          <View style={styles.row}>
            <AppText style={styles.label}>Business Name:</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Registration:</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Type:</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Years Operating:</AppText>
          </View>
        </View>

        {/* Document Status */}
        <View style={styles.infoCard}>
          <AppText style={styles.cardTitle}>Document Status</AppText>
          {[
            'NRIC/Passport',
            'Selfie with ID',
            'Proof of Address',
            'Business Registration',
            'Tax Certificate',
          ].map((doc, index) => (
            <View key={index} style={styles.row}>
              <AppText style={styles.label}>{doc}</AppText>
              <View style={styles.statusBox}>
                <AppText style={styles.statusText}>pending</AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Notice */}
        <View style={styles.noticeBox}>
          <AppText style={styles.noticeTitle}>Important Notice</AppText>
          <AppText style={styles.noticeText}>
            By submitting this application, you confirm that all information
            provided is accurate and complete. False information may result in
            account suspension.
          </AppText>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <AppText style={styles.submitText}>Submit for Verification</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default KycSubmit;

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

  infoCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(2),
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: getFontSize(13),
    fontWeight: '700',
    color: '#6C2E85',
    marginBottom: hp(1.5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  label: {
    fontSize: getFontSize(13),
    color: '#333',
  },
  value: {
    fontSize: getFontSize(13),
    color: '#000',
    fontWeight: '500',
  },

  statusBox: {
    borderWidth: 1,
    borderColor: '#A0A0A0',
    borderRadius: 6,
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
  },
  statusText: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
  },

  noticeBox: {
    backgroundColor: '#FFF4E8',
    borderRadius: 8,
    padding: wp(4),
    marginVertical: hp(2),
  },
  noticeTitle: {
    color: '#FF8C00',
    fontWeight: '700',
    marginBottom: hp(0.5),
    fontSize: getFontSize(14),
  },
  noticeText: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
    lineHeight: 18,
  },

  submitButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    paddingVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(5),
  },
  submitText: {
    color: '#fff',
    fontSize: getFontSize(15),
    fontWeight: '600',
  },
});
