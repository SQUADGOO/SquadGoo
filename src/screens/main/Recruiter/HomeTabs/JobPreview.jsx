import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AppHeader from '@/core/AppHeader'

const JobPreview = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  
  // Get data from all three steps
  const { step1Data, step2Data, step3Data } = route.params || {}

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
            {step3Data?.jobEndDate || 'Not specified'}
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
})