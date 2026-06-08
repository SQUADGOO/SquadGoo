import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import AppInputField from '@/core/AppInputField';
import AppDropDown from '@/core/AppDropDown';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
  { label: 'Other', value: 'other' },
];

const NATIONALITY_OPTIONS = [
  { label: 'Australia', value: 'Australia' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'Nepal', value: 'Nepal' },
  { label: 'India', value: 'India' },
  { label: 'China', value: 'China' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'Fiji', value: 'Fiji' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Korea', value: 'Korea' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Other', value: 'Other' },
];

const BasicDetails = ({ navigation }) => {
  const userInfo = useSelector(state => state.auth?.userInfo || {});
  const [genderOpen, setGenderOpen] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [otherGender, setOtherGender] = useState('');

  const methods = useForm({
    defaultValues: {
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      email: userInfo?.email || '',
      phone: userInfo?.contactNumber || userInfo?.phone || '',
      dateOfBirth: userInfo?.dateOfBirth || '',
      gender: userInfo?.gender || '',
      homeAddress: userInfo?.homeAddress || '',
      nationality: userInfo?.nationality || 'Australia',
      bio: userInfo?.bio || '',
    },
  });

  const { control, handleSubmit, watch, setValue } = methods;
  const genderValue = watch('gender');

  const onSave = (data) => {
    if (data.gender === 'other' && otherGender.trim()) {
      data.gender = otherGender.trim();
    }
    showToast('Profile updated successfully', 'Success', toastTypes.success);
  };

  const SectionHeader = ({ icon, title }) => (
    <View style={styles.sectionHeader}>
      <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={18} color={colors.primary} />
      <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>{title}</AppText>
    </View>
  );

  const MandatoryLabel = ({ text }) => (
    <AppText variant={Variant.caption} style={styles.fieldLabel}>
      {text} <AppText style={styles.mandatory}>*</AppText>
    </AppText>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Basic Details" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FormProvider {...methods}>

          {/* Personal Info */}
          <View style={styles.card}>
            <SectionHeader icon="person-outline" title="Personal Information" />
            <View style={styles.divider} />

            <MandatoryLabel text="First Name" />
            <Controller
              control={control}
              name="firstName"
              rules={{ required: 'First name is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <AppInputField placeholder="Enter first name" value={value} onChangeText={onChange} />
                  {error ? <AppText variant={Variant.caption} style={styles.errorText}>{error.message}</AppText> : null}
                </>
              )}
            />

            <MandatoryLabel text="Last Name" />
            <Controller
              control={control}
              name="lastName"
              rules={{ required: 'Last name is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <AppInputField placeholder="Enter last name" value={value} onChangeText={onChange} />
                  {error ? <AppText variant={Variant.caption} style={styles.errorText}>{error.message}</AppText> : null}
                </>
              )}
            />

            <MandatoryLabel text="Email" />
            <Controller
              control={control}
              name="email"
              render={({ field: { value } }) => (
                <AppInputField placeholder="Email" value={value} editable={false} />
              )}
            />

            <MandatoryLabel text="Phone Number (AU Format)" />
            <Controller
              control={control}
              name="phone"
              render={({ field: { value } }) => (
                <AppInputField placeholder="+61 4XX XXX XXX" value={value} editable={false} />
              )}
            />

            <MandatoryLabel text="Date of Birth" />
            <Controller
              control={control}
              name="dateOfBirth"
              rules={{ required: 'Date of birth is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <AppInputField placeholder="DD/MM/YYYY" value={value} onChangeText={onChange} />
                  {error ? <AppText variant={Variant.caption} style={styles.errorText}>{error.message}</AppText> : null}
                </>
              )}
            />

            <AppText variant={Variant.caption} style={styles.fieldLabel}>Gender</AppText>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <AppDropDown
                  placeholder="Select gender"
                  options={GENDER_OPTIONS}
                  selectedValue={value}
                  onSelect={onChange}
                  isVisible={genderOpen}
                  setIsVisible={setGenderOpen}
                />
              )}
            />
            {genderValue === 'other' ? (
              <View style={{ marginTop: hp(1) }}>
                <AppInputField placeholder="Please specify" value={otherGender} onChangeText={setOtherGender} />
              </View>
            ) : null}
          </View>

          {/* Address & Nationality */}
          <View style={styles.card}>
            <SectionHeader icon="home-outline" title="Address & Nationality" />
            <View style={styles.divider} />

            <AppText variant={Variant.caption} style={styles.fieldLabel}>Home Address (AU Format)</AppText>
            <Controller
              control={control}
              name="homeAddress"
              render={({ field: { onChange, value } }) => (
                <AppInputField placeholder="Street number, name, suburb, state, postcode" value={value} onChangeText={onChange} />
              )}
            />

            <AppText variant={Variant.caption} style={styles.fieldLabel}>Nationality</AppText>
            <Controller
              control={control}
              name="nationality"
              render={({ field: { onChange, value } }) => (
                <AppDropDown
                  placeholder="Select nationality"
                  options={NATIONALITY_OPTIONS}
                  selectedValue={value}
                  onSelect={onChange}
                  isVisible={nationalityOpen}
                  setIsVisible={setNationalityOpen}
                />
              )}
            />
          </View>

          {/* Bio */}
          <View style={styles.card}>
            <SectionHeader icon="document-text-outline" title="Bio" />
            <View style={styles.divider} />

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, value } }) => (
                <>
                  <AppInputField
                    placeholder="Tell us about yourself (150 characters max)"
                    value={value}
                    onChangeText={(t) => onChange(t.slice(0, 150))}
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: hp(10), textAlignVertical: 'top' }}
                  />
                  <AppText variant={Variant.caption} style={styles.charCount}>
                    {(value || '').length}/150
                  </AppText>
                </>
              )}
            />
          </View>

          {/* Contact Support Note */}
          <View style={styles.card}>
            <View style={styles.supportNote}>
              <VectorIcons name={iconLibName.Ionicons} iconName="information-circle-outline" size={18} color="#6B7280" />
              <AppText variant={Variant.caption} style={styles.supportNoteText}>
                To update your email or phone number, please contact SQUADGOO Support.
              </AppText>
            </View>
            <TouchableOpacity style={styles.contactSupportBtn} activeOpacity={0.7}>
              <AppText variant={Variant.bodyMedium} style={styles.contactSupportText}>Contact Support</AppText>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <AppButton
            text="Save Changes"
            onPress={handleSubmit(onSave)}
            bgColor={colors.primary}
            textColor="#FFFFFF"
          />

          <View style={{ height: hp(4) }} />
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default BasicDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: wp(4), paddingBottom: hp(5) },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2.5), padding: wp(5), marginBottom: hp(2),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  sectionTitle: { fontSize: getFontSize(16), fontWeight: '800', color: colors.secondary },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },
  fieldLabel: {
    color: colors.gray, fontSize: getFontSize(11), fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: hp(0.5), marginTop: hp(1.5),
  },
  mandatory: { color: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: getFontSize(11), marginTop: hp(0.3) },
  charCount: { color: '#9CA3AF', fontSize: getFontSize(11), textAlign: 'right', marginTop: hp(0.3) },
  supportNote: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(2), marginBottom: hp(1.5) },
  supportNoteText: { flex: 1, color: '#6B7280', fontSize: getFontSize(12), lineHeight: getFontSize(18) },
  contactSupportBtn: {
    alignSelf: 'flex-start', paddingHorizontal: wp(4), paddingVertical: hp(1),
    borderRadius: hp(2), borderWidth: 1, borderColor: colors.primary,
  },
  contactSupportText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(13) },
});
