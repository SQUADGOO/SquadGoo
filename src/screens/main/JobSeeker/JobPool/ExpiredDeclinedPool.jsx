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
  { label: 'Expired', value: 'Expired' },
  { label: 'Declined', value: 'Declined' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Highest Pay', value: 'pay' },
  { label: 'By Location', value: 'location' },
];

const ExpiredDeclinedPool = ({ navigation }) => {
  const expiredOffers = useSelector(state => state?.jobSeekerOffers?.expiredOffers || []);
  const declinedOffers = useSelector(state => state?.jobSeekerOffers?.declinedOffers || []);

  const allOffers = useMemo(() => {
    const expired = expiredOffers.map(j => ({ ...j, offerStatus: 'Expired' }));
    const declined = declinedOffers.map(j => ({ ...j, offerStatus: 'Declined' }));
    return [...declined, ...expired];
  }, [expiredOffers, declinedOffers]);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  const clearFilters = () => { setQuery(''); setStatus('all'); setSort('newest'); };

  const filteredJobs = useMemo(() => {
    let jobs = [...allOffers];
    if (query.trim()) {
      const q = query.toLowerCase();
      jobs = jobs.filter(j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.industry || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }
    if (status !== 'all') jobs = jobs.filter(j => j.offerStatus === status);
    if (sort === 'pay') jobs.sort((a, b) => (parseFloat(b.salaryMax) || 0) - (parseFloat(a.salaryMax) || 0));
    return jobs;
  }, [allOffers, query, status, sort]);

  const renderCard = ({ item }) => {
    const isExpired = item.offerStatus === 'Expired';
    const badgeColor = isExpired ? '#6B7280' : '#EF4444';
    const badgeBg = isExpired ? '#F3F4F6' : '#FEE2E2';
    const badgeIcon = isExpired ? 'hourglass-outline' : 'close-circle';
    const isQuick = item?.searchType?.toLowerCase() === 'quick';

    return (
      <View style={[styles.card, !isExpired && styles.cardDeclined]}>
        <TouchableOpacity
          onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job: item })}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <AppText variant={Variant.subTitle} style={styles.jobTitle} numberOfLines={2}>{item.title}</AppText>
            <View style={styles.badgeContainer}>
              <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                <VectorIcons name={iconLibName.Ionicons} iconName={badgeIcon} size={12} color={badgeColor} />
                <AppText variant={Variant.caption} style={[styles.statusText, { color: badgeColor }]}>{item.offerStatus}</AppText>
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
            <View style={styles.detailRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={18} color={colors.gray} />
              <AppText variant={Variant.body} style={styles.detailText}>
                {isExpired ? 'Expired' : 'Declined'}: <AppText variant={Variant.bodyMedium} style={styles.detailValue}>{isExpired ? (item.expireDate || '—') : (item.declinedDate || '—')}</AppText>
              </AppText>
            </View>
          </View>

          {item.declineReason ? (
            <View style={styles.reasonBox}>
              <VectorIcons name={iconLibName.Ionicons} iconName="document-text-outline" size={14} color="#9CA3AF" />
              <AppText variant={Variant.caption} style={styles.reasonText} numberOfLines={2}>Reason: {item.declineReason}</AppText>
            </View>
          ) : null}

          {item.ratingImpact ? (
            <View style={styles.ratingImpactRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="trending-down-outline" size={14} color="#EF4444" />
              <AppText variant={Variant.caption} style={styles.ratingImpactText}>{item.ratingImpact}</AppText>
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job: item })} activeOpacity={0.8}>
            <VectorIcons name={iconLibName.Ionicons} iconName="eye-outline" size={16} color={colors.primary} />
            <AppText variant={Variant.bodyMedium} style={styles.viewButtonText}>View Details</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Expired / Declined Offers" showBackButton onBackPress={() => navigation.goBack()} />

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
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="archive-outline" size={48} color="#D1D5DB" />
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>No expired or declined offers.</AppText>
            <AppText variant={Variant.caption} style={styles.emptySub}>Expired or declined offers will show here.</AppText>
          </View>
        }
      />
    </View>
  );
};

export default ExpiredDeclinedPool;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContent: { paddingHorizontal: wp(4), paddingBottom: hp(4), paddingTop: hp(1) },

  // Card - matching recruiter theme
  card: { backgroundColor: colors.white, borderRadius: hp(2), padding: wp(5), marginBottom: hp(2), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardDeclined: { borderLeftWidth: 4, borderLeftColor: '#EF4444' },
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
  reasonBox: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(1.5), backgroundColor: '#F9FAFB', padding: wp(3), borderRadius: hp(1.5), borderWidth: 1, borderColor: '#EEF2F7', marginBottom: hp(1) },
  reasonText: { flex: 1, color: '#6B7280', fontSize: getFontSize(12) },
  ratingImpactRow: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), marginBottom: hp(0.5) },
  ratingImpactText: { color: '#EF4444', fontSize: getFontSize(11), fontWeight: '600' },
  buttonContainer: { marginTop: hp(1.5), paddingTop: hp(1.5), borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  viewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(1.5), paddingVertical: hp(1.3), borderRadius: hp(4), borderWidth: 1, borderColor: colors.primary },
  viewButtonText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(13) },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: hp(10), gap: hp(1) },
  emptyTitle: { color: '#374151', fontWeight: '700', fontSize: getFontSize(15) },
  emptySub: { color: '#9CA3AF', fontSize: getFontSize(12) },
});
