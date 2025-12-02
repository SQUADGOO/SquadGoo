import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import AppText from '@/core/AppText';
import { colors, hp, wp } from '@/theme';
import { useUpdateJobSeekerProfile } from '@/api/auth/auth.query';
import { updateUserFields } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { refreshUserData } from '@/utilities/refreshUserData';
import { useAddTaxInfo } from '@/api/jobSeeker/jobSeeker.query';

const TaxInformation = () => {
  const { mutateAsync: updateTaxInfo, isPending } = useAddTaxInfo();

  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo = userData?.taxInformation || {};

  const methods = useForm({
    defaultValues: {
      taxFileNumber: userInfo?.taxFileNumber || '',
      australianBusinessNumber: userInfo?.australianBusinessNumber || '',
      taxResidencyStatus: userInfo?.taxResidencyStatus || '',
    },
  });

  const { handleSubmit } = methods;

  const handleSave = async (data) => {
    try {
      const res = await updateTaxInfo(data);

    } catch (err) {
      console.log('❌ Tax info update error:', err);
      showToast('Failed to update tax information', 'Error', toastTypes.error);
  };
}

  return (
    <View style={styles.container}>
      <AppHeader title="Tax Information" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>
          <AppText style={styles.sectionTitle}>Australian Tax & Payment Info</AppText>

          <View style={styles.formContainer}>
            <FormField
              name="taxFileNumber"
              label="Tax File Number (TFN)*"
              placeholder="Enter your TFN"
              rules={{
                required: 'Tax File Number is required',
                minLength: { value: 8, message: 'Must be at least 8 digits' },
              }}
              keyboardType="number-pad"
            />

            <FormField
              name="australianBusinessNumber"
              label="ABN (Australian Business Number)"
              placeholder="Enter your ABN (if applicable)"
              keyboardType="number-pad"
            />

            <FormField
              name="taxResidencyStatus"
              label="Tax Residency Status"
              placeholder="Enter your tax residency status"
            />

            <AppButton
              bgColor={colors.primary}
              text="Save Tax Information"
              isLoading={isPending}
              onPress={handleSubmit(handleSave)}
            />
          </View>
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default TaxInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
    paddingBottom: hp(5),
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: hp(2),
  },
  formContainer: {
    flex: 1,
  },
  button: {
    marginTop: hp(3),
  },
});
