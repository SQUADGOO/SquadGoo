// QuickSearchPreview.js - Display all collected data
import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  Alert
} from 'react-native'
import { useDispatch } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import AppButton from '@/core/AppButton'
import { addJob } from '@/store/jobsSlice'
import { screenNames } from '@/navigation/screenNames'

const QuickSearchPreview = ({ navigation, route }) => {
  const dispatch = useDispatch()
  
  // Get all data from all 4 steps
  const { 
    quickSearchStep1Data, 
    quickSearchStep2Data, 
    quickSearchStep3Data,
    quickSearchStep4Data 
  } = route.params || {}

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
          {timeData.from || '00:00'} - {timeData.to || '00:00'}
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
    
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    
    // Format job data
    const jobData = {
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
      jobStartDate: quickSearchStep2Data?.jobStartDate || 'TBD',
      jobEndDate: quickSearchStep2Data?.jobEndDate || 'TBD',
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
    
    console.log('Posting Quick Search Job:', jobData)
    
    // Dispatch to Redux
    dispatch(addJob(jobData))
    
    // Show success alert and navigate to home
    Alert.alert(
      'Job Posted Successfully!',
      'Your job offer has been posted and is now active.',
      [
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
          value={quickSearchStep2Data?.jobStartDate}
        />
        <DetailRow 
          label="Job end date:" 
          value={quickSearchStep2Data?.jobEndDate}
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