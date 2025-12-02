import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const formatJobTitle = (value) => {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  return value?.subCategory || value?.title || value?.category || '-';
};

const formatIndustry = (value) => {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  return value?.title || value?.name || value?.category || '-';
};

const PreferredJobs = ({ navigation }) => {
  const preferredJobs = useSelector(state => state?.jobSeekerPreferred?.preferredJobs || []);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <ScrollView style={styles.container}>
      <AppHeader onPlusPress={() => navigation.navigate(screenNames.ADD_JOB_STEP1)} showPlusIcon={true} showBackButton={false} title='Preferred Jobs' />
      {preferredJobs.length === 0 ? (
        <View style={styles.contentBox}>
          <Text style={styles.label}>No preferred jobs added yet. Tap + to add.</Text>
        </View>
      ) : (
        preferredJobs.map(job => (
          <View key={job.id}>
            <View style={styles.headerRow}>
              <Text style={styles.jobTitle}>
                {formatJobTitle(job.preferredJobTitle) !== '-'
                  ? formatJobTitle(job.preferredJobTitle)
                  : formatIndustry(job.preferredIndustry)}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate(screenNames.ADD_JOB_STEP1, { mode: 'edit', preferredJob: job })}>
                <Icon name="create-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.contentBox}>
              <Text style={styles.label}>
                Job title: <Text style={styles.value}>{formatJobTitle(job.preferredJobTitle)}</Text>
              </Text>
              <Text style={styles.label}>
                Job type: <Text style={styles.value}>{job.jobType || 'Part-time'}</Text>
              </Text>
              <Text style={styles.label}>
                Total experience: <Text style={styles.value}>{job.totalExperience || '-'}</Text>
              </Text>
              <Text style={styles.label}>
                Expected salary: <Text style={styles.value}>${job.expectedPayMin || '-'} /hr To ${job.expectedPayMax || '-'}/hr</Text>
              </Text>
              <Text style={styles.label}>
                Preferred industry: <Text style={styles.value}>{formatIndustry(job.preferredIndustry)}</Text>
              </Text>
              <Text style={styles.sectionTitle}>Availability to work</Text>
              {daysOfWeek.map((day) => {
                const enabledSet = new Set((job.daysAvailable || '').split(',').map(s => s.trim()).filter(Boolean));
                const enabled = enabledSet.has(day);
                return (
                  <View style={styles.row} key={`${job.id}_${day}`}>
                    <Text style={styles.day}>{day}</Text>
                    <Text style={styles.time}>{enabled ? (job.startTime || '-') : '-'}</Text>
                    <Text style={styles.to}>To</Text>
                    <Text style={styles.time}>{enabled ? (job.endTime || '-') : '-'}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))
      )}
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
