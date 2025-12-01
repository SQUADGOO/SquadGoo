// QuickSearchStepFour.js - Availability & Tax Type
import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import CustomCheckBox from '@/core/CustomCheckBox'
import FormField from '@/core/FormField'

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const QuickSearchStepFour = ({ navigation, route }) => {
  // Get data from all previous steps
  const { 
    quickSearchStep1Data, 
    quickSearchStep2Data, 
    quickSearchStep3Data 
  } = route.params || {}

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      availability: daysOfWeek.reduce((acc, day) => {
        acc[day] = { enabled: false, from: '', to: '' }
        return acc
      }, {}),
      taxType: 'ABN',
    },
  })

  const { watch, control, handleSubmit } = methods

  const availability = watch('availability')
  const taxType = watch('taxType')

  const onSubmit = (data) => {
    const quickSearchStep4Data = data

    console.log('Quick Search Step 4 Data:', quickSearchStep4Data)
    
    // Navigate to preview with ALL data from all 4 steps
    navigation.navigate(screenNames.QUICK_SEARCH_PREVIEW, { 
      quickSearchStep1Data,
      quickSearchStep2Data,
      quickSearchStep3Data,
      quickSearchStep4Data
    })
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        title="Availability"
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

            {/* Time Pickers - using shared timePicker FormField */}
            {availability[day]?.enabled && (
              <View style={styles.timeRow}>
                <View style={styles.timeInput}>
                  <FormField
                    name={`availability.${day}.from`}
                    label="From"
                    placeholder="00:00"
                    type="timePicker"
                  />
                </View>

                <AppText style={styles.toText}>To</AppText>

                <View style={styles.timeInput}>
                  <FormField
                    name={`availability.${day}.to`}
                    label="To"
                    placeholder="00:00"
                    type="timePicker"
                  />
                </View>
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
              onPress={() => methods.setValue('taxType', type)}
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

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <AppButton 
            text="Preview" 
            onPress={handleSubmit(onSubmit)} 
            textColor="#FFF" 
          />
        </View>
      </ScrollView>
    </FormProvider>
  )
}

export default QuickSearchStepFour

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
    // paddingVertical: hp(1.5),
    // borderWidth: 1,
    // borderColor: colors.lightGray,
    // borderRadius: 8,
    // alignItems: 'center',
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