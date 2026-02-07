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

const CompletedJobCard = ({ 
  job, 
  positionsFilled,
  onViewDetails
}) => {
  const formatAuDate = (value) => {
    if (!value) return '—'
    if (typeof value === 'string') {
      const s = value.trim()
      if (/^\d{1,2}\s+[A-Za-z]{3,}\s+\d{4}$/.test(s)) return s
    }
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return typeof value === 'string' ? value : '—'
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const toNumber = (v) => {
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : null
  }

  const formatPayRange = () => {
    const min = toNumber(job?.salaryMin)
    const max = toNumber(job?.salaryMax)
    const type = String(job?.salaryType || '').toLowerCase()
    const suffix = type.includes('hour') ? '/hr' : type.includes('day') ? '/day' : ''

    if (min != null && max != null && (min > 0 || max > 0)) {
      return `$${min}${suffix} – $${max}${suffix}`
    }

    if (typeof job?.salaryRange === 'string' && job.salaryRange.trim() !== '') {
      return job.salaryRange
    }
    return '—'
  }

  const paySummary = job?.salaryType ? `${job.salaryType}: ${formatPayRange()}` : formatPayRange()
  const searchType = job?.searchType === 'quick' ? 'quick' : 'manual'

  const positionsValue =
    typeof positionsFilled === 'number'
      ? positionsFilled
      : toNumber(job?.staffNumber) ?? toNumber(job?.staffCount) ?? '—'

  return (
    <View style={styles.cardContainer}>
      
      {/* Header - Job Title and Badges */}
      <View style={styles.cardHeader}>
        <AppText variant={Variant.subTitle} style={styles.jobTitle}>
          {job.title}
        </AppText>
        <View style={styles.badgeContainer}>
          <View style={styles.completedBadge}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark-circle"
              size={16}
              color="#FFFFFF"
            />
            <AppText variant={Variant.caption} style={styles.badgeText}>
              Completed
            </AppText>
          </View>
          <View
            style={[
              styles.searchTypeBadge,
              searchType === 'quick' ? styles.quickSearchBadge : styles.manualSearchBadge,
            ]}
          >
            <AppText variant={Variant.caption} style={styles.searchTypeText}>
              {searchType === 'quick' ? 'Quick' : 'Manual'}
            </AppText>
          </View>
        </View>
      </View>

      {/* Salary Range */}
      <AppText variant={Variant.bodyMedium} style={styles.salaryText}>
        {paySummary}
      </AppText>

      {/* Job Details */}
      <View style={styles.detailsContainer}>
        <JobDetailRow 
          iconName="calendar-outline"
          label="Posted"
          value={formatAuDate(job.offerDate || job.createdAt)}
        />
        
        <JobDetailRow 
          iconName="checkmark-done-outline"
          label="Completed"
          value={formatAuDate(job.completedDate || job.completedAt)}
        />
        
        <JobDetailRow 
          iconName="location-outline"
          label="Location"
          value={job.location}
        />
        
        <JobDetailRow 
          iconName="people-outline"
          label="Positions"
          value={positionsValue}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.detailsButton]}
          onPress={() => onViewDetails(job)}
          activeOpacity={0.8}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="eye-outline"
            size={20}
            color="#4ADE80"
          />
          <AppText variant={Variant.bodyMedium} style={styles.detailsButtonText}>
            View Details
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CompletedJobCard

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
    borderLeftWidth: 4,
    borderLeftColor: '#4ADE80',
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
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: hp(2.5),
    gap: wp(1),
  },
  badgeText: {
    color: colors.white,
    fontSize: getFontSize(11),
    fontWeight: 'bold',
  },
  searchTypeBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: hp(2),
  },
  quickSearchBadge: {
    backgroundColor: '#10B981',
  },
  manualSearchBadge: {
    backgroundColor: '#3B82F6',
  },
  searchTypeText: {
    color: colors.white,
    fontSize: getFontSize(9),
    fontWeight: 'bold',
  },
  salaryText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  detailsContainer: {
    marginBottom: hp(2),
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
    flex: 1,
  },
  detailValue: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: hp(1),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(4),
    gap: wp(2),
  },
  detailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  detailsButtonText: {
    color: '#4ADE80',
  },
})

