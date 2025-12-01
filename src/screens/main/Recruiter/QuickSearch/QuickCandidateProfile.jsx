import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, getFontSize, hp, wp } from '@/theme';
import { 
  selectQuickMatchesByJobId,
  selectQuickOffersByJobId,
} from '@/store/quickSearchSlice';

const QuickCandidateProfile = ({ route, navigation }) => {
  const { jobId, candidateId } = route.params || {};
  const matches = useSelector(state => selectQuickMatchesByJobId(state, jobId));
  const offers = useSelector(state => selectQuickOffersByJobId(state, jobId));
  
  const candidate = useMemo(
    () => matches.find(match => match.id === candidateId),
    [matches, candidateId],
  );
  
  const offer = useMemo(
    () => offers.find(o => o.candidateId === candidateId),
    [offers, candidateId],
  );

  const getOfferStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#10B981';
      case 'declined':
        return '#EF4444';
      case 'expired':
        return '#6B7280';
      case 'pending':
      default:
        return '#F59E0B';
    }
  };

  const getOfferStatusLabel = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'expired':
        return 'Expired';
      case 'pending':
      default:
        return 'Pending';
    }
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
        {/* Profile Header */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <AppText variant={Variant.title} style={styles.avatarText}>
                {candidate.name?.charAt(0)?.toUpperCase() || 'U'}
              </AppText>
            </View>
            <View style={styles.profileInfo}>
              <AppText variant={Variant.title} style={styles.name}>
                {candidate.name}
              </AppText>
              <AppText variant={Variant.caption} style={styles.meta}>
                {candidate.location || candidate.suburb} • {candidate.badge} badge
              </AppText>
            </View>
          </View>
          
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

          {/* Offer Status */}
          {offer && (
            <View style={styles.offerStatusSection}>
              <View style={styles.offerStatusHeader}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName={offer.autoSent ? "flash" : "send"}
                  size={16}
                  color={getOfferStatusColor(offer.status)}
                />
                <AppText variant={Variant.bodyMedium} style={styles.offerStatusTitle}>
                  Offer Status
                </AppText>
              </View>
              <View style={[styles.offerStatusBadge, { backgroundColor: `${getOfferStatusColor(offer.status)}20` }]}>
                <View style={[styles.offerStatusDot, { backgroundColor: getOfferStatusColor(offer.status) }]} />
                <AppText variant={Variant.body} style={[styles.offerStatusText, { color: getOfferStatusColor(offer.status) }]}>
                  {getOfferStatusLabel(offer.status)}
                </AppText>
              </View>
              {offer.autoSent && (
                <AppText variant={Variant.caption} style={styles.autoSentNote}>
                  Offer was automatically sent on {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : ''}
                </AppText>
              )}
              {offer.message && (
                <AppText variant={Variant.caption} style={styles.offerMessage}>
                  {offer.message}
                </AppText>
              )}
            </View>
          )}
        </View>

        {/* Experience & Skills */}
        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Experience & Skills
          </AppText>
          <View style={styles.infoRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={16}
              color={colors.primary}
            />
            <AppText variant={Variant.caption} style={styles.sectionText}>
              {candidate.experienceYears || 0}+ years experience
            </AppText>
          </View>
          {candidate.industries && candidate.industries.length > 0 && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="business-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.caption} style={styles.sectionText}>
                Industries: {candidate.industries.join(', ')}
              </AppText>
            </View>
          )}
          {candidate.preferredRoles && candidate.preferredRoles.length > 0 && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="person-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.caption} style={styles.sectionText}>
                Preferred roles: {candidate.preferredRoles.join(', ')}
              </AppText>
            </View>
          )}
          {candidate.skills && candidate.skills.length > 0 && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="construct-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.caption} style={styles.sectionText}>
                Skills: {candidate.skills.join(', ')}
              </AppText>
            </View>
          )}
        </View>

        {/* Payment & Availability */}
        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Payment & Availability
          </AppText>
          {candidate.payPreference && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="cash-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.caption} style={styles.sectionText}>
                ${candidate.payPreference.min || 0} - ${candidate.payPreference.max || 0}/hr
              </AppText>
            </View>
          )}
          {candidate.taxTypes && candidate.taxTypes.length > 0 && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="document-text-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.caption} style={styles.sectionText}>
                Tax types: {candidate.taxTypes.join(', ')}
              </AppText>
            </View>
          )}
          {candidate.availability?.summary && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="time-outline"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.caption} style={styles.sectionText}>
                {candidate.availability.summary}
              </AppText>
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Location
          </AppText>
          <View style={styles.infoRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="location-outline"
              size={16}
              color={colors.primary}
            />
            <AppText variant={Variant.caption} style={styles.sectionText}>
              {candidate.location || candidate.suburb || 'Location not specified'}
            </AppText>
          </View>
          {candidate.radiusKm && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="radio-button-on"
                size={16}
                color={colors.primary}
              />
              <AppText variant={Variant.caption} style={styles.sectionText}>
                Willing to travel: {candidate.radiusKm} km
              </AppText>
            </View>
          )}
        </View>

        {/* Bio */}
        {candidate.bio && (
          <View style={styles.card}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              About
            </AppText>
            <AppText variant={Variant.caption} style={styles.bioText}>
              {candidate.bio}
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default QuickCandidateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  avatarContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: getFontSize(24),
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  meta: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  badges: {
    flexDirection: 'row',
    gap: wp(2),
    marginBottom: hp(1),
  },
  matchBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(2),
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(2),
  },
  badgeText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: colors.secondary,
  },
  offerStatusSection: {
    marginTop: hp(2),
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  offerStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  offerStatusTitle: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.secondary,
  },
  offerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: hp(1.5),
    alignSelf: 'flex-start',
  },
  offerStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  offerStatusText: {
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  autoSentNote: {
    fontSize: getFontSize(11),
    color: colors.gray,
    marginTop: hp(0.5),
    fontStyle: 'italic',
  },
  offerMessage: {
    fontSize: getFontSize(12),
    color: colors.secondary,
    marginTop: hp(1),
    padding: wp(3),
    backgroundColor: '#F9FAFB',
    borderRadius: hp(1),
  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: hp(1.5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  sectionText: {
    fontSize: getFontSize(13),
    color: colors.secondary,
    flex: 1,
  },
  bioText: {
    fontSize: getFontSize(13),
    color: colors.secondary,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(5),
  },
});

