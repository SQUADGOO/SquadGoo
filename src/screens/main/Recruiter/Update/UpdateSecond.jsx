// JobRequirementScreen.js
import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { wp, hp, getFontSize } from '@/theme'
import { colors } from '../../../../theme/colors'
import PoolHeader from '../../../../core/PoolHeader'
import RbSheetComponent from '../../../../core/RbSheetComponent'

// Replace Images.* with your actual imports or require paths.
// Example: const Images = { mainscreen: require('/mnt/data/Mainscreen.png') }
import { Images } from '../../../../assets'
import { useNavigation } from '@react-navigation/native'
import { screenNames } from '../../../../navigation/screenNames'

const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

const JobRequirementScreen = () => {
  // Main form state
  const [experienceYears, setExperienceYears] = useState('01')
  const [experienceMonths, setExperienceMonths] = useState('00')
  const [allowFreshers, setAllowFreshers] = useState(true)

  const [monToThuFrom, setMonToThuFrom] = useState('10:00')
  const [monToThuTo, setMonToThuTo] = useState('19:00')
  const [friToSunFrom, setFriToSunFrom] = useState('10:00')
  const [friToSunTo, setFriToSunTo] = useState('15:20')

  const [salaryType, setSalaryType] = useState('Hourly')
  const [salaryFrom, setSalaryFrom] = useState('10')
  const [salaryTo, setSalaryTo] = useState('50')

  const [extraPublicHoliday, setExtraPublicHoliday] = useState(true)
  const [extraWeekend, setExtraWeekend] = useState(true)
  const [extraShiftLoading, setExtraShiftLoading] = useState(true)
  const [extraBonuses, setExtraBonuses] = useState(true)
  const [extraOvertime, setExtraOvertime] = useState(true)
const navigation = useNavigation();
  // Availability per day (00:00 default)
  const initialDays = [
    { day: 'Monday', from: '00:00', to: '00:00' },
    { day: 'Tuesday', from: '00:00', to: '00:00' },
    { day: 'Wednesday', from: '00:00', to: '00:00' },
    { day: 'Thursday', from: '00:00', to: '00:00' },
    { day: 'Friday', from: '00:00', to: '00:00' },
    { day: 'Saturday', from: '00:00', to: '00:00' },
    { day: 'Sunday', from: '00:00', to: '00:00' },
  ]
  const [weekDays, setWeekDays] = useState(initialDays)

  // RBSheets refs
  const yearSheet = useRef()
  const monthSheet = useRef()
  const hourMinSheet = useRef()
  const dayAvailabilitySheet = useRef()
  const salarySheet = useRef()

  // For hour/min sheet selection temp
  const [selHour, setSelHour] = useState('03')
  const [selMin, setSelMin] = useState('10')
  const [hourTargetSetter, setHourTargetSetter] = useState(null) // callback to set selected field

  // Data arrays
  const years = Array.from({ length: 21 }, (_, i) => pad(i)) // 00..20
  const months = Array.from({ length: 12 }, (_, i) => pad(i + 0)) // 00..11 (or 01..12 if you prefer)
  const hours = Array.from({ length: 24 }, (_, i) => pad(i))
  const mins = Array.from({ length: 60 }, (_, i) => pad(i))

  // Handlers
  const openHourMinFor = (setter) => {
    setHourTargetSetter(() => setter)
    // default selected values parse from setter if it's a string of HH:MM
    if (typeof setter === 'function') {
      const current = setter.__currentValue || '03:10'
      const [h, m] = current.split(':')
      setSelHour(h)
      setSelMin(m)
    }
    hourMinSheet.current.open()
  }

  // Save selected hour/min back to target
  const confirmHourMin = () => {
    const time = `${selHour}:${selMin}`
    if (hourTargetSetter && typeof hourTargetSetter === 'function') {
      hourTargetSetter(time)
    }
    hourMinSheet.current.close()
  }

  const updateWeekDayTime = (index, key, value) => {
    const copy = [...weekDays]
    copy[index] = { ...copy[index], [key]: value }
    setWeekDays(copy)
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <PoolHeader title="Post Job - Requirements" />

        <View style={{ padding: wp(4), paddingTop: hp(2) }}>
          {/* Experience */}
          <Text style={styles.inputLabel}>Total experience needed</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.inputBox, { flex: 0.48 }]}
              onPress={() => yearSheet.current.open()}
            >
              <Text style={styles.inputBoxText}>{experienceYears} Year</Text>
              <Text style={styles.chev}>▾</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.inputBox, { flex: 0.48 }]}
              onPress={() => monthSheet.current.open()}
            >
              <Text style={styles.inputBoxText}>{experienceMonths} Month</Text>
              <Text style={styles.chev}>▾</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAllowFreshers((s) => !s)}
          >
            <View style={[styles.checkbox, allowFreshers && styles.checkboxChecked]}>
              {allowFreshers && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Freshers can also apply</Text>
          </TouchableOpacity>

          {/* Availability quick blocks (Monday-Thursday, Fri-Sun) */}
          <Text style={[styles.inputLabel, { marginTop: hp(1.5) }]}>Availability to work</Text>
          <Text style={styles.subLabel}>Choose days and time you want seeker to be available</Text>

          <Text style={styles.smallHeading}>Monday to Thursday</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.inputBox, { flex: 0.48 }]}
              onPress={() => {
                setHourTargetSetter(() => (val) => setMonToThuFrom(val))
                // put current value into special prop to prefill (hack - attach current)
                hourTargetSetter && (hourTargetSetter.__currentValue = monToThuFrom)
                hourMinSheet.current.open()
              }}
            >
              <Text style={styles.inputBoxText}>{monToThuFrom}</Text>
              <Text style={styles.chev}>⏰</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.inputBox, { flex: 0.48 }]}
              onPress={() => {
                setHourTargetSetter(() => (val) => setMonToThuTo(val))
                hourMinSheet.current.open()
              }}
            >
              <Text style={styles.inputBoxText}>{monToThuTo}</Text>
              <Text style={styles.chev}>⏰</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.smallHeading}>Friday to Sunday</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.inputBox, { flex: 0.48 }]}
              onPress={() => {
                setHourTargetSetter(() => (val) => setFriToSunFrom(val))
                hourMinSheet.current.open()
              }}
            >
              <Text style={styles.inputBoxText}>{friToSunFrom}</Text>
              <Text style={styles.chev}>⏰</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.inputBox, { flex: 0.48 }]}
              onPress={() => {
                setHourTargetSetter(() => (val) => setFriToSunTo(val))
                hourMinSheet.current.open()
              }}
            >
              <Text style={styles.inputBoxText}>{friToSunTo}</Text>
              <Text style={styles.chev}>⏰</Text>
            </TouchableOpacity>
          </View>

          {/* Salary */}
          <Text style={[styles.inputLabel, { marginTop: hp(1.5) }]}>Salary Type</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => salarySheet.current.open()}>
            <Text style={styles.inputBoxText}>{salaryType}</Text>
            <Text style={styles.chev}>▾</Text>
          </TouchableOpacity>

          <Text style={[styles.inputLabel]}>Salary you are offering</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              value={salaryFrom}
              onChangeText={setSalaryFrom}
              keyboardType="numeric"
              style={[styles.inputBox, { flex: 0.48 }]}
            />
            <Text style={{ alignSelf: 'center', color: '#c6b6c7' }}>To</Text>
            <TextInput
              value={salaryTo}
              onChangeText={setSalaryTo}
              keyboardType="numeric"
              style={[styles.inputBox, { flex: 0.48 }]}
            />
          </View>

          {/* Extra pay toggles */}
          <Text style={[styles.inputLabel, { marginTop: hp(1.5) }]}>Extra pay</Text>
          <View style={styles.extraRow}>
            <View style={styles.extraCol}>
              <Text style={styles.extraLabel}>Public holidays</Text>
              <View style={styles.toggleWrap}>
                <TouchableOpacity
                  style={[styles.toggleBtn, extraPublicHoliday && styles.toggleActive]}
                  onPress={() => setExtraPublicHoliday(true)}
                >
                  <Text style={styles.toggleTextActive}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, !extraPublicHoliday && styles.toggleActive]}
                  onPress={() => setExtraPublicHoliday(false)}
                >
                  <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.extraCol}>
              <Text style={styles.extraLabel}>Weekend</Text>
              <View style={styles.toggleWrap}>
                <TouchableOpacity
                  style={[styles.toggleBtn, extraWeekend && styles.toggleActive]}
                  onPress={() => setExtraWeekend(true)}
                >
                  <Text style={styles.toggleTextActive}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, !extraWeekend && styles.toggleActive]}
                  onPress={() => setExtraWeekend(false)}
                >
                  <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.extraRow}>
            <View style={styles.extraCol}>
              <Text style={styles.extraLabel}>Shift loading</Text>
              <View style={styles.toggleWrap}>
                <TouchableOpacity
                  style={[styles.toggleBtn, extraShiftLoading && styles.toggleActive]}
                  onPress={() => setExtraShiftLoading(true)}
                >
                  <Text style={styles.toggleTextActive}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, !extraShiftLoading && styles.toggleActive]}
                  onPress={() => setExtraShiftLoading(false)}
                >
                  <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.extraCol}>
              <Text style={styles.extraLabel}>Bonuses</Text>
              <View style={styles.toggleWrap}>
                <TouchableOpacity
                  style={[styles.toggleBtn, extraBonuses && styles.toggleActive]}
                  onPress={() => setExtraBonuses(true)}
                >
                  <Text style={styles.toggleTextActive}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, !extraBonuses && styles.toggleActive]}
                  onPress={() => setExtraBonuses(false)}
                >
                  <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={[styles.extraLabel, { marginTop: hp(1.5) }]}>Overtime</Text>
          <View style={{ width: '50%' }}>
            <View style={styles.toggleWrap}>
              <TouchableOpacity
                style={[styles.toggleBtn, extraOvertime && styles.toggleActive]}
                onPress={() => setExtraOvertime(true)}
              >
                <Text style={styles.toggleTextActive}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !extraOvertime && styles.toggleActive]}
                onPress={() => setExtraOvertime(false)}
              >
                <Text style={styles.toggleText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Availability per-day (open sheet) */}
          <TouchableOpacity
            style={[styles.nextButton, { marginTop: hp(3) }]}
            onPress={() => dayAvailabilitySheet.current.open()}
          >
            <Text style={styles.nextButtonText}>Select detailed availability</Text>
          </TouchableOpacity>

          {/* Main Next button */}
          <TouchableOpacity onPress={()=>navigation.navigate(screenNames.UPDATE_THIRD)} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* YEAR SHEET */}
      <RbSheetComponent ref={yearSheet} height={hp(100)}>
        <View style={{ }}>
          <PoolHeader onBackPress={() => yearSheet.current.close()} title="Year" />
          <FlatList
            data={years}
            keyExtractor={(item, idx) => `${idx}-${item}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setExperienceYears(item)
                  yearSheet.current.close()
                }}
              >
                <Text style={[styles.listItemText, item === experienceYears && { color: colors.primary }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </RbSheetComponent>

      {/* MONTH SHEET */}
      <RbSheetComponent ref={monthSheet} height={hp(100)}>
        <View>
          <PoolHeader onBackPress={() => monthSheet.current.close()} title="Month" />
          <FlatList
            data={Array.from({ length: 12 }, (_, i) => pad(i))}
            keyExtractor={(item, idx) => `${idx}-${item}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setExperienceMonths(item)
                  monthSheet.current.close()
                }}
              >
                <Text style={[styles.listItemText, item === experienceMonths && { color: colors.primary }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </RbSheetComponent>

      {/* HOUR / MINUTE SHEET */}
      <RbSheetComponent ref={hourMinSheet} height={hp(100)}>
        <View >
          <PoolHeader onBackPress={() => hourMinSheet.current.close()} title="Choose time" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: wp(6) }}>
            <View style={{ flex: 0.48, alignItems: 'center' }}>
              <Text style={styles.pickerTitle}>Hour</Text>
              <FlatList
                style={{ height: hp(50) }}
                data={hours}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelHour(item)}
                    style={{ paddingVertical: hp(1), alignItems: 'center' }}
                  >
                    <Text style={[styles.pickerItem, item === selHour && { color: colors.primary }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={{ flex: 0.48, alignItems: 'center' }}>
              <Text style={styles.pickerTitle}>Min</Text>
              <FlatList
                style={{ height: hp(50) }}
                data={mins}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelMin(item)}
                    style={{ paddingVertical: hp(1), alignItems: 'center' }}
                  >
                    <Text style={[styles.pickerItem, item === selMin && { color: colors.primary }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.nextButton, { marginHorizontal: wp(4) }]}
            onPress={() => {
              // commit to whichever target setter is present
              if (hourTargetSetter && typeof hourTargetSetter === 'function') {
                hourTargetSetter(`${selHour}:${selMin}`)
              } else {
                // fallback - you can implement more behavior if needed
              }
              hourMinSheet.current.close()
            }}
          >
            <Text style={styles.nextButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
      </RbSheetComponent>

      {/* DAY AVAILABILITY SHEET */}
      <RbSheetComponent ref={dayAvailabilitySheet} height={hp(100)}>
        <View >
       <ScrollView>

          <PoolHeader onBackPress={() => dayAvailabilitySheet.current.close()} title="Availability to work" />
          <Text style={styles.subLabel}>Choose days and time you want seeker to be available</Text>

           <FlatList
            data={weekDays}
            keyExtractor={(item) => item.day}
            renderItem={({ item, index }) => (

                <View style={{margin: hp(1)}}>
                     <View style={{ flex: 0.35 }}>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              <View style={styles.dayRow}>
               

                <TouchableOpacity
                  style={[styles.inputBox]}
                  onPress={() => {
                    setSelHour(item.from.split(':')[0])
                    setSelMin(item.from.split(':')[1])
                    // open hourMin and when commit update this row
                    setHourTargetSetter(() => (val) => updateWeekDayTime(index, 'from', val))
                    hourMinSheet.current.open()
                  }}
                >
                  <Text style={styles.inputBoxText}>{item.from}</Text>
                  <Text style={styles.chev}>⏰</Text>
                </TouchableOpacity>

                <Text style={{ alignSelf: 'center', color: '#bfaec2' }}>To</Text>

                <TouchableOpacity
                  style={[styles.inputBox]}
                  onPress={() => {
                    setSelHour(item.to.split(':')[0])
                    setSelMin(item.to.split(':')[1])
                    setHourTargetSetter(() => (val) => updateWeekDayTime(index, 'to', val))
                    hourMinSheet.current.open()
                  }}
                >
                  <Text style={styles.inputBoxText}>{item.to}</Text>
                  <Text style={styles.chev}>⏰</Text>
                </TouchableOpacity>
              </View>
                </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          <TouchableOpacity
            style={[styles.nextButton, { marginHorizontal: wp(4), marginTop: hp(2) }]}
            onPress={() => dayAvailabilitySheet.current.close()}
          >
            <Text style={styles.nextButtonText}>Select</Text>
          </TouchableOpacity>
       </ScrollView>
        </View>
      </RbSheetComponent>

      {/* SALARY SHEET (just a simple list for types) */}
      <RbSheetComponent ref={salarySheet} height={hp(100)}>
        <View >
          <PoolHeader onBackPress={() => salarySheet.current.close()} title="Salary Type" />
          <FlatList
            data={['Hourly', 'Daily', 'Weekly', 'Monthly', 'Fixed']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setSalaryType(item)
                  salarySheet.current.close()
                }}
              >
                <Text style={[styles.listItemText, item === salaryType && { color: colors.primary }]}>{item}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </RbSheetComponent>
    </View>
  )
}

export default JobRequirementScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inputLabel: {
    fontSize: getFontSize(16),
    color: '#7d4d86',
    fontWeight: '700',
    marginBottom: hp(0.8),
  },
  subLabel: { color: '#9aa3b6', marginBottom: hp(1), margin: hp(2) },
  inputBox: {
    borderWidth: 1,
    borderColor: '#d9d7df',
    borderRadius: wp(3),
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: hp(2),
    width: '45%',
  },
  inputBoxText: { fontSize: getFontSize(16), color: '#6f6f80' },
  chev: { fontSize: getFontSize(18), color: '#f39b33' },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) },
  checkbox: {
    width: wp(8),
    height: wp(8),
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: '#ffdca8',
    marginRight: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxTick: { color: '#fff', fontWeight: '800' },
  checkboxLabel: { color: '#7c6a81', fontWeight: '600' },

  smallHeading: { color: '#6b7284', fontWeight: '700', marginBottom: hp(1) },
  rangeText: { fontSize: getFontSize(16), color: '#5f6a78', fontWeight: '700', marginBottom: hp(1) },

  extraRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(1) },
  extraCol: { flex: 0.48 },
  extraLabel: { color: '#6b7284', fontWeight: '600', marginBottom: hp(1) },
  toggleWrap: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#f3ad55',
    borderRadius: wp(10),
    overflow: 'hidden',
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: hp(1.2),
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderRadius: wp(10),
  },
  toggleTextActive: { color: '#fff', fontWeight: '700' },
  toggleText: { color: '#f39b33', fontWeight: '700' },

  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: wp(3),
    paddingVertical: hp(2.2),
    alignItems: 'center',
    marginTop: hp(3),
    marginHorizontal: wp(4),
  },
  nextButtonText: { color: '#fff', fontSize: getFontSize(18), fontWeight: '800' },

  listItem: { paddingVertical: hp(2), paddingHorizontal: wp(4) },
  listItemText: { fontSize: getFontSize(16), color: '#333' },
  separator: { height: 1, backgroundColor: '#eee' },

  dayRow: { flexDirection: 'row',  alignItems: 'center',width: '100%' ,justifyContent:'space-evenly',marginTop:5},
  dayText: { fontSize: getFontSize(16), color: '#6f6f80' },

  pickerTitle: { fontSize: getFontSize(20), color: '#7d4d86', marginBottom: hp(1) },
  pickerItem: { fontSize: getFontSize(18), color: '#69748a' },
})
