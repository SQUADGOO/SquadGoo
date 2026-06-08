import React, { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppInputField from '@/core/AppInputField'

const BottomDataSheet = ({ navigation, optionsData, onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  const filteredOptions = optionsData.filter(option =>
    option?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelection = (item) => {
    setSelectedItems(item)
    // setSelectedItems(prev => {
    //   if (prev.includes(item.title)) {
    //     return prev.filter(selected => selected !== item.title)
    //   } else {
    //     return [...prev, item.title]
    //   }
    // })
  }

  const handleSelect = () => {
    console.log('Selected items:', selectedItems)
    onSelect && onSelect(selectedItems)
    onClose()
    // Handle selection and navigate back or to next screen
    // navigation.goBack()
  }

  const renderOptionItem = ({ item }) => {
    const isSelected = selectedItems?.title == item?.title
    
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => toggleSelection(item)}
        activeOpacity={0.7}
      >
        <AppText 
          variant={Variant.body} 
          style={[
            styles.optionText,
            isSelected && styles.selectedText
          ]}
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
    )
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
     <AppInputField
        // style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor={colors.gray}
        value={searchQuery}
        onChangeText={setSearchQuery}
        endIcon={
          <VectorIcons
          name={iconLibName.Ionicons}
          iconName="search"
          size={20}
          color={colors.gray}
        />
        }
      />

      {/* Options List */}
      <FlatList
        data={filteredOptions}
        renderItem={renderOptionItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        // style={styles.optionsList}
        contentContainerStyle={styles.listContent}
      />

      {/* Select Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          text="Select"
          onPress={handleSelect}
          bgColor={colors.primary}
          textColor="#FFFFFF"
          // style={styles.selectButton}
        />
      </View>
    </View>
  )
}

export default BottomDataSheet

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '100%',
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(7),
    paddingVertical: hp(2),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginBottom: hp(3),
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(16),
    color: colors.black,
    paddingVertical: 0, // Remove default padding
  },
  searchIcon: {
    marginLeft: wp(2),
  },
  optionsList: {
    flex: 1,
  },
  listContent: {
    // paddingBottom: hp(2),
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
    fontSize: getFontSize(14),
    color: colors.textPrimary,
    flex: 1,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingVertical: hp(2),
    // paddingBottom: hp(4),
  },
  selectButton: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },
})