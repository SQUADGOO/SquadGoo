import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Text } from 'react-native';
import { hp, wp, colors, getFontSize } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import WorkerCard from '@/components/Recruiter/LaborPool/WorkerCard';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_SQUADS } from '@/utilities/dummySquads';
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters';
import RbSheetComponent from '@/core/RbSheetComponent';
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet';
import AppText, { Variant } from '@/core/AppText';
import AppDropDown from '@/core/AppDropDown';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getBadgeOptions,
  getLocationOptions,
  getPreferredJobOptions,
  POOL_RADIUS_OPTIONS,
  POOL_SORT_OPTIONS,
} from '@/utilities/poolFilterHelpers';
import { filterAndSortSquads, toSquadWorkerCardItems } from '@/utilities/squadPoolHelpers';

const SquadPoolScreen = ({ navigation }) => {
  // Filters (main screen)
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [job, setJob] = useState('all');
  const [badge, setBadge] = useState('all');
  const [radius, setRadius] = useState('all');
  const [sort, setSort] = useState('rating_desc');
  const [minRating, setMinRating] = useState('all');
  const [language, setLanguage] = useState('all');

  const [jobType, setJobType] = useState('any');
  const [availability, setAvailability] = useState([]);
  const [squadSize, setSquadSize] = useState('any');
  const [acceptanceRating, setAcceptanceRating] = useState('any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [poolStatus, setPoolStatus] = useState('any');

  const [moreVisible, setMoreVisible] = useState(false);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [isLanguageVisible, setIsLanguageVisible] = useState(false);

  const locationSheetRef = useRef(null);
  const jobSheetRef = useRef(null);
  const badgeSheetRef = useRef(null);
  const radiusSheetRef = useRef(null);
  const sortSheetRef = useRef(null);

  const locationOptions = useMemo(() => getLocationOptions(DUMMY_SQUADS), []);
  const jobOptions = useMemo(() => getPreferredJobOptions(DUMMY_SQUADS), []);
  const badgeOptions = useMemo(() => getBadgeOptions(DUMMY_SQUADS), []);
  const languageOptions = useMemo(() => {
    const langs = new Set();
    (DUMMY_SQUADS || []).forEach((s) => {
      (s?.languages || []).forEach((l) => {
        if (l) langs.add(l);
      });
    });
    return [{ label: 'All languages', value: 'all' }, ...Array.from(langs).sort().map((l) => ({ label: l, value: l }))];
  }, []);

  const ratingOptions = useMemo(
    () => [
      { label: 'Any rating', value: 'all' },
      { label: '7.0+', value: 7 },
      { label: '8.0+', value: 8 },
      { label: '9.0+', value: 9 },
    ],
    [],
  );

  const sortOptions = POOL_SORT_OPTIONS;

  const clearFilters = () => {
    setQuery('');
    setLocation('all');
    setJob('all');
    setBadge('all');
    setRadius('all');
    setSort('rating_desc');
    setMinRating('all');
    setLanguage('all');
    setJobType('any');
    setAvailability([]);
    setSquadSize('any');
    setAcceptanceRating('any');
    setVerifiedOnly(false);
    setPoolStatus('any');
  };

  // Filter + sort + transform dummy squads data to match WorkerCard props
  const squads = useMemo(() => {
    const filtered = filterAndSortSquads(DUMMY_SQUADS, { query, location, job, badge, radius, sort, minRating, language });
    return toSquadWorkerCardItems(filtered);
  }, [badge, job, language, location, minRating, query, radius, sort]);

  const handleView = (squad) => {
    // Navigate to profile with squad information
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      squadId: squad.id,
      candidateId: squad.originalData?.memberIds?.[0] || null, // First member as fallback
      jobId: null,
      source: 'squad_pool',
    });
  };

  const handleOffer = (squad) => {
    navigation.navigate(screenNames.SEND_OFFER, {
      mode: 'squad',
      recipient: {
        squadId: squad.id,
        name: squad.name,
        memberIds: squad.originalData?.memberIds || [],
      },
      prefill: {
        workType: squad.originalData?.preferredJobs?.[0] || '',
        availability: squad.originalData?.availability?.summary || '',
      },
    });
  };

  const toSheetOptions = (options) =>
    (options || []).map((o, idx) => ({
      id: idx + 1,
      title: o.label,
      value: o.value,
    }));

  const Chip = ({ label, valueLabel, onPress, iconName }) => (
    <TouchableOpacity style={styles.chip} activeOpacity={0.85} onPress={onPress}>
      <Ionicons name={iconName} size={16} color={colors.primary} />
      <Text style={styles.chipText} numberOfLines={1}>
        {valueLabel ? `${label}: ${valueLabel}` : label}
      </Text>
      <Ionicons name="chevron-down" size={14} color={colors.gray} />
    </TouchableOpacity>
  );

  const getLabelFromOptions = (options, value, fallback = '') => {
    const found = (options || []).find((o) => o.value === value);
    return found ? found.label : fallback;
  };

  const openMore = () => setMoreVisible(true);
  const closeMore = () => setMoreVisible(false);

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Squad Pool"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      {/* Keep existing search UI, but add horizontal chip bar per doc */}
      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={squads.length}
        onClear={clearFilters}
        filters={[]}
        sort={null}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        <Chip
          label="Location"
          valueLabel={getLabelFromOptions(locationOptions, location, 'All')}
          iconName="location-outline"
          onPress={() => locationSheetRef.current?.open()}
        />
        <Chip
          label="Job"
          valueLabel={getLabelFromOptions(jobOptions, job, 'All')}
          iconName="briefcase-outline"
          onPress={() => jobSheetRef.current?.open()}
        />
        <Chip
          label="Badge"
          valueLabel={getLabelFromOptions(badgeOptions, badge, 'All')}
          iconName="ribbon-outline"
          onPress={() => badgeSheetRef.current?.open()}
        />
        <Chip
          label="Radius"
          valueLabel={getLabelFromOptions(POOL_RADIUS_OPTIONS, radius, 'Any')}
          iconName="navigate-outline"
          onPress={() => radiusSheetRef.current?.open()}
        />
        <Chip
          label="Sort"
          valueLabel={getLabelFromOptions(sortOptions, sort, '')}
          iconName="swap-vertical-outline"
          onPress={() => sortSheetRef.current?.open()}
        />
        <Chip label="More" iconName="options-outline" onPress={openMore} />
      </ScrollView>

      <FlatList
        data={squads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <WorkerCard
            name={item.name}
            role={item.role}
            location={item.location}
            availability={item.availability}
            rate={item.rate}
            rating={item.rating}
            badge={item.originalData?.badge}
            onView={() => handleView(item)}
            onOffer={() => handleOffer(item)}
            keySkills={item.originalData?.specialties || []}
            onPressRating={() =>
              navigation.navigate(screenNames.SQUAD_REVIEWS, {
                squadId: item.id,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Sheets */}
      <RbSheetComponent ref={locationSheetRef} height={hp(60)}>
        <BottomDataSheet
          optionsData={toSheetOptions(locationOptions)}
          onClose={() => locationSheetRef.current?.close()}
          onSelect={(item) => {
            setLocation(item.value);
            locationSheetRef.current?.close();
          }}
        />
      </RbSheetComponent>
      <RbSheetComponent ref={jobSheetRef} height={hp(60)}>
        <BottomDataSheet
          optionsData={toSheetOptions(jobOptions)}
          onClose={() => jobSheetRef.current?.close()}
          onSelect={(item) => {
            setJob(item.value);
            jobSheetRef.current?.close();
          }}
        />
      </RbSheetComponent>
      <RbSheetComponent ref={badgeSheetRef} height={hp(60)}>
        <BottomDataSheet
          optionsData={toSheetOptions(badgeOptions)}
          onClose={() => badgeSheetRef.current?.close()}
          onSelect={(item) => {
            setBadge(item.value);
            badgeSheetRef.current?.close();
          }}
        />
      </RbSheetComponent>
      <RbSheetComponent ref={radiusSheetRef} height={hp(55)}>
        <BottomDataSheet
          optionsData={toSheetOptions(POOL_RADIUS_OPTIONS)}
          onClose={() => radiusSheetRef.current?.close()}
          onSelect={(item) => {
            setRadius(item.value);
            radiusSheetRef.current?.close();
          }}
        />
      </RbSheetComponent>
      <RbSheetComponent ref={sortSheetRef} height={hp(55)}>
        <BottomDataSheet
          optionsData={toSheetOptions(sortOptions)}
          onClose={() => sortSheetRef.current?.close()}
          onSelect={(item) => {
            setSort(item.value);
            sortSheetRef.current?.close();
          }}
        />
      </RbSheetComponent>

      {/* More modal */}
      {moreVisible ? (
        <View style={styles.moreOverlay}>
          <View style={styles.moreCard}>
            <View style={styles.moreHeader}>
              <AppText variant={Variant.bodyMedium} style={styles.moreTitle}>
                More filters
              </AppText>
              <TouchableOpacity onPress={closeMore} activeOpacity={0.8}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="close"
                  size={22}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>

            <AppDropDown
              placeholder="Min rating"
              options={ratingOptions}
              selectedValue={minRating}
              onSelect={setMinRating}
              isVisible={isRatingVisible}
              setIsVisible={setIsRatingVisible}
              style={styles.moreDropDown}
            />

            <AppDropDown
              placeholder="Language"
              options={languageOptions}
              selectedValue={language}
              onSelect={setLanguage}
              isVisible={isLanguageVisible}
              setIsVisible={setIsLanguageVisible}
              style={styles.moreDropDown}
            />

            <View style={styles.moreActions}>
              <AppButton
                text="Clear"
                secondary
                bgColor={colors.white}
                onPress={() => {
                  clearFilters();
                  closeMore();
                }}
                style={{ width: '48%' }}
              />
              <AppButton
                text="Apply"
                bgColor={colors.primary}
                onPress={closeMore}
                style={{ width: '48%' }}
              />
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default SquadPoolScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    paddingTop: hp(1),
  },
  chipsRow: {
    paddingHorizontal: wp(4),
    // paddingVertical: hp(1),
    gap: wp(2),
    height: hp(8),
    paddingVertical: hp(1),
    marginBottom: hp(4),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'flex-start',
    maxWidth: wp(70),
  },
  chipText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: getFontSize(12),
    flexShrink: 1,
  },
  moreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  moreText: {
    color: colors.primary,
    fontWeight: '800',
  },
  moreOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  moreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp(4),
  },
  moreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  moreTitle: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: getFontSize(16),
  },
  moreDropDown: {
    marginBottom: hp(1.5),
  },
  moreActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
});
