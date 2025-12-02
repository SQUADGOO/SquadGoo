import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AppHeader from '@/core/AppHeader';
import { removeAcceptedOffer } from '@/store/jobSeekerOffersSlice';
import { hp, wp } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';

const AcceptedOffers = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const acceptedOffers = useSelector(state => state?.jobSeekerOffers?.acceptedOffers || []);

  const onDecline = (id) => {
    dispatch(removeAcceptedOffer(id));
  };

  return (
    <View style={styles.container}>
      <AppHeader showBackButton title='Accepted Offers' />
      <ScrollView style={{ flex: 1 }}>
        {acceptedOffers.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="briefcase-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No accepted offers yet</Text>
            <Text style={styles.emptySubText}>Apply to a job to see it here.</Text>
          </View>
        ) : (
          acceptedOffers.map(job => (
            <TouchableOpacity
              key={job.id}
              style={styles.card}
              onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job })}
            >

              <View style={{ gap: hp(1) }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{job.title}</Text>
                  <Text style={styles.expiry}>Expire on {job.expireDate}</Text>
                </View>

                <View style={styles.cardHeader}>
                  <Text style={styles.salary}>{job.salaryRange}</Text>
                  <Text style={styles.expiry}>{job?.searchType?.toUpperCase() || 'N/A'}</Text>
                </View>
              </View>

              <Text style={styles.description}>
                {job?.description}
                <Text style={styles.viewDetails}> View Details</Text>
              </Text>

              <View style={styles.companyRow}>
                <Image source={{ uri: job?.image }} style={styles.logo} />
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{job.industry}</Text>
                  <View style={styles.locationRow}>
                    <Icon name="location-outline" size={14} color="#4F5D75" />
                    <Text style={styles.location}>{job.location}</Text>
                  </View>
                </View>
                <Text style={styles.experience}>Experience: {job.experience}</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.declineBtn} onPress={() => onDecline(job.id)}>
                  <Icon name="trash-outline" size={18} color="red" />
                  <Text style={styles.declineText}>Remove</Text>
                </TouchableOpacity>
              </View>

            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </View>
  );
};

export default AcceptedOffers;

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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
  },
  acceptText: { color: 'green', marginLeft: 6, fontWeight: '600' },
  declineText: { color: 'red', marginLeft: 6, fontWeight: '600' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.8,
    borderColor: '#eee',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#aaa', marginTop: 3 },
  navActive: { fontSize: 12, color: '#FF9800', marginTop: 3, fontWeight: '600' },
});


