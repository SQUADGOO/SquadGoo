import React, { useEffect, useState } from 'react'
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
import EducationSelector from '@/components/EducationSelector'
import QualificationSelector from '@/components/QualificationSelector'
import LanguageSelector from '@/components/LanguageSelector'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'

const dateFromMaybeIso = (value) => {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

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
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedTaxType, setSelectedTaxType] = useState('ABN')
  const [selectedEducations, setSelectedEducations] = useState([])
  const [selectedQualifications, setSelectedQualifications] = useState([])

  const editMode = route?.params?.editMode
  const draftJob = route?.params?.draftJob
  const existingJobId = route?.params?.jobId || draftJob?.id

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      educationalQualification: '',
      extraQualification: '',
      jobStartDate: null,
      jobStartTime: null,
      jobEndDate: null,
      jobEndTime: null,
      jobDescription: '',
    },
  })

  useEffect(() => {
    if (editMode && draftJob) {
      const langs = Array.isArray(draftJob.preferredLanguages) ? draftJob.preferredLanguages : []
      if (langs.length) setSelectedLanguages(langs)
      if (draftJob.taxType) setSelectedTaxType(draftJob.taxType)
      if (draftJob.educationalQualifications && Array.isArray(draftJob.educationalQualifications)) {
        setSelectedEducations(draftJob.educationalQualifications)
      } else if (draftJob.educationalQualification && draftJob.educationalQualification !== 'Not specified') {
        // fallback to a single string entry
        setSelectedEducations([{ id: `edu-${Date.now()}`, label: draftJob.educationalQualification }])
      }

      methods.reset({
        educationalQualification: '', // derived from selectedEducations
        extraQualification:
          draftJob.extraQualification && draftJob.extraQualification !== 'Not specified'
            ? draftJob.extraQualification
            : '',
        jobStartDate: dateFromMaybeIso(draftJob.jobStartDate),
        jobStartTime: dateFromMaybeIso(draftJob.jobStartTime),
        jobEndDate: dateFromMaybeIso(draftJob.jobEndDate),
        jobEndTime: dateFromMaybeIso(draftJob.jobEndTime),
        jobDescription:
          draftJob.jobDescription && draftJob.jobDescription !== 'No description provided'
            ? draftJob.jobDescription
            : '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, draftJob])

  const handleEducationSelect = (education) => {
    const label =
      education?.customValue ||
      (education?.course ? `${education.level} - ${education.course}` : education?.level) ||
      ''

    if (!label) return

    setSelectedEducations((prev) => {
      const exists = prev.some((e) => e.label === label)
      const next = exists ? prev : [...prev, { ...education, label }]
      methods.setValue('educationalQualification', next.map(e => e.label).join(', '))
      return next
    })
  }

  const handleEducationRemove = (label) => {
    setSelectedEducations((prev) => {
      const next = prev.filter((e) => e.label !== label)
      methods.setValue('educationalQualification', next.map(e => e.label).join(', '))
      return next
    })
  }

  const handleQualificationSelect = (qualifications) => {
    setSelectedQualifications(qualifications)
    const qualificationValue = qualifications.length > 0
      ? qualifications.map(q => q.displayTitle || q.title).join(', ')
      : ''
    methods.setValue('extraQualification', qualificationValue)
  }

  const handleLanguageSelect = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages((prev) => [...prev, language])
    }
  }

  const handleLanguageRemove = (language) => {
    setSelectedLanguages((prev) => prev.filter((lang) => lang !== language))
  }

  const handleNext = methods.handleSubmit((formValues) => {
    // require job description
    if (!formValues.jobDescription || !String(formValues.jobDescription).trim()) return

    const formData = {
      ...formValues,
      educationalQualifications: selectedEducations,
      preferredLanguages: selectedLanguages,
      taxType: selectedTaxType,
    }

    navigation.navigate(screenNames.MANUAL_SEARCH_STEPFOUR, {
      step1Data: route?.params?.step1Data,
      step2Data: route?.params?.step2Data,
      step3Data: formData,
      editMode: !!editMode,
      draftJob,
      jobId: existingJobId,
    })
  })

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
          <AppText variant={Variant.boldCaption} style={styles.label}>
            Required educational qualification
          </AppText>
          <EducationSelector
            onSelect={handleEducationSelect}
            selectedEducation={selectedEducations[selectedEducations.length - 1] || null}
            placeholder="Select education level"
          />

          {selectedEducations.length > 0 && (
            <View style={styles.languageTagsContainer}>
              {selectedEducations.map((edu) => (
                <LanguageTag
                  key={edu.label}
                  language={edu.label}
                  onRemove={() => handleEducationRemove(edu.label)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Extra Qualification */}
        <View style={styles.section}>
          <AppText variant={Variant.boldCaption} style={styles.label}>
            Required extra qualification
          </AppText>
          <QualificationSelector
            onSelect={handleQualificationSelect}
            selectedQualifications={selectedQualifications}
            placeholder="Select qualifications"
          />
        </View>

        {/* Preferred Languages */}
        <View style={styles.section}>
          <AppText variant={Variant.boldCaption} style={styles.label}>
            Preferred languages
          </AppText>
          <LanguageSelector
            onSelect={handleLanguageSelect}
            selectedValue={selectedLanguages[selectedLanguages.length - 1] || ''}
            placeholder="Select language"
          />

          {/* Display Selected Languages */}
          {selectedLanguages.length > 0 && (
            <View style={styles.languageTagsContainer}>
              {selectedLanguages.map((lang) => (
                <LanguageTag
                  key={lang}
                  language={lang}
                  onRemove={() => handleLanguageRemove(lang)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Job Start Date/Time */}
        <View style={styles.section}>
          <FormField
            label="Job start date"
            name="jobStartDate"
            type="datePicker"
            placeholder="Select date"
            minimumDate={new Date()}
          />
        </View>

        <View style={styles.section}>
          <FormField
            label="Job start time"
            name="jobStartTime"
            type="timePicker"
            placeholder="Select time"
          />
        </View>

        {/* Job End Date/Time */}
        <View style={styles.section}>
          <FormField
            label="Job end date"
            name="jobEndDate"
            type="datePicker"
            placeholder="Select date"
            minimumDate={new Date()}
          />
        </View>

        <View style={styles.section}>
          <FormField
            label="Job end time"
            name="jobEndTime"
            type="timePicker"
            placeholder="Select time"
          />
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <FormField
            label="Job description"
            name="jobDescription"
            multiline
            placeholder="Enter job description"
            rules={{ required: 'Job description is required' }}
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
          />
        </View>
      </ScrollView>

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
