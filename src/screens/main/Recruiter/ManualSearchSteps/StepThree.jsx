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
import MultiSelectSheet from '@/components/MultiSelectSheet'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import {
  EXTRA_QUALIFICATIONS_OPTIONS,
  PREFERRED_LANGUAGES_OPTIONS,
} from '@/constants/jobFormOptions'

const dateFromMaybeIso = (value) => {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

// Simple toggle row for tax type
const TaxTypeSelector = ({ selectedType, onSelect }) => {
  const options = ['ABN', 'TFN', 'ANY']

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
  const [selectedTaxType, setSelectedTaxType] = useState('ABN')
  const [selectedQualifications, setSelectedQualifications] = useState([])
  const [selectedLanguageItems, setSelectedLanguageItems] = useState([
    { key: 'english', title: 'English' },
  ])
  const [interestedInSquadPairs, setInterestedInSquadPairs] = useState(false)

  const editMode = route?.params?.editMode
  const draftJob = route?.params?.draftJob
  const existingJobId = route?.params?.jobId || draftJob?.id
  const returnToPreview = route?.params?.returnToPreview
  const previewData = route?.params?.previewData

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      extraQualification: '',
      jobStartDate: null,
      jobStartTime: null,
      jobEndDate: null,
      jobEndTime: null,
      jobDescription: '',
      requiredUniforms: '',
    },
  })

  useEffect(() => {
    if (returnToPreview && previewData?.step3Data) {
      const s3 = previewData.step3Data
      const langs =
        Array.isArray(s3.preferredLanguageItems) && s3.preferredLanguageItems.length
          ? s3.preferredLanguageItems
          : [{ key: 'english', title: 'English' }]
      setSelectedLanguageItems(langs)

      if (s3.taxType) setSelectedTaxType(s3.taxType)
      if (typeof s3.interestedInSquadPairs === 'boolean') {
        setInterestedInSquadPairs(s3.interestedInSquadPairs)
      }
      if (Array.isArray(s3.extraQualificationItems)) {
        setSelectedQualifications(s3.extraQualificationItems)
      }

      methods.reset({
        extraQualification: s3.extraQualification || '',
        jobStartDate: s3.jobStartDate || null,
        jobStartTime: s3.jobStartTime || null,
        jobEndDate: s3.jobEndDate || null,
        jobEndTime: s3.jobEndTime || null,
        jobDescription: s3.jobDescription || '',
        requiredUniforms: s3.requiredUniforms || '',
      })
      return
    }

    if (editMode && draftJob) {
      const langsRaw =
        Array.isArray(draftJob.preferredLanguageItems) ? draftJob.preferredLanguageItems : null
      const langs =
        langsRaw ||
        (Array.isArray(draftJob.preferredLanguages)
          ? draftJob.preferredLanguages.map((t, idx) => ({ key: `lang-${idx}`, title: t }))
          : [])
      if (langs.length) setSelectedLanguageItems(langs)

      if (draftJob.taxType) setSelectedTaxType(draftJob.taxType)
      if (typeof draftJob.interestedInSquadPairs === 'boolean') {
        setInterestedInSquadPairs(draftJob.interestedInSquadPairs)
      }
      methods.reset({
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
        requiredUniforms:
          draftJob.requiredUniforms && draftJob.requiredUniforms !== 'Not specified'
            ? draftJob.requiredUniforms
            : '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, draftJob])

  const toDisplayString = (item) =>
    item?.specifyText ? `${item.title}: ${item.specifyText}` : item?.title

  const handleQualificationsChange = (items) => {
    setSelectedQualifications(items)
    const value =
      items.length > 0 ? items.map(toDisplayString).filter(Boolean).join(', ') : ''
    methods.setValue('extraQualification', value)
  }

  const handleLanguagesChange = (items) => {
    setSelectedLanguageItems(items)
  }

  const handleNext = methods.handleSubmit((formValues) => {
    // require job description
    if (!formValues.jobDescription || !String(formValues.jobDescription).trim()) return
    if (!formValues.requiredUniforms || !String(formValues.requiredUniforms).trim()) return

    const formData = {
      ...formValues,
      preferredLanguageItems: selectedLanguageItems,
      preferredLanguages: selectedLanguageItems.map(toDisplayString).filter(Boolean),
      taxType: selectedTaxType,
      interestedInSquadPairs,
      extraQualificationItems: selectedQualifications,
    }

    if (returnToPreview) {
      navigation.navigate(screenNames.JOB_PREVIEW, {
        step1Data: previewData?.step1Data,
        step2Data: previewData?.step2Data,
        step3Data: formData,
        step4Data: previewData?.step4Data,
        editMode: previewData?.editMode,
        draftJob: previewData?.draftJob,
        jobId: previewData?.jobId,
      })
      return
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
        {/* Extra Qualification */}
        <View style={styles.section}>
          <AppText variant={Variant.boldCaption} style={styles.label}>
            Required extra qualification
          </AppText>
          <MultiSelectSheet
            title="Extra Qualifications"
            placeholder="Select all that apply"
            options={EXTRA_QUALIFICATIONS_OPTIONS}
            selectedItems={selectedQualifications}
            onChange={handleQualificationsChange}
          />
        </View>

        {/* Preferred Languages */}
        <View style={styles.section}>
          <AppText variant={Variant.boldCaption} style={styles.label}>
            Preferred languages
          </AppText>
          <MultiSelectSheet
            title="Preferred Languages"
            placeholder="English (default)"
            options={PREFERRED_LANGUAGES_OPTIONS}
            selectedItems={selectedLanguageItems}
            onChange={handleLanguagesChange}
          />
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
            label="Roles and responsibilities"
            name="jobDescription"
            multiline
            placeholder="ROLES AND RESPONSIBILITIES"
            rules={{ required: 'Job description is required' }}
          />
        </View>

        {/* Mandatory requirements */}
        <View style={styles.section}>
          <FormField
            label="Required uniforms"
            name="requiredUniforms"
            multiline
            placeholder="Required Uniforms"
            rules={{ required: 'Required uniforms is required' }}
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

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.squadPairsRow}
            activeOpacity={0.8}
            onPress={() => setInterestedInSquadPairs((v) => !v)}
          >
            <View style={[styles.checkbox, interestedInSquadPairs && styles.checkboxActive]}>
              {interestedInSquadPairs ? (
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark"
                  size={16}
                  color="#FFFFFF"
                />
              ) : null}
            </View>
            <AppText variant={Variant.body} style={styles.checkboxText}>
              Interested in SquadPairs
            </AppText>
          </TouchableOpacity>
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
