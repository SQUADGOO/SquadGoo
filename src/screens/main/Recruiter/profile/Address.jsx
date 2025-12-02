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
import { updateUserFields } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { useAddFullAddress } from '@/api/jobSeeker/jobSeeker.query';

const Address = () => {
  const dispatch = useDispatch();
  const { mutateAsync: updateAddress, isPending } = useAddFullAddress();
  const userData = useSelector((state) => state.auth.userInfo);
  console.log('🏁 User Data in Address Screen:', userData?.fullAddress);
  const userInfo = userData
    // userData?.role === 'recruiter' ? userData?.recruiter : userData?.job_seeker;

  const methods = useForm({
    defaultValues: {
      fullAddress: userInfo?.address || '',
      country: userInfo?.country || '',
      state: userInfo?.state || '',
      suburb: userInfo?.suburb || '',
      unit: userInfo?.unit || '',
      houseNumber: userInfo?.houseNumber || '',
      streetName: userInfo?.streetName || '',
    },
  });

  const { handleSubmit } = methods;

  const handleSave = async (data) => {
    let res = await updateAddress(data);
    console.log('🏁 Address update response:', res);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Address Details" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>

          <View style={styles.formContainer}>
            <FormField
              name="fullAddress"
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
              name="unit"
              label="Unit No."
              placeholder="Enter your unit number"
            />
            <FormField
              name="houseNumber"
              label="House Number"
              placeholder="Enter your house number"
            />
            <FormField
              name="streetName"
              label="Street Name"
              placeholder="Enter your street name"
            />

            <AppButton
              isLoading={isPending}
              bgColor={colors.primary}
              text="Save Changes"
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
