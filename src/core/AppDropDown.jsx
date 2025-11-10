import React, { useState } from 'react'
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  Dimensions 
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'

const AppDropDown = ({
  placeholder = "Select option",
  options = [],
  selectedValue,
  onSelect,
  style,
  dropdownStyle,
  disabled = false,
  maxHeight = hp(30),
  showChevron = true,
  chevronColor,
  isVisible,
  setIsVisible,
}) => {

  const selectedOption = options.find(option => option.value === selectedValue)

  const handleToggle = () => {
    if (!disabled) {
      setIsVisible(!isVisible)
    }
  }

  const handleSelect = (option) => {
    onSelect && onSelect(option.value, option)
    setIsVisible(false)
  }

  const renderOption = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedValue === item.value && styles.selectedOption,
        index === options.length - 1 && styles.lastOption
      ]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <AppText 
        variant={Variant.body} 
        style={[
          styles.optionText,
          selectedValue === item.value && styles.selectedOptionText
        ]}
      >
        {item.label}
      </AppText>
      
      {selectedValue === item.value && (
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="checkmark"
          size={18}
          color={colors.primary || '#FF6B35'}
        />
      )}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={[styles.dropdownButton, style, disabled && styles.disabledButton]}
        onPress={handleToggle}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <AppText 
          variant={Variant.body} 
          style={[
            styles.buttonText,
            !selectedOption && styles.placeholderText,
            disabled && styles.disabledText
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {selectedOption ? selectedOption.label : placeholder}
        </AppText>
        
        {showChevron && (
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName={isVisible ? "chevron-up" : "chevron-down"}
            size={20}
            color={chevronColor || (disabled ? colors.gray : colors.black)}
          />
        )}
      </TouchableOpacity>

      {/* Dropdown List - Positioned View */}
      {isVisible && (
        <View 
          style={[
            styles.dropdownList,
            dropdownStyle,
            { maxHeight: maxHeight }
          ]}
        >
          {options.length > 0 ? (
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item, index) => `${item.value}_${index}`}
              showsVerticalScrollIndicator={false}
              bounces={false}
              nestedScrollEnabled={true}
            />
          ) : (
            <View style={styles.noOptionsContainer}>
              <AppText variant={Variant.body} style={styles.noOptionsText}>
                No options available
              </AppText>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default AppDropDown

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white || '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    minHeight: hp(5),
  },
  disabledButton: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    opacity: 0.6,
  },
  buttonText: {
    flex: 1,
    color: colors.black,
    fontSize: getFontSize(13),
  },
  placeholderText: {
    color: colors.gray || '#9CA3AF',
  },
  disabledText: {
    color: colors.gray || '#9CA3AF',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 2,
    right: 0,
    backgroundColor: colors.white || '#FFFFFF',
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    marginTop: hp(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: colors.primary + '10' || '#FF6B3510',
  },
  optionText: {
    color: colors.black,
    fontSize: getFontSize(14),
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary || '#FF6B35',
    fontWeight: '500',
  },
  noOptionsContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  noOptionsText: {
    color: colors.gray,
  },
})