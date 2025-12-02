import React, { useMemo } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native'
import { useWatch } from 'react-hook-form'
import AppDatePickerModal from '@/core/AppDatePickerModal'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { showToast, toastTypes } from '@/utilities/toastConfig'

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

// Time Picker Field Component using AppDatePickerModal
export const TimePickerField = ({ label, value, onChange, disabled }) => {
  // Convert string time (HH:MM) to Date object
  const parseTimeString = (timeString) => {
    if (!timeString || typeof timeString !== 'string' || timeString.trim() === '') return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
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
export const DayRow = ({ 
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

// Common Time Range Card Component
export const CommonTimeRangeCard = ({
  commonTimeRange,
  onCommonTimeChange,
  onApplyCommonTime,
  selectedDaysCount,
  defaultStartTime = '09:00',
  defaultEndTime = '17:00',
  showApplyButton = true,
}) => {
  const isApplyButtonEnabled = useMemo(() => {
    const start = commonTimeRange?.start || defaultStartTime
    const end = commonTimeRange?.end || defaultEndTime
    return start && end && selectedDaysCount > 0
  }, [commonTimeRange, selectedDaysCount, defaultStartTime, defaultEndTime])

  return (
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
            value={commonTimeRange?.start || defaultStartTime}
            onChange={(timeString) => onCommonTimeChange('start', timeString)}
          />
        </View>
        
        <View style={styles.commonTimeFieldWrapper}>
          <AppText variant={Variant.caption} style={styles.commonTimeLabel}>
            End Time
          </AppText>
          <TimePickerField
            label="Select end time"
            value={commonTimeRange?.end || defaultEndTime}
            onChange={(timeString) => onCommonTimeChange('end', timeString)}
          />
        </View>
      </View>

      {showApplyButton && (
        <TouchableOpacity
          style={[
            styles.applyButton,
            !isApplyButtonEnabled && styles.applyButtonDisabled
          ]}
          onPress={onApplyCommonTime}
          disabled={!isApplyButtonEnabled}
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
      )}
    </View>
  )
}

// Main Availability Selector Component
// Supports both controlled (with form) and uncontrolled (with state) usage
const AvailabilitySelector = ({
  // Controlled mode (for react-hook-form)
  control,
  setValue,
  // Uncontrolled mode (for useState)
  availability,
  onAvailabilityChange,
  commonTimeRange,
  onCommonTimeChange,
  onApplyCommonTime,
  defaultStartTime = '09:00',
  defaultEndTime = '17:00',
  showCommonTimeCard = true,
  containerStyle,
  scrollViewStyle,
}) => {
  // Determine if using controlled or uncontrolled mode
  const isControlled = !!control && !!setValue
  
  // Get availability data - use useWatch for better reactivity in controlled mode
  const watchedAvailability = isControlled ? useWatch({ control, name: 'availability' }) : null
  const watchedCommonTimeRange = isControlled ? useWatch({ control, name: 'commonTimeRange' }) : null
  
  const availabilityData = isControlled 
    ? watchedAvailability || {}
    : availability || {}

  // Get common time range
  const commonTimeData = isControlled
    ? watchedCommonTimeRange || { start: defaultStartTime, end: defaultEndTime }
    : commonTimeRange || { start: defaultStartTime, end: defaultEndTime }

  // Calculate selected days count - this will update in real-time with useWatch
  const selectedDaysCount = useMemo(() => {
    if (!availabilityData) return 0
    return DAYS_OF_WEEK.filter(day => {
      const dayData = availabilityData[day]
      return dayData?.enabled === true
    }).length
  }, [availabilityData])

  // Toggle day selection
  const toggleDay = (day) => {
    const currentValue = availabilityData[day] || { enabled: false, from: defaultStartTime, to: defaultEndTime }
    const newEnabledState = !currentValue.enabled
    
    if (isControlled) {
      setValue(`availability.${day}.enabled`, newEnabledState, { shouldDirty: true })
      
      // When enabling a day, ensure default times are set
      if (newEnabledState) {
        if (!currentValue.from || currentValue.from === '') {
          setValue(`availability.${day}.from`, defaultStartTime, { shouldDirty: true })
        }
        if (!currentValue.to || currentValue.to === '') {
          setValue(`availability.${day}.to`, defaultEndTime, { shouldDirty: true })
        }
      }
    } else {
      if (onAvailabilityChange) {
        const updated = { ...availabilityData }
        updated[day] = {
          ...currentValue,
          enabled: newEnabledState,
          from: newEnabledState && (!currentValue.from || currentValue.from === '') ? defaultStartTime : currentValue.from,
          to: newEnabledState && (!currentValue.to || currentValue.to === '') ? defaultEndTime : currentValue.to,
        }
        onAvailabilityChange(updated)
      }
    }
  }

  // Handle time change for individual day
  const handleDayTimeChange = (day, field, timeString) => {
    const currentValue = availabilityData[day]
    if (!currentValue?.enabled) {
      showToast('Please select the day first', 'Info', toastTypes.info)
      return
    }
    
    if (isControlled) {
      setValue(`availability.${day}.${field}`, timeString, { shouldDirty: true })
    } else {
      if (onAvailabilityChange) {
        const updated = { ...availabilityData }
        updated[day] = {
          ...currentValue,
          [field]: timeString
        }
        onAvailabilityChange(updated)
      }
    }
  }

  // Handle common time change
  const handleCommonTimeChange = (field, timeString) => {
    if (isControlled) {
      setValue(`commonTimeRange.${field}`, timeString, { shouldDirty: true })
    } else {
      if (onCommonTimeChange) {
        onCommonTimeChange(field, timeString)
      }
    }
  }

  // Handle apply common time
  const handleApplyCommonTime = () => {
    const startTime = commonTimeData?.start || defaultStartTime
    const endTime = commonTimeData?.end || defaultEndTime
    
    if (!startTime || !endTime) {
      showToast('Please select both start and end times', 'Warning', toastTypes.warning)
      return
    }

    const selectedDaysList = DAYS_OF_WEEK.filter(day => {
      const dayData = availabilityData[day]
      return dayData?.enabled === true
    })
    
    if (selectedDaysList.length === 0) {
      showToast('Please select at least one day', 'Warning', toastTypes.warning)
      return
    }

    // Validate time range
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    if (endMinutes <= startMinutes) {
      showToast('End time must be after start time', 'Error', toastTypes.error)
      return
    }

    // Apply to selected days
    if (isControlled) {
      selectedDaysList.forEach(day => {
        setValue(`availability.${day}.from`, startTime, { shouldDirty: true })
        setValue(`availability.${day}.to`, endTime, { shouldDirty: true })
      })
      // Don't clear common time range in controlled mode - keep defaults for next use
    } else {
      if (onAvailabilityChange) {
        const updated = { ...availabilityData }
        selectedDaysList.forEach(day => {
          updated[day] = {
            ...updated[day],
            from: startTime,
            to: endTime
          }
        })
        onAvailabilityChange(updated)
      }
    }
    
    // Call onApplyCommonTime callback which can handle clearing the common time range
    if (onApplyCommonTime) {
      onApplyCommonTime()
    } else if (!isControlled && onCommonTimeChange) {
      // Auto-clear common time range in uncontrolled mode if no callback provided
      onCommonTimeChange('start', '')
      onCommonTimeChange('end', '')
    }
    
    showToast(`Time applied to ${selectedDaysList.length} day(s)`, 'Success', toastTypes.success)
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Common Time Range Card */}
      {showCommonTimeCard && (
        <CommonTimeRangeCard
          commonTimeRange={commonTimeData}
          onCommonTimeChange={handleCommonTimeChange}
          onApplyCommonTime={handleApplyCommonTime}
          selectedDaysCount={selectedDaysCount}
          defaultStartTime={defaultStartTime}
          defaultEndTime={defaultEndTime}
        />
      )}

      {/* Days List */}
      <ScrollView 
        style={[styles.scrollView, scrollViewStyle]} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.daysSection}>
          <AppText variant={Variant.bodyMedium} style={styles.daysSectionTitle}>
            Select Days ({selectedDaysCount} selected)
          </AppText>
          
          {DAYS_OF_WEEK.map((day) => {
            const dayData = availabilityData[day] || { enabled: false, from: defaultStartTime, to: defaultEndTime }
            return (
              <DayRow
                key={day}
                day={day}
                isSelected={dayData.enabled === true}
                onToggle={() => toggleDay(day)}
                startTime={dayData.from || defaultStartTime}
                endTime={dayData.to || defaultEndTime}
                onStartTimeChange={(timeString) => handleDayTimeChange(day, 'from', timeString)}
                onEndTimeChange={(timeString) => handleDayTimeChange(day, 'to', timeString)}
              />
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default AvailabilitySelector

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  commonTimeCard: {
    margin: wp(4),
    marginBottom: hp(2),
    padding: wp(4),
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
})

