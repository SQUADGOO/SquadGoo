// JobDetailsScreen.js
import React, { useState, useRef } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import RbSheetComponent from '@/core/RbSheetComponent'
import AppHeader from '@/core/AppHeader'
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet'
import { screenNames } from '@/navigation/screenNames'

const StepThreeQuickSearch = ({ navigation }) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      salaryType: null,
      salaryMin: '',
      salaryMax: '',
      industry: null,
      expYear: null,
      expMonth: null,
      jobDescription: '',
      requirement: ''
    }
  })

  const { setValue, watch } = methods

  // Refs for bottom sheets
  const salaryTypeSheetRef = useRef(null)
  const industrySheetRef = useRef(null)
  const expYearSheetRef = useRef(null)
  const expMonthSheetRef = useRef(null)

  // Options
  const salaryTypeOptions = [
    { id: 1, title: 'Hourly' },
    { id: 2, title: 'Daily' },
    { id: 3, title: 'Weekly' },
    { id: 4, title: 'Monthly' },
    { id: 5, title: 'Yearly' },
  ]

  const industryOptions = [
    { id: 1, title: 'Construction' },
    { id: 2, title: 'Hospitality' },
    { id: 3, title: 'Healthcare' },
    { id: 4, title: 'IT & Software' },
    { id: 5, title: 'Retail' },
    { id: 6, title: 'Education' },
  ]

  const yearOptions = Array.from({ length: 11 }, (_, i) => ({ id: i, title: `${i} Year` }))
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({ id: i, title: `${i} Month` }))

  // Handlers
  const handleSelect = (name, value, ref) => {
    setValue(name, value, { shouldValidate: true, shouldDirty: true })
    ref?.current?.close()
  }

  const onSubmit = (data) => {
    console.log('Job Details Data:', data)
    navigation.navigate(screenNames.QUICK_SEARCH_STEPFOUR, { formData: data })
  }

  const handleNext = () => {
    methods.handleSubmit(onSubmit)()
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        showTopIcons={false}
        title="Job Details"
        rightComponent={
          <TouchableOpacity activeOpacity={0.7}>
            <AppText variant={Variant.body} style={styles.stepText}>
              Step 3/3
            </AppText>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Salary Type */}
        <FormField
          name="salaryType"
          label="Salary type"
          placeholder="Select"
          value={watch('salaryType')}
          onPressField={() => salaryTypeSheetRef.current?.open()}
        />

        {/* Salary Range */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <FormField
              name="salaryMin"
              label="Salary you are offering*"
              placeholder="$ Minimum"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.toText}>
            <AppText variant={Variant.bodyMedium}>To</AppText>
          </View>
          <View style={[styles.halfInput,{top:10}]}>
            <FormField
              name="salaryMax"
              placeholder="$ Maximum"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Industry */}
        <FormField
          name="industry"
          label="Industry"
          placeholder="Search"
          value={watch('industry')}
          onPressField={() => industrySheetRef.current?.open()}
        />

        {/* Experience */}
        <AppText variant={Variant.bodyMedium} style={styles.label}>
          Total experience needed
        </AppText>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <FormField
              name="expYear"
              placeholder="0 Year"
              value={watch('expYear')}
              onPressField={() => expYearSheetRef.current?.open()}
            />
          </View>
          <View style={styles.halfInput}>
            <FormField
              name="expMonth"
              placeholder="0 Month"
              value={watch('expMonth')}
              onPressField={() => expMonthSheetRef.current?.open()}
            />
          </View>
        </View>

        {/* Job Description */}
        <FormField
          name="jobDescription"
          label="Short job description*"
          placeholder="Enter small job description"
          multiline
          numberOfLines={4}
          maxLength={1000}
        />
        <AppText style={styles.wordLimit}>
          Word limit: {watch('jobDescription')?.length || 0}/1000
        </AppText>

        {/* Requirement */}
        <FormField
          name="requirement"
          label="Requirement*"
          placeholder="Enter requirement like Uniform, Safety boots, License etc"
          multiline
          numberOfLines={4}
          maxLength={1000}
        />
        <AppText style={styles.wordLimit}>
          Word limit: {watch('requirement')?.length || 0}/1000
        </AppText>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            textColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      {/* Salary Type Sheet */}
      <RbSheetComponent ref={salaryTypeSheetRef} height={hp(70)} bgColor={colors.white}>
        <BottomDataSheet
          optionsData={salaryTypeOptions}
          onSelect={(item) => handleSelect('salaryType', item.title, salaryTypeSheetRef)}
          onClose={() => salaryTypeSheetRef.current?.close()}
        />
      </RbSheetComponent>

      {/* Industry Sheet */}
      <RbSheetComponent ref={industrySheetRef} height={hp(70)} bgColor={colors.white}>
        <BottomDataSheet
          optionsData={industryOptions}
          onSelect={(item) => handleSelect('industry', item.title, industrySheetRef)}
          onClose={() => industrySheetRef.current?.close()}
        />
      </RbSheetComponent>

      {/* Experience Year Sheet */}
      <RbSheetComponent ref={expYearSheetRef} height={hp(70)} bgColor={colors.white}>
        <BottomDataSheet
          optionsData={yearOptions}
          onSelect={(item) => handleSelect('expYear', item.title, expYearSheetRef)}
          onClose={() => expYearSheetRef.current?.close()}
        />
      </RbSheetComponent>

      {/* Experience Month Sheet */}
      <RbSheetComponent ref={expMonthSheetRef} height={hp(70)} bgColor={colors.white}>
        <BottomDataSheet
          optionsData={monthOptions}
          onSelect={(item) => handleSelect('expMonth', item.title, expMonthSheetRef)}
          onClose={() => expMonthSheetRef.current?.close()}
        />
      </RbSheetComponent>
    </FormProvider>
  )
}

export default StepThreeQuickSearch

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1.5),
  },
  halfInput: {
    flex: 1,
  },
  toText: {
    paddingHorizontal: wp(2),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    marginBottom: hp(1),
    fontWeight: '500',
  },
  wordLimit: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(2),
  },
  buttonContainer: {
    marginBottom: hp(6),
  },
})
