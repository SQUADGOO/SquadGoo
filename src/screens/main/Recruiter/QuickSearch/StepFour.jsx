// AvailabilityScreen.js
import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import CustomCheckBox from '@/core/CustomCheckBox'

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const StepFourQuickSearch = ({ navigation }) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      availability: daysOfWeek.reduce((acc, day) => {
        acc[day] = { enabled: false, from: null, to: null }
        return acc
      }, {}),
      taxType: 'ABN'
    }
  })

  const { watch, setValue, control, handleSubmit } = methods
  const [showPicker, setShowPicker] = useState({ day: null, field: null })

  const availability = watch('availability')
  const taxType = watch('taxType')

  const handleTimeChange = (event, selectedDate) => {
    if (showPicker.day && showPicker.field) {
      const timeString = selectedDate
        ? selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null
      setValue(`availability.${showPicker.day}.${showPicker.field}`, timeString)
    }
    setShowPicker({ day: null, field: null })
  }

  const onSubmit = (data) => {
    console.log('Availability Data:', data)
    navigation.navigate(screenNames.REVIEW, { formData: data })
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        title="Quick Search"
        showTopIcons={false}
        rightComponent={
          <AppText variant={Variant.body} style={styles.stepText}>
            Step 4/4
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
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowPicker({ day, field: 'from' })}
                >
                  <AppText style={styles.timeText}>
                    {availability[day].from || '00:00'}
                  </AppText>
                </TouchableOpacity>

                <AppText style={styles.toText}>To</AppText>

                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowPicker({ day, field: 'to' })}
                >
                  <AppText style={styles.timeText}>
                    {availability[day].to || '00:00'}
                  </AppText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Tax Type */}
        <AppText variant={Variant.h2} style={styles.sectionTitle}>
          Required Tax type
        </AppText>
        <View style={styles.taxTypeRow}>
          {['ABN', 'TFN', 'Both'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.taxTypeBtn,
                taxType === type && styles.taxTypeBtnActive,
              ]}
              onPress={() => setValue('taxType', type)}
            >
              <AppText
                style={[
                  styles.taxTypeText,
                  taxType === type && styles.taxTypeTextActive,
                ]}
              >
                {type}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <AppButton text="Next" onPress={handleSubmit(onSubmit)} textColor="#FFF" />
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
  )
}

export default StepFourQuickSearch

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
    fontSize: getFontSize(16),
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
    marginBottom: hp(2),
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  dayText: {
    color: colors.secondary,
    marginLeft: wp(2),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeText: {
    color: colors.gray,
  },
  toText: {
    marginHorizontal: wp(2),
    color: colors.secondary,
  },
  taxTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(2),
  },
  taxTypeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1.5),
    borderRadius: 50,
    marginHorizontal: wp(1),
    alignItems: 'center',
  },
  taxTypeBtnActive: {
    backgroundColor: colors.primary,
  },
  taxTypeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  taxTypeTextActive: {
    color: colors.white,
  },
  buttonContainer: {
    marginBottom: hp(6),
  },
})
