import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import { colors, getFontSize, hp, wp } from '@/theme';
import {
  selectQuickMatchesByJobId,
  selectQuickOffers,
  sendQuickOffer,
} from '@/store/quickSearchSlice';
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { screenNames } from '@/navigation/screenNames';

const QuickSearchCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId } = route.params || {};
  const dispatch = useDispatch();
  const matches = useSelector(state => selectQuickMatchesByJobId(state, jobId));
  const allOffers = useSelector(selectQuickOffers);
  const acceptanceRatings = useSelector(state => state.quickSearch.acceptanceRatings);
  
  // Find candidate in matches first, then fall back to DUMMY_JOB_SEEKERS
  const candidate = useMemo(() => {
    // First try to find in matches
    let foundCandidate = matches.find(match => match.id === candidateId);
    
    if (foundCandidate) {
      return foundCandidate;
    }
    
    // If not found in matches, get from DUMMY_JOB_SEEKERS
    const baseCandidate = DUMMY_JOB_SEEKERS.find(js => js.id === candidateId);
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
    };
  }, [matches, candidateId, jobId, allOffers, acceptanceRatings]);
  
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
          title="Candidate Profile"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AppText variant={Variant.title} style={styles.name}>
            {candidate.name}
          </AppText>
          <AppText variant={Variant.caption} style={styles.meta}>
            {candidate.location} {candidate.badge ? `• ${candidate.badge} badge` : ''}
          </AppText>
          <View style={styles.badges}>
            <View style={styles.matchBadge}>
              <AppText variant={Variant.caption} style={styles.badgeText}>
                {candidate.matchPercentage}% match
              </AppText>
            </View>
            <View style={styles.ratingBadge}>
              <AppText variant={Variant.caption} style={styles.badgeText}>
                {candidate.acceptanceRating}% rating
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Experience & Skills
          </AppText>
          <AppText variant={Variant.caption}>
            {candidate.experienceYears}+ years
            {candidate.industries?.length
              ? ` • Industries: ${candidate.industries.join(', ')}`
              : ''}
          </AppText>
          {candidate.preferredRoles?.length ? (
            <AppText variant={Variant.caption} style={styles.sectionText}>
              Preferred roles: {candidate.preferredRoles.join(', ')}
            </AppText>
          ) : null}
          {candidate.skills?.length ? (
            <AppText variant={Variant.caption} style={styles.sectionText}>
              Skills: {candidate.skills.join(', ')}
            </AppText>
          ) : null}
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Availability
          </AppText>
          {candidate.availability?.summary ? (
            <AppText variant={Variant.caption}>
              {candidate.availability.summary}
            </AppText>
          ) : null}
          <AppText variant={Variant.caption} style={styles.sectionText}>
            Radius: {candidate.radiusKm} km
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Qualifications
          </AppText>
          {candidate.qualifications?.length ? (
            <AppText variant={Variant.caption}>
              {candidate.qualifications.join(', ')}
            </AppText>
          ) : null}
          {candidate.education ? (
            <AppText variant={Variant.caption} style={styles.sectionText}>
              Education: {candidate.education}
            </AppText>
          ) : null}
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Preferences
          </AppText>
          {candidate.taxTypes?.length ? (
            <AppText variant={Variant.caption}>
              Tax types: {candidate.taxTypes.join(', ')}
            </AppText>
          ) : null}
          {candidate.payPreference ? (
            <AppText variant={Variant.caption} style={styles.sectionText}>
              Pay: ${candidate.payPreference.min}-{candidate.payPreference.max}/hr
            </AppText>
          ) : null}
          {candidate.languages?.length ? (
            <AppText variant={Variant.caption} style={styles.sectionText}>
              Languages: {candidate.languages.join(', ')}
            </AppText>
          ) : null}
        </View>

        {candidate.bio ? (
          <View style={styles.card}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Bio
            </AppText>
            <AppText variant={Variant.caption}>{candidate.bio}</AppText>
          </View>
        ) : null}

        <View style={styles.footerActions}>
          <AppButton
            text="Send Offer"
            onPress={() => setOfferModal(true)}
            bgColor={colors.primary}
            textColor="#FFF"
          />
          <AppButton
            text="Back to matches"
            onPress={() =>
              navigation.navigate(screenNames.QUICK_SEARCH_MATCH_LIST, { jobId })
            }
            bgColor={colors.black}
            textColor={colors.black}
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
    backgroundColor: colors.background || '#F5F6FA',
  },
  content: {
    padding: wp(5),
    gap: hp(1.5),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  name: {
    fontSize: getFontSize(20),
    fontWeight: '700',
  },
  meta: {
    marginTop: hp(0.5),
    color: colors.gray,
  },
  badges: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(1),
  },
  matchBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: hp(1.5),
  },
  ratingBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: hp(1.5),
  },
  badgeText: {
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: hp(0.5),
  },
  sectionText: {
    marginTop: hp(0.5),
    color: colors.gray,
  },
  footerActions: {
    marginTop: hp(2),
    gap: hp(1),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
});


