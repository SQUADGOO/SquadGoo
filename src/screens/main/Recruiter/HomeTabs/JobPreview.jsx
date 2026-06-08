import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native'
import { CommonActions } from '@react-navigation/native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AppHeader from '@/core/AppHeader'
import AppButton from '@/core/AppButton'
import { useCreateJob, useUpdateJobDraft, usePublishJob } from '@/api/jobs/jobs.query'
import { screenNames } from '@/navigation/screenNames'
import moment from 'moment'

const JobPreview = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  const createJob = useCreateJob()
  const updateDraft = useUpdateJobDraft()
  const publishJob = usePublishJob()
  
  // Get data from all three steps
  const { step1Data, step2Data, step3Data, step4Data, editMode, draftJob, jobId: existingJobId } = route.params || {}
  console.log('step3Data', step3Data)

  const previewData = {
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    editMode: !!editMode,
    draftJob,
    jobId: existingJobId,
  }

  const isEmptyValue = (value) => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' && value.trim() === '') return true
    if (Array.isArray(value) && value.length === 0) return true
    return false
  }

  const parseNumberFromText = (value) => {
    if (value === null || value === undefined) return 0
    const m = String(value).match(/(\d+)/)
    return m ? Number(m[1]) : 0
  }

  const getSalarySuffix = (salaryType) => {
    const t = String(salaryType || '').trim().toLowerCase()
    if (t.includes('hourly')) return '/hr'
    if (t.includes('daily')) return '/day'
    if (t.includes('weekly')) return '/week'
    if (t.includes('annual')) return '/year'
    if (t.includes('per task') || t.includes('piecework')) return '/task'
    if (t.includes('contract') || t.includes('project')) return '/project'
    return ''
  }

  const formatAvailability = (availability) => {
    if (!availability) return ''
    if (typeof availability === 'string') return availability.trim()
    if (typeof availability !== 'object') return ''

    const lines = Object.entries(availability)
      .filter(([, v]) => v?.enabled && v?.from && v?.to)
      .map(([day, v]) => `${day}: ${v.from}–${v.to}`)

    return lines.length ? lines.join('\n') : ''
  }

  const getMissingRequiredFields = () => {
    const missing = []

    const jobTitle = step1Data?.jobTitle
    const jobType = step1Data?.jobType
    const workLocation = step4Data?.workLocation || step1Data?.workLocation
    const rangeKm = step4Data?.rangeKm ?? step1Data?.rangeKm
    const staffNumber = step1Data?.staffNumber

    if (isEmptyValue(jobTitle)) missing.push('Job title')
    if (isEmptyValue(jobType)) missing.push('Job type')
    if (isEmptyValue(workLocation)) missing.push('Work location')
    if (rangeKm === null || rangeKm === undefined) missing.push('Range from location')
    if (isEmptyValue(staffNumber)) missing.push('Positions')

    const salaryType = step2Data?.salaryType
    const salaryMin = step2Data?.salaryMin
    const salaryMax = step2Data?.salaryMax
    if (isEmptyValue(salaryType)) missing.push('Salary type')
    if (isEmptyValue(salaryMin)) missing.push('Salary min')
    if (isEmptyValue(salaryMax)) missing.push('Salary max')

    const availabilityText = formatAvailability(step2Data?.availability)
    if (isEmptyValue(availabilityText)) missing.push('Availability')

    const taxType = step3Data?.taxType
    if (isEmptyValue(taxType)) missing.push('Required tax type')

    const jobDescription = step3Data?.jobDescription
    if (isEmptyValue(jobDescription)) missing.push('Job description')

    return missing
  }

  const missingRequiredFields = getMissingRequiredFields()
  const canSave = missingRequiredFields.length === 0
  const isDraftEdit =
    !!editMode &&
    !!draftJob &&
    String(draftJob?.status || '').toLowerCase() === 'draft'
  const isEditingActive = !!editMode && !!existingJobId && !isDraftEdit

  const buildManualDraftJobData = (draftId) => {
    const salarySuffix = getSalarySuffix(step2Data?.salaryType || draftJob?.salaryType)
    const salaryMin = step2Data?.salaryMin ?? draftJob?.salaryMin
    const salaryMax = step2Data?.salaryMax ?? draftJob?.salaryMax

    const title =
      step1Data?.jobTitle ||
      draftJob?.title ||
      draftJob?.jobTitle ||
      'Untitled draft'

    const salaryRange =
      salaryMin && salaryMax
        ? `$${salaryMin} to $${salaryMax}${salarySuffix}`
        : (draftJob?.salaryRange || '')

    return {
      id: draftId,
      title,
      type: step1Data?.jobType || draftJob?.type || '',
      location: step4Data?.workLocation || step1Data?.workLocation || draftJob?.location || '',
      rangeKm: step4Data?.rangeKm ?? step1Data?.rangeKm ?? draftJob?.rangeKm ?? 0,
      staffNumber: step1Data?.staffNumber ?? draftJob?.staffNumber ?? '',
      jobReferenceId: step1Data?.jobReferenceId || draftJob?.jobReferenceId,
      experience: draftJob?.experience || '',
      salaryRange,
      salaryMin,
      salaryMax,
      salaryType: step2Data?.salaryType || draftJob?.salaryType || 'Hourly Rate',
      salaryTypeOther: step2Data?.salaryTypeOther || draftJob?.salaryTypeOther || '',
      salaryTypeDisplay:
        step2Data?.salaryTypeDisplay ||
        draftJob?.salaryTypeDisplay ||
        step2Data?.salaryType ||
        draftJob?.salaryType ||
        '',
      expireDate: draftJob?.expireDate || 'Not set',
      extraPay: step2Data?.extraPay || draftJob?.extraPay || {},
      extraPayRates: step2Data?.extraPayRates || draftJob?.extraPayRates || {},
      availability: step2Data?.availability || draftJob?.availability || '',
      freshersCanApply: step2Data?.freshersCanApply ?? draftJob?.freshersCanApply ?? false,
      extraQualification: step3Data?.extraQualification || draftJob?.extraQualification || '',
      extraQualificationItems:
        step3Data?.extraQualificationItems || draftJob?.extraQualificationItems || [],
      preferredLanguages: step3Data?.preferredLanguages || draftJob?.preferredLanguages || [],
      preferredLanguageItems:
        step3Data?.preferredLanguageItems || draftJob?.preferredLanguageItems || [],
      jobEndDate: step3Data?.jobEndDate || draftJob?.jobEndDate,
      jobStartDate: step3Data?.jobStartDate || draftJob?.jobStartDate,
      jobStartTime: step3Data?.jobStartTime || draftJob?.jobStartTime || null,
      jobEndTime: step3Data?.jobEndTime || draftJob?.jobEndTime || null,
      jobDescription: step3Data?.jobDescription || draftJob?.jobDescription || '',
      requiredUniforms:
        step3Data?.requiredUniforms || draftJob?.requiredUniforms || '',
      description: step3Data?.jobDescription || draftJob?.description || '',
      rolesAndResponsibilities: step3Data?.jobDescription || draftJob?.rolesAndResponsibilities || '',
      taxType: step3Data?.taxType || draftJob?.taxType || '',
      interestedInSquadPairs:
        step3Data?.interestedInSquadPairs ??
        draftJob?.interestedInSquadPairs ??
        false,
      jobCategory: step1Data?.jobCategory || draftJob?.jobCategory || '',
      jobSubCategory: step1Data?.jobSubCategory || draftJob?.jobSubCategory || '',
      searchType: 'manual',
      rawData: { step1Data, step2Data, step3Data, step4Data },
    }
  }

  const handleSaveAsDraft = async () => {
    const draftData = buildManualDraftJobData(existingJobId)
    try {
      if (isDraftEdit && existingJobId) {
        await updateDraft.mutateAsync({ id: existingJobId, data: draftData })
      } else {
        await createJob.mutateAsync({ ...draftData, status: 'draft' })
      }
    } catch {
      return // hook surfaces the error toast
    }

    Alert.alert(
      'Saved to drafts',
      'You can find this offer in "Drafted offers" on the dashboard.',
      [
        {
          text: 'Back to dashboard',
          onPress: () => {
            navigation.navigate(screenNames.Tab_NAVIGATION, {
              screen: screenNames.HOME,
            })
          },
        },
      ],
    )
  }

  const handlePostJob = async () => {
    if (!canSave) {
      Alert.alert(
        'Missing required fields',
        `Please complete: ${missingRequiredFields.join(', ')}`
      )
      return
    }

    const isEdit = isEditingActive
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    
    // Format job data
    const jobId = isEdit ? existingJobId : (existingJobId || `manual-job-${Date.now()}`)
    const salarySuffix = getSalarySuffix(step2Data?.salaryType)
    const jobData = {
      id: jobId,
      title: step1Data?.jobTitle,
      type: step1Data?.jobType,
      location: step4Data?.workLocation || step1Data?.workLocation,
      rangeKm: step4Data?.rangeKm ?? (step1Data?.rangeKm || 0),
      staffNumber: step1Data?.staffNumber,
      jobReferenceId: step1Data?.jobReferenceId,
      experience: step2Data ? (() => {
        // Extract numbers from strings like "2 Years" or "2 Months"
        const extractNumber = (str) => {
          if (!str) return 0;
          const match = str.toString().match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        };
        const years = extractNumber(step2Data.experienceYears);
        const months = extractNumber(step2Data.experienceMonths);
        return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
      })() : '',
      salaryRange: step2Data ? `$${step2Data.salaryMin} to $${step2Data.salaryMax}${salarySuffix}` : '',
      salaryMin: step2Data?.salaryMin,
      salaryMax: step2Data?.salaryMax,
      salaryType: step2Data?.salaryType,
      salaryTypeOther: step2Data?.salaryTypeOther || '',
      salaryTypeDisplay: step2Data?.salaryTypeDisplay || '',
      expireDate: (isEdit && draftJob?.expireDate) ? draftJob.expireDate : (draftJob?.expireDate || expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })),
      extraPay: step2Data?.extraPay || {},
      extraPayRates: step2Data?.extraPayRates || {},
      availability: step2Data?.availability,
      freshersCanApply: step2Data?.freshersCanApply || false,
      extraQualification: step3Data?.extraQualification,
      extraQualificationItems: step3Data?.extraQualificationItems || [],
      preferredLanguages: step3Data?.preferredLanguages || [],
      preferredLanguageItems: step3Data?.preferredLanguageItems || [],
      jobEndDate: step3Data?.jobEndDate,
      jobStartDate: step3Data?.jobStartDate,
      jobStartTime: step3Data?.jobStartTime || null,
      jobEndTime: step3Data?.jobEndTime || null,
      jobDescription: step3Data?.jobDescription,
      requiredUniforms: step3Data?.requiredUniforms,
      description: step3Data?.jobDescription,
      rolesAndResponsibilities: step3Data?.jobDescription || '',
      taxType: step3Data?.taxType,
      interestedInSquadPairs: step3Data?.interestedInSquadPairs || false,
      jobCategory: step1Data?.jobCategory || '',
      jobSubCategory: step1Data?.jobSubCategory || '',
      searchType: 'manual',
      rawData: { step1Data, step2Data, step3Data, step4Data }, // Store complete data for future reference
    }
    
    let savedJob
    try {
      if (isDraftEdit && existingJobId) {
        // Editing an existing draft → save the changes, then publish it in place
        // (flip draft → posted) so we don't create a duplicate job.
        await updateDraft.mutateAsync({ id: existingJobId, data: jobData })
        savedJob = await publishJob.mutateAsync(existingJobId)
      } else if (isEdit && existingJobId) {
        // Backend only allows editing draft jobs; a posted-job edit is rejected (409)
        // and the hook surfaces that message. Posted-job editing is out of scope this phase.
        savedJob = await updateDraft.mutateAsync({ id: existingJobId, data: jobData })
      } else {
        savedJob = await createJob.mutateAsync({ ...jobData, status: 'posted' })
      }
    } catch {
      return // hook surfaces the error toast
    }

    const savedJobId = savedJob?.id || existingJobId

    // Show success alert and navigate to match list
    Alert.alert(
      isEdit ? 'Job Updated Successfully!' : 'Job Posted Successfully!',
      isEdit
        ? 'Your job offer has been updated.'
        : 'Candidates have been matched based on your criteria.',
      [
        {
          text: 'View Matches',
          onPress: () => {
            navigation.navigate(screenNames.MANUAL_MATCH_LIST, {
              jobId: savedJobId,
              fromJobPost: true,
            })
          },
        },
      ]
    )
  }

  const DetailRow = ({ label, value, valueStyle, hideIfEmpty = true }) => {
    if (hideIfEmpty && isEmptyValue(value)) return null
    return (
    <View style={styles.detailRow}>
      <AppText variant={Variant.body} style={styles.detailLabel}>
        {label}
      </AppText>
      <AppText variant={Variant.bodyMedium} style={[styles.detailValue, valueStyle]}>
        {value}
      </AppText>
    </View>
    )
  }

  const SectionTitle = ({ title }) => (
    <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
      {title}
    </AppText>
  )

  const StepSectionHeader = ({ title, onEdit }) => (
    <View style={styles.stepHeader}>
      <AppText variant={Variant.bodyMedium} style={styles.stepHeaderTitle}>
        {title}
      </AppText>
      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.8}
        style={styles.stepHeaderEdit}
      >
        <VectorIcons
          name={iconLibName.Feather}
          iconName="edit-2"
          size={18}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  )

  const openEditStep = (step) => {
    if (step === 1) {
      navigation.navigate(screenNames.MANUAL_SEARCH, {
        returnToPreview: true,
        previewData,
        step1Data,
        editMode: true,
        draftJob,
        jobId: existingJobId,
      })
      return
    }
    if (step === 2) {
      navigation.navigate(screenNames.STEP_TWO, {
        returnToPreview: true,
        previewData,
        step1Data,
        editMode: true,
        draftJob,
        jobId: existingJobId,
      })
      return
    }
    if (step === 3) {
      navigation.navigate(screenNames.STEP_THREE, {
        returnToPreview: true,
        previewData,
        step1Data,
        step2Data,
        editMode: true,
        draftJob,
        jobId: existingJobId,
      })
      return
    }
    if (step === 4) {
      navigation.navigate(screenNames.MANUAL_SEARCH_STEPFOUR, {
        returnToPreview: true,
        previewData,
        step1Data,
        step2Data,
        step3Data,
        step4Data,
        editMode: true,
        draftJob,
        jobId: existingJobId,
      })
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <AppHeader title="Job Preview" showTopIcons={false} height={hp(14)} />

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Step 1 */}
        <StepSectionHeader
          title="Step 1: Job Requirements"
          onEdit={() => openEditStep(1)}
        />
        <DetailRow 
          label="Job title:" 
          value={step1Data?.jobTitle}
          valueStyle={styles.jobTitle}
          hideIfEmpty={false}
        />
        
        <DetailRow 
          label="Job type:" 
          value={step1Data?.jobType}
          hideIfEmpty={false}
        />
        
        <DetailRow 
          label="Positions:" 
          value={step1Data?.staffNumber}
          hideIfEmpty={false}
        />

        {/* Step 4 (Location) */}
        <StepSectionHeader
          title="Step 4: Location"
          onEdit={() => openEditStep(4)}
        />
        <DetailRow 
          label="Work location:" 
          value={step4Data?.workLocation || step1Data?.workLocation}
          hideIfEmpty={false}
        />
        <DetailRow 
          label="Range from location:" 
          value={(step4Data?.rangeKm ?? step1Data?.rangeKm) !== undefined ? `${step4Data?.rangeKm ?? step1Data?.rangeKm} km` : ''}
          hideIfEmpty={false}
        />
        
        {/* Step 2 */}
        <StepSectionHeader
          title="Step 2: Salary, Extra Pay & Availability"
          onEdit={() => openEditStep(2)}
        />
        {(() => {
          const years = parseNumberFromText(step2Data?.experienceYears)
          const months = parseNumberFromText(step2Data?.experienceMonths)
          const isExperienceZero = years === 0 && months === 0
          return (
            <>
        <DetailRow 
          label="Experience:" 
          value={step2Data ? `${years} Years ${months} Months` : ''}
          hideIfEmpty={false}
        />

        {isExperienceZero && (
          <DetailRow
            label="Freshers can also apply:"
            value={step2Data?.freshersCanApply ? 'Yes' : 'No'}
            hideIfEmpty={false}
          />
        )}

        <DetailRow
          label="Salary range ($/hr or $/day):"
          value={
            step2Data
              ? `$${step2Data.salaryMin}–$${step2Data.salaryMax}${getSalarySuffix(
                  step2Data?.salaryType,
                )}`
              : ''
          }
          valueStyle={styles.salaryValue}
          hideIfEmpty={false}
        />

        <DetailRow
          label="Salary type:"
          value={step2Data?.salaryTypeDisplay || step2Data?.salaryType || ''}
          hideIfEmpty={false}
        />
            </>
          )
        })()}
        
        {/* Extra pay you are offering - only show selected items */}
        {(step2Data?.extraPay?.publicHolidays || step2Data?.extraPay?.weekend || step2Data?.extraPay?.shiftLoading || step2Data?.extraPay?.bonuses || step2Data?.extraPay?.overtime) ? (
          <>
            <SectionTitle title="Extra pay you are offering:" />

            {step2Data?.extraPay?.publicHolidays ? (
              <DetailRow
                label="Public holidays:"
                value={step2Data?.extraPayRates?.publicHolidays ? `$${step2Data.extraPayRates.publicHolidays}` : 'Yes'}
                valueStyle={styles.yesValue}
              />
            ) : null}

            {step2Data?.extraPay?.weekend ? (
              <DetailRow
                label="Weekend:"
                value={step2Data?.extraPayRates?.weekend ? `$${step2Data.extraPayRates.weekend}` : 'Yes'}
                valueStyle={styles.yesValue}
              />
            ) : null}

            {step2Data?.extraPay?.shiftLoading ? (
              <DetailRow
                label="Shift loading:"
                value={step2Data?.extraPayRates?.shiftLoading ? `$${step2Data.extraPayRates.shiftLoading}` : 'Yes'}
                valueStyle={styles.yesValue}
              />
            ) : null}

            {step2Data?.extraPay?.bonuses ? (
              <DetailRow
                label="Bonuses:"
                value={step2Data?.extraPayRates?.bonuses ? `$${step2Data.extraPayRates.bonuses}` : 'Yes'}
                valueStyle={styles.yesValue}
              />
            ) : null}

            {step2Data?.extraPay?.overtime ? (
              <DetailRow
                label="Overtime:"
                value={step2Data?.extraPayRates?.overtime ? `$${step2Data.extraPayRates.overtime}` : 'Yes'}
                valueStyle={styles.yesValue}
              />
            ) : null}
          </>
        ) : null}

        {/* Availability Section - Step 2 Data */}
        <SectionTitle title="Availability to work:" />
        
        {formatAvailability(step2Data?.availability) ? (
          <View style={styles.availabilityContainer}>
            <AppText variant={Variant.body} style={styles.detailValue}>
              {formatAvailability(step2Data?.availability)}
            </AppText>
          </View>
        ) : null}

        {/* Step 3 */}
        <StepSectionHeader
          title="Step 3: Requirements, Dates & Tax"
          onEdit={() => openEditStep(3)}
        />
        {!isEmptyValue(step3Data?.extraQualification) ? (
          <View style={styles.requirementSection}>
            <AppText variant={Variant.body} style={styles.requirementLabel}>
              Required extra qualification:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
              {step3Data?.extraQualification}
            </AppText>
          </View>
        ) : null}

        {Array.isArray(step3Data?.preferredLanguages) && step3Data.preferredLanguages.length > 0 ? (
          <View style={styles.requirementSection}>
            <AppText variant={Variant.body} style={styles.requirementLabel}>
              Preferred language:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
              {step3Data.preferredLanguages.join(', ')}
            </AppText>
          </View>
        ) : null}

        {step3Data?.jobStartDate ? (
          <View style={styles.requirementSection}>
            <AppText variant={Variant.body} style={styles.requirementLabel}>
              Job start date:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
              {moment(step3Data?.jobStartDate).format('DD MMM YYYY')}
            </AppText>
          </View>
        ) : null}

        {step3Data?.jobStartTime ? (
          <View style={styles.requirementSection}>
            <AppText variant={Variant.body} style={styles.requirementLabel}>
              Job start time:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
              {moment(step3Data?.jobStartTime).format('hh:mm A')}
            </AppText>
          </View>
        ) : null}

        {step3Data?.jobEndDate ? (
          <View style={styles.requirementSection}>
            <AppText variant={Variant.body} style={styles.requirementLabel}>
              Job end date:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
              {moment(step3Data?.jobEndDate).format('DD MMM YYYY')}
            </AppText>
          </View>
        ) : null}

        {step3Data?.jobEndTime ? (
          <View style={styles.requirementSection}>
            <AppText variant={Variant.body} style={styles.requirementLabel}>
              Job end time:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
              {moment(step3Data?.jobEndTime).format('hh:mm A')}
            </AppText>
          </View>
        ) : null}

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required Tax type:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.taxType}
          </AppText>
        </View>

        {!isEmptyValue(step3Data?.requiredUniforms) ? (
          <View style={styles.requirementSection}>
            <AppText variant={Variant.body} style={styles.requirementLabel}>
              Required uniforms:
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
              {step3Data?.requiredUniforms}
            </AppText>
          </View>
        ) : null}

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Interested in SquadPairs:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.interestedInSquadPairs ? 'Yes' : 'No'}
          </AppText>
        </View>

        {/* Description - Step 3 Data */}
        <View style={styles.descriptionSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Description:
          </AppText>
          <AppText variant={Variant.body} style={styles.descriptionText}>
            {step3Data?.jobDescription}
          </AppText>
        </View>

        {/* Actions */}
        {isEditingActive ? (
          <View style={styles.buttonRow}>
            <AppButton
              text="Cancel / Back"
              onPress={() => navigation.goBack()}
              secondary
              bgColor={colors.white}
              style={styles.buttonHalf}
            />
            <AppButton
              text="Save"
              onPress={handlePostJob}
              bgColor={colors.primary}
              isLoading={createJob.isPending || updateDraft.isPending || publishJob.isPending}
              disabled={!canSave || createJob.isPending || updateDraft.isPending || publishJob.isPending}
              style={styles.buttonHalf}
            />
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <AppButton
              text="Edit"
              onPress={() => openEditStep(1)}
              secondary
              bgColor={colors.white}
              style={styles.buttonHalf}
            />
            <AppButton
              text="Find candidates"
              onPress={handlePostJob}
              bgColor={colors.primary}
              isLoading={createJob.isPending || updateDraft.isPending || publishJob.isPending}
              disabled={!canSave || createJob.isPending || updateDraft.isPending || publishJob.isPending}
              style={styles.buttonHalf}
            />
          </View>
        )}

      </ScrollView>
    </View>
  )
}

