import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import { screenNames } from '@/navigation/screenNames';
import { selectWorkSessionsForJobCandidate } from '@/store/quickSearchSlice';
import { selectManualWorkSessionsForJobCandidate } from '@/store/manualOffersSlice';

const TABS = {
  SUMMARY: 'summary',
  HISTORY: 'history',
};

const CandidateHours = ({ route, navigation }) => {
  const { job, candidate, source } = route.params || {};
  const [activeTab, setActiveTab] = useState(TABS.SUMMARY);

  const jobId = job?.id || job?.jobId || null;
  const candidateId = candidate?.id || candidate?.candidateId || null;

  const sessions = useSelector(state => {
    if (!jobId || !candidateId) return [];
    if (source === 'manual') {
      return selectManualWorkSessionsForJobCandidate(state, jobId, candidateId);
    }
    return selectWorkSessionsForJobCandidate(state, jobId, candidateId);
  });

  const getSalarySuffix = (salaryType) => {
    const t = String(salaryType || '').trim().toLowerCase();
    if (t === 'hourly') return '/hr';
    if (t === 'daily') return '/day';
    if (t === 'weekly') return '/week';
    if (t === 'annually' || t === 'annual' || t === 'yearly') return '/year';
    return '';
  };

  const getRateLabel = () => {
    const salaryType = job?.salaryType || 'Hourly';
    const suffix = getSalarySuffix(salaryType);
    const min = job?.salaryMin;
    const max = job?.salaryMax;
    if (typeof min === 'number' && typeof max === 'number' && max !== min) {
      return `$${min}–$${max}${suffix}`;
    }
    if (typeof min === 'number') {
      return `$${min}${suffix}`;
    }
    const lastRate = sessions?.[0]?.hourlyRate;
    if (typeof lastRate === 'number') {
      return `$${lastRate}${suffix || '/hr'}`;
    }
    return `N/A`;
  };

  const getWeekStart = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay(); // 0..6 (Sun..Sat)
    const diff = (day + 6) % 7; // days since Monday
    date.setDate(date.getDate() - diff);
    return date;
  };

  const formatDateLabel = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTimeLabel = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const summaryStats = useMemo(() => {
    const totalHours = (sessions || []).reduce((sum, s) => sum + (Number(s?.hours) || 0), 0);
    const pendingApproval = (sessions || []).reduce(
      (sum, s) => sum + (s?.status === 'pending_approval' ? (Number(s?.hours) || 0) : 0),
      0,
    );

    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekHours = (sessions || []).reduce((sum, s) => {
      const end = s?.endTime ? new Date(s.endTime) : null;
      if (!end || Number.isNaN(end.getTime())) return sum;
      return end >= weekStart ? sum + (Number(s?.hours) || 0) : sum;
    }, 0);

    const last = sessions?.[0] || null;
    const lastSession =
      last?.endTime
        ? `${formatDateLabel(last.endTime)} • ${formatTimeLabel(last.endTime)}`
        : '—';

    return {
      totalHours,
      weekHours,
      pendingApproval,
      rateLabel: getRateLabel(),
      lastSession,
    };
  }, [sessions, job]);

  const historyEntries = useMemo(() => {
    return (sessions || []).map((s) => {
      const breakMinutes = Number(s?.breakMinutes) || 0;
      const notes = String(s?.notes || '').trim();
      return {
        id: s.id,
        date: s?.endTime ? formatDateLabel(s.endTime) : '—',
        shift:
          s?.startTime && s?.endTime
            ? `${formatTimeLabel(s.startTime)} – ${formatTimeLabel(s.endTime)}`
            : '—',
        hours: Number(s?.hours) || 0,
        breakLabel: `${breakMinutes} min`,
        notes: notes || '—',
      };
    });
  }, [sessions]);

  const handleViewProfile = () => {
    if (!jobId || !candidateId) return;
    if (source === 'manual') {
      navigation.navigate(screenNames.MANUAL_CANDIDATE_PROFILE, {
        jobId,
        candidateId,
        mode: 'work_coordination',
      });
      return;
    }
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      jobId,
      candidateId,
      mode: 'work_coordination',
    });
  };

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
              {summaryStats.rateLabel}
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
                {entry.breakLabel}
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
        <TouchableOpacity
          style={styles.viewProfileLink}
          onPress={handleViewProfile}
          activeOpacity={0.85}
        >
          <AppText variant={Variant.bodyMedium} style={styles.viewProfileText}>
            View Full Profile
          </AppText>
        </TouchableOpacity>

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
  viewProfileLink: {
    alignSelf: 'flex-start',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  viewProfileText: {
    color: colors.primary,
    fontWeight: '700',
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

