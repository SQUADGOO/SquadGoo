import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

const TimerClock = ({ 
  isRunning, 
  elapsedTime, 
  hourlyRate, 
  totalCost,
  onStart,
  onStop,
  onResume,
  canControl = true,
}) => {
  const [displayTime, setDisplayTime] = useState(elapsedTime);

  useEffect(() => {
    setDisplayTime(elapsedTime);
  }, [elapsedTime]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate current cost
  const currentCost = (displayTime / 3600) * (hourlyRate || 0);

  return (
    <View style={styles.container}>
      {/* Timer Display */}
      <View style={styles.timerDisplay}>
        <AppText variant={Variant.subTitle} style={styles.timeLabel}>
          Elapsed Time
        </AppText>
        <AppText variant={Variant.subTitle} style={styles.timeValue}>
          {formatTime(displayTime)}
        </AppText>
      </View>

      {/* Cost Display */}
      <View style={styles.costDisplay}>
        <AppText variant={Variant.body} style={styles.costLabel}>
          Current Cost
        </AppText>
        <AppText variant={Variant.bodyMedium} style={styles.costValue}>
          ${currentCost.toFixed(2)}
        </AppText>
        <AppText variant={Variant.caption} style={styles.rateText}>
          @ ${hourlyRate || 0}/hr
        </AppText>
      </View>

      {/* Control Buttons */}
      {canControl && (
        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={onStart || onResume}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="play"
                size={20}
                color={colors.white}
              />
              <AppText variant={Variant.bodyMedium} style={styles.buttonText}>
                {elapsedTime > 0 ? 'Resume' : 'Start'} Clock
              </AppText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={onStop}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="stop"
                size={20}
                color={colors.white}
              />
              <AppText variant={Variant.bodyMedium} style={styles.buttonText}>
                Stop Clock
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, isRunning && styles.statusDotActive]} />
        <AppText variant={Variant.caption} style={styles.statusText}>
          {isRunning ? 'Timer Running' : 'Timer Stopped'}
        </AppText>
      </View>
    </View>
  );
};

export default TimerClock;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginVertical: hp(1),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  timeLabel: {
    color: colors.gray,
    fontSize: getFontSize(14),
    marginBottom: hp(0.5),
  },
  timeValue: {
    color: colors.primary,
    fontSize: getFontSize(32),
    fontWeight: 'bold',
  },
  costDisplay: {
    alignItems: 'center',
    marginBottom: hp(2),
    paddingVertical: hp(1.5),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  costLabel: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(0.5),
  },
  costValue: {
    color: colors.secondary,
    fontSize: getFontSize(24),
    fontWeight: 'bold',
  },
  rateText: {
    color: colors.gray,
    fontSize: getFontSize(10),
    marginTop: hp(0.5),
  },
  controls: {
    marginBottom: hp(1),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: colors.primary || '#F59E0B',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: colors.white,
    marginLeft: wp(2),
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginRight: wp(2),
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  statusText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
});