export default JobPreview

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(6),
    paddingBottom: hp(4),
  },
  detailRow: {
    marginBottom: hp(2),
  },
  detailLabel: {
    marginBottom: hp(0.5),
  },
  detailValue: {
    fontWeight: 'bold'
  },
  jobTitle: {
    fontSize: getFontSize(16),
    fontWeight: 'bold'
  },
  salaryValue: {
    fontWeight: 'bold'
  },
  yesValue: {
    color: '#4ADE80',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2.5),
    marginBottom: hp(1.2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  stepHeaderTitle: {
    fontWeight: '800',
  },
  stepHeaderEdit: {
    padding: wp(1),
  },
  sectionTitle: {
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  availabilityContainer: {
    marginBottom: hp(2),
  },
  availabilityRow: {
    flexDirection: 'row',
    marginBottom: hp(1),
  },
  dayLabel: {
    width: wp(25),
  },
  hoursText: {
    fontWeight: 'bold',
    flex: 1,
  },
  requirementSection: {
    marginBottom: hp(2.5),
  },
  requirementLabel: {
    marginBottom: hp(0.5),
  },
  requirementValue: {
    fontWeight: 'bold',
  },
  descriptionSection: {
    marginTop: hp(1),
  },
  descriptionText: {
    lineHeight: hp(2.5),
    marginTop: hp(0.5),
  },
  buttonContainer: {
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  buttonRow: {
    marginTop: hp(3),
    marginBottom: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonHalf: {
    width: '48%',
  },
  buttonFull: {
    width: '100%',
    marginBottom: hp(2),
  },
})