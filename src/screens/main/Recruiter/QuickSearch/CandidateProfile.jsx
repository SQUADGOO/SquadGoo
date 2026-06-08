import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import FastImageView from '@/core/FastImageView';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { Images } from '@/assets';
import { colors, getFontSize, hp, wp } from '@/theme';
import {
  selectQuickMatchesByJobId,
  selectQuickJobById,
  selectQuickOffers,
  sendQuickOffer,
} from '@/store/quickSearchSlice';
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';
import { DUMMY_SQUADS, getSquadWithMembers } from '@/utilities/dummySquads';
import { DUMMY_CONTRACTORS } from '@/utilities/dummyContractors';
import { DUMMY_EMPLOYEES } from '@/utilities/dummyEmployees';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { screenNames } from '@/navigation/screenNames';
import { scoreJobPostSuspicion } from '@/utilities/mediaModeration';
import CandidateProfileView from '@/components/Recruiter/CandidateProfileView';

const QuickSearchCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId, squadId, mode } = route.params || {};
  const dispatch = useDispatch();
  const matches = useSelector(state => selectQuickMatchesByJobId(state, jobId));
  const allOffers = useSelector(selectQuickOffers);
  const acceptanceRatings = useSelector(state => state.quickSearch.acceptanceRatings);
  const job = useSelector(state => (jobId ? selectQuickJobById(state, jobId) : null));

  const isWorkCoordination = mode === 'work_coordination';
  const isDeclinedReview = mode === 'declined_review';
  const isExpiredReview = mode === 'expired_review';
  const offerForContext = useMemo(
    () => allOffers.find(o => o.candidateId === candidateId && o.jobId === jobId) || null,
    [allOffers, candidateId, jobId],
  );
  const offerMeta = route?.params?.offerMeta || null;

  const formatDeclinedAt = (value) => {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDeclineReason = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const label = value?.label ? String(value.label) : '';
    const note = value?.note ? String(value.note) : '';
    return [label, note].filter(Boolean).join(' - ');
  };

  const formatExpiredAt = (value) => {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatExpiryReason = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const label = value?.label ? String(value.label) : '';
    const note = value?.note ? String(value.note) : '';
    return [label, note].filter(Boolean).join(' - ');
  };
  
  // Check if this is a squad profile
  const isSquad = !!squadId;
  
  // Load squad data if it's a squad
  const squad = useMemo(() => {
    if (!isSquad || !squadId) return null;
    return getSquadWithMembers(squadId);
  }, [isSquad, squadId]);
  
  // Find candidate in matches first, then fall back to DUMMY_JOB_SEEKERS
  const candidate = useMemo(() => {
    // If it's a squad, use squad data as candidate
    if (isSquad && squad) {
      return {
        id: squad.id,
        name: squad.name,
        badge: squad.badge,
        avatar: squad.avatar,
        acceptanceRating: squad.averageRating,
        matchPercentage: 0, // Squads don't have match percentage
        location: squad.location,
        suburb: squad.suburb,
        radiusKm: squad.radiusKm,
        taxTypes: [squad.taxType],
        languages: squad.languages,
        qualifications: [],
        education: '',
        availability: squad.availability,
        payPreference: squad.payPreference,
        industries: squad.preferredJobs,
        preferredRoles: squad.specialties,
        experienceYears: 0,
        bio: squad.description,
        skills: squad.specialties,
        isSquad: true,
        squad: squad, // Keep full squad data
      };
    }
    
    const getBaseCandidate = (id) => {
      return (
        DUMMY_JOB_SEEKERS.find(js => js.id === id) ||
        DUMMY_CONTRACTORS.find(c => c.id === id) ||
        DUMMY_EMPLOYEES.find(e => e.id === id) ||
        null
      );
    };

    const baseCandidate = getBaseCandidate(candidateId);
    const foundCandidate = matches.find(match => match.id === candidateId);

    if (!baseCandidate && !foundCandidate) return null;

    // Find offer to get matchPercentage and acceptanceRating
    const offer = allOffers.find(o => o.candidateId === candidateId && o.jobId === jobId);
    const matchPercentage = offer?.matchPercentage ?? foundCandidate?.matchPercentage ?? 0;
    const acceptanceRating =
      offer?.acceptanceRating ??
      acceptanceRatings[candidateId] ??
      foundCandidate?.acceptanceRating ??
      baseCandidate?.acceptanceRating ??
      0;

    // Merge base (resume/docs/reviews/etc) with match snapshot (match %, computed fields)
    const merged = {
      ...(baseCandidate || {}),
      ...(foundCandidate || {}),
      acceptanceRating,
      matchPercentage,
      isSquad: false,
    };

    return merged;
  }, [matches, candidateId, jobId, allOffers, acceptanceRatings, isSquad, squad]);
  
  const [offerModal, setOfferModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // for squad profile: 'profile' | 'media' | 'reviews'

  // Frontend-only Squad MEDIA (will be backed by API later)
  const [mediaDraft, setMediaDraft] = useState('');
  const [mediaPosts, setMediaPosts] = useState([]); // [{id, text, status:'published'|'pending', createdAt, moderation:{score,reasons}}]

  const handleMessage = () => {
    if (!candidateId) return;
    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        jobId,
        name: candidate?.name || offerForContext?.candidateName || 'Candidate',
        jobTitle: offerForContext?.jobTitle || job?.jobTitle || job?.title || 'Quick search job',
        jobType: 'quick',
        otherUserId: candidateId,
      },
    });
  };

  const handleTrackHours = () => {
    navigation.navigate(screenNames.CANDIDATE_HOURS, {
      job: job || {
        id: jobId,
        title: offerForContext?.jobTitle,
        jobTitle: offerForContext?.jobTitle,
      },
      candidate: {
        id: candidateId,
        name: candidate?.name || offerForContext?.candidateName,
      },
      mode: 'work_coordination',
    });
  };

  const handleSendOffer = ({ expiresAt, message }) => {
    dispatch(
      sendQuickOffer({
        jobId,
        candidateId,
        expiresAt,
        message,
        autoSent: false,
      }),
    );
    showToast('Offer sent successfully', 'Success', toastTypes.success);
    navigation.navigate(screenNames.QUICK_SEARCH_ACTIVE_OFFERS_RECRUITER, {
      jobId,
    });
  };

  if (!candidate) {
    return (
      <View style={styles.container}>
        <AppHeader
          title={isSquad ? "Squad Profile" : "Candidate Profile"}
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.emptyState}>
          <AppText variant={Variant.body}>
            {isSquad ? 'Squad not found.' : 'Candidate not found.'} Please return to the match list.
          </AppText>
        </View>
      </View>
    );
  }

  const profileTitle = candidate.isSquad ? "Squad Profile" : "Candidate Profile";

  return (
    <View style={styles.container}>
      <AppHeader
        title={profileTitle}
        showBackButton
        showTopIcons={false}
        onBackPress={() => navigation.goBack()}
      />
      {candidate.isSquad ? (
        <View style={styles.tabsBar}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('profile')}
            style={[styles.tabBtn, activeTab === 'profile' && styles.tabBtnActive]}
          >
            <AppText
              variant={Variant.bodyMedium}
              style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}
            >
              PROFILE
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('media')}
            style={[styles.tabBtn, activeTab === 'media' && styles.tabBtnActive]}
          >
            <AppText
              variant={Variant.bodyMedium}
              style={[styles.tabText, activeTab === 'media' && styles.tabTextActive]}
            >
              MEDIA
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('reviews')}
            style={[styles.tabBtn, activeTab === 'reviews' && styles.tabBtnActive]}
          >
            <AppText
              variant={Variant.bodyMedium}
              style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}
            >
              REVIEWS
            </AppText>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!candidate.isSquad || activeTab === 'profile' ? (
          <>
        {/* Expired summary (read-only) */}
        {isExpiredReview ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="hourglass-outline"
                size={20}
                color="#6B7280"
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Expired
              </AppText>
            </View>
            <View style={styles.divider} />
            {formatExpiredAt(offerMeta?.expiresAt || offerForContext?.expiresAt) ? (
              <View style={styles.infoRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="calendar-outline"
                  size={16}
                  color={colors.gray}
                />
                <View style={styles.infoContent}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>
                    Expired date
                  </AppText>
                  <AppText variant={Variant.body} style={styles.infoValue}>
                    {formatExpiredAt(offerMeta?.expiresAt || offerForContext?.expiresAt)}
                  </AppText>
                </View>
              </View>
            ) : null}

            {formatExpiryReason(offerMeta?.expiryReason || offerForContext?.response?.message) ? (
              <View style={[styles.infoRow, styles.infoRowSpacing]}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="chatbox-ellipses-outline"
                  size={16}
                  color={colors.gray}
                />
                <View style={styles.infoContent}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>
                    Expiry reason
                  </AppText>
                  <AppText variant={Variant.body} style={styles.infoValue}>
                    {formatExpiryReason(offerMeta?.expiryReason || offerForContext?.response?.message)}
                  </AppText>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Declined summary (read-only) */}
        {isDeclinedReview ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close-circle"
                size={20}
                color="#EF4444"
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Declined
              </AppText>
            </View>
            <View style={styles.divider} />
            {formatDeclinedAt(offerMeta?.declinedAt || offerForContext?.response?.declinedAt) ? (
              <View style={styles.infoRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="calendar-outline"
                  size={16}
                  color={colors.gray}
                />
                <View style={styles.infoContent}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>
                    Date declined
                  </AppText>
                  <AppText variant={Variant.body} style={styles.infoValue}>
                    {formatDeclinedAt(offerMeta?.declinedAt || offerForContext?.response?.declinedAt)}
                  </AppText>
                </View>
              </View>
            ) : null}

            {formatDeclineReason(offerMeta?.declineReason || offerForContext?.response?.reason) ? (
              <View style={[styles.infoRow, styles.infoRowSpacing]}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="chatbox-ellipses-outline"
                  size={16}
                  color={colors.gray}
                />
                <View style={styles.infoContent}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>
                    Decline reason
                  </AppText>
                  <AppText variant={Variant.body} style={styles.infoValue}>
                    {formatDeclineReason(offerMeta?.declineReason || offerForContext?.response?.reason)}
                  </AppText>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Profile – use shared component for individual candidates */}
        {!candidate.isSquad ? (
          <CandidateProfileView candidate={candidate}>
            <View style={styles.footerActions}>
              {isDeclinedReview || isExpiredReview ? (
                <AppButton text="Back" onPress={() => navigation.goBack()} bgColor="#FFFFFF" textStyle={{color: colors.primary}} style={styles.secondaryButton} />
              ) : isWorkCoordination ? (
                <>
                  <AppButton text="Message" onPress={handleMessage} bgColor={colors.primary} textColor="#FFF" style={styles.primaryButton} />
                  <AppButton text="Track Hours" onPress={handleTrackHours} bgColor="#FFFFFF" textStyle={{color: colors.primary}} style={styles.secondaryButton} />
                </>
              ) : (
                <>
                  <AppButton text="Send Offer" onPress={() => setOfferModal(true)} bgColor={colors.primary} textColor="#FFF" style={styles.primaryButton} />
                  <AppButton text="Back to Matches" onPress={() => navigation.goBack()} bgColor="#FFFFFF" textStyle={{color: colors.primary}} style={styles.secondaryButton} />
                </>
              )}
            </View>
          </CandidateProfileView>
        ) : (
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
              <AppText variant={Variant.title} style={styles.name}>
                {candidate.name}
              </AppText>
              <View style={styles.locationRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="location-outline"
                  size={14}
                  color={colors.gray}
                />
                <AppText variant={Variant.caption} style={styles.meta}>
                  {candidate.suburb}, {candidate.location}
                </AppText>
              </View>
              {candidate.badge && (
                <View style={styles.badgeContainer}>
                  <View style={[styles.badgePill, styles[candidate.badge.toLowerCase() + 'Badge']]}>
                    <AppText variant={Variant.caption} style={styles.badgePillText}>
                      {candidate.badge} Badge
                    </AppText>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.statsRow}>
            {candidate.squad && (
              <View style={styles.statBadge}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="people"
                  size={16}
                  color="#F59E0B"
                />
                <AppText variant={Variant.bodyMedium} style={styles.statText}>
                  {candidate.squad.memberCount} Member{candidate.squad.memberCount > 1 ? 's' : ''}
                </AppText>
              </View>
            )}
            <View style={styles.statBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="star"
                size={16}
                color="#F59E0B"
              />
              <AppText variant={Variant.bodyMedium} style={styles.statText}>
                {candidate.acceptanceRating}% Rating
              </AppText>
            </View>
            {candidate.squad && (
              <View style={styles.statBadge}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark-circle"
                  size={16}
                  color="#10B981"
                />
                <AppText variant={Variant.bodyMedium} style={styles.statText}>
                  {candidate.squad.completedProjects} Projects
                </AppText>
              </View>
            )}
          </View>
        </View>
        )}

        {/* Squad Members Section */}
        {candidate.isSquad && candidate.squad?.members?.length > 0 && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="people-outline"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Squad Members ({candidate.squad.memberCount})
              </AppText>
            </View>
            <View style={styles.divider} />
            {candidate.squad.members.map((member, index) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberRow,
                  index < candidate.squad.members.length - 1 && styles.memberRowBorder
                ]}
                onPress={() => {
                  navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
                    candidateId: member.id,
                    jobId,
                    source: 'squad_profile',
                  });
                }}
              >
                <View style={styles.memberInfo}>
                  {member.avatar ? (
                    <FastImageView
                      source={{ uri: member.avatar }}
                      style={styles.memberAvatar}
                      resizeMode="cover"
                      fallbackImage={Images.avatar}
                    />
                  ) : (
                    <View style={styles.memberAvatarPlaceholder}>
                      <AppText variant={Variant.bodyMedium} style={styles.memberAvatarText}>
                        {member.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AppText>
                    </View>
                  )}
                  <View style={styles.memberDetails}>
                    <AppText variant={Variant.bodyMedium} style={styles.memberName}>
                      {member.name}
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.memberRole}>
                      {member.preferredRoles?.[0] || 'General Worker'}
                    </AppText>
                    <View style={styles.memberMeta}>
                      <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="star"
                        size={12}
                        color="#F59E0B"
                      />
                      <AppText variant={Variant.caption} style={styles.memberRating}>
                        {(member.acceptanceRating / 10).toFixed(1)} • {member.experienceYears}+ years
                      </AppText>
                    </View>
                  </View>
                </View>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="chevron-forward"
                  size={18}
                  color={colors.gray}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Squad-only: detail sections (non-squad uses CandidateProfileView above) */}
        {candidate.isSquad ? (
        <>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Squad Details
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
              {candidate.squad?.experience || 'N/A'}
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
                  Job Categories
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
                    <View key={index} style={styles.skillTag}>
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
            </AppText>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="school-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Qualifications
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
                  <AppText key={index} variant={Variant.body} style={styles.infoValue}>
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
                <View style={styles.taxTypesContainer}>
                  {candidate.taxTypes.map((type, index) => (
                    <View key={index} style={styles.taxTypeTag}>
                      <AppText variant={Variant.caption} style={styles.taxTypeText}>
                        {type}
                      </AppText>
                    </View>
                  ))}
                </View>
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

        {/* Resume / Work History */}
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

        {/* Uploaded Documents */}
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

        {/* Ratings / Reviews */}
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
          {isDeclinedReview || isExpiredReview ? (
            <AppButton
              text="Back"
              onPress={() => navigation.goBack()}
              bgColor="#FFFFFF"
              textStyle={{color: colors.primary}}
              style={styles.secondaryButton}
            />
          ) : isWorkCoordination ? (
            <>
              <AppButton
                text="Message"
                onPress={handleMessage}
                bgColor={colors.primary}
                textColor="#FFF"
                style={styles.primaryButton}
              />
              <AppButton
                text="Track Hours"
                onPress={handleTrackHours}
                bgColor="#FFFFFF"
                textStyle={{color: colors.primary}}
                style={styles.secondaryButton}
              />
            </>
          ) : (
            <>
              <AppButton
                text="Send Offer"
                onPress={() => setOfferModal(true)}
                bgColor={colors.primary}
                textColor="#FFF"
                style={styles.primaryButton}
              />
              <AppButton
                text="Back to Matches"
                onPress={() =>
                  navigation.goBack()
                }
                bgColor="#FFFFFF"
                textStyle={{color: colors.primary}}
                style={styles.secondaryButton}
              />
            </>
          )}
        </View>
        </>
        ) : null}
          </>
        ) : activeTab === 'media' ? (
          <>
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="images-outline"
                  size={20}
                  color={colors.primary}
                />
                <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                  Media
                </AppText>
              </View>
              <View style={styles.divider} />
              <View style={styles.policyBanner}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="shield-checkmark-outline"
                  size={18}
                  color={colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <AppText variant={Variant.bodyMedium} style={styles.policyTitle}>
                    No job-post content allowed
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.policyText}>
                    Any post suspected to be a job advertisement will be blocked or sent to Pending until customer service verifies it.
                  </AppText>
                </View>
              </View>

              <AppText variant={Variant.caption} style={styles.inputLabel}>
                Create a post
              </AppText>
              <TextInput
                value={mediaDraft}
                onChangeText={setMediaDraft}
                placeholder="Share updates, photos, achievements... (no job ads)"
                placeholderTextColor="#9CA3AF"
                style={styles.postInput}
                multiline
              />
              <View style={styles.postActionsRow}>
                <AppButton
                  text="Publish"
                  bgColor={colors.primary}
                  textColor="#FFFFFF"
                  onPress={() => {
                    const text = String(mediaDraft || '').trim();
                    if (!text) return;

                    const moderation = scoreJobPostSuspicion(text);
                    const isSuspected = moderation.isSuspectedJobPost;

                    const nextPost = {
                      id: `post_${Date.now()}`,
                      text,
                      createdAt: new Date().toISOString(),
                      status: isSuspected ? 'pending' : 'published',
                      moderation,
                    };

                    setMediaPosts((prev) => [nextPost, ...(prev || [])]);
                    setMediaDraft('');

                    if (isSuspected) {
                      showToast(
                        'Your post looks like a job advertisement. It has been sent to Pending for verification.',
                        'Pending verification',
                        toastTypes.warning
                      );
                    } else {
                      showToast('Post published', 'Success', toastTypes.success);
                    }
                  }}
                  style={{ marginTop: hp(1.2) }}
                />
              </View>
            </View>

            {mediaPosts.length ? (
              mediaPosts.map((p) => (
                <View key={p.id} style={styles.card}>
                  <View style={styles.mediaPostHeader}>
                    <AppText variant={Variant.bodyMedium} style={styles.mediaPostStatus}>
                      {p.status === 'pending' ? 'PENDING' : 'PUBLISHED'}
                    </AppText>
                    {p.status === 'pending' ? (
                      <AppText variant={Variant.caption} style={styles.pendingHint}>
                        (customer service will verify)
                      </AppText>
                    ) : null}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setMediaPosts((prev) => (prev || []).filter((x) => x.id !== p.id))}
                      style={styles.deletePostBtn}
                    >
                      <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                  <AppText variant={Variant.body} style={styles.mediaPostText}>
                    {p.text}
                  </AppText>
                  {p.status === 'pending' && Array.isArray(p.moderation?.reasons) && p.moderation.reasons.length ? (
                    <View style={styles.moderationReasons}>
                      <AppText variant={Variant.caption} style={styles.moderationTitle}>
                        Why it was flagged
                      </AppText>
                      {p.moderation.reasons.slice(0, 3).map((r, idx) => (
                        <AppText key={`${p.id}_r_${idx}`} variant={Variant.caption} style={styles.moderationReason}>
                          - {r}
                        </AppText>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))
            ) : (
              <View style={styles.card}>
                <AppText variant={Variant.body} style={styles.comingSoonTitle}>
                  No posts yet
                </AppText>
                <AppText variant={Variant.caption} style={styles.comingSoonText}>
                  Posts will appear here once the Squad Group starts publishing updates.
                </AppText>
                <View style={styles.mediaActionsRow}>
                  <View style={styles.mediaActionChip}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="heart-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <AppText variant={Variant.caption} style={styles.mediaActionText}>
                      Like
                    </AppText>
                  </View>
                  <View style={styles.mediaActionChip}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="share-social-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <AppText variant={Variant.caption} style={styles.mediaActionText}>
                      Share
                    </AppText>
                  </View>
                  <View style={styles.mediaActionChip}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="chatbubble-ellipses-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <AppText variant={Variant.caption} style={styles.mediaActionText}>
                      Comment
                    </AppText>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.footerActions}>
              {isDeclinedReview || isExpiredReview ? (
                <AppButton
                  text="Back"
                  onPress={() => navigation.goBack()}
                  bgColor="#FFFFFF"
                  textStyle={{color: colors.primary}}
                  style={styles.secondaryButton}
                />
              ) : isWorkCoordination ? (
                <>
                  <AppButton
                    text="Message"
                    onPress={handleMessage}
                    bgColor={colors.primary}
                    textColor="#FFF"
                    style={styles.primaryButton}
                  />
                  <AppButton
                    text="Track Hours"
                    onPress={handleTrackHours}
                    bgColor="#FFFFFF"
                    textStyle={{color: colors.primary}}
                    style={styles.secondaryButton}
                  />
                </>
              ) : (
                <>
                  <AppButton
                    text="Send Offer"
                    onPress={() => setOfferModal(true)}
                    bgColor={colors.primary}
                    textColor="#FFF"
                    style={styles.primaryButton}
                  />
                  <AppButton
                    text="Back to Matches"
                    onPress={() =>
                      navigation.goBack()
                    }
                    bgColor="#FFFFFF"
                    textStyle={{color: colors.primary}}
                    style={styles.secondaryButton}
                  />
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="star-outline"
                  size={20}
                  color={colors.primary}
                />
                <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                  Reviews
                </AppText>
              </View>
              <View style={styles.divider} />

              {candidate.squad?.members?.some((m) => Array.isArray(m?.reviews) && m.reviews.length) ? (
                candidate.squad.members.flatMap((m) =>
                  (m?.reviews || []).map((r, idx) => ({
                    key: `${m.id}_${idx}`,
                    memberName: m.name,
                    reviewer: r.reviewer,
                    rating: r.rating,
                    comment: r.comment,
                    date: r.date,
                  }))
                ).map((r) => (
                  <View key={r.key} style={styles.reviewCard}>
                    <View style={styles.reviewRow}>
                      <View style={{ flex: 1 }}>
                        <AppText variant={Variant.bodyMedium} style={styles.reviewReviewer}>
                          {r.reviewer || 'Recruiter'}
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.reviewMeta}>
                          {r.memberName ? `For ${r.memberName}` : ''}
                          {r.date ? `${r.memberName ? ' • ' : ''}${r.date}` : ''}
                        </AppText>
                      </View>
                      <View style={styles.reviewRatingPill}>
                        <VectorIcons
                          name={iconLibName.Ionicons}
                          iconName="star"
                          size={14}
                          color="#F59E0B"
                        />
                        <AppText variant={Variant.caption} style={styles.reviewRatingText}>
                          {typeof r.rating === 'number' ? r.rating.toFixed(1) : r.rating || '—'}
                        </AppText>
                      </View>
                    </View>
                    {r.comment ? (
                      <AppText variant={Variant.body} style={styles.reviewComment}>
                        {r.comment}
                      </AppText>
                    ) : null}
                  </View>
                ))
              ) : (
                <>
                  <AppText variant={Variant.body} style={styles.comingSoonTitle}>
                    No reviews yet
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.comingSoonText}>
                    Reviews will appear here once recruiters leave feedback for squad members.
                  </AppText>
                </>
              )}
            </View>

            <View style={styles.footerActions}>
              {isDeclinedReview || isExpiredReview ? (
                <AppButton
                  text="Back"
                  onPress={() => navigation.goBack()}
                  bgColor="#FFFFFF"
                  textStyle={{color: colors.primary}}
                  style={styles.secondaryButton}
                />
              ) : (
                <AppButton
                  text="Back"
                  onPress={() => navigation.goBack()}
                  bgColor="#FFFFFF"
                  textStyle={{color: colors.primary}}
                  style={styles.secondaryButton}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>

      {!isWorkCoordination && !isDeclinedReview && !isExpiredReview ? (
        <SendManualOfferModal
          visible={offerModal}
          candidate={candidate}
          onClose={() => setOfferModal(false)}
          onSubmit={handleSendOffer}
        />
      ) : null}
    </View>
  );
};

export default QuickSearchCandidateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F7FA',
  },
  tabsBar: {
    flexDirection: 'row',
    marginHorizontal: wp(4),
    marginTop: hp(1),
    backgroundColor: '#FFFFFF',
    borderRadius: hp(1.6),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: hp(1.2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabBtnActive: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    color: colors.gray,
    fontWeight: '800',
    fontSize: getFontSize(12),
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: colors.primary,
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
    marginBottom: hp(0.5),
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
  comingSoonTitle: {
    marginTop: hp(1),
    color: colors.secondary,
    fontWeight: '800',
  },
  comingSoonText: {
    marginTop: hp(0.8),
    color: colors.gray,
    lineHeight: hp(2.1),
  },
  mediaActionsRow: {
    marginTop: hp(2),
    flexDirection: 'row',
    gap: wp(2),
    flexWrap: 'wrap',
  },
  mediaActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.9),
    borderRadius: 999,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaActionText: {
    color: colors.secondary,
    fontWeight: '700',
  },
  policyBanner: {
    flexDirection: 'row',
    gap: wp(2),
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    padding: wp(3),
    borderRadius: hp(1.6),
    marginTop: hp(1),
  },
  policyTitle: {
    color: colors.secondary,
    fontWeight: '800',
  },
  policyText: {
    marginTop: hp(0.3),
    color: colors.gray,
    lineHeight: hp(2.0),
  },
  inputLabel: {
    marginTop: hp(1.5),
    color: colors.gray,
    fontWeight: '700',
  },
  postInput: {
    marginTop: hp(0.8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: hp(1.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    minHeight: hp(10),
    color: colors.secondary,
    textAlignVertical: 'top',
  },
  postActionsRow: {
    marginTop: hp(0.5),
  },
  mediaPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  mediaPostStatus: {
    color: colors.secondary,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pendingHint: {
    color: colors.gray,
    flex: 1,
  },
  deletePostBtn: {
    marginLeft: 'auto',
    padding: wp(1),
  },
  mediaPostText: {
    marginTop: hp(1),
    color: colors.secondary,
    lineHeight: hp(2.2),
  },
  moderationReasons: {
    marginTop: hp(1.2),
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: hp(1.4),
    padding: wp(3),
  },
  moderationTitle: {
    color: colors.secondary,
    fontWeight: '800',
    marginBottom: hp(0.5),
  },
  moderationReason: {
    color: colors.gray,
    marginTop: hp(0.3),
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
  badgeContainer: {
    marginTop: hp(0.5),
  },
  badgePill: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: hp(3),
    alignSelf: 'flex-start',
  },
  badgePillText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: getFontSize(11),
  },
  bronzeBadge: {
    backgroundColor: '#CD7F32',
  },
  silverBadge: {
    backgroundColor: '#C0C0C0',
  },
  goldBadge: {
    backgroundColor: '#FFD700',
  },
  platinumBadge: {
    backgroundColor: '#E5E4E2',
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
  taxTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(0.5),
  },
  taxTypeTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
  },
  taxTypeText: {
    color: colors.secondary,
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
  reviewCard: {
    marginTop: hp(1.2),
    paddingTop: hp(1.2),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: wp(2),
    marginBottom: hp(0.8),
  },
  reviewRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: 999,
    backgroundColor: `${'#F59E0B'}15`,
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
    // paddingVertical: hp(1.8),
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  memberAvatarPlaceholder: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  memberAvatarText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '700',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: hp(0.2),
  },
  memberRole: {
    fontSize: getFontSize(12),
    color: colors.gray,
    marginBottom: hp(0.3),
  },
  memberMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  memberRating: {
    fontSize: getFontSize(11),
    color: colors.gray,
  },
});


