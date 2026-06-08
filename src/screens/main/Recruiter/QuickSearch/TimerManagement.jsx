import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import { 
  selectActiveQuickJobById,
  stopTimer,
  resumeTimer,
  updateTimer,
} from '@/store/quickSearchSlice';
import { verifyPaymentCode } from '@/store/quickSearchSlice';
import TimerClock from '@/components/QuickSearch/TimerClock';
import CodeSharing from '@/components/QuickSearch/CodeSharing';

const TimerManagement = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  
  const [codeInput, setCodeInput] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [editingTerms, setEditingTerms] = useState(false);
  const [newHourlyRate, setNewHourlyRate] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  useEffect(() => {
    // Update timer every second if running
    if (activeJob?.timer?.isRunning) {
      const interval = setInterval(() => {
        dispatch(updateTimer({ jobId: activeJob.id }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeJob?.timer?.isRunning]);

  if (!activeJob) {
    return (
      <View style={styles.container}>
        <AppHeader title="Timer Management" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.body} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    );
  }

  const timer = activeJob.timer || {};
  const payment = activeJob.payment || {};

  const handleStop = () => {
    if (!timer.isRunning) {
      Alert.alert('Timer Not Running', 'Timer is already stopped.');
      return;
    }

    // Recruiter needs code from job seeker to stop
    setShowCodeInput(true);
  };

  const handleVerifyAndStop = () => {
    // In real app, get code from job seeker
    // For now, we'll show an alert
    Alert.alert(
      'Code Required',
      'Please request the code from the job seeker to stop the timer.',
      [
        { text: 'Cancel', onPress: () => setShowCodeInput(false) },
        {
          text: 'Enter Code',
          onPress: () => {
            // Code input would be handled here
            // For demo, we'll just show the input
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

    if (editingTerms) {
      // If editing terms, need code from job seeker
      Alert.alert(
        'Code Required',
        'Since you are changing the terms, you need a code from the job seeker.',
        [
          { text: 'Cancel', onPress: () => setEditingTerms(false) },
          {
            text: 'Request Code',
            onPress: () => {
              // Request code from job seeker
              Alert.alert('Code Requested', 'A code request has been sent to the job seeker.');
            },
          },
        ]
      );
      return;
    }

    // Resume without changes - no code needed
    dispatch(resumeTimer({
      jobId: activeJob.id,
      hourlyRate: timer.hourlyRate,
      requiresCode: false,
    }));
  };

  const handleEditTerms = () => {
    setEditingTerms(true);
    setNewHourlyRate(timer.hourlyRate?.toString() || '');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Timer Management" showTopIcons={false} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Job Info */}
        <View style={styles.jobInfo}>
          <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>
            {activeJob.jobTitle}
          </AppText>
          <AppText variant={Variant.caption} style={styles.candidateName}>
            {activeJob.candidateName}
          </AppText>
        </View>

        {/* Timer Clock */}
        <TimerClock
          isRunning={timer.isRunning || false}
          elapsedTime={timer.elapsedTime || 0}
          hourlyRate={timer.hourlyRate || 0}
          totalCost={timer.totalCost || 0}
          canControl={false} // Recruiter can't directly start/stop from here
        />

        {/* Control Buttons */}
        <View style={styles.controls}>
          {timer.isRunning ? (
            <AppButton
              text="Stop Timer"
              onPress={handleStop}
              bgColor="#EF4444"
              textColor={colors.white}
              style={styles.controlButton}
            />
          ) : timer.elapsedTime > 0 ? (
            <>
              {!editingTerms ? (
                <>
                  <AppButton
                    text="Resume Timer"
                    onPress={handleResume}
                    bgColor={colors.primary}
                    textColor={colors.white}
                    style={styles.controlButton}
                  />
                  <AppButton
                    text="Edit Terms & Resume"
                    onPress={handleEditTerms}
                    bgColor={colors.grayE8 || '#E5E7EB'}
                    textColor={colors.secondary}
                    style={styles.controlButton}
                  />
                </>
              ) : (
                <View style={styles.editTermsContainer}>
                  <AppText variant={Variant.body} style={styles.editTitle}>
                    Edit Terms
                  </AppText>
                  <TextInput
                    style={styles.input}
                    placeholder="Hourly Rate"
                    value={newHourlyRate}
                    onChangeText={setNewHourlyRate}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Expected End Time (HH:MM)"
                    value={newEndTime}
                    onChangeText={setNewEndTime}
                  />
                  <View style={styles.editButtons}>
                    <AppButton
                      text="Cancel"
                      onPress={() => {
                        setEditingTerms(false);
                        setNewHourlyRate('');
                        setNewEndTime('');
                      }}
                      bgColor={colors.grayE8 || '#E5E7EB'}
                      textColor={colors.secondary}
                      style={styles.editButton}
                    />
                    <AppButton
                      text="Resume with Changes"
                      onPress={() => {
                        dispatch(resumeTimer({
                          jobId: activeJob.id,
                          hourlyRate: parseFloat(newHourlyRate) || timer.hourlyRate,
                          expectedEndTime: newEndTime,
                          requiresCode: true, // Need code when changing terms
                        }));
                        setEditingTerms(false);
                      }}
                      bgColor={colors.primary}
                      textColor={colors.white}
                      style={styles.editButton}
                    />
                  </View>
                </View>
              )}
            </>
          ) : null}
        </View>

        {/* Code Input for Stop */}
        {showCodeInput && (
          <View style={styles.codeContainer}>
            <AppText variant={Variant.body} style={styles.codeTitle}>
              Enter Code from Job Seeker to Stop Timer
            </AppText>
            <CodeSharing
              code={payment.code}
              onCodeVerified={(code) => {
                dispatch(stopTimer({
                  jobId: activeJob.id,
                  stoppedBy: 'recruiter',
                  requiresCode: true,
                }));
                setShowCodeInput(false);
                Alert.alert('Success', 'Timer stopped successfully.');
              }}
              showQR={false}
              showNumeric={true}
            />
          </View>
        )}

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

          {payment.method === 'platform' && payment.balanceHeld > 0 && (
            <View style={styles.infoRow}>
              <AppText variant={Variant.caption} style={styles.infoLabel}>
                Balance Held:
              </AppText>
              <AppText variant={Variant.caption} style={styles.infoValue}>
                ${payment.balanceHeld.toFixed(2)}
              </AppText>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsBox}>
          <AppText variant={Variant.caption} style={styles.instructionsText}>
            💡 To stop the timer before agreed time, you need a code from the job seeker.
          </AppText>
          <AppText variant={Variant.caption} style={styles.instructionsText}>
            💡 To resume with changes, you need a code. To resume without changes, no code needed.
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
};

export default TimerManagement;

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
  candidateName: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  controls: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  controlButton: {
    marginBottom: hp(1.5),
  },
  editTermsContainer: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
  },
  editTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(1.5),
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: wp(3),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    fontSize: getFontSize(14),
    color: colors.secondary,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginHorizontal: wp(1),
  },
  codeContainer: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  codeTitle: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(1),
    textAlign: 'center',
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
  instructionsBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: wp(3),
    marginTop: hp(2),
  },
  instructionsText: {
    color: '#92400E',
    fontSize: getFontSize(12),
    lineHeight: 16,
    marginBottom: hp(0.5),
  },
});

