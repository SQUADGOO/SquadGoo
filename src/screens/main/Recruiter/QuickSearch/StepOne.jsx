// QuickSearchStepOne.js - Job Requirements
import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppInputField from '@/core/AppInputField'
import FormField from '@/core/FormField'
import AppHeader from '@/core/AppHeader'
import RbSheetComponent from '@/core/RbSheetComponent'
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet'
import JobCategorySelector from '@/components/JobCategorySelector'
import { screenNames } from '@/navigation/screenNames'
import { INDUSTRY_OPTIONS } from '@/constants/recruiterOptions'

const QuickSearchStepOne = ({ navigation, route }) => {
  // Draft edit mode params
  const editMode = route?.params?.editMode
  const draftJob = route?.params?.draftJob
  const existingJobId = route?.params?.jobId || draftJob?.id

  const [jobCategory, setJobCategory] = useState(draftJob?.jobCategory || null)
  const [jobSubCategory, setJobSubCategory] = useState(draftJob?.jobSubCategory || null)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      industry: draftJob?.industry || '',
      experienceYear: draftJob?.experienceYear || '0 Year',
      experienceMonth: draftJob?.experienceMonth || '0 Month',
      staffCount: draftJob?.staffCount ? String(draftJob.staffCount) : '',
    },
  })

  // Prefill form when opening in edit mode
  useEffect(() => {
    if (editMode && draftJob) {
      methods.reset({
        industry: draftJob.industry || '',
        experienceYear: draftJob.experienceYear || '0 Year',
        experienceMonth: draftJob.experienceMonth || '0 Month',
        staffCount: draftJob.staffCount ? String(draftJob.staffCount) : '',
      })
      if (draftJob.jobCategory) setJobCategory(draftJob.jobCategory)
      if (draftJob.jobSubCategory) setJobSubCategory(draftJob.jobSubCategory)
    }
  }, [editMode, draftJob])

  const { watch, setValue, handleSubmit } = methods

  const industry = watch('industry')
  const experienceYear = watch('experienceYear')
  const experienceMonth = watch('experienceMonth')

  const industrySheetRef = useRef(null)
  const yearSheetRef = useRef(null)
  const monthSheetRef = useRef(null)

  const industryOptions = INDUSTRY_OPTIONS

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
    handleSubmit((data) => {
      if (!jobCategory && !jobSubCategory) {
        Alert.alert('Job title required', 'Please select a job category or subcategory.')
        return
      }

      if (!data.industry) {
        Alert.alert('Industry required', 'Please select an industry.')
        return
      }

      if (!data.experienceYear || !data.experienceMonth) {
        Alert.alert(
          'Experience required',
          'Please select both years and months of total experience needed.',
        )
        return
      }

      const staffNumber = Number(data.staffCount)
      if (Number.isNaN(staffNumber) || staffNumber <= 0) {
        Alert.alert(
          'Invalid staff number',
          'Please enter a valid staff count greater than 0.',
        )
        return
      }

      const quickSearchStep1Data = {
        jobTitle: jobSubCategory || jobCategory,
        jobCategory: jobCategory,
        jobSubCategory: jobSubCategory,
        industry: data.industry,
        experienceYear: data.experienceYear,
        experienceMonth: data.experienceMonth,
        staffCount: staffNumber,
      }

      console.log('Quick Search Step 1 Data:', quickSearchStep1Data)
      navigation.navigate(screenNames.QUICK_SEARCH_STEPTWO, {
        quickSearchStep1Data,
        editMode: !!editMode,
        draftJob,
        jobId: existingJobId,
      })
    })()
  }

  return (
    <FormProvider {...methods}>
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
            <FormField
              name="staffCount"
              placeholder="Total staff number"
              keyboardType="numeric"
              rules={{
                required: 'Staff count is required',
                validate: value =>
                  value.trim() !== '' &&
                  !Number.isNaN(Number(value)) &&
                  Number(value) > 0 ||
                  'Enter a valid staff number greater than 0',
              }}
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
              setValue('industry', item.title, { shouldValidate: true })
              industrySheetRef.current?.close()
            }}
          />
        </RbSheetComponent>

        <RbSheetComponent ref={yearSheetRef} height={hp(50)}>
          <BottomDataSheet
            optionsData={experienceYearOptions}
            onClose={() => yearSheetRef.current?.close()}
            onSelect={(item) => {
              setValue('experienceYear', item.title, { shouldValidate: true })
              yearSheetRef.current?.close()
            }}
          />
        </RbSheetComponent>

        <RbSheetComponent ref={monthSheetRef} height={hp(50)}>
          <BottomDataSheet
            optionsData={experienceMonthOptions}
            onClose={() => monthSheetRef.current?.close()}
            onSelect={(item) => {
              setValue('experienceMonth', item.title, { shouldValidate: true })
              monthSheetRef.current?.close()
            }}
          />
        </RbSheetComponent>
      </>
    </FormProvider>
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