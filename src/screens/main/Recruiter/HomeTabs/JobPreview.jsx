import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { LinearGradient } from 'react-native-linear-gradient'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AppHeader from '@/core/AppHeader'

const JobPreview = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  const { jobId } = route.params || {}

  // Sample job data - replace with API call based on jobId
  const jobData = {
    title: 'Full house painting',
    type: 'Full time',
    location: 'Gladstone Central',
    rangeFromLocation: '5km',
    staffLooking: '40',
    experience: '1.0 y (Fresher can also apply)',
    salaryRange: 'Min $5.00 - Max $15.00',
    leaves: {
      publicHolidays: 'Yes',
      weekend: 'Yes',
      overtime: 'Yes'
    },
    availability: {
      monday: '00:00 AM To 23:59 PM',
      tuesday: '00:00 AM To 23:59 PM',
      wednesday: 'Nill To Nill',
      thursday: '00:00 AM To 23:59 PM',
      friday: 'Nill To Nill',
      saturday: 'Nill To Nill',
      sunday: 'Nill To Nill'
    },
    requiredEducation: 'Advanced Diploma in Graphic Design',
    requiredQualification: 'Basic rigging license',
    preferredLanguage: 'English',
    jobEndDate: '01 Jun 2024 12:55:00',
    requiredTaxType: 'ABN',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
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
        
        {/* Basic Job Info */}
        <DetailRow 
          label="Job title:" 
          value={jobData.title}
          valueStyle={styles.jobTitle}
        />
        
        <DetailRow 
          label="Job type:" 
          value={jobData.type}
        />
        
        <DetailRow 
          label="Work location:" 
          value={jobData.location}
        />
        
        <DetailRow 
          label="Range from location:" 
          value={jobData.rangeFromLocation}
        />
        
        <DetailRow 
          label="How many staff looking for:" 
          value={jobData.staffLooking}
        />
        
        <DetailRow 
          label="Experience:" 
          value={jobData.experience}
        />
        
        <DetailRow 
          label="Salary you are offering:" 
          value={jobData.salaryRange}
          valueStyle={styles.salaryValue}
        />

        {/* Leave Section */}
        <SectionTitle title="Leave you are offering:" />
        
        <DetailRow 
          label="Public holidays:" 
          value={jobData.leaves.publicHolidays}
          valueStyle={styles.yesValue}
        />
        
        <DetailRow 
          label="Weekend:" 
          value={jobData.leaves.weekend}
          valueStyle={styles.yesValue}
        />
        
        <DetailRow 
          label="Overtime:" 
          value={jobData.leaves.overtime}
          valueStyle={styles.yesValue}
        />

        {/* Availability Section */}
        <SectionTitle title="Availability to work:" />
        
        <View style={styles.availabilityContainer}>
          <AvailabilityRow day="Monday" hours={jobData.availability.monday} />
          <AvailabilityRow day="Tuesday" hours={jobData.availability.tuesday} />
          <AvailabilityRow day="Wednesday" hours={jobData.availability.wednesday} />
          <AvailabilityRow day="Thursday" hours={jobData.availability.thursday} />
          <AvailabilityRow day="Friday" hours={jobData.availability.friday} />
          <AvailabilityRow day="Saturday" hours={jobData.availability.saturday} />
          <AvailabilityRow day="Sunday" hours={jobData.availability.sunday} />
        </View>

        {/* Requirements Section */}
        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required education:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {jobData.requiredEducation}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required qualification:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {jobData.requiredQualification}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Preferred language:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {jobData.preferredLanguage}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Job end date:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {jobData.jobEndDate}
          </AppText>
        </View>

        <View style={styles.requirementSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Required Tax type ABN:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.requirementValue}>
            {jobData.requiredTaxType}
          </AppText>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <AppText variant={Variant.body} style={styles.requirementLabel}>
            Description:
          </AppText>
          <AppText variant={Variant.body} style={styles.descriptionText}>
            {jobData.description}
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
  header: {
    borderBottomLeftRadius: hp(4),
    borderBottomRightRadius: hp(4),
    paddingBottom: hp(2),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(6),
    paddingTop: hp(1),
  },
  backButton: {
    padding: wp(2),
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: getFontSize(20),
  },
  placeholder: {
    width: wp(10), // Same width as back button for centering
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
    // color: colors.gray || '#6B7280',
    marginBottom: hp(0.5),
  },
  detailValue: {
    fontWeight: 'bold'
    // color: colors.black,
  },
  jobTitle: {
    fontSize: getFontSize(16),
    fontWeight: 'bold'
    // color: colors.black,
  },
  salaryValue: {
    fontWeight: 'bold'
    // color: colors.primary || '#FF6B35',
  },
  yesValue: {
    // color: '#4ADE80', // Green color for "Yes"
  },
  sectionTitle: {
    
    // color: colors.gray || '#6B7280',
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
    // color: colors.gray || '#6B7280',
    width: wp(25),
  },
  hoursText: {
    fontWeight: 'bold',
    // color: colors.black,
    flex: 1,
  },
  requirementSection: {
    marginBottom: hp(2.5),
  },
  requirementLabel: {
    // color: colors.gray || '#6B7280',
    marginBottom: hp(0.5),
  },
  requirementValue: {
    fontWeight: 'bold',
    // color: colors.primary || '#FF6B35',
  },
  descriptionSection: {
    marginTop: hp(1),
  },
  descriptionText: {
    // color: colors.black,
    lineHeight: hp(2.5),
    marginTop: hp(0.5),
  },
})