import React from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native'
import { useSelector } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import moment from 'moment'

const ViewJobDetails = ({ navigation, route }) => {
  const { jobId, isCompleted, isExpired } = route.params || {}
  
  // Get job details from Redux (check all job lists)
  const job = useSelector((state) => {
    if (isCompleted) {
      return state.jobs?.completedJobs?.find(j => j.id === jobId)
    } else if (isExpired) {
      return state.jobs?.expiredJobs?.find(j => j.id === jobId)
    }
    return state.jobs?.activeJobs?.find(j => j.id === jobId)
  })
  
  const completedByCandidates = useSelector((state) => 
    state.jobs?.completedByCandidates?.[jobId] || []
  )
  
  const allCandidates = useSelector((state) => 
    state.jobs?.jobCandidates?.[jobId] || []
  )

  console.log('job', job)
  if (!job) {
    return (
      <View style={styles.container}>
        <AppHeader title="Job Details" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.h3} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    )
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
          {timeData.from || '00:00'} - {timeData.to || '00:00'}
        </AppText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <AppHeader title="Job Details" showTopIcons={false} height={hp(14)} />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Status and Search Type Badges */}
        <View style={styles.badgesContainer}>
          {/* Status Badge */}
          {isCompleted && (
            <View style={styles.completedStatusBadge}>
              <AppText variant={Variant.bodyMedium} style={styles.statusBadgeText}>
                ✓ Job Completed
              </AppText>
            </View>
          )}
          {isExpired && (
            <View style={styles.expiredStatusBadge}>
              <AppText variant={Variant.bodyMedium} style={styles.statusBadgeText}>
                ⏱ Job Expired
              </AppText>
            </View>
          )}
          
          {/* Search Type Badge */}
          {job.searchType && (
            <View style={[
              styles.searchTypeBadge,
              job.searchType === 'quick' ? styles.quickSearchBadge : styles.manualSearchBadge
            ]}>
              <AppText variant={Variant.bodySmall} style={styles.searchTypeBadgeText}>
                {job.searchType === 'quick' ? '⚡ Quick Search' : '📝 Manual Search'}
              </AppText>
            </View>
          )}
        </View>

        {/* Basic Job Info */}
        <SectionTitle title="Job Information" />
        <DetailRow 
          label="Job title:" 
          value={job.title}
          valueStyle={styles.jobTitle}
        />
        
        <DetailRow 
          label="Job type:" 
          value={job.type}
        />
        
        <DetailRow 
          label="Industry:" 
          value={job.industry}
        />
        
        <DetailRow 
          label="Work location:" 
          value={job.location}
        />
        
        <DetailRow 
          label="Range from location:" 
          value={job.rangeKm ? `${job.rangeKm} km` : 'Not specified'}
        />
        
        <DetailRow 
          label="Staff needed:" 
          value={job.staffNumber}
        />

        {/* Experience & Salary */}
        <SectionTitle title="Experience & Compensation" />
        <DetailRow 
          label="Experience required:" 
          value={job.experience}
        />
        
        <DetailRow 
          label="Salary range:" 
          value={job.salaryRange}
          valueStyle={styles.salaryValue}
        />

        <DetailRow 
          label="Salary type:" 
          value={job.salaryType}
        />

        {/* Dates */}
        <SectionTitle title="Job Timeline" />
        <DetailRow 
          label="Posted date:" 
          value={job.offerDate}
        />

        <DetailRow 
          label="Start date:" 
          value={job.jobStartDate}
        />
        
        <DetailRow 
          label="End date:" 
          value={moment(job.jobEndDate).format('DD/MM/YYYY')}
        />
        
        <DetailRow 
          label="Offer expires:" 
          value={job.expireDate}
        />

        {/* Extra Pay Section */}
        {job.extraPay && Object.keys(job.extraPay).length > 0 && (
          <>
            <SectionTitle title="Extra Pay Offered:" />
            
            <DetailRow 
              label="Public holidays:" 
              value={job.extraPay.publicHolidays ? 'Yes' : 'No'}
              valueStyle={job.extraPay.publicHolidays && styles.yesValue}
            />
            
            <DetailRow 
              label="Weekend:" 
              value={job.extraPay.weekend ? 'Yes' : 'No'}
              valueStyle={job.extraPay.weekend && styles.yesValue}
            />
            
            <DetailRow 
              label="Shift loading:" 
              value={job.extraPay.shiftLoading ? 'Yes' : 'No'}
              valueStyle={job.extraPay.shiftLoading && styles.yesValue}
            />

            <DetailRow 
              label="Bonuses:" 
              value={job.extraPay.bonuses ? 'Yes' : 'No'}
              valueStyle={job.extraPay.bonuses && styles.yesValue}
            />
            
            <DetailRow 
              label="Overtime:" 
              value={job.extraPay.overtime ? 'Yes' : 'No'}
              valueStyle={job.extraPay.overtime && styles.yesValue}
            />
          </>
        )}

        {/* Availability Section (for Quick Search jobs) */}
        {job.availability && typeof job.availability === 'object' && Object.keys(job.availability).length > 0 && (
          <>
            <SectionTitle title="Availability to Work:" />
            <View style={styles.availabilityContainer}>
              {Object.entries(job.availability).map(([day, timeData]) => (
                <AvailabilityRow key={day} day={day} timeData={timeData} />
              ))}
            </View>
          </>
        )}

        {/* Requirements Section */}
        {(job.educationalQualification || job.extraQualification || job.preferredLanguages) && (
          <>
            <SectionTitle title="Job Requirements" />
            
            {job.educationalQualification && (
              <DetailRow 
                label="Education required:" 
                value={job.educationalQualification}
              />
            )}

            {job.extraQualification && (
              <DetailRow 
                label="Extra qualification:" 
                value={job.extraQualification}
              />
            )}

            {job.preferredLanguages && job.preferredLanguages.length > 0 && (
              <DetailRow 
                label="Preferred languages:" 
                value={job.preferredLanguages.join(', ')}
              />
            )}

            {job.taxType && (
              <DetailRow 
                label="Required Tax type:" 
                value={job.taxType}
                valueStyle={styles.highlightValue}
              />
            )}

            {job.freshersCanApply && (
              <DetailRow 
                label="Freshers can apply:" 
                value="Yes"
                valueStyle={styles.yesValue}
              />
            )}
          </>
        )}

        {/* Description */}
        {job.jobDescription && (
          <View style={styles.descriptionSection}>
            <SectionTitle title="Job Description" />
            <AppText variant={Variant.body} style={styles.descriptionText}>
              {job.jobDescription}
            </AppText>
          </View>
        )}

        {/* Completed By Section (only for completed jobs) */}
        {isCompleted && allCandidates.length > 0 && (
          <>
            <SectionTitle title="Completed By:" />
            <View style={styles.completedByContainer}>
              {allCandidates
                .filter(candidate => 
                  completedByCandidates.length > 0 
                    ? completedByCandidates.includes(candidate.id)
                    : candidate.status === 'accepted'
                )
                .map((candidate, index) => (
                  <View key={candidate.id} style={styles.candidateCard}>
                    <View style={styles.candidateAvatar}>
                      <AppText variant={Variant.bodyMedium} style={styles.candidateAvatarText}>
                        {candidate.name?.charAt(0) || '?'}
                      </AppText>
                    </View>
                    <View style={styles.candidateInfo}>
                      <AppText variant={Variant.bodyMedium} style={styles.candidateName}>
                        {candidate.name || 'Unknown'}
                      </AppText>
                      <AppText variant={Variant.bodySmall} style={styles.candidateDetail}>
                        📍 {candidate.location || 'N/A'}
                      </AppText>
                      {candidate.phone && (
                        <AppText variant={Variant.bodySmall} style={styles.candidateDetail}>
                          📞 {candidate.phone}
                        </AppText>
                      )}
                    </View>
                    <View style={styles.completedBadge}>
                      <AppText variant={Variant.caption} style={styles.completedBadgeText}>
                        ✓ Completed
                      </AppText>
                    </View>
                  </View>
                ))}
            </View>
          </>
        )}

      </ScrollView>
    </View>
  )
}

