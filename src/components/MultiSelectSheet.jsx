import React, { useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors, getFontSize, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppInputField from '@/core/AppInputField'
import RbSheetComponent from '@/core/RbSheetComponent'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'

/**
 * Generic multi-select bottom sheet with optional "specify" items.
 *
 * option shape:
 *  { key: string, title: string, requiresText?: boolean, textPlaceholder?: string }
 *
 * selectedItems shape:
 *  { key: string, title: string, specifyText?: string }
 */
const MultiSelectSheet = ({
  title = 'Select options',
  options = [],
  placeholder = 'Select',
  selectedItems = [],
  onChange,
}) => {
  const sheetRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('list') // 'list' | 'specify'
  const [specifyOption, setSpecifyOption] = useState(null)
  const [specifyText, setSpecifyText] = useState('')

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => String(o.title).toLowerCase().includes(q))
  }, [options, searchQuery])

  const open = () => {
    setSearchQuery('')
    setView('list')
    setSpecifyOption(null)
    setSpecifyText('')
    sheetRef.current?.open()
  }

  const close = () => {
    sheetRef.current?.close()
  }

  const isSelected = (opt) =>
    selectedItems?.some((s) => s.key === opt.key) || false

  const toggle = (opt) => {
    const currentlySelected = isSelected(opt)
    let next
    if (currentlySelected) {
      next = selectedItems.filter((s) => s.key !== opt.key)
    } else {
      next = [...selectedItems, { key: opt.key, title: opt.title }]
    }
    onChange && onChange(next)
  }

  const handlePressOption = (opt) => {
    if (opt.requiresText) {
      const existing = selectedItems.find((s) => s.key === opt.key)
      setSpecifyOption(opt)
      setSpecifyText(existing?.specifyText || '')
      setView('specify')
      return
    }
    toggle(opt)
  }

  const handleConfirmSpecify = () => {
    if (!specifyOption) return
    const text = specifyText.trim()
    if (!text) return

    const base = { key: specifyOption.key, title: specifyOption.title, specifyText: text }
    const without = selectedItems.filter((s) => s.key !== specifyOption.key)
    onChange && onChange([...without, base])
    setView('list')
    setSpecifyOption(null)
    setSpecifyText('')
  }

  const displayValue = useMemo(() => {
    if (!selectedItems || selectedItems.length === 0) return ''
    if (selectedItems.length === 1) {
      const s = selectedItems[0]
      return s.specifyText ? `${s.title}: ${s.specifyText}` : s.title
    }
    return `${selectedItems.length} selected`
  }, [selectedItems])

  const renderItem = ({ item }) => {
    const selected = isSelected(item)
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handlePressOption(item)}
        activeOpacity={0.7}
      >
        <AppText
          variant={Variant.body}
          style={[styles.optionText, selected && styles.selectedText]}
        >
          {item.title}
        </AppText>
        {item.requiresText ? (
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="chevron-forward"
            size={20}
            color={colors.gray}
          />
        ) : selected ? (
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="checkmark"
            size={24}
            color={colors.primary}
          />
        ) : null}
      </TouchableOpacity>
    )
  }

  return (
    <>
      <TouchableOpacity onPress={open} activeOpacity={0.7}>
        <View pointerEvents="none">
          <AppInputField
            placeholder={placeholder}
            value={displayValue}
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

      <RbSheetComponent ref={sheetRef} height={hp(90)}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            {view === 'specify' ? (
              <TouchableOpacity
                onPress={() => {
                  setView('list')
                  setSpecifyOption(null)
                  setSpecifyText('')
                }}
                style={styles.backButton}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="arrow-back"
                  size={24}
                  color={colors.black}
                />
              </TouchableOpacity>
            ) : null}

            <AppText variant={Variant.subTitle} style={styles.headerTitle}>
              {view === 'specify' ? 'Please specify' : title}
            </AppText>

            <TouchableOpacity onPress={close} style={styles.closeButton}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>

          {view === 'list' ? (
            <>
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

              <FlatList
                data={filteredOptions}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ maxHeight: hp(58) }}
                contentContainerStyle={{ paddingBottom: hp(2) }}
              />

              <TouchableOpacity
                style={styles.doneBtn}
                activeOpacity={0.8}
                onPress={close}
              >
                <AppText variant={Variant.bodyMedium} style={styles.doneText}>
                  {selectedItems.length > 0 ? `Done (${selectedItems.length} selected)` : 'Done'}
                </AppText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <AppInputField
                placeholder={specifyOption?.textPlaceholder || 'Type here'}
                value={specifyText}
                onChangeText={setSpecifyText}
              />
              <TouchableOpacity
                style={styles.confirmBtn}
                activeOpacity={0.8}
                onPress={handleConfirmSpecify}
              >
                <AppText variant={Variant.bodyMedium} style={styles.confirmText}>
                  Confirm
                </AppText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </RbSheetComponent>
    </>
  )
}

export default MultiSelectSheet

const styles = StyleSheet.create({
  sheetContainer: {
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
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: wp(1),
  },
  backButton: {
    padding: wp(1),
  },
  searchInput: {
    marginBottom: hp(2),
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
  confirmBtn: {
    marginTop: hp(2),
    backgroundColor: colors.primary,
    paddingVertical: hp(1.6),
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: colors.white,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.6),
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: hp(3),
  },
  doneText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: getFontSize(16),
  },
})

