import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';

import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import AppText, { Variant } from '@/core/AppText';
import FormField from '@/core/FormField';
import AppDropDown from '@/core/AppDropDown';
import { colors, hp, wp } from '@/theme';

import { autoMatchCandidates, sendQuickOffer } from '@/store/quickSearchSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { screenNames } from '@/navigation/screenNames';

const defaultValues = {
  expiryHours: '24',
  workType: '',
  availability: '',
  message: '',
};

/**
 * Reusable offer screen for:
 * - worker (single candidateId)
 * - squad  (many memberIds)
 *
 * route.params:
 * - mode: 'worker' | 'squad'
 * - recipient:
 *    - worker: { candidateId, name }
 *    - squad:  { squadId, name, memberIds }
 * - prefill?: { workType?, availability? }
 */
const SendOffer = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const quickJobs = useSelector((state) => state.quickSearch.quickJobs || []);

  const mode = route?.params?.mode || 'worker';
  const recipient = route?.params?.recipient || {};
  const prefill = route?.params?.prefill || {};

  const memberIds = mode === 'squad' ? recipient?.memberIds || [] : [];
  const candidateId = mode === 'worker' ? recipient?.candidateId : null;

  const [jobOpen, setJobOpen] = useState(false);
  const [jobId, setJobId] = useState(quickJobs?.[0]?.id || '');

  const jobOptions = useMemo(
    () =>
      (quickJobs || []).map((j) => ({
        label: j.jobTitle || j.title || `Job ${j.id}`,
        value: j.id,
      })),
    [quickJobs],
  );

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      ...defaultValues,
      ...prefill,
    },
  });

  const handleGoCreateJob = () => {
    Alert.alert(
      'Create Job First',
      'You need a Quick Search job to send an offer. Create one now?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Job',
          onPress: () => navigation.navigate(screenNames.QUICK_SEARCH_STEPONE),
        },
      ],
    );
  };

  const buildMessage = (values) => {
    const parts = [
      values.workType ? `Work type: ${values.workType}` : null,
      values.availability ? `Availability: ${values.availability}` : null,
      values.message ? `\n${values.message}` : null,
    ].filter(Boolean);
    return parts.join('\n');
  };

  const onSubmit = methods.handleSubmit((values) => {
    if (!jobId) {
      showToast('Please select a job', 'Info', toastTypes.info);
      return;
    }

    const targetIds = mode === 'squad' ? memberIds : candidateId ? [candidateId] : [];
    if (targetIds.length === 0) {
      showToast('No recipients found', 'Error', toastTypes.error);
      return;
    }

    const hours = parseInt(values.expiryHours, 10);
    const expiryHours = Number.isNaN(hours) ? 24 : Math.max(1, hours);
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

    const composedMessage = buildMessage(values);

    // Ensure match list exists for this job so downstream screens can show consistent data.
    dispatch(autoMatchCandidates({ jobId }));

    targetIds.forEach((id) => {
      dispatch(
        sendQuickOffer({
          jobId,
          candidateId: id,
          expiresAt,
          message: composedMessage,
          autoSent: false,
        }),
      );
    });

    showToast(
      mode === 'squad' ? 'Offer sent to squad members' : 'Offer sent successfully',
      'Success',
      toastTypes.success,
    );

    navigation.navigate(screenNames.QUICK_SEARCH_ACTIVE_OFFERS_RECRUITER, { jobId });
  });

  const title = mode === 'squad' ? 'Send Squad Offer' : 'Send Offer';
  const name = recipient?.name || (mode === 'squad' ? 'Squad' : 'Candidate');
  const meta =
    mode === 'squad'
      ? `${memberIds.length} member${memberIds.length === 1 ? '' : 's'}`
      : candidateId
        ? `Candidate ID: ${candidateId}`
        : '';

  return (
    <View style={styles.container}>
      <AppHeader title={title} showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <AppText variant={Variant.bodyMedium} style={styles.recipientName}>
            {name}
          </AppText>
          {meta ? (
            <AppText variant={Variant.caption} style={styles.recipientMeta}>
              {meta}
            </AppText>
          ) : null}

          <View style={styles.section}>
            <AppText variant={Variant.caption} style={styles.label}>
              Select Job
            </AppText>

            <AppDropDown
              placeholder={quickJobs.length ? 'Select a job' : 'No jobs available'}
              options={jobOptions}
              selectedValue={jobId}
              onSelect={(v) => setJobId(v)}
              isVisible={jobOpen}
              setIsVisible={setJobOpen}
              disabled={!quickJobs.length}
            />

            {!quickJobs.length ? (
              <View style={{ marginTop: hp(1.5) }}>
                <AppButton
                  text="Create Job"
                  onPress={handleGoCreateJob}
                  bgColor={colors.primary}
                  textColor="#FFFFFF"
                />
              </View>
            ) : null}
          </View>

          <FormProvider {...methods}>
            <View style={styles.form}>
              <FormField name="workType" label="Type of work" placeholder="e.g. Cleaning, Construction" />
              <FormField name="availability" label="Availability" placeholder="e.g. Mon–Fri, 8am–5pm" />
              <FormField
                name="expiryHours"
                label="Offer expiry (hours)"
                keyboardType="numeric"
                placeholder="24"
                rules={{
                  required: 'Expiry is required',
                  pattern: { value: /^[0-9]+$/, message: 'Enter hours as a number' },
                }}
              />
              <FormField name="message" label="Message (optional)" multiline placeholder="Add a note/instructions" />
            </View>
          </FormProvider>

          <View style={styles.actions}>
            <AppButton
              text="Send Offer"
              onPress={onSubmit}
              bgColor={colors.primary}
              textColor="#FFFFFF"
              disabled={!quickJobs.length}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SendOffer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: wp(5), paddingBottom: hp(4) },
  card: { backgroundColor: '#fff' },
  recipientName: { fontWeight: '700' },
  recipientMeta: { color: colors.gray, marginTop: hp(0.5) },
  section: { marginTop: hp(2) },
  label: { color: colors.gray, marginBottom: hp(0.8) },
  form: { marginTop: hp(2), gap: hp(1.5) },
  actions: { marginTop: hp(2) },
});


