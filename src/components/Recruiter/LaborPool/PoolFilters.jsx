import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { hp, wp } from '@/theme';
import AppDropDown from '@/core/AppDropDown';
import AppText, { Variant } from '@/core/AppText';

/**
 * Reusable filter UI for pool-style lists.
 *
 * Props:
 * - query: string
 * - onChangeQuery: (text: string) => void
 * - filters: Array<{ key: string, placeholder: string, options: Array<{label,value}>, value: any, onChange: (value) => void }>
 * - sort: { placeholder?: string, options: Array<{label,value}>, value: any, onChange: (value) => void } | null
 * - resultCount: number
 * - onClear: () => void
 */
const PoolFilters = ({
  query,
  onChangeQuery,
  filters = [],
  sort = null,
  resultCount = 0,
  onClear,
}) => {
  // Track dropdown visibility internally so screens don't need boilerplate state
  const [openKey, setOpenKey] = useState(null);

  const rows = useMemo(() => {
    const items = [...filters];
    if (sort) items.push({ key: '__sort__', placeholder: sort.placeholder || 'Sort', ...sort });

    const out = [];
    for (let i = 0; i < items.length; i += 2) out.push(items.slice(i, i + 2));
    return out;
  }, [filters, sort]);

  return (
    <View style={styles.filtersCard}>
      <TextInput
        placeholder="Search by name, suburb, job, specialty..."
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={onChangeQuery}
        style={styles.searchInput}
      />

      {rows.map((row, idx) => (
        <View key={`row_${idx}`} style={styles.filterRow}>
          {row.map((item) => (
            <AppDropDown
              key={item.key}
              placeholder={item.placeholder}
              options={item.options || []}
              selectedValue={item.value}
              onSelect={(v) => item.onChange?.(v)}
              isVisible={openKey === item.key}
              setIsVisible={(visible) => setOpenKey(visible ? item.key : null)}
              style={styles.dropDown}
            />
          ))}
          {row.length === 1 ? <View style={styles.dropDown} /> : null}
        </View>
      ))}

      <View style={styles.filterFooter}>
        <AppText variant={Variant.caption} style={styles.resultsText}>
          {resultCount} result{resultCount === 1 ? '' : 's'}
        </AppText>

        <TouchableOpacity onPress={onClear} activeOpacity={0.8} style={styles.clearBtn}>
          <AppText variant={Variant.bodyMedium} style={styles.clearBtnText}>
            Clear
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PoolFilters;

const styles = StyleSheet.create({
  filtersCard: {
    marginHorizontal: wp(4),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    backgroundColor: '#fff',
    borderRadius: hp(1.5),
    padding: wp(3.5),
  },
  searchInput: {
    height: hp(5.5),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: hp(1.2),
    paddingHorizontal: wp(3),
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    gap: wp(2.5),
    marginTop: hp(1),
  },
  dropDown: {
    flex: 1,
  },
  filterFooter: {
    marginTop: hp(1.2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsText: {
    color: '#6B7280',
  },
  clearBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(1.2),
    backgroundColor: '#F3F4F6',
  },
  clearBtnText: {
    color: '#111827',
  },
});


