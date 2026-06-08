import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import AppText, { Variant } from '@/core/AppText';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import AppHeader from '@/core/AppHeader';
import { colors, hp, wp } from '@/theme';
import ImagePickerSheet from '@/components/ImagePickerSheet';
import VectorIcons from '@/theme/vectorIcon';
import images from '@/assets/images';
import FastImageView from '@/core/FastImageView';
import { useUpdateMe, useUploadProfilePicture } from '@/api/user/user.query';


const EditProfileScreen = () => {
  const { mutateAsync: updateProfile, isPending } = useUpdateMe();
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadProfilePicture();
  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo = userData;

  const [profileImage, setProfileImage] = useState(userData?.profilePhoto || '');
  const sheetRef = useRef();

  const methods = useForm({
    defaultValues: {
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      email: userInfo?.email || '',
      contactNumber: userInfo?.phone || '',
      dateOfBirth: userInfo?.dateOfBirth || '',
      homeAddress: userInfo?.addressLine1 || '',
      bio: userInfo?.bio || '',
    },
  });

  const { handleSubmit, reset } = methods;



  const handleSave = async (data) => {
    // Map the form fields onto the PUT /users/me payload (contactNumber→phone,
    // homeAddress→addressLine1). useUpdateMe syncs Redux + toasts on success/error.
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.contactNumber,
        dateOfBirth: data.dateOfBirth,
        bio: data.bio,
        addressLine1: data.homeAddress,
      });
    } catch {
      // useUpdateMe surfaces the failure via toast.
    }
  };

  const handleImageSelect = async (image) => {
    if (!image?.uri) return;
    setProfileImage(image.uri); // optimistic local preview
    try {
      const res = await uploadPhoto(image);
      if (res?.url) setProfileImage(res.url);
    } catch {
      // useUploadProfilePicture surfaces the failure via toast.
    }
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
            disabled={isUploading}
            onPress={() => sheetRef.current?.open()}>
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <VectorIcons name="Feather" iconName="camera" size={18} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>

        <FormProvider {...methods}>
          <View style={styles.formContainer}>
            <FormField
              name="firstName"
              label="First Name*"
              placeholder="Enter your first name"
              rules={{ required: 'First name is required' }}

            />
            <FormField
              name="lastName"
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
              name="contactNumber"
              label="Phone Number"
              placeholder="Enter your phone number"
              // editable={false}
              keyboardType="phone-pad"
            />

            <FormField
              name="dateOfBirth"
              label="Date of Birth"
              type="datePicker"
              maximumDate={new Date()}
              placeholder="Select your date of birth"
            />

            <FormField
              name="homeAddress"
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
