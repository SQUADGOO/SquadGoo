import React, { useState, useRef } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import RbSheetComponent from '@/core/RbSheetComponent'
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'

const LanguageTag = ({ language, onRemove }) => (
  <View style={styles.languageTag}>
    <AppText variant={Variant.bodySmall} style={styles.languageTagText}>
      {language}
    </AppText>
    <TouchableOpacity onPress={onRemove} style={styles.removeTagButton}>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="close"
        size={14}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  </View>
)

const TaxTypeSelector = ({ selectedType, onSelect }) => {
  const options = ['ABN', 'TFN', 'Both']
  
  return (
    <View style={styles.taxTypeContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.taxTypeOption,
            selectedType === option && styles.taxTypeOptionActive
          ]}
          onPress={() => onSelect(option)}
          activeOpacity={0.8}
        >
          <AppText 
            variant={Variant.bodyMedium} 
            style={[
              styles.taxTypeText,
              selectedType === option && styles.taxTypeTextActive
            ]}
          >
            {option}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const StepThree = ({ navigation }) => {
  const [selectedLanguages, setSelectedLanguages] = useState(['English'])
  const [selectedTaxType, setSelectedTaxType] = useState('ABN')
  
  const educationSheetRef = useRef(null)
  const extraQualificationSheetRef = useRef(null)
  const languageSheetRef = useRef(null)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      educationalQualification: '',
      extraQualification: '',
      jobEndDate: '',
      jobDescription: ''
    }
  })

  const educationOptions = [
    { id: 1, title: 'High School' },
    { id: 2, title: 'Associate Degree' },
    { id: 3, title: 'Bachelor Degree' },
    { id: 4, title: 'Master Degree' },
    { id: 5, title: 'PhD' },
    { id: 6, title: 'Other' }
  ]

  const extraQualificationOptions = [
    { id: 1, title: 'Certification' },
    { id: 2, title: 'License' },
    { id: 3, title: 'Training Course' },
    { id: 4, title: 'Workshop' },
    { id: 5, title: 'Professional Development' }
  ]

  const languageOptions = [
    { id: 1, title: 'English' },
    { id: 2, title: 'Spanish' },
    { id: 3, title: 'French' },
    { id: 4, title: 'German' },
    { id: 5, title: 'Chinese' },
    { id: 6, title: 'Japanese' },
    { id: 7, title: 'Arabic' },
    { id: 8, title: 'Hindi' }
  ]

  const handleLanguageAdd = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages(prev => [...prev, language])
    }
    languageSheetRef.current?.close()
  }

  const handleLanguageRemove = (language) => {
    setSelectedLanguages(prev => prev.filter(lang => lang !== language))
  }

  const openDatePicker = () => {
    console.log('Open date picker')
    // Integrate with your date picker library
  }

  const onSubmit = (data) => {
    const formData = {
      ...data,
      preferredLanguages: selectedLanguages,
      taxType: selectedTaxType
    }
    
    console.log('Job requirements data:', formData)
    // Process form data and navigate
  }

  const handleNext = () => {
    methods.handleSubmit(onSubmit)()
    navigation.navigate(screenNames.JOB_PREVIEW)
  }

  const renderBottomSheetOptions = (options, onSelect) => (
    <View style={styles.sheetContent}>
      <View style={styles.sheetHeader}>
        <AppText variant={Variant.subTitle} style={styles.sheetTitle}>
          Select Option
        </AppText>
      </View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.sheetOption}
          onPress={() => {
            onSelect(option.title)
            // Close the appropriate sheet
          }}
          activeOpacity={0.7}
        >
          <AppText variant={Variant.body} style={styles.sheetOptionText}>
            {option.title}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <FormProvider {...methods}>
        <AppHeader
        showTopIcons={false}
        title="Job Requirements"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Educational Qualification */}
        <View style={styles.section}>
          
          <FormField
            label={'Required educational qualification'}
            name="educationalQualification"
            rules={{ required: true }}
            placeholder="Select option"
            onPressField={() => educationSheetRef.current?.open()}
          />
        </View>

        {/* Extra Qualification */}
        <View style={styles.section}>
          <FormField
            label={'Required extra qualification'}
            name="extraQualification"
            rules={{ required: true }}
            placeholder="Select option"
            onPressField={() => extraQualificationSheetRef.current?.open()}
          />
        </View>

        {/* Preferred Language */}
        <View style={styles.section}>
        
         <FormField
            label={'Preferred languages'}
            name="preferredLanguages"
            rules={{ required: true }}
            placeholder="Select languages"
            onPressField={() => languageSheetRef.current?.open()}
          />
        </View>

        {/* Job End Date */}
        <View style={styles.section}>
         <FormField
            label={'Job end date'}
            name="jobEndDate"
            rules={{ required: true }}
            placeholder="Select date"
            onPressField={openDatePicker}
          />
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <FormField
            label={'Job description'}
            name="jobDescription"
            rules={{ required: true }}
            multiline
            placeholder="Enter job description"
          />
        </View>

        {/* Tax Type */}
        <View style={styles.section}>
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Required Tax type
          </AppText>
          <TaxTypeSelector
            selectedType={selectedTaxType}
            onSelect={setSelectedTaxType}
          />
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

      {/* Bottom Sheets */}
      <RbSheetComponent
        ref={educationSheetRef}
        height={hp(50)}
        bgColor={colors.white}
      >
        <BottomDataSheet optionsData={educationOptions} onClose={() => educationSheetRef.current?.close()} />
      </RbSheetComponent>

      <RbSheetComponent
        ref={extraQualificationSheetRef}
        height={hp(50)}
        bgColor={colors.white}
      >
        <BottomDataSheet optionsData={extraQualificationOptions} onClose={() => extraQualificationSheetRef.current?.close()} />
      </RbSheetComponent>

      <RbSheetComponent
        ref={languageSheetRef}
        height={hp(60)}
        bgColor={colors.white}
      >
        <BottomDataSheet optionsData={languageOptions} onClose={() => languageSheetRef.current?.close()} />
      </RbSheetComponent>
    </FormProvider>
  )
}

