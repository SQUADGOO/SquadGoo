// screens/KycBusiness.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import OptionSelector from '@/components/OptionSelector';
import { BUSINESS_TYPES } from '@/utilities/appData';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { updateUserFields } from '@/store/authSlice';

const KycBusiness = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const saved = userInfo?.kycKyb || {};

  const isRecruiter = ((role || '').toString().toLowerCase() === 'recruiter');

  const methods = useForm({
    defaultValues: {
      business_name: saved?.business?.business_name || '',
      abn_or_acn: saved?.business?.abn_or_acn || '',
      business_type: saved?.business?.business_type || '',
      years_of_operation: saved?.business?.years_of_operation || '',
      business_address: saved?.business?.business_address || '',
      annual_revenue_aud: saved?.business?.annual_revenue_aud || '',
      website: saved?.business?.website || '',
    },
    mode: 'onChange',
  });

  const businessTypeValue = methods.watch('business_type');

  const handleNext = methods.handleSubmit((formValues) => {
    if (!isRecruiter) {
      showToast('Business verification is only required for recruiter accounts.', 'Info', toastTypes.info);
      navigation.navigate(screenNames.KYC_KYB_SUBMIT);
      return;
    }

    if (!formValues.business_type) {
      showToast('Please select Business Type', 'Missing field', toastTypes.error);
      return;
    }

    const merged = {
      ...saved,
      business: {
        business_name: formValues.business_name,
        abn_or_acn: formValues.abn_or_acn,
        business_type: formValues.business_type,
        years_of_operation: formValues.years_of_operation,
        business_address: formValues.business_address,
        annual_revenue_aud: formValues.annual_revenue_aud,
        website: formValues.website,
      },
    };

    dispatch(updateUserFields({ kycKyb: merged }));
    navigation.navigate(screenNames.KYC_KYB_DOC);
  });

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <AppHeader showTopIcons={false} title="KYB Verification" />

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

        {/* Tabs */}
     <View style={styles.stepperContainer}>
  {/* ===== Row 1: Labels ===== */}
  <View style={styles.labelsRow}>
    {['Personal KYC', 'Business KYC', 'Documents', 'Review'].map((tab, index) => (
      <AppText
        key={tab}
        style={[
          styles.stepLabel,
        (index === 0 || index === 1) ? styles.activeLabel : styles.inactiveLabel,
        ]}>
        {tab}
      </AppText>
    ))}
  </View>

  {/* ===== Row 2: Dots + Lines ===== */}
  <View style={styles.dotsRow}>
    {['Personal KYC', 'Business KYC', 'Documents', 'Review'].map((_, index, arr) => (
      <React.Fragment key={index}>
        {/* Dot */}
        <View
          style={[
            styles.dot,
            { backgroundColor: (index === 0 || index === 1) ? colors.primary : '#D9D9D9' },
          ]}
        />
        {/* Line (not after last dot) */}
        {index < arr.length - 1 && (
        <View
  style={[
    styles.line,
    { backgroundColor: (index === 0 || index === 1) ? colors.primary : '#D9D9D9' },
  ]}
/>

        )}
      </React.Fragment>
    ))}
  </View>
</View>


        {/* Section Title */}
        <AppText variant={Variant.h3} style={styles.sectionTitle}>
          Business/Company Verification (KYB)
        </AppText>
        <AppText variant={Variant.body} style={styles.sectionSubtitle}>
          Provide your business details for company verification
        </AppText>

        <FormProvider {...methods}>
          <FormField
            name="business_name"
            label="Business Name (must match ABN/ACN)*"
            placeholder="Enter business name"
            rules={{ required: 'Business name is required' }}
          />

          <FormField
            name="abn_or_acn"
            label="ABN or ACN*"
            placeholder="Enter ABN or ACN"
            rules={{ required: 'ABN/ACN is required' }}
            keyboardType="default"
          />

          <AppText variant={Variant.boldCaption} style={styles.dropdownLabel}>
            Business Type*
          </AppText>
          <OptionSelector
            options={BUSINESS_TYPES}
            selectedValue={businessTypeValue}
            onSelect={(val) => methods.setValue('business_type', val, { shouldValidate: true })}
            placeholder="Select business type"
            sheetTitle="Select Business Type"
          />
          {methods.formState.errors?.business_type?.message ? (
            <AppText style={styles.errorText}>{methods.formState.errors.business_type.message}</AppText>
          ) : null}

          <FormField
            name="years_of_operation"
            label="Years of Operation*"
            placeholder="Enter years of operation"
            keyboardType="numeric"
            rules={{
              required: 'Years of operation is required',
              pattern: { value: /^\d+$/, message: 'Numbers only' },
            }}
          />

          <FormField
            name="business_address"
            label="Business Address*"
            placeholder="Enter business address"
            rules={{ required: 'Business address is required' }}
          />

          <FormField
            name="annual_revenue_aud"
            label="Annual Revenue (AUD) (optional)"
            placeholder="Enter annual revenue"
            keyboardType="numeric"
          />

          <FormField
            name="website"
            label="Website (optional)"
            placeholder="https://"
            keyboardType="url"
          />
        </FormProvider>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <AppButton
            text="Previous"
            secondary
            bgColor={colors.white}
            textStyle={{ color: colors.primary }}
            style={styles.prevButton}
            onPress={() => navigation.navigate(screenNames.KYC_KYB)}
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
  );
};

export default KycBusiness;

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
  dropdownLabel: {
    marginBottom: hp(1),
    color: '#3B2E57',
  },
  errorText: {
    color: colors.red,
    marginBottom: hp(1),
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
