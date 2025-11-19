import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import RbSheetComponent from '@/core/RbSheetComponent';
import { USER_TITLES } from '@/utilities/appData';

const TitleSelector = ({ onSelect, selectedValue, placeholder = 'Select title' }) => {
  const sheetRef = useRef(null);
  const [otherValue, setOtherValue] = useState('');
  const [tempSelected, setTempSelected] = useState(null);

  const handleOpen = () => {
    setTempSelected(null);
    setOtherValue('');
    sheetRef.current?.open();
  };

  const handleSelect = (item) => {
    if (item.title === 'Other') {
      setTempSelected({ ...item, customValue: otherValue });
    } else {
      setTempSelected(item);
      handleConfirm(item);
    }
  };

  const handleConfirm = (item) => {
    if (item?.title === 'Other' && otherValue.trim()) {
      onSelect && onSelect({ ...item, customValue: otherValue.trim() });
    } else if (item?.title !== 'Other') {
      onSelect && onSelect(item);
    }
    sheetRef.current?.close();
  };

  const renderItem = ({ item }) => {
    const isSelected = tempSelected?.id === item.id || selectedValue?.id === item.id;
    
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleSelect(item)}
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
    if (selectedValue?.title === 'Other' && selectedValue?.customValue) {
      return selectedValue.customValue;
    }
    return selectedValue?.title || placeholder;
  };

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

      <RbSheetComponent ref={sheetRef} height={hp(60)}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <AppText variant={Variant.subTitle} style={styles.headerTitle}>
              Select Title
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

          <FlatList
            data={USER_TITLES}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />

          {tempSelected?.title === 'Other' && (
            <View style={styles.otherInputContainer}>
              <AppInputField
                label="Enter custom title"
                placeholder="Type your title"
                value={otherValue}
                onChangeText={setOtherValue}
                style={styles.otherInput}
              />
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !otherValue.trim() && styles.confirmButtonDisabled,
                ]}
                onPress={() => handleConfirm(tempSelected)}
                disabled={!otherValue.trim()}
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

export default TitleSelector;

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
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
  listContent: {
    paddingBottom: hp(2),
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
  otherInputContainer: {
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

