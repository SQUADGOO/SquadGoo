import images from '@/assets/images';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const JobSeekerActiveJob = () => {
  const jobOffers = [
    {
      id: 1,
      title: 'Full house painting',
      salary: '$500/month',
      expiry: 'Expire in : 2 days',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...',
      company: 'McDonald',
      location: 'Sydney',
      experience: '4 years',
      logo: images.mc,
    },
    {
      id: 2,
      title: 'Full house painting',
      salary: '$500/month',
      expiry: 'Expire in : 2 days',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...',
      company: 'McDonald',
      location: 'Sydney',
      experience: '4 years',
      logo: images.mc,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>105 active job offers</Text>
          <MaterialIcons name="tune" size={24} color="#FF9800" />
        </View>

        {/* Dropdown */}
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>All Post</Text>
          <Icon name="chevron-down" size={18} color="#aaa" />
        </TouchableOpacity>

        {/* Job Cards */}
        {jobOffers.map((job) => (
          <View key={job.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{job.title}</Text>
              <Text style={styles.expiry}>{job.expiry}</Text>
            </View>

            <Text style={styles.salary}>{job.salary}</Text>
            <Text style={styles.description}>
              {job.description}
              <Text style={styles.viewDetails}> View Details</Text>
            </Text>

            {/* Company Info */}
            <View style={styles.companyRow}>
              <Image
                source={ job.logo }
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{job.company}</Text>
                <View style={styles.locationRow}>
                  <Icon name="location-outline" size={14} color="#4F5D75" />
                  <Text style={styles.location}>{job.location}</Text>
                </View>
              </View>
              <Text style={styles.experience}>Experience: {job.experience}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.acceptBtn}>
                <Icon name="checkmark" size={18} color="green" />
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineBtn}>
                <Icon name="close" size={18} color="red" />
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
  headerText: { fontWeight: '700', fontSize: 16 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  dropdownText: { color: '#aaa', flex: 1 },
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
    marginTop: 5,
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
  logo: { width: 35, height: 35, marginRight: 10 },
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

export default JobSeekerActiveJob;
