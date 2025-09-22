// screens/JobPreference.jsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { colors, getFontSize, hp, wp } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import CustomCheckBox from '@/core/CustomCheckBox';
import VectorIcons from '@/theme/vectorIcon';
import { screenNames } from '@/navigation/screenNames';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddJobStep2 = () => {
  const navigation = useNavigation();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      availability: daysOfWeek.reduce((acc, day) => {
        acc[day] = { enabled: false, from: null, to: null };
        return acc;
      }, {}),
    },
  });

  const { watch, setValue, control, handleSubmit } = methods;
  const [showPicker, setShowPicker] = useState({ day: null, field: null });

  const availability = watch('availability');

  const handleTimeChange = (event, selectedDate) => {
    if (showPicker.day && showPicker.field) {
      const timeString = selectedDate
        ? selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null;
      setValue(`availability.${showPicker.day}.${showPicker.field}`, timeString);
    }
    setShowPicker({ day: null, field: null });
  };

  const onSubmit = (data) => {
    console.log('Availability Data:', data);
    navigation.navigate(screenNames.REVIEW, { formData: data });
  };

  return (
    <FormProvider {...methods}>
      {/* Header */}
      <AppHeader
        title="Add a Job"
        showTopIcons={false}
        rightComponent={
          <AppText variant={Variant.body} style={styles.stepText}>
            Step 2/2
          </AppText>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <AppText variant={Variant.h2} style={styles.sectionTitle}>
          Availability to work
        </AppText>
        <AppText variant={Variant.bodySmall} style={styles.subTitle}>
          Choose days and time you want seeker to be available
        </AppText>

        {/* Days List */}
        {daysOfWeek.map((day) => (
          <View key={day} style={styles.dayContainer}>
            {/* Day Checkbox */}
            <View style={styles.dayHeader}>
              <Controller
                control={control}
                name={`availability.${day}.enabled`}
                render={({ field: { value, onChange } }) => (
                  <CustomCheckBox checked={value} onPress={() => onChange(!value)} />
                )}
              />
              <AppText variant={Variant.bodyMedium} style={styles.dayText}>
                {day}
              </AppText>
            </View>

            {/* Time Pickers */}
            {availability[day]?.enabled && (
              <View style={styles.timeRow}>
                {/* From */}
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowPicker({ day, field: 'from' })}
                >
                  <AppText style={styles.timeText}>
                    {availability[day].from || '00:00'}
                  </AppText>
                  <VectorIcons
                    lib="MaterialCommunityIcons"
                    name="clock-outline"
                    size={18}
                    color={colors.gray}
                  />
                </TouchableOpacity>

                <AppText style={styles.toText}>To</AppText>

                {/* To */}
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowPicker({ day, field: 'to' })}
                >
                  <AppText style={styles.timeText}>
                    {availability[day].to || '00:00'}
                  </AppText>
                  <VectorIcons
                    lib="MaterialCommunityIcons"
                    name="clock-outline"
                    size={18}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <AppButton text="Save" onPress={handleSubmit(onSubmit)} textColor="#FFF" />
        </View>
      </ScrollView>

      {/* Time Picker */}
      {showPicker.day && (
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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  stepText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: getFontSize(20),
  },
  sectionTitle: {
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  subTitle: {
    color: colors.gray,
    marginBottom: hp(2),
  },
  dayContainer: {
    marginBottom: hp(2.5),
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  dayText: {
    color: colors.secondary,
    marginLeft: wp(2),
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: colors.gray,
  },
  toText: {
    marginHorizontal: wp(2),
    color: colors.secondary,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: hp(6),
  },
});
