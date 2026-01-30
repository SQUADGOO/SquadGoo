import React from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import moment from 'moment'
import { formatTime } from '@/utilities/helperFunctions'
import { screenNames } from '@/navigation/screenNames'
import AppButton from '@/core/AppButton'
import { updateExpiredJobFeedback } from '@/store/jobsSlice'

const normalizeJobTypeLabel = (type) => {
  if (!type) return ''
  const t = String(type).trim()
  if (t.toLowerCase() === 'full-time' || t.toLowerCase() === 'full time' || t === 'Full-time') return 'Full-Time'
  if (t.toLowerCase() === 'part-time' || t.toLowerCase() === 'part time' || t === 'Part-time') return 'Part-Time'
  if (t.toLowerCase() === 'contract') return 'Contract'
  if (t.toLowerCase() === 'casual') return 'Casual'
  return t
}

const formatAuDate = (value) => {
  if (!value) return ''
  const m = moment(value, [moment.ISO_8601, 'YYYY-MM-DD', 'DD/MM/YYYY', 'DD MMM YYYY', 'DD MMMM YYYY'], true)
  return m.isValid() ? m.format('DD MMM YYYY') : String(value)
}

const formatPayRange = (job) => {
  const salaryMin = job?.salaryMin
  const salaryMax = job?.salaryMax
  const salaryType = job?.salaryType

  if (typeof salaryMin === 'number' && typeof salaryMax === 'number' && (salaryMin > 0 || salaryMax > 0)) {
    const st = String(salaryType || '').toLowerCase()
    const suffix = st.includes('hour') ? '/hr' : st.includes('day') ? '/day' : ''
    return `$${salaryMin}–$${salaryMax}${suffix}`
  }

  const range = job?.salaryRange
  if (typeof range === 'string' && range.trim() !== '') {
    const m = range.match(/\$?\s*(\d+(?:\.\d+)?)\s*(?:\/hr)?\s*to\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:\/hr)?/i)
    if (m) {
      const st = String(salaryType || '').toLowerCase()
      const suffix =
        /\/hr/i.test(range) || st.includes('hour')
          ? '/hr'
          : /\/day/i.test(range) || st.includes('day')
          ? '/day'
          : ''
      return `$${m[1]}–$${m[2]}${suffix}`
    }
    return range
  }

  return ''
}

