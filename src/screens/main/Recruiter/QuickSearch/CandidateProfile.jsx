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
import {
  selectQuickMatchesByJobId,
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

const QuickSearchCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId, squadId } = route.params || {};
  const dispatch = useDispatch();
  const matches = useSelector(state => selectQuickMatchesByJobId(state, jobId));
  const allOffers = useSelector(selectQuickOffers);
  const acceptanceRatings = useSelector(state => state.quickSearch.acceptanceRatings);
  
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
    
    // First try to find in matches
    let foundCandidate = matches.find(match => match.id === candidateId);
    
    if (foundCandidate) {
      return foundCandidate;
    }
    
    // If not found in matches, check DUMMY_JOB_SEEKERS first
    let baseCandidate = DUMMY_JOB_SEEKERS.find(js => js.id === candidateId);
    
    // If not found in job seekers, check DUMMY_CONTRACTORS
    if (!baseCandidate) {
      baseCandidate = DUMMY_CONTRACTORS.find(c => c.id === candidateId);
    }
    
    // If not found in contractors, check DUMMY_EMPLOYEES
    if (!baseCandidate) {
      baseCandidate = DUMMY_EMPLOYEES.find(e => e.id === candidateId);
    }
    
    if (!baseCandidate) {
      return null;
    }
    
    // Find offer to get matchPercentage and acceptanceRating
    const offer = allOffers.find(o => o.candidateId === candidateId && o.jobId === jobId);
    const matchPercentage = offer?.matchPercentage ?? 0;
    const acceptanceRating = offer?.acceptanceRating ?? acceptanceRatings[candidateId] ?? baseCandidate.acceptanceRating;
    
    // Build candidate snapshot similar to buildQuickCandidateSnapshot
    return {
      id: baseCandidate.id,
      name: baseCandidate.name,
      badge: baseCandidate.badge,
      avatar: baseCandidate.avatar,
      acceptanceRating,
      matchPercentage,
      location: baseCandidate.location,
      suburb: baseCandidate.suburb,
      radiusKm: baseCandidate.radiusKm,
      taxTypes: baseCandidate.taxTypes,
      languages: baseCandidate.languages,
      qualifications: baseCandidate.qualifications,
      education: baseCandidate.education,
      availability: baseCandidate.availability,
      payPreference: baseCandidate.payPreference,
      industries: baseCandidate.industries,
      preferredRoles: baseCandidate.preferredRoles,
      experienceYears: baseCandidate.experienceYears,
      bio: baseCandidate.bio,
      skills: baseCandidate.skills,
      abnNumber: baseCandidate.abnNumber, // Include ABN number if it's a contractor
      tfnNumber: baseCandidate.tfnNumber, // Include TFN number if it's an employee
      isSquad: false,
    };
  }, [matches, candidateId, jobId, allOffers, acceptanceRatings, isSquad, squad]);
  
  const [offerModal, setOfferModal] = useState(false);

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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
            {!candidate.isSquad && (
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
            )}
            {candidate.isSquad && candidate.squad && (
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
            {candidate.isSquad && candidate.squad && (
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

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              {candidate.isSquad ? 'Squad Details' : 'Experience & Skills'}
            </AppText>
          </View>
          <View style={styles.divider} />
          {candidate.isSquad ? (
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
          ) : (
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
          )}
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

        <View style={styles.footerActions}>
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

export default QuickSearchCandidateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F7FA',
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


