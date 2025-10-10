import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AppText, { Variant } from '@/core/AppText';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import AppHeader from '@/core/AppHeader';
import { colors, hp, wp } from '@/theme';
import ImagePickerSheet from '@/components/ImagePickerSheet';
import VectorIcons from '@/theme/vectorIcon';
import images from '@/assets/images';
import FastImageView from '@/core/FastImageView';
import { useUpdateJobSeekerProfile } from '@/api/auth/auth.query';

const EditProfileScreen = () => {
  const dispatch = useDispatch();
  const { mutate: updateJobSeekerProfile, isPending, isSuccess} = useUpdateJobSeekerProfile()
  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo = userData?.role == 'recruiter' ? userData?.recruiter : userData?.job_seeker
  // console.log('User Info:', userData?.role, userInfo);

  const [profileImage, setProfileImage] = useState(userData?.profile_picture || '');
  const sheetRef = useRef();

  const methods = useForm({
    defaultValues: {
      first_name: userInfo?.first_name || '',
      last_name: userInfo?.last_name || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      dob: userInfo?.dob || '',
      address: userInfo?.address || '',
      bio: userInfo?.bio || '',
    },
  });

  const { handleSubmit, reset } = methods;



  const handleSave = async (data) => {
    console.log('Form Data:', userInfo?.user_id, { ...data, profileImage });
    await updateJobSeekerProfile({...data, id: userInfo?.id})
    // dispatch(updateProfile({ ...data, profileImage }));
  };

  const handleImageSelect = (image) => {
    if (image?.uri) setProfileImage(image.uri);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Edit Profile" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture Section */}
        <View style={styles.imageContainer}>
          <FastImageView
            source={profileImage ? { uri: profileImage } : images.avatar}
            style={styles.profileImage}
            resizeMode={'cover'}
          />

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => sheetRef.current?.open()}>
            <VectorIcons name="Feather" iconName="camera" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        <FormProvider {...methods}>
          <View style={styles.formContainer}>
            <FormField
              name="first_name"
              label="First Name*"
              placeholder="Enter your first name"
              rules={{ required: 'First name is required' }}

            />
            <FormField
              name="last_name"
              label="Last Name*"
              placeholder="Enter your last name"
              rules={{ required: 'Last name is required' }}
            />
            <FormField
              name="email"
              label="Email*"
              placeholder="Enter your email"
              editable={false}
              rules={{ required: 'Email is required' }}
            />
            <FormField
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              editable={false}
              keyboardType="phone-pad"
            />

            <FormField
              name="dob"
              label="Date of Birth"
              type="datePicker"
              maximumDate={new Date()}
              placeholder="Select your date of birth"
            />

            <FormField
              name="address"
              label="Home Address"
              placeholder="Enter your home address"
            />

            {/* 📝 Bio */}
            <FormField
              name="bio"
              label="Bio"
              placeholder="Write a short bio"
              multiline={true}
              numberOfLines={4}
            // style={{ height: hp(16) }}
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

      <ImagePickerSheet ref={sheetRef} onSelect={handleImageSelect} />
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
    paddingBottom: hp(4),
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: hp(3),
  },
  profileImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: hp(3),
  },
  formContainer: {
    flex: 1,
  },
  button: {
    marginTop: hp(2),
  },
});
