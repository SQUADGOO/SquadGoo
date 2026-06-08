// screens/KycVerification.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import AppInputField from '@/core/AppInputField';
import ImagePickerSheet from '@/components/ImagePickerSheet';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { updateUserFields } from '@/store/authSlice';

const KycVerification = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const saved = userInfo?.kycKyb || {};

  const isRecruiter = ((role || '').toString().toLowerCase() === 'recruiter');
  const sheetRef = useRef(null);
  const [activeUploadKey, setActiveUploadKey] = useState(null);

  const fullName = useMemo(() => {
    if (userInfo?.name) return userInfo.name;
    const first = userInfo?.firstName || '';
    const last = userInfo?.lastName || '';
    return `${first} ${last}`.trim();
  }, [userInfo]);

  const methods = useForm({
    defaultValues: {
      passport_or_driver_licence: saved?.personal?.passport_or_driver_licence || '',
      position_in_business: saved?.personal?.position_in_business || '',
    },
    mode: 'onChange',
  });

  const openUpload = (key) => {
    setActiveUploadKey(key);
    sheetRef.current?.open();
  };

  const getAssetName = (asset) => {
    if (!asset) return '';
    if (asset.fileName) return asset.fileName;
    if (asset.uri) return asset.uri.split('/').pop() || '';
    return '';
  };

  const handleUploadSelect = (asset) => {
    if (!activeUploadKey) return;
    const next = {
      ...(saved?.uploads || {}),
      [activeUploadKey]: asset || null,
    };
    dispatch(updateUserFields({ kycKyb: { ...saved, uploads: next } }));
  };

  const handleNext = methods.handleSubmit((formValues) => {
    const uploads = saved?.uploads || {};
    if (!uploads.govt_photo_id) {
      showToast('Please upload a government-issued Photo ID', 'Missing document', toastTypes.error);
      return;
    }
    if (!uploads.selfie_with_id) {
      showToast('Please upload a selfie with your ID', 'Missing document', toastTypes.error);
      return;
    }

    const merged = {
      ...saved,
      personal: {
        passport_or_driver_licence: formValues.passport_or_driver_licence,
        position_in_business: formValues.position_in_business,
      },
    };
    dispatch(updateUserFields({ kycKyb: merged }));

    if (isRecruiter) navigation.navigate(screenNames.KYC_BUSINESS);
    else navigation.navigate(screenNames.KYC_KYB_SUBMIT);
  });

  return (
    <>
      <AppHeader showTopIcons={false} title={isRecruiter ? 'KYB Verification' : 'KYC Verification'} />
      <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
        <View style={styles.container}>
          <AppText variant={Variant.h2} style={styles.title}>
            {isRecruiter ? 'KYC & KYB Verification' : 'KYC Verification'}
          </AppText>
          <AppText variant={Variant.body} style={styles.subtitle}>
            {isRecruiter
              ? 'Complete your identity and business verification'
              : 'Complete your identity verification'}
          </AppText>

          {isRecruiter && (
            <>
              <View style={styles.progressRow}>
                <AppText style={styles.progressText}>Overall Progress</AppText>
                <AppText style={styles.progressText}>0% Complete</AppText>
              </View>
              <View style={styles.progressBar} />
            </>
          )}

          <AppText variant={Variant.h3} style={styles.sectionTitle}>
            Personal Verification (KYC)
          </AppText>
          <AppText variant={Variant.body} style={styles.sectionSubtitle}>
            Review your profile details and complete the required verification fields.
          </AppText>

          {/* Read-only profile fields */}
          <AppInputField
            label="Full Name (as per ID)"
            value={fullName || '—'}
            editable={false}
          />
          <AppInputField
            label="Date of Birth"
            value={userInfo?.dateOfBirth || '—'}
            editable={false}
          />
          <AppInputField
            label="Contact Email"
            value={userInfo?.email || '—'}
            editable={false}
          />
          <AppInputField
            label="Phone Number"
            value={userInfo?.contactNumber || userInfo?.phone || '—'}
            editable={false}
          />

          <FormProvider {...methods}>
            <FormField
              name="passport_or_driver_licence"
              label="Passport Number / Driver Licence Number*"
              placeholder="Enter passport or driver licence number"
              rules={{ required: 'This field is required' }}
            />
            <FormField
              name="position_in_business"
              label="Position in Business*"
              placeholder="e.g., Director, Representative"
              rules={{ required: 'This field is required' }}
            />
          </FormProvider>

          <AppText variant={Variant.h3} style={styles.sectionTitle}>
            Mandatory uploads
          </AppText>
          <AppText variant={Variant.body} style={styles.sectionSubtitle}>
            Upload clear photos. All uploads are required.
          </AppText>

          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.8}
            onPress={() => openUpload('govt_photo_id')}
          >
            <AppText style={styles.uploadLabel}>Government-issued Photo ID*</AppText>
            {getAssetName(saved?.uploads?.govt_photo_id) ? (
              <View style={styles.selectedRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark-circle"
                  size={18}
                  color={colors.green}
                />
                <AppText style={styles.selectedFileName} numberOfLines={1}>
                  {getAssetName(saved?.uploads?.govt_photo_id)}
                </AppText>
              </View>
            ) : (
              <AppText style={styles.uploadHint}>
                Tap to upload (Australian Driver Licence or Passport)
              </AppText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.8}
            onPress={() => openUpload('selfie_with_id')}
          >
            <AppText style={styles.uploadLabel}>Selfie with ID*</AppText>
            {getAssetName(saved?.uploads?.selfie_with_id) ? (
              <View style={styles.selectedRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark-circle"
                  size={18}
                  color={colors.green}
                />
                <AppText style={styles.selectedFileName} numberOfLines={1}>
                  {getAssetName(saved?.uploads?.selfie_with_id)}
                </AppText>
              </View>
            ) : (
              <AppText style={styles.uploadHint}>Tap to upload</AppText>
            )}
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <AppButton
              text="Previous"
              secondary
              bgColor={colors.white}
              textStyle={{ color: colors.primary }}
              style={styles.prevButton}
              onPress={() => navigation.goBack()}
            />
            <AppButton
              text="Next"
              bgColor={colors.primary}
              textColor="#FFFFFF"
              style={styles.nextButton}
              onPress={handleNext}
            />
          </View>
        </View>
      </ScrollView>

      <ImagePickerSheet ref={sheetRef} onSelect={handleUploadSelect} />
    </>
  );
};

export default KycVerification;

const styles = StyleSheet.create({
  header: {
    height: hp(15),
    paddingHorizontal: wp(4),
    justifyContent: 'flex-end',
    paddingBottom: hp(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  headerTitle: {
    color: '#fff',
    fontSize: getFontSize(18),
    fontWeight: '600',
  },
  container: {
    padding: wp(5),
  },
  title: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    marginBottom: hp(0.5),
    color:colors.black
  },
  subtitle: {
    color: '#6C7A92',
    marginBottom: hp(2),
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
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: getFontSize(13),
    marginBottom: hp(0.5),
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#A0A0A0',
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: getFontSize(15),
    fontWeight: '700',
marginTop: hp(2), },
  sectionSubtitle: {
    color: '#6C7A92',
    marginBottom: hp(2),
    fontSize: getFontSize(12),

  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: hp(2),
    marginBottom: hp(2),
  },
  uploadLabel: {
    fontSize: getFontSize(13),
    fontWeight: '700',
    color: '#3B2E57',
  },
  uploadHint: {
    marginTop: hp(0.8),
    fontSize: getFontSize(12),
    color: '#6C7A92',
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(0.8),
  },
  selectedFileName: {
    color: colors.green,
    fontSize: getFontSize(12),
    maxWidth: wp(70),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(4),
    gap: wp(3),
  },
  prevButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  nextButton: {
    flex: 1,
  },

   stepperContainer: {
    marginTop: 10,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6, // gap between text and dots
    paddingHorizontal: 4,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#FF8C00', // orange
  },
  inactiveLabel: {
    color: '#C0C0C0', // gray
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:"95%"
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    height: 2,
    width: '25%',
  },
});
