import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';

const TABS = {
  SUMMARY: 'summary',
  HISTORY: 'history',
};

const CandidateHours = ({ route }) => {
  const { job, candidate } = route.params || {};
  const [activeTab, setActiveTab] = useState(TABS.SUMMARY);

  const summaryStats = useMemo(() => {
    const hourlyRate =
      job?.salaryMin ||
      job?.salaryRange?.match(/\d+/)?.[0] ||
      35;
    return {
      totalHours: 42.5,
      weekHours: 18,
      lastSession: 'Today • 02:45 PM',
      hourlyRate: Number(hourlyRate),
      pendingApproval: 6.5,
    };
  }, [job]);

  const historyEntries = useMemo(
    () => [
      {
        id: `${job?.id || 'job'}-hist-1`,
        date: 'Mon, 25 Nov 2024',
        shift: '08:00 AM – 04:30 PM',
        hours: 8.5,
        break: '30 min',
        notes: 'Completed level 12 repaint ahead of schedule.',
      },
      {
        id: `${job?.id || 'job'}-hist-2`,
        date: 'Tue, 26 Nov 2024',
        shift: '09:00 AM – 05:00 PM',
        hours: 8,
        break: '45 min',
        notes: 'QA walkthrough + minor touch ups.',
      },
      {
        id: `${job?.id || 'job'}-hist-3`,
        date: 'Wed, 27 Nov 2024',
        shift: '07:15 AM – 03:30 PM',
        hours: 8.25,
        break: '30 min',
        notes: 'Exterior facade coating. Weather delay +15 min.',
      },
    ],
    [job?.id],
  );

  const renderSummary = () => (
    <>
      <View style={styles.summaryCard}>
        <AppText variant={Variant.caption} style={styles.sectionLabel}>
          Candidate
        </AppText>
        <AppText variant={Variant.subTitle} style={styles.primaryText}>
          {candidate?.name || candidate?.candidateName || 'Candidate'}
        </AppText>
        <AppText variant={Variant.caption} style={styles.secondaryText}>
          {job?.title || job?.jobTitle || 'Quick search job'}
        </AppText>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <AppText variant={Variant.caption} style={styles.statLabel}>
              Total Hours
            </AppText>
            <AppText variant={Variant.title} style={styles.statValue}>
              {summaryStats.totalHours.toFixed(1)}h
            </AppText>
          </View>
          <View style={styles.statCard}>
            <AppText variant={Variant.caption} style={styles.statLabel}>
              This Week
            </AppText>
            <AppText variant={Variant.title} style={styles.statValue}>
              {summaryStats.weekHours.toFixed(1)}h
            </AppText>
          </View>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <AppText variant={Variant.caption} style={styles.statLabel}>
              Pending Approval
            </AppText>
            <AppText variant={Variant.title} style={styles.statValue}>
              {summaryStats.pendingApproval.toFixed(1)}h
            </AppText>
          </View>
          <View style={styles.statCard}>
            <AppText variant={Variant.caption} style={styles.statLabel}>
              Hourly Rate
            </AppText>
            <AppText variant={Variant.title} style={styles.statValue}>
              ${summaryStats.hourlyRate}/hr
            </AppText>
          </View>
        </View>

        <View style={styles.infoRow}>
          <AppText variant={Variant.caption} style={styles.statLabel}>
            Last Session
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.primaryText}>
            {summaryStats.lastSession}
          </AppText>
        </View>
      </View>
    </>
  );

  const renderHistory = () => (
    <View style={styles.historySection}>
      {historyEntries.map(entry => (
        <View key={entry.id} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <AppText variant={Variant.bodyMedium} style={styles.primaryText}>
              {entry.date}
            </AppText>
            <AppText variant={Variant.caption} style={styles.secondaryText}>
              {entry.shift}
            </AppText>
          </View>
          <View style={styles.historyStatsRow}>
            <View style={styles.historyStat}>
              <AppText variant={Variant.caption} style={styles.statLabel}>
                Hours
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.statValue}>
                {entry.hours.toFixed(2)}h
              </AppText>
            </View>
            <View style={styles.historyStat}>
              <AppText variant={Variant.caption} style={styles.statLabel}>
                Break
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.statValue}>
                {entry.break}
              </AppText>
            </View>
          </View>
          <AppText variant={Variant.caption} style={styles.sectionLabel}>
            Notes
          </AppText>
          <AppText variant={Variant.body} style={styles.historyNotes}>
            {entry.notes}
          </AppText>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Track Hours" showTopIcons={false} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabSwitcher}>
          {Object.values(TABS).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.85}
            >
              <AppText
                variant={Variant.bodyMedium}
                style={[
                  styles.tabLabel,
                  activeTab === tab && styles.tabLabelActive,
                ]}
              >
                {tab === TABS.SUMMARY ? 'Summary' : 'History'}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === TABS.SUMMARY ? renderSummary() : renderHistory()}
      </ScrollView>
    </View>
  );
};

export default CandidateHours;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(4),
    gap: hp(2),
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(5),
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: hp(5),
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    elevation: 2,
  },
  tabLabel: {
    color: colors.gray,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.secondary,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: wp(5),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    gap: hp(1.5),
  },
  sectionLabel: {
    color: colors.gray,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.secondary,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.gray,
  },
  statGrid: {
    flexDirection: 'row',
    gap: wp(3),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    padding: wp(4),
    gap: hp(0.5),
  },
  statLabel: {
    color: colors.gray,
  },
  statValue: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: getFontSize(16),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historySection: {
    gap: hp(1.5),
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: wp(4),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    gap: hp(1),
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyStatsRow: {
    flexDirection: 'row',
    gap: wp(5),
  },
  historyStat: {
    flex: 1,
  },
  historyNotes: {
    color: colors.secondary,
    lineHeight: 18,
  },
});

