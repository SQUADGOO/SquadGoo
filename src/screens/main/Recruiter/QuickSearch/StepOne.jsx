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
import EducationSelector from '@/components/EducationSelector'
import MultiSelectSheet from '@/components/MultiSelectSheet'
import { screenNames } from '@/navigation/screenNames'

const JOB_TYPE_OPTIONS = [
  'Casual',
  'Full time',
  'Part time',
  'Temporary',
  'Contract',
  'Volunteer',
  'Internship',
  'Graduate',
  'Apprenticeship',
]

const EXTRA_QUALIFICATIONS_OPTIONS = [
  { key: 'white_card', title: 'White Card (Construction)' },
  { key: 'police_check', title: 'Police Check' },
  { key: 'wwcc', title: 'Working With Children Check (WWCC)' },
  { key: 'ndis', title: 'NDIS Worker Screening Check' },
  { key: 'first_aid', title: 'First Aid Certificate' },
  { key: 'cpr', title: 'CPR Certificate' },
  { key: 'rsa', title: 'RSA (Responsible Service of Alcohol)' },
  { key: 'rcg', title: 'RCG (Responsible Conduct of Gambling)' },
  { key: 'food_handling', title: 'Food Handling Certificate' },
  { key: 'covid_vax', title: 'COVID-19 Vaccination Certificate' },
  { key: 'manual_handling', title: 'Manual Handling Certificate' },
  { key: 'driver_full', title: 'Driver Licence (Full)' },
  { key: 'driver_provisional', title: 'Provisional Licence (P1/P2)' },
  {
    key: 'hr_mr_lr_hc_mc',
    title: 'HR/MR/LR/HC/MC Licence (specify)',
    requiresText: true,
    textPlaceholder: 'Specify HR/MR/LR/HC/MC',
  },
  { key: 'forklift', title: 'Forklift Licence' },
  { key: 'bus_authority', title: 'Bus Driver Authority' },
  { key: 'taxi_accreditation', title: 'Taxi Driver Accreditation' },
  { key: 'dangerous_goods', title: 'Dangerous Goods Licence' },
  {
    key: 'high_risk',
    title: 'High Risk Work Licence (specify)',
    requiresText: true,
    textPlaceholder: 'Please specify',
  },
  { key: 'ewp', title: 'EWP Ticket' },
  { key: 'traffic_control', title: 'Traffic Control Ticket' },
  { key: 'asbestos', title: 'Asbestos Removal Licence' },
  { key: 'confined_space', title: 'Confined Space Entry Ticket' },
  { key: 'working_heights', title: 'Working at Heights Ticket' },
  { key: 'electrical', title: 'Electrical Licence' },
  { key: 'plumbing', title: 'Plumbing Licence' },
  { key: 'gas_fitter', title: 'Gas Fitter Licence' },
  { key: 'wwvp', title: 'WWVP Card' },
  { key: 'ahpra', title: 'AHPRA Registration' },
  { key: 'med_admin', title: 'Medication Administration Certificate' },
  { key: 'mental_health_first_aid', title: 'Mental Health First Aid' },
  { key: 'disability_support', title: 'Disability Support Worker Certificate' },
  { key: 'barista', title: 'Barista Certificate' },
  { key: 'food_safety', title: 'Food Safety Supervisor Certificate' },
  { key: 'gaming_licence', title: 'Gaming Licence' },
  { key: 'order_picker', title: 'Order Picker Licence' },
  { key: 'warehouse_induction', title: 'Warehouse Induction Card' },
  { key: 'security_licence', title: 'Security Licence' },
  { key: 'msic_asic', title: 'MSIC/ASIC Card' },
  { key: 'boat_licence', title: 'Boat Licence' },
  { key: 'firearms_licence', title: 'Firearms Licence' },
  { key: 'q_fever', title: 'Q Fever Vaccination Card' },
  { key: 'animals_permit', title: 'Working With Animals Permit' },
  { key: 'other', title: 'Other (please specify)', requiresText: true, textPlaceholder: 'Please specify' },
]

