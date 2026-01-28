import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import FastImageView from '@/core/FastImageView';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { Images } from '@/assets';
import { colors, getFontSize, hp, wp } from '@/theme';
import { selectManualJobById, selectManualMatchesByJobId, selectManualOffers } from '@/store/manualOffersSlice';
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { sendManualOffer } from '@/store/manualOffersSlice';
import { screenNames } from '@/navigation/screenNames';

const computeIsVerified = (candidate) => {
  const docs = candidate?.documents;
  if (!Array.isArray(docs)) return false;
  return docs.some(d => (d?.type === 'ID' || d?.type === 'Photo ID') && d?.verified);
};

const ManualCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId } = route.params || {};
  const dispatch = useDispatch();
  const job = useSelector(state => selectManualJobById(state, jobId));
  const matches = useSelector(state => selectManualMatchesByJobId(state, jobId));
  const allOffers = useSelector(selectManualOffers);
  const acceptanceRatings = useSelector(state => state.manualOffers.acceptanceRatings);
  
  const acceptedOffer = useMemo(() => {
    if (!jobId || !candidateId) return null;
    return allOffers.find(o => o.jobId === jobId && o.candidateId === candidateId && o.status === 'accepted') || null;
  }, [allOffers, jobId, candidateId]);

  // Merge base candidate details (resume/docs/reviews) with match snapshot (match %, computed fields)
  const candidate = useMemo(() => {
    const baseCandidate = DUMMY_JOB_SEEKERS.find(js => js.id === candidateId) || null;
    const foundCandidate = matches.find(match => match.id === candidateId) || null;

    if (!baseCandidate && !foundCandidate) return null;

    const offer = allOffers.find(o => o.candidateId === candidateId && o.jobId === jobId) || null;
    const matchPercentage = offer?.matchPercentage ?? foundCandidate?.matchPercentage ?? 0;
    const acceptanceRating =
      offer?.acceptanceRating ??
      acceptanceRatings[candidateId] ??
      foundCandidate?.acceptanceRating ??
      baseCandidate?.acceptanceRating ??
      0;

    const merged = {
      ...(baseCandidate || {}),
      ...(foundCandidate || {}),
      matchPercentage,
      acceptanceRating,
    };

    return {
      ...merged,
      isVerified: typeof merged.isVerified === 'boolean' ? merged.isVerified : computeIsVerified(merged),
    };
  }, [matches, candidateId, jobId, allOffers, acceptanceRatings]);
  
  const [offerModal, setOfferModal] = useState(false);

  const handleSendOffer = ({ expiresAt, message }) => {
    dispatch(
      sendManualOffer({
        jobId,
        candidateId,
        expiresAt,
        message,
      }),
    );
    showToast('Offer sent successfully', 'Success', toastTypes.success);
    navigation.navigate(screenNames.MANUAL_OFFERS);
  };

  const handleContact = () => {
    if (!candidate || !jobId || !job) return;
    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        jobId,
        name: candidate.name,
        jobTitle: job.title,
        jobType: 'manual',
        otherUserId: candidate.id,
      },
    });
  };

  if (!candidate) {
    return (
      <View style={styles.container}>
        <AppHeader title="Candidate Profile" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <AppText variant={Variant.body}>
            Candidate not found. Please return to the match list.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Candidate Profile"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
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
                  {candidate.name}
                </AppText>
                {candidate.isVerified ? (
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="checkmark-circle"
                    size={18}
                    color="#3B82F6"
                    style={styles.verifiedIcon}
                  />
                ) : null}
              </View>
              <View style={styles.locationRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="location-outline"
                  size={14}
                  color={colors.gray}
                />
                <AppText variant={Variant.caption} style={styles.meta}>
                  {candidate.suburb ? `${candidate.suburb}, ` : ''}{candidate.location}
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
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="stats-chart"
                size={16}
                color="#F59E0B"
              />
              <AppText variant={Variant.bodyMedium} style={styles.statText}>
                {candidate.matchPercentage}% Match
              </AppText>
            </View>
            <View style={styles.statBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="star"
                size={16}
                color="#F59E0B"
              />
              <AppText variant={Variant.bodyMedium} style={styles.statText}>
                {candidate.acceptanceRating}% Acceptance
              </AppText>
            </View>
            {typeof candidate.reviewSummary?.average === 'number' ? (
              <View style={styles.statBadge}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="chatbubbles-outline"
                  size={16}
                  color="#10B981"
                />
                <AppText variant={Variant.bodyMedium} style={styles.statText}>
                  {candidate.reviewSummary.average.toFixed(1)} / 5
                </AppText>
              </View>
            ) : null}
          </View>
        </View>

        {/* Experience & Skills */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Experience & Skills
            </AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={16}
              color={colors.gray}
            />
            <AppText variant={Variant.body} style={styles.infoText}>
              {candidate.experienceYears}+ years experience
            </AppText>
          </View>
          {candidate.industries?.length ? (
            <View style={[styles.infoRow, styles.infoRowSpacing]}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="business-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Industries
                </AppText>
                <AppText variant={Variant.body} style={styles.infoValue}>
                  {candidate.industries.join(', ')}
                </AppText>
              </View>
            </View>
          ) : null}
          {candidate.preferredRoles?.length ? (
            <View style={[styles.infoRow, styles.infoRowSpacing]}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="person-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Preferred Roles
                </AppText>
                <AppText variant={Variant.body} style={styles.infoValue}>
                  {candidate.preferredRoles.join(', ')}
                </AppText>
              </View>
            </View>
          ) : null}
          {candidate.skills?.length ? (
            <View style={[styles.infoRow, styles.infoRowSpacing]}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="checkmark-circle-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Skills
                </AppText>
                <View style={styles.skillsContainer}>
                  {candidate.skills.map((skill, index) => (
                    <View key={`${skill}-${index}`} style={styles.skillTag}>
                      <AppText variant={Variant.caption} style={styles.skillText}>
                        {skill}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : null}
        </View>

        {/* Availability */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="calendar-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Availability
            </AppText>
          </View>
          <View style={styles.divider} />
          {candidate.availability?.summary ? (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="time-outline"
                size={16}
                color={colors.gray}
              />
              <AppText variant={Variant.body} style={styles.infoText}>
                {candidate.availability.summary}
              </AppText>
            </View>
          ) : null}
          <View style={[styles.infoRow, styles.infoRowSpacing]}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="location-outline"
              size={16}
              color={colors.gray}
            />
            <AppText variant={Variant.body} style={styles.infoText}>
              Service radius: {candidate.radiusKm} km
              {job?.rangeKm ? ` • Job range: ${job.rangeKm} km` : ''}
            </AppText>
          </View>
        </View>

        {/* Qualifications */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="school-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Qualifications & Licenses
            </AppText>
          </View>
          <View style={styles.divider} />
          {candidate.qualifications?.length ? (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="document-text-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Certifications
                </AppText>
                {candidate.qualifications.map((qual, index) => (
                  <AppText key={`${qual}-${index}`} variant={Variant.body} style={styles.infoValue}>
                    • {qual}
                  </AppText>
                ))}
              </View>
            </View>
          ) : null}
          {candidate.education ? (
            <View style={[styles.infoRow, styles.infoRowSpacing]}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="library-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Education
                </AppText>
                <AppText variant={Variant.body} style={styles.infoValue}>
                  {candidate.education}
                </AppText>
              </View>
            </View>
          ) : null}
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="settings-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Preferences
            </AppText>
          </View>
          <View style={styles.divider} />
          {candidate.payPreference ? (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="cash-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Pay Rate
                </AppText>
                <AppText variant={Variant.body} style={[styles.infoValue, styles.payRate]}>
                  ${candidate.payPreference.min} - ${candidate.payPreference.max}/hr
                </AppText>
              </View>
            </View>
          ) : null}
          {candidate.taxTypes?.length ? (
            <View style={[styles.infoRow, styles.infoRowSpacing]}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="receipt-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Tax Types
                </AppText>
                <AppText variant={Variant.body} style={styles.infoValue}>
                  {candidate.taxTypes.join(', ')}
                </AppText>
              </View>
            </View>
          ) : null}
          {candidate.languages?.length ? (
            <View style={[styles.infoRow, styles.infoRowSpacing]}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="language-outline"
                size={16}
                color={colors.gray}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Languages
                </AppText>
                <AppText variant={Variant.body} style={styles.infoValue}>
                  {candidate.languages.join(', ')}
                </AppText>
              </View>
            </View>
          ) : null}
        </View>

        {/* About */}
        {candidate.bio ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="person-circle-outline"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                About
              </AppText>
            </View>
            <View style={styles.divider} />
            <AppText variant={Variant.body} style={styles.bioText}>
              {candidate.bio}
            </AppText>
          </View>
        ) : null}

        {/* Work History */}
        {Array.isArray(candidate.workHistory) && candidate.workHistory.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="reader-outline"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Work History
              </AppText>
            </View>
            <View style={styles.divider} />
            {candidate.workHistory.map((item, index) => (
              <View
                key={`${item.company || 'company'}-${index}`}
                style={index > 0 ? styles.historyItemSpacing : null}
              >
                <AppText variant={Variant.bodyMedium} style={styles.historyRole}>
                  {item.role}
                </AppText>
                <AppText variant={Variant.caption} style={styles.historyMeta}>
                  {item.company}
                  {item.period ? ` • ${item.period}` : ''}
                </AppText>
                {item.summary ? (
                  <AppText variant={Variant.body} style={styles.historySummary}>
                    {item.summary}
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Documents */}
        {Array.isArray(candidate.documents) && candidate.documents.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="document-text-outline"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Documents
              </AppText>
            </View>
            <View style={styles.divider} />
            {candidate.documents.map((doc, index) => (
              <View
                key={`${doc.type || 'doc'}-${index}`}
                style={[styles.docRow, index > 0 ? styles.infoRowSpacing : null]}
              >
                <View style={styles.docLeft}>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="attach-outline"
                    size={16}
                    color={colors.gray}
                  />
                  <View style={styles.infoContent}>
                    <AppText variant={Variant.bodyMedium} style={styles.docTitle}>
                      {doc.title}
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.docMeta}>
                      {doc.type}
                    </AppText>
                  </View>
                </View>
                {doc.verified ? (
                  <View style={styles.verifiedPill}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="checkmark-circle"
                      size={14}
                      color="#3B82F6"
                    />
                    <AppText variant={Variant.caption} style={styles.verifiedText}>
                      Verified
                    </AppText>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Reviews */}
        {Array.isArray(candidate.reviews) && candidate.reviews.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chatbubbles-outline"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Ratings & Reviews
              </AppText>
            </View>
            <View style={styles.divider} />
            {typeof candidate.reviewSummary?.average === 'number' ? (
              <View style={styles.reviewSummaryRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="star"
                  size={16}
                  color="#F59E0B"
                />
                <AppText variant={Variant.bodyMedium} style={styles.reviewSummaryText}>
                  {candidate.reviewSummary.average.toFixed(1)} / 5
                  {typeof candidate.reviewSummary.count === 'number'
                    ? ` • ${candidate.reviewSummary.count} reviews`
                    : ''}
                </AppText>
              </View>
            ) : null}
            {candidate.reviews.slice(0, 5).map((r, index) => (
              <View key={`${r.reviewer || 'reviewer'}-${index}`} style={index > 0 ? styles.reviewItemSpacing : null}>
                <View style={styles.reviewHeader}>
                  <AppText variant={Variant.bodyMedium} style={styles.reviewReviewer}>
                    {r.reviewer}
                  </AppText>
                  {typeof r.rating === 'number' ? (
                    <View style={styles.reviewRating}>
                      <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="star"
                        size={14}
                        color="#F59E0B"
                      />
                      <AppText variant={Variant.caption} style={styles.reviewRatingText}>
                        {r.rating.toFixed(1)}
                      </AppText>
                    </View>
                  ) : null}
                </View>
                {r.comment ? (
                  <AppText variant={Variant.body} style={styles.reviewComment}>
                    {r.comment}
                  </AppText>
                ) : null}
                {r.date ? (
                  <AppText variant={Variant.caption} style={styles.reviewMeta}>
                    {r.date}
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* References */}
        {Array.isArray(candidate.references) && candidate.references.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="call-outline"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                References
              </AppText>
            </View>
            <View style={styles.divider} />
            {candidate.references.map((ref, index) => (
              <View key={`${ref.name || 'ref'}-${index}`} style={index > 0 ? styles.infoRowSpacing : null}>
                <AppText variant={Variant.bodyMedium} style={styles.refName}>
                  {ref.name}
                </AppText>
                <AppText variant={Variant.caption} style={styles.refMeta}>
                  {ref.relationship}
                  {ref.contact ? ` • ${ref.contact}` : ''}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.footerActions}>
          <AppButton
            text="Send Offer"
            onPress={() => setOfferModal(true)}
            bgColor={colors.primary}
            textColor="#FFF"
            style={styles.primaryButton}
          />
          {acceptedOffer ? (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContact}
              activeOpacity={0.85}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chatbubble-ellipses-outline"
                size={18}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.contactButtonText}>
                Contact / Chat
              </AppText>
            </TouchableOpacity>
          ) : null}
          <AppButton
            text="Back to Matches"
            onPress={() => navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId })}
            bgColor="#FFFFFF"
            textStyle={{ color: colors.primary }}
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>

      <SendManualOfferModal
        visible={offerModal}
        candidate={candidate}
        onClose={() => setOfferModal(false)}
        onSubmit={handleSendOffer}
      />
    </View>
  );
};

export default ManualCandidateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F6FA',
  },
  content: {
    padding: wp(4),
    paddingBottom: hp(4),
    gap: hp(2),
  },
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
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  verifiedIcon: {
    marginTop: hp(0.2),
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
    marginBottom: hp(1),
  },
  meta: {
    marginLeft: wp(1.5),
    color: colors.gray,
    fontSize: getFontSize(13),
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: hp(3),
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
  infoRowSpacing: {
    marginTop: hp(1.5),
  },
  infoContent: {
    flex: 1,
  },
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
  historyItemSpacing: {
    marginTop: hp(1.5),
  },
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
  docTitle: {
    color: colors.secondary,
    fontWeight: '600',
  },
  docMeta: {
    color: colors.gray,
    marginTop: hp(0.2),
  },
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
  verifiedText: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  reviewSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  reviewSummaryText: {
    color: colors.secondary,
    fontWeight: '700',
  },
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
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  reviewRatingText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  reviewComment: {
    color: colors.secondary,
    fontSize: getFontSize(13),
    lineHeight: getFontSize(19),
  },
  reviewMeta: {
    color: colors.gray,
    marginTop: hp(0.6),
  },
  refName: {
    color: colors.secondary,
    fontWeight: '700',
  },
  refMeta: {
    color: colors.gray,
    marginTop: hp(0.3),
  },
  footerActions: {
    marginTop: hp(1),
    gap: hp(1.5),
  },
  primaryButton: {
    borderRadius: hp(2),
    paddingVertical: hp(1.8),
  },
  secondaryButton: {
    borderRadius: hp(2),
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.6),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: wp(2),
  },
  contactButtonText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
});

