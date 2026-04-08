import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { hp, wp, getFontSize, colors } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import ContractorCard from '@/components/Recruiter/LaborPool/ContractorCard';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_CONTRACTORS } from '@/utilities/dummyContractors';
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import {
  getBadgeOptions,
  getLocationOptions,
  getPreferredRoleOptions,
  POOL_RADIUS_OPTIONS,
  POOL_SORT_OPTIONS,
} from '@/utilities/poolFilterHelpers';
import { filterAndSortWorkers } from '@/utilities/workerPoolHelpers';

const Contractors = ({ navigation }) => {
  // Filters
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [role, setRole] = useState('all');
  const [badge, setBadge] = useState('all');
  const [radius, setRadius] = useState('all');
  const [sort, setSort] = useState('rating_desc');
  const [jobType, setJobType] = useState('any');
  const [acceptanceRating, setAcceptanceRating] = useState('any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [poolStatus, setPoolStatus] = useState('any');

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
    setJobType('any');
    setAcceptanceRating('any');
    setVerifiedOnly(false);
    setPoolStatus('any');
  };

  const contractors = useMemo(() => {
    let filtered = filterAndSortWorkers(DUMMY_CONTRACTORS, { query, location, role, badge, radius, sort });
    // Also filter by ABN / business name if query present
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.businessName || '').toLowerCase().includes(q) ||
        (c.abnNumber || '').replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        (c.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [badge, location, query, radius, role, sort]);

  const handleViewProfile = (contractor) => {
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      candidateId: contractor.id,
      jobId: null,
      source: 'contractors_pool',
    });
  };

  const handleHire = (contractor) => {
    navigation.navigate(screenNames.SEND_OFFER, {
      mode: 'worker',
      recipient: {
        candidateId: contractor.id,
        name: contractor.name,
      },
      prefill: {
        workType: contractor.preferredRoles?.[0] || '',
        availability: contractor.availability?.summary || '',
      },
    });
  };

  const handlePressRating = (contractor) => {
    navigation.navigate(screenNames.SQUAD_REVIEWS, {
      name: contractor.businessName || contractor.name,
      rating: contractor.acceptanceRating,
    });
  };

  const renderInfoBanner = () => (
    <View style={styles.infoBanner}>
      <VectorIcons name={iconLibName.Ionicons} iconName="shield-checkmark" size={20} color="#16A34A" />
      <View style={styles.infoBannerContent}>
        <AppText variant={Variant.bodyMedium} style={styles.infoBannerTitle}>
          ABN Verified Independent Contractors
        </AppText>
        <AppText variant={Variant.caption} style={styles.infoBannerDesc}>
          All contractors have verified ABN and work as sole traders
        </AppText>
      </View>
    </View>
  );

  const formatRate = (c) => {
    if (c.payPreference?.max) return `$${c.payPreference.max}/hr`;
    if (c.payPreference?.min) return `$${c.payPreference.min}/hr`;
    return 'N/A';
  };

  const toRating5 = (r) => {
    // acceptanceRating is 0–100, convert to 0–5
    return Math.round(((r || 0) / 100) * 5 * 10) / 10;
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Contractors Pool"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={contractors.length}
        onClear={clearFilters}
        searchPlaceholder="Search by ABN, business name, trade, location..."
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
            placeholder: 'Trade',
            options: roleOptions,
            value: role,
            onChange: setRole,
          },
          {
            key: 'badge',
            placeholder: 'Rating',
            options: badgeOptions,
            value: badge,
            onChange: setBadge,
          },
          {
            key: 'radius',
            placeholder: 'Rate',
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
        ListHeaderComponent={renderInfoBanner}
        renderItem={({ item }) => (
          <ContractorCard
            businessName={item.businessName || item.name}
            abnNumber={item.abnNumber}
            name={item.name}
            phone={item.phone || '+61 400 000 000'}
            email={item.email || 'contact@example.com'}
            badge={item.badge}
            skills={item.skills}
            rate={formatRate(item)}
            rating={toRating5(item.acceptanceRating)}
            reviewCount={item.reviewCount || 0}
            onHire={() => handleHire(item)}
            onViewProfile={() => handleViewProfile(item)}
            onPressRating={() => handlePressRating(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: hp(4) }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="search-outline" size={40} color={colors.gray} />
            <AppText variant={Variant.body} style={styles.emptyText}>No contractors found</AppText>
          </View>
        }
      />
    </View>
  );
};

export default Contractors;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: hp(1.6),
    padding: wp(3.5),
    marginBottom: hp(2),
    gap: wp(3),
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    color: '#166534',
    fontWeight: '700',
    fontSize: getFontSize(14),
  },
  infoBannerDesc: {
    color: '#15803D',
    fontSize: getFontSize(11),
    marginTop: hp(0.2),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
    gap: hp(1),
  },
  emptyText: {
    color: colors.gray,
    fontWeight: '500',
  },
});
