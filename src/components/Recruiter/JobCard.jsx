import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'

// Reusable Job Detail Row Component
const JobDetailRow = ({ iconName, label, value }) => (
  <View style={styles.detailRow}>
    <VectorIcons
      name={iconLibName.Ionicons}
      iconName={iconName}
      size={18}
      color={colors.gray}
      style={styles.detailIcon}
    />
    <AppText variant={Variant.body} style={styles.detailText}>
      {label}: <AppText variant={Variant.bodyMedium} style={styles.detailValue}>{value}</AppText>
    </AppText>
  </View>
)

const JobCard = ({ 
  job, 
  mode = 'default',
  onPreview, 
  onUpdate, 
  onViewCandidates, 
  onCloseJob,
  onViewMatches,
  onTrackHours,
  onContinueEdit,
  onDeleteDraft,
}) => {
  return (
    <View style={styles.cardContainer}>
      
      {/* Header - Job Title and Type Badge */}
      <View style={styles.cardHeader}>
        <AppText variant={Variant.subTitle} style={styles.jobTitle}>
          {job.title}
        </AppText>
        <View style={styles.badgeContainer}>
          <View style={styles.jobTypeBadge}>
            <AppText variant={Variant.caption} style={styles.jobTypeText}>
              {job.type}
            </AppText>
          </View>
          {job.searchType && (
            <View style={[
              styles.searchTypeBadge,
              job.searchType === 'quick' ? styles.quickSearchBadge : styles.manualSearchBadge
            ]}>
              <AppText variant={Variant.caption} style={styles.searchTypeText}>
                {job.searchType === 'quick' ? 'Quick Search' : 'Manual Search'}
              </AppText>
            </View>
          )}
        </View>
      </View>

      {/* Salary Range */}
      <AppText variant={Variant.bodyMedium} style={styles.salaryText}>
        {job.salaryRange}
      </AppText>

      {/* Job Details */}
      <View style={styles.detailsContainer}>
        <JobDetailRow 
          iconName="calendar-outline"
          label="Offer date"
          value={job.offerDate}
        />
        
        <JobDetailRow 
          iconName="time-outline"
          label="Offer expire date"
          value={job.expireDate}
        />
        
        <JobDetailRow 
          iconName="location-outline"
          label="Work location"
          value={job.location}
        />
        
        <JobDetailRow 
          iconName="star-outline"
          label="Experience"
          value={job.experience}
        />
        
        <JobDetailRow 
          iconName="cash-outline"
          label="Salary type"
          value={job.salaryType}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {mode === 'draft' ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => onContinueEdit?.(job)}
              activeOpacity={0.8}
            >
              <AppText variant={Variant.bodyMedium} style={styles.updateButtonText}>
                Continue Editing
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.closeJobButton]}
              onPress={() => onDeleteDraft?.(job)}
              activeOpacity={0.8}
            >
              <AppText variant={Variant.bodyMedium} style={styles.closeJobButtonText}>
                Delete Draft
              </AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* First Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.previewButton]}
                onPress={() => onPreview?.(job)}
                activeOpacity={0.8}
              >
                <AppText variant={Variant.bodyMedium} style={styles.previewButtonText}>
                  Preview
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.updateButton]}
                onPress={() => onUpdate?.(job)}
                activeOpacity={0.8}
              >
                <AppText variant={Variant.bodyMedium} style={styles.updateButtonText}>
                  Update
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Second Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.candidatesButton]}
                onPress={() => onViewCandidates?.(job)}
                activeOpacity={0.8}
              >
                <AppText variant={Variant.bodyMedium} style={styles.candidatesButtonText}>
                  Candidates
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.closeJobButton]}
                onPress={() => onCloseJob?.(job)}
                activeOpacity={0.8}
              >
                <AppText variant={Variant.bodyMedium} style={styles.closeJobButtonText}>
                  Close Job
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Third Row */}
            {(job?.searchType === 'manual' && onViewMatches) || onTrackHours ? (
              <View style={styles.buttonRow}>
                {(job?.searchType === 'manual' && onViewMatches) ? (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.matchesButton]}
                    onPress={() => onViewMatches?.(job)}
                    activeOpacity={0.8}
                  >
                    <AppText variant={Variant.bodyMedium} style={styles.matchesButtonText}>
                      Matches
                    </AppText>
                  </TouchableOpacity>
                ) : null}

                {onTrackHours ? (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.trackButton]}
                    onPress={() => onTrackHours?.(job)}
                    activeOpacity={0.8}
                  >
                    <AppText variant={Variant.bodyMedium} style={styles.trackButtonText}>
                      Track Hours
                    </AppText>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </>
        )}

      </View>
    </View>
  )
}

export default JobCard

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(5),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  jobTitle: {
    flex: 1,
    color: '#65799B',
    fontWeight: 'bold',
    marginRight: wp(3),
  },
  badgeContainer: {
    alignItems: 'flex-end',
    gap: hp(0.5),
  },
  jobTypeBadge: {
    backgroundColor:  '#C0B5C9',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(3),
  },
  jobTypeText: {
    color: colors.white,
    fontSize: getFontSize(12),
  },
  searchTypeBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: hp(2.5),
  },
  quickSearchBadge: {
    backgroundColor: '#10B981',
  },
  manualSearchBadge: {
    backgroundColor: '#3B82F6',
  },
  searchTypeText: {
    color: colors.white,
    fontSize: getFontSize(10),
    fontWeight: 'bold',
  },
  salaryText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  detailsContainer: {
    marginBottom: hp(3),
  },
  detailRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  detailIcon: {
    marginRight: wp(3),
    width: wp(5),
  },
  detailText: {
    // color: colors.gray,
    flex: 1,
  },
  detailValue: {
    fontWeight: 'bold',
    // color: colors.black,
  },
  buttonContainer: {
    gap: hp(1.5),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: wp(3),
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  previewButton: {
    backgroundColor: 'transparent',
    borderColor: '#4ADE80',
  },
  previewButtonText: {
    color: '#4ADE80',
  },
  updateButton: {
    backgroundColor: 'transparent',
    borderColor: colors.primary || '#FF6B35',
  },
  updateButtonText: {
    color: colors.primary || '#FF6B35',
  },
  candidatesButton: {
    backgroundColor: 'transparent',
    borderColor: '#6366F1',
  },
  candidatesButtonText: {
    color: '#6366F1',
  },
  matchesButton: {
    backgroundColor: 'transparent',
    borderColor: '#F97316',
  },
  matchesButtonText: {
    color: '#F97316',
  },
  trackButton: {
    backgroundColor: 'transparent',
    borderColor: '#14B8A6',
  },
  trackButtonText: {
    color: '#14B8A6',
  },
  closeJobButton: {
    backgroundColor: 'transparent',
    borderColor: '#EF4444',
  },
  closeJobButtonText: {
    color: '#EF4444',
  },
})