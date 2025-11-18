import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import CustomCheckBox from '@/core/CustomCheckBox';
import VectorIcons from '@/theme/vectorIcon';
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
  const { mutateAsync: updateJobPreference } = useAddJobPreferences();

  const methods = useForm({
    defaultValues: {
      availability: daysOfWeek.reduce((acc, day) => {
        acc[day] = { enabled: false };
        return acc;
      }, {}),
      startTime: null,
      endTime: null,
    },
  });

  const { control, watch, setValue, handleSubmit } = methods;
  const [showPicker, setShowPicker] = useState({ field: null });
  const availability = watch('availability');

  const handleTimeChange = (event, selectedDate) => {
    if (showPicker.field) {
      const timeString = selectedDate
        ? selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null;
      setValue(showPicker.field, timeString);
    }
    setShowPicker({ field: null });
  };

  const onSubmit = async (data) => {
    const enabledDays = Object.keys(data.availability).filter(day => data.availability[day].enabled);
    const payload = {
      ...step1Data,
      daysAvailable: enabledDays.join(','),
      startTime: data.startTime,
      endTime: data.endTime,
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
          <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker({ field: 'startTime' })}>
            <AppText style={styles.timeText}>{watch('startTime') || 'Start Time'}</AppText>
          </TouchableOpacity>
          <AppText style={styles.toText}>To</AppText>
          <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker({ field: 'endTime' })}>
            <AppText style={styles.timeText}>{watch('endTime') || 'End Time'}</AppText>
          </TouchableOpacity>
        </View>

        <AppButton text="Save" onPress={handleSubmit(onSubmit)} textColor="#FFF" style={styles.button} />
      </ScrollView>

      {showPicker.field && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
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
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: hp(1.5),
    alignItems: 'center',
  },
  timeText: { color: colors.gray },
  toText: { marginHorizontal: wp(2), color: colors.secondary },
  button: { marginTop: hp(3), marginBottom: hp(6) },
});
