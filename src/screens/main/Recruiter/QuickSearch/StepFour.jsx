// QuickSearchStepFour.js - Availability & Tax Type
import React, { useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import FormField from '@/core/FormField'
import { screenNames } from '@/navigation/screenNames'
import AvailabilitySelector, { DAYS_OF_WEEK } from '@/components/AvailabilitySelector'
import { showToast, toastTypes } from '@/utilities/toastConfig'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import InfoTooltip from '@/components/InfoTooltip'

const QuickSearchStepFour = ({ navigation, route }) => {
  // Get data from all previous steps
  const { 
    quickSearchStep1Data, 
    quickSearchStep2Data, 
    quickSearchStep3Data,
    editMode,
    draftJob,
    jobId,
    returnToPreview,
    previewData,
  } = route.params || {}

  const step4Draft = draftJob?.rawData?.step4 || {}

  const staffCountValue =
    Number(quickSearchStep1Data?.staffCount ?? quickSearchStep1Data?.staffNumber) || 0

  const parseDateOnly = (value) => {
    if (!value) return null
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return null
    const out = new Date(d)
    out.setHours(0, 0, 0, 0)
    return out
  }

  const todayStart = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const startDateOnly = React.useMemo(
    () => parseDateOnly(quickSearchStep2Data?.jobStartDate),
    [quickSearchStep2Data?.jobStartDate],
  )
  const endDateOnly = React.useMemo(
    () => parseDateOnly(quickSearchStep2Data?.jobEndDate),
    [quickSearchStep2Data?.jobEndDate],
  )
  const isMultiDay =
    !!startDateOnly && !!endDateOnly && endDateOnly.getTime() !== startDateOnly.getTime()

  const weekdayFromDate = (d) => {
    if (!d) return null
    const names = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    return names[d.getDay()] || null
  }

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      availability: DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = { enabled: false, from: '09:00', to: '17:00' } // Default: 9:00 AM to 5:00 PM
        return acc
      }, {}),
      paidThroughWallet: false,
      taxType: 'ABN',
      hireSquadPairs: false,
      weekendSatExtraPay: false,
      weekendSatRate: '',
      weekendSunExtraPay: false,
      weekendSunRate: '',
      commonTimeRange: { start: '09:00', end: '17:00' }, // Default: 9:00 AM to 5:00 PM
    },
  })

  const { watch, control, handleSubmit, setValue } = methods

  const taxType = watch('taxType')
  const paidThroughWallet = watch('paidThroughWallet')
  const hireSquadPairs = watch('hireSquadPairs')
  const availability = watch('availability')
  const weekendSatExtraPay = watch('weekendSatExtraPay')
  const weekendSunExtraPay = watch('weekendSunExtraPay')

  const isSaturdaySelected = !!availability?.Saturday?.enabled
  const isSundaySelected = !!availability?.Sunday?.enabled

  useEffect(() => {
    if (editMode && draftJob) {
      // Prefill availability / tax type from the original job's rawData when available
      if (step4Draft?.availability) {
        setValue('availability', step4Draft.availability)
      } else if (draftJob?.availability && typeof draftJob.availability === 'object') {
        setValue('availability', draftJob.availability)
      }

      if (typeof step4Draft?.paidThroughWallet === 'boolean') {
        setValue('paidThroughWallet', step4Draft.paidThroughWallet)
      }
      if (typeof step4Draft?.hireSquadPairs === 'boolean') {
        setValue('hireSquadPairs', step4Draft.hireSquadPairs)
      }
      if (typeof step4Draft?.weekendSatExtraPay === 'boolean') {
        setValue('weekendSatExtraPay', step4Draft.weekendSatExtraPay)
      }
      if (typeof step4Draft?.weekendSunExtraPay === 'boolean') {
        setValue('weekendSunExtraPay', step4Draft.weekendSunExtraPay)
      }
      if (typeof step4Draft?.weekendSatRate === 'string') {
        setValue('weekendSatRate', step4Draft.weekendSatRate)
      }
      if (typeof step4Draft?.weekendSunRate === 'string') {
        setValue('weekendSunRate', step4Draft.weekendSunRate)
      }

      if (step4Draft?.taxType) {
        setValue('taxType', step4Draft.taxType)
      } else if (draftJob?.taxType) {
        setValue('taxType', draftJob.taxType)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, draftJob])

  // Pre-fill from previewData when returning from preview edit
  useEffect(() => {
    if (returnToPreview && previewData?.quickSearchStep4Data) {
      const s4 = previewData.quickSearchStep4Data
      if (s4.availability) setValue('availability', s4.availability)
      if (typeof s4.paidThroughWallet === 'boolean') setValue('paidThroughWallet', s4.paidThroughWallet)
      if (typeof s4.hireSquadPairs === 'boolean') setValue('hireSquadPairs', s4.hireSquadPairs)
      if (typeof s4.weekendSatExtraPay === 'boolean') setValue('weekendSatExtraPay', s4.weekendSatExtraPay)
      if (typeof s4.weekendSunExtraPay === 'boolean') setValue('weekendSunExtraPay', s4.weekendSunExtraPay)
      if (typeof s4.weekendSatRate === 'string') setValue('weekendSatRate', s4.weekendSatRate)
      if (typeof s4.weekendSunRate === 'string') setValue('weekendSunRate', s4.weekendSunRate)
      if (s4.taxType) setValue('taxType', s4.taxType)
    }
  }, [returnToPreview, previewData])

  useEffect(() => {
    // Wallet payment forces ABN
    if (paidThroughWallet && taxType !== 'ABN') {
      setValue('taxType', 'ABN')
    }
  }, [paidThroughWallet, taxType, setValue])

  const onSubmit = (data) => {
    // Validate that all selected days have times
    let nextAvailability = { ...(data.availability || {}) }
    let selectedDaysList = DAYS_OF_WEEK.filter(day => nextAvailability[day]?.enabled)

    // Selecting other days is optional in Quick Fill. If none selected, auto-enable the start day.
    if (selectedDaysList.length === 0) {
      const startDayName = weekdayFromDate(startDateOnly) || 'Monday'
      const common = data.commonTimeRange || { start: '09:00', end: '17:00' }
      nextAvailability[startDayName] = {
        enabled: true,
        from: common.start || '09:00',
        to: common.end || '17:00',
      }
      selectedDaysList = [startDayName]
    }
    
    if (selectedDaysList.length === 0) {
      showToast(
        'Please select at least one day',
        'Warning',
        toastTypes.warning
      )
      return
    }

    const incompleteDays = selectedDaysList.filter(day => {
      const times = nextAvailability[day]
      return !times.from || !times.to
    })

    if (incompleteDays.length > 0) {
      showToast('Please set times for all selected days', 'Warning', toastTypes.warning)
      return
    }

    // Validate time ranges for each day
    const invalidDays = selectedDaysList.filter(day => {
      const times = nextAvailability[day]
      const [startHour, startMin] = times.from.split(':').map(Number)
      const [endHour, endMin] = times.to.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      return endMinutes <= startMinutes
    })

    if (invalidDays.length > 0) {
      showToast('End time must be after start time for all days', 'Error', toastTypes.error)
      return
    }

    // Start time must be after 3 hours gap when job starts today (for today's day)
    const isStartToday = !!startDateOnly && startDateOnly.getTime() === todayStart.getTime()
    if (isStartToday) {
      const now = new Date()
      const minStart = new Date(now.getTime() + 3 * 60 * 60 * 1000)
      const minMinutes = minStart.getHours() * 60 + minStart.getMinutes()
      const startDayName = weekdayFromDate(startDateOnly)

      if (startDayName && nextAvailability?.[startDayName]?.enabled) {
        const from = nextAvailability[startDayName]?.from
        const [h, m] = String(from || '').split(':').map(Number)
        const fromMinutes = (h || 0) * 60 + (m || 0)
        if (fromMinutes < minMinutes) {
          showToast(
            'Start time must be at least 3 hours from now.',
            'Info',
            toastTypes.warning,
          )
          return
        }
      }
    }

    // Weekend extra pay validation
    if (nextAvailability?.Saturday?.enabled && weekendSatExtraPay) {
      const rate = String(data.weekendSatRate || '').trim()
      if (!rate || Number.isNaN(Number(rate)) || Number(rate) <= 0) {
        showToast('Please enter a valid Saturday extra pay rate', 'Warning', toastTypes.warning)
        return
      }
    }
    if (nextAvailability?.Sunday?.enabled && weekendSunExtraPay) {
      const rate = String(data.weekendSunRate || '').trim()
      if (!rate || Number.isNaN(Number(rate)) || Number(rate) <= 0) {
        showToast('Please enter a valid Sunday extra pay rate', 'Warning', toastTypes.warning)
        return
      }
    }

    // Tax type rules
    let nextTaxType = data.taxType
    if (data.paidThroughWallet) {
      nextTaxType = 'ABN'
    } else if (!nextTaxType) {
      showToast('Please select tax type', 'Warning', toastTypes.warning)
      return
    }

    // Hire SquadPairs only when staffCount >= 2
    const nextHireSquadPairs = staffCountValue >= 2 ? !!data.hireSquadPairs : false

    const quickSearchStep4Data = {
      ...data,
      availability: nextAvailability,
      taxType: nextTaxType === 'Both' ? 'ANY' : nextTaxType,
      hireSquadPairs: nextHireSquadPairs,
    }

    console.log('Quick Search Step 4 Data:', quickSearchStep4Data)
    
    // Navigate to preview with ALL data from all 4 steps
    if (returnToPreview) {
      navigation.navigate(screenNames.QUICK_SEARCH_PREVIEW, {
        quickSearchStep1Data: previewData?.quickSearchStep1Data || quickSearchStep1Data,
        quickSearchStep2Data: previewData?.quickSearchStep2Data || quickSearchStep2Data,
        quickSearchStep3Data: previewData?.quickSearchStep3Data || quickSearchStep3Data,
        quickSearchStep4Data,
        editMode: previewData?.editMode,
        draftJob: previewData?.draftJob,
        jobId: previewData?.jobId,
      })
      return
    }

    navigation.navigate(screenNames.QUICK_SEARCH_PREVIEW, { 
      quickSearchStep1Data,
      quickSearchStep2Data,
      quickSearchStep3Data,
      quickSearchStep4Data,
      editMode: !!editMode,
      draftJob,
      jobId,
    })
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        title="Availability"
        showTopIcons={false}
        rightComponent={
          <AppText variant={Variant.body} style={styles.stepText}>
            Step 4/5
          </AppText>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <AppText variant={Variant.h2} style={styles.sectionTitle}>
          Availability to work
        </AppText>
        <AppText variant={Variant.bodySmall} style={styles.subTitle}>
          Choose days and time you want seeker to be available
        </AppText>

        <View style={styles.infoRow}>
          <VectorIcons
            name={iconLibName.Feather}
            iconName="info"
            size={16}
            color={colors.gray}
          />
          <AppText variant={Variant.caption} style={styles.infoText}>
            Start time must be after 3 hours gap of current time. This helps jobseekers/contractors to get ready and travel to the work.
          </AppText>
        </View>

        {/* Shared Availability Selector Component */}
        <AvailabilitySelector
          control={control}
          setValue={setValue}
          defaultStartTime="09:00"
          defaultEndTime="17:00"
          containerStyle={styles.availabilityContainer}
        />

        {/* Weekend extra pay */}
        {isSaturdaySelected || isSundaySelected ? (
          <>
            <AppText variant={Variant.h2} style={styles.sectionTitle}>
              Weekend extra pay
            </AppText>
            <AppText variant={Variant.bodySmall} style={styles.subTitle}>
              If you selected Saturday/Sunday, you can add an extra pay rate for weekends.
            </AppText>

            {isSaturdaySelected ? (
              <View style={styles.weekendCard}>
                <AppText variant={Variant.bodyMedium} style={styles.weekendTitle}>
                  Saturday
                </AppText>
                <View style={styles.checkboxRow}>
                  <TouchableOpacity
                    style={styles.checkboxHit}
                    activeOpacity={0.8}
                    onPress={() => setValue('weekendSatExtraPay', !weekendSatExtraPay)}
                  >
                    <View style={[styles.checkbox, weekendSatExtraPay && styles.checkboxActive]}>
                      {weekendSatExtraPay ? (
                        <VectorIcons
                          name={iconLibName.Ionicons}
                          iconName="checkmark"
                          size={16}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>
                    <AppText variant={Variant.body} style={styles.checkboxLabel}>
                      Extra pay rate
                    </AppText>
                  </TouchableOpacity>
                </View>
                {weekendSatExtraPay ? (
                  <FormField
                    name="weekendSatRate"
                    label="Weekend rate*"
                    placeholder="Enter rate"
                    keyboardType="numeric"
                    startIcon={
                      <AppText variant={Variant.body} style={styles.currencySymbol}>
                        $
                      </AppText>
                    }
                    rules={{
                      required: 'Weekend rate is required',
                      validate: (v) =>
                        v?.trim() !== '' &&
                        !Number.isNaN(Number(v)) &&
                        Number(v) > 0 ||
                        'Enter a valid number greater than 0',
                    }}
                  />
                ) : null}
              </View>
            ) : null}

            {isSundaySelected ? (
              <View style={styles.weekendCard}>
                <AppText variant={Variant.bodyMedium} style={styles.weekendTitle}>
                  Sunday
                </AppText>
                <View style={styles.checkboxRow}>
                  <TouchableOpacity
                    style={styles.checkboxHit}
                    activeOpacity={0.8}
                    onPress={() => setValue('weekendSunExtraPay', !weekendSunExtraPay)}
                  >
                    <View style={[styles.checkbox, weekendSunExtraPay && styles.checkboxActive]}>
                      {weekendSunExtraPay ? (
                        <VectorIcons
                          name={iconLibName.Ionicons}
                          iconName="checkmark"
                          size={16}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>
                    <AppText variant={Variant.body} style={styles.checkboxLabel}>
                      Extra pay rate
                    </AppText>
                  </TouchableOpacity>
                </View>
                {weekendSunExtraPay ? (
                  <FormField
                    name="weekendSunRate"
                    label="Weekend rate*"
                    placeholder="Enter rate"
                    keyboardType="numeric"
                    startIcon={
                      <AppText variant={Variant.body} style={styles.currencySymbol}>
                        $
                      </AppText>
                    }
                    rules={{
                      required: 'Weekend rate is required',
                      validate: (v) =>
                        v?.trim() !== '' &&
                        !Number.isNaN(Number(v)) &&
                        Number(v) > 0 ||
                        'Enter a valid number greater than 0',
                    }}
                  />
                ) : null}
              </View>
            ) : null}
          </>
        ) : null}

        {/* Tax Type */}
        <AppText variant={Variant.h2} style={styles.sectionTitle}>
          Required Tax type
        </AppText>

        <View style={styles.checkboxStack}>
          <TouchableOpacity
            style={styles.checkboxHit}
            activeOpacity={0.8}
            onPress={() => setValue('paidThroughWallet', !paidThroughWallet)}
          >
            <View style={[styles.checkbox, paidThroughWallet && styles.checkboxActive]}>
              {paidThroughWallet ? (
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark"
                  size={16}
                  color="#FFFFFF"
                />
              ) : null}
            </View>
            <AppText variant={Variant.body} style={styles.checkboxLabel}>
              Hire through SquadGoo Wallet
            </AppText>
            <InfoTooltip text="You must have enough balance in your SquadGoo Wallet to pay candidates. SG coins will be deducted once workers arrive, based on hourly rate × total hours." />
          </TouchableOpacity>

          {staffCountValue >= 2 ? (
            <TouchableOpacity
              style={styles.checkboxHit}
              activeOpacity={0.8}
              onPress={() => setValue('hireSquadPairs', !hireSquadPairs)}
            >
              <View style={[styles.checkbox, hireSquadPairs && styles.checkboxActive]}>
                {hireSquadPairs ? (
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="checkmark"
                    size={16}
                    color="#FFFFFF"
                  />
                ) : null}
              </View>
              <AppText variant={Variant.body} style={styles.checkboxLabel}>
                Hire SquadPairs
              </AppText>
              <InfoTooltip text="Your job offer will be sent to members who are looking to work as pairs." />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.taxTypeRow}>
          {!paidThroughWallet
            ? ['ABN', 'TFN', 'ANY'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.taxTypeBtn,
                taxType === type && styles.taxTypeBtnActive,
              ]}
              onPress={() => setValue('taxType', type)}
            >
              <AppText
                style={[
                  styles.taxTypeText,
                  taxType === type && styles.taxTypeTextActive,
                ]}
              >
                {type}
              </AppText>
            </TouchableOpacity>
          ))
            : (
              <View style={[styles.taxTypeBtn, styles.taxTypeBtnActive]}>
                <AppText style={[styles.taxTypeText, styles.taxTypeTextActive]}>
                  ABN
                </AppText>
              </View>
            )}
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <AppButton 
            text="Preview" 
            onPress={handleSubmit(onSubmit)} 
            textColor="#FFF" 
          />
        </View>
      </ScrollView>
    </FormProvider>
  )
}

export default QuickSearchStepFour

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
  sectionTitle: {
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  subTitle: {
    color: colors.gray,
    marginBottom: hp(2),
  },
  availabilityContainer: {
    marginBottom: hp(2),
  },
  taxTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(2),
  },
  taxTypeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1.5),
    borderRadius: 50,
    marginHorizontal: wp(1),
    alignItems: 'center',
  },
  taxTypeBtnActive: {
    backgroundColor: colors.primary,
  },
  taxTypeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  taxTypeTextActive: {
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  infoText: {
    flex: 1,
    color: colors.gray,
    marginLeft: wp(2),
  },
  checkboxStack: {
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  checkboxRow: {
    marginTop: hp(1),
  },
  checkboxHit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    color: colors.secondary,
  },
  weekendCard: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: wp(3.5),
    marginTop: hp(1.5),
  },
  weekendTitle: {
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: hp(1),
  },
  currencySymbol: {
    color: colors.secondary,
    fontWeight: '700',
  },
  buttonContainer: {
    marginBottom: hp(6),
  },
})