import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import RbSheetComponent from '@/core/RbSheetComponent';
import { QUALIFICATIONS, DRIVING_LICENSE_TYPES } from '@/utilities/appData';

const QualificationSelector = ({ onSelect, selectedQualifications = [], placeholder = 'Select qualifications' }) => {
  const sheetRef = useRef(null);
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'drivingLicense'
  const [selectedQual, setSelectedQual] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [otherValue, setOtherValue] = useState('');

  const filteredQualifications = QUALIFICATIONS.filter(qual =>
    qual.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = () => {
    setCurrentView('main');
    setSelectedQual(null);
    setSearchQuery('');
    setOtherValue('');
    sheetRef.current?.open();
  };

  const handleQualificationSelect = (qualification) => {
    if (qualification.title === 'Other') {
      setSelectedQual(qualification);
      setCurrentView('other');
    } else if (qualification.hasSubMenu && qualification.title === 'Driving License') {
      setSelectedQual(qualification);
      setSearchQuery('');
      setCurrentView('drivingLicense');
    } else {
      toggleQualification(qualification);
    }
  };

  const toggleQualification = (qualification) => {
    const isSelected = selectedQualifications.some(
      sel => sel.id === qualification.id || (sel.title === qualification.title && sel.id === qualification.id)
    );
    
    let updated;
    if (isSelected) {
      updated = selectedQualifications.filter(
        sel => !(sel.id === qualification.id || (sel.title === qualification.title && sel.id === qualification.id))
      );
    } else {
      updated = [...selectedQualifications, qualification];
    }
    
    onSelect && onSelect(updated);
  };

  const handleDrivingLicenseSelect = (licenseType) => {
    const drivingLicenseQual = {
      ...selectedQual,
      subType: licenseType,
      displayTitle: `Driving License - ${licenseType}`,
    };
    toggleQualification(drivingLicenseQual);
    setCurrentView('main');
    setSelectedQual(null);
  };

  const handleOtherConfirm = () => {
    if (otherValue.trim()) {
      const otherQual = {
        ...selectedQual,
        customValue: otherValue.trim(),
        displayTitle: otherValue.trim(),
      };
      toggleQualification(otherQual);
      setCurrentView('main');
      setSelectedQual(null);
      setOtherValue('');
    }
  };

  const handleBack = () => {
    if (currentView === 'drivingLicense' || currentView === 'other') {
      setCurrentView('main');
      setSelectedQual(null);
      setSearchQuery('');
      setOtherValue('');
    }
  };

  const renderQualificationItem = ({ item }) => {
    const isSelected = selectedQualifications.some(
      sel => sel.id === item.id || (sel.title === item.title && sel.id === item.id)
    );
    
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleQualificationSelect(item)}
        activeOpacity={0.7}
      >
        <AppText
          variant={Variant.body}
          style={[styles.optionText, isSelected && styles.selectedText]}
        >
          {item.title}
        </AppText>
        {item.hasSubMenu && (
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="chevron-forward"
            size={20}
            color={colors.gray}
          />
        )}
        {isSelected && !item.hasSubMenu && (
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

  const renderDrivingLicenseItem = ({ item }) => {
    const isSelected = selectedQualifications.some(
      sel => sel.subType === item && sel.title === 'Driving License'
    );
    
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleDrivingLicenseSelect(item)}
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

  const displayValue = () => {
    if (selectedQualifications.length === 0) {
      return placeholder;
    }
    if (selectedQualifications.length === 1) {
      return selectedQualifications[0].displayTitle || selectedQualifications[0].title;
    }
    return `${selectedQualifications.length} qualifications selected`;
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

      <RbSheetComponent ref={sheetRef} height={hp(80)}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            {(currentView === 'drivingLicense' || currentView === 'other') && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="arrow-back"
                  size={24}
                  color={colors.black}
                />
              </TouchableOpacity>
            )}
            <AppText variant={Variant.subTitle} style={styles.headerTitle}>
              {currentView === 'main' ? 'Select Qualifications' : 
               currentView === 'other' ? 'Enter Qualification' : 
               'Select Driving License Type'}
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

          {currentView !== 'other' && (
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
          )}

          {currentView === 'main' && (
            <View style={styles.listWrapper}>
              <FlatList
                data={filteredQualifications}
                renderItem={renderQualificationItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                style={styles.list}
              />
            </View>
          )}

          {currentView === 'drivingLicense' && (
            <View style={styles.listWrapper}>
              <FlatList
                data={DRIVING_LICENSE_TYPES}
                renderItem={renderDrivingLicenseItem}
                keyExtractor={(item, index) => `${item}-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                style={styles.list}
              />
            </View>
          )}

          {currentView === 'other' && (
            <View style={styles.otherContainer}>
              <AppInputField
                label="Enter qualification"
                placeholder="Type your qualification"
                value={otherValue}
                onChangeText={setOtherValue}
                style={styles.otherInput}
              />
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !otherValue.trim() && styles.confirmButtonDisabled,
                ]}
                onPress={handleOtherConfirm}
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

export default QualificationSelector;

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
    alignItems: 'center',
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
    marginBottom: hp(2),
  },
  backButton: {
    padding: wp(1),
    marginRight: wp(2),
  },
  headerTitle: {
    flex: 1,
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
  otherContainer: {
    flex: 1,
    paddingTop: hp(2),
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
  },
  confirmButtonDisabled: {
    backgroundColor: colors.grayE8 || '#E5E7EB',
    opacity: 0.5,
  },
  confirmButtonText: {
    color: colors.white,
  },
});

