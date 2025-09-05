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

const ToggleSwitch = ({ label, value, onToggle, style }) => (
  <View style={[styles.toggleContainer, style]}>
    <AppText variant={Variant.bodyMedium} style={styles.toggleLabel}>
      {label}
    </AppText>
    <TouchableOpacity
      style={[styles.toggleSwitch, value && styles.toggleSwitchActive]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleOption, !value && styles.toggleOptionActive]}>
        <AppText variant={Variant.bodySmall} style={[styles.toggleText, !value && styles.toggleTextActive]}>
          No
        </AppText>
      </View>
      <View style={[styles.toggleOption, value && styles.toggleOptionActive]}>
        <AppText variant={Variant.bodySmall} style={[styles.toggleText, value && styles.toggleTextActive]}>
          Yes
        </AppText>
      </View>
    </TouchableOpacity>
  </View>
)

const StepTwo = ({ navigation }) => {
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
    navigation.navigate(screenNames.STEP_THREE)
    const formData = {
      ...data,
      freshersCanApply,
      extraPay: toggleStates
    }
    
    console.log('Step 2 data:', formData)
    // Navigate to step 3 or process data
  }

  const handleNext = () => {
    methods.handleSubmit(onSubmit)()
  }

  const handleAvailabilityPress = () => {
    console.log('Open availability selector')
    navigation.navigate(screenNames.ABILITY_TO_WORK)
    // Navigate to availability selection screen
  }

  return (
    <FormProvider {...methods}>
        <AppHeader
          title="Manual Search"
            showTopIcons={false}
             rightComponent={
                      <View style={{}}>
                        <TouchableOpacity 
                          activeOpacity={0.7}
                        >
                          <AppText variant={Variant.body} style={{
                            color: colors.white,
                            fontWeight: 'bold',
                            fontSize: getFontSize(16),
                          }}>
                            Step 2/3
                          </AppText>
                        </TouchableOpacity>
                      </View>
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
                onPressField={() => {yearsSheetRef.current?.open()}}
                placeholder="0 Year"
                rules={{ required: 'Experience years is required' }}
                containerStyle={styles.experienceDropdown}
                />
            </View>
             <View style={{width: '48%'}}>
            <FormField
              name="experienceMonths"
              placeholder="0 Month"
              onPressField={() => {monthsSheetRef.current?.open()}}
              rules={{ required: 'Experience months is required' }}
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
            <View style={styles.availabilityHeader}>
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
            //   inputWrapperStyle={styles.searchInput}
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
            //   rules={{ required: 'Minimum salary is required' }}
            //   containerStyle={styles.salaryInput}
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
            //   rules={{ required: 'Maximum salary is required' }}
              containerStyle={styles.salaryInput}
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
              label="Weekened"
              onToggle={() => handleToggle('weekened')}
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
              onToggle={() => handleToggle('bonuses')}
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
            // style={styles.nextButton}
          />
        </View>
      </ScrollView>

      <RbSheetComponent
        ref={yearsSheetRef}
        height={hp(50)}
        >
            <BottomDataSheet optionsData={experienceYearOptions} />
        </RbSheetComponent>
      <RbSheetComponent
        ref={monthsSheetRef}
        height={hp(50)}
        >
            <BottomDataSheet optionsData={experienceMonthOptions} />
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
  section: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '500',
    marginBottom: hp(2),
  },
  experienceRow: {
    flexDirection: 'row',
    gap: wp(3),
    marginBottom: hp(1),
  },
  experienceDropdown: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: hp(1),
  },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(1.5),
    borderWidth: 2,
    borderColor: colors.grayE8 || '#E5E7EB',
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  checkboxText: {
    color: colors.secondary || '#6B7280',
    ...typography.label
  },
  availabilitySection: {
    marginBottom: hp(2),
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: hp(1),
  },
  availabilityDescription: {
    color: colors.textPrimary || '#6B7280',
    fontSize: getFontSize(12),
  },
  searchContainer: {
    marginTop: hp(1),
  },
  searchInput: {
    borderRadius: hp(3),
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: wp(3),
  },
  salaryInput: {
    flex: 1,
  },
  currencySymbol: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(16),
    marginLeft: wp(2),
  },
  toText: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(16),
    bottom: 10,
    
  },
  toggleGrid: {
    gap: hp(2),
  },
  toggleItem: {
    // Individual toggle item styling handled in ToggleSwitch component
  },
  toggleItemSingle: {
    // For the single overtime toggle that spans full width
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    color: '#7C3AED',
    fontSize: getFontSize(16),
    flex: 1,
  },
  toggleSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: hp(3),
    padding: wp(1),
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  toggleSwitchActive: {
    // Additional styling for active state if needed
  },
  toggleOption: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: hp(2.5),
    minWidth: wp(16),
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: '#F59E0B',
  },
  toggleText: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: hp(2),
    marginBottom: hp(6),
  },
  nextButton: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },
})