import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native'
import { useDispatch } from 'react-redux'
import { CommonActions } from '@react-navigation/native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AppHeader from '@/core/AppHeader'
import AppButton from '@/core/AppButton'
import { addJob, updateJob } from '@/store/jobsSlice'
import { createManualJob, updateManualJob, generateManualMatches } from '@/store/manualOffersSlice'
import { screenNames } from '@/navigation/screenNames'
import moment from 'moment'

const JobPreview = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  const dispatch = useDispatch()
  
  // Get data from all three steps
  const { step1Data, step2Data, step3Data, step4Data, editMode, draftJob, jobId: existingJobId } = route.params || {}
  console.log('step3Data', step3Data)

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
    if (t === 'hourly') return '/hr'
    if (t === 'daily') return '/day'
    if (t === 'weekly') return '/week'
    if (t === 'annually' || t === 'annual' || t === 'yearly') return '/year'
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
    const industry = step1Data?.industry
    const workLocation = step4Data?.workLocation || step1Data?.workLocation
    const rangeKm = step4Data?.rangeKm ?? step1Data?.rangeKm
    const staffNumber = step1Data?.staffNumber

    if (isEmptyValue(jobTitle)) missing.push('Job title')
    if (isEmptyValue(jobType)) missing.push('Job type')
    if (isEmptyValue(industry)) missing.push('Industry')
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

    const educational = step3Data?.educationalQualification || (Array.isArray(step3Data?.educationalQualifications) ? step3Data.educationalQualifications.join(', ') : '')
    if (isEmptyValue(educational)) missing.push('Required education')

    const taxType = step3Data?.taxType
    if (isEmptyValue(taxType)) missing.push('Required tax type')

    const jobDescription = step3Data?.jobDescription
    if (isEmptyValue(jobDescription)) missing.push('Job description')

    return missing
  }

  const missingRequiredFields = getMissingRequiredFields()
  const canSave = missingRequiredFields.length === 0

  const handlePostJob = () => {
    if (!canSave) {
      Alert.alert(
        'Missing required fields',
        `Please complete: ${missingRequiredFields.join(', ')}`
      )
      return
    }

    const isEdit = !!editMode && !!existingJobId
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    
    // Format job data
    const jobId = isEdit ? existingJobId : `manual-job-${Date.now()}`
    const salarySuffix = getSalarySuffix(step2Data?.salaryType)
    const jobData = {
      id: jobId,
      title: step1Data?.jobTitle,
      type: step1Data?.jobType,
      location: step4Data?.workLocation || step1Data?.workLocation,
      rangeKm: step4Data?.rangeKm ?? (step1Data?.rangeKm || 0),
      staffNumber: step1Data?.staffNumber,
      industry: step1Data?.industry,
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
      expireDate: (isEdit && draftJob?.expireDate) ? draftJob.expireDate : expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: step2Data?.extraPay || {},
      availability: step2Data?.availability,
      freshersCanApply: step2Data?.freshersCanApply || false,
      educationalQualification: step3Data?.educationalQualification,
      educationalQualifications: step3Data?.educationalQualifications || [],
      extraQualification: step3Data?.extraQualification,
      preferredLanguages: step3Data?.preferredLanguages || [],
      jobEndDate: step3Data?.jobEndDate,
      jobStartDate: step3Data?.jobStartDate,
      jobStartTime: step3Data?.jobStartTime || null,
      jobEndTime: step3Data?.jobEndTime || null,
      jobDescription: step3Data?.jobDescription,
      description: step3Data?.jobDescription,
      taxType: step3Data?.taxType,
      searchType: 'manual',
      rawData: { step1Data, step2Data, step3Data }, // Store complete data for future reference
    }
    
   
    console.log('Posting Manual Search Job:', jobData)
    
    if (isEdit) {
      const jobUpdates = { ...jobData }
      delete jobUpdates.id

      dispatch(updateJob({ jobId, updates: jobUpdates }))
      dispatch(updateManualJob({ jobId, updates: jobUpdates }))
      dispatch(generateManualMatches({ jobId }))

      Alert.alert(
        'Job Updated Successfully!',
        'Your job offer has been updated.',
        [
          {
            text: 'View Matches',
            onPress: () => {
              navigation.navigate(screenNames.MANUAL_MATCH_LIST, {
                jobId,
                fromJobPost: true,
              })
            },
          },
        ]
      )
      return
    }

    // Dispatch to Redux
    dispatch(addJob(jobData))
    dispatch(createManualJob(jobData))
    dispatch(generateManualMatches({ jobId }))
    
    // Show success alert and navigate to match list
    // Reset navigation stack to prevent going back to posting steps
    Alert.alert(
      'Job Posted Successfully!',
      'Candidates have been matched based on your criteria.',
      [
        {
          text: 'View Matches',
          onPress: () => {
            // Navigate directly to MANUAL_MATCH_LIST
            navigation.navigate(screenNames.MANUAL_MATCH_LIST, { 
              jobId, 
              fromJobPost: true 
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

  const AvailabilityRow = ({ day, hours }) => (
    !hours ? null :
    <View style={styles.availabilityRow}>
      <AppText variant={Variant.body} style={styles.dayLabel}>
        {day}:
      </AppText>
      <AppText variant={Variant.bodyMedium} style={styles.hoursText}>
        {hours}
      </AppText>
    </View>
  )

  const SectionTitle = ({ title }) => (
    <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
      {title}
    </AppText>
  )

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
        
        {/* Basic Job Info - Step 1 Data */}
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
          label="Industry:" 
          value={step1Data?.industry}
          hideIfEmpty={false}
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
        
        <DetailRow 
          label="Positions:" 
          value={step1Data?.staffNumber}
          hideIfEmpty={false}
        />
        
        {/* Experience - Step 2 Data */}
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
          value={step2Data ? `$${step2Data.salaryMin}–$${step2Data.salaryMax}${getSalarySuffix(step2Data?.salaryType)}` : ''}
          valueStyle={styles.salaryValue}
          hideIfEmpty={false}
        />
            </>
          )
        })()}
        
        {/* Leave Section - Step 2 Data */}
        <SectionTitle title="Extra pay you are offering:" />
        
        <DetailRow 
          label="Public holidays:" 
          value={step2Data?.extraPay?.publicHolidays ? 'Yes' : 'No'}
          valueStyle={step2Data?.extraPay?.publicHolidays && styles.yesValue}
        />
        
        <DetailRow 
          label="Weekend:" 
          value={step2Data?.extraPay?.weekend ? 'Yes' : 'No'}
          valueStyle={step2Data?.extraPay?.weekend && styles.yesValue}
        />
        
        <DetailRow 
          label="Shift loading:" 
          value={step2Data?.extraPay?.shiftLoading ? 'Yes' : 'No'}
          valueStyle={step2Data?.extraPay?.shiftLoading && styles.yesValue}
        />

        <DetailRow 
          label="Bonuses:" 
          value={step2Data?.extraPay?.bonuses ? 'Yes' : 'No'}
          valueStyle={step2Data?.extraPay?.bonuses && styles.yesValue}
        />
        
        <DetailRow 
          label="Overtime:" 
          value={step2Data?.extraPay?.overtime ? 'Yes' : 'No'}
          valueStyle={step2Data?.extraPay?.overtime && styles.yesValue}
        />

        {/* Availability Section - Step 2 Data */}
        <SectionTitle title="Availability to work:" />
        
        {formatAvailability(step2Data?.availability) ? (
          <View style={styles.availabilityContainer}>
            <AppText variant={Variant.body} style={styles.detailValue}>
              {formatAvailability(step2Data?.availability)}
            </AppText>
          </View>
        ) : null}

        {/* Requirements Section - Step 3 Data */}
        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required education:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.educationalQualification || (Array.isArray(step3Data?.educationalQualifications) ? step3Data.educationalQualifications.join(', ') : '')}
          </AppText>
        </View>

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

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required Tax type:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.taxType}
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

        {/* Save / Cancel */}
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
            disabled={!canSave}
            style={styles.buttonHalf}
          />
        </View>

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
})