const ViewJobDetails = ({ navigation, route }) => {
  const { jobId, isCompleted, isExpired } = route.params || {}
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state?.auth?.userInfo || {})
  const currentUserId = userInfo?._id || userInfo?.id || userInfo?.userId || null
  const contactReveals = useSelector((state) => state?.contactReveal?.contactReveals || [])
  
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

  const isEmptyValue = (value) => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' && value.trim() === '') return true
    return false
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
  )

  const SectionHeader = ({ iconName, title, iconColor = colors.primary }) => (
    <View style={styles.sectionHeader}>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName={iconName}
        size={20}
        color={iconColor}
      />
      <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
        {title}
      </AppText>
    </View>
  )

  const InfoRow = ({
    iconName,
    label,
    value,
    valueStyle,
    hideIfEmpty = true,
    rowStyle,
  }) => {
    if (hideIfEmpty && isEmptyValue(value)) return null
    return (
      <View style={[styles.infoRow, rowStyle]}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName={iconName}
          size={16}
          color={colors.gray}
        />
        <View style={styles.infoContent}>
          <AppText variant={Variant.caption} style={styles.infoLabel}>
            {label}
          </AppText>
          <AppText
            variant={Variant.body}
            style={[styles.infoValue, valueStyle]}
          >
            {isEmptyValue(value) ? 'Not specified' : value}
          </AppText>
        </View>
      </View>
    )
  }

  const AvailabilityRow = ({ day, timeData }) => {
    console.log('timeData', timeData)
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

  const displayJobType = normalizeJobTypeLabel(job?.type)
  const payRange = formatPayRange(job)
  const searchType = job?.searchType === 'quick' ? 'quick' : 'manual' // default manual
  const experienceValue = job?.experience
  const positionsRequiredValue = job?.staffNumber || job?.staffCount
  const positionsFilledValue =
    Array.isArray(completedByCandidates) && completedByCandidates.length > 0
      ? completedByCandidates.length
      : positionsRequiredValue
  const positionsFilledExpiredValue =
    typeof job?.positionsFilled === 'number'
      ? job.positionsFilled
      : 0

  const paySummary = job?.salaryType
    ? `${job.salaryType}: ${payRange || job?.salaryRange || '—'}`
    : (payRange || job?.salaryRange || '—')

  // Timeline fields (AU format)
  const postedDateValue = job?.offerDate || formatAuDate(job?.createdAt)
  const startDateValue = formatAuDate(job?.jobStartDate)
  const endDateValue = formatAuDate(job?.jobEndDate)
  const expiryValue = job?.expireDate || formatAuDate(job?.expiresAt)
  const completedDateValue = job?.completedDate || formatAuDate(job?.completedAt)

  const keyQualificationsValue = (() => {
    const parts = []
    if (job?.educationalQualification) parts.push(String(job.educationalQualification))
    if (job?.extraQualification) parts.push(String(job.extraQualification))
    return parts.length > 0 ? parts.join(' • ') : ''
  })()

  const [expiryReasonDraft, setExpiryReasonDraft] = React.useState(job?.expiryReason || '')
  const [expiryNotesDraft, setExpiryNotesDraft] = React.useState(job?.expiryNotes || '')
  const [positionsFilledDraft, setPositionsFilledDraft] = React.useState(
    String(typeof job?.positionsFilled === 'number' ? job.positionsFilled : 0),
  )

  React.useEffect(() => {
    setExpiryReasonDraft(job?.expiryReason || '')
    setExpiryNotesDraft(job?.expiryNotes || '')
    setPositionsFilledDraft(String(typeof job?.positionsFilled === 'number' ? job.positionsFilled : 0))
  }, [job?.expiryReason, job?.expiryNotes, job?.positionsFilled])

  const parseNonNegativeInt = (value) => {
    const n = Number.parseInt(String(value), 10)
    if (!Number.isFinite(n) || Number.isNaN(n)) return 0
    return Math.max(0, n)
  }

  const handleSaveExpiryFeedback = () => {
    dispatch(
      updateExpiredJobFeedback({
        jobId,
        expiryReason: expiryReasonDraft,
        expiryNotes: expiryNotesDraft,
        positionsFilled: parseNonNegativeInt(positionsFilledDraft),
      }),
    )
  }

  const canSeeCandidatePhone = (candidateId) => {
    if (!currentUserId || !candidateId) return false
    const now = new Date()
    return contactReveals.some((r) => {
      if (!r?.isActive) return false
      if (r?.jobId !== jobId) return false
      if (new Date(r.expiresAt) <= now) return false
      return (
        (r.userId1 === currentUserId && r.userId2 === candidateId) ||
        (r.userId2 === currentUserId && r.userId1 === candidateId)
      )
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <AppHeader title="Job Details" showTopIcons={false} height={hp(14)} />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >

        {/* Summary / Hero card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="briefcase-outline"
                size={24}
                color={colors.white}
              />
            </View>
            <View style={styles.summaryInfo}>
              <AppText variant={Variant.h3} style={styles.summaryTitle}>
                {job.title}
              </AppText>
              <View style={styles.summaryMetaRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="location-outline"
                  size={14}
                  color={colors.gray}
                />
                <AppText variant={Variant.bodySmall} style={styles.summaryMetaText}>
                  {job.location || 'Location not specified'}
                </AppText>
              </View>
              {job.industry ? (
                <View style={styles.summaryMetaRow}>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="pricetag-outline"
                    size={14}
                    color={colors.gray}
                  />
                  <AppText variant={Variant.bodySmall} style={styles.summaryMetaText}>
                    {job.industry}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.chipsRow}>
            {isCompleted ? (
              <View style={[styles.chip, styles.completedChip]}>
                <AppText variant={Variant.caption} style={styles.chipText}>
                  ✓ Job Completed
                </AppText>
              </View>
            ) : null}
            {isExpired ? (
              <View style={[styles.chip, styles.expiredChip]}>
                <AppText variant={Variant.caption} style={styles.chipText}>
                  ⏱ Job Expired
                </AppText>
              </View>
            ) : null}
            <View
              style={[
                styles.chip,
                searchType === 'quick' ? styles.quickChip : styles.manualChip,
              ]}
            >
              <AppText variant={Variant.caption} style={styles.chipText}>
                {searchType === 'quick' ? '⚡ Quick Search' : '📝 Manual Search'}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="people-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.bodySmall} style={styles.statText}>
                {positionsRequiredValue || '—'} Positions
              </AppText>
            </View>
            <View style={styles.statPill}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="cash-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.bodySmall} style={styles.statText}>
                {paySummary}
              </AppText>
            </View>
          </View>
        </Card>

        {/* Job Information */}
        <Card>
          <SectionHeader iconName="information-circle-outline" title="Job information" />
          <View style={styles.divider} />
          <InfoRow iconName="briefcase-outline" label="Job type" value={displayJobType} />
          <InfoRow iconName="pricetag-outline" label="Industry" value={job.industry} />
          <InfoRow
            iconName="ribbon-outline"
            label="Key qualifications"
            value={keyQualificationsValue}
          />
          <InfoRow
            iconName="document-text-outline"
            label="Tax type"
            value={job.taxType}
            valueStyle={styles.highlightValue}
          />
        </Card>

        {/* Location */}
        <Card>
          <SectionHeader iconName="location-outline" title="Location" />
          <View style={styles.divider} />
          <InfoRow iconName="navigate-outline" label="Work location" value={job.location} />
          <InfoRow
            iconName="compass-outline"
            label="Range from location"
            value={job.rangeKm ? `${job.rangeKm} km` : ''}
          />
        </Card>

        {/* Positions & Experience */}
        <Card>
          <SectionHeader iconName="people-outline" title="Positions & experience" />
          <View style={styles.divider} />
          <InfoRow
            iconName="people-outline"
            label="Positions"
            value={positionsRequiredValue}
          />
          {isExpired ? (
            <InfoRow
              iconName="checkmark-done-outline"
              label="Positions filled"
              value={positionsFilledExpiredValue}
              hideIfEmpty={false}
            />
          ) : null}
          <InfoRow
            iconName="medal-outline"
            label="Experience required"
            value={experienceValue}
          />
          <InfoRow
            iconName="school-outline"
            label="Education required"
            value={job.educationalQualification}
          />
          <InfoRow
            iconName="checkmark-done-outline"
            label="Extra qualification"
            value={job.extraQualification}
          />
          <InfoRow
            iconName="sparkles-outline"
            label="Freshers can apply"
            value={job.freshersCanApply ? 'Yes' : ''}
            valueStyle={styles.yesValue}
          />
        </Card>

        {/* Compensation */}
        <Card>
          <SectionHeader iconName="cash-outline" title="Compensation" />
          <View style={styles.divider} />
          <InfoRow
            iconName="cash-outline"
            label="Pay"
            value={paySummary}
            valueStyle={styles.salaryValue}
            hideIfEmpty={false}
          />
        </Card>

        {/* Job timeline */}
        <Card>
          <SectionHeader iconName="calendar-outline" title="Job timeline" />
          <View style={styles.divider} />
          <InfoRow
            iconName="calendar-outline"
            label="Posted date"
            value={postedDateValue ? formatAuDate(postedDateValue) : ''}
          />
          <InfoRow iconName="play-outline" label="Start date" value={startDateValue} />
          <InfoRow iconName="stop-outline" label="End date" value={endDateValue || job?.duration} />
          {isCompleted ? (
            <InfoRow
              iconName="checkmark-done-outline"
              label="Completed date"
              value={completedDateValue ? formatAuDate(completedDateValue) : ''}
            />
          ) : null}
          {isExpired ? (
            <InfoRow
              iconName="close-circle-outline"
              label="Expired date"
              value={job?.expireDate ? formatAuDate(job.expireDate) : (expiryValue ? formatAuDate(expiryValue) : '')}
              hideIfEmpty={false}
            />
          ) : (
            <InfoRow
              iconName="hourglass-outline"
              label="Offer expires"
              value={expiryValue ? formatAuDate(expiryValue) : ''}
            />
          )}
        </Card>

        {/* Expiry details (reason + recruiter notes) */}
        {isExpired ? (
          <Card>
            <SectionHeader iconName="alert-circle-outline" title="Expiry details" iconColor="#EF4444" />
            <View style={styles.divider} />

            <InfoRow
              iconName="chatbox-ellipses-outline"
              label="Reason for expiry"
              value={job?.expiryReason || ''}
              hideIfEmpty={true}
            />

            <AppText variant={Variant.caption} style={styles.inputLabel}>
              Reason for expiry (optional)
            </AppText>
            <TextInput
              value={expiryReasonDraft}
              onChangeText={setExpiryReasonDraft}
              placeholder="e.g. No suitable candidates"
              placeholderTextColor={colors.gray}
              style={styles.input}
            />

            <View style={styles.twoColRow}>
              <View style={styles.twoCol}>
                <AppText variant={Variant.caption} style={styles.inputLabel}>
                  Positions filled
                </AppText>
                <TextInput
                  value={positionsFilledDraft}
                  onChangeText={setPositionsFilledDraft}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.gray}
                  style={styles.input}
                />
              </View>
              <View style={styles.twoCol} />
            </View>

            <AppText variant={Variant.caption} style={styles.inputLabel}>
              Feedback / notes (optional)
            </AppText>
            <TextInput
              value={expiryNotesDraft}
              onChangeText={setExpiryNotesDraft}
              placeholder="Add notes about why the offer expired..."
              placeholderTextColor={colors.gray}
              style={[styles.input, styles.notesInput]}
              multiline
            />

            <View style={styles.saveRow}>
              <AppButton
                text="Save notes"
                onPress={handleSaveExpiryFeedback}
                bgColor={colors.primary}
                textColor="#FFFFFF"
              />
            </View>
          </Card>
        ) : null}

        {/* Extra pay */}
        {job.extraPay && Object.keys(job.extraPay).length > 0 ? (
          <Card>
            <SectionHeader iconName="sparkles-outline" title="Extra pay offered" />
            <View style={styles.divider} />
            <InfoRow
              iconName="calendar-outline"
              label="Public holidays"
              value={job.extraPay.publicHolidays ? 'Yes' : 'No'}
              valueStyle={job.extraPay.publicHolidays && styles.yesValue}
              hideIfEmpty={false}
            />
            <InfoRow
              iconName="sunny-outline"
              label="Weekend"
              value={job.extraPay.weekend ? 'Yes' : 'No'}
              valueStyle={job.extraPay.weekend && styles.yesValue}
              hideIfEmpty={false}
            />
            <InfoRow
              iconName="time-outline"
              label="Shift loading"
              value={job.extraPay.shiftLoading ? 'Yes' : 'No'}
              valueStyle={job.extraPay.shiftLoading && styles.yesValue}
              hideIfEmpty={false}
            />
            <InfoRow
              iconName="gift-outline"
              label="Bonuses"
              value={job.extraPay.bonuses ? 'Yes' : 'No'}
              valueStyle={job.extraPay.bonuses && styles.yesValue}
              hideIfEmpty={false}
            />
            <InfoRow
              iconName="add-circle-outline"
              label="Overtime"
              value={job.extraPay.overtime ? 'Yes' : 'No'}
              valueStyle={job.extraPay.overtime && styles.yesValue}
              hideIfEmpty={false}
            />
          </Card>
        ) : null}

        {/* Availability (Quick Search jobs) */}
        {job.availability && typeof job.availability === 'object' && Object.keys(job.availability).length > 0 ? (
          <Card>
            <SectionHeader iconName="time-outline" title="Availability to work" />
            <View style={styles.divider} />
            <View style={styles.availabilityContainer}>
              {Object.entries(job.availability).map(([day, timeData]) => (
                <AvailabilityRow key={day} day={day} timeData={timeData} />
              ))}
            </View>
          </Card>
        ) : null}

        {/* Description */}
        {job.jobDescription ? (
          <Card>
            <SectionHeader iconName="document-text-outline" title="Job description" />
            <View style={styles.divider} />
            <AppText variant={Variant.body} style={styles.descriptionText}>
              {job.jobDescription}
            </AppText>
          </Card>
        ) : null}

        {/* Completed by */}
        {isCompleted && allCandidates.length > 0 ? (
          <Card>
            <SectionHeader iconName="checkmark-done-outline" title="Completed by" />
            <View style={styles.divider} />
            <View style={styles.completedByContainer}>
              {allCandidates
                .filter(candidate =>
                  completedByCandidates.length > 0
                    ? completedByCandidates.includes(candidate.id)
                    : candidate.status === 'accepted',
                )
                .map((candidate) => (
                  <View key={candidate.id} style={styles.candidateCard}>
                    <View style={styles.candidateAvatar}>
                      {candidate?.avatarUri || candidate?.photo || candidate?.profilePhoto ? (
                        <Image
                          source={{ uri: candidate.avatarUri || candidate.photo || candidate.profilePhoto }}
                          style={styles.candidateAvatarImage}
                        />
                      ) : (
                        <AppText variant={Variant.bodyMedium} style={styles.candidateAvatarText}>
                          {candidate.name?.charAt(0) || '?'}
                        </AppText>
                      )}
                    </View>
                    <View style={styles.candidateInfo}>
                      <AppText variant={Variant.bodyMedium} style={styles.candidateName}>
                        {candidate.name || 'Unknown'}
                      </AppText>
                      <AppText variant={Variant.bodySmall} style={styles.candidateDetail}>
                        📍 {candidate.location || 'N/A'}
                      </AppText>
                      {candidate.phone && canSeeCandidatePhone(candidate.id) ? (
                        <AppText variant={Variant.bodySmall} style={styles.candidateDetail}>
                          📞 {candidate.phone}
                        </AppText>
                      ) : null}
                    </View>
                    <View style={styles.completedBadge}>
                      <AppText variant={Variant.caption} style={styles.completedBadgeText}>
                        ✓ Completed
                      </AppText>
                    </View>
                  </View>
                ))}
            </View>
          </Card>
        ) : null}

        {/* Support */}
        <Card>
          <SectionHeader iconName="help-circle-outline" title="Support" />
          <View style={styles.divider} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(screenNames.SUPPORT)}
            style={styles.supportBtn}
          >
            <AppText variant={Variant.bodyMedium} style={styles.supportText}>
              Need help? Contact support
            </AppText>
          </TouchableOpacity>
        </Card>

      </ScrollView>
    </View>
  )
}

