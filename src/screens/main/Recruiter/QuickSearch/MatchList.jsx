import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppDropDown from '@/core/AppDropDown';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, getFontSize, hp, wp } from '@/theme';
import { screenNames } from '@/navigation/screenNames';
import FastImageView from '@/core/FastImageView';
import { Images } from '@/assets';
import {
  selectQuickJobById,
  selectQuickMatchesByJobId,
  selectQuickOffers,
} from '@/store/quickSearchSlice';
import { sendQuickOffer } from '@/store/quickSearchSlice';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const matchFilterOptions = [
  { label: 'All', value: 0 },
  { label: '70%+ Match', value: 70 },
  { label: '80%+ Match', value: 80 },
  { label: '90%+ Match', value: 90 },
];

const ratingFilterOptions = [
  { label: 'All', value: 0 },
  { label: '70%+ Rating', value: 70 },
  { label: '80%+ Rating', value: 80 },
  { label: '90%+ Rating', value: 90 },
];

const QuickSearchMatchList = ({ route, navigation }) => {
  const { jobId } = route.params || {};
  const dispatch = useDispatch();
  const job = useSelector(state => selectQuickJobById(state, jobId));
  const matches = useSelector(state => selectQuickMatchesByJobId(state, jobId));
  const offers = useSelector(selectQuickOffers);

  const [matchThreshold, setMatchThreshold] = useState(0);
  const [ratingThreshold, setRatingThreshold] = useState(0);
  const [matchDropdownVisible, setMatchDropdownVisible] = useState(false);
  const [ratingDropdownVisible, setRatingDropdownVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filteredMatches = useMemo(
    () =>
      matches.filter(
        match =>
          match.matchPercentage >= matchThreshold &&
          (match.acceptanceRating ?? 0) >= ratingThreshold,
      ),
    [matches, matchThreshold, ratingThreshold],
  );

  const handleOpenOfferModal = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleSendOffer = ({ expiresAt, message }) => {
    if (!jobId || !selectedCandidate) return;

    dispatch(
      sendQuickOffer({
        jobId,
        candidateId: selectedCandidate.id,
        expiresAt,
        message,
        autoSent: false,
      }),
    );

    showToast('Offer sent successfully', 'Success', toastTypes.success);
    setSelectedCandidate(null);
  };

  const canContactCandidate = (candidateId) => {
    if (!candidateId || !jobId) return false;
    return offers.some(
      o => o.jobId === jobId && o.candidateId === candidateId && o.status === 'accepted',
    );
  };

  const handleContact = (candidate) => {
    if (!candidate?.id || !jobId || !job) return;
    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        jobId,
        name: candidate.name,
        jobTitle: job.jobTitle || job.title,
        jobType: 'quick',
        otherUserId: candidate.id,
      },
    });
  };

  const handleViewProfile = (candidate) => {
    // Support squads if they appear in quick matches
    if (candidate?.isSquad || candidate?.squadId) {
      navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
        jobId,
        squadId: candidate.squadId || candidate.id,
      });
      return;
    }
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      jobId,
      candidateId: candidate.id,
    });
  };

  const renderChips = (
    items = [],
    max = 3,
    chipStyle = styles.chip,
    textStyle = styles.chipText,
  ) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    return (
      <View style={styles.chipsRow}>
        {items.slice(0, max).map((label, idx) => (
          <View key={`${label}-${idx}`} style={chipStyle}>
            <AppText variant={Variant.caption} style={textStyle}>
              {label}
            </AppText>
          </View>
        ))}
      </View>
    );
  };

  const renderCandidate = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => handleViewProfile(item)}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {item.avatar ? (
              <FastImageView
                source={{ uri: item.avatar }}
                style={styles.avatarImage}
                resizeMode="cover"
                fallbackImage={Images.avatar}
              />
            ) : (
              <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
                {item.name?.charAt(0)?.toUpperCase() || 'U'}
              </AppText>
            )}
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <AppText variant={Variant.bodyMedium} style={styles.name}>
                {item.name}
              </AppText>
              {item.isVerified ? (
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark-circle"
                  size={16}
                  color="#3B82F6"
                  style={styles.verifiedIcon}
                />
              ) : null}
            </View>
            <View style={styles.metaRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="location-outline"
                size={14}
                color={colors.gray}
              />
              <AppText variant={Variant.caption} style={styles.meta}>
                {item.suburb ? `${item.suburb}, ` : ''}{item.location}
              </AppText>
              {typeof item.distanceKm === 'number' ? (
                <>
                  <View style={styles.dot} />
                  <AppText variant={Variant.caption} style={styles.distanceMeta}>
                    {item.distanceKm} km away
                  </AppText>
                </>
              ) : null}
            </View>
            {item.badge ? (
              <View style={styles.badgePill}>
                <AppText variant={Variant.caption} style={styles.badgePillText}>
                  {item.badge} Badge
                </AppText>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.rightBadges}>
          <View style={styles.rightBadgesRow}>
            <View style={[
              styles.matchBadge,
              item.matchPercentage >= 90 && styles.matchBadgeExcellent,
              item.matchPercentage >= 80 && item.matchPercentage < 90 && styles.matchBadgeGood,
              item.matchPercentage >= 70 && item.matchPercentage < 80 && styles.matchBadgeFair,
            ]}>
              <AppText variant={Variant.caption} style={styles.matchBadgeText}>
                {Math.round(item.matchPercentage || 0)}% Match
              </AppText>
            </View>
            <View style={styles.ratingBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="star"
                size={14}
                color="#F59E0B"
              />
              <AppText variant={Variant.caption} style={styles.ratingBadgeText}>
                {item.acceptanceRating ?? 0}% Acceptance
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Experience + key skills */}
      <View style={styles.sectionRow}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="briefcase-outline"
          size={16}
          color={colors.primary}
        />
        <View style={styles.sectionContent}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Experience
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionText}>
            {item.experienceYears}+ years
            {item.workHistory?.[0]?.role ? ` • Recent: ${item.workHistory[0].role}` : ''}
          </AppText>
        </View>
      </View>
      {renderChips(item.skills, 4, styles.chip, styles.chipText)}

      {/* Qualifications / licenses (compact) */}
      {Array.isArray(item.qualifications) && item.qualifications.length > 0 ? (
        <View style={styles.sectionRow}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="school-outline"
            size={16}
            color={colors.primary}
          />
          <View style={styles.sectionContent}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Qualifications
            </AppText>
            {renderChips(item.qualifications, 2, styles.chipSoft, styles.chipSoftText)}
          </View>
        </View>
      ) : null}

      {/* Work history (recent) */}
      {Array.isArray(item.workHistory) && item.workHistory.length > 0 ? (
        <View style={styles.sectionRow}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="reader-outline"
            size={16}
            color={colors.primary}
          />
          <View style={styles.sectionContent}>
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Work history
            </AppText>
            {item.workHistory.slice(0, 2).map((h, idx) => (
              <AppText key={`${h.company || 'company'}-${idx}`} variant={Variant.caption} style={styles.sectionText}>
                • {h.role}{h.company ? ` — ${h.company}` : ''}{h.period ? ` (${h.period})` : ''}
              </AppText>
            ))}
          </View>
        </View>
      ) : null}

      {/* Availability */}
      {item.availability?.summary ? (
        <View style={styles.availabilityContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="time-outline"
            size={14}
            color={colors.gray}
          />
          <AppText variant={Variant.caption} style={styles.availabilityText}>
            {item.availability.summary}
          </AppText>
        </View>
      ) : null}

      {/* Reviews + documents (compact) */}
      <View style={styles.summaryRow}>
        {typeof item.reviewSummary?.average === 'number' ? (
          <View style={styles.summaryPill}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="star"
              size={14}
              color="#F59E0B"
            />
            <AppText variant={Variant.caption} style={styles.summaryPillText}>
              {item.reviewSummary.average.toFixed(1)} / 5
              {typeof item.reviewSummary.count === 'number' ? ` (${item.reviewSummary.count})` : ''}
            </AppText>
          </View>
        ) : null}
        {Array.isArray(item.documents) && item.documents.length > 0 ? (
          <View style={styles.summaryPill}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="document-text-outline"
              size={14}
              color={colors.primary}
            />
            <AppText variant={Variant.caption} style={styles.summaryPillText}>
              {item.documents.filter(d => d?.verified).length}/{item.documents.length} docs verified
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() => handleViewProfile(item)}
          activeOpacity={0.7}
        >
          <AppText variant={Variant.bodyMedium} style={styles.viewProfileText}>
            View Full Profile
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendOfferButton}
          onPress={() => handleOpenOfferModal(item)}
          activeOpacity={0.85}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="send"
            size={16}
            color="#FFFFFF"
          />
          <AppText variant={Variant.bodyMedium} style={styles.sendOfferText}>
            Send Offer
          </AppText>
        </TouchableOpacity>
      </View>

      {canContactCandidate(item.id) ? (
        <View style={styles.contactRow}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleContact(item)}
            activeOpacity={0.85}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="chatbubble-ellipses-outline"
              size={18}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.contactText}>
              Contact
            </AppText>
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const listHeader = (
    <View style={styles.headerContainer}>
      {/* Job summary (mirrors ManualMatchList) */}
      {job ? (
        <View style={styles.jobSummaryCard}>
          <View style={styles.jobSummaryHeader}>
            <View style={styles.jobIconContainer}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="briefcase"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.jobSummaryInfo}>
              <AppText variant={Variant.subTitle} style={styles.jobTitle}>
                {job.jobTitle || job.title}
              </AppText>
              <View style={styles.jobMetaRow}>
                <View style={styles.jobMetaItem}>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="time-outline"
                    size={12}
                    color={colors.gray}
                  />
                  <AppText variant={Variant.caption} style={styles.jobMeta}>
                    Quick search
                  </AppText>
                </View>
                <View style={styles.jobMetaItem}>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="location-outline"
                    size={12}
                    color={colors.gray}
                  />
                  <AppText variant={Variant.caption} style={styles.jobMeta}>
                    {job.workLocation || job.location || 'Location not set'}
                  </AppText>
                </View>
                {job.rangeKm ? (
                  <View style={styles.jobMetaItem}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="radio-button-on"
                      size={12}
                      color={colors.gray}
                    />
                    <AppText variant={Variant.caption} style={styles.jobMeta}>
                      {job.rangeKm}km
                    </AppText>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {/* Filters */}
      <View style={styles.filtersCard}>
        <AppText variant={Variant.bodyMedium} style={styles.filtersTitle}>
          Filter Candidates
        </AppText>

        <View style={styles.filtersSection}>
          <View style={styles.filterGroup}>
            <AppText variant={Variant.caption} style={styles.filterLabel}>
              Match Percentage
            </AppText>
            <AppDropDown
              placeholder="All"
              options={matchFilterOptions}
              selectedValue={matchThreshold}
              onSelect={value => setMatchThreshold(value)}
              isVisible={matchDropdownVisible}
              setIsVisible={setMatchDropdownVisible}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.filterGroup}>
            <AppText variant={Variant.caption} style={styles.filterLabel}>
              Acceptance Rating
            </AppText>
            <AppDropDown
              placeholder="All"
              options={ratingFilterOptions}
              selectedValue={ratingThreshold}
              onSelect={value => setRatingThreshold(value)}
              isVisible={ratingDropdownVisible}
              setIsVisible={setRatingDropdownVisible}
              style={styles.dropdown}
            />
          </View>
        </View>

        <View style={styles.resultsCount}>
          <AppText variant={Variant.body} style={styles.resultsText}>
            {filteredMatches.length} candidate
            {filteredMatches.length !== 1 ? 's' : ''} found
          </AppText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Matched Candidates"
        showBackButton
        onBackPress={() => navigation.goBack()}
       
      />

      <FlatList
        data={filteredMatches}
        keyExtractor={item => item.id}
        renderItem={renderCandidate}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="search-outline"
                size={64}
                color={colors.gray}
              />
            </View>
            <AppText variant={Variant.subTitle} style={styles.emptyTitle}>
              No Candidates Found
            </AppText>
            <AppText variant={Variant.body} style={styles.emptyText}>
              Try adjusting your filters to see more candidates
            </AppText>
            <TouchableOpacity
              style={styles.resetFiltersButton}
              onPress={() => {
                setMatchThreshold(0);
                setRatingThreshold(0);
              }}
            >
              <AppText variant={Variant.bodyMedium} style={styles.resetFiltersText}>
                Reset Filters
              </AppText>
            </TouchableOpacity>
          </View>
        }
      />

      <SendManualOfferModal
        visible={Boolean(selectedCandidate)}
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onSubmit={handleSendOffer}
      />
    </View>
  );
};

export default QuickSearchMatchList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1),
  },
  jobSummaryCard: {
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
  jobSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  jobIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  jobSummaryInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(0.8),
  },
  jobMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(3),
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  jobMeta: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  filtersCard: {
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
  filtersTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: hp(2),
  },
  filtersSection: {
    flexDirection: 'row',
    gap: wp(3),
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: getFontSize(13),
    fontWeight: '500',
    color: colors.secondary,
    marginBottom: hp(1),
  },
  dropdown: {
    width: '100%',
  },
  resultsCount: {
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resultsText: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.secondary,
  },
  list: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  verifiedIcon: {
    marginTop: hp(0.1),
  },
  name: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  meta: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  distanceMeta: {
    color: colors.gray,
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray,
  },
  badgeMeta: {
    color: colors.primary,
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  badgePill: {
    marginTop: hp(0.6),
    alignSelf: 'flex-start',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: hp(2),
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgePillText: {
    color: colors.primary,
    fontSize: getFontSize(11),
    fontWeight: '700',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(7),
  },
  rightBadges: {
    alignItems: 'flex-end',
    marginLeft: wp(2),
  },
  rightBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: wp(2),
  },
  matchBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(2),
    backgroundColor: '#FEF3C7',
    minWidth: wp(14),
    alignItems: 'center',
  },
  matchBadgeExcellent: {
    backgroundColor: '#D1FAE5',
  },
  matchBadgeGood: {
    backgroundColor: '#DBEAFE',
  },
  matchBadgeFair: {
    backgroundColor: '#FEF3C7',
  },
  matchBadgeText: {
    fontSize: getFontSize(13),
    fontWeight: '700',
    color: colors.secondary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
    backgroundColor: '#FFF9E6',
  },
  ratingBadgeText: {
    fontSize: getFontSize(12),
    color: colors.secondary,
    fontWeight: '700',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(3),
    marginTop: hp(1.2),
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: hp(0.3),
  },
  sectionText: {
    color: colors.gray,
    lineHeight: getFontSize(18),
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(0.8),
  },
  chip: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: '#E0EFFF',
  },
  chipText: {
    color: colors.primary,
    fontWeight: '600',
  },
  chipSoft: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  chipSoftText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    flex: 1,
  },
  statText: {
    fontSize: getFontSize(12),
    color: colors.secondary,
    fontWeight: '500',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginBottom: hp(1.5),
    paddingLeft: wp(1),
  },
  availabilityText: {
    fontSize: getFontSize(12),
    color: colors.gray,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: wp(2.5),
    marginTop: hp(1),
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(1.2),
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    backgroundColor: '#F9FAFB',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  summaryPillText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewProfileText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  contactRow: {
    marginTop: hp(1),
  },
  contactButton: {
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp(2),
  },
  contactText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  sendOfferButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp(2),
  },
  sendOfferText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: hp(8),
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(1),
  },
  emptyText: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: 'center',
    marginBottom: hp(3),
  },
  resetFiltersButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: colors.primary,
  },
  resetFiltersText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
});


