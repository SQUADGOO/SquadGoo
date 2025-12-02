import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
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

  return (
    <View style={styles.container}>
      <AppHeader title="Timer Control" showTopIcons={false} />
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
            {job.locationTracking?.workplaceLocation || 'Workplace'}
          </AppText>
        </View>


        {/* Timer Clock */}
        <TimerClock
          isRunning={timer.isRunning || false}
          elapsedTime={timer.elapsedTime || 0}
          hourlyRate={timer.hourlyRate || 0}
          totalCost={timer.totalCost || 0}
          onStart={timer.isRunning ? null : (timer.elapsedTime > 0 ? handleResume : handleStart)}
          onStop={timer.isRunning ? handleStop : null}
          onResume={!timer.isRunning && timer.elapsedTime > 0 ? handleResume : null}
          canControl={true}
        />

        {/* Timer Info */}
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

        {/* Auto-stop Warning */}
        {timer.expectedHours && (
          <View style={styles.warningBox}>
            <AppText variant={Variant.caption} style={styles.warningText}>
              ⏰ Timer will auto-stop after {timer.expectedHours} hours. You can resume within 1 hour if needed.
            </AppText>
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
});

