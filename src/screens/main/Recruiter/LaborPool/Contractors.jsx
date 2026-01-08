import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { hp, wp } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import WorkerCard from '@/components/Recruiter/LaborPool/WorkerCard';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_CONTRACTORS } from '@/utilities/dummyContractors';
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters';
import {
  getBadgeOptions,
  getLocationOptions,
  getPreferredRoleOptions,
  POOL_RADIUS_OPTIONS,
  POOL_SORT_OPTIONS,
} from '@/utilities/poolFilterHelpers';
import { filterAndSortWorkers, toWorkerCardItems } from '@/utilities/workerPoolHelpers';

const Contractors = ({ navigation }) => {
  // Filters
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [role, setRole] = useState('all');
  const [badge, setBadge] = useState('all');
  const [radius, setRadius] = useState('all');
  const [sort, setSort] = useState('rating_desc');

  const locationOptions = useMemo(() => getLocationOptions(DUMMY_CONTRACTORS), []);
  const roleOptions = useMemo(() => getPreferredRoleOptions(DUMMY_CONTRACTORS), []);
  const badgeOptions = useMemo(() => getBadgeOptions(DUMMY_CONTRACTORS), []);

  const sortOptions = useMemo(
    () => POOL_SORT_OPTIONS.filter((o) => o.value !== 'members_desc'),
    []
  );

  const clearFilters = () => {
    setQuery('');
    setLocation('all');
    setRole('all');
    setBadge('all');
    setRadius('all');
    setSort('rating_desc');
  };

  const contractors = useMemo(() => {
    const filtered = filterAndSortWorkers(DUMMY_CONTRACTORS, { query, location, role, badge, radius, sort });
    return toWorkerCardItems(filtered, { roleFallback: 'Contractor' });
  }, [badge, location, query, radius, role, sort]);

  const handleView = (contractor) => {
    // Navigate to candidate profile screen
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      candidateId: contractor.id,
      jobId: null, // Contractors don't have an associated job
      source: 'contractors_pool', // To identify where the navigation came from
    });
  };

  const handleOffer = (contractor) => {
    navigation.navigate(screenNames.SEND_OFFER, {
      mode: 'worker',
      recipient: {
        candidateId: contractor.id,
        name: contractor.name,
      },
      prefill: {
        workType: contractor.originalData?.preferredRoles?.[0] || '',
        availability: contractor.originalData?.availability?.summary || '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Contractors"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={contractors.length}
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
            key: 'role',
            placeholder: 'Role',
            options: roleOptions,
            value: role,
            onChange: setRole,
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
        data={contractors}
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

export default Contractors;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    paddingTop: hp(1),
  },
});
