import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import CustomCheckBox from '@/core/CustomCheckBox';
import FormField from '@/core/FormField';
import { colors, getFontSize, hp, wp } from '@/theme';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { useUpdateJobSeekerProfile } from '@/api/auth/auth.query';
import { useAddJobPreferences } from '@/api/jobSeeker/jobSeeker.query';
import { useDispatch } from 'react-redux';
import { addPreferredJob, updatePreferredJob } from '@/store/jobSeekerPreferredSlice';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddJobStep2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const step1Data = route.params?.formData || {};
  const mode = route.params?.mode || 'add';
  const editId = route.params?.id;
  const editingJob = route.params?.preferredJob || step1Data;
  const { mutateAsync: updateJobPreference } = useAddJobPreferences();

  // Convert string time (HH:MM) to Date object
  const parseTimeString = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Initialize availability from existing job or empty
  const initializeAvailability = () => {
    if (editingJob?.daysAvailable) {
      const enabledDays = editingJob.daysAvailable.split(',').map(d => d.trim());
      return daysOfWeek.reduce((acc, day) => {
        acc[day] = { enabled: enabledDays.includes(day) };
        return acc;
      }, {});
    }
    return daysOfWeek.reduce((acc, day) => {
      acc[day] = { enabled: false };
      return acc;
    }, {});
  };

  const methods = useForm({
    defaultValues: {
      availability: initializeAvailability(),
      startTime: parseTimeString(editingJob?.startTime),
      endTime: parseTimeString(editingJob?.endTime),
    },
  });

  const { control, watch, handleSubmit } = methods;
  const availability = watch('availability');

  const formatTimeToString = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onSubmit = async (data) => {
    const enabledDays = Object.keys(data.availability).filter(day => data.availability[day].enabled);
    const payload = {
      ...step1Data,
      daysAvailable: enabledDays.join(','),
      startTime: formatTimeToString(data.startTime),
      endTime: formatTimeToString(data.endTime),
    };

    // Save to Redux preferred jobs
    if (mode === 'edit' && editId) {
      dispatch(updatePreferredJob({ id: editId, ...payload }));
    } else {
      dispatch(addPreferredJob(payload));
    }
    navigation.goBack();
  };

  return (
    <FormProvider {...methods}>
      <AppHeader
        title="Add a Job"
        showTopIcons={false}
        rightComponent={<AppText style={styles.stepText}>Step 2/2</AppText>}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <AppText variant={Variant.h2} style={styles.sectionTitle}>Availability to work</AppText>
        <AppText variant={Variant.bodySmall} style={styles.subTitle}>
          Choose days and time you are available to work
        </AppText>

        {daysOfWeek.map((day) => (
          <View key={day} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Controller
                control={control}
                name={`availability.${day}.enabled`}
                render={({ field: { value, onChange } }) => (
                  <CustomCheckBox checked={value} onPress={() => onChange(!value)} />
                )}
              />
              <AppText style={styles.dayText}>{day}</AppText>
            </View>
          </View>
        ))}

        <AppText style={styles.label}>Select Working Hours</AppText>
        <View style={styles.timeRow}>
          <View style={styles.timeInput}>
            <FormField
              name="startTime"
              label="Start Time"
              placeholder="Select start time"
              type="timePicker"
            />
          </View>
          <AppText style={styles.toText}>To</AppText>
          <View style={styles.timeInput}>
            <FormField
              name="endTime"
              label="End Time"
              placeholder="Select end time"
              type="timePicker"
            />
          </View>
        </View>

        <AppButton text="Save" onPress={handleSubmit(onSubmit)} textColor="#FFF" style={styles.button} />
      </ScrollView>
    </FormProvider>
  );
};

export default AddJobStep2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: wp(4) },
  stepText: { color: colors.white, fontWeight: 'bold', fontSize: getFontSize(20) },
  sectionTitle: { color: colors.secondary, marginBottom: hp(0.5) },
  subTitle: { color: colors.gray, marginBottom: hp(2) },
  dayContainer: { marginBottom: hp(1.5) },
  dayHeader: { flexDirection: 'row', alignItems: 'center' },
  dayText: { color: colors.secondary, marginLeft: wp(2), fontWeight: '600' },
  label: { marginTop: hp(2), color: colors.secondary, fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginVertical: hp(1) },
  timeInput: {
    flex: 1,
  },
  toText: { marginHorizontal: wp(2), color: colors.secondary },
  button: { marginTop: hp(3), marginBottom: hp(6) },
});
