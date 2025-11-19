// QuickSearchStepOne.js - Job Requirements
import React, { useState, useRef } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppInputField from '@/core/AppInputField'
import AppHeader from '@/core/AppHeader'
import RbSheetComponent from '@/core/RbSheetComponent'
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet'
import JobCategorySelector from '@/components/JobCategorySelector'
import { screenNames } from '@/navigation/screenNames'

const QuickSearchStepOne = ({ navigation }) => {
  const [jobCategory, setJobCategory] = useState(null)
  const [jobSubCategory, setJobSubCategory] = useState(null)
  const [industry, setIndustry] = useState('')
  const [experienceYear, setExperienceYear] = useState('0 Year')
  const [experienceMonth, setExperienceMonth] = useState('0 Month')
  const [staffCount, setStaffCount] = useState('')

  const industrySheetRef = useRef(null)
  const yearSheetRef = useRef(null)
  const monthSheetRef = useRef(null)

  const industryOptions = [
    { id: 1, title: 'Construction' },
    { id: 2, title: 'Healthcare' },
    { id: 3, title: 'Technology' },
    { id: 4, title: 'Hospitality' },
    { id: 5, title: 'Retail' },
    { id: 6, title: 'Education' },
    { id: 7, title: 'Manufacturing' },
    { id: 8, title: 'Transportation' }
  ]

  const handleJobCategorySelect = (data) => {
    setJobCategory(data.category)
    setJobSubCategory(data.subCategory)
  }

  const experienceYearOptions = [
    { id: 1, title: '0 Year' },
    { id: 2, title: '1 Year' },
    { id: 3, title: '2 Years' },
    { id: 4, title: '3 Years' },
    { id: 5, title: '4 Years' },
    { id: 6, title: '5+ Years' }
  ]

  const experienceMonthOptions = [
    { id: 1, title: '0 Month' },
    { id: 2, title: '1 Month' },
    { id: 3, title: '2 Months' },
    { id: 4, title: '3 Months' },
    { id: 5, title: '6 Months' },
    { id: 6, title: '9 Months' },
    { id: 7, title: '11 Months' }
  ]

  const handleNext = () => {
    const quickSearchStep1Data = {
      jobTitle: jobSubCategory || jobCategory,
      jobCategory: jobCategory,
      jobSubCategory: jobSubCategory,
      industry,
      experienceYear,
      experienceMonth,
      staffCount,
    }
    console.log('Quick Search Step 1 Data:', quickSearchStep1Data)
    navigation.navigate(screenNames.QUICK_SEARCH_STEPTWO, { quickSearchStep1Data })
  }

  return (
    <>
      <AppHeader 
        title="Job Requirements" 
        showTopIcons={false}
        rightComponent={
          <AppText variant={Variant.body} style={styles.stepText}>
            Step 1/4
          </AppText>
        }
      />

      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Job Title */}
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Job title*
          </AppText>
          <JobCategorySelector
            onSelect={handleJobCategorySelect}
            selectedCategory={jobCategory}
            selectedSubCategory={jobSubCategory}
            placeholder="Select job category"
          />

          {/* Industry */}
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Industry*
          </AppText>
          <TouchableOpacity onPress={() => industrySheetRef.current?.open()} activeOpacity={0.7}>
            <View pointerEvents="none">
              <AppInputField
                placeholder="Search"
                value={industry}
                editable={false}
              />
            </View>
          </TouchableOpacity>

          {/* Total Experience */}
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Total experience needed*
          </AppText>
          <View style={styles.experienceRow}>
            <TouchableOpacity 
              style={styles.experienceInput}
              onPress={() => yearSheetRef.current?.open()}
              activeOpacity={0.7}
            >
              <View pointerEvents="none">
                <AppInputField
                  placeholder="0 Year"
                  value={experienceYear}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.experienceInput}
              onPress={() => monthSheetRef.current?.open()}
              activeOpacity={0.7}
            >
              <View pointerEvents="none">
                <AppInputField
                  placeholder="0 Month"
                  value={experienceMonth}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
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

      {/* Bottom Sheets */}
      <RbSheetComponent ref={industrySheetRef} height={hp(60)}>
        <BottomDataSheet
          optionsData={industryOptions}
          onClose={() => industrySheetRef.current?.close()}
          onSelect={(item) => {
            setIndustry(item.title)
            industrySheetRef.current?.close()
          }}
        />
      </RbSheetComponent>

      <RbSheetComponent ref={yearSheetRef} height={hp(50)}>
        <BottomDataSheet
          optionsData={experienceYearOptions}
          onClose={() => yearSheetRef.current?.close()}
          onSelect={(item) => {
            setExperienceYear(item.title)
            yearSheetRef.current?.close()
          }}
        />
      </RbSheetComponent>

      <RbSheetComponent ref={monthSheetRef} height={hp(50)}>
        <BottomDataSheet
          optionsData={experienceMonthOptions}
          onClose={() => monthSheetRef.current?.close()}
          onSelect={(item) => {
            setExperienceMonth(item.title)
            monthSheetRef.current?.close()
          }}
        />
      </RbSheetComponent>
    </>
  )
}

export default QuickSearchStepOne

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
  stepText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: getFontSize(16),
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