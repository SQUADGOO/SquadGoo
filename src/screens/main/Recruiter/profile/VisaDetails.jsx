import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import VisaTypeSelector from '@/components/VisaTypeSelector';
import { colors, hp, wp } from '@/theme';
import { useUpdateJobSeekerProfile } from '@/api/auth/auth.query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { updateUserFields } from '@/store/authSlice';

const VisaDetails = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState(null);
  const [visaSubclass, setVisaSubclass] = useState('');
  const { mutate: updateJobSeekerProfile, isPending } = useUpdateJobSeekerProfile();

  const userData = useSelector((state) => state.auth.userInfo);
  const userInfo = userData?.visaDetails
    // userData?.role === 'recruiter' ? userData?.recruiter : userData?.job_seeker;

  const methods = useForm({
    defaultValues: {
      visa_type: userInfo?.visa_type || '',
      visa_subclass: userInfo?.visa_subclass || '',
      visa_number: userInfo?.visa_number || '',
      visa_expiry: userInfo?.visa_expiry || '',
      work_rights: userInfo?.work_rights || '',
      citizenship_status: userInfo?.citizenship_status || '',
    },
  });

  const { handleSubmit, setValue } = methods;

  const handleVisaTypeSelect = (visaData) => {
    setSelectedVisaType(visaData);
    const visaTypeValue = visaData.customValue || visaData.visaType || '';
    setValue('visa_type', visaTypeValue);
    if (visaData.subclass) {
      setVisaSubclass(visaData.subclass);
      setValue('visa_subclass', visaData.subclass);
    } else {
      setVisaSubclass('');
      setValue('visa_subclass', '');
    }
  };

  const handleSave = async (data) => {
    setIsLoading(true);
    const payload = { ...data, id: userInfo?.id };
    console.log('🛂 Updating visa details:', payload);
    setTimeout(() => {
              dispatch(updateUserFields({ visaDetails: payload }));
              showToast('Visa Details updated successfully', 'Success', toastTypes.success);
              setIsLoading(false);
            }, 2000);
    // await updateJobSeekerProfile(payload);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Visa Details" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormProvider {...methods}>
          <AppText style={styles.sectionTitle}>Australian Visa Information</AppText>

          <View style={styles.formContainer}>
            <View style={{ marginBottom: hp(2) }}>
              <AppText variant={Variant.boldCaption} style={{ marginBottom: hp(1), fontSize: 14, fontWeight: '500' }}>
                Visa Type*
              </AppText>
              <VisaTypeSelector
                onSelect={handleVisaTypeSelect}
                selectedVisaType={selectedVisaType?.visaType || selectedVisaType?.customValue || ''}
                selectedSubclass={selectedVisaType?.subclass || ''}
                placeholder="Select visa type"
              />
            </View>

            <FormField
              name="visa_number"
              label="Visa Grant Number"
              placeholder="Enter your visa grant number"
            />

            <FormField
              name="visa_expiry"
              label="Visa Expiry Date"
              type="datePicker"
              minimumDate={new Date()}
              placeholder="Select expiry date"
            />

            <FormField
              name="work_rights"
              label="Work Rights"
              placeholder="e.g., Full-time, Part-time, Limited hours"
            />

            <FormField
              name="citizenship_status"
              label="Citizenship / Residency Status"
              placeholder="e.g., Australian Citizen, Permanent Resident, Temporary Visa"
            />

            <AppButton
              bgColor={colors.primary}
              text="Save Visa Details"
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

export default VisaDetails;

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
