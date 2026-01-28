import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const normalizeJobTypeLabel = (type) => {
  if (!type) return 'N/A'
  const t = String(type).trim()
  if (t.toLowerCase() === 'full-time' || t.toLowerCase() === 'full time' || t === 'Full-time') return 'Full-Time'
  if (t.toLowerCase() === 'part-time' || t.toLowerCase() === 'part time' || t === 'Part-time') return 'Part-Time'
  if (t.toLowerCase() === 'contract') return 'Contract'
  if (t.toLowerCase() === 'casual') return 'Casual'
  return t
}

// Format "HH:MM" (24h) to "h:MM AM/PM"
const formatTimeString = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return ''
  const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return String(timeString)
  const hours = parseInt(match[1], 10)
  const minutes = match[2]
  if (Number.isNaN(hours)) return String(timeString)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes} ${period}`
}

const formatDateToGb = (value) => {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getQuickSearchStartEndTime = (availability) => {
  if (!availability || typeof availability !== 'object') return null
  for (const day of DAYS_OF_WEEK) {
    const dayData = availability?.[day]
    if (dayData?.enabled && dayData?.from && dayData?.to) {
      return {
        day,
        startTime: dayData.from,
        endTime: dayData.to,
      }
    }
  }
  return null
}

const formatPayRange = (job) => {
  const salaryMin = job?.salaryMin
  const salaryMax = job?.salaryMax
  const salaryType = job?.salaryType

  if (typeof salaryMin === 'number' && typeof salaryMax === 'number' && (salaryMin > 0 || salaryMax > 0)) {
    const suffix = salaryType === 'Hourly' ? '/hr' : ''
    return `$${salaryMin}–$${salaryMax}${suffix}`
  }

  const range = job?.salaryRange
  if (typeof range === 'string' && range.trim() !== '') {
    // Convert "$28/hr to $38/hr" -> "$28–$38/hr"
    const m = range.match(/\$?\s*(\d+(?:\.\d+)?)\s*(?:\/hr)?\s*to\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:\/hr)?/i)
    if (m) {
      const suffix = /\/hr/i.test(range) || salaryType === 'Hourly' ? '/hr' : ''
      return `$${m[1]}–$${m[2]}${suffix}`
    }
    return range
  }

  return salaryType ? `Salary type: ${salaryType}` : 'Not specified'
}

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
  const displayJobType = normalizeJobTypeLabel(job?.type)
  const searchType = job?.searchType === 'quick' ? 'quick' : 'manual' // default to manual
  const payRange = formatPayRange(job)
  const positions = job?.staffNumber ?? job?.staffCount ?? job?.positions ?? job?.staffNeeded
  const quickTime = searchType === 'quick' ? getQuickSearchStartEndTime(job?.availability) : null
  const expireDateDisplay =
    job?.expireDate ||
    formatDateToGb(job?.expiresAt) ||
    'Not specified'
  const experienceDisplay = job?.experience || 'Not specified'

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
              {displayJobType}
            </AppText>
          </View>
          <View style={[
            styles.searchTypeBadge,
            searchType === 'quick' ? styles.quickSearchBadge : styles.manualSearchBadge
          ]}>
            <AppText variant={Variant.caption} style={styles.searchTypeText}>
              {searchType === 'quick' ? 'Quick Search' : 'Manual Search'}
            </AppText>
          </View>
        </View>
      </View>

      {/* Salary Range */}
      <AppText variant={Variant.bodyMedium} style={styles.salaryText}>
        {payRange}
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
          value={expireDateDisplay}
        />
        
        <JobDetailRow 
          iconName="location-outline"
          label="Work location"
          value={job.location}
        />

        {positions ? (
          <JobDetailRow
            iconName="people-outline"
            label="Positions"
            value={String(positions)}
          />
        ) : null}
        
        <JobDetailRow 
          iconName="star-outline"
          label="Experience"
          value={experienceDisplay}
        />

        {/* Quick Search: show exact time range from availability */}
        {searchType === 'quick' && quickTime ? (
          <>
            <JobDetailRow
              iconName="time-outline"
              label="Start time"
              value={formatTimeString(quickTime.startTime)}
            />
            <JobDetailRow
              iconName="time-outline"
              label="End time"
              value={formatTimeString(quickTime.endTime)}
            />
          </>
        ) : null}

        {/* Show salary type only when we don't have a real range */}
        {!job?.salaryRange && !(typeof job?.salaryMin === 'number' && typeof job?.salaryMax === 'number') ? (
          <JobDetailRow
            iconName="cash-outline"
            label="Salary type"
            value={job.salaryType}
          />
        ) : null}
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
            {onViewMatches || onTrackHours ? (
              <View style={styles.buttonRow}>
                {onViewMatches ? (
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