import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { 
  selectActiveQuickJobById,
  startTimer,
  stopTimer,
  resumeTimer,
  updateTimer,
} from '@/store/quickSearchSlice';
import TimerClock from '@/components/QuickSearch/TimerClock';
import { screenNames } from '@/navigation/screenNames';

const TABS = {
  CURRENT: 'current',
  HISTORY: 'history',
};

const TimerControl = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { jobId, job: jobFromRoute } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  const job = activeJob || jobFromRoute;

  const createInitialLocalTimer = useCallback(() => {
    const baseTimer = job?.timer;
    if (baseTimer) {
      return {
        ...baseTimer,
        runningStartTime: null,
        elapsedBeforeStart: baseTimer.elapsedTime || 0,
      };
    }
    return {
      isRunning: false,
      elapsedTime: 0,
      elapsedBeforeStart: 0,
      runningStartTime: null,
      hourlyRate: job?.salaryMin || 0,
      totalCost: 0,
      expectedHours: 8,
      startTime: null,
      stopTime: null,
    };
  }, [job]);

  const [localTimer, setLocalTimer] = useState(createInitialLocalTimer);
  const [timerInterval, setTimerInterval] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.CURRENT);

  useEffect(() => {
    // Update timer every second if running
    if (activeJob?.timer?.isRunning) {
      const interval = setInterval(() => {
        dispatch(updateTimer({ jobId: activeJob.id }));
      }, 1000);
      setTimerInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [activeJob?.timer?.isRunning]);

  useEffect(() => {
    if (activeJob) return;
    setLocalTimer(createInitialLocalTimer());
  }, [activeJob, createInitialLocalTimer]);

  const isLocalRunning = !activeJob && localTimer.isRunning;
  const localRunningStart = localTimer.runningStartTime;

  useEffect(() => {
    if (!isLocalRunning || !localRunningStart) return;

    const interval = setInterval(() => {
      setLocalTimer(prev => {
        if (!prev.isRunning || !prev.runningStartTime) return prev;
        const elapsedSeconds =
          (prev.elapsedBeforeStart || 0) +
          Math.floor((Date.now() - prev.runningStartTime) / 1000);
        const elapsedHours = elapsedSeconds / 3600;
        const totalCost = elapsedHours * (prev.hourlyRate || 0);
        return {
          ...prev,
          elapsedTime: elapsedSeconds,
          totalCost,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocalRunning, localRunningStart, activeJob]);

  if (!job) {
    return (
      <View style={styles.container}>
        <AppHeader title="Timer Control" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.body} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    );
  }

  const timer = activeJob ? job?.timer || {} : localTimer;
  const payment = job?.payment || {};
  const dispatchJobId = activeJob?.id || job?.id;

  const startLocalTimer = () => {
    setLocalTimer(prev => ({
      ...prev,
      isRunning: true,
      startTime: prev.startTime || new Date().toISOString(),
      stopTime: null,
      runningStartTime: Date.now(),
      elapsedBeforeStart: prev.elapsedTime || prev.elapsedBeforeStart || 0,
    }));
  };

  const finalizeLocalTimer = () => {
    setLocalTimer(prev => {
      if (!prev.isRunning) return prev;
      const elapsedSeconds =
        (prev.elapsedBeforeStart || 0) +
        Math.floor((Date.now() - (prev.runningStartTime || Date.now())) / 1000);
      const elapsedHours = elapsedSeconds / 3600;
      const totalCost = elapsedHours * (prev.hourlyRate || 0);
      return {
        ...prev,
        elapsedTime: elapsedSeconds,
        elapsedBeforeStart: elapsedSeconds,
        totalCost,
      };
    });
  };

  const stopLocalTimer = () => {
    setLocalTimer(prev => {
      const elapsedSeconds =
        (prev.elapsedBeforeStart || 0) +
        Math.floor((Date.now() - (prev.runningStartTime || Date.now())) / 1000);
      const elapsedHours = elapsedSeconds / 3600;
      const totalCost = elapsedHours * (prev.hourlyRate || 0);
      return {
        ...prev,
        isRunning: false,
        stopTime: new Date().toISOString(),
        runningStartTime: null,
        elapsedTime: elapsedSeconds,
        elapsedBeforeStart: elapsedSeconds,
        totalCost,
      };
    });
  };

  const resumeLocalTimer = () => {
    setLocalTimer(prev => ({
      ...prev,
      isRunning: true,
      runningStartTime: Date.now(),
      stopTime: null,
      elapsedBeforeStart: prev.elapsedTime || prev.elapsedBeforeStart || 0,
    }));
  };

  const jobHistory = useMemo(() => {
    const baseTitle = job?.jobTitle || 'Quick Search Job';
    return [
      {
        id: `${job?.id || 'job'}-hist-1`,
        date: 'Mon, 25 Nov 2024',
        shift: '08:00 AM - 04:30 PM',
        hours: 8.5,
        tasks: ['Site prep & safety briefing', 'Interior wall repainting'],
        notes: 'Completed level 12 repainting one hour ahead of schedule.',
        cost: (localTimer.hourlyRate || 35) * 8.5,
        title: baseTitle,
      },
      {
        id: `${job?.id || 'job'}-hist-2`,
        date: 'Tue, 26 Nov 2024',
        shift: '09:30 AM - 05:00 PM',
        hours: 7.5,
        tasks: ['Touch-ups & QA checks', 'Tool maintenance'],
        notes: 'QA inspector signed off without issues.',
        cost: (localTimer.hourlyRate || 35) * 7.5,
        title: baseTitle,
      },
      {
        id: `${job?.id || 'job'}-hist-3`,
        date: 'Wed, 27 Nov 2024',
        shift: '07:00 AM - 03:15 PM',
        hours: 8.25,
        tasks: ['Equipment setup', 'Exterior facade coating'],
        notes: 'Weather delay added 15 mins break.',
        cost: (localTimer.hourlyRate || 35) * 8.25,
        title: baseTitle,
      },
    ];
  }, [job?.id, job?.jobTitle, localTimer.hourlyRate]);

  const renderHistoryCard = (entry) => (
    <View key={entry.id} style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <AppText variant={Variant.bodyMedium} style={styles.historyDate}>
          {entry.date}
        </AppText>
        <AppText variant={Variant.caption} style={styles.historyShift}>
          {entry.shift}
        </AppText>
      </View>

      <AppText variant={Variant.body} style={styles.historyTitle}>
        {entry.title}
      </AppText>

      <View style={styles.historyRow}>
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
            Earnings
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.statValue}>
            ${entry.cost.toFixed(2)}
          </AppText>
        </View>
      </View>

      <AppText variant={Variant.caption} style={styles.sectionLabel}>
        Key Tasks
      </AppText>
      {entry.tasks.map(task => (
        <AppText key={task} variant={Variant.body} style={styles.historyTask}>
          • {task}
        </AppText>
      ))}

      <AppText variant={Variant.caption} style={styles.sectionLabel}>
        Notes
      </AppText>
      <AppText variant={Variant.body} style={styles.historyNotes}>
        {entry.notes}
      </AppText>
    </View>
  );

  const handleStart = () => {
    // Check if payment is set up for platform payment
    if (payment.method === 'platform' && !payment.codeVerified) {
      Alert.alert(
        'Payment Not Verified',
        'Please complete payment setup first.',
        [
          { text: 'OK', onPress: () => navigation.navigate(screenNames.PAYMENT_REQUEST, { jobId: dispatchJobId }) }
        ]
      );
      return;
    }

    Alert.alert(
      'Start Timer',
      'Are you ready to start the timer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            if (activeJob && dispatchJobId) {
              dispatch(
                startTimer({
                  jobId: dispatchJobId,
                  hourlyRate: timer.hourlyRate || 0,
                  expectedHours: timer.expectedHours || 8,
                }),
              );
            } else {
              startLocalTimer();
            }
          },
        },
      ]
    );
  };

  const handleStop = () => {
    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop the timer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            if (activeJob && dispatchJobId) {
              dispatch(
                stopTimer({
                  jobId: dispatchJobId,
                  stoppedBy: 'jobseeker',
                  requiresCode: false, // Job seeker doesn't need code
                }),
              );
            } else {
              stopLocalTimer();
            }
          },
        },
      ]
    );
  };

  const handleResume = () => {
    // Check if within 1 hour window
    if (timer.stopTime) {
      const stopTime = new Date(timer.stopTime);
      const now = new Date();
      const diffHours = (now - stopTime) / (1000 * 60 * 60);
      
      if (diffHours > 1) {
        Alert.alert(
          'Resume Window Expired',
          'The 1-hour resume window has expired. The job will be considered completed.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    if (activeJob && dispatchJobId) {
      dispatch(
        resumeTimer({
          jobId: dispatchJobId,
          hourlyRate: timer.hourlyRate,
          requiresCode: false, // Job seeker doesn't need code to resume
        }),
      );
    } else {
      finalizeLocalTimer();
      resumeLocalTimer();
    }
  };

  const renderTabSelector = () => (
    <View style={styles.tabSwitcher}>
      {Object.values(TABS).map(tabKey => (
        <TouchableOpacity
          key={tabKey}
          style={[
            styles.tabButton,
            activeTab === tabKey && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab(tabKey)}
        >
          <AppText
            variant={Variant.bodyMedium}
            style={[
              styles.tabButtonLabel,
              activeTab === tabKey && styles.tabButtonLabelActive,
            ]}
          >
            {tabKey === TABS.CURRENT ? 'Current Timer' : 'History'}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Timer Control" showTopIcons={false} />
      {renderTabSelector()}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Job Info */}
        <View style={styles.jobInfo}>
          <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>
            {job.jobTitle}
          </AppText>
          <AppText variant={Variant.caption} style={styles.jobLocation}>
            {job.locationTracking?.workplaceLocation || job.location || 'Workplace'}
          </AppText>
        </View>

        {activeTab === TABS.CURRENT ? (
          <>
            <TimerClock
              isRunning={timer.isRunning || false}
              elapsedTime={timer.elapsedTime || 0}
              hourlyRate={timer.hourlyRate || 0}
              totalCost={timer.totalCost || 0}
              onStart={
                timer.isRunning ? null : timer.elapsedTime > 0 ? handleResume : handleStart
              }
              onStop={timer.isRunning ? handleStop : null}
              onResume={!timer.isRunning && timer.elapsedTime > 0 ? handleResume : null}
              canControl={true}
            />

            <View style={styles.infoSection}>
              <AppText variant={Variant.body} style={styles.infoTitle}>
                Timer Information
              </AppText>

              {timer.startTime && (
                <View style={styles.infoRow}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>
                    Started:
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.infoValue}>
                    {new Date(timer.startTime).toLocaleTimeString()}
                  </AppText>
                </View>
              )}

              {timer.stopTime && (
                <View style={styles.infoRow}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>
                    Stopped:
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.infoValue}>
                    {new Date(timer.stopTime).toLocaleTimeString()}
                  </AppText>
                </View>
              )}

              <View style={styles.infoRow}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Expected Hours:
                </AppText>
                <AppText variant={Variant.caption} style={styles.infoValue}>
                  {timer.expectedHours || 8}h
                </AppText>
              </View>

              <View style={styles.infoRow}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Hourly Rate:
                </AppText>
                <AppText variant={Variant.caption} style={styles.infoValue}>
                  ${timer.hourlyRate || localTimer.hourlyRate || 0}/hr
                </AppText>
              </View>

              {payment.method === 'platform' && (
                <View style={styles.infoRow}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>
                    Payment:
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.infoValue}>
                    Platform Payment
                  </AppText>
                </View>
              )}
            </View>

            {timer.expectedHours && (
              <View style={styles.warningBox}>
                <AppText variant={Variant.caption} style={styles.warningText}>
                  ⏰ Timer will auto-stop after {timer.expectedHours} hours. You can resume
                  within 1 hour if needed.
                </AppText>
              </View>
            )}
          </>
        ) : (
          <View style={styles.historySection}>
            <AppText variant={Variant.body} style={styles.historyTitleLabel}>
              Recent Sessions
            </AppText>
            {jobHistory.map(renderHistoryCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TimerControl;

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
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.gray,
  },
  jobInfo: {
    marginBottom: hp(2),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  jobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  jobLocation: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  infoSection: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    padding: wp(4),
    marginTop: hp(2),
  },
  infoTitle: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  infoLabel: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  infoValue: {
    color: colors.secondary,
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: wp(3),
    marginTop: hp(2),
  },
  warningText: {
    color: '#92400E',
    fontSize: getFontSize(12),
    lineHeight: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    marginTop: hp(1),
    borderRadius: 999,
    backgroundColor: colors.grayE8 || '#E5E7EB',
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: hp(1.2),
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    elevation: 2,
  },
  tabButtonLabel: {
    color: colors.gray,
    fontWeight: '600',
  },
  tabButtonLabelActive: {
    color: colors.secondary,
  },
  historySection: {
    gap: hp(1.5),
  },
  historyTitleLabel: {
    fontWeight: '600',
    marginBottom: hp(1),
    color: colors.secondary,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: wp(4),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  historyDate: {
    fontWeight: '700',
    color: colors.secondary,
  },
  historyShift: {
    color: colors.gray,
  },
  historyTitle: {
    fontWeight: '600',
    marginBottom: hp(1),
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  historyStat: {
    flex: 1,
  },
  statLabel: {
    color: colors.gray,
  },
  statValue: {
    color: colors.secondary,
    fontWeight: '700',
    marginTop: hp(0.5),
  },
  sectionLabel: {
    marginTop: hp(1),
    color: colors.gray,
    fontWeight: '600',
  },
  historyTask: {
    marginTop: hp(0.5),
    color: colors.secondary,
  },
  historyNotes: {
    marginTop: hp(0.5),
    color: colors.secondary,
    lineHeight: 18,
  },
});

