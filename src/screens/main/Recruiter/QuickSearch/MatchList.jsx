import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppDropDown from '@/core/AppDropDown';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, getFontSize, hp, wp } from '@/theme';
import { screenNames } from '@/navigation/screenNames';
import {
  selectQuickJobById,
  selectQuickMatchesByJobId,
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

  const renderCandidate = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() =>
        navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
          jobId,
          candidateId: item.id,
        })
      }
    >
     
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


