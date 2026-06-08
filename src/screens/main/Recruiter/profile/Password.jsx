import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import AppHeader from '@/core/AppHeader';
import AppText from '@/core/AppText';
import AppButton from '@/core/AppButton';
import FormField from '@/core/FormField';
import { colors, hp, wp } from '@/theme';
import { useChangePassword } from '@/api/auth/auth.query';

const ChangePassword = () => {
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const methods = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const { handleSubmit, reset, watch, setError } = methods;
  const newPassword = watch('new_password');

  const handleSave = async (data) => {
    try {
      await changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      reset();
    } catch (err) {
      // Surface a wrong-current-password inline; other failures are toasted by the hook.
      if (err?.response?.data?.error?.code === 'INVALID_CURRENT_PASSWORD') {
        setError('current_password', { message: 'Current password is incorrect.' });
      }
    }
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
            type="passwordInput"
            rules={{ required: 'Current password is required' }}
          />

          <FormField
            name="new_password"
            label="New Password"
            placeholder="Enter your new password"
            type="passwordInput"
            rules={{
              required: 'New password is required',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                message:
                  'Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.',
              },
            }}
          />

          <AppText style={styles.passwordHint}>
            Password must be at least 8 characters and include a mix of uppercase, lowercase, numbers, and symbols.
          </AppText>

          <FormField
            name="confirm_password"
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            type="passwordInput"
            rules={{
              required: 'Please confirm your new password',
              validate: (value) =>
                value === newPassword || 'Passwords do not match',
            }}
          />

          <AppButton
            bgColor={colors.primary}
            text="Save Changes"
            isLoading={isPending}
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
  passwordHint: {
    color: colors.textSecondary,
    marginTop: -hp(1.2),
    marginBottom: hp(2),
    fontSize: 12,
  },
  button: {
    marginTop: hp(3),
  },
});
