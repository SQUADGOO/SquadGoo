import React, { useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

// Small badge for selected languages
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

// Simple toggle row for tax type
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

const StepThree = ({ navigation, route }) => {
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
      jobDescription: '',
    },
  })

  const educationOptions = [
    { id: 1, title: 'High School' },
    { id: 2, title: 'Associate Degree' },
    { id: 3, title: 'Bachelor Degree' },
    { id: 4, title: 'Master Degree' },
    { id: 5, title: 'PhD' },
    { id: 6, title: 'Other' },
  ]

  const extraQualificationOptions = [
    { id: 1, title: 'Certification' },
    { id: 2, title: 'License' },
    { id: 3, title: 'Training Course' },
    { id: 4, title: 'Workshop' },
    { id: 5, title: 'Professional Development' },
  ]

  const languageOptions = [
    { id: 1, title: 'English' },
    { id: 2, title: 'Spanish' },
    { id: 3, title: 'French' },
    { id: 4, title: 'German' },
    { id: 5, title: 'Chinese' },
    { id: 6, title: 'Japanese' },
    { id: 7, title: 'Arabic' },
    { id: 8, title: 'Hindi' },
  ]

  const handleLanguageAdd = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages((prev) => [...prev, language])
    }
    languageSheetRef.current?.close()
  }

  const handleLanguageRemove = (language) => {
    setSelectedLanguages((prev) => prev.filter((lang) => lang !== language))
  }

  const openDatePicker = () => {
    console.log('Open date picker')
    // Replace with your actual date picker integration
  }

  const onSubmit = (data) => {
    const formData = {
      ...data,
      preferredLanguages: selectedLanguages,
      taxType: selectedTaxType,
    }

    console.log('✅ Step 3 Data:', formData)
    navigation.navigate(screenNames.JOB_PREVIEW, { step3Data: formData })
  }

const handleNext = (data) => {
  console.log('Form Data:', data)
  const formData = {
    ...data,
    preferredLanguages: selectedLanguages,
    taxType: selectedTaxType
  }

  console.log('Job requirements data:', formData)
  
  // Pass all three steps' data to preview screen
  navigation.navigate(screenNames.JOB_PREVIEW, { 
    step1Data: route.params?.step1Data,
    step2Data: route.params?.step2Data,
    step3Data: formData 
  })
}

  return (
    <FormProvider {...methods}>
      <AppHeader
        showTopIcons={false}
        title="Job Requirements"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <AppText
            variant={Variant.body}
            style={{
              color: colors.white,
              fontWeight: 'bold',
              fontSize: getFontSize(16),
            }}
          >
            Step 3/3
          </AppText>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Educational Qualification */}
        <View style={styles.section}>
          <FormField
            label="Required educational qualification"
            name="educationalQualification"
            placeholder="Select option"
            onPressField={() => educationSheetRef.current?.open()}
          />
        </View>

        {/* Extra Qualification */}
        <View style={styles.section}>
          <FormField
            label="Required extra qualification"
            name="extraQualification"
            placeholder="Select option"
            onPressField={() => extraQualificationSheetRef.current?.open()}
          />
        </View>

        {/* Preferred Languages */}
        <View style={styles.section}>
          <FormField
            label="Preferred languages"
            name="preferredLanguages"
            placeholder="Select languages"
            onPressField={() => languageSheetRef.current?.open()}
          />

          {/* Display Selected Languages */}
          <View style={styles.languageTagsContainer}>
            {selectedLanguages.map((lang) => (
              <LanguageTag
                key={lang}
                language={lang}
                onRemove={() => handleLanguageRemove(lang)}
              />
            ))}
          </View>
        </View>

        {/* Job End Date */}
        <View style={styles.section}>
          <FormField
            label="Job end date"
            name="jobEndDate"
            placeholder="Select date"
            onPressField={openDatePicker}
          />
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <FormField
            label="Job description"
            name="jobDescription"
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
            onPress={() => handleNext(methods.getValues())}
            bgColor={colors.primary}
            textColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <RbSheetComponent ref={educationSheetRef} height={hp(50)}>
        <BottomDataSheet
          optionsData={educationOptions}
          onClose={() => educationSheetRef.current.close()}
          onSelect={(selectedItem) =>
            methods.setValue('educationalQualification', selectedItem.title)
          }
        />
      </RbSheetComponent>

      <RbSheetComponent ref={extraQualificationSheetRef} height={hp(50)}>
        <BottomDataSheet
          optionsData={extraQualificationOptions}
          onClose={() => extraQualificationSheetRef.current.close()}
          onSelect={(selectedItem) =>
            methods.setValue('extraQualification', selectedItem.title)
          }
        />
      </RbSheetComponent>

      <RbSheetComponent ref={languageSheetRef} height={hp(60)}>
        <BottomDataSheet
          optionsData={languageOptions}
          onClose={() => languageSheetRef.current.close()}
          onSelect={(selectedItem) => handleLanguageAdd(selectedItem.title)}
        />
      </RbSheetComponent>
    </FormProvider>
  )
}

export default StepThree

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  section: {
    marginBottom: hp(2.5),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '500',
    marginBottom: hp(1.5),
  },
  languageTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(1.5),
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: hp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    gap: wp(1),
  },
  languageTagText: {
    color: '#FFFFFF',
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  removeTagButton: {
    padding: wp(0.5),
  },
  taxTypeContainer: {
    flexDirection: 'row',
    borderRadius: hp(3),
    borderWidth: 1,
    borderColor: colors.primary,
    padding: wp(1),
  },
  taxTypeOption: {
    flex: 1,
    paddingVertical: hp(1.2),
    borderRadius: hp(2.5),
    alignItems: 'center',
  },
  taxTypeOptionActive: {
    backgroundColor: '#F59E0B',
  },
  taxTypeText: {
    color: colors.primary,
    fontSize: getFontSize(13),
    fontWeight: '500',
  },
  taxTypeTextActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: hp(3),
    marginBottom: hp(6),
  },
})
