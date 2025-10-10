import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText from '@/core/AppText';
import AppButton from '@/core/AppButton';
import FormField from '@/core/FormField';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp } from '@/theme';
import { useUpdateJobSeekerProfile } from '@/api/auth/auth.query';

const defaultSocials = [
  { key: 'linkedin', label: 'LinkedIn', iconLib: iconLibName.AntDesign, icon: 'linkedin-square' },
  { key: 'facebook', label: 'Facebook', iconLib: iconLibName.FontAwesome, icon: 'facebook-square' },
  { key: 'instagram', label: 'Instagram', iconLib: iconLibName.AntDesign, icon: 'instagram' },
  { key: 'x', label: 'X (Twitter)', iconLib: iconLibName.FontAwesome6, icon: 'x-twitter' },
  { key: 'tiktok', label: 'TikTok', iconLib: iconLibName.FontAwesome6, icon: 'tiktok' },
  { key: 'youtube', label: 'YouTube', iconLib: iconLibName.AntDesign, icon: 'youtube' },
  { key: 'website', label: 'Website', iconLib: iconLibName.Feather, icon: 'globe' },
];

const SocialMedia = () => {
  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo =
    userData?.role === 'recruiter' ? userData?.recruiter : userData?.job_seeker;

  const { mutate: updateJobSeekerProfile, isPending } = useUpdateJobSeekerProfile();

  const [activeFields, setActiveFields] = useState(() => {
    // show any pre-filled ones automatically
    const existing = {};
    defaultSocials.forEach((s) => {
      if (userInfo?.[`${s.key}_url`]) existing[s.key] = true;
    });
    return existing;
  });

  const methods = useForm({
    defaultValues: {
      linkedin_url: userInfo?.linkedin_url || '',
      facebook_url: userInfo?.facebook_url || '',
      instagram_url: userInfo?.instagram_url || '',
      x_url: userInfo?.x_url || '',
      tiktok_url: userInfo?.tiktok_url || '',
      youtube_url: userInfo?.youtube_url || '',
      website_url: userInfo?.website_url || '',
    },
  });

  const { handleSubmit } = methods;

  const toggleField = (key) => {
    setActiveFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (data) => {
    const payload = { ...data, id: userInfo?.id };
    console.log('🌐 Saving social links:', payload);
    // await updateJobSeekerProfile(payload);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Social Media" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>
          <AppText style={styles.subTitle}>
            Add your social media profiles to showcase your online presence.
          </AppText>

          <View style={styles.socialContainer}>
            {defaultSocials.map((item) => (
              <View key={item.key} style={styles.socialItem}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    activeFields[item.key] && { backgroundColor: colors.primaryLight },
                  ]}
                  onPress={() => toggleField(item.key)}>
                  <VectorIcons
                    name={item.iconLib}
                    iconName={item.icon}
                    size={22}
                    color={activeFields[item.key] ? colors.primary : colors.text}
                  />
                  <AppText
                    style={[
                      styles.socialLabel,
                      activeFields[item.key] && { color: colors.primary },
                    ]}>
                    {item.label}
                  </AppText>
                </TouchableOpacity>

                {activeFields[item.key] && (
                  <FormField
                    name={`${item.key}_url`}
                    label={`${item.label} URL`}
                    placeholder={`Enter your ${item.label} profile link`}
                    keyboardType="url"
                    rules={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL',
                      },
                    }}
                    // style={styles.fieldContainer}
                  />
                )}
              </View>
            ))}
          </View>

          <AppButton
            bgColor={colors.primary}
            text="Save Social Links"
            isLoading={isPending}
            onPress={handleSubmit(handleSave)}
            style={styles.button}
          />
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default SocialMedia;

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
  subTitle: {
    color: colors.textSecondary,
    marginBottom: hp(2),
  },
  socialContainer: {
    marginTop: hp(1),
  },
  socialItem: {
    // marginBottom: hp(2.5),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    marginBottom: hp(1),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  socialLabel: {
    marginLeft: wp(2),
    color: colors.text,
  },
  fieldContainer: {
    marginTop: hp(1),
  },
  button: {
    marginVertical: hp(2),
  },
});
