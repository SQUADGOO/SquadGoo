import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useForm, FormProvider } from 'react-hook-form';
import AppText from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import CustomCheckBox from '@/core/CustomCheckBox';
import { colors, getFontSize, hp, wp } from '@/theme';
import { screenNames } from '@/navigation/screenNames';
import AppInputField from '@/core/AppInputField';
import JobCategorySelector from '@/components/JobCategorySelector';
import RbSheetComponent from '@/core/RbSheetComponent';
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet';

const industryOptions = [
  { id: 1, title: 'Construction' },
  { id: 2, title: 'Healthcare' },
  { id: 3, title: 'Technology' },
  { id: 4, title: 'Hospitality' },
  { id: 5, title: 'Retail' },
  { id: 6, title: 'Education' },
  { id: 7, title: 'Manufacturing' },
  { id: 8, title: 'Transportation' },
  { id: 9, title: 'Logistics' },
  { id: 10, title: 'Construction & Trades' },
];

const AddJobStep1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isEdit = route?.params?.mode === 'edit';
  const editingJob = route?.params?.preferredJob;
  const methods = useForm({
    defaultValues: {
      preferredIndustry: '',
      preferredJobTitle: '',
      expectedPayMin: '',
      expectedPayMax: '',
      manualOffers: false,
      quickOffers: false,
      receiveWithinKm: '',
    },
  });

  const { handleSubmit, register, setValue, watch, reset } = methods;
  const industrySheetRef = React.useRef(null);
  const preferredIndustryValue = watch('preferredIndustry');
  const preferredJobTitleValue = watch('preferredJobTitle');

  const jobCategoryValue = React.useMemo(() => {
    if (!preferredJobTitleValue) return null;
    if (typeof preferredJobTitleValue === 'object') {
      return preferredJobTitleValue.category;
    }
    if (typeof preferredJobTitleValue === 'string' && preferredJobTitleValue.length > 0) {
      return preferredJobTitleValue;
    }
    return null;
  }, [preferredJobTitleValue]);

  const jobSubCategoryValue = React.useMemo(() => {
    if (!preferredJobTitleValue) return null;
    if (typeof preferredJobTitleValue === 'object') {
      return preferredJobTitleValue.subCategory;
    }
    return null;
  }, [preferredJobTitleValue]);

  const industryDisplay = React.useMemo(() => {
    if (!preferredIndustryValue) return '';
    if (typeof preferredIndustryValue === 'string') return preferredIndustryValue;
    return preferredIndustryValue?.title || preferredIndustryValue?.name || '';
  }, [preferredIndustryValue]);

  useEffect(() => {
    if (isEdit && editingJob) {
      reset({
        preferredIndustry: editingJob.preferredIndustry || '',
        preferredJobTitle: editingJob.preferredJobTitle || '',
        expectedPayMin: editingJob.expectedPayMin || '',
        expectedPayMax: editingJob.expectedPayMax || '',
        manualOffers: !!editingJob.manualOffers,
        quickOffers: !!editingJob.quickOffers,
        receiveWithinKm: editingJob.receiveWithinKm || '',
      });
    }
  }, [isEdit, editingJob, reset]);

  // Reset form when adding a new preferred job
  useFocusEffect(
    useCallback(() => {
      if (!isEdit) {
        reset({
          preferredIndustry: '',
          preferredJobTitle: '',
          expectedPayMin: '',
          expectedPayMax: '',
          manualOffers: false,
          quickOffers: false,
          receiveWithinKm: '',
        });
      }
    }, [isEdit, reset])
  );

  const onNext = (data) => {
    navigation.navigate(screenNames.ADD_JOB_STEP2, { formData: data, mode: isEdit ? 'edit' : 'add', id: editingJob?.id });
  };

  return (
    <FormProvider {...methods}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
        <AppHeader
          title="Add a Job"
          showTopIcons={false}
          rightComponent={
            <AppText style={styles.stepText}>Step 1/2</AppText>
          }
        />

        <View style={styles.container}>
          <AppText style={styles.label}>Preferred Industry</AppText>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => industrySheetRef.current?.open?.()}
          >
            <View pointerEvents="none">
              <AppInputField
                placeholder="Select industry"
                value={industryDisplay}
                editable={false}
              />
            </View>
          </TouchableOpacity>

          <AppText style={styles.label}>Preferred Job Title</AppText>
          <JobCategorySelector
            onSelect={(data) => setValue('preferredJobTitle', data)}
            selectedCategory={jobCategoryValue}
            selectedSubCategory={jobSubCategoryValue}
            placeholder="Select job title"
          />

          <AppText style={styles.label}>Expected Salary Range ($/hour)</AppText>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              placeholder="Min"
              placeholderTextColor="#C0AFCF"
              onChangeText={(text) => setValue('expectedPayMin', text)}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              placeholder="Max"
              placeholderTextColor="#C0AFCF"
              onChangeText={(text) => setValue('expectedPayMax', text)}
            />
          </View>

          <AppText style={styles.label}>Receive Job Offers Within (km)</AppText>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="25"
            placeholderTextColor="#C0AFCF"
            onChangeText={(text) => setValue('receiveWithinKm', text)}
          />

          <AppText style={styles.label}>Job Offer Preferences</AppText>
          <View style={styles.checkboxRow}>
            <CustomCheckBox
              checked={watch('manualOffers')}
              onPress={() => setValue('manualOffers', !watch('manualOffers'))}
            />
            <AppText>Manual Offers</AppText>
          </View>
          <View style={styles.checkboxRow}>
            <CustomCheckBox
              checked={watch('quickOffers')}
              onPress={() => setValue('quickOffers', !watch('quickOffers'))}
            />
            <AppText>Quick Offers</AppText>
          </View>

          <AppButton
            text="Next"
            bgColor={colors.primary}
            onPress={handleSubmit(onNext)}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>

      <RbSheetComponent ref={industrySheetRef} height={hp(60)}>
        <BottomDataSheet
          optionsData={industryOptions}
          onClose={() => industrySheetRef.current?.close()}
          onSelect={(item) => {
            setValue('preferredIndustry', item);
            industrySheetRef.current?.close();
          }}
        />
      </RbSheetComponent>
    </FormProvider>
  );
};

export default AddJobStep1;

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#3B2E57',
    marginBottom: hp(0.8),
    marginTop: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: '#C0AFCF',
    borderRadius: 8,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(3),
    fontSize: getFontSize(14),
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  nextButton: {
    marginTop: hp(4),
  },
  stepText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: getFontSize(20),
  },
});
