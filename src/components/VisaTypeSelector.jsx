import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import RbSheetComponent from '@/core/RbSheetComponent';
import { VISA_TYPES } from '@/utilities/appData';

const VisaTypeSelector = ({ onSelect, selectedValue, placeholder = 'Select visa type' }) => {
  const sheetRef = useRef(null);
  const [tempSelected, setTempSelected] = useState(null);
  const [otherValue, setOtherValue] = useState('');

  const handleOpen = () => {
    setTempSelected(null);
    setOtherValue('');
    sheetRef.current?.open();
  };

  const handleVisaSelect = (visa) => {
    if (visa.isOther) {
      setTempSelected(visa);
    } else {
      onSelect &&
        onSelect({
          visaType: visa.title,
          requiresSubclass: !!visa.requiresSubclass,
          displayValue: visa.title,
          customValue: null,
        });
      sheetRef.current?.close();
    }
  };

  const handleConfirm = (visa) => {
    if (!visa?.isOther) return;
    if (!otherValue.trim()) return;

    const specified = otherValue.trim();
    const displayValue = `${visa.title}: ${specified}`;
    onSelect &&
      onSelect({
        visaType: visa.title,
        requiresSubclass: !!visa.requiresSubclass,
        displayValue,
        customValue: specified,
      });
    sheetRef.current?.close();
  };

  const renderItem = ({ item }) => {
    const isSelected =
      tempSelected?.id === item.id ||
      selectedValue === item.title ||
      (typeof selectedValue === 'string' && selectedValue.startsWith(`${item.title}:`));
    
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleVisaSelect(item)}
        activeOpacity={0.7}
      >
        <AppText
          variant={Variant.body}
          style={[styles.optionText, isSelected && styles.selectedText]}
        >
          {item.title}
        </AppText>
        {isSelected && (
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="checkmark"
            size={24}
            color={colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };

  const displayValue = () => {
    return selectedValue || placeholder;
  };

  const showOtherInput = !!tempSelected?.isOther;
  const canConfirm = showOtherInput ? otherValue.trim() : false;

  return (
    <>
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.7}>
        <View pointerEvents="none">
          <AppInputField
            placeholder={placeholder}
            value={displayValue()}
            editable={false}
            endIcon={
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chevron-down"
                size={20}
                color={colors.gray}
              />
            }
          />
        </View>
      </TouchableOpacity>

      <RbSheetComponent ref={sheetRef} height={hp(70)}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <AppText variant={Variant.subTitle} style={styles.headerTitle}>
              Select Visa Type
            </AppText>
            <TouchableOpacity
              onPress={() => sheetRef.current?.close()}
              style={styles.closeButton}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.listWrapper}>
            <FlatList
              data={VISA_TYPES}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
          </View>

          {showOtherInput && (
            <View style={styles.inputContainer}>
              <AppInputField
                label="Enter visa type"
                placeholder="Type your visa type"
                value={otherValue}
                onChangeText={setOtherValue}
                style={styles.otherInput}
              />
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !canConfirm && styles.confirmButtonDisabled,
                ]}
                onPress={() => handleConfirm(tempSelected)}
                disabled={!canConfirm}
              >
                <AppText variant={Variant.bodySemiBold} style={styles.confirmButtonText}>
                  Confirm
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </RbSheetComponent>
    </>
  );
};

export default VisaTypeSelector;

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    minHeight: hp(70),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
    marginBottom: hp(2),
  },
  headerTitle: {
    color: colors.black,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: wp(1),
  },
  listWrapper: {
    flex: 1,
    minHeight: hp(40),
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: hp(2),
    flexGrow: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  optionText: {
    fontSize: getFontSize(16),
    color: colors.textPrimary,
    flex: 1,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '500',
  },
  inputContainer: {
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8 || '#E5E7EB',
  },
  otherInput: {
    marginBottom: hp(2),
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: hp(1),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  confirmButtonDisabled: {
    backgroundColor: colors.grayE8 || '#E5E7EB',
    opacity: 0.5,
  },
  confirmButtonText: {
    color: colors.white,
  },
});

