// screens/KycDocument.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { Icons } from '@/assets';
import { screenNames } from '@/navigation/screenNames';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import ImagePickerSheet from '@/components/ImagePickerSheet';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserFields } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import AddressProofSelector from '@/components/AddressProofSelector';
import { BUSINESS_ADDRESS_PROOF_OPTIONS } from '@/utilities/appData';
import AppInputField from '@/core/AppInputField';
import AppButton from '@/core/AppButton';

const KycDocument = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const saved = userInfo?.kycKyb || {};
  const uploads = saved?.uploads || {};

  const isRecruiter = ((role || '').toString().toLowerCase() === 'recruiter');
  const sheetRef = useRef(null);
  const [activeUploadKey, setActiveUploadKey] = useState(null);
  const [proofType, setProofType] = useState(saved?.documents?.proof_of_business_address_type || '');
  const [otherSpecify, setOtherSpecify] = useState(saved?.documents?.proof_of_business_address_other || '');

  const shouldAskDirectorId = !uploads?.govt_photo_id;

  const getAssetName = (asset) => {
    if (!asset) return '';
    if (asset.fileName) return asset.fileName;
    if (asset.uri) return asset.uri.split('/').pop() || '';
    return '';
  };

  const openUpload = (key) => {
    setActiveUploadKey(key);
    sheetRef.current?.open();
  };

  const handleUploadSelect = (asset) => {
    if (!activeUploadKey) return;
    const next = {
      ...uploads,
      [activeUploadKey]: asset || null,
    };
    dispatch(updateUserFields({ kycKyb: { ...saved, uploads: next } }));
  };

  const handleNext = () => {
    if (!isRecruiter) {
      navigation.navigate(screenNames.KYC_KYB_SUBMIT);
      return;
    }

    if (!uploads.abn_acn_certificate) {
      showToast('Please upload ABN/ACN Certificate', 'Missing document', toastTypes.error);
      return;
    }

    if (shouldAskDirectorId && !uploads.director_photo_id) {
      showToast('Please upload Director/Representative Photo ID', 'Missing document', toastTypes.error);
      return;
    }

    if (!proofType) {
      showToast('Please select Proof of Business Address type', 'Missing field', toastTypes.error);
      return;
    }

    if (proofType === 'Other government or financial document (please specify)' && !otherSpecify.trim()) {
      showToast('Please specify the “Other” document type', 'Missing field', toastTypes.error);
      return;
    }

    if (!uploads.proof_of_business_address) {
      showToast('Please upload Proof of Business Address', 'Missing document', toastTypes.error);
      return;
    }

    dispatch(
      updateUserFields({
        kycKyb: {
          ...saved,
          documents: {
            proof_of_business_address_type: proofType,
            proof_of_business_address_other: otherSpecify.trim(),
          },
        },
      }),
    );

    navigation.navigate(screenNames.KYC_KYB_SUBMIT);
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
        {/* Header */}
        <AppHeader showTopIcons={false} title={isRecruiter ? 'KYB Documents' : 'KYC Documents'} />

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
          Mandatory Documents
        </AppText>
        <AppText variant={Variant.body} style={styles.sectionSubtitle}>
          Upload clear and readable documents.
        </AppText>

        {isRecruiter && (
          <>
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={() => openUpload('abn_acn_certificate')}>
              <AppText style={styles.uploadLabel}>ABN/ACN Certificate*</AppText>
              <View style={styles.uploadArea}>
                <Image style={styles.save} source={Icons.save} />
                {getAssetName(uploads?.abn_acn_certificate) ? (
                  <View style={styles.selectedRow}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="checkmark-circle"
                      size={18}
                      color={colors.green}
                    />
                    <AppText
                      style={styles.selectedFileName}
                      numberOfLines={1}
                    >
                      {getAssetName(uploads?.abn_acn_certificate)}
                    </AppText>
                  </View>
                ) : (
                  <AppText style={styles.uploadText}>
                    Tap to upload proof of business registration
                  </AppText>
                )}
              </View>
            </TouchableOpacity>

            {shouldAskDirectorId && (
              <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={() => openUpload('director_photo_id')}>
                <AppText style={styles.uploadLabel}>Director/Representative’s Photo ID*</AppText>
                <View style={styles.uploadArea}>
                  <Image style={styles.save} source={Icons.save} />
                  {getAssetName(uploads?.director_photo_id) ? (
                    <View style={styles.selectedRow}>
                      <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="checkmark-circle"
                        size={18}
                        color={colors.green}
                      />
                      <AppText
                        style={styles.selectedFileName}
                        numberOfLines={1}
                      >
                        {getAssetName(uploads?.director_photo_id)}
                      </AppText>
                    </View>
                  ) : (
                    <AppText style={styles.uploadText}>
                      Tap to upload (if not already uploaded in KYC)
                    </AppText>
                  )}
                </View>
              </TouchableOpacity>
            )}

            <AppText style={styles.inputLabel}>Proof of Business Address (select one)*</AppText>
            <AddressProofSelector
              selectedValue={proofType}
              onSelect={setProofType}
              options={BUSINESS_ADDRESS_PROOF_OPTIONS}
              placeholder="Select proof type"
              sheetTitle="Select Proof of Business Address"
              userType="recruiter"
            />

            {proofType === 'Other government or financial document (please specify)' && (
              <AppInputField
                label="Other (please specify)"
                placeholder="Enter document type"
                value={otherSpecify}
                onChangeText={setOtherSpecify}
              />
            )}

            <View style={styles.warningBox}>
              <AppText style={styles.warningTitle}>Important</AppText>
              <AppText style={styles.warningText}>
                Must show business name and address. Must be dated within the last 3 months
                (except for annual documents like council rates, tax, registration).
              </AppText>
            </View>

            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={() => openUpload('proof_of_business_address')}>
              <AppText style={styles.uploadLabel}>Upload Proof of Business Address*</AppText>
              <View style={styles.uploadArea}>
                <Image style={styles.save} source={Icons.save} />
                {getAssetName(uploads?.proof_of_business_address) ? (
                  <View style={styles.selectedRow}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="checkmark-circle"
                      size={18}
                      color={colors.green}
                    />
                    <AppText
                      style={styles.selectedFileName}
                      numberOfLines={1}
                    >
                      {getAssetName(uploads?.proof_of_business_address)}
                    </AppText>
                  </View>
                ) : (
                  <AppText style={styles.uploadText}>
                    Tap to upload the selected proof document
                  </AppText>
                )}
              </View>
            </TouchableOpacity>
          </>
        )}

        {!isRecruiter && (
          <View style={styles.warningBox}>
            <AppText style={styles.warningTitle}>Note</AppText>
            <AppText style={styles.warningText}>
              Your required uploads are completed in the previous step (Government-issued Photo ID and Selfie with ID).
            </AppText>
          </View>
        )}

        {/* Buttons */}
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

export default KycDocument;

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
  inputLabel: {
    fontSize: getFontSize(13),
    fontWeight: '700',
    marginBottom: hp(1),
    color: '#3B2E57',
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
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(1.5),
  },
  selectedFileName: {
    color: colors.green,
    fontSize: getFontSize(12),
    maxWidth: wp(70),
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
  warningBox: {
    backgroundColor: '#FFF4E8',
    borderRadius: 8,
    padding: wp(4),
    marginBottom: hp(2),
  },
  warningTitle: {
    color: '#FF8C00',
    fontWeight: '700',
    marginBottom: hp(0.5),
    fontSize: getFontSize(13),
  },
  warningText: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
    lineHeight: 18,
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
  save:{
    height:38,
    width:38,
  }
});

