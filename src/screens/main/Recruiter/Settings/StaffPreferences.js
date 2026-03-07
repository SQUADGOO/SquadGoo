import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppDropDown from '@/core/AppDropDown'
import PoolHeader from '../../../../core/PoolHeader'

const StaffPreferences = () => {
  // Active tab: 'quick' or 'manual'
  const [activeTab, setActiveTab] = useState('quick')

  // Quick Fill state
  const [aiMatchingQuick, setAiMatchingQuick] = useState(true)
  const [aiHiringQuick, setAiHiringQuick] = useState(true)
  const [badgeQuick, setBadgeQuick] = useState('none')
  const [isDropdownVisibleQuick, setDropdownVisibleQuick] = useState(false)

  // Manual Fill state
  const [aiMatchingManual, setAiMatchingManual] = useState(true)
  const [badgeManual, setBadgeManual] = useState('none')
  const [isDropdownVisibleManual, setDropdownVisibleManual] = useState(false)

  const badgeOptions = [
    { label: 'None', value: 'none' },
    { label: 'Bronze', value: 'bronze' },
    { label: 'Silver', value: 'silver' },
    { label: 'Gold', value: 'gold' },
    { label: 'Platinum', value: 'platinum' },
  ]

  const renderToggleRow = (label, description, value, onChange, { icon, disabled = false, disabledNote } = {}) => (
    <View style={[styles.toggleCard, disabled && styles.toggleCardDisabled]}>
      <View style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.toggleLabelRow}>
            {icon ? (
              <AppText variant={Variant.caption} style={styles.toggleIcon}>{icon}</AppText>
            ) : null}
            <AppText variant={Variant.body} style={[styles.toggleLabel, disabled && styles.textDisabled]}>
              {label}
            </AppText>
          </View>
          <AppText variant={Variant.caption} style={[styles.toggleDesc, disabled && styles.textDisabled]}>
            {description}
          </AppText>
          {disabledNote ? (
            <AppText variant={Variant.caption} style={styles.disabledNote}>
              {disabledNote}
            </AppText>
          ) : null}
        </View>
        <View style={styles.toggleRight}>
          <Switch
            value={value}
            onValueChange={onChange}
            disabled={disabled}
            trackColor={{ false: '#e0e0e0', true: disabled ? '#ccc' : colors.primary }}
            thumbColor={value ? (disabled ? '#eee' : colors.white) : '#f4f3f4'}
          />
          {disabled ? (
            <AppText variant={Variant.caption} style={styles.disabledLabel}>Disabled</AppText>
          ) : null}
        </View>
      </View>
    </View>
  )

  const renderQuickFill = () => (
    <View>
      {/* Section header */}
      <AppText variant={Variant.h6} style={styles.sectionTitle}>
        Quick Fill Settings
      </AppText>
      <AppText variant={Variant.caption} style={styles.sectionDesc}>
        Automatically fill job offers with AI assistance
      </AppText>

      {/* Minimum Badge Requirements */}
      <View style={styles.fieldCard}>
        <AppText variant={Variant.body} style={styles.fieldLabel}>
          Minimum Badge Requirements
        </AppText>
        <AppText variant={Variant.caption} style={styles.fieldDesc}>
          Set minimum badge level for auto-matching candidates
        </AppText>
        <AppDropDown
          placeholder="Select Minimum Badge"
          options={badgeOptions}
          selectedValue={badgeQuick}
          onSelect={(val) => setBadgeQuick(val)}
          isVisible={isDropdownVisibleQuick}
          setIsVisible={setDropdownVisibleQuick}
        />
      </View>

      {/* AI Auto Matching toggle */}
      {renderToggleRow(
        'Enable AI Auto Matching',
        'Let AI find and suggest best candidates',
        aiMatchingQuick,
        setAiMatchingQuick,
        { icon: '🔍' }
      )}

      {/* AI Auto Hiring toggle */}
      {renderToggleRow(
        'Enable AI Auto Hiring',
        'Let AI automatically hire candidates on your behalf',
        aiHiringQuick,
        setAiHiringQuick,
        { icon: '⚡' }
      )}

      {/* Info note */}
      <View style={styles.infoNote}>
        <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={16} color={colors.primary} />
        <AppText variant={Variant.caption} style={styles.infoNoteText}>
          AI Auto Matching and Auto Hiring are enabled by default.{'\n'}You can change these settings anytime.
        </AppText>
      </View>
    </View>
  )

  const renderManualFill = () => (
    <View>
      {/* Section header */}
      <AppText variant={Variant.h6} style={styles.sectionTitle}>
        Manual Fill Settings
      </AppText>
      <AppText variant={Variant.caption} style={styles.sectionDesc}>
        You have full control over candidate selection process
      </AppText>

      {/* Manual Fill Mode info card */}
      <View style={styles.modeInfoCard}>
        <View style={styles.modeInfoHeader}>
          <AppText variant={Variant.caption} style={styles.modeInfoIcon}>📋</AppText>
          <AppText variant={Variant.bodyMedium} style={styles.modeInfoTitle}>Manual Fill Mode</AppText>
        </View>
        <AppText variant={Variant.caption} style={styles.modeInfoDesc}>
          You manually review and select each candidate. No automatic hiring will occur. You approve every match and hire decision.
        </AppText>
      </View>

      {/* Minimum Badge Requirements */}
      <View style={styles.fieldCard}>
        <AppText variant={Variant.body} style={styles.fieldLabel}>
          Minimum Badge Requirements
        </AppText>
        <AppText variant={Variant.caption} style={styles.fieldDesc}>
          Set minimum badge level for candidate suggestions
        </AppText>
        <AppDropDown
          placeholder="Select Minimum Badge"
          options={badgeOptions}
          selectedValue={badgeManual}
          onSelect={(val) => setBadgeManual(val)}
          isVisible={isDropdownVisibleManual}
          setIsVisible={setDropdownVisibleManual}
        />
      </View>

      {/* AI Auto Matching toggle (enabled) */}
      {renderToggleRow(
        'Enable AI Auto Matching',
        'AI will suggest candidates but YOU decide to hire',
        aiMatchingManual,
        setAiMatchingManual,
        { icon: '🔍', disabledNote: 'No automatic hiring - full manual control maintained' }
      )}

      {/* AI Auto Hiring toggle (disabled/greyed) */}
      {renderToggleRow(
        'AI Auto Hiring',
        'Not available in Manual Fill mode',
        false,
        () => { },
        { icon: '⚡', disabled: true, disabledNote: 'Switch to Quick Fill to enable automatic hiring' }
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <PoolHeader title='Staff Preference' />

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quick' && styles.tabActive]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('quick')}
        >
          <AppText variant={Variant.caption} style={styles.tabIcon}>⚡</AppText>
          <AppText
            variant={Variant.bodyMedium}
            style={[styles.tabText, activeTab === 'quick' && styles.tabTextActive]}
          >
            Quick Fill
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'manual' && styles.tabActive]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('manual')}
        >
          <AppText variant={Variant.caption} style={styles.tabIcon}>📋</AppText>
          <AppText
            variant={Variant.bodyMedium}
            style={[styles.tabText, activeTab === 'manual' && styles.tabTextActive]}
          >
            Manual Fill
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'quick' ? renderQuickFill() : renderManualFill()}
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
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: wp(4),
    marginTop: hp(2),
    backgroundColor: '#F3F4F6',
    borderRadius: hp(1.5),
    padding: hp(0.5),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.4),
    borderRadius: hp(1.2),
    gap: wp(1.5),
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabIcon: {
    fontSize: getFontSize(14),
  },
  tabText: {
    color: colors.gray,
    fontWeight: '600',
    fontSize: getFontSize(14),
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  sectionTitle: {
    color: colors.black || '#111',
    fontWeight: '700',
    fontSize: getFontSize(18),
    marginBottom: hp(0.5),
    marginTop: hp(1),
  },
  sectionDesc: {
    color: colors.gray,
    marginBottom: hp(2.5),
    fontSize: getFontSize(13),
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
    padding: wp(4),
    marginBottom: hp(2),
  },
  fieldLabel: {
    color: colors.secondary || '#111',
    fontWeight: '700',
    fontSize: getFontSize(14),
    marginBottom: hp(0.3),
  },
  fieldDesc: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(1.2),
  },
  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
    padding: wp(4),
    marginBottom: hp(2),
  },
  toggleCardDisabled: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E5E5',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  toggleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginBottom: hp(0.3),
  },
  toggleIcon: {
    fontSize: getFontSize(14),
  },
  toggleLabel: {
    color: colors.secondary || '#111',
    fontWeight: '700',
    fontSize: getFontSize(14),
  },
  toggleDesc: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  toggleRight: {
    alignItems: 'center',
    marginLeft: wp(2),
  },
  textDisabled: {
    color: '#B0B0B0',
  },
  disabledNote: {
    color: colors.primary,
    fontSize: getFontSize(11),
    marginTop: hp(0.5),
    fontWeight: '500',
  },
  disabledLabel: {
    color: '#B0B0B0',
    fontSize: getFontSize(10),
    marginTop: hp(0.3),
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(2),
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    marginTop: hp(0.5),
  },
  infoNoteText: {
    color: colors.primary,
    flex: 1,
    fontSize: getFontSize(12),
    lineHeight: getFontSize(17),
  },
  modeInfoCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: wp(4),
    marginBottom: hp(2),
  },
  modeInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginBottom: hp(0.8),
  },
  modeInfoIcon: {
    fontSize: getFontSize(14),
  },
  modeInfoTitle: {
    color: '#166534',
    fontWeight: '700',
    fontSize: getFontSize(14),
  },
  modeInfoDesc: {
    color: '#15803D',
    fontSize: getFontSize(12),
    lineHeight: getFontSize(17),
  },
})
