import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import RbSheetComponent from '@/core/RbSheetComponent';
import { JOB_CATEGORIES } from '@/utilities/appData';

const JobCategorySelector = ({ onSelect, selectedCategory, selectedSubCategory, placeholder = 'Select job category' }) => {
  const sheetRef = useRef(null);
  const [currentView, setCurrentView] = useState('category'); // 'category' or 'subcategory'
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [otherValue, setOtherValue] = useState('');

  const categories = Object.keys(JOB_CATEGORIES);
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = () => {
    setCurrentView('category');
    setSelectedCat(null);
    setSearchQuery('');
    setOtherValue('');
    console.log('Opening job category selector, categories count:', categories.length);
    console.log('Categories:', categories.slice(0, 5));
    console.log('JOB_CATEGORIES:', JOB_CATEGORIES ? 'Loaded' : 'Not loaded');
    sheetRef.current?.open();
  };

  const handleCategorySelect = (category) => {
    if (category === 'Others') {
      setSelectedCat('Others');
      setCurrentView('other');
    } else {
      setSelectedCat(category);
      setSearchQuery('');
      setCurrentView('subcategory');
    }
  };

  const handleSubCategorySelect = (subCategory) => {
    onSelect && onSelect({
      category: selectedCat,
      subCategory: subCategory,
    });
    sheetRef.current?.close();
  };

  const handleOtherConfirm = () => {
    if (otherValue.trim()) {
      onSelect && onSelect({
        category: 'Others',
        subCategory: otherValue.trim(),
      });
      sheetRef.current?.close();
    }
  };

  const handleBack = () => {
    if (currentView === 'subcategory' || currentView === 'other') {
      setCurrentView('category');
      setSelectedCat(null);
      setSearchQuery('');
      setOtherValue('');
    }
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory === item;
    
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleCategorySelect(item)}
        activeOpacity={0.7}
      >
        <AppText
          variant={Variant.body}
          style={[styles.optionText, isSelected && styles.selectedText]}
        >
          {item}
        </AppText>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="chevron-forward"
          size={20}
          color={colors.gray}
        />
      </TouchableOpacity>
    );
  };

  const renderSubCategoryItem = ({ item }) => {
    const isSelected = selectedSubCategory === item;
    
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleSubCategorySelect(item)}
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
    if (selectedSubCategory) {
      return `${selectedCategory} - ${selectedSubCategory}`;
    }
    if (selectedCategory) {
      return selectedCategory;
    }
    return placeholder;
  };

  const getSubCategories = () => {
    if (!selectedCat || selectedCat === 'Others') return [];
    return JOB_CATEGORIES[selectedCat] || [];
  };

  const filteredSubCategories = getSubCategories().filter(sub =>
    sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {(currentView === 'subcategory' || currentView === 'other') && (
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
              {currentView === 'category' ? 'Select Category' : 
               currentView === 'other' ? 'Enter Job Title' : 
               `Select Sub Category - ${selectedCat}`}
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

          {currentView === 'category' && (
            <View style={styles.listWrapper}>
              {filteredCategories.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <AppText variant={Variant.body} style={styles.emptyText}>
                    No categories found
                  </AppText>
                </View>
              ) : (
                <FlatList
                  data={filteredCategories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                  style={styles.list}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <AppText variant={Variant.body} style={styles.emptyText}>
                        No categories found
                      </AppText>
                    </View>
                  }
                />
              )}
            </View>
          )}

          {currentView === 'subcategory' && (
            <FlatList
              data={filteredSubCategories}
              renderItem={renderSubCategoryItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
          )}

          {currentView === 'other' && (
            <View style={styles.otherContainer}>
              <AppInputField
                label="Enter job title"
                placeholder="Type your job title"
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

export default JobCategorySelector;

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  emptyText: {
    color: colors.gray,
    fontSize: getFontSize(16),
  },
});

