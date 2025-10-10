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

const TaxInformation = () => {
  const dispatch = useDispatch();
  const { mutate: updateJobSeekerProfile, isPending } = useUpdateJobSeekerProfile();

  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo =
    userData?.role === 'recruiter' ? userData?.recruiter : userData?.job_seeker;

  const methods = useForm({
    defaultValues: {
      tax_file_number: userInfo?.tax_file_number || '',
      abn_number: userInfo?.abn_number || '',
      superannuation_fund: userInfo?.superannuation_fund || '',
      super_member_number: userInfo?.super_member_number || '',
    },
  });

  const { handleSubmit } = methods;

  const handleSave = async (data) => {
    const payload = { ...data, id: userInfo?.id };
    console.log('💰 Updating tax info:', payload);
    await updateJobSeekerProfile(payload);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Tax Information" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>
          <AppText style={styles.sectionTitle}>Australian Tax & Payment Info</AppText>

          <View style={styles.formContainer}>
            <FormField
              name="tax_file_number"
              label="Tax File Number (TFN)*"
              placeholder="Enter your TFN"
              rules={{
                required: 'Tax File Number is required',
                minLength: { value: 8, message: 'Must be at least 8 digits' },
              }}
              keyboardType="number-pad"
            />

            <FormField
              name="abn_number"
              label="ABN (Australian Business Number)"
              placeholder="Enter your ABN (if applicable)"
              keyboardType="number-pad"
            />

            <FormField
              name="superannuation_fund"
              label="Superannuation Fund"
              placeholder="Enter your super fund name"
            />

            <FormField
              name="super_member_number"
              label="Super Member Number"
              placeholder="Enter your super member number"
            />

            <AppButton
              bgColor={colors.primary}
              text="Save Tax Information"
              isLoading={isPending}
              onPress={handleSubmit(handleSave)}
              // style={styles.button}
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
