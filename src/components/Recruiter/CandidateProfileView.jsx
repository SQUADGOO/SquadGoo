import React from 'react'
import { View, StyleSheet } from 'react-native'
import AppText, { Variant } from '@/core/AppText'
import FastImageView from '@/core/FastImageView'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { Images } from '@/assets'
import { colors, getFontSize, hp, wp } from '@/theme'

/**
 * Shared candidate profile display component.
 *
 * Props:
 * - candidate        – candidate data object (required)
 * - matchedForLabel  – e.g. "Matched for: Painter" (optional string)
 * - showStats        – show match/acceptance/review stats row (default true)
 * - headerExtra      – extra JSX rendered inside the profile card below the stats (optional)
 * - children         – rendered after all profile sections (action buttons, etc.)
 */
const CandidateProfileView = ({
  candidate,
  matchedForLabel,
  showStats = true,
  headerExtra,
  children,
}) => {
  if (!candidate) return null

  return (
    <>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          {candidate.avatar ? (
            <FastImageView
              source={{ uri: candidate.avatar }}
              style={styles.avatar}
              resizeMode="cover"
              fallbackImage={Images.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
                {candidate.name?.charAt(0)?.toUpperCase() || 'U'}
              </AppText>
            </View>
          )}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <AppText variant={Variant.title} style={styles.name}>
                {candidate.name || 'Unknown'}
              </AppText>
              {candidate.isVerified ? (
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark-circle"
                  size={18}
                  color="#3B82F6"
                />
              ) : null}
            </View>
            <View style={styles.locationRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="location-outline" size={14} color={colors.gray} />
              <AppText variant={Variant.caption} style={styles.meta}>
                {candidate.suburb ? `${candidate.suburb}, ` : ''}{candidate.location || 'Location not specified'}
                {typeof candidate.distanceKm === 'number' ? ` • ${candidate.distanceKm} km away` : ''}
              </AppText>
            </View>
            {candidate.badge ? (
              <View style={styles.badgePill}>
                <AppText variant={Variant.caption} style={styles.badgePillText}>
                  {candidate.badge} Badge
                </AppText>
              </View>
            ) : null}
            {matchedForLabel ? (
              <AppText variant={Variant.caption} style={styles.matchedFor}>
                {matchedForLabel}
              </AppText>
            ) : null}
          </View>
        </View>

        {showStats ? (
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <VectorIcons name={iconLibName.Ionicons} iconName="stats-chart" size={16} color="#F59E0B" />
              <AppText variant={Variant.bodyMedium} style={styles.statText}>
                {Math.round(candidate.matchPercentage || 0)}% Match
              </AppText>
            </View>
            <View style={styles.statBadge}>
              <VectorIcons name={iconLibName.Ionicons} iconName="star" size={16} color="#F59E0B" />
              <AppText variant={Variant.bodyMedium} style={styles.statText}>
                {candidate.acceptanceRating || 0}% Acceptance
              </AppText>
            </View>
            {typeof candidate.reviewSummary?.average === 'number' ? (
              <View style={styles.statBadge}>
                <VectorIcons name={iconLibName.Ionicons} iconName="chatbubbles-outline" size={16} color="#10B981" />
                <AppText variant={Variant.bodyMedium} style={styles.statText}>
                  {candidate.reviewSummary.average.toFixed(1)} / 5
                </AppText>
              </View>
            ) : null}
          </View>
        ) : null}

        {headerExtra || null}
      </View>

      {/* Experience & Skills */}
      <View style={styles.card}>
        <SectionHeader icon="briefcase-outline" title="Experience & Skills" />
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={16} color={colors.gray} />
          <AppText variant={Variant.body} style={styles.infoText}>
            {candidate.experienceYears ? `${candidate.experienceYears}+ years experience` : (candidate.experience || 'Not specified')}
          </AppText>
        </View>
        {candidate.industries?.length ? (
          <InfoField label="Industries" value={candidate.industries.join(', ')} icon="business-outline" />
        ) : null}
        {candidate.preferredRoles?.length ? (
          <InfoField label="Preferred Roles" value={candidate.preferredRoles.join(', ')} icon="person-outline" />
        ) : null}
        {candidate.skills?.length ? (
          <View style={[styles.infoRow, styles.infoRowSpacing]}>
            <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle-outline" size={16} color={colors.gray} />
            <View style={styles.infoContent}>
              <AppText variant={Variant.caption} style={styles.infoLabel}>Skills</AppText>
              <View style={styles.skillsContainer}>
                {candidate.skills.map((skill, index) => (
                  <View key={`${skill}-${index}`} style={styles.skillTag}>
                    <AppText variant={Variant.caption} style={styles.skillText}>{skill}</AppText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {/* Availability */}
      {(candidate.availability?.summary || candidate.radiusKm) ? (
        <View style={styles.card}>
          <SectionHeader icon="calendar-outline" title="Availability" />
          <View style={styles.divider} />
          {candidate.availability?.summary ? (
            <View style={styles.infoRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={16} color={colors.gray} />
              <AppText variant={Variant.body} style={styles.infoText}>{candidate.availability.summary}</AppText>
            </View>
          ) : null}
          {candidate.radiusKm ? (
            <View style={[styles.infoRow, candidate.availability?.summary ? styles.infoRowSpacing : null]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="location-outline" size={16} color={colors.gray} />
              <AppText variant={Variant.body} style={styles.infoText}>Service radius: {candidate.radiusKm} km</AppText>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Qualifications */}
      {(candidate.qualifications?.length || candidate.education) ? (
        <View style={styles.card}>
          <SectionHeader icon="school-outline" title="Qualifications & Licenses" />
          <View style={styles.divider} />
          {candidate.qualifications?.length ? (
            <View style={styles.infoRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="document-text-outline" size={16} color={colors.gray} />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>Certifications</AppText>
                {candidate.qualifications.map((qual, index) => (
                  <AppText key={`${qual}-${index}`} variant={Variant.body} style={styles.infoValue}>• {qual}</AppText>
                ))}
              </View>
            </View>
          ) : null}
          {candidate.education ? (
            <InfoField label="Education" value={candidate.education} icon="library-outline" />
          ) : null}
        </View>
      ) : null}

      {/* Preferences */}
      {(candidate.payPreference || candidate.taxTypes?.length || candidate.languages?.length) ? (
        <View style={styles.card}>
          <SectionHeader icon="settings-outline" title="Preferences" />
          <View style={styles.divider} />
          {candidate.payPreference ? (
            <View style={styles.infoRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="cash-outline" size={16} color={colors.gray} />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>Pay Rate</AppText>
                <AppText variant={Variant.body} style={[styles.infoValue, styles.payRate]}>
                  ${candidate.payPreference.min} - ${candidate.payPreference.max}/hr
                </AppText>
              </View>
            </View>
          ) : null}
          {candidate.taxTypes?.length ? (
            <InfoField label="Tax Types" value={candidate.taxTypes.join(', ')} icon="receipt-outline" />
          ) : null}
          {candidate.languages?.length ? (
            <InfoField label="Languages" value={candidate.languages.join(', ')} icon="language-outline" />
          ) : null}
        </View>
      ) : null}

      {/* About */}
      {candidate.bio ? (
        <View style={styles.card}>
          <SectionHeader icon="person-circle-outline" title="About" />
          <View style={styles.divider} />
          <AppText variant={Variant.body} style={styles.bioText}>{candidate.bio}</AppText>
        </View>
      ) : null}

      {/* Work History */}
      {Array.isArray(candidate.workHistory) && candidate.workHistory.length > 0 ? (
        <View style={styles.card}>
          <SectionHeader icon="reader-outline" title="Work History" />
          <View style={styles.divider} />
          {candidate.workHistory.map((item, index) => (
            <View key={`${item.company || 'company'}-${index}`} style={index > 0 ? styles.historyItemSpacing : null}>
              <AppText variant={Variant.bodyMedium} style={styles.historyRole}>{item.role}</AppText>
              <AppText variant={Variant.caption} style={styles.historyMeta}>
                {item.company}{item.period ? ` • ${item.period}` : ''}
              </AppText>
              {item.summary ? (
                <AppText variant={Variant.body} style={styles.historySummary}>{item.summary}</AppText>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Documents */}
      {Array.isArray(candidate.documents) && candidate.documents.length > 0 ? (
        <View style={styles.card}>
          <SectionHeader icon="document-text-outline" title="Documents" />
          <View style={styles.divider} />
          {candidate.documents.map((doc, index) => (
            <View key={`${doc.type || 'doc'}-${index}`} style={[styles.docRow, index > 0 ? styles.infoRowSpacing : null]}>
              <View style={styles.docLeft}>
                <VectorIcons name={iconLibName.Ionicons} iconName="attach-outline" size={16} color={colors.gray} />
                <View style={styles.infoContent}>
                  <AppText variant={Variant.bodyMedium} style={styles.docTitle}>{doc.title}</AppText>
                  <AppText variant={Variant.caption} style={styles.docMeta}>{doc.type}</AppText>
                </View>
              </View>
              {doc.verified ? (
                <View style={styles.verifiedPill}>
                  <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={14} color="#3B82F6" />
                  <AppText variant={Variant.caption} style={styles.verifiedText}>Verified</AppText>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Reviews */}
      {Array.isArray(candidate.reviews) && candidate.reviews.length > 0 ? (
        <View style={styles.card}>
          <SectionHeader icon="chatbubbles-outline" title="Ratings & Reviews" />
          <View style={styles.divider} />
          {typeof candidate.reviewSummary?.average === 'number' ? (
            <View style={styles.reviewSummaryRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="star" size={16} color="#F59E0B" />
              <AppText variant={Variant.bodyMedium} style={styles.reviewSummaryText}>
                {candidate.reviewSummary.average.toFixed(1)} / 5
                {typeof candidate.reviewSummary.count === 'number' ? ` • ${candidate.reviewSummary.count} reviews` : ''}
              </AppText>
            </View>
          ) : null}
          {candidate.reviews.slice(0, 5).map((r, index) => (
            <View key={`${r.reviewer || 'reviewer'}-${index}`} style={index > 0 ? styles.reviewItemSpacing : null}>
              <View style={styles.reviewHeader}>
                <AppText variant={Variant.bodyMedium} style={styles.reviewReviewer}>{r.reviewer}</AppText>
                {typeof r.rating === 'number' ? (
                  <View style={styles.reviewRating}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="star" size={14} color="#F59E0B" />
                    <AppText variant={Variant.caption} style={styles.reviewRatingText}>{r.rating.toFixed(1)}</AppText>
                  </View>
                ) : null}
              </View>
              {r.comment ? <AppText variant={Variant.body} style={styles.reviewComment}>{r.comment}</AppText> : null}
              {r.date ? <AppText variant={Variant.caption} style={styles.reviewMeta}>{r.date}</AppText> : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* References */}
      {Array.isArray(candidate.references) && candidate.references.length > 0 ? (
        <View style={styles.card}>
          <SectionHeader icon="call-outline" title="References" />
          <View style={styles.divider} />
          {candidate.references.map((ref, index) => (
            <View key={`${ref.name || 'ref'}-${index}`} style={index > 0 ? styles.infoRowSpacing : null}>
              <AppText variant={Variant.bodyMedium} style={styles.refName}>{ref.name}</AppText>
              <AppText variant={Variant.caption} style={styles.refMeta}>
                {ref.relationship}{ref.contact ? ` • ${ref.contact}` : ''}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}

      {/* Screen-specific actions (passed as children) */}
      {children}
    </>
  )
}

/* ── Small helper sub-components ── */

const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={20} color={colors.primary} />
    <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>{title}</AppText>
  </View>
)

const InfoField = ({ label, value, icon }) => (
  <View style={[styles.infoRow, styles.infoRowSpacing]}>
    <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={16} color={colors.gray} />
    <View style={styles.infoContent}>
      <AppText variant={Variant.caption} style={styles.infoLabel}>{label}</AppText>
      <AppText variant={Variant.body} style={styles.infoValue}>{value}</AppText>
    </View>
  </View>
)

export default CandidateProfileView

/* ── Styles ── */

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  avatar: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    marginRight: wp(4),
    borderWidth: 3,
    borderColor: '#F0F0F0',
  },
  avatarPlaceholder: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(4),
    borderWidth: 3,
    borderColor: '#F0F0F0',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: getFontSize(28),
    fontWeight: '700',
  },
  profileInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  name: {
    fontSize: getFontSize(22),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.8),
  },
  meta: {
    marginLeft: wp(1.5),
    color: colors.gray,
    fontSize: getFontSize(13),
  },
  matchedFor: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: getFontSize(12),
    marginTop: hp(0.5),
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: hp(3),
    marginBottom: hp(0.4),
  },
  badgePillText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: getFontSize(11),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: wp(2),
  },
  statBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9E6',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    gap: wp(2),
  },
  statText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: getFontSize(13),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: '700',
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
  },
  infoRowSpacing: { marginTop: hp(1.5) },
  infoContent: { flex: 1 },
  infoLabel: {
    color: colors.gray,
    fontSize: getFontSize(11),
    fontWeight: '500',
    marginBottom: hp(0.3),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    flex: 1,
  },
  infoValue: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    lineHeight: getFontSize(20),
  },
  payRate: {
    fontWeight: '600',
    color: colors.primary,
    fontSize: getFontSize(15),
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(0.5),
  },
  skillTag: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: '#E0EFFF',
  },
  skillText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: getFontSize(12),
  },
  bioText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    lineHeight: getFontSize(22),
  },
  historyItemSpacing: { marginTop: hp(1.5) },
  historyRole: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: getFontSize(14),
  },
  historyMeta: {
    color: colors.gray,
    marginTop: hp(0.2),
    marginBottom: hp(0.6),
  },
  historySummary: {
    color: colors.secondary,
    fontSize: getFontSize(13),
    lineHeight: getFontSize(19),
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(3),
    flex: 1,
    paddingRight: wp(3),
  },
  docTitle: { color: colors.secondary, fontWeight: '600' },
  docMeta: { color: colors.gray, marginTop: hp(0.2) },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    backgroundColor: '#EFF6FF',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  verifiedText: { color: '#1D4ED8', fontWeight: '600' },
  reviewSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  reviewSummaryText: { color: colors.secondary, fontWeight: '700' },
  reviewItemSpacing: {
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.6),
  },
  reviewReviewer: {
    color: colors.secondary,
    fontWeight: '700',
    flex: 1,
    paddingRight: wp(2),
  },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: wp(1) },
  reviewRatingText: { color: colors.secondary, fontWeight: '600' },
  reviewComment: {
    color: colors.secondary,
    fontSize: getFontSize(13),
    lineHeight: getFontSize(19),
  },
  reviewMeta: { color: colors.gray, marginTop: hp(0.6) },
  refName: { color: colors.secondary, fontWeight: '700' },
  refMeta: { color: colors.gray, marginTop: hp(0.3) },
})
