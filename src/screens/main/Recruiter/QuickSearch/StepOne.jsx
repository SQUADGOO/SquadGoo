// JobRequirementScreen.js
import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppInputField from '@/core/AppInputField'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'

const StepOne = ({ navigation }) => {
  const [jobTitle, setJobTitle] = useState('')
  const [industry, setIndustry] = useState('')
  const [experienceYear, setExperienceYear] = useState('0 Year')
  const [experienceMonth, setExperienceMonth] = useState('0 Month')
  const [staffCount, setStaffCount] = useState('')

  const handleNext = () => {
    const jobData = {
      jobTitle,
      industry,
      experience: { year: experienceYear, month: experienceMonth },
      staffCount,
    }
    console.log('Job Requirement Data:', jobData)
    // navigate forward
    navigation.navigate(screenNames.QUICK_SEARCH_STEPTWO, { jobData })
  }

  return (
    <>
      <AppHeader title="Job Requirements" showTopIcons={false} />

      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Job Title */}
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Job title*
          </AppText>
          <AppInputField
            placeholder="Search"
            value={jobTitle}
            onChangeText={setJobTitle}
          />

          {/* Industry */}
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Industry*
          </AppText>
          <AppInputField
            placeholder="Search"
            value={industry}
            onChangeText={setIndustry}
          />

          {/* Total Experience */}
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Total experience needed*
          </AppText>
          <View style={styles.experienceRow}>
            <AppInputField
              placeholder="0 Year"
              value={experienceYear}
              onChangeText={setExperienceYear}
              style={styles.experienceInput}
            />
            <AppInputField
              placeholder="0 Month"
              value={experienceMonth}
              onChangeText={setExperienceMonth}
              style={styles.experienceInput}
            />
          </View>

          {/* Staff Count */}
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            How many staff looking for*
          </AppText>
          <AppInputField
            placeholder="Total staff number"
            value={staffCount}
            onChangeText={setStaffCount}
            keyboardType="numeric"
          />
        </ScrollView>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            bgColor="#F59E0B"
            textColor="#FFFFFF"
          />
        </View>
      </View>
    </>
  )
}

export default StepOne

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '500',
    marginBottom: hp(1),
    marginTop: hp(2),
  },
  experienceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  experienceInput: {
    width: wp(40),
  },
  buttonContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
})
