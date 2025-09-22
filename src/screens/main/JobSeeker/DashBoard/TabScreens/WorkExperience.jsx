import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';
import { hp } from '@/theme';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WorkExperienceScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
   <AppHeader onPlusPress={()=>navigation.navigate(screenNames.ADD_EXPERIENCE)} showPlusIcon={true} showBackButton={false} title='Work Experience'/>
      <View style={styles.headerRow}>
        <Text style={styles.jobTitle}>Bricklayer</Text>
        <TouchableOpacity>
          <Icon name="create-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Job Details */}
      <View style={styles.contentBox}>
        <Text style={styles.label}>
          Job title: <Text style={styles.value}>Bricklayer</Text>
        </Text>
        <Text style={styles.label}>
          Company name: <Text style={styles.value}>Xyz Pvt. Ltd.</Text>
        </Text>
        <Text style={styles.label}>
          Country: <Text style={styles.value}>Australia</Text>
        </Text>
        <Text style={styles.label}>
          Work duration: <Text style={styles.value}>Dec 2003 to Dec 2002</Text>
        </Text>

        <Text style={styles.sectionTitle}>Job description:</Text>
        <Text style={styles.description}>
          Lorem ipsum dollar sit amet consecutive mal Lorem ipsum dollar sit amet consecutive mal
          Lorem ipsum dollar sit amet consecutive mal Lorem ipsum dollar sit amet consecutive.
        </Text>

        {/* Payslip Buttons */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Experience:</Text>
        <View style={styles.paySlipRow}>
          <TouchableOpacity style={styles.paySlipBtn}>
            <Text style={styles.paySlipText}>Pay slip 1</Text>
            <MaterialCommunityIcons name="download" size={18} color="#FF9800" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.paySlipBtn}>
            <Text style={styles.paySlipText}>Pay slip 2</Text>
            <MaterialCommunityIcons name="download" size={18} color="#FF9800" />
          </TouchableOpacity>
        </View>
      </View>

      {/* References 1 */}
      <View style={styles.referenceBox}>
        <View style={styles.referenceHeader}>
          <Text style={styles.referenceTitle}>References 1</Text>
          <MaterialCommunityIcons name="check-decagram" size={22} color="#2979FF" />
        </View>
        <Text style={styles.label}>
          Full name: <Text style={styles.value}>John Doe</Text>
        </Text>
        <Text style={styles.label}>
          Position: <Text style={styles.value}>Senior Developer</Text>
        </Text>
        <Text style={styles.label}>
          Contact number: <Text style={styles.value}>+8 254 7485 125</Text>
        </Text>
        <Text style={styles.label}>
          Email address: <Text style={styles.value}>john_doe@gmail.com</Text>
        </Text>
      </View>

      {/* References 2 */}
      <View style={styles.referenceBox}>
        <View style={styles.referenceHeader}>
          <Text style={styles.referenceTitle}>References 2</Text>
          <MaterialCommunityIcons name="clock-outline" size={22} color="red" />
        </View>
        <Text style={styles.label}>
          Full name: <Text style={styles.value}>John Doe</Text>
        </Text>
        <Text style={styles.label}>
          Position: <Text style={styles.value}>Senior Developer</Text>
        </Text>
        <Text style={styles.label}>
          Contact number: <Text style={styles.value}>+8 254 7485 125</Text>
        </Text>
        <Text style={styles.label}>
          Email address: <Text style={styles.value}>john_doe@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  contentBox: {
    padding: 15,
  },
  label: {
    fontSize: 14,
    color: '#4F5D75',
    marginBottom: 4,
  },
  value: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
    color: '#4F5D75',
  },
  description: {
    color: '#4F5D75',
    fontSize: 13,
    lineHeight: 20,
  },
  paySlipRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  paySlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.6,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  paySlipText: {
    fontSize: 13,
    color: '#4F5D75',
    fontWeight: '500',
  },
  referenceBox: {
    borderTopWidth: 0.6,
    borderColor: '#ddd',
    padding: 15,
  },
  referenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  referenceTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#4F5D75',
  },
});

export default WorkExperienceScreen;
