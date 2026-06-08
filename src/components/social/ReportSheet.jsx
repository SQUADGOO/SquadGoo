import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RbSheetComponent from '@/core/RbSheetComponent';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import {REPORT_REASONS as DEFAULT_REASONS} from './constants';

const ReportSheet = forwardRef(
  (
    {
      title = 'Report',
      subtitle = 'Tell us what’s wrong. Admin will review it.',
      reasons = DEFAULT_REASONS,
      onSubmit,
    },
    ref,
  ) => {
    const sheetRef = useRef(null);
    const [target, setTarget] = useState(null);
    const [reasonId, setReasonId] = useState(null);
    const [note, setNote] = useState('');

    useImperativeHandle(ref, () => ({
      open: (targetPayload = null) => {
        setTarget(targetPayload);
        setReasonId(null);
        setNote('');
        sheetRef.current?.open();
      },
      close: () => sheetRef.current?.close(),
    }));

    const selectedReason = reasons.find(r => r.id === reasonId);
    const canSubmit = !!reasonId;

    const handleSubmit = () => {
      if (!canSubmit) return;
      onSubmit?.({
        reasonId,
        reasonLabel: selectedReason?.label,
        note: note.trim(),
        target,
        createdAt: new Date().toISOString(),
      });
      sheetRef.current?.close();
    };

    const renderReason = ({item}) => {
      const isSelected = item.id === reasonId;
      return (
        <TouchableOpacity
          style={styles.reasonRow}
          activeOpacity={0.7}
          onPress={() => setReasonId(item.id)}>
          <AppText
            variant={Variant.body}
            style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
            {item.label}
          </AppText>
          <View
            style={[
              styles.radioOuter,
              isSelected && styles.radioOuterSelected,
            ]}>
            {isSelected ? <View style={styles.radioInner} /> : null}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <RbSheetComponent ref={sheetRef} height={hp(72)}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AppText variant={Variant.subTitle} style={styles.title}>
              {title}
            </AppText>
            <TouchableOpacity
              onPress={() => sheetRef.current?.close()}
              hitSlop={8}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={22}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>

          {subtitle ? (
            <AppText variant={Variant.caption} style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}

          <FlatList
            data={reasons}
            keyExtractor={x => x.id}
            renderItem={renderReason}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <AppText variant={Variant.boldCaption} style={styles.noteLabel}>
            Add a note (optional)
          </AppText>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="More details to help admin review…"
            placeholderTextColor={colors.gray}
            style={styles.noteInput}
            textAlignVertical="top"
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}>
            <AppText variant={Variant.bodyMedium} style={styles.submitText}>
              Submit report
            </AppText>
          </TouchableOpacity>
        </View>
      </RbSheetComponent>
    );
  },
);

export default memo(ReportSheet);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.2),
    paddingBottom: hp(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  title: {
    color: colors.black,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.gray,
    marginBottom: hp(1.2),
  },
  list: {
    maxHeight: hp(32),
    marginBottom: hp(1),
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.4),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reasonText: {
    color: colors.textPrimary,
    flex: 1,
  },
  reasonTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D5D7DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  noteLabel: {
    color: colors.grayLabel,
    marginTop: hp(1),
    marginBottom: hp(0.6),
  },
  noteInput: {
    minHeight: hp(10),
    borderWidth: 1,
    borderColor: colors.gray02,
    borderRadius: hp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    fontSize: getFontSize(14),
    color: colors.black,
    backgroundColor: colors.white,
    marginBottom: hp(2),
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.6),
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: colors.gray02,
  },
  submitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: getFontSize(15),
  },
});
