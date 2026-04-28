import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import JobSeekerJobCard from '@/components/JobSeeker/JobCard';
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters';
import { colors, hp, wp, getFontSize } from '@/theme';
import { screenNames } from '@/navigation/screenNames';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'In Progress', value: 'in progress' },
  { label: 'Modification Requested', value: 'modification requested' },
];

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Highest Pay', value: 'pay' },
  { label: 'Soonest Expiry', value: 'expiry' },
];

const TYPE_OPTIONS = [
  { label: 'All Types', value: 'all' },
  { label: 'Quick', value: 'quick' },
  { label: 'Manual', value: 'manual' },
];

const ActiveOffersPool = ({ navigation }) => {
  const activeJobs = useSelector(state => state.jobs?.activeJobs || []);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [sort, setSort] = useState('newest');

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setJobType('all');
    setSort('newest');
  };

  const filteredJobs = useMemo(() => {
    let jobs = [...activeJobs];

    if (query.trim()) {
      const q = query.toLowerCase();
      jobs = jobs.filter(j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.jobCategory || j.industry || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }

    if (status !== 'all') {
      jobs = jobs.filter(j => (j.status || 'pending').toLowerCase() === status);
    }

    if (jobType !== 'all') {
      jobs = jobs.filter(j => (j.searchType || 'manual').toLowerCase() === jobType);
    }

    if (sort === 'pay') {
      jobs.sort((a, b) => (parseFloat(b.salaryMax) || 0) - (parseFloat(a.salaryMax) || 0));
    } else if (sort === 'expiry') {
      jobs.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate));
    }

    return jobs;
  }, [activeJobs, query, status, jobType, sort]);

  return (
    <View style={styles.container}>
      <AppHeader title="Active Offers" showBackButton onBackPress={() => navigation.goBack()} />

      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={filteredJobs.length}
        onClear={clearFilters}
        searchPlaceholder="Search by job title, employer, location..."
        filters={[
          { key: 'status', placeholder: 'Status', options: STATUS_OPTIONS, value: status, onChange: setStatus },
          { key: 'type', placeholder: 'Type', options: TYPE_OPTIONS, value: jobType, onChange: setJobType },
        ]}
        sort={{ placeholder: 'Sort', options: SORT_OPTIONS, value: sort, onChange: setSort }}
      />

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <JobSeekerJobCard
            job={item}
            onAccept={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job: item })}
            onDecline={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job: item })}
            onViewDetails={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="briefcase-outline" size={48} color="#D1D5DB" />
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>No active job offers at the moment.</AppText>
            <AppText variant={Variant.caption} style={styles.emptySub}>New offers will appear here.</AppText>
          </View>
        }
      />
    </View>
  );
};

export default ActiveOffersPool;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContent: { paddingHorizontal: wp(4), paddingBottom: hp(4), paddingTop: hp(1) },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: hp(10), gap: hp(1) },
  emptyTitle: { color: '#374151', fontWeight: '700', fontSize: getFontSize(15) },
  emptySub: { color: '#9CA3AF', fontSize: getFontSize(12) },
});