export default StepThree

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  section: {
    // marginBottom: hp(3),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '500',
    marginBottom: hp(1.5),
  },
  dropdownField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.white,
  },
  dropdownText: {
    color: colors.gray || '#9CA3AF',
    fontSize: getFontSize(16),
    flex: 1,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.white,
  },
  languageTagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: hp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    gap: wp(1.5),
  },
  languageTagText: {
    color: '#FFFFFF',
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  removeTagButton: {
    padding: wp(0.5),
  },
  languageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  removeAllButton: {
    padding: wp(1),
  },
  languageActionSeparator: {
    width: 1,
    height: hp(3),
    backgroundColor: colors.grayE8,
    marginHorizontal: wp(2),
  },
  addLanguageButton: {
    padding: wp(1),
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.white,
  },
  dateText: {
    color: colors.gray || '#9CA3AF',
    fontSize: getFontSize(16),
    flex: 1,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: getFontSize(16),
    color: colors.black,
    backgroundColor: colors.white,
    minHeight: hp(15),
  },
  taxTypeContainer: {
    flexDirection: 'row',
    // backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: hp(3),
    padding: wp(1),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  taxTypeOption: {
    flex: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: hp(2.5),
    alignItems: 'center',
  },
  taxTypeOptionActive: {
    backgroundColor: '#F59E0B',
  },
  taxTypeText: {
    color: colors.primary || '#6B7280',
    fontSize: getFontSize(13),
    fontWeight: '500',
  },
  taxTypeTextActive: {
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
  
  // Bottom Sheet Styles
  sheetContent: {
    // flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  sheetHeader: {
    paddingVertical: hp(2),
    // borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
    // marginBottom: hp(2),
  },
  sheetTitle: {
    color: colors.black,
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sheetOption: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  sheetOptionText: {
    color: colors.black,
    fontSize: getFontSize(16),
  },
})