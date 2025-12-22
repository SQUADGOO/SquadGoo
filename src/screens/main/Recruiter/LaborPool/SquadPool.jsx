import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { hp, wp } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import WorkerCard from '@/components/Recruiter/LaborPool/WorkerCard';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_SQUADS } from '@/utilities/dummySquads';
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters';
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

  const locationOptions = useMemo(() => getLocationOptions(DUMMY_SQUADS), []);
  const jobOptions = useMemo(() => getPreferredJobOptions(DUMMY_SQUADS), []);
  const badgeOptions = useMemo(() => getBadgeOptions(DUMMY_SQUADS), []);

  const sortOptions = POOL_SORT_OPTIONS;

  const clearFilters = () => {
    setQuery('');
    setLocation('all');
    setJob('all');
    setBadge('all');
    setRadius('all');
    setSort('rating_desc');
  };

  // Filter + sort + transform dummy squads data to match WorkerCard props
  const squads = useMemo(() => {
    const filtered = filterAndSortSquads(DUMMY_SQUADS, { query, location, job, badge, radius, sort });
    return toSquadWorkerCardItems(filtered);
  }, [badge, job, location, query, radius, sort]);

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
    // TODO: Implement offer creation for squad
    console.log('Offer to squad:', squad);
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Squad Pool"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={squads.length}
        onClear={clearFilters}
        filters={[
          {
            key: 'location',
            placeholder: 'Location',
            options: locationOptions,
            value: location,
            onChange: setLocation,
          },
          {
            key: 'job',
            placeholder: 'Job',
            options: jobOptions,
            value: job,
            onChange: setJob,
          },
          {
            key: 'badge',
            placeholder: 'Badge',
            options: badgeOptions,
            value: badge,
            onChange: setBadge,
          },
          {
            key: 'radius',
            placeholder: 'Radius',
            options: POOL_RADIUS_OPTIONS,
            value: radius,
            onChange: setRadius,
          },
        ]}
        sort={{
          placeholder: 'Sort',
          options: sortOptions,
          value: sort,
          onChange: setSort,
        }}
      />

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
            onView={() => handleView(item)}
            onOffer={() => handleOffer(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
});
