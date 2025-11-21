import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import { colors, getFontSize, hp, wp } from '@/theme';
import { selectManualMatchesByJobId } from '@/store/manualOffersSlice';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { useDispatch } from 'react-redux';
import { sendManualOffer } from '@/store/manualOffersSlice';
import { screenNames } from '@/navigation/screenNames';

const ManualCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId } = route.params || {};
  const dispatch = useDispatch();
  const matches = useSelector(state => selectManualMatchesByJobId(state, jobId));
  const candidate = useMemo(
    () => matches.find(match => match.id === candidateId),
    [matches, candidateId],
  );
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AppText variant={Variant.title} style={styles.name}>
            {candidate.name}
          </AppText>
          <AppText variant={Variant.caption} style={styles.meta}>
            {candidate.location} • {candidate.badge} badge
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
            {candidate.experienceYears}+ years • Industries: {candidate.industries.join(', ')}
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionText}>
            Preferred roles: {candidate.preferredRoles.join(', ')}
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionText}>
            Skills: {candidate.skills.join(', ')}
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Availability
          </AppText>
          <AppText variant={Variant.caption}>{candidate.availability?.summary}</AppText>
          <AppText variant={Variant.caption} style={styles.sectionText}>
            Radius: {candidate.radiusKm} km
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Qualifications
          </AppText>
          <AppText variant={Variant.caption}>
            {candidate.qualifications.join(', ')}
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionText}>
            Education: {candidate.education}
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Preferences
          </AppText>
          <AppText variant={Variant.caption}>
            Tax types: {candidate.taxTypes.join(', ')}
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionText}>
            Pay: ${candidate.payPreference?.min}-{candidate.payPreference?.max}/hr
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionText}>
            Languages: {candidate.languages.join(', ')}
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Bio
          </AppText>
          <AppText variant={Variant.caption}>{candidate.bio}</AppText>
        </View>

        <View style={styles.footerActions}>
          <AppButton
            text="Send Offer"
            onPress={() => setOfferModal(true)}
            bgColor={colors.primary}
            textColor="#FFF"
          />
          <AppButton
            text="Back to matches"
            onPress={() => navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId })}
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

export default ManualCandidateProfile;

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

