// QuickSearchStepThree.js - Salary & Benefits (Add your Step 3 content)
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import AppHeader from '@/core/AppHeader'
import CustomToggle from '@/core/CustomToggle'
import { screenNames } from '@/navigation/screenNames'

const QuickSearchStepThree = ({ navigation, route }) => {
  // Get data from Step 1 and Step 2
  const { quickSearchStep1Data, quickSearchStep2Data, editMode, draftJob, jobId, returnToPreview, previewData } = route.params || {}

  const step3Draft = draftJob?.rawData?.step3 || {}

  const [salaryType, setSalaryType] = useState(
    editMode
      ? (step3Draft?.salaryType ?? draftJob?.salaryType ?? 'Hourly')
      : 'Hourly',
  )
  const [overtimeEnabled, setOvertimeEnabled] = useState(
    editMode
      ? !!(step3Draft?.overtimeEnabled ?? draftJob?.overtimeEnabled ?? step3Draft?.extraPay?.overtime ?? draftJob?.extraPay?.overtime)
      : false,
  )

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      fixedRate: editMode
        ? String(
            step3Draft?.fixedRate ??
              step3Draft?.salaryMin ??
              draftJob?.fixedRate ??
              draftJob?.salaryMin ??
              '',
          )
        : '',
      overtimeRate: editMode
        ? String(step3Draft?.overtimeRate ?? draftJob?.overtimeRate ?? '')
        : '',
    },
  })

  useEffect(() => {
    if (editMode) {
      setSalaryType(step3Draft?.salaryType ?? draftJob?.salaryType ?? 'Hourly')
      setOvertimeEnabled(
        !!(step3Draft?.overtimeEnabled ?? draftJob?.overtimeEnabled ?? step3Draft?.extraPay?.overtime ?? draftJob?.extraPay?.overtime),
      )

      methods.reset({
        fixedRate: String(
          step3Draft?.fixedRate ??
            step3Draft?.salaryMin ??
            draftJob?.fixedRate ??
            draftJob?.salaryMin ??
            '',
        ),
        overtimeRate: String(step3Draft?.overtimeRate ?? draftJob?.overtimeRate ?? ''),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, draftJob])

  // Pre-fill from previewData when returning from preview edit
  useEffect(() => {
    if (returnToPreview && previewData?.quickSearchStep3Data) {
      const s3 = previewData.quickSearchStep3Data
      setSalaryType(s3.salaryType ?? 'Hourly')
      setOvertimeEnabled(!!(s3.overtimeEnabled ?? s3.extraPay?.overtime))
      methods.reset({
        fixedRate: String(s3.fixedRate ?? s3.salaryMin ?? ''),
        overtimeRate: String(s3.overtimeRate ?? ''),
      })
    }
  }, [returnToPreview, previewData])

  const onSubmit = (data) => {
    const fixed = Number(data.fixedRate)

    if (Number.isNaN(fixed)) {
      Alert.alert('Invalid rate', 'Please enter a numeric fixed rate.')
      return
    }

    if (fixed <= 0) {
      Alert.alert('Invalid rate', 'Fixed rate must be greater than 0.')
      return
    }

    const overtimeRateNum = Number(data.overtimeRate)
    if (overtimeEnabled) {
      if (Number.isNaN(overtimeRateNum) || overtimeRateNum <= 0) {
        Alert.alert('Invalid overtime rate', 'Please enter a valid overtime rate greater than 0.')
        return
      }
    }

    const quickSearchStep3Data = {
      salaryType,
      fixedRate: fixed,
      salaryMin: fixed,
      salaryMax: fixed,
      overtimeEnabled,
      overtimeRate: overtimeEnabled ? overtimeRateNum : null,
      extraPay: { overtime: overtimeEnabled },
    }

    console.log('Quick Search Step 3 Data:', quickSearchStep3Data)

    // Pass all three steps' data forward
    if (returnToPreview) {
      navigation.navigate(screenNames.QUICK_SEARCH_PREVIEW, {
        quickSearchStep1Data: previewData?.quickSearchStep1Data || quickSearchStep1Data,
        quickSearchStep2Data: previewData?.quickSearchStep2Data || quickSearchStep2Data,
        quickSearchStep3Data,
        quickSearchStep4Data: previewData?.quickSearchStep4Data,
        editMode: previewData?.editMode,
        draftJob: previewData?.draftJob,
        jobId: previewData?.jobId,
      })
      return
    }

    navigation.navigate(screenNames.QUICK_SEARCH_STEPFOUR, {
      quickSearchStep1Data,
      quickSearchStep2Data,
      quickSearchStep3Data,
      editMode: !!editMode,
      draftJob,
      jobId,
    })
  }

  const handleNext = () => {
    methods.handleSubmit(onSubmit)()
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        title="Salary & Benefits"
        showTopIcons={false}
        rightComponent={
          <TouchableOpacity activeOpacity={0.7}>
            <AppText variant={Variant.body} style={styles.stepText}>
              Step 3/5
            </AppText>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Salary Section */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Fixed rate*
          </AppText>

          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Salary type*
          </AppText>
          <View style={styles.salaryTypeRow}>
            {['Hourly', 'Per job'].map((t) => (
              <TouchableOpacity
                key={t}
                activeOpacity={0.8}
                onPress={() => setSalaryType(t)}
                style={[
                  styles.salaryTypeBtn,
                  salaryType === t && styles.salaryTypeBtnActive,
                ]}
              >
                <AppText
                  variant={Variant.bodyMedium}
                  style={[
                    styles.salaryTypeText,
                    salaryType === t && styles.salaryTypeTextActive,
                  ]}
                >
                  {t}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <FormField
            name="fixedRate"
            placeholder="Enter fixed rate"
            keyboardType="numeric"
            rules={{
              required: 'Fixed rate is required',
              validate: value =>
                value.trim() !== '' && !Number.isNaN(Number(value)) && Number(value) > 0 ||
                'Enter a valid number greater than 0',
            }}
            startIcon={
              <AppText variant={Variant.body} style={styles.currencySymbol}>$</AppText>
            }
          />
        </View>

        {/* Extra Pay Section */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Extra pay
          </AppText>
          <CustomToggle
            label="Overtime"
            value={overtimeEnabled}
            onChange={() => setOvertimeEnabled((v) => !v)}
          />
          {overtimeEnabled ? (
            <>
              <AppText variant={Variant.bodyMedium} style={styles.label}>
                Overtime rate*
              </AppText>
              <FormField
                name="overtimeRate"
                placeholder="Enter overtime rate"
                keyboardType="numeric"
                rules={{
                  required: 'Overtime rate is required',
                  validate: value =>
                    value.trim() !== '' && !Number.isNaN(Number(value)) && Number(value) > 0 ||
                    'Enter a valid number greater than 0',
                }}
                startIcon={
                  <AppText variant={Variant.body} style={styles.currencySymbol}>$</AppText>
                }
              />
            </>
          ) : null}
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
    </FormProvider>
  )
}

export default QuickSearchStepThree

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  stepText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: getFontSize(16),
  },
  section: { 
    marginBottom: hp(2) 
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '500',
    marginBottom: hp(2),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '500',
    marginBottom: hp(1),
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencySymbol: { 
    color: colors.gray, 
    fontSize: getFontSize(16), 
    marginLeft: wp(2) 
  },
  toText: { 
    color: colors.gray, 
    fontSize: getFontSize(16), 
    bottom: 10 
  },
  toggleGrid: { 
    gap: hp(2) 
  },
  buttonContainer: { 
    marginTop: hp(2), 
    marginBottom: hp(6) 
  },
  salaryTypeRow: {
    flexDirection: 'row',
    gap: wp(2),
    marginBottom: hp(2),
  },
  salaryTypeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1.2),
    borderRadius: 50,
    alignItems: 'center',
  },
  salaryTypeBtnActive: {
    backgroundColor: colors.primary,
  },
  salaryTypeText: {
    color: colors.primary,
    fontWeight: '700',
  },
  salaryTypeTextActive: {
    color: colors.white,
  },
})