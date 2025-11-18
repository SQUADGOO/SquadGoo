import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useForm, FormProvider } from 'react-hook-form';
import AppText from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import CustomCheckBox from '@/core/CustomCheckBox';
import { colors, getFontSize, hp, wp } from '@/theme';
import { screenNames } from '@/navigation/screenNames';
import { useCallback, useEffect } from 'react';

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
          <TextInput
            style={styles.input}
            placeholder="Information Technology"
            placeholderTextColor="#C0AFCF"
            onChangeText={(text) => setValue('preferredIndustry', text)}
          />

          <AppText style={styles.label}>Preferred Job Title</AppText>
          <TextInput
            style={styles.input}
            placeholder="Software Developer"
            placeholderTextColor="#C0AFCF"
            onChangeText={(text) => setValue('preferredJobTitle', text)}
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
