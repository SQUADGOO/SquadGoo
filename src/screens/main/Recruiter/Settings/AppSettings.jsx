import React, {useState} from 'react';
import {StyleSheet, View, Switch, TouchableOpacity, Modal, Linking} from 'react-native';
import PoolHeader from '@/core/PoolHeader';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import {colors, hp, wp, getFontSize} from '@/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { screenNames } from '@/navigation/screenNames';

const ApplicationSettings = ({ navigation }) => {
  const PROFILE_SWITCH_EMAIL = 'support@squadgoo.com.au';

  // State management for switches
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showSwitchProfileModal, setShowSwitchProfileModal] = useState(false);
  const [notificationDraft, setNotificationDraft] = useState({
    push: true,
    email: false,
  });

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

  // Navigation handlers
  const handleManageAccount = () => {
    // navigation.navigate('AccountSettings');
    navigation.navigate(screenNames.PROFILE);
  };

  const handleTipsHelp = () => {
    navigation.navigate(screenNames.SUPPORT);
  };

  const handleSecurityPasswords = () => {
    setShowSecurityModal(true);
  };

  const handleSwitchProfile = () => {
    setShowSwitchProfileModal(true);
  };

  const handleSignOut = () => {
    setShowLogoutModal(true);
  };

  const confirmSignOut = () => {
    setShowLogoutModal(false);
    // Implement actual logout logic here
    console.log('User signed out');
    // navigation.navigate('Auth'); // Navigate to auth screen
  };

  const cancelSignOut = () => {
    setShowLogoutModal(false);
  };

  const closeSecurityModal = () => {
    setShowSecurityModal(false);
  };

  const closeSwitchProfileModal = () => {
    setShowSwitchProfileModal(false);
  };

  const handleSendSwitchProfileEmail = async () => {
    try {
      const subject = encodeURIComponent('Profile Switch Request');
      const body = encodeURIComponent(
        `Hi SquadGoo Support,\n\nI would like to request a profile switch.\n\nCurrent email: \nCurrent profile type: \nRequested profile type: \nReason: \n\nThanks,`
      );
      const mailtoUrl = `mailto:${PROFILE_SWITCH_EMAIL}?subject=${subject}&body=${body}`;
      await Linking.openURL(mailtoUrl);
    } catch (e) {
      // ignore errors (no mail client etc.)
    }
  };

  const openNotificationPreferences = () => {
    setNotificationDraft({
      push: pushNotifications,
      email: emailNotifications,
    });
    setShowNotificationModal(true);
  };

  const cancelNotificationPreferences = () => {
    setShowNotificationModal(false);
  };

  const saveNotificationPreferences = () => {
    setPushNotifications(notificationDraft.push);
    setEmailNotifications(notificationDraft.email);
    setShowNotificationModal(false);
  };

  const getNotificationSummary = () => {
    const enabled = [];
    if (pushNotifications) enabled.push('Push');
    if (emailNotifications) enabled.push('Email');
    return enabled.length ? enabled.join(', ') : 'Off';
  };

  const SettingsRow = ({
    iconName,
    iconColor = colors.black,
    iconBg = colors.lightGray || '#f2f2f2',
    title,
    subtitle,
    rightText,
    onPress,
    danger = false,
  }) => {
    return (
      <TouchableOpacity
        style={[styles.row, danger ? styles.rowDanger : null]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={[styles.rowIconWrap, { backgroundColor: iconBg }]}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName={iconName}
            size={18}
            color={danger ? (colors.red || '#dc3545') : iconColor}
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

        {rightText ? (
          <AppText variant={Variant.caption} style={styles.rowRightText}>
            {rightText}
          </AppText>
        ) : null}

        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="chevron-forward"
          size={18}
          color={colors.gray}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <PoolHeader title='App Settings' />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Notifications */}
        <AppText variant={Variant.caption} style={styles.sectionLabel}>
          NOTIFICATIONS
        </AppText>
        <View style={styles.card}>
          <SettingsRow
            iconName="notifications-outline"
            title="Notification Preferences"
            subtitle="Choose how you want to receive updates"
            rightText={getNotificationSummary()}
            onPress={openNotificationPreferences}
            iconBg={'#EEF4FF'}
            iconColor={colors.primary}
          />
        </View>

        {/* Account */}
        <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2.5) }]}>
          ACCOUNT
        </AppText>
        <View style={styles.card}>
          <SettingsRow
            iconName="person-circle-outline"
            title="Manage Account/Profile"
            subtitle="Profile, business info, and details"
            onPress={handleManageAccount}
            iconBg={'#F2F8F3'}
            iconColor={'#2E7D32'}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="help-circle-outline"
            title="Tips & Help"
            subtitle="FAQs and support"
            onPress={handleTipsHelp}
            iconBg={'#FFF4E6'}
            iconColor={'#F57C00'}
          />
        </View>

        {/* Security */}
        <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2.5) }]}>
          SECURITY
        </AppText>
        <View style={styles.card}>
          <SettingsRow
            iconName="lock-closed-outline"
            title="Security & Passwords"
            subtitle="Password, privacy, and security"
            onPress={handleSecurityPasswords}
            iconBg={'#F3F1FF'}
            iconColor={'#5E35B1'}
          />
        </View>

        {/* Profile */}
        <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2.5) }]}>
          PROFILE
        </AppText>
        <View style={styles.card}>
          <SettingsRow
            iconName="swap-horizontal-outline"
            title="Switch Profile"
            subtitle="Change to another account type"
            onPress={handleSwitchProfile}
            iconBg={'#EAF7F7'}
            iconColor={'#00796B'}
          />
        </View>

        {/* Sign out */}
        <View style={[styles.card, { marginTop: hp(2.5) }]}>
          <SettingsRow
            iconName="log-out-outline"
            title="Sign Out"
            subtitle="Sign out of your account on this device"
            onPress={handleSignOut}
            danger
            iconBg={'#FDECEC'}
          />
        </View>

        {/* Notification Preferences Modal */}
        <Modal
          visible={showNotificationModal}
          transparent
          animationType="slide"
          onRequestClose={cancelNotificationPreferences}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sheetBackdrop}
            onPress={cancelNotificationPreferences}
          >
            <TouchableOpacity activeOpacity={1} style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <AppText variant={Variant.h6} style={styles.sheetTitle}>
                Notification Preferences
              </AppText>
              <AppText variant={Variant.caption} style={styles.sheetSubtitle}>
                Choose how you want to receive notifications.
              </AppText>

              <View style={styles.sheetCard}>
                {renderToggleRow(
                  'Push Notifications',
                  'Receive notifications on your device',
                  notificationDraft.push,
                  (val) => setNotificationDraft((p) => ({ ...p, push: val }))
                )}
                <View style={styles.divider} />
                {renderToggleRow(
                  'Email Notifications',
                  'Receive updates via email',
                  notificationDraft.email,
                  (val) => setNotificationDraft((p) => ({ ...p, email: val }))
                )}
              </View>

              <View style={styles.sheetButtonRow}>
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonSecondary]}
                  onPress={cancelNotificationPreferences}
                >
                  <AppText variant={Variant.body} style={styles.sheetButtonSecondaryText}>
                    Cancel
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonPrimary]}
                  onPress={saveNotificationPreferences}
                >
                  <AppText variant={Variant.body} style={styles.sheetButtonPrimaryText}>
                    Save
                  </AppText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal
          visible={showLogoutModal}
          transparent
          animationType="slide"
          onRequestClose={cancelSignOut}
        >
          <TouchableOpacity activeOpacity={1} style={styles.sheetBackdrop} onPress={cancelSignOut}>
            <TouchableOpacity activeOpacity={1} style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <AppText variant={Variant.h6} style={styles.sheetTitle}>
                Sign Out
              </AppText>
              <AppText variant={Variant.caption} style={styles.sheetSubtitle}>
                Are you sure you want to sign out of your account?
              </AppText>

              <View style={styles.sheetButtonRow}>
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonSecondary]}
                  onPress={cancelSignOut}
                >
                  <AppText variant={Variant.body} style={styles.sheetButtonSecondaryText}>
                    Cancel
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonDanger]}
                  onPress={confirmSignOut}
                >
                  <AppText variant={Variant.body} style={styles.sheetButtonPrimaryText}>
                    Sign Out
                  </AppText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Security & Passwords Tips Modal */}
        <Modal
          visible={showSecurityModal}
          transparent
          animationType="slide"
          onRequestClose={closeSecurityModal}
        >
          <TouchableOpacity activeOpacity={1} style={styles.sheetBackdrop} onPress={closeSecurityModal}>
            <TouchableOpacity activeOpacity={1} style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <AppText variant={Variant.h6} style={styles.sheetTitle}>
                Security & Passwords
              </AppText>
              <AppText variant={Variant.caption} style={styles.sheetSubtitle}>
                Tips to keep your account secure and private.
              </AppText>

              <View style={styles.sheetCard}>
                <View style={styles.tipSection}>
                  <AppText variant={Variant.body} style={styles.tipTitle}>
                    Security Tips
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.tipText}>
                    • Don’t share OTPs or verification codes.{'\n'}
                    • Only sign in on trusted devices.{'\n'}
                    • Log out on shared phones or tablets.{'\n'}
                    • Beware of suspicious links and messages.
                  </AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.tipSection}>
                  <AppText variant={Variant.body} style={styles.tipTitle}>
                    Password Tips
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.tipText}>
                    • Use at least 8–12 characters.{'\n'}
                    • Combine letters, numbers, and symbols.{'\n'}
                    • Avoid reusing old passwords.{'\n'}
                    • Avoid obvious words (name, DOB, etc.).
                  </AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.tipSection}>
                  <AppText variant={Variant.body} style={styles.tipTitle}>
                    Privacy
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.tipText}>
                    • Keep your contact details up to date.{'\n'}
                    • Review what you share in your profile.{'\n'}
                    • Only communicate through trusted channels.
                  </AppText>
                </View>
              </View>

              <View style={styles.sheetButtonRow}>
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonPrimary]}
                  onPress={closeSecurityModal}
                >
                  <AppText variant={Variant.body} style={styles.sheetButtonPrimaryText}>
                    Done
                  </AppText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Switch Profile Modal */}
        <Modal
          visible={showSwitchProfileModal}
          transparent
          animationType="slide"
          onRequestClose={closeSwitchProfileModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sheetBackdrop}
            onPress={closeSwitchProfileModal}
          >
            <TouchableOpacity activeOpacity={1} style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <AppText variant={Variant.h6} style={styles.sheetTitle}>
                Switch Profile
              </AppText>
              <AppText variant={Variant.caption} style={styles.sheetSubtitle}>
                To switch profile, you can register with a new email or send a request from your registered email.
              </AppText>

              <View style={styles.sheetCard}>
                <View style={styles.tipSection}>
                  <AppText variant={Variant.body} style={styles.tipTitle}>
                    Option 1: Register with a new email
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.tipText}>
                    • Sign out from this account.{'\n'}
                    • Create a new account using a different email.{'\n'}
                    • Choose the profile type you want during registration.
                  </AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.tipSection}>
                  <AppText variant={Variant.body} style={styles.tipTitle}>
                    Option 2: Request via email
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.tipText}>
                    • Send us a request from your registered email.{'\n'}
                    • Include current profile type and requested profile type.
                  </AppText>
                </View>
              </View>

              <View style={styles.sheetButtonRow}>
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonSecondary]}
                  onPress={closeSwitchProfileModal}
                >
                  <AppText variant={Variant.body} style={styles.sheetButtonSecondaryText}>
                    Close
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonPrimary]}
                  onPress={handleSendSwitchProfileEmail}
                >
                  <AppText variant={Variant.body} style={styles.sheetButtonPrimaryText}>
                    Send Email Request
                  </AppText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border || '#E8E8EF',
    marginLeft: wp(4) + 38,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    backgroundColor: colors.white,
  },
  rowDanger: {
    backgroundColor: colors.white,
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
    color: colors.black,
    fontWeight: '600',
  },
  rowTitleDanger: {
    color: colors.red || '#dc3545',
  },
  rowSubtitle: {
    color: colors.gray,
    marginTop: hp(0.3),
  },
  rowRightText: {
    color: colors.gray,
    marginRight: wp(2),
  },
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
  // Bottom sheet styles
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
    color: colors.black,
    fontWeight: '700',
    fontSize: getFontSize(16),
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  sheetSubtitle: {
    color: colors.gray,
    textAlign: 'center',
    marginBottom: hp(2),
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
    color: colors.black,
    fontWeight: '700',
    marginBottom: hp(0.8),
  },
  tipText: {
    color: colors.gray,
    lineHeight: getFontSize(18),
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
    backgroundColor: colors.red || '#dc3545',
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
    color: colors.black,
    fontWeight: '600',
  },
});