export default ViewJobDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F6FA',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: wp(4),
    paddingBottom: hp(4),
    gap: hp(2),
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryCard: {
    padding: wp(5),
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  summaryIcon: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: getFontSize(20),
    marginBottom: hp(0.6),
  },
  summaryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginTop: hp(0.3),
  },
  summaryMetaText: {
    color: colors.gray,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(1),
  },
  chip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: hp(3),
  },
  completedChip: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  expiredChip: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  quickChip: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  manualChip: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  chipText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: getFontSize(11),
  },
  statsRow: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(1.5),
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    gap: wp(2),
  },
  statText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: getFontSize(12),
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1.2),
  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: '800',
    color: colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: hp(1.5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(3),
    marginBottom: hp(1.5),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.gray,
    fontSize: getFontSize(11),
    fontWeight: '600',
    marginBottom: hp(0.2),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },

  salaryValue: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  highlightValue: {
    color: colors.primary,
  },
  yesValue: {
    color: '#4ADE80',
    fontWeight: '700',
  },
  availabilityContainer: {
    marginTop: hp(0.5),
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
  descriptionText: {
    lineHeight: hp(2.5),
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
  supportBtn: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: hp(1.5),
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    alignItems: 'center',
  },
  supportText: {
    color: colors.primary || '#FF6B35',
  },
  inputLabel: {
    color: colors.gray,
    fontSize: getFontSize(11),
    fontWeight: '600',
    marginBottom: hp(0.6),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    borderRadius: hp(1.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    color: colors.secondary,
    marginBottom: hp(1.5),
  },
  notesInput: {
    minHeight: hp(12),
    textAlignVertical: 'top',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: wp(3),
  },
  twoCol: {
    flex: 1,
  },
  saveRow: {
    marginTop: hp(0.5),
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
  candidateAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(6),
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

