// QuickSearchStepThree.js - Salary & Benefits (Add your Step 3 content)
import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
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
  const { quickSearchStep1Data, quickSearchStep2Data } = route.params || {}

  const [toggleStates, setToggleStates] = useState({
    publicHolidays: true,
    weekend: true,
    shiftLoading: true,
    bonuses: true,
    overtime: true
  })

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      salaryMin: '',
      salaryMax: ''
    }
  })

  const handleToggle = (key) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const onSubmit = (data) => {
    const quickSearchStep3Data = {
      ...data,
      extraPay: toggleStates
    }

    console.log('Quick Search Step 3 Data:', quickSearchStep3Data)
    
    // Pass all three steps' data forward
    navigation.navigate(screenNames.QUICK_SEARCH_STEPFOUR, {
      quickSearchStep1Data,
      quickSearchStep2Data,
      quickSearchStep3Data
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