const PREFERRED_LANGUAGES_OPTIONS = [
  { key: 'english', title: 'English' },
  { key: 'mandarin', title: 'Mandarin (Chinese)' },
  { key: 'cantonese', title: 'Cantonese' },
  { key: 'hindi', title: 'Hindi' },
  { key: 'punjabi', title: 'Punjabi' },
  { key: 'arabic', title: 'Arabic' },
  { key: 'vietnamese', title: 'Vietnamese' },
  { key: 'tagalog', title: 'Tagalog (Filipino)' },
  { key: 'spanish', title: 'Spanish' },
  { key: 'italian', title: 'Italian' },
  { key: 'greek', title: 'Greek' },
  { key: 'korean', title: 'Korean' },
  { key: 'japanese', title: 'Japanese' },
  { key: 'thai', title: 'Thai' },
  { key: 'tamil', title: 'Tamil' },
  { key: 'urdu', title: 'Urdu' },
  { key: 'nepali', title: 'Nepali' },
  { key: 'turkish', title: 'Turkish' },
  { key: 'indonesian', title: 'Indonesian' },
  { key: 'samoan', title: 'Samoan' },
  { key: 'fijian', title: 'Fijian' },
  { key: 'german', title: 'German' },
  { key: 'french', title: 'French' },
  { key: 'portuguese', title: 'Portuguese' },
  { key: 'russian', title: 'Russian' },
  { key: 'serbian', title: 'Serbian' },
  { key: 'croatian', title: 'Croatian' },
  { key: 'sinhalese', title: 'Sinhalese' },
  { key: 'bengali', title: 'Bengali' },
  { key: 'dari', title: 'Dari' },
  { key: 'pashto', title: 'Pashto' },
  { key: 'malay', title: 'Malay' },
  { key: 'burmese', title: 'Burmese' },
  { key: 'khmer', title: 'Khmer (Cambodian)' },
  { key: 'polish', title: 'Polish' },
  { key: 'macedonian', title: 'Macedonian' },
  { key: 'afrikaans', title: 'Afrikaans' },
  { key: 'other', title: 'Other (please specify)', requiresText: true, textPlaceholder: 'Please specify' },
]

