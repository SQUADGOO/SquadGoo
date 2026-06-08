import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import RbSheetComponent from '@/core/RbSheetComponent';
import { IDENTITY_PROOF } from '@/utilities/appData';

const IdentityProofSelector = ({ onSelect, selectedValue, placeholder = 'Select identity proof' }) => {
  const sheetRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredList = IDENTITY_PROOF.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = () => {
    setSearchQuery('');
    sheetRef.current?.open();
  };

  const handleSelect = (item) => {
    onSelect && onSelect(item);
    sheetRef.current?.close();
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedValue === item;
    
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
          {item}
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

  return (
    <>
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.7}>
        <View pointerEvents="none">
          <AppInputField
            placeholder={placeholder}
            value={selectedValue || ''}
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

      <RbSheetComponent ref={sheetRef} height={hp(80)}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <AppText variant={Variant.subTitle} style={styles.headerTitle}>
              Select Identity Proof
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

          <AppInputField
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            endIcon={
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="search"
                size={20}
                color={colors.gray}
              />
            }
          />

          <View style={styles.listWrapper}>
            <FlatList
              data={filteredList}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
          </View>
        </View>
      </RbSheetComponent>
    </>
  );
};

export default IdentityProofSelector;

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    minHeight: hp(80),
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
  searchInput: {
    marginBottom: hp(2),
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
});

