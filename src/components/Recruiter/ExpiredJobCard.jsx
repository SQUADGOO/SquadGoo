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

const ExpiredJobCard = ({ 
  job, 
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
      return `$${min}${suffix}–$${max}${suffix}`
    }
    if (typeof job?.salaryRange === 'string' && job.salaryRange.trim() !== '') {
      // normalize "$28/hr to $38/hr" -> "$28–$38/hr"
      const m = job.salaryRange.match(/\$?\s*(\d+(?:\.\d+)?)\s*(?:\/hr)?\s*to\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:\/hr)?/i)
      if (m) {
        const suffix2 = /\/hr/i.test(job.salaryRange) || type.includes('hour') ? '/hr' : /\/day/i.test(job.salaryRange) || type.includes('day') ? '/day' : ''
        return `$${m[1]}–$${m[2]}${suffix2}`
      }
      return job.salaryRange
    }
    return '—'
  }

  const paySummary = job?.salaryType ? `${job.salaryType}: ${formatPayRange()}` : formatPayRange()
  const searchType = job?.searchType === 'quick' ? 'quick' : 'manual'
  const positionsRequired = job?.staffNumber ?? job?.staffCount ?? job?.positions ?? '—'
  const positionsFilled = typeof job?.positionsFilled === 'number' ? job.positionsFilled : 0
  const hasNotes = typeof job?.expiryNotes === 'string' && job.expiryNotes.trim() !== ''

  return (
    <View style={styles.cardContainer}>
      
      {/* Header - Job Title and Badges */}
      <View style={styles.cardHeader}>
        <AppText variant={Variant.subTitle} style={styles.jobTitle}>
          {job.title}
        </AppText>
        <View style={styles.badgeContainer}>
          <View style={styles.expiredBadge}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={16}
              color="#FFFFFF"
            />
            <AppText variant={Variant.caption} style={styles.badgeText}>
              Expired
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
          {hasNotes ? (
            <View style={styles.notesBadge}>
              <AppText variant={Variant.caption} style={styles.notesText}>
                Has notes
              </AppText>
            </View>
          ) : null}
        </View>
      </View>

      {/* Salary Range */}
      <AppText variant={Variant.bodyMedium} style={styles.salaryText}>
        {paySummary}
      </AppText>

      {/* Job Details */}
      <View style={styles.detailsContainer}>
        <JobDetailRow
          iconName="briefcase-outline"
          label="Job type"
          value={job.type || '—'}
        />

        <JobDetailRow 
          iconName="calendar-outline"
          label="Posted"
          value={formatAuDate(job.offerDate || job.createdAt)}
        />
        
        <JobDetailRow 
          iconName="close-circle-outline"
          label="Expired"
          value={formatAuDate(job.expireDate || job.expiredAt)}
        />
        
        <JobDetailRow 
          iconName="location-outline"
          label="Location"
          value={job.location}
        />
        
        <JobDetailRow 
          iconName="people-outline"
          label="Positions"
          value={String(positionsRequired)}
        />

        <JobDetailRow
          iconName="checkmark-done-outline"
          label="Positions filled"
          value={String(positionsFilled)}
        />
      </View>

      {job?.expiryReason ? (
        <View style={styles.reasonRow}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="chatbox-ellipses-outline"
            size={18}
            color={colors.gray}
            style={styles.detailIcon}
          />
          <AppText variant={Variant.body} style={styles.reasonText} numberOfLines={1} ellipsizeMode="tail">
            Reason: <AppText variant={Variant.bodyMedium} style={styles.detailValue}>{job.expiryReason}</AppText>
          </AppText>
        </View>
      ) : null}

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
            color="#EF4444"
          />
          <AppText variant={Variant.bodyMedium} style={styles.detailsButtonText}>
            View Details
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ExpiredJobCard

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F9FAFB',
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
    borderLeftColor: '#EF4444',
    opacity: 0.78,
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  jobTitle: {
    flex: 1,
    color: '#6B7280',
    fontWeight: 'bold',
    marginRight: wp(3),
  },
  badgeContainer: {
    alignItems: 'flex-end',
    gap: hp(0.5),
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
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
    color: colors.gray,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  notesBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: hp(2),
  },
  notesText: {
    color: '#374151',
    fontSize: getFontSize(9),
    fontWeight: 'bold',
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
  reasonRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: hp(2),
  },
  reasonText: {
    flex: 1,
    color: colors.gray,
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
    borderColor: '#EF4444',
  },
  detailsButtonText: {
    color: '#EF4444',
  },
})

