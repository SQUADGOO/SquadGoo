import React, { useRef, useState } from 'react'
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

const StepTwo = ({ navigation, route }) => {
  const [toggleStates, setToggleStates] = useState({
    publicHolidays: true,
    weekend: true,
    shiftLoading: true,
    bonuses: true,
    overtime: true
  })

  const [freshersCanApply, setFreshersCanApply] = useState(true)
  const yearsSheetRef = useRef(null)
  const monthsSheetRef = useRef(null)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      experienceYears: '0 Year',
      experienceMonths: '0 Month',
      availability: '',
      salaryMin: '',
      salaryMax: ''
    }
  })

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

  const handleToggle = (key) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

 const onSubmit = (data) => {
  const formData = {
    ...data,
    freshersCanApply,
    extraPay: toggleStates
  }

  console.log('✅ Step 2 Data:', formData)
  
  // Pass both step1Data and step2Data to next screen
  navigation.navigate(screenNames.STEP_THREE, { 
    step1Data: route.params?.step1Data, // Pass step1Data forward
    step2Data: formData 
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
        {/* Total Experience */}
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

          {/* Freshers Checkbox */}
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

        {/* Availability */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.availabilitySection}
            onPress={handleAvailabilityPress}
            activeOpacity={0.7}
          >
            <View style={{...globalStyles.rowJustify, marginBottom: hp(1)}}>
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Availability to work
              </AppText>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chevron-forward"
                size={20}
                color="#F59E0B"
              />
            </View>
            <AppText variant={Variant.body} style={styles.availabilityDescription}>
              Choose days and time you want seeker to be available
            </AppText>
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <FormField
              name="availability"
              placeholder="Search"
              endIcon={
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="search"
                  size={20}
                  color={colors.gray}
                />
              }
            />
          </View>
        </View>

        {/* Salary */}
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
                  validate: (value) => {
                    const numValue = parseFloat(value);
                    if (!value || isNaN(numValue) || numValue < 0) {
                      return 'Please enter a valid minimum salary';
                    }
                    return true;
                  }
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
                startIcon={
                  <AppText variant={Variant.body} style={styles.currencySymbol}>$</AppText>
                }
              />
            </View>
          </View>
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
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencySymbol: { color: colors.gray, fontSize: getFontSize(16), marginLeft: wp(2) },
  toText: { color: colors.gray, fontSize: getFontSize(16), bottom: 10 },
  toggleGrid: { gap: hp(2) },
  buttonContainer: { marginTop: hp(2), marginBottom: hp(6) },
})