export default ViewJobDetails

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
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: wp(2),
    marginBottom: hp(2),
  },
  completedStatusBadge: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: hp(3),
  },
  expiredStatusBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: hp(3),
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: getFontSize(14),
    fontWeight: 'bold',
  },
  searchTypeBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(2.5),
  },
  quickSearchBadge: {
    backgroundColor: '#10B981',
  },
  manualSearchBadge: {
    backgroundColor: '#3B82F6',
  },
  searchTypeBadgeText: {
    color: colors.white,
    fontSize: getFontSize(12),
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    marginTop: hp(3),
    marginBottom: hp(1.5),
  },
  detailRow: {
    marginBottom: hp(2),
  },
  detailLabel: {
    color: colors.gray,
    marginBottom: hp(0.5),
  },
  detailValue: {
    fontWeight: 'bold',
    color: colors.black,
  },
  jobTitle: {
    fontSize: getFontSize(16),
    color: colors.primary,
  },
  salaryValue: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  highlightValue: {
    fontSize: getFontSize(16),
    color: colors.primary,
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
  descriptionSection: {
    marginTop: hp(1),
  },
  descriptionText: {
    lineHeight: hp(2.5),
    marginTop: hp(0.5),
    color: colors.black,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.gray,
  },
  completedByContainer: {
    marginBottom: hp(2),
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: wp(4),
    borderRadius: hp(1.5),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  candidateAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  candidateAvatarText: {
    color: colors.white,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    color: colors.secondary,
    fontSize: getFontSize(15),
    fontWeight: 'bold',
    marginBottom: hp(0.3),
  },
  candidateDetail: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginTop: hp(0.2),
  },
  completedBadge: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
  },
  completedBadgeText: {
    color: colors.white,
    fontSize: getFontSize(11),
    fontWeight: 'bold',
  },
})

