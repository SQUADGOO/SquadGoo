import React, {useState} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import PoolHeader from '@/core/PoolHeader';
import AppText, {Variant} from '@/core/AppText';
import AppDropDown from '@/core/AppDropDown';
import CustomCalendar from '@/core/CustomCalendar';
import {colors, hp, wp, getFontSize} from '@/theme';
import { ScrollView } from 'react-native-gesture-handler';

const JobSettings = () => {
  // Dropdown states
  const [isJobTypeVisible, setIsJobTypeVisible] = useState(false);
  const [isUserTypeVisible, setIsUserTypeVisible] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState('both');
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  // Switch states
  const [platformPayments, setPlatformPayments] = useState(false);
  const [sufficientBalance, setSufficientBalance] = useState(false);
  const [proBadgeOnly, setProBadgeOnly] = useState(false);
  const [aiMatching, setAiMatching] = useState(false);
  const [onlyProSeekers, setOnlyProSeekers] = useState(false);
  const [inAppPayments, setInAppPayments] = useState(false);
  const [squadMatching, setSquadMatching] = useState(false);

  // Dropdown options
  const jobTypeOptions = [
    {label: 'Both Manual & Quick', value: 'both'},
    {label: 'Manual Only', value: 'manual'},
    {label: 'Quick Only', value: 'quick'},
  ];

  const userTypeOptions = [
    {label: 'All Users', value: 'all'},
    {label: 'Recruiters Only', value: 'recruiters'},
    {label: 'Individuals Only', value: 'individuals'},
  ];

  // Toggle row helper function
  const renderToggleRow = (label, description, value, onChange) => (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <AppText variant={Variant.body} style={styles.toggleLabel}>
          {label}
        </AppText>
        <AppText variant={Variant.caption} style={styles.toggleDesc}>
          {description}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#e0e0e0', true: colors.primary }}
        thumbColor={value ? colors.white : '#f4f3f4'}
      />
    </View>
  );

  const handleJobTypeChange = (value) => {
    setJobTypeFilter(value);
    console.log('Job type filter changed to:', value);
  };

  const handleUserTypeChange = (value) => {
    setUserTypeFilter(value);
    console.log('User type filter changed to:', value);
  };

  const handleDateSelect = date => {
    console.log('Selected Date:', date);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <PoolHeader title='Job Settings' />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Job Offer Preferences */}
        <AppText variant={Variant.h6} style={styles.sectionTitle}>
          Job Offer Preferences
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionDesc}>
          Configure how you receive job offers
        </AppText>

        <AppText variant={Variant.body} style={styles.inputLabel}>
          Type of Job Offers
        </AppText>
        <AppDropDown
          placeholder="Select Job Type"
          options={jobTypeOptions}
          isVisible={isJobTypeVisible}
          setIsVisible={setIsJobTypeVisible}
          selectedValue={jobTypeFilter}
          onSelect={handleJobTypeChange}
          style={[styles.filterDropdown, { zIndex: 2 }]}
        />

        <AppText variant={Variant.body} style={styles.inputLabel}>
          Offers from User Type
        </AppText>
        <AppDropDown
          placeholder="Select User Type"
          options={userTypeOptions}
          isVisible={isUserTypeVisible}
          setIsVisible={setIsUserTypeVisible}
          selectedValue={userTypeFilter}
          onSelect={handleUserTypeChange}
          style={[styles.filterDropdown, { zIndex: 1 }]}
        />

        {/* Quick Offer Settings */}
        <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(3) }]}>
          Quick Offer Settings
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionDesc}>
          Configure preferences for receiving quick job offers
        </AppText>

        {renderToggleRow(
          'Platform-handled payments only',
          'Only receive offers with in-app payment handling',
          platformPayments,
          setPlatformPayments
        )}

        {renderToggleRow(
          'Sufficient balance required',
          'Only from recruiters with enough balance for full job',
          sufficientBalance,
          setSufficientBalance
        )}

        {renderToggleRow(
          'PRO badge recruiters only',
          'Only receive offers from verified PRO recruiters',
          proBadgeOnly,
          setProBadgeOnly
        )}

        {/* Quick Search Settings */}
        <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(3) }]}>
          Quick Search Settings
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionDesc}>
          Configure automatic matching preferences
        </AppText>

        {renderToggleRow(
          'Enable AI auto-matching',
          'Let AI automatically match candidates',
          aiMatching,
          setAiMatching
        )}

        {renderToggleRow(
          'Only PRO job seekers',
          'Match only with verified pro members',
          onlyProSeekers,
          setOnlyProSeekers
        )}

        {renderToggleRow(
          'In-app payment profiles only',
          'Match only with candidates accepting in-app payments',
          inAppPayments,
          setInAppPayments
        )}

        {renderToggleRow(
          'Enable squad matching',
          'Allow squad matching when multiple staff needed',
          squadMatching,
          setSquadMatching
        )}

        {/* Availability Settings */}
        <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(3) }]}>
          Availability Settings
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionDesc}>
          Select dates when you are available for quick offers
        </AppText>
        <CustomCalendar onDateSelect={handleDateSelect} />
      </ScrollView>
    </View>
  );
};

export default JobSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  sectionTitle: {
    color: colors.black,
    fontWeight: '700',
    fontSize: getFontSize(16),
    marginBottom: hp(0.5),
  },
  sectionDesc: {
    color: colors.textPrimary,
    marginBottom: hp(2),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    marginTop: hp(1),
  },
  toggleLabel: {
    color: colors.secondary,
    fontWeight: '600',
  },
  toggleDesc: {
    color: colors.textPrimary,
    marginTop: hp(0.5),
  },
  inputLabel: {
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: hp(1),
  },
  filterDropdown: {
    marginBottom: hp(2),
  },
});
