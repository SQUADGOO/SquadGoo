// QuickSearchStepFour.js - Availability & Tax Type
import React from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import AvailabilitySelector, { DAYS_OF_WEEK } from '@/components/AvailabilitySelector'
import { showToast, toastTypes } from '@/utilities/toastConfig'

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
      availability: DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = { enabled: false, from: '09:00', to: '17:00' } // Default: 9:00 AM to 5:00 PM
        return acc
      }, {}),
      taxType: 'ABN',
      commonTimeRange: { start: '09:00', end: '17:00' }, // Default: 9:00 AM to 5:00 PM
    },
  })

  const { watch, control, handleSubmit, setValue } = methods

  const taxType = watch('taxType')

  const onSubmit = (data) => {
    // Validate that all selected days have times
    const selectedDaysList = DAYS_OF_WEEK.filter(day => data.availability[day]?.enabled)
    
    if (selectedDaysList.length === 0) {
      showToast('Please select at least one day', 'Warning', toastTypes.warning)
      return
    }

    const incompleteDays = selectedDaysList.filter(day => {
      const times = data.availability[day]
      return !times.from || !times.to
    })

    if (incompleteDays.length > 0) {
      showToast('Please set times for all selected days', 'Warning', toastTypes.warning)
      return
    }

    // Validate time ranges for each day
    const invalidDays = selectedDaysList.filter(day => {
      const times = data.availability[day]
      const [startHour, startMin] = times.from.split(':').map(Number)
      const [endHour, endMin] = times.to.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      return endMinutes <= startMinutes
    })

    if (invalidDays.length > 0) {
      showToast('End time must be after start time for all days', 'Error', toastTypes.error)
      return
    }

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

        {/* Shared Availability Selector Component */}
        <AvailabilitySelector
          control={control}
          setValue={setValue}
          defaultStartTime="09:00"
          defaultEndTime="17:00"
          containerStyle={styles.availabilityContainer}
        />

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
  availabilityContainer: {
    marginBottom: hp(2),
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