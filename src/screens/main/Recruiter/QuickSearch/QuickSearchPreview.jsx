// QuickSearchPreview.js - Display all collected data
import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  Alert
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import AppButton from '@/core/AppButton'
import { addJob, updateJob } from '@/store/jobsSlice'
import { createQuickJob, updateQuickJob, autoMatchCandidates, sendQuickOffer } from '@/store/quickSearchSlice'
import { autoSendOffers } from '@/services/autoOfferService'
import { screenNames } from '@/navigation/screenNames'
import { formatTime } from '@/utilities/helperFunctions'

const QuickSearchPreview = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const acceptanceRatings = useSelector(
    state => state.quickSearch.acceptanceRatings || {}
  )
  
  // Get all data from all 4 steps
  const { 
    quickSearchStep1Data, 
    quickSearchStep2Data, 
    quickSearchStep3Data,
    quickSearchStep4Data,
    editMode,
    draftJob,
    jobId: existingJobId,
  } = route.params || {}

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

  const experienceYears = parseNumberFromText(quickSearchStep1Data?.experienceYear)
  const experienceMonths = parseNumberFromText(quickSearchStep1Data?.experienceMonth)

  const getMissingRequiredFields = () => {
    const missing = []
    if (isEmptyValue(quickSearchStep1Data?.jobTitle)) missing.push('Job title')
    if (isEmptyValue(quickSearchStep1Data?.industry)) missing.push('Industry')
    if (isEmptyValue(quickSearchStep1Data?.staffCount)) missing.push('Positions')
    if (isEmptyValue(quickSearchStep2Data?.workLocation)) missing.push('Work location')
    if (quickSearchStep2Data?.rangeKm === null || quickSearchStep2Data?.rangeKm === undefined) missing.push('Range from location')
    if (isEmptyValue(quickSearchStep2Data?.jobStartDate)) missing.push('Job start date')
    if (isEmptyValue(quickSearchStep2Data?.jobEndDate)) missing.push('Job end date')
    if (isEmptyValue(quickSearchStep3Data?.salaryMin)) missing.push('Salary min')
    if (isEmptyValue(quickSearchStep3Data?.salaryMax)) missing.push('Salary max')
    if (isEmptyValue(quickSearchStep4Data?.taxType)) missing.push('Required tax type')

    // Availability should have at least one enabled day with times
    const availabilityEntries = quickSearchStep4Data?.availability ? Object.entries(quickSearchStep4Data.availability) : []
    const hasAvailability =
      availabilityEntries.some(([, v]) => v?.enabled && v?.from && v?.to)
    if (!hasAvailability) missing.push('Availability')

    return missing
  }

  const missingRequiredFields = getMissingRequiredFields()
  const canSave = missingRequiredFields.length === 0

  const formatDate = (value) => {
    if (!value) return ''
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
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

  // Format time string (HH:MM) to readable format (e.g., "09:00" -> "9:00 AM")
  const formatTimeString = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return ''
    
    // Check if it's already in HH:MM format
    const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})$/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10)
      const minutes = timeMatch[2]
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
      return `${displayHours}:${minutes} ${period}`
    }
    
    // If it's not a simple time string, try formatTime (for Date objects)
    return formatTime(timeString) || ''
  }

  const AvailabilityRow = ({ day, timeData }) => {
    if (!timeData?.enabled) return null
    
    // Validate that times exist
    if (!timeData.from || !timeData.to) {
      return null
    }
    
    return (
      <View style={styles.availabilityRow}>
        <AppText variant={Variant.body} style={styles.dayLabel}>
          {day}:
        </AppText>
        <AppText variant={Variant.bodyMedium} style={styles.hoursText}>
          {formatTimeString(timeData.from)} - {formatTimeString(timeData.to)}
        </AppText>
      </View>
    )
  }

  const handleSubmit = () => {
    // Required-field check for Save
    const missing = getMissingRequiredFields()
    if (missing.length > 0) {
      Alert.alert('Missing required fields', `Please complete: ${missing.join(', ')}`)
      return
    }

    const isEdit = !!editMode && !!existingJobId
    // Build a stable job ID so quickSearch slice, matches and offers all align
    const jobId = isEdit ? existingJobId : `quick-job-${Date.now()}`

    const allData = {
      step1: quickSearchStep1Data,
      step2: quickSearchStep2Data,
      step3: quickSearchStep3Data,
      step4: quickSearchStep4Data
    }
    
    // Calculate expiry date (30 days from now) - preserve existing when editing if available
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    const existingExpireDate = draftJob?.expireDate
    
    // Format job data for both old jobsSlice (backward compatibility) and new quickSearchSlice
    const salarySuffix = getSalarySuffix(quickSearchStep3Data?.salaryType || 'Hourly')
    const jobData = {
      id: jobId, // keep same ID across slices for easier tracking
      title: quickSearchStep1Data?.jobTitle,
      type: 'Contract', // Default for quick search jobs
      industry: quickSearchStep1Data?.industry,
      experience: (() => {
        // Extract numbers from strings like "2 Years" or "2 Months"
        const extractNumber = (str) => {
          if (!str) return 0;
          if (typeof str === 'number') return str;
          const match = str.toString().match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        };
        const years = extractNumber(quickSearchStep1Data?.experienceYear);
        const months = extractNumber(quickSearchStep1Data?.experienceMonth);
        return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
      })(),
      staffNumber: quickSearchStep1Data?.staffCount,
      location: quickSearchStep2Data?.workLocation,
      rangeKm: quickSearchStep2Data?.rangeKm ?? 0,
      salaryRange: quickSearchStep3Data 
        ? `$${quickSearchStep3Data.salaryMin} to $${quickSearchStep3Data.salaryMax}${salarySuffix}`
        : '',
      salaryMin: quickSearchStep3Data?.salaryMin,
      salaryMax: quickSearchStep3Data?.salaryMax,
      salaryType: quickSearchStep3Data?.salaryType || 'Hourly',
      jobStartDate: formatDate(quickSearchStep2Data?.jobStartDate),
      jobEndDate: formatDate(quickSearchStep2Data?.jobEndDate),
      expireDate: existingExpireDate || expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: quickSearchStep3Data?.extraPay || {},
      availability: quickSearchStep4Data?.availability || {},
      jobDescription: quickSearchStep4Data?.jobDescription || '',
      description: quickSearchStep4Data?.jobDescription || '',
      taxType: quickSearchStep4Data?.taxType,
      searchType: 'quick',
      rawData: allData, // Store complete data for future reference
    }
    
    // Format for quick search slice
    const quickJobData = {
      id: jobId,
      jobTitle: quickSearchStep1Data?.jobTitle,
      industry: quickSearchStep1Data?.industry,
      experienceYear: quickSearchStep1Data?.experienceYear,
      experienceMonth: quickSearchStep1Data?.experienceMonth,
      staffCount: quickSearchStep1Data?.staffCount,
      workLocation: quickSearchStep2Data?.workLocation,
      rangeKm: quickSearchStep2Data?.rangeKm,
      salaryMin: quickSearchStep3Data?.salaryMin,
      salaryMax: quickSearchStep3Data?.salaryMax,
      jobStartDate: quickSearchStep2Data?.jobStartDate,
      jobEndDate: quickSearchStep2Data?.jobEndDate,
      offerExpiryTimer: quickSearchStep4Data?.offerExpiryTimer || 30, // days
      extraPay: quickSearchStep3Data?.extraPay || {},
      availability: quickSearchStep4Data?.availability || {},
      taxType: quickSearchStep4Data?.taxType || 'ABN',
      jobDescription: quickSearchStep4Data?.jobDescription || '',
      additionalRequirements: quickSearchStep4Data?.additionalRequirements || '',
    }
    
    console.log('Posting Quick Search Job:', jobData)
    
    if (isEdit) {
      // Update existing job(s)
      const jobUpdates = { ...jobData }
      delete jobUpdates.id
      const quickJobUpdates = { ...quickJobData }
      delete quickJobUpdates.id

      dispatch(updateJob({ jobId, updates: jobUpdates }))
      dispatch(updateQuickJob({ jobId, updates: quickJobUpdates }))

      Alert.alert(
        'Job Updated Successfully!',
        'Your job offer has been updated.',
        [
          {
            text: 'Back to Active Offers',
            onPress: () => {
              navigation.navigate(screenNames.Tab_NAVIGATION, {
                screen: screenNames.HOME,
              })
            },
          },
        ]
      )
      return
    }

    // 1) Dispatch to both slices for backward compatibility
    dispatch(addJob(jobData))
    dispatch(createQuickJob(quickJobData))
    
    // 2) Generate / cache matches for this quick job
    dispatch(autoMatchCandidates({ jobId, settings: {} }))
    
    // 3) Auto-send offers to top matches (like manual, but automatic)
    autoSendOffers(
      { ...quickJobData },                 // quick search job data
      { autoMatchingEnabled: true },       // settings: auto-matching ON
      acceptanceRatings,                   // from quickSearch state
      dispatch,
      sendQuickOffer                       // action creator
    )
    
    // 4) Show success & take recruiter directly to Quick Search offers
    Alert.alert(
      'Job Posted Successfully!',
      'Your job offer has been posted, matches found, and offers sent automatically.',
      [
        {
          text: 'View Quick Search Offers',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: screenNames.QUICK_SEARCH_ACTIVE_OFFERS_RECRUITER }],
            })
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <AppHeader title="Quick Search Preview" showTopIcons={false} height={hp(14)} />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Step 1 Data - Job Requirements */}
        <SectionTitle title="Job Requirements" />
        <DetailRow 
          label="Job title:" 
          value={quickSearchStep1Data?.jobTitle}
          valueStyle={styles.highlightValue}
        />
        <DetailRow 
          label="Industry:" 
          value={quickSearchStep1Data?.industry}
        />
        <DetailRow 
          label="Experience:" 
          value={`${experienceYears} Years ${experienceMonths} Months`}
          hideIfEmpty={false}
        />
        <DetailRow 
          label="Positions:" 
          value={quickSearchStep1Data?.staffCount}
          hideIfEmpty={false}
        />

        {/* Step 2 Data - Work Location */}
        <SectionTitle title="Work Location & Dates" />
        <DetailRow 
          label="Work location:" 
          value={quickSearchStep2Data?.workLocation}
        />
        <DetailRow 
          label="Range from location:" 
          value={typeof quickSearchStep2Data?.rangeKm === 'number' ? `${quickSearchStep2Data.rangeKm} km` : ''}
          hideIfEmpty={false}
        />
        <DetailRow 
          label="Job start date:" 
          value={formatDate(quickSearchStep2Data?.jobStartDate)}
        />
        <DetailRow 
          label="Job end date:" 
          value={formatDate(quickSearchStep2Data?.jobEndDate)}
        />

        {/* Step 3 Data - Salary & Benefits */}
        <SectionTitle title="Salary & Benefits" />
        <DetailRow 
          label="Salary range ($/hr or $/day):" 
          value={quickSearchStep3Data ? 
            `$${quickSearchStep3Data.salaryMin}–$${quickSearchStep3Data.salaryMax}${getSalarySuffix(quickSearchStep3Data?.salaryType)}` : 
            ''}
          valueStyle={styles.salaryValue}
          hideIfEmpty={false}
        />

        <SectionTitle title="Extra Pay Offered:" />
        <DetailRow 
          label="Public holidays:" 
          value={quickSearchStep3Data?.extraPay?.publicHolidays ? 'Yes' : 'No'}
          valueStyle={quickSearchStep3Data?.extraPay?.publicHolidays && styles.yesValue}
        />
        <DetailRow 
          label="Weekend:" 
          value={quickSearchStep3Data?.extraPay?.weekend ? 'Yes' : 'No'}
          valueStyle={quickSearchStep3Data?.extraPay?.weekend && styles.yesValue}
        />
        <DetailRow 
          label="Shift loading:" 
          value={quickSearchStep3Data?.extraPay?.shiftLoading ? 'Yes' : 'No'}
          valueStyle={quickSearchStep3Data?.extraPay?.shiftLoading && styles.yesValue}
        />
        <DetailRow 
          label="Bonuses:" 
          value={quickSearchStep3Data?.extraPay?.bonuses ? 'Yes' : 'No'}
          valueStyle={quickSearchStep3Data?.extraPay?.bonuses && styles.yesValue}
        />
        <DetailRow 
          label="Overtime:" 
          value={quickSearchStep3Data?.extraPay?.overtime ? 'Yes' : 'No'}
          valueStyle={quickSearchStep3Data?.extraPay?.overtime && styles.yesValue}
        />

        {/* Step 4 Data - Availability */}
        <SectionTitle title="Availability to Work:" />
        <View style={styles.availabilityContainer}>
          {quickSearchStep4Data?.availability && 
            Object.entries(quickSearchStep4Data.availability).map(([day, timeData]) => (
              <AvailabilityRow key={day} day={day} timeData={timeData} />
            ))
          }
        </View>

        <DetailRow 
          label="Required Tax type:" 
          value={quickSearchStep4Data?.taxType}
          valueStyle={styles.highlightValue}
        />

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
            onPress={handleSubmit}
            bgColor={colors.primary}
            disabled={!canSave}
            style={styles.buttonHalf}
          />
        </View>

      </ScrollView>
    </View>
  )
}

export default QuickSearchPreview

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
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    marginTop: hp(3),
    marginBottom: hp(1.5),
  },
  detailRow: {
    marginBottom: hp(1.5),
  },
  detailLabel: {
    color: colors.gray,
    marginBottom: hp(0.5),
  },
  detailValue: {
    fontWeight: 'bold',
    color: colors.black,
  },
  highlightValue: {
    fontSize: getFontSize(16),
    color: colors.primary,
  },
  salaryValue: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  yesValue: {
    color: '#4ADE80',
  },
  availabilityContainer: {
    marginBottom: hp(2),
  },
  availabilityRow: {
    flexDirection: 'row',
    marginBottom: hp(1),
  },
  dayLabel: {
    color: colors.gray,
    width: wp(25),
  },
  hoursText: {
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
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