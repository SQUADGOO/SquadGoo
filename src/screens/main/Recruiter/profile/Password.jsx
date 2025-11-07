import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useForm, FormProvider, set } from 'react-hook-form';
import { useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText from '@/core/AppText';
import AppButton from '@/core/AppButton';
import FormField from '@/core/FormField';
import { colors, hp, wp } from '@/theme';
import { useChangePassword } from '@/api/auth/auth.query';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const userData = useSelector((state) => state.auth.userInfo);
  const userId =
    userData?.role === 'recruiter' ? userData?.recruiter?.id : userData?.job_seeker?.id;

  // const { mutate: changePassword, isPending } = useChangePassword();

  const methods = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const { handleSubmit, watch, setError } = methods;
  const newPassword = watch('new_password');

  const handleSave = async (data) => {
    if (data.new_password !== data.confirm_password) {
      setError('confirm_password', { message: 'Passwords do not match' });
      return;
    }

    const payload = {
      id: userId,
      current_password: data.current_password,
      new_password: data.new_password,
    };

    setIsLoading(true);

    setTimeout(() => {
      showToast('Password updated successfully', 'Success', toastTypes.success);
      setIsLoading(false);
    }, 2000);

    console.log('🔐 Changing password:', payload);
    // await changePassword(payload);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Change Password" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>
          

          <FormField
            name="current_password"
            label="Current Password"
            placeholder="Enter your current password"
            secureTextEntry
            rules={{ required: 'Current password is required' }}
          />

          <FormField
            name="new_password"
            label="New Password"
            placeholder="Enter your new password"
            secureTextEntry
            rules={{
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
          />

          <FormField
            name="confirm_password"
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            secureTextEntry
            rules={{
              required: 'Please confirm your new password',
              validate: (value) =>
                value === newPassword || 'Passwords do not match',
            }}
          />

          <AppButton
            bgColor={colors.primary}
            text="Save Changes"
            isLoading={isLoading}
            onPress={handleSubmit(handleSave)}
            // style={styles.button}
          />
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

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
  subtitle: {
    color: colors.textSecondary,
    marginBottom: hp(3),
  },
  button: {
    marginTop: hp(3),
  },
});
