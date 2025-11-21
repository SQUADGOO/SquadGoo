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
import { addJob } from '@/store/jobsSlice'
import { createManualJob, generateManualMatches } from '@/store/manualOffersSlice'
import { screenNames } from '@/navigation/screenNames'
import moment from 'moment'

const JobPreview = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  const dispatch = useDispatch()
  
  // Get data from all three steps
  const { step1Data, step2Data, step3Data } = route.params || {}
  console.log('step3Data', step3Data)
  const handlePostJob = () => {
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    
    // Format job data
    const jobId = `manual-job-${Date.now()}`
    const jobData = {
      id: jobId,
      title: step1Data?.jobTitle || 'Untitled Job',
      type: step1Data?.jobType || 'Full-time',
      location: step1Data?.workLocation || 'Location not specified',
      rangeKm: step1Data?.rangeKm || 0,
      staffNumber: step1Data?.staffNumber || '1',
      industry: step1Data?.industry || 'General Services',
      experience: step2Data ? `${step2Data.experienceYears} ${step2Data.experienceMonths}` : 'Not specified',
      salaryRange: step2Data 
        ? `$${step2Data.salaryMin || '0'}/hr to $${step2Data.salaryMax || '0'}/hr`
        : 'Not specified',
      salaryMin: step2Data?.salaryMin || 0,
      salaryMax: step2Data?.salaryMax || 0,
      salaryType: 'Hourly',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: step2Data?.extraPay || {},
      availability: step2Data?.availability || 'Not specified',
      freshersCanApply: step2Data?.freshersCanApply || false,
      educationalQualification: step3Data?.educationalQualification || 'Not specified',
      extraQualification: step3Data?.extraQualification || 'Not specified',
      preferredLanguages: step3Data?.preferredLanguages || [],
      jobEndDate: step3Data?.jobEndDate || 'Not specified',
      jobDescription: step3Data?.jobDescription || 'No description provided',
      taxType: step3Data?.taxType || 'ABN',
      searchType: 'manual',
      rawData: { step1Data, step2Data, step3Data }, // Store complete data for future reference
    }
    
   
    console.log('Posting Manual Search Job:', jobData)
    
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

  const DetailRow = ({ label, value, valueStyle }) => (
    <View style={styles.detailRow}>
      <AppText variant={Variant.body} style={styles.detailLabel}>
        {label}
      </AppText>
      <AppText variant={Variant.bodyMedium} style={[styles.detailValue, valueStyle]}>
        {value}
      </AppText>
    </View>
  )

  const AvailabilityRow = ({ day, hours }) => (
    <View style={styles.availabilityRow}>
      <AppText variant={Variant.body} style={styles.dayLabel}>
        {day}:
      </AppText>
      <AppText variant={Variant.bodyMedium} style={styles.hoursText}>
        {hours || 'Not specified'}
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
          value={step1Data?.jobTitle || 'N/A'}
          valueStyle={styles.jobTitle}
        />
        
        <DetailRow 
          label="Job type:" 
          value={step1Data?.jobType || 'N/A'}
        />
        
        <DetailRow 
          label="Work location:" 
          value={step1Data?.workLocation || 'N/A'}
        />
        
        <DetailRow 
          label="Range from location:" 
          value={step1Data?.rangeKm ? `${step1Data.rangeKm} km` : 'N/A'}
        />
        
        <DetailRow 
          label="How many staff looking for:" 
          value={step1Data?.staffNumber || 'N/A'}
        />
        
        {/* Experience - Step 2 Data */}
        <DetailRow 
          label="Experience:" 
          value={step2Data ? `${step2Data.experienceYears} ${step2Data.experienceMonths}${step2Data.freshersCanApply ? ' (Fresher can also apply)' : ''}` : 'N/A'}
        />
        
        <DetailRow 
          label="Salary you are offering:" 
          value={step2Data ? `Min $${step2Data.salaryMin || '0'} - Max $${step2Data.salaryMax || '0'}` : 'N/A'}
          valueStyle={styles.salaryValue}
        />

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
        
        <View style={styles.availabilityContainer}>
          <AppText variant={Variant.body} style={styles.detailValue}>
            {step2Data?.availability || 'Not specified'}
          </AppText>
        </View>

        {/* Requirements Section - Step 3 Data */}
        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required education:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.educationalQualification || 'Not specified'}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required qualification:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.extraQualification || 'Not specified'}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Preferred languages:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.preferredLanguages?.join(', ') || 'Not specified'}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Job end date:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.jobEndDate ? moment(step3Data?.jobEndDate).format('DD/MM/YYYY') : 'Not specified'}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required Tax type:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {step3Data?.taxType || 'Not specified'}
          </AppText>
        </View>

        {/* Description - Step 3 Data */}
        <View style={styles.descriptionSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Description:
          </AppText>
          <AppText variant={Variant.body} style={styles.descriptionText}>
            {step3Data?.jobDescription || 'No description provided'}
          </AppText>
        </View>

        {/* Post Job Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Post Job"
            onPress={handlePostJob}
            bgColor={colors.primary}
            textColor="#FFFFFF"
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
})