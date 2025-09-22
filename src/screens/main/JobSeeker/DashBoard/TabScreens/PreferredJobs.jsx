import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PreferredJobs = ({navigation}) => {
  const availability = [
    { day: 'Monday', from: '15:22', to: '23:22' },
    { day: 'Tuesday', from: '15:22', to: '23:22' },
    { day: 'Wednesday', from: '15:22', to: '23:22' },
    { day: 'Thursday', from: '15:22', to: '23:22' },
    { day: 'Friday', from: '15:22', to: '23:22' },
    { day: 'Saturday', from: '15:22', to: '23:22' },
    { day: 'Sunday', from: '15:22', to: '23:22' },
  ];

  return (
    <ScrollView style={styles.container}>
        <AppHeader onPlusPress={()=>navigation.navigate(screenNames.ADD_JOB_STEP1)} showPlusIcon={true} showBackButton={false} title='Preferred Jobs'/>
          <View style={styles.headerRow}>
                <Text style={styles.jobTitle}>Event Coordinator</Text>
                <TouchableOpacity>
                  <Icon name="create-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
      <View style={styles.contentBox}>
        {/* Job Info */}
        <Text style={styles.label}>
          Job title: <Text style={styles.value}>Event Coordinator</Text>
        </Text>
        <Text style={styles.label}>
          Job type: <Text style={styles.value}>Part-time</Text>
        </Text>
        <Text style={styles.label}>
          Total experience: <Text style={styles.value}>3 Years, 4 Months</Text>
        </Text>
        <Text style={styles.label}>
          Expected salary:{' '}
          <Text style={styles.value}>$12.00/hr To $23.00/hr</Text>
        </Text>

        {/* Availability Section */}
        <Text style={styles.sectionTitle}>Availability to work</Text>
        {availability.map((item, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.time}>{item.from}</Text>
            <Text style={styles.to}>To</Text>
            <Text style={styles.time}>{item.to}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentBox: {
    padding: 15,
  },
  label: {
    fontSize: 14,
    color: '#4F5D75',
    marginBottom: 6,
  },
  value: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    color: '#4F5D75',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  day: {
    flex: 2,
    fontSize: 14,
    color: '#4F5D75',
  },
  time: {
    flex: 1,
    fontSize: 14,
    color: '#4F5D75',
    textAlign: 'center',
  },
  to: {
    fontSize: 14,
    color: '#4F5D75',
    marginHorizontal: 4,
  },
    headerRow: {
    flexDirection: 'row',
    backgroundColor: '#5A6B8C',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
  },
  jobTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default PreferredJobs;
