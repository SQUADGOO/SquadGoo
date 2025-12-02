import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import FormField from '@/core/FormField';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

const defaultValues = {
  expiryHours: '24',
  message: '',
};

const SendManualOfferModal = ({ visible, onClose, candidate, onSubmit }) => {
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
  });

  const handleClose = () => {
    methods.reset(defaultValues);
    onClose?.();
  };

  const handleSend = methods.handleSubmit(values => {
    const hours = parseInt(values.expiryHours, 10);
    const expiryHours = Number.isNaN(hours) ? 24 : Math.max(1, hours);
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
    onSubmit?.({
      expiresAt,
      message: values.message,
    });
    handleClose();
  });

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <AppText variant={Variant.bodyMedium} style={styles.title}>
              Send Offer
            </AppText>
            <TouchableOpacity onPress={handleClose}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={22}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>

          {candidate ? (
            <View style={styles.candidateSummary}>
              <AppText variant={Variant.bodyMedium} style={styles.candidateName}>
                {candidate.name}
              </AppText>
              <AppText variant={Variant.caption} style={styles.candidateMeta}>
                Match {candidate.matchPercentage}% • Rating {candidate.acceptanceRating}%
              </AppText>
              <AppText variant={Variant.caption} style={styles.candidateMeta}>
                Prefers ${candidate.payPreference?.min}-{candidate.payPreference?.max}/hr •{' '}
                {candidate.availability?.summary}
              </AppText>
            </View>
          ) : null}

          <FormProvider {...methods}>
            <View style={styles.form}>
              <FormField
                name="expiryHours"
                label="Offer expiry (hours)"
                keyboardType="numeric"
                placeholder="24"
                rules={{
                  required: 'Expiry is required',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Enter hours as a number',
                  },
                }}
              />
              <FormField
                name="message"
                label="Message (optional)"
                multiline
                placeholder="Add a personal note or instructions"
              />
            </View>
          </FormProvider>

          <View style={styles.actions}>
            <AppButton
              text="Send Offer"
              onPress={handleSend}
              bgColor={colors.primary}
              textColor="#FFFFFF"
            />
            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
              <AppText variant={Variant.bodyMedium} style={styles.cancelText}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SendManualOfferModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  title: {
    fontSize: getFontSize(18),
    fontWeight: '600',
  },
  candidateSummary: {
    marginBottom: hp(2),
  },
  candidateName: {
    fontWeight: '600',
  },
  candidateMeta: {
    color: colors.gray,
    marginTop: 4,
  },
  form: {
    gap: hp(1.5),
  },
  actions: {
    marginTop: hp(3),
  },
  cancelBtn: {
    marginTop: hp(1.5),
    alignItems: 'center',
  },
  cancelText: {
    color: colors.secondary,
    fontWeight: '600',
  },
});

