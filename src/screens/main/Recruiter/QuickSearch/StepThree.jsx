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
import globalStyles from '@/styles/globalStyles'
import { screenNames } from '@/navigation/screenNames'

const QuickSearchStepThree = ({ navigation, route }) => {
  // Get data from Step 1 and Step 2
  const { quickSearchStep1Data, quickSearchStep2Data, editMode, draftJob, jobId } = route.params || {}

  const step3Draft = draftJob?.rawData?.step3 || {}

  const [toggleStates, setToggleStates] = useState(editMode ? (step3Draft?.extraPay ?? draftJob?.extraPay ?? {
    publicHolidays: true,
    weekend: true,
    shiftLoading: true,
    bonuses: true,
    overtime: true
  }) : {
    publicHolidays: true,
    weekend: true,
    shiftLoading: true,
    bonuses: true,
    overtime: true
  })

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      salaryMin: editMode ? String(step3Draft?.salaryMin ?? draftJob?.salaryMin ?? '') : '',
      salaryMax: editMode ? String(step3Draft?.salaryMax ?? draftJob?.salaryMax ?? '') : '',
    },
  })

  useEffect(() => {
    if (editMode) {
      const nextExtraPay = step3Draft?.extraPay ?? draftJob?.extraPay
      if (nextExtraPay) setToggleStates(nextExtraPay)

      methods.reset({
        salaryMin: String(step3Draft?.salaryMin ?? draftJob?.salaryMin ?? ''),
        salaryMax: String(step3Draft?.salaryMax ?? draftJob?.salaryMax ?? ''),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, draftJob])

  const handleToggle = (key) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const onSubmit = (data) => {
    const min = Number(data.salaryMin)
    const max = Number(data.salaryMax)

    if (Number.isNaN(min) || Number.isNaN(max)) {
      Alert.alert('Invalid salary', 'Please enter numeric values for both minimum and maximum salary.')
      return
    }

    if (min <= 0) {
      Alert.alert('Invalid salary', 'Minimum salary must be greater than 0.')
      return
    }

    if (max < min) {
      Alert.alert('Invalid range', 'Maximum salary must be greater than or equal to minimum salary.')
      return
    }

    const quickSearchStep3Data = {
      ...data,
      salaryMin: min,
      salaryMax: max,
      extraPay: toggleStates,
    }

    console.log('Quick Search Step 3 Data:', quickSearchStep3Data)

    // Pass all three steps' data forward
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
              Step 3/4
            </AppText>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Salary Section */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Salary you are offering*
          </AppText>
          
          <View style={styles.salaryRow}>
            <View style={{width: '42%'}}>
              <FormField
                name="salaryMin"
                placeholder="Minimum"
                keyboardType="numeric"
                rules={{
                  required: 'Minimum salary is required',
                  validate: value =>
                    value.trim() !== '' && !Number.isNaN(Number(value)) || 'Enter a valid number',
                }}
                startIcon={
                  <AppText variant={Variant.body} style={styles.currencySymbol}>$</AppText>
                }
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
                  validate: value =>
                    value.trim() !== '' && !Number.isNaN(Number(value)) || 'Enter a valid number',
                }}
                startIcon={
                  <AppText variant={Variant.body} style={styles.currencySymbol}>$</AppText>
                }
              />
            </View>
          </View>
        </View>

        {/* Extra Pay Section */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Extra pay
          </AppText>
          
          <View style={styles.toggleGrid}>
            <View style={globalStyles.rowJustify}>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label='Public holidays'
                  onChange={() => handleToggle('publicHolidays')}
                />
              </View>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label="Weekend"
                  onChange={() => handleToggle('weekend')}
                />
              </View>
            </View>

            <View style={globalStyles.rowJustify}>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label='Shift loading'
                  onChange={() => handleToggle('shiftLoading')}
                />
              </View>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label="Bonuses"
                  onChange={() => handleToggle('bonuses')}
                />
              </View>
            </View>

            <View style={globalStyles.rowJustify}>
              <View style={{width: '48%'}}>
                <CustomToggle
                  label='Overtime'
                  onChange={() => handleToggle('overtime')}
                />
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
})