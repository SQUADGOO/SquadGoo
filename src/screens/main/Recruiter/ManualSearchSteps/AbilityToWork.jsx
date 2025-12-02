import React, { useState, useMemo } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native'
import AppDatePickerModal from '@/core/AppDatePickerModal'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import { showToast, toastTypes } from '@/utilities/toastConfig'

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

// Time Picker Field Component using AppDatePickerModal
const TimePickerField = ({ label, value, onChange, disabled }) => {
  // Convert string time (HH:MM) to Date object
  const parseTimeString = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return new Date();
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Convert Date object to string time (HH:MM)
  const formatTimeToString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (selectedDate) => {
    if (selectedDate && onChange) {
      const timeString = formatTimeToString(selectedDate);
      onChange(timeString);
    }
  };

  return (
    <AppDatePickerModal
      label=""
      value={parseTimeString(value)}
      onChange={handleTimeChange}
      placeholder={label}
      mode="time"
    />
  );
}

// Day Row Component
const DayRow = ({ 
  day, 
  isSelected, 
  onToggle, 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}) => (
  <View style={styles.dayCard}>
    {/* Day Header */}
    <TouchableOpacity
      style={styles.dayHeader}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
        {isSelected && (
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="checkmark"
            size={16}
            color="#FFFFFF"
          />
        )}
      </View>
      <AppText variant={Variant.bodyMedium} style={styles.dayText}>
        {day}
      </AppText>
      {isSelected && (
        <View style={styles.selectedBadge}>
          <AppText variant={Variant.caption} style={styles.selectedBadgeText}>
            Selected
          </AppText>
        </View>
      )}
    </TouchableOpacity>

    {/* Time Pickers - Only show when day is selected */}
    {isSelected && (
      <View style={styles.timeRow}>
        <View style={styles.timeFieldContainer}>
          <AppText variant={Variant.caption} style={styles.timeLabel}>
            Start Time
          </AppText>
          <TimePickerField
            label="Select start time"
            value={startTime}
            onChange={onStartTimeChange}
          />
        </View>
        
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <AppText variant={Variant.bodyMedium} style={styles.separatorText}>
            To
          </AppText>
          <View style={styles.separatorLine} />
        </View>
        
        <View style={styles.timeFieldContainer}>
          <AppText variant={Variant.caption} style={styles.timeLabel}>
            End Time
          </AppText>
          <TimePickerField
            label="Select end time"
            value={endTime}
            onChange={onEndTimeChange}
          />
        </View>
      </View>
    )}
  </View>
)

