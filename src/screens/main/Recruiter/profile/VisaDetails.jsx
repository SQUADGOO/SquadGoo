import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import FormField from '@/core/FormField';
import AppButton from '@/core/AppButton';
import VisaTypeSelector from '@/components/VisaTypeSelector';
import AppInputField from '@/core/AppInputField';
import { colors, hp, wp } from '@/theme';
import { useUpdateJobSeekerProfile } from '@/api/auth/auth.query';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { updateUserFields } from '@/store/authSlice';

const VisaDetails = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState(null);
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
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = methods;

  const watchedVisaType = watch('visa_type');

  const baseVisaType = useMemo(() => {
    // Prefer the structured selection, fallback to saved form value.
    const raw = selectedVisaType?.displayValue || watchedVisaType || '';
    if (selectedVisaType?.visaType) return selectedVisaType.visaType;
    // For "Other (please specify): <text>" keep the base label left of colon.
    return raw.includes(':') ? raw.split(':')[0].trim() : raw.trim();
  }, [selectedVisaType, watchedVisaType]);

  const shouldHideVisaSpecificFields = useMemo(() => {
    return (
      baseVisaType === 'Australian Citizen (no visa required)' ||
      baseVisaType === 'Permanent Resident'
    );
  }, [baseVisaType]);

  const shouldShowVisaSpecificFields = useMemo(() => {
    return !!baseVisaType && !shouldHideVisaSpecificFields;
  }, [baseVisaType, shouldHideVisaSpecificFields]);

  const shouldShowSubclassField = useMemo(() => {
    if (!shouldShowVisaSpecificFields) return false;
    if (selectedVisaType && typeof selectedVisaType.requiresSubclass === 'boolean') {
      return selectedVisaType.requiresSubclass;
    }
    // Fallback when we only have the saved string value.
    return (
      baseVisaType === 'Temporary Skill Shortage (subclass 482)' ||
      baseVisaType === 'Student Visa' ||
      baseVisaType === 'Working Holiday Visa' ||
      baseVisaType === 'Graduate Visa' ||
      baseVisaType === 'Partner/Family Visa' ||
      baseVisaType === 'Bridging Visa' ||
      baseVisaType === 'Refugee/Humanitarian Visa' ||
      baseVisaType === 'Other (please specify)'
    );
  }, [baseVisaType, selectedVisaType, shouldShowVisaSpecificFields]);

  useEffect(() => {
    // Keep saved values consistent with visibility rules.
    if (shouldHideVisaSpecificFields) {
      const current = getValues();
      if (current.visa_number) setValue('visa_number', '');
      if (current.visa_subclass) setValue('visa_subclass', '');
      if (current.visa_expiry) setValue('visa_expiry', '');
      return;
    }

    if (!shouldShowSubclassField) {
      const currentSubclass = getValues('visa_subclass');
      if (currentSubclass) setValue('visa_subclass', '');
    }
  }, [
    getValues,
    setValue,
    shouldHideVisaSpecificFields,
    shouldShowSubclassField,
  ]);

  const handleVisaTypeSelect = (visaData) => {
    setSelectedVisaType(visaData);
    const displayValue = visaData?.displayValue || visaData?.visaType || '';
    const baseTypeValue = visaData?.visaType || displayValue;

    setValue('visa_type', displayValue);

    // Clear subclass if the chosen type doesn't require it.
    if (!visaData?.requiresSubclass) {
      setValue('visa_subclass', '');
    }

    // If Citizen or PR, hide and clear all visa-specific fields.
    if (
      baseTypeValue === 'Australian Citizen (no visa required)' ||
      baseTypeValue === 'Permanent Resident'
    ) {
      setValue('visa_number', '');
      setValue('visa_subclass', '');
      setValue('visa_expiry', '');
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
                selectedValue={selectedVisaType?.displayValue || watchedVisaType || ''}
                placeholder="Select visa type"
              />
            </View>

            {shouldShowVisaSpecificFields && (
              <>
                {shouldShowSubclassField && (
                  <Controller
                    control={control}
                    name="visa_subclass"
                    rules={{
                      required: 'Subclass is required',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Subclass must contain only numbers',
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <AppInputField
                        label="Subclass"
                        placeholder="Enter subclass number (user input manually)"
                        value={value}
                        onChangeText={(text) => onChange((text || '').replace(/[^\d]/g, ''))}
                        keyboardType="numeric"
                        error={errors?.visa_subclass?.message}
                      />
                    )}
                  />
                )}

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
              </>
            )}

            <FormField
              name="work_rights"
              label="Work Rights"
              placeholder="e.g., Full-time, Part-time, Limited hours"
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
