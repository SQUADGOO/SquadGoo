import React, { useEffect, useMemo, useRef, useState } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize, typography } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import RbSheetComponent from '@/core/RbSheetComponent'
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet'
import globalStyles from '@/styles/globalStyles'
import CustomToggle from '@/core/CustomToggle'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import { showToast, toastTypes } from '@/utilities/toastConfig'
import {
  EXPERIENCE_MONTH_OPTIONS,
  EXPERIENCE_YEAR_OPTIONS,
  SALARY_TYPE_OPTIONS,
} from '@/constants/recruiterOptions'

const StepTwo = ({ navigation, route }) => {
  const editMode = route?.params?.editMode
  const draftJob = route?.params?.draftJob
  const existingJobId = route?.params?.jobId || draftJob?.id
  const detailedAvailabilityFromRoute = route?.params?.detailedAvailability
  const returnToPreview = route?.params?.returnToPreview
  const previewData = route?.params?.previewData

  const parseExperienceToForm = (experience) => {
    if (!experience || typeof experience !== 'string') return null
    const yearsMatch = experience.match(/(\d+)\s*Year/i)
    const monthsMatch = experience.match(/(\d+)\s*Month/i)
    const years = yearsMatch ? `${yearsMatch[1]} Year${yearsMatch[1] === '1' ? '' : 's'}` : null
    const months = monthsMatch ? `${monthsMatch[1]} Month${monthsMatch[1] === '1' ? '' : 's'}` : null
    return { years, months }
  }

  const normalizeSalaryType = (value) => {
    const t = String(value || '').trim()
    if (!t) return 'Hourly Rate'
    // Back-compat for older saved values
    if (t === 'Hourly') return 'Hourly Rate'
    if (t === 'Daily') return 'Daily Rate'
    if (t === 'Weekly') return 'Weekly Rate'
    if (t === 'Annually') return 'Annual Salary Package'
    return t
  }

  const [toggleStates, setToggleStates] = useState({
    publicHolidays: false,
    weekend: false,
    shiftLoading: false,
    bonuses: false,
    overtime: false
  })

  const [freshersCanApply, setFreshersCanApply] = useState(false)
  const [detailedAvailability, setDetailedAvailability] = useState(null)
  const yearsSheetRef = useRef(null)
  const monthsSheetRef = useRef(null)
  const salaryTypeSheetRef = useRef(null)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      experienceYears: '0 Year',
      experienceMonths: '0 Month',
      salaryType: 'Hourly Rate',
      salaryTypeOther: '',
      salaryMin: '',
      salaryMax: '',
      publicHolidaysRate: '',
      weekendRate: '',
      shiftLoadingRate: '',
      bonusesRate: '',
      overtimeRate: '',
      // Grouped availability (Mon–Thu / Fri–Sun)
      weekdaysStartTime: null,
      weekdaysEndTime: null,
      weekendsStartTime: null,
      weekendsEndTime: null,
    }
  })

  const salaryType = methods.watch('salaryType')
  const salaryTypeOther = methods.watch('salaryTypeOther')
  const salarySuffix = useMemo(() => {
    const t = String(salaryType || '').trim().toLowerCase()
    if (t.includes('hourly')) return '/hr'
    if (t.includes('daily')) return '/day'
    if (t.includes('weekly')) return '/week'
    if (t.includes('annual')) return '/year'
    if (t.includes('per task') || t.includes('piecework')) return '/task'
    if (t.includes('contract') || t.includes('project')) return '/project'
    return ''
  }, [salaryType])

  const getSalaryTypeDisplay = () => {
    if (salaryType === 'Other (please specify)') {
      return salaryTypeOther?.trim() ? `Other: ${salaryTypeOther.trim()}` : 'Other'
    }
    return salaryType
  }

  const setExtraPayToggle = (key, isYes) => {
    setToggleStates((s) => ({ ...s, [key]: isYes }))
    if (!isYes) {
      const map = {
        publicHolidays: 'publicHolidaysRate',
        weekend: 'weekendRate',
        shiftLoading: 'shiftLoadingRate',
        bonuses: 'bonusesRate',
        overtime: 'overtimeRate',
      }
      const field = map[key]
      if (field) methods.setValue(field, '', { shouldDirty: true })
    }
  }

  const validateExtraPayRates = (data) => {
    const required = []
    const checkRate = (enabledKey, fieldName, label) => {
      if (!toggleStates[enabledKey]) return
      const v = String(data[fieldName] || '').trim()
      const n = Number(v)
      if (!v || Number.isNaN(n) || n <= 0) required.push(label)
    }

    checkRate('publicHolidays', 'publicHolidaysRate', 'Public holidays rate')
    checkRate('weekend', 'weekendRate', 'Weekend rate')
    checkRate('shiftLoading', 'shiftLoadingRate', 'Shift loading rate')
    checkRate('bonuses', 'bonusesRate', 'Bonuses rate')
    checkRate('overtime', 'overtimeRate', 'Overtime rate')

    return required
  }

  const currencyIcon = (
    <AppText variant={Variant.body} style={styles.currencySymbol}>
      $
    </AppText>
  )

  const dateFromTimeString = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return null
    const [h, m] = timeString.split(':').map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return null
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
  }

  const timeToHHMM = (value) => {
    if (!value) return ''
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    const hh = d.getHours().toString().padStart(2, '0')
    const mm = d.getMinutes().toString().padStart(2, '0')
    return `${hh}:${mm}`
  }

  const buildGroupedAvailability = (formValues) => {
    const weekdaysFrom = timeToHHMM(formValues.weekdaysStartTime)
    const weekdaysTo = timeToHHMM(formValues.weekdaysEndTime)
    const weekendsFrom = timeToHHMM(formValues.weekendsStartTime)
    const weekendsTo = timeToHHMM(formValues.weekendsEndTime)

    const out = {}
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
    const weekends = ['Friday', 'Saturday', 'Sunday']

    weekdays.forEach((day) => {
      out[day] = {
        enabled: !!(weekdaysFrom && weekdaysTo),
        from: weekdaysFrom,
        to: weekdaysTo,
      }
    })
    weekends.forEach((day) => {
      out[day] = {
        enabled: !!(weekendsFrom && weekendsTo),
        from: weekendsFrom,
        to: weekendsTo,
      }
    })
    return out
  }

  useEffect(() => {
    if (detailedAvailabilityFromRoute) {
      setDetailedAvailability(detailedAvailabilityFromRoute)
    }

    if (returnToPreview && previewData?.step2Data) {
      const s2 = previewData.step2Data
      methods.reset({
        experienceYears: s2.experienceYears || '0 Year',
        experienceMonths: s2.experienceMonths || '0 Month',
        salaryType: s2.salaryType || 'Hourly Rate',
        salaryTypeOther: s2.salaryTypeOther || '',
        salaryMin: s2.salaryMin ? String(s2.salaryMin) : '',
        salaryMax: s2.salaryMax ? String(s2.salaryMax) : '',
        publicHolidaysRate: s2.publicHolidaysRate || '',
        weekendRate: s2.weekendRate || '',
        shiftLoadingRate: s2.shiftLoadingRate || '',
        bonusesRate: s2.bonusesRate || '',
        overtimeRate: s2.overtimeRate || '',
        weekdaysStartTime: s2.weekdaysStartTime || null,
        weekdaysEndTime: s2.weekdaysEndTime || null,
        weekendsStartTime: s2.weekendsStartTime || null,
        weekendsEndTime: s2.weekendsEndTime || null,
      })
      if (s2.extraPay) setToggleStates(s2.extraPay)
      if (typeof s2.freshersCanApply === 'boolean') setFreshersCanApply(s2.freshersCanApply)
      if (s2.availability && typeof s2.availability === 'object') {
        setDetailedAvailability(s2.availability)
      }
      return
    }

    if (editMode && draftJob) {
      const parsedExp = parseExperienceToForm(draftJob.experience)
      const expYears = parsedExp?.years || '0 Year'
      const expMonths = parsedExp?.months || '0 Month'

      methods.reset({
        experienceYears: expYears,
        experienceMonths: expMonths,
        salaryType: normalizeSalaryType(draftJob.salaryType),
        salaryTypeOther: draftJob.salaryTypeOther || '',
        salaryMin: draftJob.salaryMin ? String(draftJob.salaryMin) : '',
        salaryMax: draftJob.salaryMax ? String(draftJob.salaryMax) : '',
        publicHolidaysRate: draftJob?.extraPayRates?.publicHolidays
          ? String(draftJob.extraPayRates.publicHolidays)
          : '',
        weekendRate: draftJob?.extraPayRates?.weekend
          ? String(draftJob.extraPayRates.weekend)
          : '',
        shiftLoadingRate: draftJob?.extraPayRates?.shiftLoading
          ? String(draftJob.extraPayRates.shiftLoading)
          : '',
        bonusesRate: draftJob?.extraPayRates?.bonuses
          ? String(draftJob.extraPayRates.bonuses)
          : '',
        overtimeRate: draftJob?.extraPayRates?.overtime
          ? String(draftJob.extraPayRates.overtime)
          : '',
        weekdaysStartTime: dateFromTimeString(draftJob?.rawData?.step2Data?.weekdaysFrom) || null,
        weekdaysEndTime: dateFromTimeString(draftJob?.rawData?.step2Data?.weekdaysTo) || null,
        weekendsStartTime: dateFromTimeString(draftJob?.rawData?.step2Data?.weekendsFrom) || null,
        weekendsEndTime: dateFromTimeString(draftJob?.rawData?.step2Data?.weekendsTo) || null,
      })

      if (draftJob.extraPay) setToggleStates(draftJob.extraPay)
      if (typeof draftJob.freshersCanApply === 'boolean') setFreshersCanApply(draftJob.freshersCanApply)
      if (draftJob.availability && typeof draftJob.availability === 'object') {
        setDetailedAvailability(draftJob.availability)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, draftJob, detailedAvailabilityFromRoute])

  const experienceYearOptions = EXPERIENCE_YEAR_OPTIONS
  const experienceMonthOptions = EXPERIENCE_MONTH_OPTIONS

  const salaryTypeOptions = SALARY_TYPE_OPTIONS

  const handleSalaryTypeSelect = (item) => {
    if (item?.title) {
      methods.setValue('salaryType', item.title, { shouldValidate: true, shouldDirty: true })
      if (item.title !== 'Other (please specify)') {
        methods.setValue('salaryTypeOther', '', { shouldDirty: true })
      }
    }
    salaryTypeSheetRef.current?.close()
  }

 const onSubmit = (data) => {
  const missingRates = validateExtraPayRates(data)
  if (missingRates.length > 0) {
    showToast(
      `Please enter: ${missingRates.join(', ')}`,
      'Missing rates',
      toastTypes.warning,
    )
    return
  }

  const availabilityGrouped = buildGroupedAvailability(data)
  const availabilityFinal = detailedAvailability || availabilityGrouped

  const extraPayRates = {
    publicHolidays: toggleStates.publicHolidays ? Number(data.publicHolidaysRate) : null,
    weekend: toggleStates.weekend ? Number(data.weekendRate) : null,
    shiftLoading: toggleStates.shiftLoading ? Number(data.shiftLoadingRate) : null,
    bonuses: toggleStates.bonuses ? Number(data.bonusesRate) : null,
    overtime: toggleStates.overtime ? Number(data.overtimeRate) : null,
  }

  const formData = {
    ...data,
    freshersCanApply,
    extraPay: toggleStates,
    extraPayRates,
    salaryTypeDisplay: getSalaryTypeDisplay(),
    availability: availabilityFinal,
    availabilitySource: detailedAvailability ? 'detailed' : 'grouped',
    // keep grouped times in rawData for edit prefill
    weekdaysFrom: timeToHHMM(data.weekdaysStartTime),
    weekdaysTo: timeToHHMM(data.weekdaysEndTime),
    weekendsFrom: timeToHHMM(data.weekendsStartTime),
    weekendsTo: timeToHHMM(data.weekendsEndTime),
  }

  console.log('✅ Step 2 Data:', formData)
  
  // Pass both step1Data and step2Data to next screen
  if (returnToPreview) {
    navigation.navigate(screenNames.JOB_PREVIEW, {
      step1Data: previewData?.step1Data,
      step2Data: formData,
      step3Data: previewData?.step3Data,
      step4Data: previewData?.step4Data,
      editMode: previewData?.editMode,
      draftJob: previewData?.draftJob,
      jobId: previewData?.jobId,
    })
    return
  }

  navigation.navigate(screenNames.STEP_THREE, { 
    step1Data: route.params?.step1Data, // Pass step1Data forward
    step2Data: formData,
    editMode: !!editMode,
    draftJob,
    jobId: existingJobId,
  })
}

  const handleNext = () => {
    methods.handleSubmit(onSubmit)()
  }

  const handleAvailabilityPress = () => {
    navigation.navigate(screenNames.ABILITY_TO_WORK)
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        title="Manual Search"
        showTopIcons={false}
        rightComponent={
          <TouchableOpacity activeOpacity={0.7}>
            <AppText
              variant={Variant.body}
              style={{
                color: colors.white,
                fontWeight: 'bold',
                fontSize: getFontSize(16)
              }}
            >
              Step 2/3
            </AppText>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Freshers Checkbox (when checked, experience dropdowns are hidden) */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setFreshersCanApply(!freshersCanApply)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, freshersCanApply && styles.checkboxActive]}>
              {freshersCanApply && (
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark"
                  size={16}
                  color="#FFFFFF"
                />
              )}
            </View>
            <AppText variant={Variant.body} style={styles.checkboxText}>
              Freshers can also apply
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Total Experience */}
        {!freshersCanApply ? (
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Total experience needed*
          </AppText>
          
          <View style={styles.experienceRow}>
            <View style={{width: '48%'}}>
              <FormField
                name="experienceYears"
                placeholder="0 Year"
                onPressField={() => yearsSheetRef.current?.open()}
                containerStyle={styles.experienceDropdown}
              />
            </View>
            <View style={{width: '48%'}}>
              <FormField
                name="experienceMonths"
                placeholder="0 Month"
                onPressField={() => monthsSheetRef.current?.open()}
                containerStyle={styles.experienceDropdown}
              />
            </View>
          </View>
        </View>
        ) : null}

        {/* Availability */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Availability to work
          </AppText>

          <AppText variant={Variant.body} style={styles.availabilityDescription}>
            Days: Monday–Thursday and Friday–Sunday
          </AppText>

          {/* Grouped availability time pickers */}
          <View style={styles.availabilityGroupCard}>
            <AppText variant={Variant.bodyMedium} style={styles.groupTitle}>
              Monday–Thursday
            </AppText>
            <View style={styles.timeRow}>
              <View style={{ width: '48%' }}>
                <FormField
                  name="weekdaysStartTime"
                  type="timePicker"
                  label="Start time"
                  placeholder="Select time"
                />
              </View>
              <View style={{ width: '48%' }}>
                <FormField
                  name="weekdaysEndTime"
                  type="timePicker"
                  label="End time"
                  placeholder="Select time"
                />
              </View>
            </View>
          </View>

          <View style={styles.availabilityGroupCard}>
            <AppText variant={Variant.bodyMedium} style={styles.groupTitle}>
              Friday–Sunday
            </AppText>
            <View style={styles.timeRow}>
              <View style={{ width: '48%' }}>
                <FormField
                  name="weekendsStartTime"
                  type="timePicker"
                  label="Start time"
                  placeholder="Select time"
                />
              </View>
              <View style={{ width: '48%' }}>
                <FormField
                  name="weekendsEndTime"
                  type="timePicker"
                  label="End time"
                  placeholder="Select time"
                />
              </View>
            </View>
          </View>

          {/* Detailed selector */}
          <TouchableOpacity
            style={styles.detailedAvailabilityButton}
            onPress={handleAvailabilityPress}
            activeOpacity={0.8}
          >
            <AppText variant={Variant.bodyMedium} style={styles.detailedAvailabilityText}>
              Select Detailed Availability
            </AppText>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="calendar-outline"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>

          {detailedAvailability ? (
            <AppText variant={Variant.caption} style={styles.detailedAvailabilityHint}>
              Detailed availability selected.
            </AppText>
          ) : (
            <AppText variant={Variant.caption} style={styles.detailedAvailabilityHint}>
              Using grouped availability times.
            </AppText>
          )}
        </View>

        {/* Salary */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Salary you are offering*
          </AppText>

          {/* Salary Type */}
          <View style={{ marginBottom: hp(1.5) }}>
            <FormField
              name="salaryType"
              label="Salary type"
              value={salaryType}
              placeholder="Select salary type"
              onPressField={() => salaryTypeSheetRef.current?.open()}
            />
          </View>

          {salaryType === 'Other (please specify)' ? (
            <View style={{ marginBottom: hp(1.5) }}>
              <FormField
                name="salaryTypeOther"
                label="Please specify"
                placeholder="Enter salary type"
                rules={{
                  required: 'Please specify salary type',
                }}
              />
            </View>
          ) : null}

          <AppText variant={Variant.caption} style={styles.helperText}>
            All employees working in Australia are entitled to minimum wage.
          </AppText>
          
          <View style={styles.salaryRow}>
            <View style={{width: '42%'}}>
              <FormField
                name="salaryMin"
                placeholder="Minimum"
                keyboardType="numeric"
                rules={{
                  required: 'Minimum salary is required',
                  validate: (value) => {
                    const numValue = parseFloat(value);
                    if (!value || isNaN(numValue) || numValue < 0) {
                      return 'Please enter a valid minimum salary';
                    }
                    return true;
                  }
                }}
                startIcon={currencyIcon}
              />
            </View>
            
            <AppText variant={Variant.body} style={styles.toText}>To</AppText>

            <View style={{width: '42%'}}>
              <FormField
                name="salaryMax"
                placeholder="Maximum"
                keyboardType="numeric"
                rules={{
                  required: 'Maximum salary is required',
                  validate: (value, formValues) => {
                    const numValue = parseFloat(value);
                    const minValue = parseFloat(formValues.salaryMin);
                    if (!value || isNaN(numValue) || numValue < 0) {
                      return 'Please enter a valid maximum salary';
                    }
                    if (minValue && numValue < minValue) {
                      return 'Maximum must be greater than minimum';
                    }
                    return true;
                  }
                }}
                startIcon={currencyIcon}
              />
            </View>
          </View>

          <AppText variant={Variant.caption} style={styles.helperText}>
            Type: {getSalaryTypeDisplay()} {salarySuffix ? `(${salarySuffix})` : ''}
          </AppText>
        </View>

        {/* Extra Pay */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Extra pay
          </AppText>
          
          <View style={styles.toggleGrid}>
            <View style={globalStyles.rowJustify}>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label='Public holidays'
                defaultValue={toggleStates.publicHolidays ? 'Yes' : 'No'}
                onChange={(val) => setExtraPayToggle('publicHolidays', val === 'Yes')}
                />
                {toggleStates.publicHolidays ? (
                  <FormField
                    name="publicHolidaysRate"
                    placeholder="Extra pay rate"
                    keyboardType="numeric"
                    startIcon={currencyIcon}
                    rules={{
                      required: 'Rate is required',
                      validate: (v) => {
                        const n = Number(v)
                        if (!v || Number.isNaN(n) || n <= 0) return 'Enter a valid rate'
                        return true
                      },
                    }}
                  />
                ) : null}
              </View>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label="Weekend"
                defaultValue={toggleStates.weekend ? 'Yes' : 'No'}
                onChange={(val) => setExtraPayToggle('weekend', val === 'Yes')}
                />
                {toggleStates.weekend ? (
                  <FormField
                    name="weekendRate"
                    placeholder="Extra pay rate"
                    keyboardType="numeric"
                    startIcon={currencyIcon}
                    rules={{
                      required: 'Rate is required',
                      validate: (v) => {
                        const n = Number(v)
                        if (!v || Number.isNaN(n) || n <= 0) return 'Enter a valid rate'
                        return true
                      },
                    }}
                  />
                ) : null}
              </View>
            </View>

            <View style={globalStyles.rowJustify}>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label='Shift loading'
                defaultValue={toggleStates.shiftLoading ? 'Yes' : 'No'}
                onChange={(val) => setExtraPayToggle('shiftLoading', val === 'Yes')}
                />
                {toggleStates.shiftLoading ? (
                  <FormField
                    name="shiftLoadingRate"
                    placeholder="Extra pay rate"
                    keyboardType="numeric"
                    startIcon={currencyIcon}
                    rules={{
                      required: 'Rate is required',
                      validate: (v) => {
                        const n = Number(v)
                        if (!v || Number.isNaN(n) || n <= 0) return 'Enter a valid rate'
                        return true
                      },
                    }}
                  />
                ) : null}
              </View>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label="Bonuses"
                defaultValue={toggleStates.bonuses ? 'Yes' : 'No'}
                onChange={(val) => setExtraPayToggle('bonuses', val === 'Yes')}
                />
                {toggleStates.bonuses ? (
                  <FormField
                    name="bonusesRate"
                    placeholder="Extra pay rate"
                    keyboardType="numeric"
                    startIcon={currencyIcon}
                    rules={{
                      required: 'Rate is required',
                      validate: (v) => {
                        const n = Number(v)
                        if (!v || Number.isNaN(n) || n <= 0) return 'Enter a valid rate'
                        return true
                      },
                    }}
                  />
                ) : null}
              </View>
            </View>

            <View style={globalStyles.rowJustify}>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label='Overtime'
                defaultValue={toggleStates.overtime ? 'Yes' : 'No'}
                onChange={(val) => setExtraPayToggle('overtime', val === 'Yes')}
                />
                {toggleStates.overtime ? (
                  <FormField
                    name="overtimeRate"
                    placeholder="Extra pay rate"
                    keyboardType="numeric"
                    startIcon={currencyIcon}
                    rules={{
                      required: 'Rate is required',
                      validate: (v) => {
                        const n = Number(v)
                        if (!v || Number.isNaN(n) || n <= 0) return 'Enter a valid rate'
                        return true
                      },
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            bgColor={colors.primary}
            textColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <RbSheetComponent ref={yearsSheetRef} height={hp(50)}>
        <BottomDataSheet
          optionsData={experienceYearOptions}
          onClose={() => yearsSheetRef.current.close()}
          onSelect={(selectedItem) => {
            methods.setValue('experienceYears', selectedItem.title)
          }}
        />
      </RbSheetComponent>

      <RbSheetComponent ref={monthsSheetRef} height={hp(50)}>
        <BottomDataSheet
          optionsData={experienceMonthOptions}
          onClose={() => monthsSheetRef.current.close()}
          onSelect={(selectedItem) => {
            methods.setValue('experienceMonths', selectedItem.title)
          }}
        />
      </RbSheetComponent>

      <RbSheetComponent ref={salaryTypeSheetRef} height={hp(50)}>
        <BottomDataSheet
          optionsData={salaryTypeOptions}
          onClose={() => salaryTypeSheetRef.current.close()}
          onSelect={handleSalaryTypeSelect}
        />
      </RbSheetComponent>
    </FormProvider>
  )
}

export default StepTwo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  section: { marginBottom: hp(2) },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '500',
    marginBottom: hp(2),
  },
  experienceRow: { flexDirection: 'row', gap: wp(3), marginBottom: hp(1) },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(1.5),
    borderWidth: 2,
    borderColor: colors.grayE8,
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  checkboxText: { color: colors.secondary, ...typography.label },
  availabilityGroupCard: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(1.5),
    padding: wp(3),
    marginTop: hp(1.2),
    backgroundColor: colors.white,
  },
  groupTitle: {
    color: colors.secondary,
    marginBottom: hp(1),
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailedAvailabilityButton: {
    marginTop: hp(1.5),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailedAvailabilityText: {
    color: colors.primary,
  },
  detailedAvailabilityHint: {
    color: colors.gray,
    marginTop: hp(0.8),
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencySymbol: { color: colors.gray, fontSize: getFontSize(14) },
  toText: { color: colors.gray, fontSize: getFontSize(16), bottom: 10 },
  helperText: {
    color: colors.gray,
    marginBottom: hp(1.2),
  },
  toggleGrid: { gap: hp(2) },
  buttonContainer: { marginTop: hp(2), marginBottom: hp(6) },
})