const AbilityToWork = ({ navigation }) => {
  // Initialize state for all days
  const initialDaysState = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = false
    return acc
  }, {})

  const initialTimesState = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = { start: '', end: '' }
    return acc
  }, {})

  const [selectedDays, setSelectedDays] = useState(initialDaysState)
  const [dayTimes, setDayTimes] = useState(initialTimesState)
  const [commonTimeRange, setCommonTimeRange] = useState({ start: '', end: '' })

  // Calculate selected days count
  const selectedDaysCount = useMemo(() => {
    return Object.values(selectedDays).filter(Boolean).length
  }, [selectedDays])

  // Toggle day selection
  const toggleDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }))
  }

  // Handle time change for individual day
  const handleDayTimeChange = (day, field, timeString) => {
    if (!selectedDays[day]) {
      showToast('Please select the day first', 'Info', toastTypes.info)
      return
    }
    
    setDayTimes(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: timeString
      }
    }))
  }

  // Handle common time change
  const handleCommonTimeChange = (field, timeString) => {
    setCommonTimeRange(prev => ({
      ...prev,
      [field]: timeString
    }))
  }

  // Apply common time to selected days
  const handleSetCommonTime = () => {
    if (!commonTimeRange.start || !commonTimeRange.end) {
      showToast('Please select both start and end times', 'Warning', toastTypes.warning)
      return
    }

    const selectedDaysList = DAYS_OF_WEEK.filter(day => selectedDays[day])
    
    if (selectedDaysList.length === 0) {
      showToast('Please select at least one day', 'Warning', toastTypes.warning)
      return
    }

    // Validate time range
    const [startHour, startMin] = commonTimeRange.start.split(':').map(Number)
    const [endHour, endMin] = commonTimeRange.end.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    if (endMinutes <= startMinutes) {
      showToast('End time must be after start time', 'Error', toastTypes.error)
      return
    }

    // Apply to selected days
    const updatedDayTimes = { ...dayTimes }
    selectedDaysList.forEach(day => {
      updatedDayTimes[day] = {
        start: commonTimeRange.start,
        end: commonTimeRange.end
      }
    })
    setDayTimes(updatedDayTimes)
    
    // Clear common time range
    setCommonTimeRange({ start: '', end: '' })
    showToast(`Time applied to ${selectedDaysList.length} day(s)`, 'Success', toastTypes.success)
  }

  // Handle final selection
  const handleSelect = () => {
    const selectedDaysList = DAYS_OF_WEEK.filter(day => selectedDays[day])
    
    if (selectedDaysList.length === 0) {
      showToast('Please select at least one day', 'Warning', toastTypes.warning)
      return
    }

    // Validate that all selected days have times
    const incompleteDays = selectedDaysList.filter(day => {
      const times = dayTimes[day]
      return !times.start || !times.end
    })

    if (incompleteDays.length > 0) {
      showToast('Please set times for all selected days', 'Warning', toastTypes.warning)
      return
    }

    // Validate time ranges for each day
    const invalidDays = selectedDaysList.filter(day => {
      const times = dayTimes[day]
      const [startHour, startMin] = times.start.split(':').map(Number)
      const [endHour, endMin] = times.end.split(':').map(Number)
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
        acc[day] = dayTimes[day]
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

        {/* Common Time Range Card */}
        <View style={styles.commonTimeCard}>
          <View style={styles.commonTimeHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.commonTimeTitle}>
              Quick Set Time Range
            </AppText>
          </View>
          
          <AppText variant={Variant.caption} style={styles.commonTimeDescription}>
            Set a common time range and apply it to all selected days
          </AppText>

          <View style={styles.commonTimeFields}>
            <View style={styles.commonTimeFieldWrapper}>
              <AppText variant={Variant.caption} style={styles.commonTimeLabel}>
                Start Time
              </AppText>
              <TimePickerField
                label="Select start time"
                value={commonTimeRange.start}
                onChange={(timeString) => handleCommonTimeChange('start', timeString)}
              />
            </View>
            
            <View style={styles.commonTimeFieldWrapper}>
              <AppText variant={Variant.caption} style={styles.commonTimeLabel}>
                End Time
              </AppText>
              <TimePickerField
                label="Select end time"
                value={commonTimeRange.end}
                onChange={(timeString) => handleCommonTimeChange('end', timeString)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.applyButton,
              (!commonTimeRange.start || !commonTimeRange.end || selectedDaysCount === 0) && styles.applyButtonDisabled
            ]}
            onPress={handleSetCommonTime}
            disabled={!commonTimeRange.start || !commonTimeRange.end || selectedDaysCount === 0}
            activeOpacity={0.8}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark-circle"
              size={18}
              color="#FFFFFF"
            />
            <AppText variant={Variant.bodyMedium} style={styles.applyButtonText}>
              Apply to {selectedDaysCount} Selected Day{selectedDaysCount !== 1 ? 's' : ''}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Days List */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.daysSection}>
            <AppText variant={Variant.bodyMedium} style={styles.daysSectionTitle}>
              Select Days ({selectedDaysCount} selected)
            </AppText>
            
            {DAYS_OF_WEEK.map((day) => (
              <DayRow
                key={day}
                day={day}
                isSelected={selectedDays[day]}
                onToggle={() => toggleDay(day)}
                startTime={dayTimes[day].start}
                endTime={dayTimes[day].end}
                onStartTimeChange={(timeString) => handleDayTimeChange(day, 'start', timeString)}
                onEndTimeChange={(timeString) => handleDayTimeChange(day, 'end', timeString)}
              />
            ))}
          </View>
        </ScrollView>

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
  commonTimeCard: {
    margin: wp(4),
    padding: wp(4),
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  commonTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  commonTimeTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  commonTimeDescription: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(2),
    lineHeight: 18,
  },
  commonTimeFields: {
    flexDirection: 'row',
    gap: wp(3),
    marginBottom: hp(2),
  },
  commonTimeFieldWrapper: {
    flex: 1,
  },
  commonTimeLabel: {
    color: colors.secondary,
    fontSize: getFontSize(12),
    fontWeight: '500',
    marginBottom: hp(0.8),
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: hp(1.5),
    borderRadius: hp(1.5),
    gap: wp(2),
  },
  applyButtonDisabled: {
    backgroundColor: '#E5E7EB',
    opacity: 0.6,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(2),
  },
  daysSection: {
    paddingHorizontal: wp(4),
  },
  daysSectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(2),
    marginTop: hp(1),
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(1.5),
    padding: wp(4),
    marginBottom: hp(1.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(1.5),
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  dayText: {
    flex: 1,
    color: colors.secondary,
    fontSize: getFontSize(15),
    fontWeight: '600',
  },
  selectedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: hp(1),
  },
  selectedBadgeText: {
    color: '#059669',
    fontSize: getFontSize(10),
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: wp(2),
    marginTop: hp(2),
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  timeFieldContainer: {
    flex: 1,
  },
  timeLabel: {
    color: colors.gray,
    fontSize: getFontSize(11),
    fontWeight: '500',
    marginBottom: hp(0.8),
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    paddingBottom: hp(1.2),
  },
  separatorLine: {
    width: wp(2),
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    color: colors.gray,
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  actionButtonContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
})
