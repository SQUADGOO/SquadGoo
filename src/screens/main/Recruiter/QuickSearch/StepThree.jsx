// QuickSearchStepThree.js - Salary & Benefits (Add your Step 3 content)
import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import AppHeader from '@/core/AppHeader'
import CustomToggle from '@/core/CustomToggle'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
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

  const [paymentMethod, setPaymentMethod] = useState('platform') // 'platform' or 'direct'

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      salaryMin: '',
      salaryMax: '',
    },
  })

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
      paymentMethod: paymentMethod, // 'platform' or 'direct'
    }

    console.log('Quick Search Step 3 Data:', quickSearchStep3Data)

    // Pass all three steps' data forward
    navigation.navigate(screenNames.QUICK_SEARCH_STEPFOUR, {
      quickSearchStep1Data,
      quickSearchStep2Data,
      quickSearchStep3Data,
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

        {/* Payment Method Section */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Payment Method*
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            Choose how payment will be handled for this job
          </AppText>
          
          <View style={styles.paymentMethodRow}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod === 'platform' && styles.paymentMethodButtonActive
              ]}
              onPress={() => setPaymentMethod('platform')}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="card-outline"
                size={24}
                color={paymentMethod === 'platform' ? colors.white : colors.primary}
              />
              <AppText
                variant={Variant.bodyMedium}
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'platform' && styles.paymentMethodTextActive
                ]}
              >
                Platform Payment
              </AppText>
              <AppText
                variant={Variant.caption}
                style={[
                  styles.paymentMethodSubtext,
                  paymentMethod === 'platform' && styles.paymentMethodSubtextActive
                ]}
              >
                SquadGoo handles payment
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod === 'direct' && styles.paymentMethodButtonActive
              ]}
              onPress={() => setPaymentMethod('direct')}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="cash-outline"
                size={24}
                color={paymentMethod === 'direct' ? colors.white : colors.primary}
              />
              <AppText
                variant={Variant.bodyMedium}
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'direct' && styles.paymentMethodTextActive
                ]}
              >
                Direct Payment
              </AppText>
              <AppText
                variant={Variant.caption}
                style={[
                  styles.paymentMethodSubtext,
                  paymentMethod === 'direct' && styles.paymentMethodSubtextActive
                ]}
              >
                Between parties
              </AppText>
            </TouchableOpacity>
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
  sectionSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(1.5),
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  paymentMethodButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: wp(4),
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  paymentMethodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentMethodText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginTop: hp(1),
    textAlign: 'center',
  },
  paymentMethodTextActive: {
    color: colors.white,
  },
  paymentMethodSubtext: {
    color: colors.gray,
    fontSize: getFontSize(11),
    marginTop: hp(0.5),
    textAlign: 'center',
  },
  paymentMethodSubtextActive: {
    color: colors.white,
    opacity: 0.9,
  },
})