const QuickSearchStepOne = ({ navigation, route }) => {
  // Draft edit mode params
  const editMode = route?.params?.editMode
  const draftJob = route?.params?.draftJob
  const existingJobId = route?.params?.jobId || draftJob?.id

  const step1Draft = draftJob?.rawData?.step1 || {}

  const [jobCategory, setJobCategory] = useState(draftJob?.jobCategory || null)
  const [jobSubCategory, setJobSubCategory] = useState(draftJob?.jobSubCategory || null)
  const [jobTitle, setJobTitle] = useState(step1Draft?.jobTitle || draftJob?.jobTitle || draftJob?.jobSubCategory || '')
  const [jobType, setJobType] = useState(step1Draft?.jobType || draftJob?.jobType || '')
  const [requiredEducation, setRequiredEducation] = useState(
    step1Draft?.requiredEducation || draftJob?.requiredEducation || null,
  )
  const [preferredLanguages, setPreferredLanguages] = useState(
    step1Draft?.preferredLanguages || draftJob?.preferredLanguages || [{ key: 'english', title: 'English' }],
  )
  const [extraQualifications, setExtraQualifications] = useState(
    step1Draft?.extraQualifications || draftJob?.extraQualifications || [],
  )

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      freshersCanApply: !!(step1Draft?.freshersCanApply ?? draftJob?.freshersCanApply),
      experienceYear: step1Draft?.experienceYear ?? draftJob?.experienceYear ?? '0 Year',
      experienceMonth: step1Draft?.experienceMonth ?? draftJob?.experienceMonth ?? '0 Month',
      staffCount: draftJob?.staffCount ? String(draftJob.staffCount) : '',
      rolesAndResponsibilities:
        step1Draft?.rolesAndResponsibilities ?? draftJob?.rolesAndResponsibilities ?? '',
      requiredUniforms: step1Draft?.requiredUniforms ?? draftJob?.requiredUniforms ?? '',
    },
  })

  // Prefill form when opening in edit mode
  useEffect(() => {
    if (editMode && draftJob) {
      methods.reset({
        freshersCanApply: !!(step1Draft?.freshersCanApply ?? draftJob?.freshersCanApply),
        experienceYear: step1Draft?.experienceYear ?? draftJob?.experienceYear ?? '0 Year',
        experienceMonth: step1Draft?.experienceMonth ?? draftJob?.experienceMonth ?? '0 Month',
        staffCount: draftJob.staffCount ? String(draftJob.staffCount) : '',
        rolesAndResponsibilities:
          step1Draft?.rolesAndResponsibilities ?? draftJob?.rolesAndResponsibilities ?? '',
        requiredUniforms: step1Draft?.requiredUniforms ?? draftJob?.requiredUniforms ?? '',
      })
      if (draftJob.jobCategory) setJobCategory(draftJob.jobCategory)
      if (draftJob.jobSubCategory) setJobSubCategory(draftJob.jobSubCategory)
      setJobType(step1Draft?.jobType || draftJob?.jobType || '')
      setRequiredEducation(step1Draft?.requiredEducation || draftJob?.requiredEducation || null)
      setPreferredLanguages(
        step1Draft?.preferredLanguages ||
          draftJob?.preferredLanguages ||
          [{ key: 'english', title: 'English' }],
      )
      setExtraQualifications(step1Draft?.extraQualifications || draftJob?.extraQualifications || [])
    }
  }, [editMode, draftJob])

  const { watch, setValue, handleSubmit } = methods

  const experienceYear = watch('experienceYear')
  const experienceMonth = watch('experienceMonth')
  const freshersCanApply = watch('freshersCanApply')

  const yearSheetRef = useRef(null)
  const monthSheetRef = useRef(null)
  const jobTypeSheetRef = useRef(null)

  const handleJobCategorySelect = (data) => {
    setJobCategory(data.category)
    setJobSubCategory(data.subCategory)
    if (data.subCategory) {
      setJobTitle(data.subCategory)
    }
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

  const jobTypeOptions = JOB_TYPE_OPTIONS.map((t, idx) => ({ id: idx + 1, title: t }))

  // Mutual exclusion: Freshers vs experience inputs
  useEffect(() => {
    const yearIsZero = String(experienceYear) === '0 Year'
    const monthIsZero = String(experienceMonth) === '0 Month'

    if (freshersCanApply) {
      if (!yearIsZero) setValue('experienceYear', '0 Year', { shouldValidate: true })
      if (!monthIsZero) setValue('experienceMonth', '0 Month', { shouldValidate: true })
    } else {
      // If recruiter selected any experience, keep freshers off
      if (!yearIsZero || !monthIsZero) {
        // already off
      }
    }
  }, [freshersCanApply, experienceYear, experienceMonth, setValue])

  const handleNext = () => {
    handleSubmit((data) => {
      if (!jobTitle.trim()) {
        Alert.alert('Job title required', 'Please enter a job title or select a job category.')
        return
      }

      if (!jobType) {
        Alert.alert('Job type required', 'Please select a job type.')
        return
      }

      if (!data.freshersCanApply) {
        const yearIsZero = String(data.experienceYear) === '0 Year'
        const monthIsZero = String(data.experienceMonth) === '0 Month'
        if (yearIsZero && monthIsZero) {
          Alert.alert(
            'Experience required',
            'Please select years or months of experience, or choose “Freshers can also apply”.',
          )
          return
        }
      }

      const staffNumber = Number(data.staffCount)
      if (Number.isNaN(staffNumber) || staffNumber <= 0) {
        Alert.alert(
          'Invalid staff number',
          'Please enter a valid staff count greater than 0.',
        )
        return
      }

      if (!String(data.rolesAndResponsibilities || '').trim()) {
        Alert.alert('Required', 'Please enter Roles and responsibilities.')
        return
      }

      if (!String(data.requiredUniforms || '').trim()) {
        Alert.alert('Required', 'Please enter Required uniforms.')
        return
      }

      if (!requiredEducation) {
        Alert.alert('Required', 'Please select required education qualification.')
        return
      }

      const quickSearchStep1Data = {
        jobTitle: jobTitle.trim(),
        jobCategory: jobCategory,
        jobSubCategory: jobSubCategory,
        jobType,
        freshersCanApply: !!data.freshersCanApply,
        experienceYear: data.freshersCanApply ? null : data.experienceYear,
        experienceMonth: data.freshersCanApply ? null : data.experienceMonth,
        staffCount: staffNumber,
        rolesAndResponsibilities: data.rolesAndResponsibilities,
        requiredUniforms: data.requiredUniforms,
        requiredEducation,
        preferredLanguages,
        extraQualifications,
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
              Step 1/5
            </AppText>
          }
        />

        <View style={styles.container}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Job Category */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Job category*
            </AppText>
            <JobCategorySelector
              onSelect={handleJobCategorySelect}
              selectedCategory={jobCategory}
              selectedSubCategory={jobSubCategory}
              placeholder="Select job category"
            />

            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Job title*
            </AppText>
            <AppInputField
              placeholder="Enter job title"
              value={jobTitle}
              onChangeText={setJobTitle}
            />

            {/* Job Type */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Job type*
            </AppText>
            <TouchableOpacity onPress={() => jobTypeSheetRef.current?.open()} activeOpacity={0.7}>
              <View pointerEvents="none">
                <AppInputField
                  placeholder="Select job type"
                  value={jobType}
                  editable={false}
                />
              </View>
            </TouchableOpacity>


            {/* Total Experience */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Total experience needed
            </AppText>

            {/* Freshers can also apply */}
            {(freshersCanApply ||
              (String(experienceYear) === '0 Year' &&
                String(experienceMonth) === '0 Month')) ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.fresherRow}
                onPress={() => setValue('freshersCanApply', !freshersCanApply, { shouldValidate: true })}
              >
                <View style={[styles.fresherCheckbox, freshersCanApply && styles.fresherCheckboxActive]} />
                <AppText variant={Variant.body} style={styles.fresherLabel}>
                  Freshers can also apply
                </AppText>
              </TouchableOpacity>
            ) : null}

            {!freshersCanApply ? (
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
            ) : null}

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

            {/* Roles and responsibilities */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Roles and responsibilities*
            </AppText>
            <FormField
              name="rolesAndResponsibilities"
              placeholder="ROLES AND RESPONSIBILITIES"
              multiline
              inputWrapperStyle={styles.textArea}
              rules={{ required: 'This field is required' }}
            />

            {/* Required uniforms */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Required uniforms*
            </AppText>
            <FormField
              name="requiredUniforms"
              placeholder="Required Uniforms"
              multiline
              inputWrapperStyle={styles.textArea}
              rules={{ required: 'This field is required' }}
            />

            {/* Extra qualifications */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Extra qualifications (optional)
            </AppText>
            <MultiSelectSheet
              title="Extra Qualifications"
              placeholder="Select all that apply"
              options={EXTRA_QUALIFICATIONS_OPTIONS}
              selectedItems={extraQualifications}
              onChange={setExtraQualifications}
            />

            {/* Required education */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Required education qualification*
            </AppText>
            <EducationSelector
              selectedEducation={requiredEducation}
              onSelect={setRequiredEducation}
              placeholder="Select education level"
              courseOnly
            />

            {/* Preferred languages */}
            <AppText variant={Variant.bodyMedium} style={styles.label}>
              Preferred languages
            </AppText>
            <MultiSelectSheet
              title="Preferred Languages"
              placeholder="English (default)"
              options={PREFERRED_LANGUAGES_OPTIONS}
              selectedItems={preferredLanguages}
              onChange={setPreferredLanguages}
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

        <RbSheetComponent ref={jobTypeSheetRef} height={hp(55)}>
          <BottomDataSheet
            optionsData={jobTypeOptions}
            onClose={() => jobTypeSheetRef.current?.close()}
            onSelect={(item) => {
              setJobType(item.title)
              jobTypeSheetRef.current?.close()
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
  textArea: {
    minHeight: hp(12),
  },
  fresherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  fresherCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: wp(2),
    backgroundColor: colors.white,
  },
  fresherCheckboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  fresherLabel: {
    color: colors.secondary,
  },
  buttonContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
})