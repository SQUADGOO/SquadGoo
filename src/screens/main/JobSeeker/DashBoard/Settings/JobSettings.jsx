import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import AppDropDown from '@/core/AppDropDown';
import CustomCalendar from '@/core/CustomCalendar';
import {colors, hp} from '@/theme';
import { ScrollView } from 'react-native-gesture-handler';
import {updateJobSeekerQuickSettings, updateJobOfferType, selectJobSeekerQuickSettings, selectJobOfferType} from '@/store/settingsSlice';

const JobSettings = () => {
  const dispatch = useDispatch();
  const quickSettings = useSelector(selectJobSeekerQuickSettings);
  const jobOfferType = useSelector(selectJobOfferType);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [postFilter, setPostFilter] = useState(jobOfferType || 'both');
  const [postFilter1, setPostFilter1] = useState('both');
  
  // Local state for switches
  const [onlyPlatformPayment, setOnlyPlatformPayment] = useState(quickSettings.onlyPlatformPayment || false);
  const [onlySufficientBalance, setOnlySufficientBalance] = useState(quickSettings.onlySufficientBalance || false);
  const [onlyProBadge, setOnlyProBadge] = useState(quickSettings.onlyProBadgeOrAbove || false);

  const jobOfferTypeOptions = [
    {label: 'Manual Only', value: 'manual'},
    {label: 'Quick Only', value: 'quick'},
    {label: 'Both', value: 'both'},
  ];

  const userTypeOptions = [
    {label: 'Recruiter Only', value: 'recruiter'},
    {label: 'Individual Only', value: 'individual'},
    {label: 'Both', value: 'both'},
  ];

  const handleJobOfferTypeChange = (value, option) => {
    setPostFilter(value);
    dispatch(updateJobOfferType({ jobOfferType: value }));
  };

  const handleUserTypeChange = (value, option) => {
    setPostFilter1(value);
    dispatch(updateJobOfferType({ offersFromUserType: value }));
  };

  const handleOnlyPlatformPaymentChange = (value) => {
    setOnlyPlatformPayment(value);
    dispatch(updateJobSeekerQuickSettings({ onlyPlatformPayment: value }));
  };

  const handleOnlySufficientBalanceChange = (value) => {
    setOnlySufficientBalance(value);
    dispatch(updateJobSeekerQuickSettings({ onlySufficientBalance: value }));
  };

  const handleOnlyProBadgeChange = (value) => {
    setOnlyProBadge(value);
    dispatch(updateJobSeekerQuickSettings({ onlyProBadgeOrAbove: value }));
  };

  const handleDateSelect = date => {
    // Update availability settings
    const availability = quickSettings.availability || {};
    // In a real app, this would update the availability calendar
    dispatch(updateJobSeekerQuickSettings({ availability }));
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
          placeholder="Select job offer type"
          options={jobOfferTypeOptions}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          selectedValue={postFilter}
          onSelect={handleJobOfferTypeChange}
          style={[styles.filterDropdown,{zindex: 1}]}
        />

        {/* Dropdown: Offers from User Type */}
        <AppText variant={Variant.caption} style={styles.label}>
          Offers from User Type
        </AppText>
        <AppDropDown
          placeholder="Select user type"
          options={userTypeOptions}
          isVisible={isVisible1}
          setIsVisible={setIsVisible1}
          selectedValue={postFilter1}
          onSelect={handleUserTypeChange}
          style={styles.filterDropdown}
        />

        {/* Quick Offer Settings - Only show if quick offers are enabled */}
        {(postFilter === 'quick' || postFilter === 'both') && (
          <>
        <AppText variant={Variant.caption} style={styles.label}>
          Quick Offer Settings
        </AppText>
        <View style={styles.switchRow}>
              <Switch 
                value={onlyPlatformPayment}
                onValueChange={handleOnlyPlatformPaymentChange}
              />
          <AppText variant={Variant.caption} style={styles.switchLabel}>
            Only receive offers with platform-handled payments
          </AppText>
        </View>

        <View style={styles.switchRow}>
              <Switch 
                value={onlySufficientBalance}
                onValueChange={handleOnlySufficientBalanceChange}
              />
          <AppText variant={Variant.caption} style={styles.switchLabel}>
            Only from recruiters with sufficient balance
          </AppText>
        </View>

        <View style={styles.switchRow}>
              <Switch 
                value={onlyProBadge}
                onValueChange={handleOnlyProBadgeChange}
              />
          <AppText variant={Variant.caption} style={styles.switchLabel}>
            Only from PRO badge or above recruiters
          </AppText>
        </View>
          </>
        )}

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
