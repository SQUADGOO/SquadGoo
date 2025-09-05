import React, { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppInputField from '@/core/AppInputField'
import AppHeader from '@/core/AppHeader'

const TimePickerField = ({ placeholder, value, onPress }) => (
    <View style={{width: wp(40)}}>

  <AppInputField
    placeholder={placeholder}
    // value={value}
    // editable={false}
    onPress={onPress}
    // style={styles.timePickerField}
    />
    </View>
)

const DayRow = ({ day, isSelected, onToggle, startTime, endTime, onStartTimePress, onEndTimePress }) => (
  <View style={styles.dayContainer}>
    {/* Day Checkbox */}
    <TouchableOpacity
      style={styles.checkboxRow}
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
    </TouchableOpacity>

    {/* Time Pickers */}
    <View style={styles.timeRow}>
      <TimePickerField
        placeholder="00:00"
        value={startTime}
        onPress={onStartTimePress}
      />
      
      <AppText variant={Variant.body} style={styles.toText}>
        To
      </AppText>
      
      <TimePickerField
        placeholder="00:00"
        value={endTime}
        onPress={onEndTimePress}
      />
    </View>
  </View>
)

const AbilityToWork = ({ navigation }) => {
  const [selectedDays, setSelectedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  })

  const [dayTimes, setDayTimes] = useState({
    Monday: { start: '', end: '' },
    Tuesday: { start: '', end: '' },
    Wednesday: { start: '', end: '' },
    Thursday: { start: '', end: '' },
    Friday: { start: '', end: '' },
    Saturday: { start: '', end: '' },
    Sunday: { start: '', end: '' }
  })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const toggleDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }))
  }

  const openTimePicker = (day, timeType) => {
    console.log(`Open time picker for ${day} ${timeType}`)
    // Here you would typically open a time picker modal
    // For demo purposes, setting a sample time
    const sampleTime = timeType === 'start' ? '09:00' : '17:00'
    setDayTimes(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeType]: sampleTime
      }
    }))
  }

  const handleSelect = () => {
    const availabilityData = {
      selectedDays: Object.keys(selectedDays).filter(day => selectedDays[day]),
      schedule: dayTimes
    }
    
    console.log('Availability data:', availabilityData)
    // Process the availability data and navigate
    navigation.goBack()
  }

  return (
    <>
    <AppHeader
        title='Availability to work'
        showTopIcons={false}
    />
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant={Variant.title} style={styles.headerTitle}>
          Availability to work
        </AppText>
        <AppText variant={Variant.body} style={styles.headerSubtitle}>
          Choose days and time you want seeker to be available
        </AppText>
      </View>

      {/* Days List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {days.map((day) => (
            <DayRow
            key={day}
            day={day}
            isSelected={selectedDays[day]}
            onToggle={() => toggleDay(day)}
            startTime={dayTimes[day].start}
            endTime={dayTimes[day].end}
            onStartTimePress={() => openTimePicker(day, 'start')}
            onEndTimePress={() => openTimePicker(day, 'end')}
            />
        ))}
      </ScrollView>

      {/* Select Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          text="Select"
          onPress={handleSelect}
          bgColor="#F59E0B"
          textColor="#FFFFFF"
          //   style={styles.selectButton}
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
    backgroundColor: colors.white || '#FFFFFF',
  },
  header: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  headerTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  headerSubtitle: {
    color: colors.textPrimary || '#6B7280',
    fontSize: getFontSize(13),
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  dayContainer: {
    marginBottom: hp(2),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(1.5),
    borderWidth: 2,
    borderColor: '#F59E0B',
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checkboxActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  dayText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: colors.white,
    width: '42%',
  },
  timeText: {
    color: colors.gray || '#9CA3AF',
    fontSize: getFontSize(16),
  },
  toText: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(14),
    fontWeight: '500',
    bottom: 10,
  },
  buttonContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8 || '#F3F4F6',
  },
  selectButton: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },
})