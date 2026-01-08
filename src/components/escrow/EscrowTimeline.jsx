import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText, { Variant } from '@/core/AppText';
import { colors, hp, wp, getFontSize } from '@/theme';

const statusColors = {
  done: '#10B981',
  current: colors.primary,
  upcoming: colors.gray,
};

const EscrowTimeline = ({ steps = [] }) => {
  if (!steps.length) return null;

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const tone = statusColors[step.status] || colors.gray;
        const isLast = index === steps.length - 1;

        return (
          <View key={step.key || `${step.title}-${index}`} style={styles.stepRow}>
            <View style={styles.markerColumn}>
              <View style={[styles.marker, { borderColor: tone, backgroundColor: tone }]} />
              {!isLast && <View style={[styles.connector, { borderColor: tone }]} />}
            </View>
            <View style={styles.stepContent}>
              <AppText variant={Variant.bodyMedium} style={styles.stepTitle}>
                {step.title}
              </AppText>
              {step.description ? (
                <AppText variant={Variant.caption} style={styles.stepDescription}>
                  {step.description}
                </AppText>
              ) : null}
              {step.timestampLabel ? (
                <AppText variant={Variant.caption} style={styles.stepTimestamp}>
                  {step.timestampLabel}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default EscrowTimeline;

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: hp(1.5),
  },
  markerColumn: {
    width: wp(8),
    alignItems: 'center',
  },
  marker: {
    width: wp(2.4),
    height: wp(2.4),
    borderRadius: wp(1.2),
    borderWidth: 2,
  },
  connector: {
    flex: 1,
    borderLeftWidth: 1,
    marginTop: hp(0.4),
  },
  stepContent: {
    flex: 1,
    paddingLeft: wp(2),
  },
  stepTitle: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  stepDescription: {
    color: colors.gray,
    marginTop: hp(0.3),
  },
  stepTimestamp: {
    color: colors.gray,
    marginTop: hp(0.3),
    fontStyle: 'italic',
  },
});

