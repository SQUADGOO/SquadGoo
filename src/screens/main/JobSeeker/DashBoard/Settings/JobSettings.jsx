import React, {useState} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import AppDropDown from '@/core/AppDropDown';
import CustomCalendar from '@/core/CustomCalendar';
import {colors, hp} from '@/theme';
import { ScrollView } from 'react-native-gesture-handler';

const JobSettings = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [postFilter, setPostFilter] = useState('all');
  const [postFilter1, setPostFilter1] = useState('all');

  const postOptions = [
    {label: 'All Post', value: 'all'},
    {label: 'Last week', value: 'last_week'},
    {label: 'Last 2 weeks', value: 'last_2_weeks'},
    {label: 'Last month', value: 'last_month'},
  ];

  const handlePostFilterChange = (value, option) => {
    setPostFilter(value);
    console.log('Post filter changed to:', option.label);
  };

  const handleDateSelect = date => {
    console.log('Selected Date:', date);
  };

  return (
    <>
      <AppHeader title="Job Settings" showTopIcons={false} />
      <ScrollView>

      <View style={styles.container}>
        <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
          Job Offer Preferences
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
          Configure how you receive job offers
        </AppText>

        {/* Dropdown: Type of Job Offers */}
        <AppText variant={Variant.caption} style={styles.label}>
          Type of Job Offers
        </AppText>
        <AppDropDown
          placeholder="All Post"
          options={postOptions}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          selectedValue={postFilter}
          onSelect={handlePostFilterChange}
          style={[styles.filterDropdown,{zindex: 1}]}
        />

        {/* Dropdown: Offers from User Type */}
        <AppText variant={Variant.caption} style={styles.label}>
          Offers from User Type
        </AppText>
        <AppDropDown
          placeholder="All Post"
          options={postOptions}
          isVisible={isVisible1}
          setIsVisible={setIsVisible1}
          selectedValue={postFilter1}
          onSelect={handlePostFilterChange}
          style={styles.filterDropdown}
        />

        {/* Switches */}
        <AppText variant={Variant.caption} style={styles.label}>
          Quick Offer Settings
        </AppText>
        <View style={styles.switchRow}>
          <Switch />
          <AppText variant={Variant.caption} style={styles.switchLabel}>
            Only receive offers with platform-handled payments
          </AppText>
        </View>

        <View style={styles.switchRow}>
          <Switch />
          <AppText variant={Variant.caption} style={styles.switchLabel}>
            Only from recruiters with sufficient balance
          </AppText>
        </View>

        <View style={styles.switchRow}>
          <Switch />
          <AppText variant={Variant.caption} style={styles.switchLabel}>
            Only from PRO badge or above recruiters
          </AppText>
        </View>

        <AppText variant={Variant.caption} style={styles.label}>
          Availability for Quick Offers
        </AppText>
        <CustomCalendar onDateSelect={handleDateSelect} />

        <AppText variant={Variant.caption} style={styles.label}>
          Receive offers within (km from home)
        </AppText>
        <AppText variant={Variant.body} style={styles.radiusText}>
          Radius: 25 km (configurable in profile)
        </AppText>
      </View>
      <View style={{height: 20}} />
      </ScrollView>

    </>
  );
};

export default JobSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 2,
    color: colors.black,
  },
  sectionSubtitle: {
    marginBottom: 2,
    color: colors.text,
  },
  label: {
    marginTop: hp(2.5),
    marginVertical: 4,
    color: colors.textSecondary
  },
  filterDropdown: {
    flex: 1,
    marginBottom: 12,
    borderRadius: 5,
    marginVertical: hp(1),
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  switchLabel: {
    marginLeft: 8,
    flex: 1,
  },
  radiusText: {
    marginTop: hp(0.5),
    color: colors.textSecondary,
    fontSize: 14,
  },
});
