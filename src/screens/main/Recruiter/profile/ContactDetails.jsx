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

const ContactDetails = () => {
  const dispatch = useDispatch();
  const { mutate: updateJobSeekerProfile, isPending } = useUpdateJobSeekerProfile();
  const [isLoading, setIsLoading] = React.useState(false);
  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo =
    userData?.role === 'recruiter' ? userData?.recruiter : userData?.job_seeker;

  const methods = useForm({
    defaultValues: {
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
    },
  });

  const { handleSubmit } = methods;

  const handleSave = async (data) => {
    setIsLoading(true);
    const payload = { ...data, id: userInfo?.id };
    console.log('📞 Updating contact details:', payload);
    setTimeout(() => {
          dispatch(updateUserFields({ contactDetails: payload }));
          showToast('Address updated successfully', 'Success', toastTypes.success);
          setIsLoading(false);
        }, 2000);
    // await updateJobSeekerProfile(payload);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Contact Details" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>
          <AppText style={styles.sectionTitle}>Contact Information</AppText>

          <View style={styles.formContainer}>
            <FormField
              name="email"
              label="Email Address*"
              placeholder="Enter your email"
              keyboardType="email-address"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email address',
                },
              }}
            />

            <FormField
              name="phone"
              label="Phone Number*"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              rules={{ required: 'Phone number is required' }}
            />

            <AppButton
              bgColor={colors.primary}
              text="Save Changes"
              isLoading={isLoading}
              onPress={handleSubmit(handleSave)}
              // style={styles.button}
            />
          </View>
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default ContactDetails;

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
