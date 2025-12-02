import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AppHeader from '@/core/AppHeader';
import { hp, wp } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';

const CompletedOffers = () => {
  const navigation = useNavigation();
  const completedOffers = useSelector(state => state?.jobSeekerOffers?.completedOffers || []);

  return (
    <View style={styles.container}>
      <AppHeader showBackButton title='Completed Offers' />
      <ScrollView style={{ flex: 1 }}>
        {completedOffers.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="checkmark-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No completed offers yet</Text>
            <Text style={styles.emptySubText}>Completed jobs will appear here.</Text>
          </View>
        ) : (
          completedOffers.map(job => (
            <TouchableOpacity
              key={job.id}
              style={styles.card}
              onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job, isCompleted: true })}
            >
              <View style={{ gap: hp(1) }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{job.title}</Text>
                  <View style={styles.completedBadge}>
                    <Icon name="checkmark-circle" size={14} color="#4ADE80" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                </View>

                <View style={styles.cardHeader}>
                  <Text style={styles.salary}>{job.salaryRange}</Text>
                  <Text style={styles.expiry}>{job?.searchType?.toUpperCase() || 'N/A'}</Text>
                </View>
              </View>

              <Text style={styles.description}>
                {job?.description || job?.jobDescription}
                <Text style={styles.viewDetails}> View Details</Text>
              </Text>

              <View style={styles.companyRow}>
                {job?.image ? (
                  <Image source={{ uri: job.image }} style={styles.logo} />
                ) : (
                  <View style={[styles.logo, { backgroundColor: '#E0E0E0' }]} />
                )}
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{job.industry}</Text>
                  <View style={styles.locationRow}>
                    <Icon name="location-outline" size={14} color="#4F5D75" />
                    <Text style={styles.location}>{job.location}</Text>
                  </View>
                </View>
                <Text style={styles.experience}>Experience: {job.experience}</Text>
              </View>

              <View style={styles.completedInfoRow}>
                <View style={styles.infoItem}>
                  <Icon name="calendar-outline" size={14} color="#4F5D75" />
                  <Text style={styles.infoText}>Completed: {job.completedDate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default CompletedOffers;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyState: { alignItems: 'center', paddingTop: 48 },
  emptyText: { marginTop: 12, fontWeight: '700', fontSize: 16, color: '#111827' },
  emptySubText: { marginTop: 4, color: '#6B7280' },
  card: {
    borderBottomWidth: 0.8,
    borderColor: '#eee',
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#4F5D75' },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  expiry: {
    backgroundColor: '#E0D9E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: '#4F5D75',
  },
  salary: {
    color: '#FF9800',
    fontWeight: '700',
    width: wp(50),
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  description: { color: '#4F5D75', fontSize: 13, marginBottom: 8 },
  viewDetails: { color: '#FF9800', fontWeight: '600' },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  logo: { width: 35, height: 35, borderRadius: 35 / 2, marginRight: 10 },
  companyInfo: { flex: 1 },
  companyName: { fontWeight: '600', color: '#000' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  location: { marginLeft: 4, color: '#4F5D75', fontSize: 12 },
  experience: { color: '#4F5D75', fontSize: 13 },
  completedInfoRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#4F5D75',
    fontSize: 12,
  },
});

