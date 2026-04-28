import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { hp, wp, getFontSize, colors } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import EmployeeCard from '@/components/Recruiter/LaborPool/EmployeeCard';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_EMPLOYEES } from '@/utilities/dummyEmployees';
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import InfoTooltip from '@/components/InfoTooltip';
import {
  getBadgeOptions,
  getLocationOptions,
  getPreferredRoleOptions,
  POOL_RADIUS_OPTIONS,
  POOL_SORT_OPTIONS,
} from '@/utilities/poolFilterHelpers';
import { filterAndSortWorkers } from '@/utilities/workerPoolHelpers';

const Employees = ({ navigation }) => {
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

  const locationOptions = useMemo(() => getLocationOptions(DUMMY_EMPLOYEES), []);
  const roleOptions = useMemo(() => getPreferredRoleOptions(DUMMY_EMPLOYEES), []);
  const badgeOptions = useMemo(() => getBadgeOptions(DUMMY_EMPLOYEES), []);

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

  const employees = useMemo(() => {
    let filtered = filterAndSortWorkers(DUMMY_EMPLOYEES, { query, location, role, badge, radius, sort });
    // Also filter by TFN / name / skills if query present
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(e =>
        (e.name || '').toLowerCase().includes(q) ||
        (e.employeeId || '').toLowerCase().includes(q) ||
        (e.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [badge, location, query, radius, role, sort]);

  const handleViewProfile = (employee) => {
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      candidateId: employee.id,
      jobId: null,
      source: 'employees_pool',
    });
  };

  const handleHire = (employee) => {
    navigation.navigate(screenNames.SEND_OFFER, {
      mode: 'worker',
      recipient: {
        candidateId: employee.id,
        name: employee.name,
      },
      prefill: {
        workType: employee.preferredRoles?.[0] || '',
        availability: employee.availability?.summary || '',
      },
    });
  };

  const handlePressRating = (employee) => {
    navigation.navigate(screenNames.SQUAD_REVIEWS, {
      name: employee.name,
      rating: employee.acceptanceRating,
    });
  };

  const maskTfn = (tfn) => {
    if (!tfn) return '***';
    const digits = tfn.replace(/\s/g, '');
    return `***${digits.slice(-3)}`;
  };

  const toRating5 = (r) => {
    return Math.round(((r || 0) / 100) * 5 * 10) / 10;
  };

  const renderInfoBanner = () => (
    <View style={styles.infoBanner}>
      <VectorIcons name={iconLibName.Ionicons} iconName="shield-checkmark" size={20} color="#0D9488" />
      <AppText variant={Variant.bodyMedium} style={styles.infoBannerTitle}>
        TFN Verified Employees
      </AppText>
      <InfoTooltip
        message="Full-time, part-time, and casual employees with verified Tax File Numbers."
        iconColor="#0D9488"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Employee Pool"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={employees.length}
        onClear={clearFilters}
        searchPlaceholder="Search by TFN, name, skills, experience..."
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
            placeholder: 'Skills',
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
            placeholder: 'Availability',
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
        data={employees}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderInfoBanner}
        renderItem={({ item }) => (
          <EmployeeCard
            name={item.name}
            employeeId={item.employeeId || item.id}
            tfnMasked={maskTfn(item.tfnNumber)}
            phone={item.phone || '+61 400 000 000'}
            email={item.email || 'contact@example.com'}
            badge={item.badge}
            employmentType={item.employmentType || 'Full-time'}
            skills={item.skills}
            rating={toRating5(item.acceptanceRating)}
            experienceYears={item.experienceYears}
            reviewCount={item.reviewCount || 0}
            onViewProfile={() => handleViewProfile(item)}
            onHire={() => handleHire(item)}
            onPressRating={() => handlePressRating(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: hp(4) }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="search-outline" size={40} color={colors.gray} />
            <AppText variant={Variant.body} style={styles.emptyText}>No employees found</AppText>
          </View>
        }
      />
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: hp(1.6),
    padding: wp(3.5),
    marginBottom: hp(2),
    gap: wp(2),
  },
  infoBannerTitle: {
    color: '#115E59',
    fontWeight: '700',
    fontSize: getFontSize(14),
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
