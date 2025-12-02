import React, { useState, useMemo } from 'react'
import { 
  View, 
  StyleSheet
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import { showToast, toastTypes } from '@/utilities/toastConfig'
import AvailabilitySelector, { DAYS_OF_WEEK } from '@/components/AvailabilitySelector'

const AbilityToWork = ({ navigation }) => {
  // Initialize availability state in the format expected by AvailabilitySelector
  const initialAvailability = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = { enabled: false, from: '', to: '' }
    return acc
  }, {})

  const [availability, setAvailability] = useState(initialAvailability)
  const [commonTimeRange, setCommonTimeRange] = useState({ start: '', end: '' })

  // Handle availability change from shared component
  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability)
  }

  // Handle common time change
  const handleCommonTimeChange = (field, timeString) => {
    setCommonTimeRange(prev => ({
      ...prev,
      [field]: timeString
    }))
  }

  // Handle apply common time - clear the common time range after applying
  const handleApplyCommonTime = () => {
    setCommonTimeRange({ start: '', end: '' })
  }

  // Calculate selected days count
  const selectedDaysCount = useMemo(() => {
    return DAYS_OF_WEEK.filter(day => availability[day]?.enabled === true).length
  }, [availability])

  // Handle final selection
  const handleSelect = () => {
    const selectedDaysList = DAYS_OF_WEEK.filter(day => availability[day]?.enabled === true)
    
    if (selectedDaysList.length === 0) {
      showToast('Please select at least one day', 'Warning', toastTypes.warning)
      return
    }

    // Validate that all selected days have times
    const incompleteDays = selectedDaysList.filter(day => {
      const dayData = availability[day]
      return !dayData?.from || !dayData?.to
    })

    if (incompleteDays.length > 0) {
      showToast('Please set times for all selected days', 'Warning', toastTypes.warning)
      return
    }

    // Validate time ranges for each day
    const invalidDays = selectedDaysList.filter(day => {
      const dayData = availability[day]
      const [startHour, startMin] = dayData.from.split(':').map(Number)
      const [endHour, endMin] = dayData.to.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      return endMinutes <= startMinutes
    })

    if (invalidDays.length > 0) {
      showToast('End time must be after start time for all days', 'Error', toastTypes.error)
      return
    }

    // Prepare availability data
    const availabilityData = {
      selectedDays: selectedDaysList,
      schedule: selectedDaysList.reduce((acc, day) => {
        const dayData = availability[day]
        acc[day] = { start: dayData.from, end: dayData.to }
        return acc
      }, {})
    }
    
    console.log('Availability data:', availabilityData)
    navigation.goBack()
  }

  return (
    <>
      <AppHeader
        title='Availability to work'
        showTopIcons={false}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <AppText variant={Variant.subTitle} style={styles.headerTitle}>
            Set Availability Schedule
          </AppText>
          <AppText variant={Variant.body} style={styles.headerSubtitle}>
            Select days and set working hours for each day
          </AppText>
        </View>

        {/* Shared Availability Selector Component */}
        <AvailabilitySelector
          availability={availability}
          onAvailabilityChange={handleAvailabilityChange}
          commonTimeRange={commonTimeRange}
          onCommonTimeChange={handleCommonTimeChange}
          onApplyCommonTime={handleApplyCommonTime}
          containerStyle={styles.availabilityContainer}
        />

        {/* Action Button */}
        <View style={styles.actionButtonContainer}>
          <AppButton
            text={`Save Schedule (${selectedDaysCount} day${selectedDaysCount !== 1 ? 's' : ''})`}
            onPress={handleSelect}
            bgColor="#F59E0B"
            textColor="#FFFFFF"
          />
        </View>
      </View>

    </>
  )
}

export default AbilityToWork

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerSection: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: '700',
    marginBottom: hp(0.5),
  },
  headerSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(13),
    lineHeight: 20,
  },
  availabilityContainer: {
    flex: 1,
  },
  actionButtonContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
})
