// screens/KycReview.tsx
import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { updateUserFields } from '@/store/authSlice';
import AppButton from '@/core/AppButton';
import { screenNames } from '@/navigation/screenNames';

const KycSubmit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const saved = userInfo?.kycKyb || {};
  const uploads = saved?.uploads || {};

  const isRecruiter = ((role || '').toString().toLowerCase() === 'recruiter');

  const fullName = useMemo(() => {
    if (userInfo?.name) return userInfo.name;
    const first = userInfo?.firstName || '';
    const last = userInfo?.lastName || '';
    return `${first} ${last}`.trim();
  }, [userInfo]);

  const docStatus = (val) => (val ? 'uploaded' : 'missing');

  const handleSubmit = () => {
    // This repo currently has no backend submit endpoint wired here.
    // Store a simple flag and notify user.
    dispatch(updateUserFields({ kycKyb: { ...saved, submittedAt: new Date().toISOString() } }));
    showToast('Verification submitted successfully', 'Success', toastTypes.success);

    const normalizedRole = (role || '').toString().toLowerCase();
    const baseRoute =
      normalizedRole === 'recruiter'
        ? screenNames.DRAWER_NAVIGATION
        : normalizedRole === 'jobseeker'
        ? screenNames.JOBSEEKER_DRAWER
        : screenNames.MAIN_NAVIGATION;

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: baseRoute }, { name: screenNames.PROFILE }],
      })
    );
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <AppHeader showTopIcons={false} title={isRecruiter ? 'KYC & KYB Review' : 'KYC Review'} />

      <View style={styles.container}>
        {/* Title */}
        <AppText variant={Variant.h2} style={styles.title}>
          {isRecruiter ? 'KYC & KYB Verification' : 'KYC Verification'}
        </AppText>
        <AppText variant={Variant.body} style={styles.subtitle}>
          Review your information and submit for verification
        </AppText>

        {isRecruiter && (
          <>
            <View style={styles.progressRow}>
              <AppText style={styles.progressText}>Overall Progress</AppText>
              <AppText style={styles.progressText}>0% Complete</AppText>
            </View>
            <View style={styles.progressBar} />

            <View style={styles.stepperContainer}>
              <View style={styles.labelsRow}>
                {['Personal KYC', 'Business KYB', 'Documents', 'Review'].map((tab) => (
                  <AppText key={tab} style={[styles.stepLabel, styles.activeLabel]}>
                    {tab}
                  </AppText>
                ))}
              </View>
              <View style={styles.dotsRow}>
                {['1', '2', '3', '4'].map((_, index, arr) => (
                  <React.Fragment key={index}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                    {index < arr.length - 1 && (
                      <View style={[styles.line, { backgroundColor: colors.primary }]} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          </>
        )}

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
            <AppText style={styles.value}>{fullName || '—'}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Date of Birth:</AppText>
            <AppText style={styles.value}>{userInfo?.dateOfBirth || '—'}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Email:</AppText>
            <AppText style={styles.value}>{userInfo?.email || '—'}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Phone:</AppText>
            <AppText style={styles.value}>{userInfo?.contactNumber || userInfo?.phone || '—'}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Passport/Driver Licence:</AppText>
            <AppText style={styles.value}>{saved?.personal?.passport_or_driver_licence || '—'}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Position in Business:</AppText>
            <AppText style={styles.value}>{saved?.personal?.position_in_business || '—'}</AppText>
          </View>
        </View>

        {isRecruiter && (
          <View style={styles.infoCard}>
            <AppText style={styles.cardTitle}>Business Information</AppText>
            <View style={styles.row}>
              <AppText style={styles.label}>Business Name:</AppText>
              <AppText style={styles.value}>{saved?.business?.business_name || '—'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>ABN/ACN:</AppText>
              <AppText style={styles.value}>{saved?.business?.abn_or_acn || '—'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Business Type:</AppText>
              <AppText style={styles.value}>{saved?.business?.business_type || '—'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Years of Operation:</AppText>
              <AppText style={styles.value}>{saved?.business?.years_of_operation || '—'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Business Address:</AppText>
              <AppText style={styles.value}>{saved?.business?.business_address || '—'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Annual Revenue (AUD):</AppText>
              <AppText style={styles.value}>{saved?.business?.annual_revenue_aud || '—'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Website:</AppText>
              <AppText style={styles.value}>{saved?.business?.website || '—'}</AppText>
            </View>
          </View>
        )}

        {/* Document Status */}
        <View style={styles.infoCard}>
          <AppText style={styles.cardTitle}>Document Status</AppText>
          <View style={styles.row}>
            <AppText style={styles.label}>Government-issued Photo ID</AppText>
            <View style={styles.statusBox}>
              <AppText style={styles.statusText}>{docStatus(uploads.govt_photo_id)}</AppText>
            </View>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Selfie with ID</AppText>
            <View style={styles.statusBox}>
              <AppText style={styles.statusText}>{docStatus(uploads.selfie_with_id)}</AppText>
            </View>
          </View>

          {isRecruiter && (
            <>
              <View style={styles.row}>
                <AppText style={styles.label}>ABN/ACN Certificate</AppText>
                <View style={styles.statusBox}>
                  <AppText style={styles.statusText}>{docStatus(uploads.abn_acn_certificate)}</AppText>
                </View>
              </View>
              {!uploads.govt_photo_id && (
                <View style={styles.row}>
                  <AppText style={styles.label}>Director/Rep Photo ID</AppText>
                  <View style={styles.statusBox}>
                    <AppText style={styles.statusText}>{docStatus(uploads.director_photo_id)}</AppText>
                  </View>
                </View>
              )}
              <View style={styles.row}>
                <AppText style={styles.label}>Proof of Business Address</AppText>
                <View style={styles.statusBox}>
                  <AppText style={styles.statusText}>{docStatus(uploads.proof_of_business_address)}</AppText>
                </View>
              </View>
              <View style={styles.row}>
                <AppText style={styles.label}>Proof type</AppText>
                <AppText style={styles.value}>{saved?.documents?.proof_of_business_address_type || '—'}</AppText>
              </View>
              {saved?.documents?.proof_of_business_address_type === 'Other government or financial document (please specify)' ? (
                <View style={styles.row}>
                  <AppText style={styles.label}>Other specify</AppText>
                  <AppText style={styles.value}>{saved?.documents?.proof_of_business_address_other || '—'}</AppText>
                </View>
              ) : null}
            </>
          )}
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
        <AppButton
          text="Submit for Verification"
          bgColor={colors.primary}
          textColor="#FFFFFF"
          onPress={handleSubmit}
          style={{ marginBottom: hp(5) }}
        />
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
