import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText from '@/core/AppText';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import { colors, hp, wp } from '@/theme';
import { useUpdateJobSeekerProfile } from '@/api/auth/auth.query';

const Address = () => {
  const dispatch = useDispatch();
  const { mutate: updateJobSeekerProfile, isPending } = useUpdateJobSeekerProfile();

  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo =
    userData?.role === 'recruiter' ? userData?.recruiter : userData?.job_seeker;

  const methods = useForm({
    defaultValues: {
      full_address: userInfo?.address || '',
      country: userInfo?.country || '',
      state: userInfo?.state || '',
      suburb: userInfo?.suburb || '',
      unit_no: userInfo?.unit_no || '',
      house_number: userInfo?.house_number || '',
      street_name: userInfo?.street_name || '',
    },
  });

  const { handleSubmit } = methods;

  const handleSave = async (data) => {
    const payload = { ...data, id: userInfo?.id };
    console.log('📦 Submitting address:', payload);
    await updateJobSeekerProfile(payload);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Address Details" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>

          <View style={styles.formContainer}>
            <FormField
              name="full_address"
              label="Full Address*"
              placeholder="Enter your full address"
              rules={{ required: 'Full address is required' }}
            />
            <FormField
              name="country"
              label="Country*"
              placeholder="Enter your country"
              rules={{ required: 'Country is required' }}
            />
            <FormField
              name="state"
              label="State*"
              placeholder="Enter your state"
              rules={{ required: 'State is required' }}
            />
            <FormField
              name="suburb"
              label="Suburb*"
              placeholder="Enter your suburb"
              rules={{ required: 'Suburb is required' }}
            />
            <FormField
              name="unit_no"
              label="Unit No."
              placeholder="Enter your unit number"
            />
            <FormField
              name="house_number"
              label="House Number"
              placeholder="Enter your house number"
            />
            <FormField
              name="street_name"
              label="Street Name"
              placeholder="Enter your street name"
            />

            <AppButton
              bgColor={colors.primary}
              text="Save Changes"
              isLoading={isPending}
              onPress={handleSubmit(handleSave)}
              style={styles.button}
            />
          </View>
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default Address;

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
