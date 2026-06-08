// JobUpdateStep3Screen.js
import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native'
import { wp, hp, getFontSize } from '@/theme'
import { colors } from '../../../../theme/colors'
import PoolHeader from '../../../../core/PoolHeader'
import RbSheetComponent from '../../../../core/RbSheetComponent'

const UpdateThird = () => {
  // State
  const [eduQual, setEduQual] = useState(['12th', 'Master of Arts'])
  const [extraQual, setExtraQual] = useState(['Bachelor of Arts'])
  const [languages, setLanguages] = useState(['English', 'French'])
  const [jobEndDate, setJobEndDate] = useState('12-08-2024 | 12:55')
  const [jobDescription, setJobDescription] = useState('')
  const [taxType, setTaxType] = useState('ABN')

  // Bottom sheets
  const eduSheet = useRef()
  const extraSheet = useRef()
  const langSheet = useRef()
  const dateSheet = useRef()

  // Options
  const eduOptions = [
    '10th',
    '12th',
    'Graphics design',
    'Bachelor of Arts',
    'Master of Arts',
    'Bachelor of Science',
    'Master of Science',
    'Bachelor of Commerce',
    'Bachelor of Engineering',
    'Master of Engineering',
  ]

  const extraOptions = [
    'Digital Marketing',
    'Project Management',
    'UI/UX Design',
    'Data Analysis',
    'Cloud Computing',
    'Cybersecurity',
    'Content Writing',
    'Business Analysis',
  ]

  const langOptions = [
    'English',
    'French',
    'German',
    'Spanish',
    'Italian',
    'Mandarin',
    'Hindi',
    'Arabic',
  ]

  // Date & Time picker state
  const [selectedDate, setSelectedDate] = useState('12-08-2024')
  const [selectedTime, setSelectedTime] = useState('12:55')

  const generateDates = () => {
    const arr = []
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      arr.push(
        d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      )
    }
    return arr
  }
  const dateOptions = generateDates()

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, '0')
    const m = i % 2 === 0 ? '00' : '30'
    return `${h}:${m}`
  })

  // Remove tag
  const removeTag = (list, setList, value) => {
    setList(list.filter((item) => item !== value))
  }

  // Toggle selection
  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <PoolHeader title="Update" step="Step 3/3" />

        <View style={{ padding: wp(4), paddingTop: hp(2) }}>
          {/* Required educational qualification */}
          <Text style={styles.inputLabel}>Required educational qualification</Text>
          <View style={styles.tagInput}>
            {eduQual.map((q) => (
              <View key={q} style={styles.tag}>
                <Text style={styles.tagText}>{q}</Text>
                <TouchableOpacity onPress={() => removeTag(eduQual, setEduQual, q)}>
                  <Text style={styles.tagClose}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => eduSheet.current.open()}>
              <Text style={styles.chev}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Required extra qualification */}
          <Text style={styles.inputLabel}>Required extra qualification</Text>
          <View style={styles.tagInput}>
            {extraQual.map((q) => (
              <View key={q} style={styles.tag}>
                <Text style={styles.tagText}>{q}</Text>
                <TouchableOpacity onPress={() => removeTag(extraQual, setExtraQual, q)}>
                  <Text style={styles.tagClose}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => extraSheet.current.open()}>
              <Text style={styles.chev}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Preferred language */}
          <Text style={styles.inputLabel}>Preferred language</Text>
          <View style={styles.tagInput}>
            {languages.map((l) => (
              <View key={l} style={styles.tag}>
                <Text style={styles.tagText}>{l}</Text>
                <TouchableOpacity onPress={() => removeTag(languages, setLanguages, l)}>
                  <Text style={styles.tagClose}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => langSheet.current.open()}>
              <Text style={styles.chev}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Job end date */}
          <Text style={styles.inputLabel}>Job end date</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => dateSheet.current.open()}
          >
            <Text style={styles.inputBoxText}>{jobEndDate}</Text>
            <Text style={styles.chev}>📅</Text>
          </TouchableOpacity>

          {/* Job description */}
          <Text style={styles.inputLabel}>Job description</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={jobDescription}
            onChangeText={setJobDescription}
            placeholder="Enter job description"
            placeholderTextColor="#9aa3b6"
          />

          {/* Required Tax type */}
          <Text style={styles.inputLabel}>Required Tax type</Text>
          <View style={styles.segment}>
            {['ABN', 'TFN', 'Both'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.segmentItem, taxType === t && styles.segmentActive]}
                onPress={() => setTaxType(t)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    taxType === t && styles.segmentTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Next button */}
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Educational Qualifications Sheet */}
      <RbSheetComponent ref={eduSheet} height={hp(100)}>
        <PoolHeader
          onBackPress={() => eduSheet.current.close()}
          title="Educational Qualifications"
        />
        <FlatList
          data={eduOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const selected = eduQual.includes(item)
            return (
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => toggleSelection(item, eduQual, setEduQual)}
              >
                <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                  {item}
                </Text>
                {selected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            )
          }}
        />
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => eduSheet.current.close()}
        >
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </RbSheetComponent>

      {/* Extra Qualifications Sheet */}
      <RbSheetComponent ref={extraSheet} height={hp(100)}>
        <PoolHeader
          onBackPress={() => extraSheet.current.close()}
          title="Extra Qualifications"
        />
        <FlatList
          data={extraOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const selected = extraQual.includes(item)
            return (
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => toggleSelection(item, extraQual, setExtraQual)}
              >
                <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                  {item}
                </Text>
                {selected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            )
          }}
        />
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => extraSheet.current.close()}
        >
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </RbSheetComponent>

      {/* Languages Sheet */}
      <RbSheetComponent ref={langSheet} height={hp(100)}>
        <PoolHeader
          onBackPress={() => langSheet.current.close()}
          title="Languages"
        />
        <FlatList
          data={langOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const selected = languages.includes(item)
            return (
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => toggleSelection(item, languages, setLanguages)}
              >
                <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                  {item}
                </Text>
                {selected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            )
          }}
        />
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => langSheet.current.close()}
        >
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </RbSheetComponent>

      {/* Date & Time Picker Sheet */}
      <RbSheetComponent ref={dateSheet} height={hp(100)}>
        <PoolHeader
          onBackPress={() => dateSheet.current.close()}
          title="Select Date & Time"
        />

