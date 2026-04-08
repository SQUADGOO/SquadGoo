import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import PoolHeader from '@/core/PoolHeader';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { screenNames } from '@/navigation/screenNames';
import { useSelector } from 'react-redux';

const ApplicationSettings = ({ navigation }) => {
  const { userInfo, role } = useSelector(state => state.auth);
  const isJobseeker = role?.toLowerCase() === 'jobseeker';
  const userName = userInfo?.name || userInfo?.firstName || 'User';
  const userEmail = userInfo?.email || 'user@example.com';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Handlers
  const handleProfile = () => {
    navigation.navigate(screenNames.PROFILE);
  };

  const handleStaffPreference = () => {
    navigation.navigate(screenNames.STAFF_PREFERENCES);
  };

  const handleNotificationPreferences = () => {
    navigation.navigate(screenNames.NOTIFICATION_PREFERENCES);
  };


  const handleSecurityPasswords = () => {
    navigation.navigate(screenNames.SECURITY_PASSWORD);
  };

  const handleSwitchProfile = () => {
    navigation.navigate(screenNames.SWITCH_PROFILE);
  };

  const handleAppSettings = () => {
    // Navigate to language/region settings or show inline
    // For now just show an alert
    Alert.alert('App Settings', 'Language, Region, and Currency settings coming soon.');
  };

  const handleHelpSupport = () => {
    navigation.navigate(screenNames.SUPPORT);
  };

  const handleLegalCompliance = () => {
    navigation.navigate(screenNames.LEGAL_COMPLIANCE);
  };

  const handleDeleteAccount = () => {
    navigation.navigate(screenNames.DELETE_ACCOUNT);
  };

  // SettingsRow component
  const SettingsRow = ({
    iconName,
    iconColor = colors.black,
    iconBg = '#f2f2f2',
    title,
    subtitle,
    onPress,
    danger = false,
  }) => (
    <TouchableOpacity
      style={[styles.row, danger ? styles.rowDanger : null]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.rowIconWrap, { backgroundColor: danger ? '#FDECEC' : iconBg }]}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName={iconName}
          size={18}
          color={danger ? '#DC3545' : iconColor}
        />
      </View>
      <View style={styles.rowContent}>
        <AppText variant={Variant.body} style={[styles.rowTitle, danger ? styles.rowTitleDanger : null]}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant={Variant.caption} style={styles.rowSubtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="chevron-forward"
        size={18}
        color={danger ? '#DC3545' : colors.gray}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <PoolHeader title="Settings" />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* PROFILE Section */}
        <AppText variant={Variant.caption} style={styles.sectionLabel}>
          PROFILE
        </AppText>
        <View style={styles.card}>
          <TouchableOpacity style={styles.profileRow} activeOpacity={0.7} onPress={handleProfile}>
            <View style={styles.profileAvatar}>
              <AppText variant={Variant.subTitle} style={styles.profileAvatarText}>{userInitials}</AppText>
            </View>
            <View style={styles.profileInfo}>
              <AppText variant={Variant.bodyMedium} style={styles.profileName}>{userName}</AppText>
              <AppText variant={Variant.caption} style={styles.profileEmail}>{userEmail}</AppText>
            </View>
            <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={18} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Settings rows */}
        <View style={[styles.card, { marginTop: hp(2) }]}>
          {isJobseeker ? (
            <SettingsRow
              iconName="briefcase-outline"
              iconBg="#EEF4FF"
              iconColor={colors.primary}
              title="Job Preferences"
              subtitle="Offer types, availability, locations"
              onPress={handleStaffPreference}
            />
          ) : (
            <SettingsRow
              iconName="options-outline"
              iconBg="#EEF4FF"
              iconColor={colors.primary}
              title="Staff Preference"
              subtitle="Quick Fill • AI Auto Hiring ON"
              onPress={handleStaffPreference}
            />
          )}
          <View style={styles.divider} />
          <SettingsRow
            iconName="notifications-outline"
            iconBg="#FFF4E6"
            iconColor="#F57C00"
            title="Notification Preferences"
            subtitle="Push, Email, SMS enabled"
            onPress={handleNotificationPreferences}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="lock-closed-outline"
            iconBg="#F3F1FF"
            iconColor="#5E35B1"
            title="Security & Privacy"
            subtitle="Password, 2FA, session management"
            onPress={handleSecurityPasswords}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="swap-horizontal-outline"
            iconBg="#EAF7F7"
            iconColor="#00796B"
            title="Switch Profile"
            subtitle={`Currently: ${isJobseeker ? 'Jobseeker' : 'Recruiter'}`}
            onPress={handleSwitchProfile}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="settings-outline"
            iconBg="#F0F0F0"
            iconColor="#555"
            title="App & Device"
            subtitle="Language, Region, Theme"
            onPress={handleAppSettings}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="help-circle-outline"
            iconBg="#E8F5E9"
            iconColor="#2E7D32"
            title="Support"
            subtitle="FAQ, Contact, Feedback"
            onPress={handleHelpSupport}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="document-text-outline"
            iconBg="#E3F2FD"
            iconColor="#1565C0"
            title="Legal & Compliance"
            subtitle="Privacy, Terms, Licenses"
            onPress={handleLegalCompliance}
          />
        </View>

        {/* DANGER ZONE */}
        <AppText variant={Variant.caption} style={[styles.sectionLabel, styles.dangerLabel]}>
          DANGER ZONE
        </AppText>
        <View style={[styles.card, styles.dangerCard]}>
          <SettingsRow
            iconName="trash-outline"
            title="Delete Account"
            subtitle="Permanently remove all data"
            onPress={handleDeleteAccount}
            danger
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ApplicationSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray || '#F6F7FB',
  },
  scroll: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  sectionLabel: {
    color: colors.gray,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: hp(1),
    fontSize: getFontSize(11),
  },
  dangerLabel: {
    color: '#DC3545',
    marginTop: hp(3),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dangerCard: {
    borderColor: '#FECACA',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border || '#E8E8EF',
    marginLeft: wp(4) + 38,
  },
  // Profile row
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
  },
  profileAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: getFontSize(18),
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.black || '#111',
    fontWeight: '700',
    fontSize: getFontSize(16),
  },
  profileEmail: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginTop: hp(0.2),
  },
  // Settings row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    backgroundColor: colors.white,
  },
  rowDanger: {
    backgroundColor: '#FFF5F5',
  },
  rowIconWrap: {
    height: 34,
    width: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    marginLeft: wp(3),
  },
  rowTitle: {
    color: colors.black || '#111',
    fontWeight: '600',
    fontSize: getFontSize(14),
  },
  rowTitleDanger: {
    color: '#DC3545',
  },
  rowSubtitle: {
    color: colors.gray,
    marginTop: hp(0.3),
    fontSize: getFontSize(12),
  },
  // Toggle rows (for modals)
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(4),
  },
  toggleLabel: {
    color: colors.secondary,
    fontWeight: '600',
  },
  toggleDesc: {
    color: colors.textPrimary,
    marginTop: hp(0.5),
  },
  // Bottom sheet / modal styles
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: wp(4),
    paddingTop: hp(1.2),
    paddingBottom: hp(3),
  },
  sheetHandle: {
    alignSelf: 'center',
    width: wp(12),
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border || '#E0E0E0',
    marginBottom: hp(1.2),
  },
  sheetTitle: {
    color: colors.black || '#111',
    fontWeight: '700',
    fontSize: getFontSize(16),
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  sheetSubtitle: {
    color: colors.gray,
    textAlign: 'center',
    marginBottom: hp(2),
    lineHeight: getFontSize(18),
  },
  sheetCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
    overflow: 'hidden',
  },
  tipSection: {
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(4),
  },
  tipTitle: {
    color: colors.black || '#111',
    fontWeight: '700',
    marginBottom: hp(0.8),
  },
  tipText: {
    color: colors.gray,
    lineHeight: getFontSize(18),
  },
  deleteIconWrap: {
    alignSelf: 'center',
    marginBottom: hp(1),
  },
  sheetButtonRow: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(2),
  },
  sheetButton: {
    flex: 1,
    paddingVertical: hp(1.6),
    borderRadius: 12,
    alignItems: 'center',
  },
  sheetButtonPrimary: {
    backgroundColor: colors.primary,
  },
  sheetButtonDanger: {
    backgroundColor: '#DC3545',
  },
  sheetButtonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
  },
  sheetButtonPrimaryText: {
    color: colors.white,
    fontWeight: '600',
  },
  sheetButtonSecondaryText: {
    color: colors.black || '#111',
    fontWeight: '600',
  },
});
