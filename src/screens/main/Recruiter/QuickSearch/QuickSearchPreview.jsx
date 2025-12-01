// QuickSearchPreview.js - Display all collected data
import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  Alert
} from 'react-native'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import AppButton from '@/core/AppButton'
import { addJob } from '@/store/jobsSlice'
import { createQuickJob, autoMatchCandidates, sendQuickOffer } from '@/store/quickSearchSlice'
import { autoSendOffers } from '@/services/autoOfferService'
import { selectRecruiterQuickSettings } from '@/store/settingsSlice'
import { screenNames } from '@/navigation/screenNames'
import { formatTime } from '@/utilities/helperFunctions'

const QuickSearchPreview = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const store = useStore()
  
  // Get all data from all 4 steps
  const { 
    quickSearchStep1Data, 
    quickSearchStep2Data, 
    quickSearchStep3Data,
    quickSearchStep4Data 
  } = route.params || {}

  const formatDate = (value) => {
    if (!value) return 'Not specified'
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return 'Not specified'
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const DetailRow = ({ label, value, valueStyle }) => (
    <View style={styles.detailRow}>
      <AppText variant={Variant.body} style={styles.detailLabel}>
        {label}
      </AppText>
      <AppText variant={Variant.bodyMedium} style={[styles.detailValue, valueStyle]}>
        {value || 'Not specified'}
      </AppText>
    </View>
  )

  const SectionTitle = ({ title }) => (
    <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
      {title}
    </AppText>
  )

  const AvailabilityRow = ({ day, timeData }) => {
    if (!timeData?.enabled) return null
    
    return (
      <View style={styles.availabilityRow}>
        <AppText variant={Variant.body} style={styles.dayLabel}>
          {day}:
        </AppText>
        <AppText variant={Variant.bodyMedium} style={styles.hoursText}>
          {formatTime(timeData.from)} - {formatTime(timeData.to)}
        </AppText>
      </View>
    )
  }

  const handleSubmit = () => {
    const allData = {
      step1: quickSearchStep1Data,
      step2: quickSearchStep2Data,
      step3: quickSearchStep3Data,
      step4: quickSearchStep4Data
    }
    
    // Generate jobId before creating job
    const jobId = `quick-job-${Date.now()}`
    
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    
    // Format job data for both old jobsSlice (backward compatibility) and new quickSearchSlice
    const jobData = {
      id: jobId,
      title: quickSearchStep1Data?.jobTitle || 'Untitled Job',
      type: 'Full-time', // Default, you can extract from data if available
      industry: quickSearchStep1Data?.industry || '',
      experience: `${quickSearchStep1Data?.experienceYear || '0 y'} ${quickSearchStep1Data?.experienceMonth || ''}`,
      staffNumber: quickSearchStep1Data?.staffCount || '1',
      location: quickSearchStep2Data?.workLocation || 'Location not specified',
      rangeKm: quickSearchStep2Data?.rangeKm || 0,
      salaryRange: quickSearchStep3Data 
        ? `$${quickSearchStep3Data.salaryMin || '0'}/hr to $${quickSearchStep3Data.salaryMax || '0'}/hr`
        : 'Not specified',
      salaryMin: quickSearchStep3Data?.salaryMin || 0,
      salaryMax: quickSearchStep3Data?.salaryMax || 0,
      salaryType: 'Hourly',
      jobStartDate: formatDate(quickSearchStep2Data?.jobStartDate),
      jobEndDate: formatDate(quickSearchStep2Data?.jobEndDate),
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: quickSearchStep3Data?.extraPay || {},
      availability: quickSearchStep4Data?.availability || {},
      taxType: quickSearchStep4Data?.taxType || 'ABN',
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
      paymentMethod: quickSearchStep3Data?.paymentMethod || 'platform', // Store payment method preference
    }
    
    console.log('Posting Quick Search Job:', jobData)
    
    // Dispatch to both slices for backward compatibility
    dispatch(addJob(jobData))
    
    // Create quick search job
    dispatch(createQuickJob(quickJobData))
    
    // Get recruiter settings for auto-matching
    const state = store.getState();
    const recruiterSettings = state.settings?.recruiter?.quickOffers || {};
    const recruiterBalance = state.wallet?.coins || 0;
    
    // Auto-match candidates and send offers
    setTimeout(() => {
      dispatch(autoMatchCandidates({ jobId, settings: recruiterSettings }))
      
      // Auto-send offers to matched candidates after a short delay to ensure matches are stored
      setTimeout(() => {
        const updatedState = store.getState();
        const job = updatedState.quickSearch?.quickJobs?.find(j => j.id === jobId);
        const matches = updatedState.quickSearch?.matchesByJobId?.[jobId] || [];
        
        if (job && matches.length > 0 && recruiterSettings.autoMatchingEnabled !== false) {
          // Get job seeker settings map (in real app, this would come from backend)
          const jobSeekerSettingsMap = {};
          
          // Auto-send offers
          autoSendOffers(
            job,
            recruiterSettings,
            updatedState.quickSearch?.acceptanceRatings || {},
            jobSeekerSettingsMap,
            recruiterBalance,
            dispatch,
            sendQuickOffer
          );
        }
      }, 200);
    }, 100)
    
    // Show success alert and navigate to home
    Alert.alert(
      'Job Posted Successfully!',
      'Your job offer has been posted and is now active. Offers have been automatically sent to matched candidates.',
      [
        {
          text: 'View Matches',
          onPress: () => {
            navigation.navigate(screenNames.QUICK_SEARCH_MATCH_LIST, { 
              jobId, 
              fromJobPost: true 
            })
          },
        },
        {
          text: 'View Job Offers',
          onPress: () => {
            // Navigate to the main tab navigation (recruiter home)
            navigation.reset({
              index: 0,
              routes: [{ name: screenNames.Tab_NAVIGATION }],
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
          value={`${quickSearchStep1Data?.experienceYear} ${quickSearchStep1Data?.experienceMonth}`}
        />
        <DetailRow 
          label="Staff needed:" 
          value={quickSearchStep1Data?.staffCount}
        />

        {/* Step 2 Data - Work Location */}
        <SectionTitle title="Work Location & Dates" />
        <DetailRow 
          label="Work location:" 
          value={quickSearchStep2Data?.workLocation}
        />
        <DetailRow 
          label="Range from location:" 
          value={quickSearchStep2Data?.rangeKm ? `${quickSearchStep2Data.rangeKm} km` : 'Not specified'}
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
          label="Salary range:" 
          value={quickSearchStep3Data ? 
            `$${quickSearchStep3Data.salaryMin || '0'} - $${quickSearchStep3Data.salaryMax || '0'}` : 
            'Not specified'}
          valueStyle={styles.salaryValue}
        />
        <DetailRow 
          label="Payment method:" 
          value={quickSearchStep3Data?.paymentMethod === 'platform' ? 'Platform Payment (SquadGoo handles)' : quickSearchStep3Data?.paymentMethod === 'direct' ? 'Direct Payment (Between parties)' : 'Not specified'}
          valueStyle={styles.highlightValue}
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

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Post Job"
            onPress={handleSubmit}
            bgColor={colors.primary}
            textColor="#FFFFFF"
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
})