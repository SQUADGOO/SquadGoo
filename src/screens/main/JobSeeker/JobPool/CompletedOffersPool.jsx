import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import PoolFilters from '@/components/Recruiter/LaborPool/PoolFilters';
import { colors, hp, wp, getFontSize } from '@/theme';
import { screenNames } from '@/navigation/screenNames';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Paid Out', value: 'Paid Out' },
  { label: 'Disputed', value: 'Disputed' },
  { label: 'Refunded', value: 'Refunded' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Highest Pay', value: 'pay' },
  { label: 'Oldest', value: 'oldest' },
];

const getStatusStyle = (status) => {
  const map = {
    'Completed': { color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' },
    'Paid Out': { color: '#16A34A', bg: '#DCFCE7', icon: 'checkmark-done' },
    'Disputed': { color: '#EA580C', bg: '#FFF7ED', icon: 'alert-circle-outline' },
    'Refunded': { color: '#6B7280', bg: '#F3F4F6', icon: 'arrow-undo-outline' },
  };
  return map[status] || map['Completed'];
};

const CompletedOffersPool = ({ navigation }) => {
  const completedOffers = useSelector(state => state?.jobSeekerOffers?.completedOffers || []);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  const clearFilters = () => { setQuery(''); setStatus('all'); setSort('newest'); };

  const filteredJobs = useMemo(() => {
    let jobs = [...completedOffers];
    if (query.trim()) {
      const q = query.toLowerCase();
      jobs = jobs.filter(j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.industry || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }
    if (status !== 'all') jobs = jobs.filter(j => (j.paymentStatus || 'Completed') === status);
    if (sort === 'pay') jobs.sort((a, b) => (parseFloat(b.salaryMax) || 0) - (parseFloat(a.salaryMax) || 0));
    else if (sort === 'oldest') jobs.sort((a, b) => new Date(a.completedDate) - new Date(b.completedDate));
    return jobs;
  }, [completedOffers, query, status, sort]);

  const renderCard = ({ item }) => {
    const badge = getStatusStyle(item.paymentStatus || 'Completed');
    const isQuick = item?.searchType?.toLowerCase() === 'quick';

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job: item, isCompleted: true })}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <AppText variant={Variant.subTitle} style={styles.jobTitle} numberOfLines={2}>{item.title}</AppText>
            <View style={styles.badgeContainer}>
              <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                <VectorIcons name={iconLibName.Ionicons} iconName={badge.icon} size={12} color={badge.color} />
                <AppText variant={Variant.caption} style={[styles.statusText, { color: badge.color }]}>{item.paymentStatus || 'Completed'}</AppText>
              </View>
              <View style={[styles.searchTypeBadge, isQuick ? styles.quickBadge : styles.manualBadge]}>
                <AppText variant={Variant.caption} style={styles.searchTypeText}>{isQuick ? 'Quick' : 'Manual'}</AppText>
              </View>
            </View>
          </View>

          <AppText variant={Variant.bodyMedium} style={styles.salaryText}>{item.salaryRange || 'Not specified'}</AppText>

          <View style={styles.detailsContainer}>
            {item.industry || item.companyName ? (
              <View style={styles.detailRow}>
                <VectorIcons name={iconLibName.Ionicons} iconName="business-outline" size={18} color={colors.gray} />
                <AppText variant={Variant.body} style={styles.detailText}>Employer: <AppText variant={Variant.bodyMedium} style={styles.detailValue}>{item.industry || item.companyName}</AppText></AppText>
              </View>
            ) : null}
            <View style={styles.detailRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="location-outline" size={18} color={colors.gray} />
              <AppText variant={Variant.body} style={styles.detailText}>Location: <AppText variant={Variant.bodyMedium} style={styles.detailValue}>{item.location || '—'}</AppText></AppText>
            </View>
            {item.experience ? (
              <View style={styles.detailRow}>
                <VectorIcons name={iconLibName.Ionicons} iconName="star-outline" size={18} color={colors.gray} />
                <AppText variant={Variant.body} style={styles.detailText}>Experience: <AppText variant={Variant.bodyMedium} style={styles.detailValue}>{item.experience}</AppText></AppText>
              </View>
            ) : null}
          </View>

          {item.completedDate ? (
            <View style={styles.completedRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-done" size={14} color="#10B981" />
              <AppText variant={Variant.caption} style={styles.completedDate}>Completed: {item.completedDate}</AppText>
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job: item, isCompleted: true })} activeOpacity={0.8}>
            <VectorIcons name={iconLibName.Ionicons} iconName="eye-outline" size={16} color={colors.primary} />
            <AppText variant={Variant.bodyMedium} style={styles.viewButtonText}>View Details</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Completed Offers" showBackButton onBackPress={() => navigation.goBack()} />

      <PoolFilters
        query={query}
        onChangeQuery={setQuery}
        resultCount={filteredJobs.length}
        onClear={clearFilters}
        searchPlaceholder="Search by date, employer, type..."
        filters={[
          { key: 'status', placeholder: 'Status', options: STATUS_OPTIONS, value: status, onChange: setStatus },
        ]}
        sort={{ placeholder: 'Sort', options: SORT_OPTIONS, value: sort, onChange: setSort }}
      />

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-done-outline" size={48} color="#D1D5DB" />
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>No completed jobs yet.</AppText>
            <AppText variant={Variant.caption} style={styles.emptySub}>Completed jobs will appear here.</AppText>
          </View>
        }
      />
    </View>
  );
};

export default CompletedOffersPool;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContent: { paddingHorizontal: wp(4), paddingBottom: hp(4), paddingTop: hp(1) },

  // Card - matching recruiter JobCard style
  card: { backgroundColor: colors.white, borderRadius: hp(2), padding: wp(5), marginBottom: hp(2), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: hp(1) },
  jobTitle: { flex: 1, color: '#65799B', fontWeight: 'bold', marginRight: wp(3) },
  badgeContainer: { alignItems: 'flex-end', gap: hp(0.5) },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: wp(1), paddingHorizontal: wp(2.5), paddingVertical: hp(0.5), borderRadius: hp(2.5) },
  statusText: { fontSize: getFontSize(10), fontWeight: '700' },
  searchTypeBadge: { paddingHorizontal: wp(2.5), paddingVertical: hp(0.5), borderRadius: hp(2.5) },
  quickBadge: { backgroundColor: '#10B981' },
  manualBadge: { backgroundColor: '#3B82F6' },
  searchTypeText: { color: colors.white, fontSize: getFontSize(10), fontWeight: 'bold' },
  salaryText: { color: colors.primary, fontSize: getFontSize(14), fontWeight: '600', marginBottom: hp(1.5) },
  detailsContainer: { marginBottom: hp(1) },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  detailText: { flex: 1, color: colors.gray },
  detailValue: { fontWeight: 'bold', color: colors.secondary || '#333' },
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), paddingTop: hp(1), borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  completedDate: { color: '#10B981', fontSize: getFontSize(12), fontWeight: '600' },
  buttonContainer: { marginTop: hp(1.5), paddingTop: hp(1.5), borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  viewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(1.5), paddingVertical: hp(1.3), borderRadius: hp(4), borderWidth: 1, borderColor: colors.primary },
  viewButtonText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(13) },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: hp(10), gap: hp(1) },
  emptyTitle: { color: '#374151', fontWeight: '700', fontSize: getFontSize(15) },
  emptySub: { color: '#9CA3AF', fontSize: getFontSize(12) },
});
