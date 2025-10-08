import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppDropDown from '@/core/AppDropDown'
import PoolHeader from '../../../../core/PoolHeader'

const StaffPreferences = () => {
  const [aiMatching, setAiMatching] = useState(false)
  const [onlyProQuick, setOnlyProQuick] = useState(true)
  const [inAppProfiles, setInAppProfiles] = useState(false)
  const [squadMatching, setSquadMatching] = useState(false)

  const [onlyProManual, setOnlyProManual] = useState(false)
  const [squadProfiles, setSquadProfiles] = useState(false)

  const [badgeQuick, setBadgeQuick] = useState(null)
  const [badgeManual, setBadgeManual] = useState(null)
  const [isDropdownVisibleQuick, setDropdownVisibleQuick] = useState(false)
  const [isDropdownVisibleManual, setDropdownVisibleManual] = useState(false)

  const badgeOptions = [
    { label: 'Bronze', value: 'bronze' },
    { label: 'Silver', value: 'silver' },
    { label: 'Gold', value: 'gold' },
    { label: 'Platinum', value: 'platinum' },
  ]

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
  )

  return (
    <View style={styles.container}>
      {/* Header */}
     <PoolHeader title='Staff Preferences'/>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Quick Offer */}
        <AppText variant={Variant.h6} style={styles.sectionTitle}>
          Quick Offer Settings
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionDesc}>
          Configure automatic matching preferences
        </AppText>

        {renderToggleRow(
          'Enable AI Auto Matching',
          'Let AI automatically match candidates',
          aiMatching,
          setAiMatching
        )}

        <AppText variant={Variant.body} style={styles.inputLabel}>
          Minimum Badge Requirements
        </AppText>
        <AppDropDown
          placeholder="Select Minimum Badge"
          options={badgeOptions}
          selectedValue={badgeQuick}
          onSelect={(val) => setBadgeQuick(val)}
          isVisible={isDropdownVisibleQuick}
          setIsVisible={setDropdownVisibleQuick}
        />

        {renderToggleRow(
          'Only Pro Job Seekers',
          'Match only with verified pro members',
          onlyProQuick,
          setOnlyProQuick
        )}

        {renderToggleRow(
          'Only In-App Payment Profiles',
          'Match only with candidates accepting in-app payments',
          inAppProfiles,
          setInAppProfiles
        )}

        {renderToggleRow(
          'Enable Squad Matching',
          'Allow squad matching when multiple staff needed',
          squadMatching,
          setSquadMatching
        )}

        {/* Manual Offer */}
        <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(3) }]}>
          Manual Offer Settings
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionDesc}>
          Configure manual search preferences
        </AppText>

        <AppText variant={Variant.body} style={styles.inputLabel}>
          Minimum Badge Requirements
        </AppText>
        <AppDropDown
          placeholder="Select Minimum Badge"
          options={badgeOptions}
          selectedValue={badgeManual}
          onSelect={(val) => setBadgeManual(val)}
          isVisible={isDropdownVisibleManual}
          setIsVisible={setDropdownVisibleManual}
        />

        {renderToggleRow(
          'Only Pro Job Seekers',
          'Show only verified pro members',
          onlyProManual,
          setOnlyProManual
        )}

        {renderToggleRow(
          'Enable Squad Profiles',
          'Show squad profiles when multiple staff needed',
          squadProfiles,
          setSquadProfiles
        )}
      </ScrollView>
    </View>
  )
}

export default StaffPreferences

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: hp(5),
    paddingBottom: hp(3),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: wp(3),
  },
  headerTitle: {
    color: colors.white,
    fontWeight: '600',
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
  },
  inputLabel: {
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: hp(1),
  },
})
