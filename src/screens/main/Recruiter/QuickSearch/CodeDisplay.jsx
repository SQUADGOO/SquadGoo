import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import CodeSharing from '@/components/QuickSearch/CodeSharing';
import { selectActiveQuickJobById } from '@/store/quickSearchSlice';

const CodeDisplay = ({ navigation, route }) => {
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));

  if (!activeJob) {
    return (
      <View style={styles.container}>
        <AppHeader title="Payment Code" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.body} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    );
  }

  const payment = activeJob.payment || {};

  if (!payment.codeGenerated) {
    return (
      <View style={styles.container}>
        <AppHeader title="Payment Code" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.body} style={styles.errorText}>
            No code generated yet
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Share Payment Code" showTopIcons={false} />
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
          <AppText variant={Variant.caption} style={styles.jobSubtitle}>
            Share this code with: {activeJob.candidateName || 'Job Seeker'}
          </AppText>
        </View>

        {/* Code Display */}
        <CodeSharing
          code={payment.code}
          codeExpiry={payment.codeExpiry}
          showNumeric={true}
          isRecruiter={true}
        />

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <AppText variant={Variant.bodyMedium} style={styles.instructionsTitle}>
            Instructions
          </AppText>
          <AppText variant={Variant.caption} style={styles.instructionText}>
            1. Share this code with the job seeker{'\n'}
            2. They will enter this code to verify payment{'\n'}
            3. Once verified, they can start the timer{'\n'}
            4. Code expires in 10 minutes
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
};

export default CodeDisplay;

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
  jobSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  instructionsCard: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    padding: wp(4),
    marginTop: hp(2),
  },
  instructionsTitle: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  instructionText: {
    color: colors.gray,
    fontSize: getFontSize(12),
    lineHeight: 18,
  },
});

