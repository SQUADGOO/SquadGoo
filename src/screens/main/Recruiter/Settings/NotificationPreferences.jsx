import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppDatePickerModal from '@/core/AppDatePickerModal';
import PoolHeader from '../../../../core/PoolHeader';

const SHIFT_REMINDER_OPTIONS = [
  { label: '30 min', value: 0.5 },
  { label: '1 hr', value: 1 },
  { label: '2 hrs', value: 2 },
  { label: '4 hrs', value: 4 },
  { label: '6 hrs', value: 6 },
  { label: '12 hrs', value: 12 },
  { label: '24 hrs', value: 24 },
];

const formatTimeToDisplay = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m} ${period}`;
};

const makeTimeDate = (hours, minutes = 0) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const NotificationPreferences = ({ navigation }) => {
  // ======== NOTIFICATION CHANNELS ========
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  // ======== NOTIFICATION TYPES ========
  const [jobMatches, setJobMatches] = useState(true);
  const [offerAccepted, setOfferAccepted] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(false);
  const [shiftReminderHours, setShiftReminderHours] = useState(null);
  const [paymentConfirmations, setPaymentConfirmations] = useState(true);
  const [disputeAlerts, setDisputeAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // ======== QUIET HOURS ========
  const [quietHours, setQuietHours] = useState(false);
  const [quietStart, setQuietStart] = useState(makeTimeDate(22, 0));
  const [quietEnd, setQuietEnd] = useState(makeTimeDate(7, 0));

  const handleShiftReminderSelect = (hours) => {
    setShiftReminderHours(hours);
    setShiftReminders(true);
  };

  const handleShiftToggle = (val) => {
    setShiftReminders(val);
    if (!val) setShiftReminderHours(null);
  };

  const handleQuietStartChange = (date) => {
    setQuietStart(date);
    setQuietHours(true);
  };

  const handleQuietEndChange = (date) => {
    setQuietEnd(date);
    setQuietHours(true);
  };

  const handleQuietToggle = (val) => {
    setQuietHours(val);
  };

  // Toggle row helper
  const ToggleRow = ({ icon, label, description, value, onChange, highlight, extraInfo, children }) => (
    <View style={[styles.toggleCard, highlight && styles.toggleCardHighlight]}>
      <View style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.toggleLabelRow}>
            {icon ? (
              <AppText variant={Variant.caption} style={styles.toggleIcon}>{icon}</AppText>
            ) : null}
            <AppText variant={Variant.body} style={styles.toggleLabel}>
              {label}
            </AppText>
          </View>
          <AppText variant={Variant.caption} style={styles.toggleDesc}>
            {description}
          </AppText>
          {extraInfo ? (
            <AppText variant={Variant.caption} style={styles.extraInfo}>
              {extraInfo}
            </AppText>
          ) : null}
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: '#e0e0e0', true: colors.primary }}
          thumbColor={value ? colors.white : '#f4f3f4'}
        />
      </View>
      {children || null}
    </View>
  );

  return (
    <View style={styles.container}>
      <PoolHeader title="Notification Preferences" />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ======== NOTIFICATION CHANNELS ======== */}
        <AppText variant={Variant.caption} style={styles.sectionLabel}>
          NOTIFICATION CHANNELS
        </AppText>

        <ToggleRow
          icon="🔔"
          label="Push Notifications"
          description="Receive alerts on your device"
          value={pushEnabled}
          onChange={setPushEnabled}
        />
        <ToggleRow
          icon="📧"
          label="Email Notifications"
          description="Receive updates via email"
          value={emailEnabled}
          onChange={setEmailEnabled}
        />
        <ToggleRow
          icon="💬"
          label="SMS Notifications"
          description="Receive text messages to +61 412 345 678"
          extraInfo="Standard SMS rates may apply • Max 10 SMS/day"
          value={smsEnabled}
          onChange={setSmsEnabled}
          highlight
        />

        {/* ======== NOTIFICATION TYPES ======== */}
        <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2) }]}>
          NOTIFICATION TYPES
        </AppText>

        <ToggleRow
          label="Job Matches"
          description="When AI finds matching candidates"
          value={jobMatches}
          onChange={setJobMatches}
        />
        <ToggleRow
          label="Offer Accepted"
          description="When candidates accepted your job offers"
          value={offerAccepted}
          onChange={setOfferAccepted}
        />

        {/* Shift Reminders with hours selector */}
        <ToggleRow
          label="Shift Reminders"
          description="Remind before scheduled shifts"
          value={shiftReminders}
          onChange={handleShiftToggle}
        >
          <View style={styles.pickerSection}>
            <AppText variant={Variant.caption} style={styles.pickerLabel}>
              Remind me before:
            </AppText>
            <View style={styles.chipsRow}>
              {SHIFT_REMINDER_OPTIONS.map((opt) => {
                const selected = shiftReminderHours === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => handleShiftReminderSelect(opt.value)}
                    activeOpacity={0.7}
                  >
                    <AppText
                      variant={Variant.caption}
                      style={[styles.chipText, selected && styles.chipTextSelected]}
                    >
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ToggleRow>

        <ToggleRow
          label="Payment Confirmations"
          description="When payments are processed"
          value={paymentConfirmations}
          onChange={setPaymentConfirmations}
        />
        <ToggleRow
          label="Dispute Alerts"
          description="When a dispute is filed or resolved"
          value={disputeAlerts}
          onChange={setDisputeAlerts}
        />
        <ToggleRow
          label="System Updates"
          description="App updates and maintenance notices"
          value={systemUpdates}
          onChange={setSystemUpdates}
        />
        <ToggleRow
          label="Marketing & Promotions"
          description="New features and special offers"
          value={marketing}
          onChange={setMarketing}
        />

        {/* ======== QUIET HOURS ======== */}
        <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2) }]}>
          QUIET HOURS
        </AppText>

        <View style={styles.quietHoursCard}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.toggleLabelRow}>
                <AppText variant={Variant.caption} style={styles.toggleIcon}>🌙</AppText>
                <AppText variant={Variant.body} style={styles.toggleLabel}>
                  Quiet Hours
                </AppText>
              </View>
              <AppText variant={Variant.caption} style={styles.toggleDesc}>
                Pause non-urgent notifications during selected hours
              </AppText>
            </View>
            <Switch
              value={quietHours}
              onValueChange={handleQuietToggle}
              trackColor={{ false: '#e0e0e0', true: colors.primary }}
              thumbColor={quietHours ? colors.white : '#f4f3f4'}
            />
          </View>

          {/* Time pickers */}
          <View style={styles.quietTimeRow}>
            <View style={styles.quietTimeField}>
              <AppText variant={Variant.caption} style={styles.quietTimeLabel}>From</AppText>
              <AppDatePickerModal
                label=""
                value={quietStart}
                onChange={handleQuietStartChange}
                mode="time"
                placeholder="Start time"
              />
            </View>
            <View style={styles.quietTimeArrow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="arrow-forward"
                size={18}
                color={colors.gray}
              />
            </View>
            <View style={styles.quietTimeField}>
              <AppText variant={Variant.caption} style={styles.quietTimeLabel}>To</AppText>
              <AppDatePickerModal
                label=""
                value={quietEnd}
                onChange={handleQuietEndChange}
                mode="time"
                placeholder="End time"
              />
            </View>
          </View>

          {quietHours ? (
            <View style={styles.quietSummary}>
              <VectorIcons name={iconLibName.Ionicons} iconName="moon-outline" size={14} color="#92400E" />
              <AppText variant={Variant.caption} style={styles.quietSummaryText}>
                Notifications paused {formatTimeToDisplay(quietStart)} → {formatTimeToDisplay(quietEnd)}
              </AppText>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationPreferences;

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
    fontSize: getFontSize(11),
    marginBottom: hp(1.2),
  },
  toggleCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
    padding: wp(4),
    marginBottom: hp(1.2),
  },
  toggleCardHighlight: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
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
  extraInfo: {
    color: '#15803D',
    fontSize: getFontSize(11),
    marginTop: hp(0.4),
    fontWeight: '500',
  },

  // Shift reminder chips
  pickerSection: {
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  pickerLabel: {
    color: colors.gray,
    fontSize: getFontSize(11),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: hp(1),
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  chip: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    borderRadius: hp(2),
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.secondary,
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },

  // Quiet hours
  quietHoursCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: wp(4),
  },
  quietTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: wp(2),
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  quietTimeField: {
    flex: 1,
  },
  quietTimeLabel: {
    color: '#92400E',
    fontSize: getFontSize(11),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: hp(0.5),
  },
  quietTimeArrow: {
    paddingBottom: hp(1.5),
  },
  quietSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(1.2),
    backgroundColor: '#FEF3C7',
    borderRadius: hp(1.2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
  },
  quietSummaryText: {
    color: '#92400E',
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
});