<ScrollView>

        <Text style={styles.sheetLabel}>Select Date</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(3) }}
          data={dateOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const selected = item === selectedDate
            return (
              <TouchableOpacity
                style={[styles.dateChip, selected && styles.dateChipActive]}
                onPress={() => setSelectedDate(item)}
              >
                <Text
                  style={[styles.dateChipText, selected && styles.dateChipTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          }}
        />

        <Text style={styles.sheetLabel}>Select Time</Text>
        <FlatList
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: wp(3) }}
          data={timeOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const selected = item === selectedTime
            return (
              <TouchableOpacity
                style={[styles.timeChip, selected && styles.timeChipActive]}
                onPress={() => setSelectedTime(item)}
              >
                <Text
                  style={[styles.timeChipText, selected && styles.timeChipTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          }}
        />

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            setJobEndDate(`${selectedDate} | ${selectedTime}`)
            dateSheet.current.close()
          }}
        >
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
        <View style={{height:100}}/>
</ScrollView>

      </RbSheetComponent>
    </View>
  )
}

export default UpdateThird

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inputLabel: {
    fontSize: getFontSize(16),
    color: '#7d4d86',
    fontWeight: '700',
    marginBottom: hp(0.8),
  },
  tagInput: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#d9d7df',
    borderRadius: wp(3),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: '#e4dce8',
    borderRadius: wp(4),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(2),
    marginRight: wp(2),
    marginBottom: hp(0.8),
    alignItems: 'center',
  },
  tagText: { color: '#5a4c68', marginRight: wp(1) },
  tagClose: { color: '#5a4c68', fontWeight: '800' },
  chev: { fontSize: getFontSize(18), color: '#9c6aaf', marginLeft: wp(1) },

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
  },
  inputBoxText: { fontSize: getFontSize(16), color: '#6f6f80' },

  textArea: {
    borderWidth: 1,
    borderColor: '#d9d7df',
    borderRadius: wp(3),
    padding: wp(3),
    minHeight: hp(12),
    marginBottom: hp(2),
    textAlignVertical: 'top',
    color: '#4b5563',
  },

  segment: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#f3ad55',
    borderRadius: wp(10),
    overflow: 'hidden',
    marginBottom: hp(3),
  },
  segmentItem: {
    flex: 1,
    paddingVertical: hp(1.6),
    alignItems: 'center',
  },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: '#f39b33', fontWeight: '700' },
  segmentTextActive: { color: '#fff', fontWeight: '700' },

  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: wp(3),
    paddingVertical: hp(2.2),
    alignItems: 'center',
    marginTop: hp(3),
  },
  nextButtonText: { color: '#fff', fontSize: getFontSize(18), fontWeight: '800' },

  // Dropdown option rows
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: { fontSize: getFontSize(16), color: '#444' },
  optionTextActive: { color: colors.primary, fontWeight: '700' },
  checkMark: { color: colors.primary, fontSize: getFontSize(18) },

  // Bottom sheet buttons
  selectButton: {
    backgroundColor: colors.primary,
    borderRadius: wp(3),
    paddingVertical: hp(2),
    alignItems: 'center',
    margin: wp(4),
  },
  selectButtonText: {
    color: '#fff',
    fontSize: getFontSize(18),
    fontWeight: '700',
  },

  // Date & time chips
  sheetLabel: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: '#7d4d86',
    marginVertical: hp(1.5),
    marginLeft: wp(4),
  },
  dateChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    marginRight: wp(2),
    backgroundColor: '#fff',
  },
  dateChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateChipText: { fontSize: getFontSize(14), color: '#444' },
  dateChipTextActive: { color: '#fff', fontWeight: '700' },

  timeChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    margin: wp(1),
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeChipText: { fontSize: getFontSize(14), color: '#444' },
  timeChipTextActive: { color: '#fff', fontWeight: '700' },
})
